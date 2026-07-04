"""
FixProve — Milestone 1, Session 1.2 — subprocess introspection worker.

Runs in its OWN process (spawned by knowledge_base.py) so that a
catastrophic failure in the target package (segfault, os._exit(), hard
crash) cannot take down the KB builder itself -- the parent only sees a
timeout or a non-zero/negative return code and degrades that one module to
a flagged entry.

Usage: python3 _kb_worker.py <module_name>
Prints one JSON object to stdout: {"status", "symbols", "callables", "flags"}
"""

import importlib
import inspect
import json
import sys


def _classify(value):
    if inspect.isclass(value):
        return "class"
    if inspect.isfunction(value):
        return "function"
    if inspect.isbuiltin(value):
        return "builtin_function_or_method"
    if inspect.ismethod(value):
        return "method"
    if inspect.ismodule(value):
        return "module"
    if callable(value):
        return "callable"
    return "other"


def _introspect(module_name: str) -> dict:
    flags = []

    # KS-TRACE: S1.2-IMPORT | requirement: a package that raises, hangs, or
    # misbehaves at import time must degrade the module's entry, not crash
    # the worker | test: test_worker_import_error_degrades_gracefully
    try:
        module = importlib.import_module(module_name)
    except BaseException as e:  # noqa: BLE001 - deliberately broad; see contract
        return {
            "status": "import-error",
            "symbols": [],
            "callables": {},
            "flags": [f"import-error:{type(e).__name__}:{e}"],
        }

    # KS-TRACE: S1.2-PUBLIC-NAMES | assumption: respect __all__ when the
    # module declares it (authoritative public surface); otherwise fall back
    # to dir() filtered to non-underscore names. A monkeypatched __all__ or
    # a __dir__ override that raises must degrade, not crash.
    # | test: test_worker_respects_dunder_all, test_worker_dir_failure_degrades
    try:
        all_attr = getattr(module, "__all__", None)
        if isinstance(all_attr, (list, tuple)) and all(isinstance(n, str) for n in all_attr):
            candidate_names = list(all_attr)
        else:
            candidate_names = [n for n in dir(module) if not n.startswith("_")]
    except BaseException as e:  # noqa: BLE001
        return {
            "status": "degraded",
            "symbols": [],
            "callables": {},
            "flags": [f"dir-failed:{type(e).__name__}:{e}"],
        }

    symbols = []
    callables_out = {}

    for name in candidate_names:
        # KS-TRACE: S1.2-GETATTR | requirement: a PEP 562 module __getattr__
        # (or a raising property/descriptor) that raises for one name must
        # not abort introspection of the rest of the module
        # | test: test_worker_module_getattr_raises_is_flagged_not_fatal
        try:
            value = getattr(module, name)
        except BaseException as e:  # noqa: BLE001
            flags.append(f"attr-access-failed:{name}:{type(e).__name__}")
            continue

        symbols.append(name)

        kind = _classify(value)
        if kind in ("class", "function", "builtin_function_or_method", "method", "callable"):
            # KS-TRACE: S1.2-SIGNATURE | requirement: inspect.signature() can
            # raise for C-extension builtins, monkeypatched __signature__,
            # etc. -- must degrade that single symbol's signature to null +
            # flag, not abort the module | test: test_worker_signature_unavailable_is_flagged
            try:
                sig = str(inspect.signature(value))
            except BaseException as e:  # noqa: BLE001
                flags.append(f"signature-unavailable:{name}:{type(e).__name__}")
                callables_out[name] = {"kind": kind, "signature": None}
            else:
                callables_out[name] = {"kind": kind, "signature": sig}

    return {
        "status": "ok",
        "symbols": sorted(symbols),
        "callables": callables_out,
        "flags": flags,
    }


def main() -> int:
    if len(sys.argv) != 2:
        print(json.dumps({"status": "worker-usage-error", "symbols": [], "callables": {}, "flags": ["expected exactly one argument: module_name"]}))
        return 0
    module_name = sys.argv[1]
    # KS-TRACE: S1.2-WORKER-OUTER-GUARD | assumption: this outer guard is
    # belt-and-suspenders on top of the per-stage try/excepts above -- it
    # exists so that ANY unanticipated exception still produces valid JSON
    # on stdout instead of an uncaught traceback + nonzero exit, which would
    # otherwise be indistinguishable from a genuine crash to the parent.
    # A real crash (os._exit, segfault, signal) cannot be caught here by
    # design -- that is what the PARENT's subprocess timeout/returncode
    # check is for. | test: test_worker_outer_guard_catches_unexpected_errors
    try:
        result = _introspect(module_name)
    except BaseException as e:  # noqa: BLE001
        result = {
            "status": "degraded",
            "symbols": [],
            "callables": {},
            "flags": [f"unexpected-worker-error:{type(e).__name__}:{e}"],
        }
    print(json.dumps(result))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
