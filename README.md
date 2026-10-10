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

Review the PR and approve merge/deployment separately. This repository reuses
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

Deployment is not part of this PR's validation. No Cloudflare settings, resources,
Git integration, or AWS permissions were changed. Source starts at [AGENTS.md](AGENTS.md),
[project intent](intent/0001-project-bootstrap/intent.md), and [SPEC.md](SPEC.md).
