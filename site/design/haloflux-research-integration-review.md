# HALOFLUX × Research- / First native integration candidate

Review target: Research- public-source data mapped into Ryder191's authentic native Canvas HUD. This is a standalone experimental route and does **not** replace the canonical homepage or redesign other article/search pages.

## What changed

- The untouched licensed originals stay under /v3/haloflux/. All integration HTML is derived from those exact files **at build time** by site/scripts/build-haloflux-integration.mjs.
- The derived experience lives at /Research-/v3/haloflux-research/ (mobile/desktop routing retained).
- The visual engine retains buildWeb, drawStage, ring motion, procedural strand drawing, five-layer beams, camera choreography, and the original 56-parameter console.
- Header statistics, recent feed, source provenance, domain routes, and subject index now use **real** catalog.mjs records. The generated index is source-bound, not a hardcoded copy of research titles.
- Original synthetic agent progress, fake 'validation' statuses, simulated feed activity and placeholder source routes are disabled **only in the generated integration**, never in the untouched origin.
- The original remaining procedural sample canvases are visibly identified as DEMO / NOT TEST DATA. A native expandable navigation and GET search lead to the real Astro content.
- Rendering pauses when the page is hidden or reduced-motion is requested; the latter gets a static source frame. Original graphics controls are retained.
- No-**JavaScript** navigation still includes links to library, search and source credits.
- New code isolates storage preferences from the original HALOFLUX route.
- Generated research text is inserted with DOM textContent, never treated as HTML. The restricted THREAT-MODEL is explicitly excluded by catalog and build checks.
- The original asset copyright and required link to https://github.com/Ryder191/haloflux remain visible. License remains **PolyForm Noncommercial 1.0.0**, and the reference soundtrack still loads from the previously pinned upstream URL.

## Verification gates

1. Upstream original source pages and their fidelity tests must still pass untouched.
2. Integrated desktop and mobile pages must render the source Canvas, retain controls, and report catalog-derived totals, working links and source paths.
3. Static reduced-motion frame, no-JS research links, keyboard operation and live-motion frame changes.
4. No research Markdown/SHA changes, no workflow or permission edits.
5. CI green is not a visual acceptance or a POCO F8 Ultra FPS/thermal measurement.

## Not completed, and intentionally not claimed

- Main homepage replacement or full-site eight-discipline art redesign.
- Shader/3D integration into the native Canvas world.
- Real-world gameplay-like source navigation inside every rotating micro-panel.
- Owner art comparison with upstream at matched viewport/time; actual phone performance and battery measurements.
- Commercial-use permission from HALOFLUX author.

Next visual stage, **only with owner approval**: establish an A/B visual-review set for full-page homepage, search, category and article layouts while keeping the source Canvas scene's visual density and animation cadence intact.
