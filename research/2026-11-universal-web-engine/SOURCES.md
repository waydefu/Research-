# SOURCES｜通用 Web 研究的原始來源與查證範圍

**最後研究：2026-11-02，Asia/Taipei。** 優先官方發版公告、技術文件、安全公告；這裡提供來源、可驗證的主張、限制。未實際執行的 Benchmarks 不得寫成測試成績。連結代表研究時核對或作為產品原始文檔入口；版本變動前須重查。

## A. 框架與版本（官方／原始）

| 主題 | 來源 | 2026-11 可核對結果 |
| --- | --- | --- |
| Next.js release | https://github.com/vercel/next.js/releases | 16.4.3 = 2026-10-23 穩定，16.5 Canary 為 Preview |
| Next.js App Router | https://nextjs.org/docs/app | RSC、Route Handler、Server Action、SSR / Metadata |
| Cache Components | https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents | 16.x feature、use cache 與相關策略 |
| Next 十月安全更新 | https://nextjs.org/blog/nextjs-security-update-october-14-2026 | RCE 修補、官方建議應更新 |
| React 最新版本 | https://react.dev/versions | 19.3 |
| React 19.3 正式公告 | https://react.dev/blog/2026/09/09/react-19-3 | ViewTransition／Fragment Refs stable |
| React RSC 安全公告 | https://github.com/react/react/security/advisories | 2025–2026 多輪 RSC 安全公告 |
| Nuxt Releases | https://github.com/nuxt/nuxt/releases | 4.6.2（2026-10-16） |
| SvelteKit | https://svelte.dev/docs/kit/introduction | SSR / CSR / Prerender / Adapters |
| Astro 6 正式公告 | https://astro.build/blog/astro-6/ | 2026-03-10 |
| Astro Islands | https://docs.astro.build/en/concepts/islands/ | 按需 hydration 的架構 |
| React Router modes | https://reactrouter.com/start/modes | Declarative / Data / Framework |
| TanStack Start | https://tanstack.com/start/latest/docs/framework/react/overview | 官方標明 Stable |
| TanStack 比較 | https://tanstack.com/start/latest/docs/framework/react/start-vs-nextjs | 官方比較頁；**是出品方觀點** |

## B. TypeScript / Runtime / Build（官方）

| 技術 | 來源 | 注意 |
| --- | --- | --- |
| TypeScript 6 | https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/ | 2026-03 stable，預設選項變化 |
| TypeScript 7 Beta | https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/ | Beta ≠ GA |
| Node.js Releases | https://nodejs.org/en/blog/release | 26.13.0 LTS 2026-10-28 |
| Node Releases 表 | https://nodejs.org/en/about/previous-releases | LTS 與 EOL 版本 |
| Vite 8 | https://vite.dev/blog/announcing-vite8 | 2026-03-12 Rolldown，宣傳的 build 加速不應搬成一般 runtime FPS |
| Turborepo | https://turborepo.com/docs | 可選多專案 task cache |
| Biome | https://biomejs.dev/ | lint / format 候選，非必裝 |
| Vitest | https://vitest.dev/ | unit / integration |
| Playwright | https://playwright.dev/ | 跨引擎 E2E |

## C. UI、資料與後端

| 技術 | 來源 | 研究用途 |
| --- | --- | --- |
| Tailwind CSS | https://tailwindcss.com/blog | 4.3 已發布（2026-05） |
| shadcn/ui | https://ui.shadcn.com/ | 可組合元件 |
| Radix UI | https://www.radix-ui.com/primitives | 可及性 Primitive |
| React Aria | https://react-spectrum.adobe.com/react-aria/ | 元件行為、可及性 |
| TanStack Query | https://tanstack.com/query/latest | Client 遠端資料同步 |
| Hono | https://hono.dev/docs | Web Standards runtime API |
| Cloudflare 全端支援 | https://developers.cloudflare.com/workers/static-assets/routing/full-stack-application/ | 各框架部署適配 |
| Fastify | https://fastify.dev/ | Node API |
| NestJS | https://docs.nestjs.com/ | 大型模組型後端 |
| Prisma 7 | https://www.prisma.io/docs/orm/v7 | ORM 7 發版線 |
| Prisma 8 發版狀態 | https://www.prisma.io/docs/orm/release-status | **2026-10-30 v8 RC；npm latest 會拿到 RC，須鎖 v7** |
| Drizzle | https://orm.drizzle.team/docs/overview | SQL-centric TypeScript ORM |

## D. GPU、資產與 Web API

| 主題 | 來源 | 重點 |
| --- | --- | --- |
| WebGPU Baseline | https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API | 2026-11 非 Baseline / Limited Availability，通常 HTTPS |
| Compatibility Mode | https://developer.chrome.com/blog/new-in-webgpu-146 | Chrome 146 舊圖形 API 限定支援 |
| Three WebGPU Renderer | https://threejs.org/manual/pages/webgpurenderer | TSL、WebGL2 fallback、experimental、ShaderMaterial/EffectComposer 不兼容 |
| PlayCanvas Engine | https://playcanvas.com/products/engine | 3D / WebGPU / WebGL |
| Babylon.js | https://www.babylonjs.com/ | 3D / WebGPU |
| OffscreenCanvas | https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas | worker 中渲染 Canvas，功能支援因環境而異 |
| Khronos glTF 延伸 | https://github.com/KhronosGroup/glTF/blob/main/extensions/README.md | \`KHR_texture_basisu\`, \`EXT_meshopt_compression\` 等 |
| gltfpack | https://github.com/zeux/meshoptimizer | mesh / glTF 最佳化 |

## E. 效能、安全、可及性、可觀測性

| 題目 | 來源 | 界線 |
| --- | --- | --- |
| CWV 門檻 | https://web.dev/articles/vitals | LCP 2.5s、INP 200ms、CLS 0.1，p75 |
| WCAG 2.2 | https://www.w3.org/TR/WCAG22/ | 自動化工具不能取代人工 UX 檢查 |
| MDN A11y | https://developer.mozilla.org/en-US/docs/Web/Accessibility | Semantic DOM 與輔助技術 |
| OpenTelemetry JavaScript | https://opentelemetry.io/docs/languages/js/ | Traces/Metrics Stable；Logs Development；瀏覽器實驗性 |
| GitHub Actions | https://docs.github.com/en/actions | CI |
| Next Security (另一來源) | https://www.csa.gov.sg/alerts-and-advisories/alerts/al-2026-148/ | 2026-10-20 政府資安公告確認高危影響 |
| OWASP ASVS | https://owasp.org/www-project-application-security-verification-standard/ | Web App 安全驗收標準 |

## 證據狀態

- **已核對**：官方文件明確支持的產品功能、版本與安全公告。
- **研究選型**：本文的首選、評分權重、架構分層、優化順序；不是官方承諾。
- **未實測**：同場景 Next/Nuxt/Astro/SvelteKit 等性能排名、GPU FPS、使用成本與維護成本。
- **需再查**：版本動態更新、部署平台限制、真實設備與營運費用。

若未來要聲稱「新方案比舊方案快 50%」，必須有可重現的測試方法、硬體、版本、測資、結果與誤差範圍。


## F. Three.js r187 進階 Shader／極限畫質研究（2026-11-05 增量）

此節專門支持新增的 [27｜渲染能力上限](27-threejs-r187-ultra-rendering-ceiling.md)、[28｜進階 Shader 配方](28-advanced-shader-pipeline-and-hd2d-recipes.md)、[29｜量測與採用關卡](29-rendering-ceiling-benchmark-and-adoption-gates.md)。保留既有 A–E 來源原文。**最後核對：2026-11-05（Asia/Taipei）。**

| 主張／用途 | 來源（原始或官方） | 證據層級與限制 |
| --- | --- | --- |
| Three.js r187 = 2026-10-30 release | https://github.com/mrdoob/three.js/releases/tag/r187 | 官方 release；最新狀態隨時間更新 |
| WebGPU renderer、WebGL2 fallback、TSL / 舊 GLSL 限制 | https://threejs.org/manual/pages/webgpurenderer | 官方 API；experimental / backend 不保證功能等價 |
| 新 RenderPipeline、MRT、tone mapping、velocity | https://threejs.org/manual/pages/webgpu-postprocessing.html | 官方 API；與舊 EffectComposer 不同 |
| SSGI 螢幕空間 GI 與 samples/pixel | https://threejs.org/docs/pages/SSGINode.html | 官方 API；不是 Lumen 或全場景 GI |
| SSR / DoF 示範存在性 | https://threejs.org/examples/webgpu_postprocessing_ssr.html | 官方範例；不保證跨硬體效能 |
| 高品質 DoF 範例 | https://threejs.org/examples/webgpu_postprocessing_dof.html | 官方範例；未真機測 |
| SSS Contact Shadow 的畫面內遮蔽限制 | https://threejs.org/docs/pages/SSSNode.html | 官方 API；不取代主 Shadow |
| TRAA 依賴 depth/velocity、MSAA 互斥 | https://threejs.org/docs/pages/TRAANode.html | 官方 API；ghosting 需實測 |
| WebGPU ComputeNode 與能力限制 | https://threejs.org/docs/pages/ComputeNode.html | 官方 API；WebGL2 fallback 非全部 compute 等價 |
| PBR 多層材質 | https://threejs.org/docs/pages/MeshPhysicalMaterial.html | 官方 API；開啟不同通道有 per-pixel 成本 |
| PMREM image-based lighting | https://threejs.org/docs/pages/PMREMGenerator.html | 官方 API；HDR 資產來源需另核對 |
| 紋理／輸出線性色彩工作流 | https://threejs.org/manual/pages/color-management.html | 官方手冊；自訂 Shader 要自行處理 |
| WebGPU 跨瀏覽器與 HTTPS | https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API | 平台文件；Limited Availability |
| WebGL2 GPU timer 可選 | https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query | 平台文件；不能拿 RAF 取代 GPU time |
| Geometry / meshopt / glTF 壓縮 | https://github.com/zeux/meshoptimizer/blob/master/gltf/README.md | 上游文件；新壓縮需 loader 支援 |
| KTX2 Basis 轉碼 | https://threejs.org/docs/pages/KTX2Loader.html | 官方 loader；不代表所有格式萬能 |
| BVH 與 raycast 加速 | https://github.com/gkjohnson/three-mesh-bvh | 上游開源；用途不等於全域光 |
| Progressive GPU path tracing | https://github.com/gkjohnson/three-gpu-pathtracer | 上游自述；WebGPU 必要、未在本 Repo 實跑 |
| Virtualized geometry / Nanite-style | https://github.com/VictorZakharov/threejs-nanites | 上游研究；不是 UE 官方 Nanite |

**效果配方、畫質等級、GPU 預算和 Go/No-go 門檻屬本次作者工程推導。** 研究不包含套件安裝、其他 Repo 修改或裝置 benchmark；第三方授權／素材需要逐項另查。
