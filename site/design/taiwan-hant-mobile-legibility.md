# Traditional Chinese presentation and mobile readability / Research-

## Display-only localization

- OpenCC dictionaries licensed under Apache-2.0 are pinned and vendored under site/vendor/opencc, with source SHA and full license.
- site/src/lib/zh-hant-display.mjs implements a deterministic s2tw-style longest-phrase pass, character fallback and Taiwan character variants; does not claim full upstream mmseg equivalence.
- site/scripts/localize-public-display.mjs runs after Astro/HALOFLUX static build but **before Pagefind**. It translates visible HTML text, accessible names, alt/title/placeholder and meta-description while leaving HTML tags, code, scripts, CSS, IDs, URLs, keys and upstream HALOFLUX untouched. The first-party Sanctum homepage is also localized.
- The archived original search JSON keeps \`text\`, \`title\`, \`publicTitle\`, source URL and SHA **unchanged**, adding \`displayText\`, \`displayTitle\`, \`displayPublicTitle\` only where needed. Rendered search excerpt/title uses those display fields; searches still match original text and localized text. URL, code fences, and inline code are not transliterated in display excerpts.
- The HALOFLUX live-source JSON localizes user-facing title, topic and area labels only. English brand and technical nomenclature remain.
- Upstream original HALOFLUX lab/mobile HTML, author attribution, source SHA, soundtrack configuration and PolyForm noncommercial license remain byte-identical.

## Mobile type size

At <=520px, user-controlled text scaling is retained, while body and controls target 16px, article body and deck 17px, section titles 19–24px, source metadata 12–14px and discovery/categorical excerpts 14–16px; nav remains responsive at 320px and lightfield remains a separate route to protect the two-action contract. Research index drawer text is increased independently from the original Canvas HUD, which is not redesigned in this change.

## Limits and gates

Original source remains linguistically exact in Git and archive. In-browser original source code blocks remain exact; converting public prose does not change the substance or truth of any research.

OpenCC longest-match conversion is high-coverage but *not* exactly equivalent to official mmseg segmentation; ambiguous proper nouns, context and scientific terminology still warrant editorial review. For reproducibility this is build-time with no runtime font/CDN/service dependency.

Build must pass existing repository integrity, Astro/Playwright (including 320, 393 and 430px no overflow), source provenance and Pagefind checks. Without POCO F8 Ultra screenshots/scale testing, do not mark phone visual quality as owner-approved.
