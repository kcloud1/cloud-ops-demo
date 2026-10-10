# CloudOps · Cloud Operations Dashboard

A polished mock AWS operations dashboard for DevOps learners and reviewers, built
with AI-assisted engineering. Eighteen fictional EC2/S3 resources span Production,
Staging, and Development. No AWS connection, live AI, credentials, or backend data.

Open `index.html` directly, or run `python3 -m http.server 8080` from the repository
and visit `http://localhost:8080`. No install or build is needed for the dashboard.

Overview totals always cover all resources. “Healthy” means no compliance finding.
Filters combine account, type, and compliance. Review a finding to see its context
and mock suggested remediation. **Approve Once** or **Reject** records a terminal
session decision; it does not resolve findings or execute an action. Reload resets
decisions and filters. The dark/light preference is remembered when storage is available.

## Delivery and learning · 2026-10-10

Level 3 is complete. [PR #1](https://github.com/kcloud1/cloud-ops-demo/pull/1)
was squash-merged into `main` as
[`d245bfc`](https://github.com/kcloud1/cloud-ops-demo/commit/d245bfc9a8d5b5d4536d20498893cd066192bfee);
the merged feature branch was deleted. Both focused local browser scenarios below
passed, including mobile/theme presentation and keyboard focus.

### Live deployments and evidence

- **Cloudflare Workers:** [live CloudOps dashboard](https://cloud-ops-demo.amitkarpe.workers.dev/). On 2026-10-10, ChatGPT/Cloudflare API confirmed `cloud-ops-demo` is serving version `48043c25-24e3-4cde-86e6-72ee190e2cb4` at 100% traffic; an independent public fetch loaded the HTML dashboard and its JavaScript. The initial release used a directly uploaded Worker module bundling exactly the three frontend file contents from Git commit `d245bfc9`. **It did not use the repository's `worker.js`/`wrangler.jsonc` as a build artifact.** The Git integration/automatic redeployment is not yet configured or proven.
- **AWS Amplify Hosting:** [live CloudOps dashboard](https://main.d3kkhf9qfepghs.amplifyapp.com/). On 2026-10-10, AWS account `333438771545`, `ap-southeast-1`, app `d3kkhf9qfepghs`, branch `main`, manual deployment job `1` finished **SUCCEED** with DEPLOY/VERIFY both successful. Independent public fetch loaded HTML and JavaScript. Only `index.html`, `style.css`, and `script.js` from the same `d245bfc9` commit were deployed through a temporary private S3 staging prefix; the staging objects, bucket policy and bucket were deleted after acceptance. **This Amplify app is not GitHub-connected; no auto redeploy on push.**
- **CodeConnections boundary:** The separate personal AWS GitHub connection named `codex-cloud` is `AVAILABLE` but **is not wired to Amplify**. Native Amplify GitHub Hosting authorization is a distinct GitHub App integration.
- **GUI acceptance:** Owner screenshot shows 3 mock accounts, 9 healthy resources, 9 findings and 3 critical findings, with `prod-api-01` marked `Approved once` while still `Non-compliant`. This is simulated approval; no actual remediation or AWS resource change.

What we learned:

- A precise GO brief can supply accepted intent and bounded authority. Derive a
  concise spec and deliver one useful PR without adding frameworks or governance copies.
- Keep approval decisions separate from compliance. The screenshot demonstrates
  that approving a proposed action does not falsely report remediation.
- The mobile smoke check caught page overflow from the table's hidden caption.
  Positioning the scroll container fixed it; both browser scenarios then passed.
- Dialog close events are asynchronous. Wait for focus restoration before asserting
  it, rather than treating an immediate assertion as an application failure.
- Merge success and deployment success need separate evidence. Deploying to a missing
  Worker creates a resource; a no-provisioning limit needs an explicit exception.
- Reuse the minimal Level 2 Worker/ASSETS pattern. Keep the asset allowlist and
  repeatable deployment path in Git; provider existence alone does not prove artifact parity.

## Exactly two browser smoke tests

1. **Filters:** Start with 18 resources. Select Production → S3 → Non-compliant;
   confirm only `acme-prod-reports` appears and the footer says “Showing 1 of 18 resources”.
   Switch to Compliant; confirm `acme-prod-audit` and `acme-prod-backups` (2 rows).
   Select Development → EC2 → Non-compliant; confirm `dev-sandbox-01` and `dev-tools-01`.
   Select Staging → S3 → Non-compliant; confirm `acme-stage-assets` and `acme-stage-backups`.
   Reset; confirm all 18 rows return. Use a narrow viewport and toggle light/dark during this check.
2. **Approval:** Review `prod-api-01`; confirm “SSH open to the internet”, Critical,
   resource/account details and remediation. Choose Approve Once; confirm “Approved once”
   in dialog and table. Close/reopen; the decision remains and both actions are disabled.
   Review `acme-prod-reports` and Reject; confirm “Rejected”. Both resources remain
   Non-compliant and overview totals stay 3 accounts / 9 healthy / 9 findings / 3 critical.
   Reload; confirm decisions return to Pending. Escape closes details and restores focus.

## Next deployments and reproducibility

The two sites above are confirmed working; **both were initially published through explicit one-time operations** after owner approval. They do not yet prove GitHub -> hosting continuous deployment. Updating `main` alone will not update either of these hosting endpoints.

For normal future deployments, connect this *existing repository* to exactly one provider's native Git integration after the one-time owner GitHub App/repository authorization. On Cloudflare Workers the checked-in `worker.js`, `wrangler.jsonc` and `.assetsignore` are the reproducible deployment contract; verify a Git-built artifact and its live SHA before treating direct-upload parity as a CI/CD proof. For AWS Amplify, choose the GitHub Hosting integration if automatic deployment is the accepted next milestone. The already created manual app and AWS CodeConnections do not establish that integration.

Keep personal learning deployments within the accepted GO and cost/publication limits. Official AWS/PROD, IAM, credentials, restricted data, destructive changes and new account resources need their applicable explicit safety gates. No new framework, pipeline, test runner or live AWS API is needed for this mock website.

Reusable, provider-neutral starting point: [repo-starter cloud-first quickstart](https://github.com/amitkarpe/repo-starter/blob/main/docs/CLOUD_FIRST_QUICKSTART.md). Account-specific rules and complete evidence belong in the private controller [work](https://github.com/amitkarpe/work) and this repository's Git history.
