// #KS-TRACE: SESSION-0.3 | requirement: "a working email waitlist", deployed as
// a Worker-with-assets (this project was created as a Worker, not a classic
// Pages project - the dashboard's static-file uploader explicitly does not
// support Worker scripts, so this entry point is deployed via `wrangler deploy`
// instead). | assumption: everything under /api/* is handled here; every other
// path falls through to the static asset binding (env.ASSETS). | test:
// live POST to /api/waitlist after `wrangler deploy` (see Keystone Report).
import { validateEmail } from "../functions/api/_validate.js";

export interface Env {
  ASSETS: Fetcher;
  WAITLIST_KV: KVNamespace;
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/waitlist") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "Method not allowed." }, 405);
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "Malformed request." }, 400);
      }

      const candidate =
        body && typeof body === "object" && "email" in body
          ? (body as Record<string, unknown>).email
          : undefined;

      const result = validateEmail(candidate);
      if (!result.ok || !result.email) {
        return json({ ok: false, error: result.error }, 400);
      }

      const key = `waitlist:${result.email}`;
      const existing = await env.WAITLIST_KV.get(key);
      if (existing) {
        return json({ ok: true, message: "You're already on the list." }, 200);
      }

      await env.WAITLIST_KV.put(
        key,
        JSON.stringify({ email: result.email, ts: new Date().toISOString() })
      );

      return json({ ok: true, message: "You're on the list." }, 200);
    }

    // Everything else: serve the static Next.js export.
    return env.ASSETS.fetch(request);
  },
};
