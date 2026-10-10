# Environment

Status: READY for local implementation and browser smoke checks.

Plain browser HTML/CSS/JavaScript; no install or build. Optional local preview uses
Python's HTTP server. Codex Cloud has Chromium available for the two short checks.
Cloudflare Workers uses `worker.js`, `wrangler.jsonc`, and the ASSETS binding.
Wrangler 4 / Node.js and authorized Cloudflare access are needed only for a later
approved deployment. AWS profiles, credentials, APIs, and regions are not used.
