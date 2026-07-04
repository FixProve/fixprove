"""
FixProve — Milestone 1, Session 1.3: labelled-corpus precision/recall eval.

KS-TRACE: S1.3-CORPUS-EVAL | requirement: "build a labelled corpus
(true-positives + true-negatives) and report precision/recall"
| test: this script itself IS the required deliverable; its output is
        checked by test_corpus_eval_reports_perfect_precision_recall in
        tests/test_cli.py.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from knowledge_base import build_knowledge_base
from resolver import check_paths

CORPUS_DIR = Path(__file__).resolve().parent / "corpus"


def run_eval(corpus_dir: Path = CORPUS_DIR, cache_dir: Path = None) -> dict:
    manifest = json.loads((corpus_dir / "manifest.json").read_text())
    cache_dir = cache_dir or (corpus_dir / ".fixprove_cache")
    kb = build_knowledge_base(corpus_dir / "requirements.txt", cache_dir=cache_dir, timeout_seconds=5.0)

    all_files = sorted((corpus_dir / rel).resolve() for rel in manifest)
    findings = check_paths(all_files, kb)

    actual_by_file = {}
    for f in findings:
        rel = str(Path(f["file"]).resolve().relative_to(corpus_dir.resolve()))
        actual_by_file.setdefault(rel, []).append((f["line"], f["reason"]))

    tp = fp = fn = 0
    details = []
    for rel, expected in manifest.items():
        expected_set = {(e["line"], e["reason"]) for e in expected}
        actual_set = set(actual_by_file.get(rel, []))
        file_tp = expected_set & actual_set
        file_fp = actual_set - expected_set
        file_fn = expected_set - actual_set
        tp += len(file_tp)
        fp += len(file_fp)
        fn += len(file_fn)
        details.append({"file": rel, "expected": sorted(expected_set), "actual": sorted(actual_set),
                         "false_positives": sorted(file_fp), "false_negatives": sorted(file_fn)})

    precision = tp / (tp + fp) if (tp + fp) else 1.0
    recall = tp / (tp + fn) if (tp + fn) else 1.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0

    return {
        "true_positives": tp, "false_positives": fp, "false_negatives": fn,
        "precision": precision, "recall": recall, "f1": f1,
        "details": details,
    }


if __name__ == "__main__":
    result = run_eval()
    print(json.dumps({k: v for k, v in result.items() if k != "details"}, indent=2))
    for d in result["details"]:
        status = "OK" if not d["false_positives"] and not d["false_negatives"] else "MISMATCH"
        print(f"[{status}] {d['file']}: expected={d['expected']} actual={d['actual']}")
    if result["false_positives"] or result["false_negatives"]:
        sys.exit(1)
