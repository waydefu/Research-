# 12｜創意前端 GitHub 生態：70 候選／Top 18 深度選型
**截至 2026-11-02（Asia/Taipei），GitHub 公開 REST API 查證。** 第一輪共 70 個**可確認存在的** repo，並有兩個 redirect 候選（未計入）、沒有照星數排名。

## 方法與查證邊界
- 第一輪對每個候選查詢 GitHub REST `/repos/{owner}/{repo}`，記錄 `archived`、`pushed_at`、`license.spdx_id`。**push 日期不等於正式維護承諾、版本發布或安全性；API Unknown/NOASSERTION 不是已取得合法使用權**。
- 第二輪 Top 18 檢查 GitHub `/releases/latest`、工程定位及官方文件；若 latest 回 404 **寫 Unknown**，並非沒有 npm 發行。所有發版資訊是日期快照，對正式採用仍需核對 npm package metadata、Lockfile、Security Advisory。
- 沒有執行安裝、真實 bundle analyze、動態 FPS、Android/iOS 實機或供應鏈掃描。因此「成本高低」是**架構判斷**，不是實測結果。
- **授權**只記 API 值；`GSAP` 另核對 [標準授權全文](https://gsap.com/community/standard-license/)；其一般網站商用使用可行，但限制某些競爭性無程式碼視覺動畫工具。**非 MIT**。
- **已封存：** `dimforge/rapier.js`、`pmndrs/lamina`、`lottiefiles/lottie-player`（其中 lamina 另有候選但未列第一輪；不要推新案）；後繼候選 `dimforge/rapier`、`pmndrs/react-three-rapier` 需組合相容性驗證。
- `pmndrs/maath`、`BuilderIO/partytown` REST API 取得 redirect，**未確認 canonical path，排除已驗證計數**。

## 第一輪來源：70 個原始 GitHub 專案
| # | 類別 | 原始 Repository | GitHub API license 欄位（非法律審核） | 最後 push (UTC) |
|---:|---|---|---|---|
| 1 | 3D / GPU | [mrdoob/three.js](https://github.com/mrdoob/three.js) | MIT | 2026-11-01 |
| 2 | 3D / GPU | [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | MIT | 2026-10-21 |
| 3 | 3D / GPU | [pmndrs/drei](https://github.com/pmndrs/drei) | MIT | 2026-10-21 |
| 4 | 3D / GPU | [BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js) | Apache-2.0 | 2026-10-31 |
| 5 | 3D / GPU | [playcanvas/engine](https://github.com/playcanvas/engine) | MIT | 2026-11-01 |
| 6 | 3D / GPU | [oframe/ogl](https://github.com/oframe/ogl) | API Unknown；package.json 聲明 Unlicense（需人工審核） | 2025-04-13 |
| 7 | 3D / GPU | [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) | Zlib | 2026-11-01 |
| 8 | 3D / GPU | [pmndrs/react-postprocessing](https://github.com/pmndrs/react-postprocessing) | MIT | 2026-10-21 |
| 9 | 3D / GPU | [pmndrs/three-stdlib](https://github.com/pmndrs/three-stdlib) | MIT | 2026-06-26 |
| 10 | 3D / GPU | [gkjohnson/three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) | MIT | 2026-10-28 |
| 11 | 3D / GPU | [regl-project/regl](https://github.com/regl-project/regl) | MIT | 2026-10-17 |
| 12 | 3D / GPU | [pixijs/pixijs](https://github.com/pixijs/pixijs) | MIT | 2026-10-30 |
| 13 | 3D / GPU | [phaserjs/phaser](https://github.com/phaserjs/phaser) | MIT | 2026-08-21 |
| 14 | 3D assets / physics | [dimforge/rapier.js](https://github.com/dimforge/rapier.js) | Apache-2.0 ARCHIVED | 2026-07-12 |
| 15 | 3D assets / physics | [dimforge/rapier](https://github.com/dimforge/rapier) | Apache-2.0 | 2026-10-10 |
| 16 | 3D assets / physics | [pmndrs/react-three-rapier](https://github.com/pmndrs/react-three-rapier) | MIT | 2026-10-12 |
| 17 | 3D assets / physics | [google/model-viewer](https://github.com/google/model-viewer) | Apache-2.0 | 2026-10-23 |
| 18 | 3D assets / physics | [KhronosGroup/glTF](https://github.com/KhronosGroup/glTF) | NOASSERTION | 2026-10-30 |
| 19 | 3D assets / physics | [KhronosGroup/KTX-Software](https://github.com/KhronosGroup/KTX-Software) | NOASSERTION | 2026-11-01 |
| 20 | 3D assets / physics | [zeux/meshoptimizer](https://github.com/zeux/meshoptimizer) | MIT | 2026-10-14 |
| 21 | 3D assets / physics | [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) | MIT | 2026-10-20 |
| 22 | 3D assets / physics | [google/draco](https://github.com/google/draco) | Apache-2.0 | 2026-10-16 |
| 23 | 3D assets / physics | [visgl/loaders.gl](https://github.com/visgl/loaders.gl) | NOASSERTION | 2026-11-01 |
| 24 | Motion / interaction | [greensock/GSAP](https://github.com/greensock/GSAP) | CUSTOM | 2026-04-13 |
| 25 | Motion / interaction | [motiondivision/motion](https://github.com/motiondivision/motion) | MIT | 2026-11-01 |
| 26 | Motion / interaction | [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | MIT | 2026-10-29 |
| 27 | Motion / interaction | [rive-app/rive-runtime](https://github.com/rive-app/rive-runtime) | MIT | 2026-11-01 |
| 28 | Motion / interaction | [airbnb/lottie-web](https://github.com/airbnb/lottie-web) | MIT | 2025-09-01 |
| 29 | Motion / interaction | [lottiefiles/dotlottie-web](https://github.com/lottiefiles/dotlottie-web) | MIT | 2026-10-30 |
| 30 | Motion / interaction | [lottiefiles/lottie-player](https://github.com/lottiefiles/lottie-player) | MIT ARCHIVED | 2026-04-08 |
| 31 | Motion / interaction | [juliangarnier/anime](https://github.com/juliangarnier/anime) | MIT | 2026-08-21 |
| 32 | Motion / interaction | [theatre-js/theatre](https://github.com/theatre-js/theatre) | Apache-2.0 | 2024-08-14 |
| 33 | Motion / interaction | [barbajs/barba](https://github.com/barbajs/barba) | MIT | 2024-12-02 |
| 34 | Motion / interaction | [swup/swup](https://github.com/swup/swup) | MIT | 2026-10-27 |
| 35 | Motion / interaction | [locomotivemtl/locomotive-scroll](https://github.com/locomotivemtl/locomotive-scroll) | MIT | 2026-06-30 |
| 36 | Motion / interaction | [pmndrs/react-spring](https://github.com/pmndrs/react-spring) | MIT | 2026-11-01 |
| 37 | Motion / interaction | [pmndrs/use-gesture](https://github.com/pmndrs/use-gesture) | MIT | 2024-07-15 |
| 38 | Motion / interaction | [pmndrs/meshline](https://github.com/pmndrs/meshline) | MIT | 2024-06-03 |
| 39 | Motion / interaction | [tsparticles/tsparticles](https://github.com/tsparticles/tsparticles) | MIT | 2026-11-01 |
| 40 | Motion / interaction | [svgdotjs/svg.js](https://github.com/svgdotjs/svg.js) | NOASSERTION | 2026-08-04 |
| 41 | Motion / interaction | [tweenjs/tween.js](https://github.com/tweenjs/tween.js) | NOASSERTION | 2026-10-29 |
| 42 | Motion / interaction | [mattdesl/canvas-sketch](https://github.com/mattdesl/canvas-sketch) | MIT | 2026-06-02 |
| 43 | UI / frameworks / type | [vercel/next.js](https://github.com/vercel/next.js) | MIT | 2026-11-01 |
| 44 | UI / frameworks / type | [withastro/astro](https://github.com/withastro/astro) | NOASSERTION | 2026-11-01 |
| 45 | UI / frameworks / type | [nuxt/nuxt](https://github.com/nuxt/nuxt) | MIT | 2026-11-01 |
| 46 | UI / frameworks / type | [vuejs/core](https://github.com/vuejs/core) | MIT | 2026-11-01 |
| 47 | UI / frameworks / type | [sveltejs/svelte](https://github.com/sveltejs/svelte) | MIT | 2026-10-30 |
| 48 | UI / frameworks / type | [radix-ui/primitives](https://github.com/radix-ui/primitives) | MIT | 2026-10-14 |
| 49 | UI / frameworks / type | [adobe/react-spectrum](https://github.com/adobe/react-spectrum) | Apache-2.0 | 2026-10-29 |
| 50 | UI / frameworks / type | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | MIT | 2026-10-31 |
| 51 | UI / frameworks / type | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | MIT | 2026-11-01 |
| 52 | UI / frameworks / type | [chakra-ui/ark](https://github.com/chakra-ui/ark) | MIT | 2026-10-31 |
| 53 | UI / frameworks / type | [floating-ui/floating-ui](https://github.com/floating-ui/floating-ui) | MIT | 2026-10-27 |
| 54 | UI / frameworks / type | [ariakit/ariakit](https://github.com/ariakit/ariakit) | Unknown | 2026-11-01 |
| 55 | UI / frameworks / type | [pmndrs/zustand](https://github.com/pmndrs/zustand) | MIT | 2026-10-22 |
| 56 | UI / frameworks / type | [tanstack/query](https://github.com/tanstack/query) | MIT | 2026-11-01 |
| 57 | UI / frameworks / type | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | NOASSERTION | 2026-11-01 |
| 58 | UI / frameworks / type | [iconify/iconify](https://github.com/iconify/iconify) | MIT | 2026-11-01 |
| 59 | UI / frameworks / type | [fonttools/fonttools](https://github.com/fonttools/fonttools) | MIT | 2026-11-01 |
| 60 | UI / frameworks / type | [rsms/inter](https://github.com/rsms/inter) | OFL-1.1 | 2024-11-19 |
| 61 | UI / frameworks / type | [ag-grid/ag-grid](https://github.com/ag-grid/ag-grid) | NOASSERTION | 2026-10-31 |
| 62 | Quality / agents | [microsoft/playwright](https://github.com/microsoft/playwright) | Apache-2.0 | 2026-10-31 |
| 63 | Quality / agents | [GoogleChrome/web-vitals](https://github.com/GoogleChrome/web-vitals) | Apache-2.0 | 2026-10-30 |
| 64 | Quality / agents | [GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse) | Apache-2.0 | 2026-11-01 |
| 65 | Quality / agents | [dequelabs/axe-core](https://github.com/dequelabs/axe-core) | MPL-2.0 | 2026-11-01 |
| 66 | Quality / agents | [GoogleChromeLabs/comlink](https://github.com/GoogleChromeLabs/comlink) | Apache-2.0 | 2026-10-30 |
| 67 | Quality / agents | [GoogleChromeLabs/quicklink](https://github.com/GoogleChromeLabs/quicklink) | Apache-2.0 | 2026-11-01 |
| 68 | Quality / agents | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 | 2026-11-01 |
| 69 | Quality / agents | [flash-hero/GOATED-UI-SKILL](https://github.com/flash-hero/GOATED-UI-SKILL) | MIT | 2026-09-30 |
| 70 | Quality / agents | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT | 2026-11-01 |

## 第二輪 Top 18：真正值得深入了解
**注意：** 節點 `latest release Unknown` 指 /releases/latest 查不到，不代表 release 不存在；第三方依賴完整 bundle size / gzip / parse / GPU memory 全部待 PoC。

| # | 專案 | 2026-11-02 可確認 release | API 授權 | 能力 | 框架相容／裝置路徑（必須測） | Runtime／導入成本評估 | 建議與官網 |
|---:|---|---|---|---|---|---|---|
| 1 | [Three.js](https://github.com/mrdoob/three.js) | r187 · 10/30 | MIT | WebGL／WebGPU 渲染、PBR、Shader | 可與 React/Vue/Astro/原生整合；若要 React 宣告式用 R3F | 高：繪製與素材取決場景 | 首選 3D 主引擎；不要同頁併用別的 3D 核心 · [官方](https://threejs.org/) |
| 2 | [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | v9.8.2 · 10/15 | MIT | Three 的 React declarative layer | React / Next 適配；Vue 不直接用 | 中：不增加 GPU 能力；React 更新頻率需治理 | 只在 React 專案採用，逐幀不 setState · [官方](https://r3f.docs.pmnd.rs/) |
| 3 | [Drei](https://github.com/pmndrs/drei) | v10.7.9 · 09/25 | MIT | R3F helpers、環境、相機、材質工具 | R3F 專用 | 視實際 import、component 而定 | 白名單 import；避免全部 helpers 無審查 · [官方](https://drei.docs.pmnd.rs/) |
| 4 | [Babylon.js](https://github.com/BabylonJS/Babylon.js) | 9.33.1 · 10/30 | Apache-2.0 | 遊戲級 3D、材質／物理/XR | 框架無關，React/Vue 橋接 | 偏重：完整 3D runtime、shader 管線 | 全景、複雜 3D 應用候選；純展示先比 Three · [官方](https://doc.babylonjs.com/) |
| 5 | [PlayCanvas](https://github.com/playcanvas/engine) | v2.23.3 · 10/15 | MIT | 3D engine、WebGPU/WebGL、shader | 框架獨立 App shell | 偏重：完整場景／資產管理 | 備選引擎；先做同內容 PoC · [官方](https://developer.playcanvas.com/) |
| 6 | [OGL](https://github.com/oframe/ogl) | GitHub release Unknown；package.json 1.0.11 | API Unknown；npm manifest Unlicense | 小型 WebGL primitives、full-screen quad | 原生／Astro／Vue/React 容器可用 | 低抽象但維護自行負擔大；上游 2025/04 最後 push | 選小型液化 shader；授權未核對前不准產品採用 · [官方](https://oframe.github.io/ogl/) |
| 7 | [GSAP](https://github.com/greensock/GSAP) | latest GitHub release Unknown | GSAP standard custom | 精準 timeline、ScrollTrigger、SplitText | 原生／React hook；Vue/Astro 命令式整合 | DOM 動效低～中；過多 pin/measure 會提高主執行緒成本 | 複雜敘事一個 motion director；競品 visual builder 授權需律師確認 · [官方](https://gsap.com/docs/v3/) |
| 8 | [Motion](https://github.com/motiondivision/motion) | latest release Unknown | MIT | layout、spring、gesture、scroll | JS/React/Vue 視對應 package | 成本依 layout measure/同時執行數 | 產品 UI / state transition 優先候選 · [官方](https://motion.dev/) |
| 9 | [Lenis](https://github.com/darkroomengineering/lenis) | v1.3.27 · 10/15 | MIT | 慣性 scroll 介面 | React/原生等，需事件整合 | 潛在滾動路徑及 focus 語意負擔 | 預設不採用；只在明確需要時可移除式導入 · [官方](https://lenis.dev/) |
| 10 | [Rive runtime](https://github.com/rive-app/rive-runtime) | GitHub release Unknown | MIT(runtime) | 狀態機向量動畫 | Web Canvas/WebGL runtime 依文件及 exporter | 載入/WASM/畫布更新成本未知 | 角色、狀態回饋；編輯器與素材權利另查 · [官方](https://rive.app/docs/runtimes/web/web-js) |
| 11 | [Lottie-web](https://github.com/airbnb/lottie-web) | GitHub release Unknown | MIT | 現成向量動畫 JSON player | Web 普通 DOM/SVG/Canvas；框架包裝 | 多圖層、遮罩、多實例可能高 | 一次性 icon 動效；2025/09 後 push 未確認近期維護 · [官方](https://airbnb.io/lottie/) |
| 12 | [Postprocessing](https://github.com/pmndrs/postprocessing) | v6.39.6 · 11/01 | Zlib | Three WebGL 效果通道 | Three WebGL、React 包裝另用 react-postprocessing | 多 render-target 取樣與填色成本 | 按需 Bloom/DOF；與 Three TSL 新 stack 不可無痛混用 · [官方](https://github.com/pmndrs/postprocessing) |
| 13 | [model-viewer](https://github.com/google/model-viewer) | v4.4.0 · 10/09 | Apache-2.0 | 產品單模型 3D Viewer/AR | 原生 Web Component；各框架可嵌 | 對簡單展示 DX 低；3D 資產同樣吃 GPU | 商用產品頁優先評估比自造引擎便宜 · [官方](https://modelviewer.dev/) |
| 14 | [meshoptimizer](https://github.com/zeux/meshoptimizer) | v1.3 · 09/25 | MIT | meshlet/幾何最佳化、meshopt | 建置期工具；不綁 React/Vue | 資產預處理代價；runtime decode／render 測量 | 常設 Asset Pipeline 候選 · [官方](https://meshoptimizer.org/) |
| 15 | [glTF-Transform](https://github.com/donmccurdy/glTF-Transform) | GitHub release Unknown | MIT | glTF 檢查、轉換與壓縮 | CLI/build 階段；框架無關 | 可減少傳輸但壓縮誤差須 visual regression | 推薦工具管線；非前景 runtime · [官方](https://gltf-transform.dev/) |
| 16 | [Radix Primitives](https://github.com/radix-ui/primitives) | GitHub release Unknown | MIT | keyboard/focus/dialog/popover/menu | React；Next/R3F 的 DOM overlay 可用 | 純 DOM 成本按使用元件 | React UI 的無障礙基線候選 · [官方](https://www.radix-ui.com/primitives) |
| 17 | [React Aria](https://github.com/adobe/react-spectrum) | react-aria-components@1.22.0 · 10/09 | Apache-2.0 | 互動行為、多語言、accessibility | React 專用 | 功能多但只按需 import | 嚴格 UX 優先；與 Radix 擇一比對 · [官方](https://react-spectrum.adobe.com/react-aria/) |
| 18 | [web-vitals](https://github.com/GoogleChrome/web-vitals) | GitHub release Unknown | Apache-2.0 | 真實使用者 CWV 監控 | 框架無關的瀏覽器端 | 執行時輕量埋點但送報需成本評估 | RUM 採用；與 FPS frame sampling 分開 · [官方](https://github.com/GoogleChrome/web-vitals) |

## 18 項供應鏈／相容性檢查契約
| 問題 | 真正需驗證的證據 | 放行門檻 |
|---|---|---|
| 商用權利 | 完整 LICENSE／NOTICE、runtime／editor／素材附約、版本 hash | 法務條件符合產品用途，NOASSERTION/Unknown 不可直接核准 |
| 最近維護 | 官方 release 頁＋CHANGELOG＋最後 security fix／issues | 無公開維護窗口或封存 → 先替代 |
| React / Next | SSR import 是否觸發 window、client island、Hydration、Strict Mode cleanup | SSR 正常、路由重進無 duplicate canvas |
| Vue / Nuxt | 是否有維護中的 wrapper 或直接 imperative mount | 能清理 event、RAF、GPU memory |
| Astro | client directive 是否只 hydrate 互動島、非首屏 3D chunk 是否延遲 | HTML 首屏不依賴 canvas、SEO 保留 |
| Bundle / runtime | bundle analyzer 的 **同條件 production min+gzip**、main-thread parse/eval；tree shake | 不以 npm unpacked size 取代 bundle |
| 裝置 | Chrome Android、Samsung Internet、Safari iOS、macOS Safari、Firefox、桌面 Chrome/Edge | 主功能鍵盤／觸控／低階 fallback PASS |
| 安全 | Advisory、dependency graph、lockfile、許可清單、SRI/CDN policy | 無未處理高危漏洞；不用 runtime CDN 注入 |
| 視覺客製 | Shader pass、font、theme、state machine 是否有完整生命週期 | 可控制時序、可關閉、可視覺回歸 |
| 效能 | cold/warm load、p95 frame-time、INP/LCP/CLS、GPU memory（有可行儀器才記） | 不超出各裝置策略；無數據只能「待驗證」 |

## 特別容易做錯的決策
1. **GSAP free ≠ MIT／可做 Webflow 競品視覺動畫編輯器。** 授權類別不同；商業網站可用不表示能任意再授權。
2. **Three WebGPURenderer fallback ≠ legacy EffectComposer 或 ShaderMaterial 自動遷移。** 應分開 WebGL-GLSL 與 WebGPU-TSL 技術債。
3. **OGL 小 ≠ 最快。** draw call、後製、貼圖尺寸與 fullscreen shader steps 可使小 library 的效果比大引擎更耗。
4. **Rive runtime MIT ≠ 任一 Rive 素材／付費 Editor 使用權一樣。**
5. **Radix 和 React Aria 通常選一個主控行為系統**，避免 Dialog / FocusManager 重疊。
6. **提供 3D 的 engine 與 Web 應用 SSR framework 是兩條獨立決策軸**，不要因選 Next 就假設要 R3F。
7. **明星數、repo 最近 push 和 release 版本都不能當成安全認證**。

## 核心工具庫（建議，不是已安裝）
- **Always:** CSS Tokens、Semantic HTML、Playwright、axe-core、web-vitals、資產證據／授權清單。
- **Motion:** GSAP **或** Motion，簡單轉場先 CSS/View Transitions。
- **3D:** Three.js；React 才加 R3F/Drei。替代 PlayCanvas/Babylon 要用同內容 PoC 說話。
- **Assets:** glTF-Transform + meshoptimizer + KTX2（仍測壓縮品質）。
- **Optional:** OGL、Lenis、Rive、postprocessing、Rapier；任何一項都必須有明確用例與退出策略。

## 查證原始入口
- Repo 每列均有 GitHub 原始 URL；Top 18 另含官方文檔。
- GitHub repo metadata `GET https://api.github.com/repos/<owner>/<repo>` 與 `.../releases/latest`，2026-11-02 現場讀取。
- [GSAP 使用限制](https://gsap.com/community/standard-license/)。
- [Three WebGPU 能力／遷移](https://threejs.org/manual/pages/webgpurenderer)。
- [WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)。


## 第二輪修正與授權證據（2026-11-02，直讀上游程式檔）

**OGL：** GitHub API 的 `license.spdx_id` 為 Unknown，且根目錄沒有 `LICENSE`。不過 [官方 repo 的 package.json](https://github.com/oframe/ogl/blob/master/package.json) 宣告 `license: "Unlicense"`、`version: "1.0.11"`。這使「套件聲明」可從 Unknown 提升到可查，但**不等於**已找到完整授權全文、符合每個公司法律條件。正式商用採用要再核對實際 npm tarball 內容、原始程式授權與 notice。

**GSAP：** [官方 repo package.json](https://github.com/greensock/GSAP/blob/master/package.json) 聲明 `version: 3.15.0` 與 Standard no-charge license；此為 **Git 原始碼 manifest 的版本**，非 `/releases/latest` 或正式 npm dist-tag 驗證。 [官方授權全文](https://gsap.com/community/standard-license/) 區分網站／App 中的 permitted uses 與可能競爭 Webflow 視覺動畫編輯工具的 prohibited uses；**不能將「免費」等同可自由再授權**。

**封存：** `dimforge/rapier.js` 與 `LottieFiles/lottie-player` 的 GitHub `archived: true` 已確認，不建議新專案直接以這兩者當長期主要核心。`dimforge/rapier` 是另一條未封存 repo，**不能**因此推斷舊 rapier.js API 與它的 WASM 版本百分百相容。

**重導向：** `pmndrs/maath`、`BuilderIO/partytown` 舊路徑 REST 查詢得到 `Moved Permanently`；在未取得 canonical URL 與來源前，不補成已查證候選，避免重複／失真計數。

### 商用與安全前置關卡（不能以 Stars、npm weekly downloads 放行）

| 導入分類 | 必須額外取證 | 未驗證時的處理 |
|---|---|---|
| GSAP／特殊 license | 完整 license、產品是否視覺動畫 builder、限制是否適用 | 常規網站可列候選；builder 場景法律審查 |
| OGL／API unknown | repo manifest 與包內 LICENSE/NOTICE 是否一致 | 不標為商用授權通過 |
| Rive、Lottie | runtime license vs 圖形素材與編輯器費用 | 核准 runtime 不代表核准素材 |
| WebGPU／TSL | WebGPU device features、WebGL2 fallback、shader 及後製 migration | 不可將可 fallback 當成可原樣兼容 |
| 跨端 | 實機 WebKit／Chromium／Gecko、觸控與 keyboard | 無結果為 Unknown，不給精確 FPS |
| 供應鏈 | 鎖版、transitive dependencies、advisory、maintainer/release、SBOM 可再生性 | 不作「無漏洞」宣告 |

**不同框架的實際整合成本必須單獨測：** React 的 R3F lifecycle 不能直接套 Vue；Next SSR 要檢查 browser globals/hydration；Astro 的 GPU canvas 只以 client island 初始化，否則 LCP 可能由大型 3D JS 阻塞。這些是驗證提案，不是此研究已完成的安裝測試。
