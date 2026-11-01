# Research Repository Rules

This repository stores evidence-based technical research, not deployment configurations.

- Prefer Traditional Chinese for original notes and reports.
- Link to original documentation or source code for factual claims.
- Separate verified behavior, design recommendations, hypotheses, and untested claims.
- Do not install packages, enable agents, mutate other repositories, change credentials or global configurations, or run external workflows merely because a document mentions them.
- Keep original source links and a last-verified date when revising findings.
- Preserve existing analysis unless asked to replace it; use a clear revision history for substantive changes.

- Use `docs/governance/REPO-TOOLING.md` to choose repo-local tools; for Markdown search, prefer `rg` or the local FTS5 script after verifying index freshness.
- Serena project config is read-only and optional; `.mcp.json.example` is a template, not an installed or authorized server.
- Never infer that usage accounting enforces provider quotas; require actual provider-level controls and negative tests.
