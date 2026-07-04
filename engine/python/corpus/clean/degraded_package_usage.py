import fp_monkeypatch_demo

# This package's introspection crashes (os._exit at import time). Per the
# locked Session 1.3 decision, references into a non-"ok" module must
# NEVER be flagged, even though we genuinely cannot verify this call.
fp_monkeypatch_demo.totally_real_function()
fp_monkeypatch_demo.something_that_might_not_exist()
