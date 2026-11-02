# V2 implementation audit — evidence, limitations, next human gate

**2026-11-02 · GitHub review status: four stacked code PRs #12–#15; not released as public V2.**
This is a code-path audit, not a substitute for a creative director's browser walk-through or native mobile test.

## Five independent review lenses

| Lens | Source-evidenced implementation | Open concern / explicit non-PASS |
| --- | --- | --- |
| Creative direction | Original dark titanium / gilded edge / cyan inference palette; serif/grotesk/mono system, renamed Hero; new custom torus geometry, new OG social artwork | No actual rendered V2 screenshot against the source references. Sophisticated art direction must still be critiqued visually; a good color palette alone is not quality proof |
| Senior UX | Native scroll, semantic DOM, filters and source links; no-js source route; pause control; pointer effect does not capture clicks | Keyboard + TalkBack/VoiceOver touch flow, zoom 200%, iOS search keyboard and focus after transitions require real device/browser |
| Graphics engineering | Procedural torus buffers/normal vectors; WebGL2 depth and one bounded highlight bloom composite; finite-geometry test; context lost state tested with JS fake GL | Real shader compilation on Android/iOS hardware, actual FBO complete on all drivers, overdraw, device-loss handling, blooming appearance and artifacts not visually verified |
| Frontend architecture | One canvas, isolated rendering, one source-linked Markdown index, no UI inside WebGL, no external runtime CDN; frame scheduler and CSS poster fallback | Existing `artifact.js` kept as legacy test/rollback module; optional browser smoke test currently not a required workflow gate |
| Performance engineering | Capped canvas resolution/DPR, rAF paused on hidden tab, ECO/performance-fallback to CSS; reduced-motion and saveData; opt-in local `?qa=1` sampling | No measurements for p95 native GPU frame time, true Core Web Vitals INP p75, LCP, CLS, heat/battery, memory peak, network throttling or power-saving device |

## Release gates and evidence

- **CI unit and source checks:** `npm --prefix showcase run check` and `npm --prefix showcase run build` on PRs; the connected GitHub Actions check results are the authority and must be re-read after each retarget/merge.
- **Font origin:** [SIL OFL font manifest](V2-FONT-LICENSES.md). Source is pinned, SHA-1 Git blob verified; three OFL full texts copied into the deployed artifact. The site itself makes no font-CDN calls.
- **Graphics A/B:** V1 SDF and V2 mesh are in the repository, but no matched performance A/B dataset exists. The migration is **an engineering candidate implemented**, not a measured proof that mesh is superior.
- **Mobile QA:** After approved deployment, open `https://waydefu.github.io/Research-/?qa=1` on a device. Scroll and use Search / category filters, then tap **SHOW LOCAL QA**. Capture the p95/p99 rAF interval and worst observed EventTiming interaction with phone model, Chrome version, DPR, power state, screen refresh rate, start/end temperatures, test time and network. The debug panel computes **local, lab observations only** and does not transmit data. `rAF interval ≠ GPU time`, `max EventTiming duration ≠ field INP p75`. Observations can be null / unsupported.
- **Backstop:** Use `?qa=1` only for manual profiling; the extra diagnostic RAF is not representative of normal user workload. Compare uninstrumented render traces separately via platform profiling.
- **Public Pages verification:** Published root HTML, `data/research-index.json`, CSS, JS and fonts must match the deployed SHA; GitHub Actions green alone is not browser E2E.
- **A11y:** Manual WCAG 2.2 AA audit, screen readers and reduced-motion negative cases are still required. Do not claim certification.
- **Release authority:** Owner approval for each PR, no automatic merge/deploy outside existing protected-main workflow. Only main pushes trigger deployment, not pull requests.

## Residual work

1. Get actual desktop and Android/iOS captures for V2, record and fix overlap, bloom, focus, fonts and camera framing.
2. Build a **Chinese display font subset only after verifying glyph coverage and licensing**. Current Chinese text uses OS fallback.
3. Run 15–30-minute device thermal/memory loops; test returning from background and forced WebGL Context Loss on real hardware.
4. When browser evidence exists, run consistent A/B SDF/mesh capture, document p95 frame intervals **and actual GPU GPU-time separately**; reject render workloads that interfere with Search.
5. Review all four PRs in order. This file and a green Node suite are not Owner acceptance by themselves.
