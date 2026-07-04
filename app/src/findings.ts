// FixProve GitHub App — Session 2.1: Finding schema + Checks API formatting
// ===========================================================================
//
// KS-TRACE: S2.1-FINDING-SCHEMA | requirement: the App consumes EXACTLY the
// finding shape produced by engine/python/finding.py (Session 1.4's shared
// core): {file, line, kind, expression, reason}. This is deliberately the
// SAME shape across languages and now across the Python engine <-> Node App
// boundary too -- the callback payload is just this array, JSON-encoded,
// with no App-specific reshaping required upstream.
// | test: findings.test.ts

export type FindingReason =
  | "dependency-not-installed"
  | "dependency-version-mismatch"
  | "unresolved-symbol";

export interface Finding {
  file: string;
  line: number;
  kind: string;
  expression: string;
  reason: FindingReason;
}

export interface CheckAnnotation {
  path: string;
  start_line: number;
  end_line: number;
  annotation_level: "failure" | "warning" | "notice";
  message: string;
  title?: string;
}

const REASON_LABEL: Record<FindingReason, string> = {
  "dependency-not-installed": "Dependency not installed",
  "dependency-version-mismatch": "Dependency version mismatch",
  "unresolved-symbol": "Unresolved symbol",
};

/**
 * KS-TRACE: S2.1-ANNOTATIONS | requirement: every finding becomes exactly one
 * GitHub Checks annotation, at "failure" level (this engine's zero-false-
 * positive design means anything it reports IS a confirmed problem, not a
 * warning) | test: test_formats_single_finding_as_failure_annotation,
 * test_annotation_message_names_symbol_file_line
 */
export function findingToAnnotation(finding: Finding): CheckAnnotation {
  const label = REASON_LABEL[finding.reason] ?? finding.reason;
  return {
    path: finding.file,
    start_line: finding.line,
    end_line: finding.line,
    annotation_level: "failure",
    title: `FixProve: ${label}`,
    message: `${label}: \`${finding.expression}\` at ${finding.file}:${finding.line}`,
  };
}

// KS-TRACE: S2.1-ANNOTATION-CAP | assumption: GitHub's Checks API rejects a
// single update with more than 50 annotations -- callers must paginate
// multiple `update` calls for larger finding sets. This module exposes the
// raw list; batching into <=50-annotation chunks is the caller's (checkRun.ts)
// responsibility, not duplicated here | test: (checkRun.test.ts covers batching)
export const MAX_ANNOTATIONS_PER_REQUEST = 50;

export interface CheckSummary {
  conclusion: "success" | "failure";
  title: string;
  summary: string;
  annotations: CheckAnnotation[];
}

/**
 * KS-TRACE: S2.1-SUMMARY | requirement: zero findings -> a clean PASS (not
 * an error, not a "neutral" ambiguous state); one or more findings -> a
 * FAILING check whose top-level summary text ALSO names every symbol/file/
 * line (not just the annotations), since PR authors often only see the
 * summary text without expanding annotations -- this is the "billboard"
 * comment the master plan calls out as the viral distribution mechanic
 * | test: test_empty_findings_produces_passing_summary,
 * test_findings_produce_failing_summary_naming_every_symbol
 */
export function buildCheckSummary(findings: Finding[]): CheckSummary {
  if (findings.length === 0) {
    return {
      conclusion: "success",
      title: "FixProve: no unresolved symbols",
      summary: "No unresolved symbols found. This PR's referenced dependency APIs all check out.",
      annotations: [],
    };
  }

  const lines = findings.map(
    (f) => `- \`${f.expression}\` — ${REASON_LABEL[f.reason] ?? f.reason} (${f.file}:${f.line})`
  );

  return {
    conclusion: "failure",
    title: `FixProve: ${findings.length} unresolved symbol${findings.length === 1 ? "" : "s"}`,
    summary: [`FixProve found ${findings.length} unresolved symbol${findings.length === 1 ? "" : "s"}:`, "", ...lines].join("\n"),
    annotations: findings.map(findingToAnnotation),
  };
}
