# Research— / HALOFLUX full-site experience integration

Owner requirement: integrate graphic, motion, interaction, creative programming, Web 3D, shader art, typography and identity throughout the website, not a standalone original demo with static UI elsewhere.

## Evidence actually used (read from repo, not generic moodboard)

- research/2026-11-startup-animation/04-haloflux-beat-canvas-light-rings.md: real 10-beat clock, exponential brightness envelope, inertial rings, 7-shot camera; mobile field cost reduction, license constraints.
- research/2026-11-universal-web-engine/10-creative-direction-and-reference-sites.md: Active Theory's source-described cursor/scroll velocity effects; Locomotive's content-first high quality; no false attribution of source shaders.
- research/2026-11-universal-web-engine/11-motion-graphics-and-rendering.md: native DOM navigation remains separate from a disposable Canvas scene; reduced-motion and visibility-lifecycle.
- research/2026-11-universal-web-engine/22-immersive-scrollytelling-and-asset-performance.md: scroll-bound chapter pacing, passive rAF, static/no-JS first, typography always selectable and native scroll.
- research/2026-11-universal-web-engine/35-ui-typography-readability-and-cjk.md: 320-430px Traditional Chinese readability and contrasting metadata.
- showcase/design/V2-ART-DIRECTION.md: optically linked research index, one strong primary visual and real source records.

## Concrete implementation

- Generate site/scripts/build-haloflux-site.mjs directly from the integrated, attribution-preserving HALOFLUX Canvas source. /v3/haloflux-site/field.html is a real isolated stage using the upstream scene, cadence, rings, streaks and cameras; it is NOT a static image, user-agent screenshot or a redrawn concentric CSS circle. All source control DOM remains intact but hidden in this background-only derivative. No ambient external BGM request.
- The same stage appears as a noninteractive visual layer throughout /Research-/, /v3/library/, domain, search and article pages. Existing real links, search and source SHA are preserved. There is a user-visible original-work credit and noncommercial license.
- site/public/haloflux-site/immersive.css re-directs the actual home visual: ink/teal/rose, dominant CJK headline, illustrated editorial categories, asymmetric image feature plates, optical guides, real Canvas, source credit. The static pre-HALOFLUX Sanctum remains as route-semantic fallback and background CSS source but is no longer the displayed art direction.
- immersive.js couples independent chapter observers, scroll progress, restrained pointer-reactive field placement, selected domain response, and a real motion pause control. The stage is paused when the tab is hidden, the user requests reduced motion, or long-article reading passes the landing section. Reduced-motion users receive a still HALOFLUX frame.
- Same-origin cross-document View Transitions where supported, native navigation otherwise. No scroll hijacking, fake KPIs, copyright removal, source Markdown mutation, iframe focus traps or third-party runtime dependency.

## What this DOES NOT prove

HALOFLUX is Canvas 2D, not Web 3D nor a GLSL shader art implementation. Research- separately has a WebGL2 singularity experiment, but this does not honestly complete the 3D/Shader Art portions of the original eight-part target. Full original-exceeding art direction is still an Owner judgment, not a CI metric.

The source original is PolyForm Noncommercial 1.0.0, incompatible with unreviewed commercial reuse. Do not imply the entire combined work is commercially licensed. Source controls are not removed from the original /v3/haloflux/ or /v3/haloflux-research/.

## Acceptance

Run npm run check, npm run build, npm run provenance, npm run e2e and entire Pages assembly test. Added checks: genuine source Canvas content on all 5 route families at mobile/desktop, real animation on canonical root, pausing, no horizontal overflow, source credit and no-JS native links. Visual and FPS acceptance on POCO F8 Ultra still requires owner.
