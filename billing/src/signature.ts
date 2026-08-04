// #KS-TRACE: B1-SIGNATURE | requirement: STRIPE-SETUP-CHECKLIST.md sec.3 --
// "webhook signature verification is non-negotiable ... the adversarial test
// case is explicitly 'a spoofed webhook must NOT grant entitlement'."
// assumption: implementing Stripe's documented `Stripe-Signature` scheme
// directly on node:crypto rather than pulling in the `stripe` npm SDK. Reasons,
// logged as an architectural decision for Yehor: (1) the deployment target is a
// Cloudflare Worker, where a zero-dependency WebCrypto/node:crypto path is the
// least fragile; (2) it keeps the whole test suite offline with no network and
// no SDK version coupling; (3) it means the security-critical code is readable
// in one file rather than trusted by reference. The cost is that this must
// track Stripe's scheme if Stripe changes it -- recorded as a known limitation.
// | test: test/signature.test.ts (9 adversarial cases)

import { createHmac, timingSafeEqual } from "node:crypto";

export interface VerifyArgs {
  /** The EXACT raw request body bytes as a string. Re-serialised JSON will not verify. */
  payload: string;
  /** The `Stripe-Signature` header value. */
  header: string | null | undefined;
  /** The endpoint's webhook signing secret (`whsec_...`). */
  secret: string;
  /** Replay window in seconds. Stripe's own libraries default to 300. */
  toleranceSeconds?: number;
  /** Injectable clock (unix seconds) so tests are deterministic. */
  nowSeconds?: number;
}

export type VerifyResult = { ok: true } | { ok: false; reason: string };

const DEFAULT_TOLERANCE_SECONDS = 300;

/**
 * Parse `t=1614556800,v1=abc...,v1=def...,v0=ignored` into its parts.
 * Multiple v1 values are legitimate: Stripe emits one per active signing
 * secret during a secret rotation, so ANY matching v1 is a valid signature.
 */
function parseHeader(header: string): { timestamp: number | null; v1: string[] } {
  let timestamp: number | null = null;
  const v1: string[] = [];
  for (const part of header.split(",")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key === "t") {
      // Reject anything that is not a clean integer; `parseInt` would happily
      // accept "123abc" and a NaN would silently pass a `<` comparison later.
      timestamp = /^\d+$/.test(value) ? Number(value) : null;
    } else if (key === "v1") {
      // #KS-TRACE: B1-DEFECT-1-FIX | defect found by test/signature.test.ts
      // "rejects garbage in the v1 slot": a header of `t=...,v1=` (empty value)
      // was pushing "" into the candidate list, so the request was reported as
      // `signature_mismatch` rather than the accurate `no_v1_signature`. Both
      // reject, so this was never a security hole -- it was a misleading
      // diagnostic that would have sent a future debugger hunting a secret
      // mismatch when the real problem was a malformed header. Empty values are
      // now dropped at parse time.
      if (value) v1.push(value);
    }
  }
  return { timestamp, v1 };
}

export function computeSignature(payload: string, secret: string, timestamp: number): string {
  return createHmac("sha256", secret).update(`${timestamp}.${payload}`, "utf8").digest("hex");
}

/**
 * #KS-TRACE: B1-CONSTANT-TIME | assumption: `timingSafeEqual` throws on
 * length mismatch, so lengths are compared first -- but the length comparison
 * itself leaks nothing useful here, because the expected length is a constant
 * (64 hex chars for SHA-256) and is therefore already public.
 */
function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  if (!/^[0-9a-f]+$/i.test(a) || !/^[0-9a-f]+$/i.test(b)) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export function verifyStripeSignature(args: VerifyArgs): VerifyResult {
  const { payload, header, secret } = args;
  const tolerance = args.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
  const now = args.nowSeconds ?? Math.floor(Date.now() / 1000);

  if (!secret) return { ok: false, reason: "no_signing_secret_configured" };
  if (!header) return { ok: false, reason: "missing_signature_header" };

  const { timestamp, v1 } = parseHeader(header);
  if (timestamp === null) return { ok: false, reason: "malformed_signature_header" };
  if (v1.length === 0) return { ok: false, reason: "no_v1_signature" };

  // #KS-TRACE: B1-REPLAY-WINDOW | requirement: a captured-and-replayed valid
  // webhook must stop working. The signature alone cannot express this -- it
  // stays valid forever -- so the timestamp tolerance IS the replay defence at
  // this layer, backed by event-id idempotency at the handler layer.
  // Rejects both directions: a stale replay AND a far-future forged timestamp.
  // | test: test/signature.test.ts "rejects a replayed payload outside tolerance"
  if (Math.abs(now - timestamp) > tolerance) {
    return { ok: false, reason: "timestamp_outside_tolerance" };
  }

  const expected = computeSignature(payload, secret, timestamp);
  for (const candidate of v1) {
    if (safeEqualHex(expected, candidate)) return { ok: true };
  }
  return { ok: false, reason: "signature_mismatch" };
}
