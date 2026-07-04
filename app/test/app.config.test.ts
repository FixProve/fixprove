import { test } from "node:test";
import assert from "node:assert/strict";
import { createFixProveApp } from "../src/index.js";

// #KS-TRACE: S2.1-SCAFFOLD-UPDATE | assumption: createFixProveApp now
// returns a FixProveApp wrapper ({app, store, handleWebhookDelivery,
// handleCallback}) rather than a bare @octokit/app App instance, since
// Session 2.1 added webhook routing, Checks API, and OIDC callback
// handling. Updated this Session-0.2 scaffold test to match, and added
// callbackAudience (required as of this session) to the fixture config
// | test: this test itself
test("createFixProveApp constructs a FixProveApp wrapper from valid config", () => {
  const fixprove = createFixProveApp({
    appId: 123456,
    privateKey:
      "-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJBAK...TEST-ONLY-NOT-A-REAL-KEY...\n-----END RSA PRIVATE KEY-----",
    webhookSecret: "test-secret",
    callbackAudience: "https://fixprove.dev/callback",
  });
  assert.ok(fixprove);
  assert.ok(fixprove.app);
  assert.ok(fixprove.store);
  assert.equal(typeof fixprove.handleWebhookDelivery, "function");
  assert.equal(typeof fixprove.handleCallback, "function");
});
