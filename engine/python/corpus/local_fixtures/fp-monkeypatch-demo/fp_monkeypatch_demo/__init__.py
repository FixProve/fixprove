# KS-TRACE: S4.2-CORPUS-FIXTURE-INSTALLABILITY | this module hard-exits at
# import time, on purpose, exactly like Session 1.2's own adversarial
# subprocess-isolation fixture (tests/test_knowledge_base.py's
# "boom_hard_exit.py" -> os._exit(1)). Any code importing this module and
# calling ANYTHING on it (real or hallucinated) must be silently unflagged
# by FixProve's locked Stage-1 decision: a package whose introspection
# degrades/crashes is treated strictly as "cannot verify," never flagged.
# See corpus/clean/degraded_package_usage.py and corpus/manifest.json.
import os

os._exit(1)
