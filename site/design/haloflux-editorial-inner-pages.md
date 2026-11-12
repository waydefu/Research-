# RESEARCH— / HALOFLUX inner-page art direction

Scope: native V3 library, domain, search and article pages. This is not a homepage replacement and does not edit the Ryder191 Canvas rendering code, research Markdown, search behavior, review registries or GitHub Actions.

## Production type system

- CJK display / chapters / editorial titles: Chiron Sung HK → Noto Serif CJK TC → Source Han Serif TC → Noto Serif TC → Songti TC → PMingLiU → generic serif.
- CJK content / UI: Chiron Hei HK → Noto Sans CJK TC → Noto Sans TC → PingFang TC → Microsoft JhengHei → system-ui.
- Instrumentation / numeric source IDs: JetBrains Mono → IBM Plex Mono → Cascadia Code → Consolas → ui-monospace.
- Typographic rhythm: 500-weight Song display, 400-weight high-contrast Sans text, CJK strict line-breaking, 1.85–2.07 reading leading, ~68-character article measure, real DOM text, not rasterized callouts.
- **Important limitation**: Font families are local-system stacks. No unreviewed font binaries or external CDN are shipped, so glyph shapes vary with device font availability. Visual inspection on POCO F8 Ultra is mandatory before asserting font parity. Consistent local-hosted typefaces require a separately verified, licensed source asset and bandwidth review.

Chiron Sung/Hei are licensed under SIL OFL 1.1, as are Noto CJK fonts. Refer to upstream author licenses; no font binary is redistributed. The existing HALOFLUX Canvas remains separately licensed under PolyForm Noncommercial with its original attribution.

## Visual cohesion, not copying a template

- Near-black #08090b, cold-white type, teal #98e0cf signal and rose #f0a6c6 accents from the existing HALOFLUX grammar.
- Thin measurement rules, technical mono indices, source metadata, quiet scanlines and ring engraving; no decorative values presented as true research data.
- Original home hero photo remains, but receives the HALOFLUX ink/teal optical treatment and native CJK editorial display.
- Library: numbered continuous index plates, purpose-specific illustrations, functioning filters.
- Domain: illustrated source folio, true topic totals, restrained research links.
- Search: legible real search form with distinct historical-original scope and real results.
- Article: a strong headline, sustained-reading line length, accessible source review, code blocks, tables, anchors and provenance.

## Integration boundaries

site/src/layouts/Base.astro opts four defined page kinds into the style via artDirection; selectors are scoped to HTML elements carrying data-art-direction=haloflux. Other Astro pages, original Sanctum root and standalone HALOFLUX art are independent.

No third-party font/CDN traffic. No new JS UI framework, scroll hijack, synthetic live metrics, altered source data or interaction-blocking overlays.

## Gate

npm run check, npm run build, npm run provenance, npm run e2e. site/tests/pages/haloflux-editorial-inner.spec.mjs checks 320/393/768/1440 widths for all four families, source and provenance, and keyboard/no-JS behavior.

CI success is not human visual acceptance, font parity or POCO F8 Ultra FPS/battery proof. Owner approval required to merge or deploy.
