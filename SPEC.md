# Cloud Operations Dashboard

Status: ACTIVE — scope authorized by the user's “GO — Level 3” brief.
Environment: mock browser application; Cloudflare deployment requires later approval.

## Outcome and authority

Initialize `kcloud1/cloud-ops-demo`, implement the accepted intent, validate locally,
and prepare one cohesive PR. Read `repo-starter` and `kcloud1/codex-cloud-hello-site`
as references. Do not merge or deploy. No real AWS access.

## Required behavior

- Overview: three accounts, healthy resources (no findings), compliance and critical findings.
- 18 fictional EC2/S3 resources; filters combine account, type, and compliance status.
- Finding details include severity, context, and mock suggested remediation.
- Approve Once / Reject records one terminal decision per finding for the current session.
  Compliance and overview totals remain unchanged; reload resets decisions.
- Responsive layout, dark/light mode, text status labels, keyboard-accessible review dialog.
- Plain HTML/CSS/JavaScript; reuse Level 2's Worker + ASSETS + asset allowlist pattern.

## Constraints and plan

No React, database, SDK, Terraform, authentication, live AI/AWS calls, new testing
framework, or automatic CI. Keep inherited governance; do not duplicate it.
Implement UI and fixtures, perform exactly README's two browser checks, then open
one PR with results. Revert the feature commit to roll back; retain source and PR evidence.
Stop on a repository mismatch, required validation failure, or scope/access blocker.
Stop after PR readiness. Merge and deployment need separate approval.
