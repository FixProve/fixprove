import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEmail } from "../api/_validate.js";

// #KS-TRACE: SESSION-0.3 | requirement: "a malformed email is rejected
// gracefully" | assumption: none beyond what's in _validate.ts | test: this
// file — the adversarial case named in the acceptance criteria plus
// supporting edge cases (empty, oversized, non-string, injection-shaped).

test("accepts a well-formed email and lowercases it", () => {
  const result = validateEmail("Yehor@FixProve.dev");
  assert.equal(result.ok, true);
  assert.equal(result.email, "yehor@fixprove.dev");
});

test("ADVERSARIAL: rejects a malformed email gracefully (no throw, structured error)", () => {
  const result = validateEmail("not-an-email");
  assert.equal(result.ok, false);
  assert.equal(typeof result.error, "string");
  assert.ok(result.error && result.error.length > 0);
});

test("rejects an empty string", () => {
  const result = validateEmail("");
  assert.equal(result.ok, false);
});

test("rejects whitespace-only input", () => {
  const result = validateEmail("   ");
  assert.equal(result.ok, false);
});

test("rejects a non-string payload without throwing", () => {
  assert.doesNotThrow(() => validateEmail({ malicious: true }));
  const result = validateEmail({ malicious: true });
  assert.equal(result.ok, false);
});

test("rejects an oversized email (>254 chars)", () => {
  const huge = "a".repeat(250) + "@x.com";
  const result = validateEmail(huge);
  assert.equal(result.ok, false);
});

test("rejects an email missing an @ or domain dot", () => {
  assert.equal(validateEmail("foo@bar").ok, false);
  assert.equal(validateEmail("foo.bar.com").ok, false);
});

test("does not throw on injection-shaped input (script tags, quotes)", () => {
  assert.doesNotThrow(() => validateEmail('<script>alert(1)</script>@evil.com"'));
  const result = validateEmail('<script>alert(1)</script>@evil.com"');
  // Not a valid email shape (no dot in domain part after the quote char) -> rejected.
  assert.equal(result.ok, false);
});
