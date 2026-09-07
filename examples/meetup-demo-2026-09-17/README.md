# Meetup demo examples

The two hallucination-catch examples referenced on fixprove.dev/demo.
Both independently re-verified 3x for identical, deterministic output —
see the original session's proof artifacts for the raw JSON and
transcripts (not included here, kept local to keep this directory small).

- `python-sample/fetch_status.py` — `requests.get_json()` does not exist
  (invented blend of `requests.get(url).json()`).
- `ts-sample/script.ts` — `axios.getJson()` does not exist (invented
  blend of `axios.get(url)`).
