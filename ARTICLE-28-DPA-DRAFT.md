# Article 28 Data Processing Agreement — DRAFT SKELETON, NOT LEGALLY REVIEWED

Not in force. Not presented to any customer. This is a starting skeleton for counsel to
work from, not a document to attach to a real contract. Written 2026-08-05, Session
4.12-K, conditional on the open [COUNSEL-REVIEW] question in `PRIVACY-POLICY-DRAFT-v2.md`
§2.4 actually resolving to "processor" — if counsel instead finds joint-controller
status, this entire document needs restructuring, not just editing.

## Parties

- **Data Controller:** the business ("Customer") that installs the FixProve GitHub App
  on its repositories.
- **Data Processor:** FixProve v/ Yehor Kaliberda, CVR 46646223, Stockholmsgade 3, 1. th,
  8200 Aarhus N, Denmark (or FixProve ApS, if incorporated by the time this is executed).

## 1. Subject matter and duration

Processing occurs for as long as Customer's GitHub App installation remains active, and
is limited to what is necessary to deliver pull-request verification annotations.

## 2. Nature and purpose of processing

Correlating GitHub webhook events (owner login, repo name, PR number, head SHA, check-run
ID, installation ID) and relaying findings payloads (file paths, line numbers, issue
kind, code expressions) to produce GitHub Check Run annotations. See
`PRIVACY-POLICY-DRAFT-v2.md` §2.4 for the full factual description.

## 3. Categories of data subjects

GitHub organisation members and repository contributors whose commits, PRs, or account
identifiers appear in the processed events.

## 4. Processor obligations

FixProve shall:
1. Process personal data only on Customer's documented instructions (this DPA plus the
   ordinary operation of the GitHub App as installed).
2. Ensure personnel with access are bound by confidentiality.
3. Implement the technical measures in Annex II.
4. Not engage a sub-processor without prior notice to Customer (see Annex III for the
   current list; adding one requires updating this Annex and notifying Customer).
5. Assist Customer, to the extent reasonably possible, with data-subject rights requests
   and with any DPIA or prior-consultation obligation Customer may have.
6. Notify Customer without undue delay after becoming aware of a personal data breach
   affecting Customer's data.
7. Delete or return all personal data at the end of the provision of services, and
   delete existing copies, unless EU or Danish law requires storage.
8. Make available to Customer information necessary to demonstrate compliance with this
   Article and allow for audits, including inspections.

[COUNSEL-REVIEW: standard Art 28(3) boilerplate above needs a lawyer's pass for Danish-
market conventions and to confirm nothing here overpromises relative to what a one-person
operation can actually deliver on audit rights.]

## Annex I — Parties and processing details

As in §§1–3 above; Customer's specific installation ID and repositories are the
per-contract detail, not restated generically here.

## Annex II — Technical and organisational security measures

- Encryption in transit (TLS) for all API traffic.
- Encryption at rest (Cloudflare KV default).
- Access limited to the operator (single-person operation at present).
- Authentication via GitHub Actions OIDC tokens for the findings-relay endpoint.
- Automatic expiry of correlation records (see `LEGAL-LAUNCH-READINESS-CHECKLIST.md` §2
  — not yet implemented in code as of this draft; do not represent this as live until it
  is).

[COUNSEL-REVIEW / ENGINEERING FLAG: do not present Annex II to a real customer claiming
automatic expiry is in place until `expirationTtl` is actually deployed and verified.]

## Annex III — Sub-processors

| Sub-processor | Role |
|---|---|
| Cloudflare, Inc. | Hosting, API, KV storage |
| GitHub, Inc. | Webhook events, Check Run annotation publication |

Transfer mechanism for Cloudflare: **not yet independently verified on the live
account** — see `PRIVACY-POLICY-DRAFT-v2.md` §4. Do not represent a specific SCC module
as confirmed in this Annex until that check is done.
