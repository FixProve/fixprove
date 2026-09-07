"""Tiny status-page fetcher. Demo script for FixProve -- contains ONE
planted hallucination: requests.get_json() does not exist (it's a
plausible-sounding blend of requests.get(...) and response.json())."""

import requests


def fetch_status(url: str) -> dict:
    # PLANTED HALLUCINATION: requests has no top-level get_json() function.
    # The real pattern is requests.get(url).json().
    data = requests.get_json(url)
    return data


def is_healthy(status: dict) -> bool:
    return status.get("status") == "ok"


if __name__ == "__main__":
    result = fetch_status("https://example.com/health")
    print("healthy:", is_healthy(result))
