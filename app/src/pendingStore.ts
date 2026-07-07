// FixProve GitHub App — Session 2.1: Pending Check Run tracking
// =================================================================
//
// KS-TRACE: S2.1-PENDING-STORE | requirement: after creating a Check Run for
// a PR's head SHA, the App must remember (owner, repo, sha) -> check_run_id
// (+ installation id, to get the right Octokit later) until the customer's
// Action calls back with findings, possibly minutes later.
//
// ASSUMPTION (AI-logged, pending Yehor override): this session ships an
// IN-MEMORY store only. A real deployment needs a durable, multi-instance-
// safe backing store (Cloudflare KV, given the existing `web/wrangler.toml`
// scaffold, is the natural fit) since an in-memory Map does not survive a
// process restart or work across multiple edge instances. Flagged plainly
// in the Keystone Report's Known Limitations, not silently assumed away.
// | test: pendingStore.test.ts
//
// KS-TRACE: S4.3-PENDING-STORE-CORRELATION-DEFECT | fix (found live,
// Session 4.3 B5 round-trip test, autonomous-core PR #3): the original key
// was (owner, repo, sha), assuming the OIDC callback's `sha` claim would
// always equal the sha the pending Check Run was created against. This is
// FALSE for pull_request-triggered Actions runs: GitHub's OIDC token `sha`
// claim reflects `github.sha`, which for the pull_request event family is
// the ephemeral merge commit (refs/pull/<n>/merge), never the actual PR
// head sha the webhook payload provides and the Check Run is created
// against. Every callback therefore missed on lookup -- reproduced live,
// confirmed via a targeted diagnostic log ("no pending check run for this
// repository/sha") -- independent of and masked underneath the private-key
// defect fixed earlier this session. Fixed by keying on a tagged
// (owner, repo, kind, correlationId) instead: `kind: "pr"` entries
// correlate by PR number (parsed from the OIDC token's verified `ref`
// claim, refs/pull/<n>/merge -- see callbackHandler.ts), which IS stable
// and known to the webhook handler at creation time. `kind` is a discriminant
// (not just a bare PR-number key) so a future `kind: "push"` entry
// (correlating by the OIDC `sha` claim, which IS reliable for `push`-
// triggered runs, where no merge-commit indirection exists) can be added
// without a second storage-shape migration -- push events are NOT
// implemented by this fix; this is deliberately scoped to the pull_request
// path that is actually broken and actually used today (Yehor sign-off,
// Session 4.3). | test: pendingStore.test.ts

export type PendingCheckRunKind = "pr" | "push";

export interface PendingCheckRun {
  owner: string;
  repo: string;
  /** Discriminant for the correlation strategy -- see the module-level KS-TRACE above. */
  kind: PendingCheckRunKind;
  /** PR number (as a string) for kind "pr"; reserved for a commit sha for a future kind "push". */
  correlationId: string;
  /** The actual commit sha the Check Run targets. Descriptive only -- no longer part of the lookup key. */
  headSha: string;
  checkRunId: number;
  installationId: number;
  createdAt: number;
}

export interface PendingCheckRunStore {
  put(entry: PendingCheckRun): Promise<void>;
  get(owner: string, repo: string, kind: PendingCheckRunKind, correlationId: string): Promise<PendingCheckRun | undefined>;
  delete(owner: string, repo: string, kind: PendingCheckRunKind, correlationId: string): Promise<void>;
}

function key(owner: string, repo: string, kind: PendingCheckRunKind, correlationId: string): string {
  return `${owner.toLowerCase()}/${repo.toLowerCase()}#${kind}:${correlationId}`;
}

/**
 * KS-TRACE: S2.1-PENDING-STORE-MEMORY | requirement: correct put/get/delete
 * semantics, case-insensitive owner/repo matching (GitHub repo names are
 * case-insensitive for routing purposes) | test:
 * test_put_then_get_returns_entry, test_get_missing_returns_undefined,
 * test_delete_removes_entry, test_owner_repo_case_insensitive,
 * test_pr_and_push_kinds_with_same_correlation_id_do_not_collide
 */
export class InMemoryPendingCheckRunStore implements PendingCheckRunStore {
  private readonly entries = new Map<string, PendingCheckRun>();

  async put(entry: PendingCheckRun): Promise<void> {
    this.entries.set(key(entry.owner, entry.repo, entry.kind, entry.correlationId), entry);
  }

  async get(owner: string, repo: string, kind: PendingCheckRunKind, correlationId: string): Promise<PendingCheckRun | undefined> {
    return this.entries.get(key(owner, repo, kind, correlationId));
  }

  async delete(owner: string, repo: string, kind: PendingCheckRunKind, correlationId: string): Promise<void> {
    this.entries.delete(key(owner, repo, kind, correlationId));
  }
}
