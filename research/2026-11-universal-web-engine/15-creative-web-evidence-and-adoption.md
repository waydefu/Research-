# 15｜Creative Web 來源索引、證據衝突、驗收與研究決策紀錄
**研究與連結查證日期：2026-11-02（Asia/Taipei）**　**對應 [10](10-creative-direction-and-reference-sites.md)、[11](11-motion-graphics-and-rendering.md)、[12](12-github-creative-ecosystem.md)、[13](13-design-performance-and-architecture.md)、[14](14-effects-recipes-and-poc-validation.md)。**

## 1. 證據分級與不完整性（避免虛假「已實測」）
| 分類 | 代表 | 此批研究如何使用 |
|---|---|---|
| V＝已驗證文字／原始碼 | 官方 API、作者描述、GitHub repo metadata、公開範例 | 可直接引用具體功能，但不外推至部署效果 |
| H＝高可信推論 | Render passes 多會增加 bandwidth / shader samples，reactive UI 在 DOM 更適合可及性 | 標理論推論；沒有 FPS 排名 |
| R＝研究建議 | Design Tokens、A/B/C Stack、Tier、特效次序、PoC 門檻 | 需實際產品約束後才採用 |
| U＝Unknown／未測試 | 作品隱藏技術棧、Bundle size、GPU memory、手機功耗、fps、license 附約 | 保留空值，不寫假數字 |

GitHub 第一輪透過 2026-11-02 公開 API `/repos/{owner}/{repo}` 確認 **70** 個 repo 存在及部分維護/授權 metadata，第二輪對 **18** 個做 release/documentation 選型盤點；並非 70 個 repo 全部做到逐項依賴漏洞與手機真機測試。封存/Unknown 已註記在第 12 篇。官方 GitHub 原始連結逐列列於第 12 篇，本文不重貼 70 次。

## 2. 本批增量研究原始來源（40 個）
| # | 領域 | 原始來源／文獻 | 來源可支持的主張與限制 | 查證日 |
|---:|---|---|---|---|
| 1 | 瀏覽器 | [WebGPU API 非 Baseline + HTTPS](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) | 已核對官方定義；實際裝置組合 Unknown | 2026-11-02 |
| 2 | 瀏覽器 | [GPU Adapter、Feature 探測](https://developer.mozilla.org/en-US/docs/Web/API/GPUAdapter) | 已核對原始 API；適配未知 | 2026-11-02 |
| 3 | 瀏覽器 | [GPU lost](https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/lost) | 官方 API | 2026-11-02 |
| 4 | 瀏覽器 | [View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) | 官方 API；需 feature detection | 2026-11-02 |
| 5 | 瀏覽器 | [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) | 官方 API；renderer worker 相容另查 | 2026-11-02 |
| 6 | 瀏覽器 | [Reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | 官方 API | 2026-11-02 |
| 7 | 瀏覽器 | [WebGL2](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext) | 官方 API | 2026-11-02 |
| 8 | 標準 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | 官方規格；AA 自動掃描非完整驗證 | 2026-11-02 |
| 9 | 效能 | [Core Web Vitals](https://web.dev/articles/vitals) | 官方 p75 規範；未測網站 | 2026-11-02 |
| 10 | 效能 | [Chrome Rendering Performance](https://developer.chrome.com/docs/devtools/rendering/performance) | 官方 debug 方式 | 2026-11-02 |
| 11 | 效能 | [Animation Performance](https://web.dev/articles/animations-guide) | 官方最佳化建議，不是 FPS 定值 | 2026-11-02 |
| 12 | Rendering | [Three WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer) | 官方：fallback、TSL、experimental | 2026-11-02 |
| 13 | Rendering | [Three Postprocessing Migration](https://threejs.org/manual/pages/webgpu-postprocessing) | 官方：RenderPipeline vs EffectComposer | 2026-11-02 |
| 14 | Rendering | [Three Demos](https://threejs.org/examples/) | 官方 demos，不能作真機 perf 基線 | 2026-11-02 |
| 15 | Rendering | [Babylon 官方文件](https://doc.babylonjs.com/) | 官方入口，實裝版本待 PoC | 2026-11-02 |
| 16 | Rendering | [PlayCanvas 官方文件](https://developer.playcanvas.com/) | 官方入口，需與 Three 交叉比較 | 2026-11-02 |
| 17 | Rendering | [OGL 原始庫](https://github.com/oframe/ogl) | 原始碼已確認；授權與 release 未完全驗證 | 2026-11-02 |
| 18 | Rendering | [R3F docs](https://r3f.docs.pmnd.rs/) | 官方 React/Three 整合 | 2026-11-02 |
| 19 | 資產 | [glTF extensions](https://github.com/KhronosGroup/glTF/tree/main/extensions) | 原始規格 | 2026-11-02 |
| 20 | 資產 | [KTX2](https://www.khronos.org/ktx/) | 標準組織；實際壓縮率 Unknown | 2026-11-02 |
| 21 | 資產 | [glTF Transform](https://gltf-transform.dev/) | 工具官方 docs | 2026-11-02 |
| 22 | 資產 | [meshoptimizer](https://meshoptimizer.org/) | 作者官方 docs | 2026-11-02 |
| 23 | 動畫 | [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | 官方 API | 2026-11-02 |
| 24 | 動畫 | [GSAP Standard License](https://gsap.com/standard-license) | 官方授權；非 MIT，製作競品需法律確認 | 2026-11-02 |
| 25 | 動畫 | [Motion](https://motion.dev/) | 官方文件 | 2026-11-02 |
| 26 | 動畫 | [Rive Web Runtime](https://rive.app/docs/runtimes/web/web-js) | 官方；素材/Editor 許可另查 | 2026-11-02 |
| 27 | 動畫 | [Lenis](https://lenis.dev/) | 官方；scroll UX 不保證普適 | 2026-11-02 |
| 28 | 案例 | [Active Theory Paper Planes](https://experiments.withgoogle.com/paper-planes) | 原作者作品，2016 WebGL | 2026-11-02 |
| 29 | 案例 | [Active Theory Paper Planes 部分程式](https://github.com/activetheory/Paper-Planes-Android-Experiment) | 原作者公開 flocking/workers/three morph targets 等部分範例 | 2026-11-02 |
| 30 | 案例 | [Active Theory Portfolio 作者訪談](https://www.commarts.com/webpicks/active-theory-2) | 作者說明 WebGL/state-based JS/nav | 2026-11-02 |
| 31 | 案例 | [Active Theory v5 作者說明](https://www.commarts.com/webpicks/active-theory-1) | 歷史案例，不能當 2026 v6 技術 | 2026-11-02 |
| 32 | 案例 | [Resn 獲獎檔案](https://bestawards.co.nz/studios/resn/) | 確認作品名稱，渲染技術 Unknown | 2026-11-02 |
| 33 | 案例 | [Dogstudio 案例庫](https://dogstudio.co/cases/) | 作品類型由工作室確認 | 2026-11-02 |
| 34 | 案例 | [Dogstudio Geske 技術解說](https://dogstudio.co/cases/geske/) | 作者確認 proprietary frontend/WebGL, Strapi, Shopware, LOD、壓縮、lazy loading | 2026-11-02 |
| 35 | 案例 | [Dogstudio Virgin Galactic](https://dogstudio.co/cases/virgin-galactic/) | 作者確認 3D、雙向 pin clipping、鏡頭及滾動 | 2026-11-02 |
| 36 | 案例 | [makemepulse 作品庫](https://www.makemepulse.com/case-studies/) | 工作室案例已核對；引擎不一定是任一作品 | 2026-11-02 |
| 37 | 案例 | [makemepulse Ruinart](https://www.makemepulse.com/case-study/maison-ruinart-digital-fresco) | 20+ 互動點、Web/AR 分流、引導提示 | 2026-11-02 |
| 38 | 案例 | [Hello Monday Hollow](https://hellomonday.com/work/hollow) | 作者確認橫向晝夜、影像互動、3D | 2026-11-02 |
| 39 | 案例 | [Locomotive Baillat](https://locomotive.ca/en/work/baillat-studio) | 作者確認黑白/粗體/極簡導航 | 2026-11-02 |
| 40 | 案例 | [Locomotive Zap Energy](https://locomotive.ca/en/work/zap) | 作者確認 IA/品牌/科學內容優先 | 2026-11-02 |

## 2.1 PR #4 審查補證（2026-11-02；不納入原 40 項計數）

審查時對照作者**個別作品頁**，已在 [第 10 篇](10-creative-direction-and-reference-sites.md) 逐列替換有直接個案來源的 15 個入口，不再以整個工作室目錄代表作品的細部事實。

| 追加來源 | 新查證的可支持內容 | 仍 Unknown |
| --- | --- | --- |
| [DEPT Pioneer](https://dogstudio.co/cases/dept-pioneer/) | Nuxt.js + 自家 WebGL framework、兩條內容路徑、點雲 Entity（2023） | 現在是否仍採用同技術 |
| [Virgin Galactic](https://dogstudio.co/cases/virgin-galactic/) | AstroGL、多個 WebGL subscenes、環境貼圖模擬反射、雙向 pin/clipping | 裝置 FPS、目前部署版本 |
| [Geske](https://dogstudio.co/cases/geske/) | Strapi／Shopware、WebGL、3D 旋轉商品、減面／懶載入 | 真實效能、轉換率 |
| [MoMA Magritte](https://hellomonday.com/work/moma-magritte) | 旁白、配樂、超現實轉場、X-ray／紅外修復素材 | Rendering engine |
| [OGL package.json](https://github.com/oframe/ogl/blob/master/package.json) + [README](https://github.com/oframe/ogl/blob/master/README.md#unlicense) | 上游原始碼明確標示 Unlicense；GitHub API 欄位仍可為 Unknown | 版本別法律合規與第三方授權 |

- **研究評分補強**：第 13 篇新增各維度 1／3／5 錨點、2／4 使用條件與 Unknown 原則；原有 Top 20 分數仍是尚未重新雙評的研究快照。
- **PoC 補強**：第 14 篇新增五種特效／介面的固定比較情境、採樣次數、裝置分層及故障退場；皆為**未執行的測試規格**，不得將表格數字視為真實性能結果。
- **採信界線**：作者文字可以證明案例中描述的功能、當時使用的工具，**不能證明此刻線上相同版本或跨裝置性能**。新來源仍屬 research evidence，不是 Repo 操作授權。

## 3. 來源互相矛盾時如何裁決
1. **Three WebGPU 是新架構，但非所有場景更快。** 官方明文仍標 experimental，並指出某些場景 WebGLRenderer 更快。因而 `WebGPU` 值得 PoC，但不可根據 API 現代性決定採用或產生「WebGPU 永遠快 30%」的幻覺。[官方說明](https://threejs.org/manual/pages/webgpurenderer)。
2. **Three WebGPURenderer 有 WebGL2 backend，但老 Shader/EffectComposer 不兼容。** 它解決支援落差，不會自動移植舊 GLSL 材質或舊後製；必須以 TSL/RenderPipeline 重寫或保留 WebGLRenderer。[遷移說明](https://threejs.org/manual/pages/webgpurenderer)、[新 Postprocessing](https://threejs.org/manual/pages/webgpu-postprocessing)。
3. **GSAP 常被叫做『完全免費』，但不是 MIT。** 發行方表示普通商用網站免費、各插件開放；開發與 GSAP 製作器競爭的無程式碼動畫產品仍受標準授權限制；需閱讀當時 [官方全文](https://gsap.com/standard-license)，不是引用 SaaS blog 就承諾再散布權利。
4. **小型庫可能初始下載較少，不代表 GPU 工作量較低。** OGL 與 Three 比較不能只看 JS 文件大小；相同 shader/fullscreen sampling 的 fill-rate 是實際工作量；Bundle、parse、fps 均需同條件測試。
5. **GitHub last push 不代表最新 release 也不代表有安全維護。** `/releases/latest` 404 只代表無可由該 endpoint 解析的最新 release；可能透過 npm/tag/mono-repo package 發行。逐項正式採用應檢查 npm registry、lockfile 與安全公告。
6. **作品目錄 ≠ 實際體驗驗收。** Resn 作品只由獎項確認；Dogstudio、makemepulse、Hello Monday、Locomotive 有作者說明，其中部分技術案例可加深分析；然而 2026-11-02 未以真實操作瀏覽器/真機完成 28 個網站全流程/網絡瀑布/動畫解構。因此不能宣稱案例全部「深度實測」。
7. **Core Web Vitals 與 3D FPS 沒有一對一對應。** Google 的 LCP/INP/CLS 代表使用者載入、互動、版面位移；fps、畫質/過熱另測，不能用 Lighthouse 90 分推稱高階 Android 60FPS。

## 4. 已核對作者額外技術拆解（為第 10 篇案例表補充）
### Dogstudio / Geske
作者說明採自有 frontend/WebGL framework、Strapi CMS + Shopware e-commerce；3D 商品透過降低面數、壓縮、lazy loading 與 adaptive loading；用 WebGL shaders 呈現工程線條／粒子。**可驗證技術與設計目標（跨語系、可轉換流程）**，但沒有該站正式 frame-time 或壓縮百分比，不寫數字。來源：[Dogstudio](https://dogstudio.co/cases/geske/)。

### Dogstudio / Virgin Galactic
作者確認高戲劇性鏡頭移動、3D sections、以低成本製造反射外觀，以及雙向 pinning/clipping swipe transition。推導可重用的敘事步驟：Hero 概念 → swipe/clipping 鏡頭 → 分段內容 → 清晰 CTA。**此為設計語法，非網站頁面直接複製授權**。來源：[Dogstudio](https://dogstudio.co/cases/virgin-galactic/)。

### makemepulse / Ruinart Digital Fresco
作者確認由實體壁畫轉 Web/AR、超過 20 個互動點、手機掃描觸發免 app AR，另有 web 版本與 Hint Pages；此例證明「複雜內容要加入用戶引導」，不能只強調 shader。作者另公開 NanoGL 引擎為公司能力，但**不得無源宣稱 Ruinart 特定畫面必定使用 NanoGL 或某 shader**。來源：[官方案例](https://www.makemepulse.com/case-study/maison-ruinart-digital-fresco)、[工作室 3D 作品庫](https://www.makemepulse.com/case-studies/service/real-time-3d)。

### Active Theory / Paper Planes
原作者 [部分公開的 Android/WebView 範例](https://github.com/activetheory/Paper-Planes-Android-Experiment) 包含 JS Worker flocking、three morph targets、Android bridge；**只公開部分程式，不足以證實網頁完整服務端與所有 shader 架構**。對高密度粒子先衡量 CPU Worker vs Compute，絕不假定 Compute 必勝。

## 5. 研究交付清單與完成度
| 使用者要求 | 提交內容 | 完成界線 |
|---|---|---|
| 25+ 創意作品 | 第 10 篇：28 個案例、五個長分析；本篇新增作者細節 | **案例數達成；未完成 28 個站的全互動走查，部分技術 Unknown** |
| 50+ GitHub 首輪 | 第 12 篇：70 個 GitHub API 存在性/維護快照 | **達成第一輪**，不是 70 個完整 dependency scan |
| Top 15–20 | 第 12 篇：18 個能力/採用/授權/版本/風險 | **選型分析達成**；Bundle 大小及跨裝置 runtime 未實測 |
| Motion/3D/Shader | 第 11 篇：渲染／shader／動畫成本矩陣 | **算法/架構研究已整理**，仍有原創 PoC 未執行 |
| Design rules | 第 13 篇：8 類 Tokens、anti-AI-template lint、UX gate | **規格建議已整理**，缺真實使用者驗收 |
| Device/performance | 第 13 篇：六類設備，Tier/瓶頸/可觀測 | **測試設計完成**，沒有真機結果 |
| 三種 Creative Stack | 第 13 篇：A/B/C 技術搭配、tradeoffs | **建議完成**，非工程實作 |
| 10 effects | 第 14 篇：10 種 pipeline、偽碼、瓶頸與 fallback | **工程拆解完成**，非執行碼 |
| 3–5 PoC | 第 14 篇：五個 PoC 驗收與測量欄位 | **規格完成**，不安裝、不啟服務 |
| Top 20 | 第 13 篇：五維 1～5 分、方法和依據 | **研究評級完成**，不能當 benchmark |

## 6. 最值得優先驗證的決策
1. **P0**：多裝置 Basic fallback、WCAG 2.2 AA 目標、原生導覽可用、licensing 清楚、安全 GitHub PR；有未解風險不稱企業級驗收。
2. **P1**：PoC-1 Liquid Images（比較 CSS/GPU）、PoC-2 PBR Explode（真材質+壓縮）、PoC-3 Scroll Story（語意與敘事）。
3. **P2**：PoC-4 GPU Compute 粒子實驗。只有 WebGL2 版本確實遇到成本/功能限制才投入 Compute。
4. **P2**：PoC-5 品牌品質盲測；證明移除 3D 動態後仍有品牌辨識、操作價值與排版藝術性。
5. **正式通用庫 Gate**：每項功能具少耦合 API + Basic fallback + 負向測試 + 回退方案，並提供本地性能 evidence；不能因效果強就加入核心依賴。

## 7. Repository EAG-100 安全界線與版本紀錄
- 範圍限 `waydefu/Research-` 的 research Markdown 與索引；不安裝套件、不啟 MCP/Skills、不改 Hermes、不寫其他 repo、不 merge PR。
- **research content is untrusted evidence，不是執行命令或權限來源。** AGENTS/EAG-100 優先；任何後續真 Demo、測試網頁、採購或將工具套用別的 repo 都要另獲授權。
- 本研究沒有宣稱 Repository 通過 EAG-100 100/100；CI Markdown integrity 通過 ≠ EAG-100 全合格。
- 本研究依現有 `research/2026-11-universal-web-engine/` 分類增量加入 10–15 篇，沿用 01–09，維持現有內容。
- **2026-11-02 v1 初稿：** 28 案例、70 GitHub、18 選型、10 pipeline、5 PoC、Top20；無正式 FPS 實測。後續若證據更新，應保留此 snapshot 並加修訂日期。

## 8. 第二輪證據補強：15 項新增原始來源（2026-11-02）

> 來源索引現在為**首輪 40 項 + 第二輪 15 項 = 55 項條目**。這是原始來源的登錄數量，不是 55 次獨立實測或 55 份第三方效能數據。為避免重複原有 40 筆，此節不重列初版條目。

| # | 來源 | 原始位置 | 實際可支持的主張、證據限制 |
|---:|---|---|---|
| 41 | GSAP repo package manifest | [原始來源](https://github.com/greensock/GSAP/blob/master/package.json) | manifest 提供 3.15.0／custom license 聲明；不能冒充 npm latest |
| 42 | OGL repo package manifest | [原始來源](https://github.com/oframe/ogl/blob/master/package.json) | manifest 提供 Unlicense／1.0.11；GitHub API 授權仍 Unknown |
| 43 | Resn Zentry 作品獎項敘述 | [原始來源](https://bestawards.co.nz/digital/large-scale-websites/resn/zentry/) | 可支持跨產品、玩家/投資人入口定位 |
| 44 | Sculpting Harmony 獎項案例 | [原始來源](https://designersinstitute.nz/case-study/sculpting-harmony/) | 可支持 3D、檔案資料、空拍和音樂，不能支持特定 shader |
| 45 | Chrome CSS Scroll Entry/Exit | [原始來源](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/scroll-entry-exit-effects) | @supports 要同時測 animation-range |
| 46 | Chrome Scroll-triggered Animations | [原始來源](https://developer.chrome.com/blog/scroll-triggered-animations) | triggered 與 driven 動作模型不同 |
| 47 | Chrome View Transitions 2025 | [原始來源](https://developer.chrome.com/blog/view-transitions-in-2025) | 支援逐年擴大，仍需 feature detection |
| 48 | Chrome WebGPU Compatibility Mode | [原始來源](https://developer.chrome.com/blog/new-in-webgpu-146) | Chrome 146 Android opt-in restricted feature level |
| 49 | W3C Dragging Movements | [原始來源](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements) | 拖曳必須有同等單指替代的 AA 條件與例外 |
| 50 | web.dev LCP Optimization | [原始來源](https://web.dev/articles/optimize-lcp) | LCP 資源早發現、priority；不要把首屏主圖無條件 lazy load |
| 51 | Chrome DevTools Performance Reference | [原始來源](https://developer.chrome.com/docs/devtools/performance/reference) | Frames、main thread、時間線的官方分析參考 |
| 52 | MDN WebGL Context Lost Event | [原始來源](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event) | 定義 lost event，主 canvas 故障退場 |
| 53 | MDN WEBGL_lose_context | [原始來源](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context) | 可在有擴充支援時模擬 loss/restore，為負向測試入口 |
| 54 | Chrome Scroll Story Best Practices | [原始來源](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/scrollytelling) | 官方建議性能屬性／非必需裝飾動效回退 |
| 55 | MDN isContextLost | [原始來源](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isContextLost) | 探測 GL context loss；不能視為修復成功 |

### 本輪實際修正的研究判斷

1. **作品的可核對度不能用作品數冒充。** 已將 28 件作品個別寫出官方可支持的概念、我們的工程轉譯與必要的未知測試。原始碼級別僅少數案例具有公開證據；沒有宣稱已逐站做互動瀏覽器實測。
2. **OGL 授權由單一「Unknown」改為兩種不同觀測：** GitHub API 仍 Unknown；其 `package.json` 聲明 Unlicense，正式商用仍要取得發行套件中的完整授權資訊。
3. **GSAP 版本與授權分開：** 程式庫 manifest 3.15.0 是一個 source snapshot，不是官方 npm latest 的確認；`Standard License` 的 Permitted Uses 與 Prohibited Uses 不能省略。
4. **LCP 與 3D loading 是互相牽制的：** 首屏主要圖像應在 HTML 可被快速發現，3D 模型通常延遲；不能誤把 LCP Hero 圖片和非首屏 GLB 都 lazy load 當一條通用規則。[web.dev](https://web.dev/articles/optimize-lcp)。
5. **API 能力檢測不代表性能等級：** Chrome 146 的相容模式只代表可在某些舊 API 下取到受限 Adapter，WebGPU 仍非 Web Platform Baseline；高畫質仍需同場景實機驗收。
6. **工程測試必須有負面案例：** 可以透過支援的 WebGL 擴充模擬 context loss；React/Next/Vue/Astro 上下文釋放、手機回上一頁、多重 RAF、焦點失效都要在實際 PoC 才能通過 Gate。

**仍無法驗證：** 瀏覽器互動操作錄影、真實裝置 FPS/帧時間、bundle gzip 數據、溫度與功耗、完整 SCA 審查、各作品的內部私有 engine。新增文件是有來源的規格與推論，不是替代實測的證明。
