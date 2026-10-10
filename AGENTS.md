# Agent guide

Maintain the completed mock Cloud Operations Dashboard. Follow KISS and the accepted
[project intent](intent/0001-project-bootstrap/intent.md); read [SPEC.md](SPEC.md)
for scope and authority, then the owning PR and relevant code. Use [README.md](README.md)
for operation and the inherited [AI-native SDLC](AI_NATIVE_SDLC.md) for lifecycle guidance.

- Keep plain HTML/CSS/JavaScript and local fictional data. No AWS access or dependencies.
- Separate a demo approval decision from compliance; approval is not remediation.
- Preserve unrelated work; use one cohesive PR. No automatic CI or new test framework.
- For behavior changes, use the two short browser checks in README and record evidence
  in the PR. Documentation-only updates need diff review, not browser reruns.
- Follow the current user authorization for bounded repository work and merge.
  Level 3 is complete; deployments, provisioning, and new milestones require explicit approval.
- Keep intent, spec, and docs concise; link existing governance instead of copying it.
- Primary repository: `kcloud1/cloud-ops-demo`. Other repositories are read-only references.
- Connector/platform actions follow [CHATGPT.md](CHATGPT.md)'s safety gate and repository binding.
