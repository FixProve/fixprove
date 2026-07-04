import requests

# requests.get is actually defined in requests.api and re-exported at the
# top level -- this is the adversarial "re-exported symbol" case.
resp = requests.get("https://example.com")
resp2 = requests.post("https://example.com", data={"x": 1})
requests.Session()
