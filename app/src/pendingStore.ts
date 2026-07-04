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

export interface PendingCheckRun {
  owner: string;
  repo: string;
  sha: string;
  checkRunId: number;
  installationId: number;
  createdAt: number;
}

export interface PendingCheckRunStore {
  put(entry: PendingCheckRun): Promise<void>;
  get(owner: string, repo: string, sha: string): Promise<PendingCheckRun | undefined>;
  delete(owner: string, repo: string, sha: string): Promise<void>;
}

function key(owner: string, repo: string, sha: string): string {
  return `${owner.toLowerCase()}/${repo.toLowerCase()}@${sha}`;
}

/**
 * KS-TRACE: S2.1-PENDING-STORE-MEMORY | requirement: correct put/get/delete
 * semantics, case-insensitive owner/repo matching (GitHub repo names are
 * case-insensitive for routing purposes) | test:
 * test_put_then_get_returns_entry, test_get_missing_returns_undefined,
 * test_delete_removes_entry, test_owner_repo_case_insensitive
 */
export class InMemoryPendingCheckRunStore implements PendingCheckRunStore {
  private readonly entries = new Map<string, PendingCheckRun>();

  async put(entry: PendingCheckRun): Promise<void> {
    this.entries.set(key(entry.owner, entry.repo, entry.sha), entry);
  }

  async get(owner: string, repo: string, sha: string): Promise<PendingCheckRun | undefined> {
    return this.entries.get(key(owner, repo, sha));
  }

  async delete(owner: string, repo: string, sha: string): Promise<void> {
    this.entries.delete(key(owner, repo, sha));
  }
}
