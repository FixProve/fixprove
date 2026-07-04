# TS/JS Corpus Setup

Before running `eval_ts_corpus.py` or the `tests/test_ts_*.py` suite, install
the REAL npm dependencies this corpus is verified against:

```
cd engine/python/ts_corpus
npm install
```

This installs `axios`, `lodash`, and `@types/lodash` into `node_modules/`
(declared in `package.json`). These are NOT committed to the repo (npm
packages are large and reproducibly installable).

`node_modules/fp-ts-clean-demo/` and `node_modules/fp-ts-notypes-demo/` ARE
committed directly -- they are hand-built synthetic fixture packages (not
published to any registry) used to exercise re-export chains, interface
`extends` chains, and the "no bundled/DefinitelyTyped types available" KB
status, in a controlled and deterministic way that this sandbox's actually-
installed real packages didn't happen to exercise as cleanly. See
KS-REPORT-1.4-ts-resolver.md Section 2/3 for exactly which adversarial case
each real vs. synthetic package covers.
