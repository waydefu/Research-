# V2 typography licensing and build provenance

**Checked 2026-11-02.** This website uses independently selected fonts, not artwork or font files from an animation or a creative studio.

| Role | Family | Licence | Upstream |
| --- | --- | --- | --- |
| Display serif | Instrument Serif regular + italic | SIL OFL 1.1 | https://github.com/google/fonts/tree/main/ofl/instrumentserif |
| Editorial grotesk | Manrope variable | SIL OFL 1.1 | https://github.com/google/fonts/tree/main/ofl/manrope |
| Field-note mono | IBM Plex Mono regular | SIL OFL 1.1, Reserved Font Name Plex | https://github.com/google/fonts/tree/main/ofl/ibmplexmono |

The authoritative `OFL.txt` for each family is downloaded **beside the font binary** during `npm run build`. Files are copied into the published `showcase/dist/assets/fonts/` directory. Requests from the live site are same-origin only, with no font CDN dependency.

`showcase/scripts/fonts.mjs` pins upstream `google/fonts` commit `6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec` and verifies each file with Git blob SHA-1. Downloads occur **at build time only**. Existing correctly verified local assets are reused. A failed/mismatched download intentionally fails the build. This introduces a pinned upstream build dependency and requires network access on a cold checkout.

**Chinese typography:** Chinese body copy deliberately uses the user's system Noto Sans TC / PingFang TC fallbacks to avoid adding a multi-megabyte CJK font without audited subsetting. The precise CJK-only heading subset is **not yet implemented**, so do not claim it is. Proper subsetting requires a separately approved font pipeline with all title glyphs and language coverage.

License verification does not constitute a third-party trademark permission; family names are only font attribution and ordinary font usage.
