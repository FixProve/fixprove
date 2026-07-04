// FixProve GitHub App — Session 2.1: Checks API create/update
// ==============================================================
//
// KS-TRACE: S2.1-CHECKRUN | requirement: a pending Check Run is created
// eagerly on pull_request opened/synchronize/reopened (so the PR shows
// "FixProve: in progress" immediately, not silence), and later completed
// once the customer's Action posts findings back via the OIDC callback.
// | test: checkRun.test.ts
//
// This module is intentionally decoupled from any specific Octokit
// instance shape beyond the minimal method surface it actually calls,
// so tests can inject a lightweight fake rather than a full Octokit mock.

import { buildCheckSummary, MAX_ANNOTATIONS_PER_REQUEST, type Finding } from "./findings.js";

export interface ChecksClient {
  create(params: {
    owner: string;
    repo: string;
    name: string;
    head_sha: string;
    status: "queued" | "in_progress" | "completed";
    started_at?: string;
  }): Promise<{ id: number }>;

  update(params: {
    owner: string;
    repo: string;
    check_run_id: number;
    status?: "queued" | "in_progress" | "completed";
    conclusion?: "success" | "failure";
    completed_at?: string;
    output?: {
      title: string;
      summary: string;
      annotations?: unknown[];
    };
  }): Promise<void>;
}

export const CHECK_NAME = "FixProve";

// KS-TRACE: S2.1-CHECKRUN-DEFECT-001 | fix (found while designing the test
// suite, before it ever reached a live call): the original ChecksClient
// adapter assumed a real Octokit instance exposes `octokit.rest.checks.*`
// (the plugin-rest-endpoint-methods shape). It does not: `@octokit/app`'s
// default App instance wraps plain `@octokit/core`, whose dependencies
// (verified directly: `node_modules/@octokit/core/package.json` pulls in
// no `@octokit/plugin-rest-endpoint-methods`) expose ONLY the generic
// `.request(route, params)` method -- there is no `.rest` namespace unless
// the App is explicitly constructed with a plugin-augmented Octokit class,
// which this app does not do. The `.rest.checks` adapter would have
// compiled (because webhookHandler.ts/callbackHandler.ts used unsafe casts)
// while being silently broken against the real Octokit API surface at
// runtime. CAUGHT by `tsc --noEmit` the moment the unsafe casts were
// replaced with this adapter's actual declared parameter type -- exactly
// the kind of defect adversarial Verify exists to catch before production.
// Fixed by adapting through Octokit's REST-route string form instead, which
// requires no plugin and is guaranteed present on any @octokit/core
// instance | test: test_octokit_to_checks_client_uses_request_not_rest
export interface OctokitChecksLike {
  request: (route: string, params?: Record<string, unknown>) => Promise<{ data: { id: number } | unknown }>;
}

export function octokitToChecksClient(octokit: OctokitChecksLike): ChecksClient {
  return {
    async create(params) {
      const res = await octokit.request("POST /repos/{owner}/{repo}/check-runs", params);
      return { id: (res.data as { id: number }).id };
    },
    async update(params) {
      await octokit.request(
        "PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}",
        params
      );
    },
  };
}

/**
 * KS-TRACE: S2.1-CHECKRUN-CREATE | requirement: every relevant PR event
 * gets a check run at status=in_progress immediately (visible in the PR's
 * checks tab right away) | test: test_create_pending_check_run_in_progress
 */
export async function createPendingCheckRun(
  client: ChecksClient,
  params: { owner: string; repo: string; headSha: string }
): Promise<number> {
  const run = await client.create({
    owner: params.owner,
    repo: params.repo,
    name: CHECK_NAME,
    head_sha: params.headSha,
    status: "in_progress",
    started_at: new Date().toISOString(),
  });
  return run.id;
}

/**
 * KS-TRACE: S2.1-CHECKRUN-COMPLETE | requirement: findings[] (possibly
 * empty) -> exactly one conclusion (success|failure), with EVERY finding
 * represented as an annotation, batched into <=50-per-request updates
 * (GitHub's own API limit) so a large finding set can't silently drop
 * annotations past the 50th | test: test_complete_check_run_success_empty,
 * test_complete_check_run_failure_names_symbols,
 * test_complete_check_run_batches_annotations_over_fifty
 */
export async function completeCheckRun(
  client: ChecksClient,
  params: { owner: string; repo: string; checkRunId: number },
  findings: Finding[]
): Promise<void> {
  const summary = buildCheckSummary(findings);
  const batches = chunk(summary.annotations, MAX_ANNOTATIONS_PER_REQUEST);
  const batchCount = Math.max(1, batches.length);

  for (let i = 0; i < batchCount; i++) {
    const isFirst = i === 0;
    const isLast = i === batchCount - 1;
    await client.update({
      owner: params.owner,
      repo: params.repo,
      check_run_id: params.checkRunId,
      status: isLast ? "completed" : "in_progress",
      conclusion: isLast ? summary.conclusion : undefined,
      completed_at: isLast ? new Date().toISOString() : undefined,
      output: {
        title: summary.title,
        summary: isFirst ? summary.summary : `(continued, batch ${i + 1}/${batchCount})`,
        annotations: batches[i] ?? [],
      },
    });
  }
}

function chunk<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}
