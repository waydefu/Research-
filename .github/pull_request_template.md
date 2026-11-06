## Change scope

- Goal:
- Paths changed:
- Explicitly out of scope:
- Upstream sources / versions:

## Evidence and verification

- [ ] Factual changes cite primary sources, dates and evidence status
- [ ] Existing research preserved or corrections explained
- [ ] `git diff --stat origin/main -- research/` shows no modified or deleted files, unless this PR is an owner-authorized research change with a revision note
- [ ] New or moved `site/*.md` / `docs/governance/*.md` files are classified in `site/DOCS-INDEX.md`
- [ ] Local Markdown links, JSON and EAG controls checked
- [ ] Security/privacy impact reviewed, no credentials committed
- [ ] Sensitive paths reviewed by an eligible person where possible

## New research intake — required only when adding or renaming research Markdown

Follow `site/RESEARCH-CURATION.md` → 「新增研究 PR｜必過收錄流程」.

- [ ] Exact-path taxonomy and public Traditional Chinese lead registered
- [ ] Bounded source review added to `site/P1-ONGOING-SOURCE-REVIEW.json`, actual source blob/commit SHA checked
- [ ] Author/demo claims and illustration provenance checked; no borrowed screenshot disguised as original
- [ ] All applicable catalog, Node, build, provenance and browser tests checked (including source count changes)
- [ ] CI results reviewed after the latest push; if red, link the failing job and state why
- [ ] Not applicable (this PR does not add or rename a research source)

Tests actually run (**not run** if unverified):

## Risks / rollback

- Open questions:
- Rollback method:

> Never claim CI passed, approved, or deployed without evidence.
> Merge, rulesets and permission changes require explicit owner approval.
