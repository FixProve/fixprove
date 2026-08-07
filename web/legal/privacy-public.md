# Privacy Policy

*Last updated 2026-08-05. Drafted with AI assistance as part of a structured review
process; independent legal review in progress. This version is in effect for the free
hosted beta described herein.*

## 1. Who is responsible for your data

FixProve is an enkeltmandsvirksomhed (Danish sole proprietorship), CVR 46646223,
Stockholmsgade 3, 1. th, 8200 Aarhus N, Denmark. Because a sole proprietorship is not
a separate legal person, **Yehor Kaliberda is personally the data controller** for
everything described here.

Contact: yehor@yehor.ai

We have not appointed a Data Protection Officer. At our current scale — one operator, no
large-scale or systematic monitoring of individuals, no special-category data under
Art 9 — Article 37 GDPR does not require one.

## 2. What we actually collect

### 2.1 The website and waitlist (fixprove.dev)

The site is a static export. Submitting the waitlist form sends one HTTP POST to
`/api/waitlist`, writing a single record to a Cloudflare KV store containing your
**email address** (lowercased, trimmed, capped at 254 characters) and a **timestamp**
of signup (ISO 8601). That is the entire record — no name, IP address, referrer, or
marketing profile is written by us. We use the address only for launch-related updates
and you can withdraw consent at any time.

### 2.2 What the website does not do

No analytics, tracking pixel, advertising tag, third-party script, or cookie is set by
us anywhere on fixprove.dev — verified by searching the site source and built output for
every common tracker/storage API, with zero matches. Because there is no cookie or
equivalent client-side storage, no cookie-consent banner is required under the Danish
Cookie Order; ePrivacy consent applies to accessing or storing data on your device, not
to server-side request handling.

### 2.3 The command-line tool

The FixProve CLI and analysis engine run entirely on your own machine or CI runner. As
of this policy's date, the CLI and engine source contain no network calls, telemetry, or
reporting code — your source code is analysed locally and is never transmitted to us by
the CLI. **This is a statement about the current version.** If a future version adds any
network capability (including opt-in telemetry), we will update this policy, the
project README, and obtain any consent required before that capability is enabled by
default. The README currently states "zero LLM tokens" (meaning no model inference) —
that is a distinct claim from "zero network calls," and if we want the network-call
promise made publicly, it will be added to the README in matching language, not left
implied.

### 2.4 The GitHub App (api.fixprove.dev)

**Correlation data we store.** When a pull request event arrives, we write a record to a
Cloudflare KV store containing: the repository owner's GitHub login, repository name,
pull request number, head commit SHA, GitHub check-run ID, and installation ID, plus a
creation timestamp. For a personal repository, the owner login identifies a natural
person, so this is personal data.

**Findings data we relay.** Analysis runs inside *your* CI, not on our servers. Your CI
posts results to our endpoint, authenticated by a GitHub Actions OIDC token. Those
results contain, per issue: a file path, line number, issue kind, and the specific code
expression that could not be resolved. We use that payload immediately to create a
GitHub Check Run annotation and do not write it to our own storage. We do not claim
"your code never leaves your CI" — fragments of it (paths, line numbers, expressions) do
transit our endpoint in memory, in transit, encrypted, and are not persisted.

**Who this makes us, legally, for the installing organisation.** GDPR roles are
assessed separately for each processing activity, not as a single blanket label for
everything we do. Our working position — not yet independently confirmed — is that
where FixProve processes personal data contained in repository metadata, findings, or
annotations solely to provide the GitHub App on an installing organisation's documented
instructions, the organisation is likely the controller and FixProve likely the
processor for that specific processing. FixProve remains the controller for processing
it determines for its own purposes, such as service administration, security, support,
and billing. Before FixProve processes personal data on an organisation's behalf —
including during a free beta, since this depends on the processing taking place, not on
payment — a binding data processing agreement meeting GDPR Article 28 must be in place.
Repository content may itself contain personal data placed there by you or your
organisation — you remain responsible for what your own repository contains; our
obligation is limited to the data we ourselves process as described above.

## 3. Why we are allowed to process it (lawful basis)

- **Waitlist email:** consent (Art 6(1)(a)) — you opted in via the form, and can
  withdraw at any time via the unsubscribe link in any email we send.
- **GitHub App correlation data:** necessary to perform the service you (or your
  organisation) installed (Art 6(1)(b)).

## 4. Who else touches your data

**Cloudflare** hosts the site, API endpoints, and KV stores, processing this data on our
behalf as a subprocessor. Cloudflare KV is globally distributed, so data may replicate
outside the EU/EEA. The specific transfer safeguard applicable to our Cloudflare account
(e.g. Standard Contractual Clauses) is under active confirmation and will be stated here
once verified; contact us at yehor@yehor.ai if you have questions in the meantime.
Cloudflare also keeps its own request logs containing visitor IP addresses, which we do
not access or store ourselves, but which we disclose here because they are processed on
our behalf.

**GitHub** publishes the Check Run annotations and is the source of the webhook events.

We do not sell your data and do not share it with advertisers or data brokers.

## 5. How long we keep it

- **Waitlist entries:** deleted once the launch announcement they were collected for has
  been sent, or the list is abandoned, whichever comes first.
- **GitHub App correlation records:** deleted shortly after the check run they track
  completes. As a safety net for records whose check run never completes, an automatic
  24-hour expiry applies, so no correlation record is ever retained longer than 24 hours
  regardless of what happens to the check run it tracks.
- **Findings data:** never stored; used immediately and discarded.

## 6. Your rights

You can ask for access, correction, erasure, restriction, portability, and can object to
processing. Where processing rests on consent, you can withdraw it at any time. Requests
go to yehor@yehor.ai; we will respond within one month.

You have the right to lodge a complaint with the Danish Data Protection Agency
(Datatilsynet): Carl Jacobsens Vej 35, 2500 Valby, Denmark. Phone: +45 33 19 32 00.
Website: [www.datatilsynet.dk](https://www.datatilsynet.dk).

## 7. Changes

Material changes to this policy will be dated and noted here.

## 8. Contact

yehor@yehor.ai — FixProve v/ Yehor Kaliberda, CVR 46646223, Stockholmsgade 3, 1. th,
8200 Aarhus N, Denmark.
