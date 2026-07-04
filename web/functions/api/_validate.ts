// #KS-TRACE: SESSION-0.3 | requirement: "a malformed email is rejected gracefully"
// (adversarial acceptance criterion) | assumption: a practical, HTML5-input-spec-
// style email pattern is sufficient for a waitlist form (perfect email validation
// is undecidable without sending a verification email, which is out of scope this
// session) | test: validate.test.ts covers valid, malformed, empty, oversized,
// single-label-domain, and injection-shaped ("<script>...@evil.com\"") input.
//
// DEFECT FOUND & FIXED DURING THIS SESSION'S VERIFY STAGE: an earlier, looser
// regex (`^[^\s@]+@[^\s@]+\.[^\s@]+$`) technically ACCEPTED
// `<script>alert(1)</script>@evil.com"` as a "valid" email, because it only
// excluded whitespace and `@` — not `<`, `>`, or `"`. That is a stored-XSS risk
// if the raw value is ever rendered unescaped (e.g. in a future admin view of
// the waitlist). Replaced with the HTML Living Standard's `type=email` pattern,
// which restricts the local part to a safe character class and requires at
// least one domain-label dot.

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 4.5.3.1.3

export interface ValidationResult {
  ok: boolean;
  email?: string;
  error?: string;
}

/**
 * Validates and normalizes a candidate waitlist email. Never throws — always
 * returns a result object, so callers (the Function handler) can respond
 * gracefully instead of 500ing on bad input.
 */
export function validateEmail(raw: unknown): ValidationResult {
  if (typeof raw !== "string") {
    return { ok: false, error: "Email must be a string." };
  }
  const email = raw.trim();
  if (email.length === 0) {
    return { ok: false, error: "Please enter an email address." };
  }
  if (email.length > MAX_EMAIL_LENGTH) {
    return { ok: false, error: "That email address is too long." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  return { ok: true, email: email.toLowerCase() };
}
