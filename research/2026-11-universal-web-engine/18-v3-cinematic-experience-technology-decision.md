# 18｜THE OBSERVATORY V3：全部 Web／Creative Web 技術盤點及最佳技術組合

> **研究決策草案 v1｜2026-11-02（Asia/Taipei）｜待 Repo Owner 審查**  
> **範圍：** Research- 已有的 2026/11 Web 工程研究（01–17）、70 個 GitHub 候選、10 種特效、5 個尚待實測 PoC 與 V2 原始碼審查。  
> **重要：** 這是**研究報告**，不是已安裝、已部署、已驗收的 V3；本 PR 不修改 Showcase 的 JS、CSS、資產、工作流程或 Pages 設定。不宣稱已在 Android／iOS 測得 FPS、功耗或 Web Vitals。

## 0. 結論：對這個產品的最佳組合

**首選（需先以 PoC 與實際視覺驗收確認）：Vite + TypeScript + Three.js WebGLRenderer（WebGL2）+ Blender + GSAP Timeline／有限 ScrollTrigger + 自訂 GLSL + 自架繁體中文字體／Semantic DOM + 現有 Markdown 建置索引。**

- **Vite／TypeScript：** 簡潔的靜態前端工程；不為沒有會員／交易／SSR 需求的沉浸單頁增加 RSC、Server Actions 或 DB。
- **Three.js WebGL2：** 單一持續 3D 世界、原創模型、PBR 材質、自訂 shader、相機與有限後製。WebGPU 保留獨立 PoC，不在第一階段依賴實驗性的 TSL／WebGPURenderer。
- **Blender：** 原創幾何主體、鏡頭、材質、光照、構圖和動畫的製作源頭；將適合即時運行的資產輸出為 glTF/GLB。
- **GSAP Timeline + 有限 ScrollTrigger：** 以一個主敘事時間軸同時控制攝影機、燈光、模型、場景變形與中文文字。**保留原生捲動**，不需要同時使用 Lenis、Locomotive Scroll、Motion 和多套事件迴圈。
- **GLSL + 少量 Selective Bloom：** 保留材質的陰影、高光及空間層次；反射、體積光、粒子與後製依真機量測才增加。
- **Noto Serif TC／Noto Sans TC + FontTools：** 繁體中文作為畫面主語；短標題採明體與更有導演感的排版，搜尋／表單用黑體，來源 SHA／英文技術資料才用等寬字。正式導入前查核字體來源、SIL OFL、繁中覆蓋及 WOFF2 subset。
- **現有 Markdown → JSON 索引：** 一個真實資料來源，維持來源 commit、原文鏈結、搜尋與分類；所有主要文字和互動控制留在可存取的 DOM。
- **GitHub Actions + GitHub Pages：** 先維持現有靜態部署，別因換視覺技術而無必要引入新伺服器。

這是**針對 THE OBSERVATORY V3 的產品適配首選**，不是對每個框架或渲染器的通用性能排名。

## 1. 目標與驗收定義

使用者明確要求：全站像**一部可親自探索的互動 3D 電影／完整數位藝術品**；繁體中文主導且有明顯的字體變化；畫面**連續而具空間因果**，不是 Hero→介紹→長方形卡片→Footer。不能只在普通網站背後放一個固定旋轉的 WebGL 圓環；應由鏡頭、空間、材質、光線與研究資料形成真正連貫的敘事。

**不能接受：**

1. 只換字體、色碼、Glow、粒子而保留普通分段網頁的結構。
2. 宣稱「六個 Scene」卻只改同一模型的旋轉角度、背景色。
3. 讓影片或 Canvas 成為唯一閱讀／搜尋／控制入口。
4. 為了美術抄用 Active Theory、Arctic Waters、動畫截圖的具體模型、徽章、字形、原始碼或紋理。
5. 以 CI 綠燈、PR 合併、官方工具宣傳數字當作已達電影級視覺品質的證據。
6. 將桌面效果按比例縮小當成已完成的手機版。

**可接受的形式：** 一個即時 3D 世界、少量真正有意義的情節節點、可倒退／跳過的相機行程、原創高品質靜止構圖、直接可搜尋的研究資料庫、完整失敗降級和多裝置驗收。章節數不應預設為六。

## 2. 已研究的技術家族與實際用途

> 以下列出本研究庫涵蓋的主要技術、函式庫、標準與演算法。**「研究過」不代表曾安裝或量測。** 原始證據在後述連結。

| 類別 | 研究過的技術／選項 | V3 判斷 |
| --- | --- | --- |
| Web framework | Next.js、React、React Router Framework Mode、TanStack Start、Vue／Nuxt、Svelte／SvelteKit、Astro、Vite + React、靜態原生 HTML/ESM | **Vite + TypeScript**，無必要不增加全端框架 |
| 渲染策略 | CSR、SSR、SSG／Prerender、RSC、Streaming／Suspense、Islands、Cache Components | 靜態 HTML/JSON + 客戶端互動，否則增加複雜度 |
| 語言與工具 | JavaScript、TypeScript、GLSL、WGSL、HTML/CSS、SQL、Zod、Node LTS、Bun、Deno、Vite/Rolldown、Turbopack、pnpm、Turborepo／Nx、ESLint／Biome／Prettier／Oxc | TypeScript 和 Vite 建置，固定 lockfile；不用為小站硬上 monorepo |
| GPU／2D／3D | WebGL2、WebGPU、Three.js／TSL、R3F/Drei、PlayCanvas、Babylon.js、OGL、regl、PixiJS、Phaser、Canvas 2D、SVG、OffscreenCanvas | **一個 Three.js WebGLRenderer**；WebGPU 能力探測／PoC 必須獨立 |
| 3D 管線 | Blender、Tripo Studio（作者案例）、glTF/GLB、GLTFLoader、AnimationMixer、KTX2／Basis Universal、Draco、meshopt、glTF-Transform、LOD、Instancing、Culling、Geometry Batching | Blender 原創資產 → 壓縮 → 控制 draw calls / memory |
| 3D 光照／材質 | PBR、GGX BRDF、Metallic/Roughness、Normal Map、IBL、HDRI、PMREM、Environment Reflection、ACES Tone Mapping、Refraction、Glass、Linear Color Management | 金屬細節與真實受光優先，Bloom 是最後修飾 |
| Shaders／計算 | GLSL ES、WGSL、SDF、Ray Marching、Vertex Displacement、Morph Targets、Skinning、Compute、Transform Feedback、FBO、Instancing | 有效的幾何與材質主線，按需求加少量 GPU 效果 |
| 後處理／電影語言 | HDR / Selective Bloom、SSR、DOF、Motion Blur、Volumetric Fog/Rays、Chromatic Aberration、Film Grain、Lens／Grain Distortion、TAA 候選 | **低成本可控的 Selective Bloom**，其餘需性能證據 |
| 動畫 | GSAP Timeline、ScrollTrigger、Motion、Anime.js、Rive State Machine、Lottie／dotLottie、Theatre.js、React Spring、Tween.js、CSS/WAAPI、CSS Scroll/View Timeline、View Transitions | **一個 GSAP 敘事時間軸**；其他僅局部、無共享動畫控制 |
| 滾動／導覽／手勢 | 原生 Scroll、Lenis、Locomotive Scroll、Barba.js、Swup、Pointer Spring、Gesture、Camera Spline、Quaternion Slerp、Raycast、Shared Element | 原生捲動與單一狀態模型；實際 3D 鏡頭曲線 |
| UI／版面／字型 | Semantic DOM、Design Tokens、CSS Variables、Container Queries、Grid/Subgrid、Tailwind、Radix、React Aria、shadcn/ui、Ark UI、FontTools、Inter、Instrument Serif、Manrope、IBM Plex Mono、Noto Serif TC、Noto Sans TC | **繁中編輯式排版**和字型子集；CSS 不等於視覺總監 |
| UI／資料狀態 | React context/useState、Zustand、TanStack Query、React Hook Form、TanStack Form、Zod | 小型 TypeScript Experience State 足夠；研究資料只留一套 cache |
| 後端／身分 | Hono、Fastify、NestJS、Next Route Handlers／Server Functions、Cloudflare Workers、Auth.js、Better Auth、OAuth/OIDC、Passkeys、RLS | V3 靜態研究館**不採用**；需求改變再重評 |
| DB／儲存 | Markdown Index、PostgreSQL、SQLite、Redis、Drizzle、Prisma、S3/R2、Full-text／Vector Search | **保留現有 Markdown 索引**；避免平白引入 DB |
| 品質／資安／部署 | Vitest、Playwright、axe-core、Lighthouse、web-vitals、PerformanceObserver、Chrome DevTools、GPU Profiling、GitHub Actions／Pages、Cloudflare／Vercel、WCAG 2.2 AA、CSP、SCA、OpenTelemetry | CI + Desktop/Android/iOS 真機實驗 + 靜態部署與回退 |

### 2.1 研究庫的 70 個 GitHub 候選（全部依原索引順序）

**3D／GPU（1–13）：**  
1. mrdoob/three.js  
2. pmndrs/react-three-fiber  
3. pmndrs/drei  
4. BabylonJS/Babylon.js  
5. playcanvas/engine  
6. oframe/ogl  
7. pmndrs/postprocessing  
8. pmndrs/react-postprocessing  
9. pmndrs/three-stdlib  
10. gkjohnson/three-mesh-bvh  
11. regl-project/regl  
12. pixijs/pixijs  
13. phaserjs/phaser

**3D 資產／物理（14–23）：**  
14. dimforge/rapier.js（歷史封存）  
15. dimforge/rapier  
16. pmndrs/react-three-rapier  
17. google/model-viewer  
18. KhronosGroup/glTF  
19. KhronosGroup/KTX-Software  
20. zeux/meshoptimizer  
21. donmccurdy/glTF-Transform  
22. google/draco  
23. visgl/loaders.gl

**Motion／互動（24–42）：**  
24. greensock/GSAP  
25. motiondivision/motion  
26. darkroomengineering/lenis  
27. rive-app/rive-runtime  
28. airbnb/lottie-web  
29. lottiefiles/dotlottie-web  
30. lottiefiles/lottie-player（歷史封存）  
31. juliangarnier/anime  
32. theatre-js/theatre  
33. barbajs/barba  
34. swup/swup  
35. locomotivemtl/locomotive-scroll  
36. pmndrs/react-spring  
37. pmndrs/use-gesture  
38. pmndrs/meshline  
39. tsparticles/tsparticles  
40. svgdotjs/svg.js  
41. tweenjs/tween.js  
42. mattdesl/canvas-sketch

**UI／框架／字型（43–61）：**  
43. vercel/next.js  
44. withastro/astro  
45. nuxt/nuxt  
46. vuejs/core  
47. sveltejs/svelte  
48. radix-ui/primitives  
49. adobe/react-spectrum  
50. shadcn-ui/ui  
51. tailwindlabs/tailwindcss  
52. chakra-ui/ark  
53. floating-ui/floating-ui  
54. ariakit/ariakit  
55. pmndrs/zustand  
56. tanstack/query  
57. lucide-icons/lucide  
58. iconify/iconify  
59. fonttools/fonttools  
60. rsms/inter  
61. ag-grid/ag-grid

**Quality／Agent 設計輔助（62–70）：**  
62. microsoft/playwright  
63. GoogleChrome/web-vitals  
64. GoogleChrome/lighthouse  
65. dequelabs/axe-core  
66. GoogleChromeLabs/comlink  
67. GoogleChromeLabs/quicklink  
68. pbakaus/impeccable  
69. flash-hero/GOATED-UI-SKILL  
70. nextlevelbuilder/ui-ux-pro-max-skill

**計數和證據：** 13 + 10 + 19 + 19 + 9 = **70**。GitHub API 的授權欄位有 Unknown／NOASSERTION，不等於無授權；原研究已另對 OGL 的 package.json／Unlicense 補充查證。採用前仍須讀固定版本的原始 LICENSE 並留存，不能拿此表直接當法律意見。[完整快照與原始連結](12-github-creative-ecosystem.md)。

## 3. 十種研究過的視覺效果與 V3 是否採用

| # | 視覺技術 | 最小工程流程 | 決策 |
| ---: | --- | --- | --- |
| 01 | Liquid Distortion | Pointer → velocity/flow FBO → UV offset | 備選；僅局部觸控 |
| 02 | RGB Split / Chromatic Aberration | Velocity → 多色通道取樣 → composite | 備選；極短轉場 |
| 03 | Dissolve / Grain | Noise mask + smoothstep → textures mix | 備選；實際材質敘事 |
| 04 | HDR Selective Bloom | HDR → bright pass → 低解析模糊 → 合成 | **優先，但需控制亮度及 fill rate** |
| 05 | Volumetric Rays / Fog | Depth + sparse volume → low-res composite | 次選；手機降級 |
| 06 | Particle Assemble | Target positions → instanced interpolation | 只有內容有「重組證據」時採 |
| 07 | SDF Morph / Ray March | SDF blends → sphere tracing → normals | 局部抽象形變，非全螢幕強制 |
| 08 | Interactive Fluid | Advection/pressure → ping-pong FBO | 不採主路線，除非 PoC 證明必要 |
| 09 | 3D Exploded View | Named GLB nodes → semantic transforms / raycast | **優先用於原創觀測核心拆解** |
| 10 | Scroll Camera Narrative | Native scroll → single timeline → spline/slerp camera | **V3 敘事骨幹** |

**五種既有 PoC 規格**：Flow Distortion；PBR + 3D Exploded View；Scroll Camera + View Transitions；Particles WebGL2/WebGPU/Static 比較；反模板品牌與字體盲測。它們目前是**設計測試契約，不是已完成測試**；詳細見 [14｜Effects Recipes](14-effects-recipes-and-poc-validation.md)。

## 4. 候選技術組合比較（產品適配分析，非性能 Benchmark）

| 方案 | 組合 | 優勢 | 代價／淘汰主因 |
| --- | --- | --- | --- |
| **A：Cinema-first（首選）** | Vite + TS + Three.js WebGL2 + Blender + GSAP + DOM | 同一相機、一個渲染器、一條時間軸；直接靜態部署 | 需要真正高品質模型、美術總監、真機 QA |
| B：Content-first | Astro + Islands + CSS + 小規模 Three | 文字與 SEO 體驗良好、按需 JS | 全站持續 3D 世界和單一時間軸需額外整合 |
| C：React world | Vite + React + R3F/Drei + GSAP/Motion | 許多 React UI、場景元件時可管理 | React 容器不會自動提升 GPU FPS 或美術品質 |
| D：WebGPU-first | Three WebGPURenderer + TSL/WGSL | 有未來 GPU Compute 空間 | 官方仍視部分為實驗性，舊 GLSL/後製不能無痛搬移 |
| E：Game engine-heavy | Babylon 或 PlayCanvas + app shell | 適合 XR／遊戲式場景與完整工程系統 | 目前場景功能尚不足以證明全面替換 Three 更有價值 |

**為何不預設 Next.js：** SSR/RSC/Server Actions 的主要收益不在單一靜態互動電影；Next/Turbopack 不會神奇改善 GPU frame time。  
**為何不用 R3F 為預設：** 這裡的重點是場景製作與電影鏡頭，直接 Three 更容易隔離 GPU 每幀更新；不是聲稱 R3F 一定比較慢。  
**為何不用全站 Smooth Scroll：** 非必要改動自然滾動常帶來焦點、恢復位置、觸控與可及性副作用。  
**為何 WebGPU 另測：** WebGPU adapter／feature／device lost 支援必須現場探測；ShaderMaterial 與部分舊後製方案不能直接移植。

## 5. V3 結構：一個世界、一條時間軸、同一份研究資料

```text
                  美術設計／Design Atlas／原創故事板
                                  │
             Blender（模型、材質、鏡頭、構圖、動畫）
                                  │
                   GLB / meshopt / KTX2 / licenses
                                  │
                       Vite + TypeScript
                 ┌────────────────┴─────────────────┐
                 │                                  │
          Scene State / Director            繁中 DOM + CSS
          唯一 GSAP Timeline                字卡、操作、閱讀
                 │                                  │
          Three.js WebGL2                    Markdown index
          Camera / PBR / GLSL             source SHA／來源連結
                 └──────────同一資料與互動狀態──────────┘
                                  │
                   GPU 分級／降級／reduced motion
                                  │
                       GitHub Pages（靜態）
```

**概念狀態（尚未實作，不是既有 API）：**
- chapter：當前敘事認知階段，而不是傳統 HTML section 的編號；
- narrativeProgress：可快進、倒退、停止的 0..1 動畫進度；
- selectedDomain／selectedDocumentPath：真實資料驅動的 3D 聚焦和研究入口；
- motion：on / paused / reduced；
- quality：ultra / high / balanced / basic；
- sourceCommit：若缺失則顯示 Unknown，不虛構檔案來源。

使用者可從電影式探索直接跳至研究索引；不必被迫看完片頭。即使 WebGL 不可用，所有文件依然有鍵盤、觸控和可閱讀入口。

## 6. 繁體中文美術字體：具體策略

| 語意角色 | 候選字體 | 工程政策 |
| --- | --- | --- |
| 大型藝術主標／鏡頭轉折 | Noto Serif TC | 自架、短標題 subset、驗證繁中標點和斷行 |
| 敘事與閱讀 | Noto Serif TC（依對比和可讀性切換） | 明體不是所有長文的唯一選擇 |
| 操作、搜尋、研究列表 | Noto Sans TC | 清晰、多字重、手機閱讀優先 |
| commit、路徑、數字 | IBM Plex Mono | 只用於必要的拉丁技術資訊 |
| 少量英文字標 | Instrument Serif／既有字體 | 英文不再壟斷 Hero |

正式導入須核實所用版本的 OFL.txt，FontTools/pyftsubset 產生合法 WOFF2，保留完整 fallback 和漏字測試；中文大字**不能只靠系統預設字體假裝已完成展示字型設計**。

## 7. 吸收 Active Theory 與 Arctic Waters 的方法，而非複製素材

- **Active Theory：** 作者案例支持 WebGL 敘事與導覽結合、場景空間、自由探索／快速索引並存；對 V3 的轉譯是同一個場景狀態模型與有目的的鏡頭。**不推定**作品使用所有研究過的套件。
- **Arctic Waters：** 作者自述以 Tripo 生成部分 3D 資產、在 Blender rig／修整，Three.js 即時渲染。可學的是「AI 3D 輔助→Blender 精修→導演燈光→Web 即時場景→可重現 QA」工作流程；4K60 為作者宣稱，**未經本站實測**。
- **Art Direction Lab（建議）：** QA-only 的燈光／金屬度／粗糙度／曝光／Bloom／FOV 滑桿；Freeze、自由相機、固定視角截圖、黑白輪廓比較。每個 preset 要能序列化、重播和版本對照。
- **真正品質標準：** 即使關掉動畫／Bloom，畫面仍具原創輪廓與構圖；每個鏡頭都必須能說明自己揭示了哪些研究內容。

## 8. 驗收 Gate：順序比技術數量重要

| Gate | 審查用交付物 | 通過才往下走 |
| --- | --- | --- |
| **G0：藝術與文字導演** | 三種繁中首屏／舞台構圖、字型階層、原創 silhouette、完整分鏡與 Design Atlas | Owner 以**靜止畫面**認可美術識別 |
| **G1：一個精緻 3D PoC** | 原創 Blender 模型、PBR 材質、可調光源、Freeze／Free Camera、單場景 Preview | 不是四個粗糙圓環加 Glow；材質、黑位與相機自洽 |
| **G2：連續電影** | 一條主 Timeline、三個有因果的變形／揭示、可正反播放、可中斷跳轉 | 主觀審查不再是多張傳統網站 Section 拼接 |
| **G3：研究功能** | 真實 Markdown、領域／文件選取、可搜尋和開原始碼，DOM fallback | 視覺世界與內容同一狀態，功能不因 GPU 消失 |
| **G4：真機／可及性／正式釋出** | Desktop＋Android＋iOS、性能／熱／GPU context loss、TalkBack／VoiceOver、reduced-motion | Owner 人工審核後再合併、部署 |

**量測不是承諾：** 官方 Web Vitals 良好界線 LCP p75 ≤ 2.5s、INP p75 ≤ 200ms、CLS p75 ≤ 0.1；V3 沒有實測通過記錄。高階裝置可設 60 FPS 目標（16.67 ms 理論幀預算），較弱裝置按觀察選 30 FPS／靜態版本；rAF p95 並不是 GPU frame time，也不能取代使用者端 INP p75。測試應記裝置、Browser、DPR、溫度、刷新率和失敗處理。

## 9. 技術禁用及重新評估觸發

| 暫不納入 | 理由 | 什麼時候重新評估 |
| --- | --- | --- |
| Next + Nuxt + Astro 多框架 | 增加 server/client 邊界與維護成本 | 公開站出現實際 SSR／會員需求 |
| React Three Fiber / Drei | 此作品一條主場景路徑不需要 React 統治 GPU 更新 | 需要大型宣告式 3D 編輯器且 PoC 佔優 |
| Babylon / PlayCanvas + Three 同時運作 | 重複 3D 引擎及裝置資源 | Three 技術限制經同場景比較證實 |
| WebGPU-first + 舊 GLSL shader 混合 | Renderer、TSL、後製的相容性／遷移風險 | WebGPU PoC 在目標手機具可靠收益 |
| GSAP + Motion + Anime + Rive 全管一套相機 | Timeline 競速、狀態失真 | 僅分離無交叉屬性的 UI 小動畫 |
| Lenis + Locomotive 強制 scroll hijack | 原生觸控、焦點與回上一頁行為風險 | 真機操作及可及性證明收益 |
| 全螢幕 SSR／Volumetric／Fluid 多 pass | 移動 GPU 成本可能失控 | 可量測的視覺收益及品質階梯 |
| 新增 PostgreSQL、Prisma、Auth | 無後端寫入／身份驗證產品需求 | Repo Owner 明示新產品需求 |

## 10. 原始文件與官方參考

**Research- 研究證據鏈：**
- [01 框架](01-framework-selection.md)、[02 Next.js](02-nextjs-deep-dive.md)、[03 UI](03-frontend-ui-and-state.md)、[04 Backend](04-backend-data-and-auth.md)、[05 DX](05-runtime-build-and-dx.md)；
- [06 GPU／相容性](06-graphics-and-compatibility.md)、[07 效能／A11y](07-performance-and-accessibility.md)、[08 安全部署](08-security-testing-and-deployment.md)、[09 參考 Stacks](09-reference-stacks-and-migration.md)；
- [10 28 個案例](10-creative-direction-and-reference-sites.md)、[11 Motion／Shader](11-motion-graphics-and-rendering.md)、[12 70 個 GitHub 候選](12-github-creative-ecosystem.md)、[13 Creative Stacks／Top 20](13-design-performance-and-architecture.md)、[14 10 效果／5 PoC](14-effects-recipes-and-poc-validation.md)、[15 來源驗證](15-creative-web-evidence-and-adoption.md)、[16 Active Theory](16-active-theory-quality-benchmark.md)、[17 Arctic Waters](17-arctic-waters-threejs-creative-workflow.md)；
- [V2 美術規格](../../showcase/design/V2-ART-DIRECTION.md)、[V2 技術驗收](../../showcase/design/V2-ENGINEERING-ACCEPTANCE.md)、[V2 字型授權](../../showcase/design/V2-FONT-LICENSES.md)。

**直接官方資料／API／授權（由上述研究整理，真正引入時須再次核對版本）：**
- Vite：https://vite.dev/guide/
- Three.js WebGL Renderer：https://threejs.org/docs/#api/en/renderers/WebGLRenderer
- Three.js WebGPU 相容限制：https://threejs.org/manual/pages/webgpurenderer
- GSAP Timeline：https://gsap.com/docs/v3/GSAP/Timeline/
- ScrollTrigger：https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP 授權：https://gsap.com/standard-license
- glTF：https://github.com/KhronosGroup/glTF/tree/main/extensions
- glTF-Transform：https://gltf-transform.dev/
- meshoptimizer：https://meshoptimizer.org/
- FontTools subset：https://fonttools.readthedocs.io/en/latest/subset/index.html
- Noto 授權：https://github.com/notofonts/noto-docs/blob/main/docs/website/use.md
- Google Web Vitals：https://web.dev/articles/vitals
- WCAG 2.2：https://www.w3.org/TR/WCAG22/

## 11. Owner 審查清單

- [ ] 認可「繁中為主、全程連續互動電影、研究資料可探索」為最優先品質方向。
- [ ] 認可 Vite + TypeScript + Three.js WebGL2 + Blender + GSAP 為**首選候選**，PoC 不合格可以重選，不視作已安裝承諾。
- [ ] 認可自架繁中文字型與美術分鏡需先通過視覺 G0，再開發昂貴的 shader／asset。
- [ ] 認可只採一個主要 Renderer／Motion Director，按實測加特效。
- [ ] 認可 G0 → G4 分階段驗收，先做一個完成度高的場景，不以 PR/CI 綠燈代替畫面驗收。
- [ ] 審完本報告**另行授權** V3 實作，不把文件 PR 合併視為自動開工許可。

---

**修訂紀錄｜2026-11-02 v1**：從既有 01–17 研究建立完整候選清單、70 GitHub、10 特效、架構 ADR 與逐 Gate 驗收方案。沒有變更現網、部署／權限／自動化設定，沒有獨立完成裝置基準測試。