# 13｜高階 UI/UX 設計系統、效能策略、三套技術架構與 Top 20
**查證：2026-11-02；狀態：官方依據 + 工程決策建議；無真機測試數據。**

## 1. UI 設計規格：讓網站有美術總監，而不是「AI 圓角卡片」
### 1.1 八類 Design Tokens
| token 類 | 建議規範 | 驗收 |
|---|---|---|
| color | 中性底色（surface 0–4）、唯一主要品牌色、語意 success/warning/error、對比模型 | 深淺背景、disabled、hover、focus 都測 WCAG |
| type | 字體家族、CJK/拉丁數字配對、type scale、line height、tracking、variable weight | 320px、360px、tablet、desktop 不切字、語義 heading 順序 |
| spacing | 4pt/8pt 基底 + `clamp()` fluid scale，密度分 display/content/tool | 空間用在信息分組，不做無意義的大空白 |
| grid | 12 欄桌機、mobile 4 欄作為設計起點；container queries 決定元件 | 實際 layout 遇窄容器不能靠 viewport 猜 |
| shape | radius、stroke、separation、edge treatment、material/roughness | 避免每個 section 都相同 24px 圓角 |
| elevation | 浮層陰影、遮罩、backdrop、真材質／純色層級 | blur 與陰影有光源方向，不遮文字 |
| motion | `duration`、`ease`、`spring`、`delay`、`distance`、`stagger`，互動/敘事各有上限 | 同一操作只用一套 motion language |
| interaction | hit target、focus、scroll restore、dialog、keyboard、gesture、loading/error/empty | focus visible、關閉動效仍可完整操作 |

**Design Token 是約束，不是可重複大量套用的模板。** 科技產品可偏資訊密度與精準線條；遊戲工具可偏 HUD/機械語言；品牌官網可放大攝影、字體、呼吸節奏；沉浸展示可讓 3D 成主體，但資訊仍需 DOM 版本。

### 1.2 視覺及 UX 的最低標準
- **視覺層級：** 主要標題→一句核心價值→視覺實證→主要 CTA→次要行為；以字重／尺寸／對比／位置建立順序，不讓全部都亮。
- **資訊架構：** Nav 不因沉浸動畫消失；在 5 秒內讓使用者知道這裡是什麼、有何價值、下一步。5 秒是*建議可用性測試任務*，不是驗收測量結果。
- **Gestalt：** proximity 決定分組、similarity 建立可掃描性、continuity 連接章節；若用視差錯位，不能破壞閱讀順序。
- **Microinteraction：** click/touch 第一次反應應在下一可顯示幀提供視覺認領；真正作業可非同步但要讓狀態確定。
- **Navigation：** 站內錨點、back、scroll restoration、鍵盤快捷、跳過章節都要與自訂 Scroll/Snap 測通。
- **可及性：** WCAG 2.2 AA；最低 24×24 CSS px target 有例外且不等於推薦尺寸，行動可設較大實際尺寸作設計政策；drag 唯一操作違反 2.5.7，需 single-pointer 替代。
- **User test：** 首次任務完成率、找 CTA 時間、錯誤率、回憶品牌元素、暈眩/不適、手機單手單指完成率；招募有不同裝置與輔助科技的使用者。
- **AI 廉價感 lint：** 無品牌色策略／全部卡片／過量 blur／假 3D/硬發光／不合理空白／沒有資訊優先級／無意味浮標／每個滾動段落都 pin／統一透明塑膠材質 → Reject 視覺稿並提出具體修改。
- **高級感的「負面空間」**：刪去無意義的 UI 外框、將裝飾變成信息線索。以敘事節奏(安靜→重點→安靜)而非每屏高潮建立電影感。

參考：[WCAG 2.2](https://www.w3.org/TR/WCAG22/)／[MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)／[Material Web practices](https://m3.material.io/)（設計參考不是法律基準）。

## 2. 真正的效能預算：先有可重現方法，才談「60 FPS」
官方 Web Vitals「good」：**LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1**，依真實訪問 p75 評估，mobile/desktop 分開：[Google](https://developers.google.com/search/docs/appearance/core-web-vitals)。FPS 是不同維度。
- 理論：60Hz 一幀約 16.67ms；30Hz 約 33.33ms。**此為時間換算，並不是任何裝置的測試結果**。
- 目標：高階產品網站互動 60 FPS；弱設備若 30 FPS 且資訊功能仍正常，可獨立聲明場景取捨；在靜態內容頁應優先保留原生滾動而非強制 30 FPS Canvas。
- 實測規則：固定版本、屏幕解析度/DPR、裝置 SoC、瀏覽器 build、網路、初始溫度、充電狀態、重複測量。記 p50/p95/p99 frame-time、掉幀率、Long Animation Frames、INP p75、memory 峰值與是否 context/device lost。
- **GPU 時間不一定等於 RAF 間隔**：CPU 主緒工作、GPU queue、Compositor、OS 限頻可互相重疊；前台 60Hz 並不代表 render 每幀 16.67ms 的空間可隨意用完。
- **避免假測試：** 沒有安裝 app、沒有執行 Browser/Profiler，不使用估算 FPS 或隨意分配特效固定成本。

### 2.1 六種裝置的假設與 Quality Gate（建議，非硬體測試）
| 裝置 | 起始 Quality Tier（只是策略） | 特別檢查 | 失敗時 |
|---|---|---|---|
| 高階桌機獨顯 | High → Ultra 按實測升級 | 高 DPI、多螢幕、4K fill rate、reprojection、shader warmup | 降 render scale / 關 SSR、DOF |
| 一般筆電／整合顯示 | Balanced | GPU/CPU 共享記憶體、電池模式、滑鼠捲動 Main Thread | 關昂貴 pass、保留簡單 Hero |
| 高階 Android | Balanced → High 依真機升級 | Adreno/Mali 驅動、熱節流、橫豎切換、browser GPU | DPR 上限、降低粒子/RT、降 LOD |
| 中階 Android | Basic → Balanced | 多程序記憶體、GPU feature/GL context loss、低網速 | DOM + poster、單次 CSS 動效 |
| iPhone／Safari | Basic → High 按 API 實測 | WebKit/WebGPU Adapter、手勢與 safe area、滾動／memory | WebGL2/Canvas fallback、關 compute |
| 不支援 WebGPU | WebGL2 → Canvas/DOM | WebGL2 availability、required extensions、shader compile | 禁用 GPU layer 而非空白頁 |

- 設備型號是**測試層級，不是「高階 iPhone 全支援 WebGPU」的承諾**。
- `navigator.gpu` 存在 ≠ `requestAdapter()`、`requestDevice()`、features/limits 合格；device lost 需可恢復。
- `WebGL2RenderingContext` 建立失敗、`webglcontextlost` 也要可切 Basic。長時間背景頁面停止非必要 loop。
- `prefers-reduced-motion` 必須可停止鏡頭飛行、視差、粒子／閃爍。還應提供指標相近的靜態內容可供選擇。

### 2.2 Bottleneck→工具與修法
| 現象 | 優先證據 | 修法（必須重新量測） |
|---|---|---|
| 首屏慢 | Network waterfall、LCP element、TTFB、font loading | SSR/SSG 靜態 HTML、preload critical hero、responsive images、decode/3D lazy |
| 點了很久才有反應 | INP attribution、Long Tasks、forced reflow | 分拆主緒工作、避免 thrashing、defer expensive shader setup |
| 偶發長幀 | performance trace、shader compile/pipeline create | 預編關鍵 shader variants、減少材質組合、適度 progressive scene reveal |
| GPU 滿載 | GPU counters 如可用、draw calls、overdraw、RT pass count | Instancing、LOD、culling、降低 DPR/particles、刪多餘後製 |
| 記憶體暴增 | memory profiler、texture list、GL context counts | KTX2、降低 texture sizes、dispose Geometry/Material/Targets、停止不可見 scene |
| 持續變熱／掉幀 | 固定 10–15 分鐘長測（研究方案）+ frame-time 曲線 | 降 Tier、限動畫更新頻率、空閒停止、選 30 FPS/靜態 |
| 滑動暈眩／操作被綁住 | UX/AT test、scroll restore、reduce motion | 原生捲動、減少 pin、加入跳過和固定導航 |

**儀器：** Chrome Performance/Rendering/Memory、Firefox Profiler、Safari Web Inspector、Playwright trace、Web Vitals RUM、Android Perfetto/OS profiler（若環境允許）。Chrome 的 Paint Flashing / Layers / layout shift overlays 官方可核對：[Chrome DevTools](https://developer.chrome.com/docs/devtools/rendering/performance)。僅靠 Lighthouse 不會給出可信 GPU FPS。

## 3. 三種高階 Creative Web 參考架構（**不等於 universal-web 的全端 ABC**）
| 面向 | A 極致視覺 | B 品質效能平衡 | C 輕量高級 |
|---|---|---|---|
| Web shell | Vite + TypeScript / Astro 靜態 shell；有後端需求才 SSR | Astro Islands 或 Nuxt/Next（依實際需求） | Astro 靜態、原生 JS 或小量框架 |
| 主圖形 | Three.js WebGL2 **或** WebGPU TSL（擇一） | Three.js WebGL2 小場景／model-viewer；重 GPU 可選 Canvas 2D | DOM/CSS/SVG/Canvas 2D；預設沒有 3D 引擎 |
| Motion | GSAP 複雜 Timeline + 有限 ScrollTrigger | CSS/View Transitions + GSAP **或** Motion | CSS/WAAPI + Scroll-driven（有 fallback） |
| 圖片／資產 | GLB + KTX2 + meshopt + HDRI + LOD | 壓縮圖片、少量 GLB/KTX2、必要時 video sequence | AVIF/WebP/SVG + responsive poster |
| 特效上限 | 全螢幕 PBR、shader、粒子、選擇性 volumetric | 小範圍 refract/dissolve/3D、少 pass | 高級字體、構圖、mask reveal、clip-path、2D particles |
| 風險 | GPU memory、shader stutter、強資產與 art direction 成本 | 需嚴格分工：少量 scene + DOM | 表現力需由藝術指導撐起，複雜 3D 較難 |
| 行動策略 | Basic poster 作絕對 fallback，真正 Tier 分流 | Mobile-first，3D 按 viewport / device 實際升級 | 專注語意、天然廣覆蓋 |
| 開發維護 | 高：shader、技術美術、性能工程 | 中：可複用 effect adapter、token、perf gate | 低～中：強調美術與 CSS 技能 |
| 對象 | 品牌 launch、沉浸互動展演 | 科技產品、專業工具、電商展示 | 精緻品牌官網、產品資訊、出版／行銷 |
| 不該做 | 讓整個主站只在 Canvas 內可用 | 同時載兩個 engine、多套 motion systems | 為了自動得高級感而硬塞大型粒子 |

### 3.1 可維護的共享模組（未實作）
```text
packages/design-tokens
packages/ui-primitives  (semantic DOM + focus)
packages/motion-director (GSAP or CSS adapter; cancel/reduce)
packages/scene-core      (Renderer interface / device lifecycle)
packages/effects         (effect manifest: passes, cost hint, fallback)
packages/assets          (manifest, licenses, transcoding, LOD)
packages/quality-policy  (capability detection + dynamic resolution)
packages/telemetry       (CWV + frame-time long sampling)
tests/visual-and-a11y
```
**部署不是強制 monorepo**，上述是邏輯邊界；只有多個站點真有共享需求才抽 package。

### 3.2 自適應畫質控制
- **Tier 探測：**先依 API/required features 初始化，初始偏保守；不僅靠 user-agent 或 deviceMemory（可能不可用）。
- **觀察窗口：**忽略首次 shader compilation spikes，待穩態後統計一段有效前景互動區間 p95 frame time。設 hysteresis，避免頻繁跳 Tier。
- **先後順序：**動畫停止/不可見元素不渲染 → 解決多餘 draw calls → 降 render scale → 降後製 pass/quality → 降粒子數與 LOD → Basic 靜態。
- **安全退場：**GPU init/asset decode/error timeout → 保留 DOM nav 与 poster，記錄 fallback reason；跳回 High 需成功測試，不能自動一直重試使手機過熱。
- **隱私：**Telemetry 不記使用者精確硬體指紋或 personal identifiers；蒐集最小必要欄位，按授權與政策處理。

## 3.3 研究分數的可重複評估規則（2026-11-02 補強）

下面是第 4 節 **Top 20 研究序位分** 的共同評量錨點。由於研究不是同條件 Benchmark，每項分數都是**有條件的專家判斷**，**不可計算跨裝置性能精確排名**。至少由兩名不同角色（設計／前端或圖形工程）獨立給分，分歧達 2 級時須附來源及理由；沒有實際證據的維度應標記 `U`（Unknown），不得臆填為 3 分。現有 20 筆數字是原研究評估，**尚未進行獨立雙評或真機複核**，採用前需要依此規則重評。

| 維度 | 1 分：顯著不利 | 3 分：有條件可用 | 5 分：強項 | 證據必備 |
| --- | --- | --- | --- | --- |
| 視覺表現力 | 僅能處理單純版面／不支援需求效果 | 能形成局部視覺層次或有限場景 | 可支撐高自由度材質／敘事／品牌形態 | 官方 API、可重現 Demo、效果需求表 |
| UX 價值 | 效果主要是裝飾，易阻斷主流程 | 提升局部回饋但需額外設計焦點／降級 | 可直接支持主任務、導航或無障礙互動 | 使用者任務映射、A11y 實測或案例證據 |
| 預期效能效率 | 典型效果需多 pass／高主執行緒或昂貴資產 | 成本取決輸入、效果與畫面覆蓋，需明確降級 | 常見功能可用原生組合層／建置期處理完成 | 渲染路徑；實際 FPS、W/MB 缺測一律標 U 附註 |
| 開發易度 | 需專用圖形／數值技能及較複雜部署 | 有現成 API 但需要較多整合／退場維護 | 原生／低配置、文件成熟、容易測試／移除 | 最小 PoC、依賴數與版本相容測試 |
| 長期維護性 | 已封存、專有孤島或缺穩定支援 | 社群或官方支持存在但遷移／授權有條件 | 標準穩定、可退場、有版本／安全維護證據 | LICENSE 原文、版本、changelog、breakage 與回退策略 |

- **2／4 分**：當證據介於相鄰兩錨點時使用，需寫清楚對應的缺口；不得為了排出 Top 20 而補齊未知資料。
- **採用門檻**：先決定業務／硬體場景，再使用評分。對比 A 與 B 需採相同畫面、資產、行為、裝置、瀏覽器與版本；比較前預先記錄權重，不以星數或單一分數決策。
- **規範與實測分離**：本節僅讓未來評審者用相同語義打分，沒有補做 20 項技術的實測；既有第 4 節分數保留為待複核快照，避免偽稱重新打分。

## 4. Top 20 最值得掌握的技術（評估矩陣）
評分皆為 **1～5 的研究決策序位，非 1~5 的 FPS/benchmark**；欄位順序：**視覺力 / UX 價值 / 預期效率 / 開發易度 / 長期維護性**。其中「開發易度」5=投入最少，「預期效率」5=更適於零/少額外渲染開銷，**不是跨硬體實測數值或精確性能排名**。對缺真機資料的 GPU 技術，僅給結構性的保守評估，正式決策仍需 PoC 取代。

| # | 技術 | 五維評分 | 可核對的評分理由（非實測） |
|---:|---|---|---|
| 1 | CSS Design Tokens + Layout | 4 / 5 / 5 / 5 / 5 | CSS 原生、語意/Container Queries；效果上限止於 DOM/SVG |
| 2 | Semantic HTML + A11y | 2 / 5 / 5 / 5 / 5 | WCAG AA、keyboard/AT，圖像型功能仍需輔助內容 |
| 3 | CSS/WAAPI 動效 | 3 / 4 / 5 / 5 / 5 | compositor transform/opacity 官方建議；複雜流程須自寫調度 |
| 4 | CSS scroll-driven | 4 / 4 / 4 / 4 / 4 | 官方 scroll/view timeline；需要 feature check 與 fallback |
| 5 | View Transitions API | 4 / 5 / 4 / 5 / 4 | 原生 old/new snapshot；跨文件條件及焦點需管理 |
| 6 | GSAP / ScrollTrigger | 5 / 4 / 3 / 3 / 4 | 時間軸、scroll 交互功能強；授權自訂、pin/主緒需測 |
| 7 | Motion | 4 / 5 / 4 / 4 / 4 | layout/spring/UI 需求自然，React 元件生命週期增加管理 |
| 8 | Rive State Machine | 4 / 5 / 3 / 3 / 4 | state machine 表達狀態，runtime/WASM 需測、素材授權另查 |
| 9 | Lottie / dotLottie | 3 / 3 / 3 / 4 / 3 | 已編製矢量片段方便，複雜 mask/資產造成成本 |
| 10 | Three WebGL Renderer | 5 / 4 / 3 / 2 / 4 | PBR/自訂 Shader 可控；draw calls/記憶體需真正量測 |
| 11 | Three WebGPU + TSL | 5 / 3 / 3 / 2 / 3 | Compute/new nodes；官方 experimental、migration friction |
| 12 | React Three Fiber | 4 / 4 / 3 / 3 / 4 | React 橋接但不改 GPU 渲染成本，逐幀 setState 風險 |
| 13 | Babylon / PlayCanvas | 5 / 4 / 2 / 2 / 4 | 完整引擎功能；精簡品牌頁導入面積較大 |
| 14 | OGL + Fullscreen Shader | 5 / 3 / 4 / 3 / 3 | 小底層 API；single pass 可簡潔，複雜 GPU pass 不見得省 |
| 15 | GLSL Custom Shader | 5 / 4 / 3 / 2 / 4 | 高度可塑，需 shader profiling/gl2 fallback |
| 16 | WGSL Compute | 5 / 3 / 3 / 1 / 3 | 大量平行 workgroup 可能適合，WebGPU 非 baseline |
| 17 | glTF + KTX2 | 4 / 4 / 4 / 3 / 5 | Khronos GPU 壓縮規格；傳輸及品質須自己比較 |
| 18 | meshopt / glTF-Transform | 3 / 4 / 5 / 4 / 5 | 建置階段處理、維護期更好控，需檢查視覺損失 |
| 19 | GPU Postprocessing Graph | 5 / 3 / 2 / 2 / 3 | 多 pass、render targets、sampling，反向權衡畫面開銷 |
| 20 | Web Vitals + Profiler + QA | 2 / 5 / 5 / 3 / 5 | 用於保障品質與可回退；不直接產出視覺 |

### 4.1 評分使用限制
- **視覺力**：能否完成高端作品要求的構圖/材質/節奏，不是畫面「漂亮程度」的統計值。
- **UX 價值**：能否提升任務理解、操作回饋或無障礙；例如 GPU 噪點不會自然提高此分。
- **預期效率**：官方 API 支援、是否多 GPU pass／主緒布局回流、素材管線可壓縮；不是性能實測、沒有宣稱 OGL 比 Three 快 20%。
- **開發易度**：API 複雜度、技術美術、shader 語言與跨端回退工作量；團隊熟悉度會改變。
- **維護性**：有無標準、文件、持續更新、生命週期和外部授權風險；審查時需對照 12 篇 GitHub audit 與實際鎖版。
- **不應只用總分決定選型。** 適用場景是第一個 Gate，可靠數據是第二個 Gate。

## 5. 工程流程 → 技術規範
1. **Discovery：** 產品主任務／核心受眾／SEO/內容／裝置／內容可及性界線確立，決定 A/B/C。
2. **Art direction：** 純灰階線框 → type & grid → 2–3 套素材方向 → 材質、光源、Motion Tokens；選定一個清楚且可辨識的視覺母題。
3. **Technical spike（無副作用研究）：** 只規劃小 PoC 測 shader/API/canvas 的落地，不經批准不裝套件／啟外服。
4. **Assets：** 資產 manifest + copyright + LOD/compression/visual baseline；輸出至少 1 個 Basic poster。
5. **UI first：** 先建立 DOM navigation、focus、form、文字、metadata；再把 3D layer 作 progressive enhancement。
6. **Motion integration：** 一個 Director，同一 clock、優先 CSS/WAAPI；渲染器受 visibility/reduced-motion 控制。
7. **Performance：** 冷／暖快取、六類裝置、弱網、長測、error fallback，報真實數據與 failure log。
8. **Review Gate：** Art Director、UX、Accessibility、Graphics、Performance 五種角度審查同一份 evidence；PR 強制檢查與人工審核（需 Repo 實際 policy）。
9. **Launch/rollback：** 素材/效果 feature flags、錯誤監控、基線與回退計畫；不以 Awwwards 獎項代替驗收。

## 6. 來源與不能確認的事
- https://www.w3.org/TR/WCAG22/
- https://developers.google.com/search/docs/appearance/core-web-vitals
- https://web.dev/articles/animations-guide
- https://developer.chrome.com/docs/devtools/rendering/performance
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/lost
- https://threejs.org/manual/pages/webgpurenderer
- https://www.khronos.org/ktx/
- https://www.khronos.org/gltf/
- **未完成**：任何正式同場景 FPS 表、實機功耗、動態解析度閾值、Core Web Vitals RUM 樣本；不因上表有數字就宣稱已實測。
