# THE OBSERVATORY — Research Showcase

An original, editorial cinematic experience for the public `waydefu/Research-` archive. **The website is actual static source, not a mock-up.** It uses one self-contained WebGL2 SDF sculpture, with semantic HTML as the complete fallback. Research data are generated from checked-in Markdown files rather than copied into hand-written UI cards.

## Run and build (zero npm dependencies)

From a full `Research-` checkout using Node.js 20+:

```sh
cd showcase
npm run check
npm run build
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173/`. **Open through HTTP, not `file://`**: browser `fetch()` intentionally retrieves the index from `./data/research-index.json`.

For a GitHub Pages deployment at `/Research-/`, serve the **contents** of `showcase/dist` under that path. All stylesheet, JavaScript, SVG, JSON and in-page anchors use relative or fragment URLs; no hard-coded `/` root navigation, so refresh and `?q=...&domain=...` URLs work on a static host. Hosting is **not** enabled by this PR. You must separately approve any Pages/Actions deployment or repository setting changes.

## Information architecture

- **Hero / THE ART OF NOT KNOWING**: original procedural SDF metal observatory with editorial DOM headings and meaningful calls to action. The exact visual is a generative art-direction piece, **not** a measured representation of the number of studies.
- **Connected thinking**: conceptual relationship graph with keyboard-operable SVG nodes and equivalent DOM buttons; clicking a node filters the Research Explorer.
- **Research Explorer**: live search, category filtering, pagination and source-linked documents. Original Markdown is the single source of truth.
- **The protocol**: primary sources, distinction between fact and hypothesis, testability, EAG-100 as an *internal proposed standard*, not third-party compliance.
- **GitHub exit routes**: clear repository and source links; no fake buttons or dead-end demos.

## Build-time Markdown index

`scripts/build.mjs` traverses all `research/**.md`, `docs/governance/**.md` and the root `README.md` and derives a JSON index: `id`, `path`, `title`, `summary`, `headings`, `tags`, `group`. Paths point to GitHub files at the indexed `sourceCommit` (or main fallback if no Git context). `showcase/data/research-index.json` is a checked-in **build snapshot** for direct preview; it must be regenerated when Markdown changes. A production build always regenerates it from the current checkout. It does **not** claim git SHA-specific document hashes or index freshness when source is absent.

**No external JS/CSS fonts, images, CDN, trackers, paid services or runtime search APIs.** The site has no backend and no browser-side Markdown rendering, limiting input and supply-chain surfaces. JS creates UI content using `textContent`, never `innerHTML`. Public GitHub source links are `noopener noreferrer`.

## Rendering lifecycle and quality constraints

- One native WebGL2 canvas, fullscreen 2-triangle geometry and a procedural SDF shader. No WebGPU requirement, external textures or asset downloads.
- Fail closed to CSS/SVG **poster** when WebGL2 is absent, initialization fails, the context is lost, reduced-motion is enabled, data saver is detected, or runtime sustained performance becomes poor. The HTML navigation and search work without any GPU renderer.
- `IntersectionObserver` pauses rendering when the canvas leaves the viewport; `visibilitychange` pauses background work; resize is bounded to a scaled render target; handlers and GPU resources have cleanup paths.
- Input for visual movement uses optional fine-pointer hover. Graph nodes have buttons and keyboard equivalents, touch works via regular link/button controls. No mandatory scroll-jacking, autoplay audio or visual-only information.
- WCAG 2.2 AA **design target**: labels, focus rings, semantic headings, reduced motion, responsive 360px and desktop layouts. Automated checks are not certification and do not replace full screen-reader, iOS Safari and mobile device tests.

## Verification / known limits

`npm run check` runs syntax and Node tests. `npm run build` produces an independent static site. A desktop/mobile Chromium smoke test may be performed by a developer with Playwright; no external hosting action is bundled. **No field Core Web Vitals (LCP/INP/CLS p75), mobile hardware FPS, VRAM, thermal or battery results have been measured unless a separately reproducible trace is attached.** The 60 FPS objective is not a claim.

GitHub Pages does not allow custom response headers through this directory. Set `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy` and suitable framing policy at an approved HTTP host/CDN if available; no host settings are changed in this PR. There is no user input submitted to a server.

## Scope and rollback

All site code lives under `showcase/`; original research, tooling, `.github`, GitHub rules, credentials and repository settings are untouched. Revert the site PR or delete the `showcase/` directory through a separately approved PR to roll back.