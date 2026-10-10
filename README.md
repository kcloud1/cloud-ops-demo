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

Website: [CloudOps dashboard](https://cloud-ops-demo.amitkarpe.workers.dev).
The owner reported success and supplied a screenshot showing 3 accounts, 9 healthy
resources, 9 findings, 3 critical findings, and `prod-api-01` marked Approved once
while remaining Non-compliant. Cloudflare readback confirmed the Worker exists and
its workers.dev route is enabled. This session could not independently fetch the
live page; the deployed artifact's exact correspondence to Git was not verified.

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

## Deployment (only after owner approval)

The initial dashboard PR is merged and the owner reports a successful deployment.
For future releases, obtain explicit deployment authority. This repository reuses
[kcloud1/codex-cloud-hello-site](https://github.com/kcloud1/codex-cloud-hello-site)'s
minimal `worker.js` + `wrangler.jsonc` ASSETS pattern. `.assetsignore` uploads only
`index.html`, `style.css`, and `script.js`; no API routes are needed.

From an authorized machine with Node.js and Cloudflare access, select the intended
Cloudflare account, run `npx wrangler@4 login` if needed, then
`npx wrangler@4 deploy` from the repository root. Worker name: `cloud-ops-demo`.
Use the actual workers.dev URL returned by Wrangler. There is no build step.
Alternatively, after explicit approval, connect this repository through Workers
Git integration with root working directory, no build command, and the same deploy
command. Do not enable automatic deployment before approval.

The implementation PR validated the dashboard locally; subsequent deployment evidence
is recorded above. This documentation update changes no runtime, Cloudflare settings,
or AWS permissions. Source starts at [AGENTS.md](AGENTS.md),
[project intent](intent/0001-project-bootstrap/intent.md), and [SPEC.md](SPEC.md).
