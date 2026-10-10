# Intent: Cloud Operations Dashboard

Status: ACCEPTED
Owner: kcloud1
Acceptance evidence: user's explicit “GO — Level 3: Cloud Operations Dashboard”
in this Codex conversation on 2026-10-10, including implementation and PR authorization.

Demonstrate how AI-assisted engineering helps DevOps teams understand AWS operational
issues through one small, polished mock dashboard. Serve learners and reviewers with
an overview, 15–20 realistic EC2/S3 resources across three accounts, combined filters,
and a finding → details → Approve Once / Reject flow. Include dark mode and clear statuses.

Verified: repository already exists from `amitkarpe/repo-starter`; the completed Level 2
repository uses a plain frontend, minimal Worker, ASSETS binding, and asset allowlist.
Use 18 fictional resources. Approval records a demo decision, not remediation or AWS execution.

Plain HTML/CSS/JavaScript only. No live AWS/AI, authentication, database, SDK, Terraform,
new test framework, or automatic CI. One cohesive PR and exactly two browser smoke checks
([README](../../README.md)). Stop at PR readiness; no merge, deploy, or additional milestones.
