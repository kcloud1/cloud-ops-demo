# Agent guide

Build one useful mock Cloud Operations Dashboard. Follow KISS and the accepted
[project intent](intent/0001-project-bootstrap/intent.md); read [SPEC.md](SPEC.md)
for scope and authority, then the owning PR and relevant code. Use [README.md](README.md)
for operation and the inherited [AI-native SDLC](AI_NATIVE_SDLC.md) for lifecycle guidance.

- Keep plain HTML/CSS/JavaScript and local fictional data. No AWS access or dependencies.
- Separate a demo approval decision from compliance; approval is not remediation.
- Preserve unrelated work; use one cohesive PR. No automatic CI or new test framework.
- Run exactly the two short browser checks in README. Record evidence in the PR.
- Do not merge, deploy, or add milestones without explicit user approval. Stop at PR readiness.
- Keep intent, spec, and docs concise; link existing governance instead of copying it.
- Primary repository: `kcloud1/cloud-ops-demo`. Other repositories are read-only references.
- Connector/platform actions follow [CHATGPT.md](CHATGPT.md)'s safety gate and repository binding.
