# V2 ENGINEERING + ACCEPTANCE — THE OBSERVATORY / EVIDENCE ENGINE

**Date:** 2026-11-02 · **Status:** Proposal / no installation, no code implementation, no real benchmark · **Target:** static GitHub Pages `/Research-/`

## 0. 決策說明

**建議先維持現有零服務靜態架構與 build-time Markdown 索引，延伸一個可卸載的 WebGL2 Scene Adapter，而不是現在就重寫成 Next.js 或 WebGPU。**

因為資料來自 GitHub Markdown，不需要 SSR／帳號／後端才能探索；使用者真正要求的是藝術級敘事、互動反應、GPU 材質與跨端品質，而不是用框架名字堆砌完成度。任何框架或 renderer 遷移都應以同場景 PoC 評估，**此文不是新增套件的安裝授權**。

本規格的直接來源：
- [V2 Art Direction](V2-ART-DIRECTION.md)
- [Active Theory 研究基準](../../research/2026-11-universal-web-engine/16-active-theory-quality-benchmark.md)
- [原有 Shader／Rendering 研究](../../research/2026-11-universal-web-engine/11-motion-graphics-and-rendering.md)
- [性能／架構研究](../../research/2026-11-universal-web-engine/13-design-performance-and-architecture.md)
- [已存在的五個 PoC 規格](../../research/2026-11-universal-web-engine/14-effects-recipes-and-poc-validation.md)

## 1. 體驗系統：資料優先於像素

```text
Repository Markdown / Git HEAD
        |
        v
build-time parser + source path + sourceCommit + validated metadata
        |
        +--> Static JSON research index
        |      └--> Semantic HTML Search / Filters / Results / GitHub source links
        |
        └--> Derive canonical UI state (selectedDomain / selectedDoc / evidenceStatus?)
                         |
                         +--> DOM state / focus / URL
                         |
                         └--> Optional renderer adapter (WebGL2 or CSS/SVG poster)
                                      |
                                      +--> shader uniforms / geometry parameters
                                      +--> one RAF lifecycle + quality policy
                                      +--> deterministic unload / context restore
```

**唯一真實來源：** Repo 研究文件。**唯一互動狀態主權：** DOM／應用 state，不讓 shader 的時間或物件角度反向決定研究分類；圖形主場景只訂閱狀態並給予視覺回應。搜尋結果與 GPU scene 不得使用兩份各自會過期的資料。

### 1.1 新 metadata 若無可信資料就留空

| 欄位 | 資料型態 | 來源規則 | 未知如何顯示 |
| --- | --- | --- | --- |
| `id`, `path`, `title`, `group` | String | 既有 Markdown build index | Index 失敗→GitHub source |
| `sourceCommit` | Git SHA | 建置時 `git rev-parse HEAD` | 未能取得 commit 時標示 snapshot 非可追溯 |
| `summary`, `headings`, `tags` | String / arrays | Markdown parser | 空缺不編故事 |
| `evidenceStatus` (V2 optional) | `verified`, `conditional`, `untested`, `incorrect`, `unknown` | **只有文件內已規範、可對應來源範圍時才可建立** | `unknown`；不從標題／亮度推斷 |
| `visualDomain` (V2) | Enum / derived | group taxonomy + art config | neutral |
| `selectedDocument` (UI) | ID / null | 選擇的源文件 | 不顯示空內容裝置 |
| `qualityTier` | `poster`, `eco`, `standard`, `enhanced` | browser feature + current session measurement | poster |

**視覺狀態不能冒充學術證據：** gold ≠ verified；只有可具體定位的 metadata 才可標上已驗證。即使 renderer 失效，狀態、查詢和來源連結仍完整。

## 2. Renderer Path Selection

| Path | 使用條件 | 內容 | 風險／決策 |
| --- | --- | --- | --- |
| DOM poster | JS/GPU 不可用、reduced motion、節能、GPU context 失敗 | 原創靜態 CSS/SVG 金色環切面、DOM 文案和搜尋 | 不能只是一張黑色空圖 |
| WebGL2 / eco | Feature+初始化成功、現場測量需要減負 | 低解析度、簡化輪廓、少量環段、無昂貴後製 | 最大限度保留視覺辨識度 |
| WebGL2 / standard | 達成目標而未過熱的瀏覽器 session | 一個金色核心物件、青藍刻度／局部光、有限視差 | 光暈／透明 overdraw 必須看 profile |
| WebGL2 / enhanced | 同設備實測足以負擔、人工開啟或安全升級 | 更細法線／陰影／局部光學細節 | 不是「高階手機型號」就強制開啟 |
| WebGPU optional | 先比較 PoC，證明 compute／render graph 有不可替代收益 | 另案評估 | **不是 V2 必須採用，不能盲導入** |

**禁止同時跑兩個主 3D 場景 RAF 競爭。** DOM／SVG 互動是基礎；GPU 是可失敗、可關閉、可釋放的視覺層。不要在每一張研究結果上生成一個 Canvas。

### 2.1 兩個應先比較的核心幾何 PoC

| PoC | 實現 | 視覺優勢 | 主要工程風險 | 哪些證據決定去留 |
| --- | --- | --- | --- | --- |
| A｜SDF / fragment | 既有 GLSL SDF 延伸偏心雙軌、中央菱透鏡 | 無外部 GLB 素材、程序外型變化方便 | 高 ray-step cost、每像素多次 `scene()` 法線計算、螢幕填充 | 實際 GPU frame time、熱、裁切與材質品質 |
| B｜Mesh / selective shader | 少量自製幾何環與切面、簡單 PBR-like material + 1 local pass | 真實法線、深度與局部遮擋容易控制 | asset/vertex count、材質與 animation binding | 相同視角及尺寸下 A/B 的畫質、首次可見時間和 p95 frame time |

相同頁面、背景、裝置、可見尺寸、DPR、輸入錄製、warm-up、瀏覽器，才叫可比較。不要以「第一個看起來順」決定 renderer。**不需要為了借鑑 Active Theory 而改用其閉源框架。**

### 2.2 Draw / postprocess 經濟學

- 偏好**只有一處發光焦點**的局部 bloom / emissive halo。先測單 pass 純 shader 近似光，再比較 downsampled blur；沒有性能結果不能承諾一定採用後者。
- 避免整屏半透明粒子造成 overdraw；軌道光跡由數量可控的線段／幾何或 shader 生成，而非 20 個 emitter。
- 避免把 DOM 主標送進 GPU 當 texture；可用 CSS/WAAPI 精準轉場但文字仍需選取、讀取、放大和搜尋。
- shader 迴圈、法線計算、FBO 更新、buffer 配置是獨立 profile 點；不能以 JS RAF duration 冒稱 GPU 時間。
- 切換 domain 時重用 geometry/program；不要每次選篩選器就重編譯 shader。

## 3. Scene State Machine（規範，不是已寫的程式）

```text
POSTER
  └-- user preference allows + supported + init success --> READY_ECO
READY_ECO -- stable measurements + policy --> READY_STANDARD
READY_STANDARD -- stable measurements + opt-in/policy --> READY_ENHANCED
READY_ENHANCED -- latency/thermal signal --> READY_STANDARD
READY_STANDARD -- slow frames --> READY_ECO
READY_* -- repeated failure / unsafe memory --> TERMINAL_POSTER
READY_* -- document hidden / viewport absent --> PAUSED
PAUSED -- visible + context valid --> previous READY
READY_* -- webglcontextlost --> LOST_POSTER
LOST_POSTER -- restored and rebuilt resources --> READY_ECO
ANY -- reduced-motion becomes true --> POSTER_NO_MOTION
ANY -- unmount --> DISPOSED (never auto-restart)
```

- `LOST_POSTER` 不得被 visibility, IntersectionObserver 或 resize 偷偷喚醒。
- `webglcontextrestored` 後 GPU program/buffer/texture 等**舊資源失效**，要完整重建或重新初始化，且最多一個 RAF。
- 畫質升級要有 hysteresis／冷卻，避免 eco ↔ standard 反覆切換。
- 允許暫停動態（明確控制或 OS preference），降低暈眩風險。
- 所有非同步 asset / shader / listener 有 cancellation 與 owner。

## 4. Motion / interaction contracts

| 觸發 | 單一 state 改變 | Render 視覺結果 | HTML 行為 |
| --- | --- | --- | --- |
| 首次載入 | `scene=ready` | 原創核心柔和顯示 | 大標題與 CTA 早就可用 |
| 研究域切換 | `selectedDomain=web` | 兩側光譜軌道對齊指定 orientation | 篩選按鈕 `aria-pressed`、URL、列表同步 |
| 選研究文件 | `selectedDocument=path` | 最多一次局部金線聚焦 | 焦點／詳細資訊顯示原始題名和 source link |
| 搜尋 | `query=normalized` | 不需要每輸入一字就重建 GPU；可只變場景語意標示 | input、結果筆數及 URL 同步 |
| 研究例外 | `evidenceStatus=unknown` | 保留中性視覺，文字說明缺證據 | `Unknown` 可讀而非靠色彩 |
| 裝置 reduced-motion | `motion=static` | 無連續旋轉與 Camera drift | 列表、搜尋、CTA 完整 |
| GPU loss | `renderer=poster` | CSS/SVG 取代 GPU 場景 | 網頁不遮罩、不重載、不丟失狀態 |

**真正的「互動」要保留可預測性：** 不用操作後突然強迫 camera zoom、頁面滾回頂端或切換過長 loading。

## 5. 靜態出版和搜尋一致性

- 維持 Pages `/Research-/` 相對路徑、無動態伺服器依賴；建置須實際掃 repo Markdown，重建 index。
- 搜尋必須支援繁體中文與英文，同時保留符合條件的原始 GitHub 文檔跳轉；任何篩選不應破壞回上一頁／URL 的狀態。
- 若 `sourceCommit` 與 index 不相符，不能展示為即時索引；需標明 source snapshot 或重新建置，不將舊文件資訊假裝最新。
- 虛構的技術關係／節點位置必須標示 conceptual visualization，而非宣稱量化依賴圖。
- LCP text 必須存在於伺服器直接回應的 HTML，而不是等待 WebGL 入口事件或資產 decode；避免黑屏 loader。

## 6. 無障礙與安全閘門

- WCAG 2.2 AA 作為交付設計目標；包含鍵盤順序、可見焦點、Contrast、標題語意、zoom、觸控、狀態播報；AAA 的 2.3.3 可當額外動態安全目標，不能錯報為 AA。
- 嚴格避免 3 Hz 以上強烈閃爍及不必要的高亮快速交替；亮白 peak 更不能做滿畫面 strobe。實際 WCAG flashing checks 必須另測。
- `prefers-reduced-motion` 為保守預設；使用者可在站內暫停裝飾動效。不能讓 reduced-motion 使內容消失。
- 原文與外部 GitHub 連結保留安全的 `rel="noopener noreferrer"`；資料透過 `textContent`／安全 DOM，而非將任意 Markdown 插入 `innerHTML`。
- 第三方設計／素材採原創或核對授權，不使用動畫影像或 AT assets／專有 Hydra code。
- GitHub Pages 的 response header 能力有限；CSP／frame policy 的可用方案必須與部署實際限制一起審核，不能假設 `.htaccess` 生效。

## 7. 實際驗收矩陣（未執行）

每個 Gate 必須記錄 **commit SHA、日期、設備、瀏覽器版本、測試路徑、測試結果與可審查 evidence URI**；缺證據 = 未完成。

| Gate | 應交付的可檢驗成果 | 失敗條件 |
| --- | --- | --- |
| G0 Original Art | 靜態主視覺黑白輪廓、3 構圖變體與被拒原因、原創來源紀錄 | 可以直接辨識出第三方標誌或抄襲 |
| G1 Navigation | 鍵盤、觸控、滑鼠完整主流程；source links 正確；URL 可刷新 | 必須看完 intro 才能找原文 |
| G2 Motion | Pause/reduced-motion；切換中取消；焦點不丟失；含無動畫靜態稿 | 暈眩、不可控 Camera、內容消失 |
| G3 Graphics | WebGL2 真實 shader render；context lost/restored；destroy 後不再 RAF | 空白 Hero／GPU 恢復後重複 RAF |
| G4 Cross-device | Desktop 1440、Laptop 1024、Tablet 768、Android 360/390、iOS 375/430，portrait/landscape | overflow、觸控無法啟動、文字被蓋 |
| G5 Performance | 真實 LCP/INP/CLS p75（有足夠 field data 才能報）、Lab 對照、GPU／主緒 frame-time、記憶體／熱、弱網 | 未實測就標 60FPS 或 100 Lighthouse |
| G6 Research Truth | 實際 repo HEAD 檔案清單與索引一致；來源 SHA／Unknown 正確；search 回 GitHub | hardcoded 過時紀錄、將 EAG-100 顯示為認證 |
| G7 QA Polish | 五角色審核：Creative, UX, Graphics, Frontend, Performance；mobile與fallback各獨立圖稿 | 只顧一張 Hero 忽略互動和錯誤狀態 |
| G8 Deploy | CI PASS、Owner PR approval、Pages 實際 HTML/JSON/JS 正確、可 rollback | 只有 Jekyll README 網頁／部署失敗 |
| G9 Security | 第三方授權、依賴／Actions pin、內容注入／外部連結檢查 | 引入未核對素材或 secrets |

**官方 CWV good 門檻**：LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1，採 mobile/desktop 分開的 p75 field data；同時視需要測 GPU FPS、p95 frame-time、long animation frames、context loss 與熱。**注意：這些是驗收標準，不是目前站點數據。**

### 7.1 重現性要求

- 固定 `git SHA`、瀏覽器 build、可視尺寸與 DPR、網路、裝置電力與溫度起點；記錄是否有 data saver、低電量模式和 reduced-motion。
- 指定兩種 PoC 對同一個 scene 的冷啟動／暖啟動、互動重播與 idle/offscreen 行為；每組多次採樣，保存 trace 和圖像結果。
- 避免僅跑無頭 SwiftShader 而宣稱真手機 GPU 完成驗證。
- Browser screenshot 要有 desktop、mobile、reduced-motion、CSS poster、`GPU restored` 等狀態；記錄在何 commit。
- 真實產品做出來後需給一份「性能 vs 畫質」表（帶來源），任何 unknown 都不能變成漂亮的估算值。

## 8. 當前專案的風險與工作切分

| 風險 | 方案 |
| --- | --- |
| V1 `app.js` / `artifact.js` 是小型原生碼，但多場景可能膨脹 | 先拆 state / content / scene / scheduler / motion / quality 六責任，再讓真正的 V2 裝置接上 |
| Shader 場景與研究資料缺乏因果關係 | 定義 interaction contract，渲染器只 consume state |
| 高密度金色＋青藍參考易導致視覺噪音 | 堅持 1 焦點、留暗部、只在有語意的時刻啟用 peak |
| WebGPU 看似先進但支援不完整 | 不為了名稱改引擎；先測 WebGL2 SDF vs mesh |
| 公開 Pages 在舊版本曾顯示 README | 針對最後 URL 的 HTML + index + screenshot 做 deploy acceptance，而非只看 workflow green |
| PR #10 是**獨立的 V1 UX/GPU 修復** | 本設計分支**不包含也不代替 #10**；開發 V2 前要以 Owner 決定的最新 main 分支重新同步 |

### V2 技術演進候選次序

1. **資料索引和網站 DOM（不變）**：不重新造後端。
2. **三套靜態藝術稿**：選出最具辨識度的 silhouette；沒有 GPU 也要成立。
3. **兩個核心 renderer 小樣**：SDF vs mesh，同素材同輸入；不是正式頁面重構。
4. **單一狀態機與 domain → geometry mapping**。
5. **場景與 UI choreography**；考慮 GPU / DOM 同一 motion timeline。
6. **不同畫質及 fallback**；排程、context loss、資產消毒。
7. **五角色驗收、量測與受控 PR 發布**。

上述均為**待執行工作**。本輪只保存設計與技術研究，沒有下載、安裝新工具、修改現網、部署或執行 GPU benchmark。
