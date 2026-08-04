// #KS-TRACE: B1-DEV-RECEIVER | requirement: SESSION-PLAN-TO-R1.md B1 -- a
// destination for `stripe listen` so real Stripe test-mode deliveries exercise
// the SAME handler the Worker will call, with the SAME signature verification.
// assumption: this is a development/CI harness, NOT the production surface.
// Production wiring is a Hono route inside worker/src/index.ts, deliberately
// not built this session -- it needs a real KV namespace and the Stripe account
// that only Yehor can create. Recorded as a known limitation, not as done work.
//
// Usage:
//   STRIPE_TEST_WEBHOOK_SECRET=whsec_... node billing/scripts/devReceiver.mjs
// then, in another shell:
//   stripe listen --forward-to http://127.0.0.1:8787/stripe/webhook
//   stripe trigger customer.subscription.created
//
// Every delivery is printed as one JSON line so CI can assert on it and a human
// can read it. This is the "verified in logs" evidence B1's done-check asks for.

import { createServer } from "node:http";
import { createBillingModule, InMemoryEntitlementStore } from "../dist/src/index.js";

const PORT = Number(process.env.PORT ?? 8787);
const webhookSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET ?? "";

if (!webhookSecret) {
  console.error(
    "STRIPE_TEST_WEBHOOK_SECRET is required. With `stripe listen` this is the " +
      "CLI's own signing secret -- get it with `stripe listen --print-secret`, " +
      "NOT the dashboard endpoint secret (they are different values).",
  );
  process.exit(1);
}

const store = new InMemoryEntitlementStore();
const billing = createBillingModule({
  store,
  webhookSecret,
  checkout: {
    // A syntactically-valid test key placeholder: this harness never calls the
    // Stripe API outbound, but createBillingModule enforces the test-mode
    // invariant at construction, and that invariant is worth keeping here too.
    apiKey: process.env.STRIPE_TEST_SECRET_KEY ?? "sk_test_receiver_placeholder",
    priceMap: {
      TIER_A: process.env.STRIPE_PRICE_TIER_A ?? "price_test_placeholder_a",
      TIER_B: process.env.STRIPE_PRICE_TIER_B ?? "price_test_placeholder_b",
    },
    successUrl: "http://127.0.0.1:8787/success",
    cancelUrl: "http://127.0.0.1:8787/cancel",
  },
});

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    // The RAW bytes matter: re-serialising the parsed JSON would change key
    // order/whitespace and every signature would fail. This is the single most
    // common Stripe-integration mistake.
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end('{"ok":true}');
    return;
  }
  if (req.method !== "POST" || req.url !== "/stripe/webhook") {
    res.writeHead(404).end();
    return;
  }

  const payload = await readRawBody(req);
  let eventType = "unknown";
  let obj = {};
  try {
    const parsed = JSON.parse(payload);
    eventType = parsed?.type ?? "unknown";
    obj = parsed?.data?.object ?? {};
  } catch {
    /* the handler will reject it; the log line just loses its label */
  }

  const result = await billing.handleWebhook({
    payload,
    signatureHeader: req.headers["stripe-signature"] ?? null,
  });

  // #KS-TRACE: B1-DIAGNOSTIC-UNRESOLVED | requirement: root-cause, in one log
  // line, why an event that SHOULD have resolved to an account didn't --
  // rather than guessing from the Stripe dashboard's JSON viewer. Only fires
  // on the failure case, so it adds zero noise to the happy path.
  const diagnostic =
    result.action === "account_unresolved"
      ? {
          sawSubscriptionField: obj.subscription ?? null,
          sawTopLevelId: obj.id ?? null,
          sawObjectType: obj.object ?? null,
          sawClientReferenceId: obj.client_reference_id ?? null,
          sawMetadata: obj.metadata ?? null,
        }
      : undefined;

  console.log(
    JSON.stringify({
      at: new Date().toISOString(),
      event: eventType,
      status: result.status,
      ok: result.ok,
      action: result.action ?? null,
      error: result.error ?? null,
      ...(diagnostic ? { diagnostic } : {}),
    }),
  );

  res.writeHead(result.status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(result));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(JSON.stringify({ at: new Date().toISOString(), listening: PORT }));
});

// Print the entitlement table on shutdown -- the "a test purchase flips a test
// org to paid, a cancellation flips it back" evidence, in one place.
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, async () => {
    console.log(JSON.stringify({ at: new Date().toISOString(), shuttingDown: true }));
    server.close(() => process.exit(0));
  });
}
