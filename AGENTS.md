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

## Mandatory intake gate for new research pull requests

Before creating a PR that adds or renames a `research/**/*.md` source, **read and follow** [site/RESEARCH-CURATION.md](site/RESEARCH-CURATION.md), especially **「新增研究 PR｜必過收錄流程」**. A new Markdown file alone is **not** a completed research intake.

- Update the exact-path taxonomy, Traditional Chinese editorial lead, dated source-review register and provenance SHA as applicable. Use optional curated author/demo metadata only with evidence; verify the original schematic-art coverage. Do not silently infer an author, license, library, measured FPS, or visual inspection.
- Run the repository and site gates, including browser tests, **before** calling the PR ready; count-based assertions must remain correct when the collection grows. If local execution is unavailable, disclose that and use the actual GitHub Actions results as the release gate.
- Do not amend historical SHA-pinned review registers or relax tests to hide a missing source review. Fix the data and the applicable tests together. Do not merge or deploy without explicit authorization.
- Separate PRs that update shared registries may conflict after the first merge: rebase on fresh `main`, reconcile exact-path entries and rerun CI before recommending another merge.
