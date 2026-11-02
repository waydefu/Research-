# 20｜THE OBSERVATORY V3：ChatGPT 5.6 專用執行書

> **執行手冊 v1｜2026-11-02（Asia/Taipei）｜待 Repo Owner 審查**
> **用途：** 把 [19｜V3 架構與規劃書](19-v3-astro-research-cinema-architecture-and-roadmap.md) 交給 ChatGPT 5.6（在 Codex 中）分階段實作時，直接複製使用的指令與提示詞。
> **重要：** 本文件不授權任何實作、部署或設定變更；每個階段仍需 Owner 在對話中明確開工，並逐一審查 PR。GPT-5.6 的行為描述來自 OpenAI 官方文件與報導（見第 6 節），**不是本 Repo 的實測結果**。

## 0. 使用方式（給 Owner）

| 項目 | 建議 |
| --- | --- |
| 在哪裡用 | Codex（ChatGPT 桌面版、CLI 或雲端任務），連接 `waydefu/Research-` |
| 模型 | GPT-5.6 Sol（Plus 以上方案可選）；Terra 可用於小修正與文件工作 |
| 推理強度 | P0、P4 用預設的 Medium；P2、P3（3D 與導演系統）用 High。官方建議只有在**實測有品質提升**時才用 xhigh／max |
| 長期規則放哪 | 第 2 節整段寫進 `site/AGENTS.md`（P0 的第一個提交）。Codex 會自動載入，越接近檔案的 AGENTS.md 優先 |
| 每次任務貼什麼 | 第 3 節對應階段的提示詞，一個階段開一個對話 |
| 開工前 | P0 與 P2 先用 Plan 模式（`/plan` 或 Shift+Tab）讓它提出計畫，你確認後再執行 |
| 開 PR 前 | 用第 4 節的審查提示詞跑 `/review`，再開一個新對話做獨立審查 |

**不要額外加的東西：** 「請簡潔」「一定要」「絕對不可」這類強調語、全大寫、重複的「先問我」。GPT-5.6 預設已經比較精簡；官方指南指出重複的確認指令會讓它不必要地停下來問；據 Decrypt 對同一指南的報導，互相衝突的規則比缺少細節更容易造成不穩定。

**版本提醒：** 2026-11-02 查證時，Codex 最佳實踐頁已提到 GPT-6 系列模型。若你改用 GPT-6.x，本書的結構仍適用，但請先重讀該模型的官方提示詞指南；官方提醒 GPT-6 對 `AGENTS.md` 與 skills 內的指令較敏感。

## 1. GPT-5.6 的習慣與本書的對應寫法

| 官方描述的習慣 | 本書因此怎麼寫 |
| --- | --- |
| 預設比 GPT-5.5 更精簡；廣泛的「請簡潔」可能讓回答過短 | 不寫「請簡潔」；改為明確列出回報**必須包含**的項目（第 2 節「回報格式」） |
| 多步驟任務會主動、持續推進 | 清楚寫出「可直接做」與「需要先問」兩張清單，每條規則只寫一次 |
| 會推斷背後目標，但仍需要領域背景、硬性限制、批准邊界、成功標準，以及何時該因不明確而提問 | 每個階段提示詞都有 Goal／Context／Constraints／Done when，並寫明「什麼情況要停下來問」 |
| 結果導向：說明好結果長什麼樣、何時停止、硬性限制；不要逐步規定做法 | 提示詞描述交付物與驗收條件，不規定程式怎麼寫 |
| 精簡的提示詞在 OpenAI 內部 coding agent 評測中分數提升約 10–15%，token 減少 41–66%（官方稱為方向性數字） | 主執行書控制在一頁內；細節放在 19，用路徑引用 |
| 前端版面與視覺層次較強 | 仍提供色票、字體、反模板規則，避免它用「通用精緻」取代本專案的美術方向 |
| 推理強度預設 `medium`；從 GPT-5.5 遷移時先維持原設定再測低一級 | 依階段建議強度（第 0 節），不預設最高 |
| Codex：任務提示詞包含目標、背景、限制、完成條件；長期規則放 AGENTS.md 且保持簡短；同一錯誤出現兩次就更新 AGENTS.md | 主執行書 → `site/AGENTS.md`；階段任務 → 對話提示詞；第 5 節的失誤對策可在發生兩次後補進 AGENTS.md |

## 2. 主執行書（寫進 `site/AGENTS.md`）

```markdown
# site/ — THE OBSERVATORY V3

## 目標
把 Research- 重構成一座可完整閱讀的研究館：research/、docs/governance/、showcase/design/ 的每一篇 Markdown 都在站內有自己的頁面，並由一個貫穿全站、由研究資料生成的 3D 世界串起來。完整規格在 research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap.md。

## 規格優先順序
Owner 在對話中的指示 > 本檔 > 19 號文件 > 18 號文件。發現兩者衝突時，停下來說明衝突並提問，不要自行取捨。

## 技術組合
Astro 6（output: 'static'）+ TypeScript 6、<ClientRouter /> + transition:persist、content collections + remark/rehype 外掛、Shiki、Pagefind（zh-TW）、Three.js WebGLRenderer（WebGL2，原生 TS）、GSAP 主時間軸、Blender → GLB（meshopt、KTX2）、Vitest、Playwright、axe-core。
不使用：React／R3F、Next.js、WebGPU renderer、Lenis 或其他捲動接管、第二套動畫或 3D 函式庫、資料庫、登入、字體或腳本 CDN。

## 可以直接做
- 讀取整個 repo。
- 在 site/ 內新增、修改檔案；安裝本檔「技術組合」列出的套件並提交 lockfile。
- 執行 build、test、lint、typecheck、Playwright 截圖。
- 在自己的功能分支提交，推送並開 PR（PR 說明照「回報格式」）。

## 需要先問 Owner
- 新增技術組合以外的依賴：附名稱、版本、授權、用途、替代方案。
- 修改 site/ 以外的任何檔案。
- 修改 .github/workflows、GitHub Pages 或 repo 設定。
- 合併 PR、部署、刪除檔案。
- 規格沒有涵蓋、而且做錯會難以回復的決定。

## 資料與素材
- research/、docs/、showcase/ 是唯讀資料來源：不修改、不複製進 site/；連結問題在內容管線中處理。
- 研究文件之間的連結改寫成站內路由；外部官方來源保留外部連結；本 repo 的 PR／Ruleset 網址顯示為純文字。
- 3D 模型、貼圖、字體必須原創或具可再散布授權，授權記錄放在 site/ASSETS.md。不使用 Active Theory、Arctic Waters 或任何參考截圖的素材、輪廓與程式碼。

## 品質規則
- 所有文字、導覽、搜尋都在 DOM；canvas 設 aria-hidden，且每個 3D 互動都有 DOM 等價入口。
- 首屏標題不等待 3D；three.js 與 GLB 在首屏繪製之後才載入。
- 文件頁鏡頭到位後停止持續繪製。
- prefers-reduced-motion、WebGL 失敗、無 JS 時，全站仍可完整閱讀。
- 美術依 showcase/design/V2-ART-DIRECTION.md 的色票與色彩語義：金色代表目前焦點，不代表「已驗證」。
- 避免模板感：一致圓角卡片、裝飾性漸層、每節都有全大寫小標、每個區塊都淡入上滑。

## 證據規則
- 沒有在真實裝置量測的效能數字，一律寫「未量測」，不估算 FPS。
- CI 通過只代表設定的檢查通過，不等於美術或真機驗收。
- 找不到資料時回報 Unknown，不推論。

## 完成的定義
- npm run check（typecheck + lint + unit）與 npm run build 通過。
- 本階段 Gate（19 號文件第 9 節）的每一項都有證據：指令輸出、截圖路徑或測試名稱。
- 360、768、1440 px 與 reduced-motion 四組 Playwright 截圖附在 PR。

## 回報格式（每次任務結束與每個 PR 說明）
1. 結論：本階段 Gate 通過／未通過，一句話。
2. 變更：檔案與用途。
3. 證據：Gate 逐項對應的指令、測試或截圖。
4. 未完成與未量測：明列。
5. 需要 Owner 決定的事項。

## 指令
（P0 建立 site/package.json 後補上實際指令）
```

## 3. 分階段任務提示詞

每段直接貼進新對話。內容刻意只寫目標、背景、限制與完成條件，做法交給模型。

### P0｜內容館（推理強度：Medium；先用 Plan 模式）

```text
Goal
建立 site/ 的 Astro 6 靜態網站，讓 research/、docs/governance/、showcase/design/ 的所有 Markdown（撰寫時約 66 篇，以實際檔案為準）全部在站內可讀、可搜尋。這一階段完全沒有 3D。

Context
- 規格：research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap.md 第 3、4、5、9 節。
- 長期規則：第一個提交先建立 site/AGENTS.md，內容取自 research/2026-11-universal-web-engine/20-v3-chatgpt-5-6-execution-brief.md 第 2 節。
- 內容特性：61 篇有表格、16 篇有程式碼或 ASCII 圖、showcase/design/ 有 2 張 SVG 插圖、沒有 frontmatter。
- 現有 showcase/ 是 V2，保持不動。

Constraints
- 先驗證 glob() 能否讀取 site/ 之外的上層目錄；不行就提出替代方案並停下來問，不要把 Markdown 複製進 git。
- 不修改任何研究文件；連結與 metadata 問題在 remark/rehype 外掛中處理。
- 壞連結讓建置失敗。
- 不改 .github/workflows；若需要 CI 或預覽部署，在 PR 說明中提出建議即可。

Done when
- 每一篇 Markdown 都有頁面，並以測試比對實際檔案數；站內連結全部改寫；輸出中指向本 repo 檔案的 GitHub 連結數為 0，並有測試保證。
- 每篇顯示標題、領域、日期、來源 commit SHA（純文字）、目錄與反向連結。
- 表格在 360px 可橫向捲動且不裁字；ASCII 圖保持等寬。
- Pagefind 搜尋可用；在 PR 中列出 20 個中文詞的搜尋結果抽測。
- 停用 JS 時所有文件頁可讀；axe 無 serious／critical 問題。
- 照 AGENTS.md 的回報格式開 PR。
```

### P1｜美術 G0：靜止畫面（推理強度：Medium）

```text
Goal
產出 Design Atlas，讓 Owner 只看靜止畫面就能選定 V3 的美術方向。

Context
- 規格：19 號文件第 6.1、7 節；showcase/design/V2-ART-DIRECTION.md 的色票、Evidence Engine 輪廓與色彩語義；research/2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow.md 的 Design Atlas 做法。
- 以 P0 的真實內容排版，不用假文。

Constraints
- 靜態 HTML/CSS/SVG 即可，放在 site/src/pages/atlas/，不寫 WebGL。
- 三個方向必須在構圖、字體、版面節奏上真正不同，不是同一版換色。
- 展示字體候選需附 SIL OFL 授權來源與繁中字元覆蓋檢查。

Done when
- 3 個方向 ×（首頁桌機、首頁手機、文件頁、搜尋頁）共 12 張截圖。
- 字體盲測頁：同一段標題與內文用各候選字體並排，不標字體名稱。
- Evidence Engine 三視角黑白輪廓圖，移除所有光效仍可辨識。
- PR 說明每個方向一句話的設計主張，並請 Owner 選擇。
```

### P2｜3D PoC G1：一個場景、一次飛行（推理強度：High；先用 Plan 模式）

```text
Goal
在 Owner 選定的美術方向上，完成一個精緻的 3D 場景與「首頁 → 文件頁」的一次連續鏡頭飛行。

Context
- 規格：19 號文件第 3.2、6 節。
- 星圖資料來自 P0 產生的 graph.json；座標在建置時預算。
- Evidence Engine 的 GLB 由 Owner 在 Blender 製作或提供；尚未提供時，用程序化幾何做占位並在 PR 中標明。

Constraints
- 第一件事：在 Chrome Android 與 iOS Safari 驗證 transition:persist 換頁後 canvas 與 WebGL context 不重建。無法取得裝置時，標記為未驗證並說明需要誰協助，不要宣稱通過。
- 世界層只透過 URL 得知焦點；星圖點擊呼叫 navigate()。
- three.js 與 GLB 在首屏繪製之後才載入；文件頁鏡頭到位後停止持續繪製。
- 提供 ?lab=1 的 Art Direction Lab（光源、金色強度、青色輪廓光、粗糙度、Bloom、FOV、曝光），設定可存成 JSON 並重播；正式頁面不載入它。

Done when
- 飛行轉場可被下一次導覽打斷，不阻擋點擊或捲動。
- WebGL 不可用、context lost、reduced-motion 三種情況都有截圖或測試證明內容可讀。
- 品質分級雛形：Basic／Balanced／High 的切換條件寫在程式與 PR 說明中。
- 效能欄位只填實際量測值，其餘寫「未量測」。
```

### P3｜導演系統 G2：連續電影（推理強度：High）

```text
Goal
把 P2 的單次飛行擴成完整的導演系統：首頁開場與 intro／explore／reading／search 四種模式。

Context
- 規格：19 號文件第 6.2、6.3 節；research/2026-11-universal-web-engine/16-active-theory-quality-benchmark.md 第 1.1 節的節奏原則（安靜 → 問題 → 聚焦 → 揭露 → 可繼續探索）。

Constraints
- 一條 GSAP 主時間軸，由一個 Director 管理；不加入其他動畫函式庫。
- 開場有可見的跳過按鈕；第二次造訪預設不播。
- reduced-motion 時鏡頭直接切到終態。
- 任何時刻都能在一次操作內開始閱讀文件。

Done when
- 四種模式各有錄影或連續截圖，並說明鏡頭揭示了什麼研究內容。
- 快速連續換頁 3 次後，沒有重複的 canvas、事件監聽或 requestAnimationFrame。
- PR 說明附自評：哪裡仍像「網頁 + 背景動畫」、下一步怎麼改。
```

### P4｜研究功能 G3（推理強度：Medium）

```text
Goal
讓研究館在功能上完整：從任一篇文件，兩次操作內能到達相關文件，且世界與 DOM 永遠同一狀態。

Context
- 規格：19 號文件第 5、6.2、9 節。

Constraints
- 章節目錄與捲動位置同步；目前章節可微調鏡頭，但閱讀時不持續繪製。
- 搜尋支援以領域篩選；結果同步點亮星圖節點。

Done when
- 反向連結、領域頁星域鏡頭、搜尋篩選都有端到端測試。
- 鍵盤、單指觸控、200% 縮放都能完成「搜尋 → 開啟文件 → 跳到相關文件」。
```

### P5｜真機驗收與切換 G4（推理強度：Medium）

```text
Goal
產出可供 Owner 決定是否正式切換的真機證據，並準備切換 PR（不自行合併或部署）。

Context
- 規格：19 號文件第 8 節；research/2026-11-universal-web-engine/13-design-performance-and-architecture.md 第 7 節的量測協定與第 7.5 節負向測試。

Constraints
- 每個數字附裝置型號、瀏覽器版本、DPR、網路、量測工具；拿不到的欄位寫 null。
- 不得用模擬器或桌機數字代表手機。

Done when
- 負向測試 10 項逐項結果。
- 切換 PR：根路徑改為 V3，V2 移到 /v2/ 作為回退；PR 標明需要 Owner 批准的 workflow 與 Pages 變更。
```

## 4. 驗收與審查提示詞

### 4.1 開 PR 前自我審查（同一對話，用 `/review` 的自訂指示）

```text
對照 19 號文件第 9 節本階段 Gate 與 site/AGENTS.md，審查目前的 diff。
列出：未達成的 Gate 項目、沒有證據支持的完成宣稱、違反「需要先問 Owner」的變更、模板感的視覺。
只回報發現與建議修法，不要修改檔案。
```

### 4.2 獨立審查（開一個新對話，不提供實作過程）

```text
你是這個 PR 的審查者，沒有參與實作。
依據：research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap.md、site/AGENTS.md、PR diff 與 PR 說明中的截圖。
判斷這個 PR 是否可以交給 Owner 做最終審查。依嚴重度列出問題，每項附檔案位置與證據。
特別檢查：研究文件是否被修改或複製、是否有文字只存在於 canvas、是否有未量測卻寫成結果的效能數字、是否新增未授權的依賴或 workflow 變更。
只回報，不修改。
```

### 4.3 修正迴圈

```text
依審查結果修正。每一項問題對應一個提交或說明為何不修。
同一個測試連續失敗兩次時，停止重試，回報失敗輸出、你的假設與需要的協助。
```

### 4.4 視覺評審（附截圖）

```text
看附上的 360、768、1440 px 與 reduced-motion 截圖。
以 showcase/design/V2-ART-DIRECTION.md 第 8 節的拒絕門檻逐條判斷，並指出畫面中最像「模板」的三個地方與具體改法。
```

## 5. 常見失誤與對策

| 可能的失誤 | 對策 |
| --- | --- |
| 宣稱「流暢 60 FPS」「效能優秀」但沒有真機數據 | AGENTS.md 證據規則；P5 要求每個數字附環境，缺的寫 null |
| 為了修連結而改動研究文件 | AGENTS.md 把 research/ 列為唯讀；審查提示詞專門檢查 |
| 把 Markdown 複製進 site/ | P0 限制：只能用 loader 或建置時讀取 |
| 把標題或文件清單畫進 canvas | 品質規則：所有文字在 DOM；canvas 為 aria-hidden |
| 自行加入 Lenis、Motion、R3F 或 WebGPU | 技術組合的「不使用」清單；新依賴須先問 |
| 一個 PR 跨好幾個階段 | 每階段一個對話、一個 PR；Done when 以階段 Gate 為準 |
| 用 CDN 載入字體或 three.js | 「不使用」清單已列字體與腳本 CDN |
| 改 GitHub Actions 讓預覽能部署 | 需要先問；P0 只在 PR 說明中提出 |
| CI 一直失敗、反覆重試 | 4.3：連續兩次失敗就停止並回報 |
| 美術變成通用的「精緻 SaaS」風格 | P1 先定案靜止畫面；4.4 視覺評審 |
| 同一錯誤出現兩次 | 依 Codex 最佳實踐，請它寫一段回顧並補進 site/AGENTS.md |

## 6. 來源

**OpenAI 官方（2026-11-02 查證）：**
- GPT-5.6 提示詞指南（精簡預設、主動性、意圖推斷、批准邊界、推理強度、精簡提示詞評測、Programmatic Tool Calling）：https://developers.openai.com/api/docs/guides/prompt-guidance-gpt-5p6
- GPT-5.6 模型指南（Sol／Terra／Luna、推理強度選項、遷移說明）：https://developers.openai.com/api/docs/guides/gpt-5.6
- Codex 最佳實踐（Goal／Context／Constraints／Done when、AGENTS.md、Plan 模式、`/review`、worktrees）：https://learn.chatgpt.com/guides/best-practices

**次級來源（報導，非官方）：**
- GIGAZINE，GPT-5.6 發布、ChatGPT 與 Codex 各方案可用的模型：https://gigazine.net/gsc_news/en/20260710-gpt-5-6-openai/
- Decrypt，OpenAI GPT-5.6 提示詞指南摘要（結果導向、應捨棄的舊習慣），2026-07-13：https://decrypt.co/373439/openai-new-gpt-5-6-prompt-guide-chatgpt

**研究庫：** [19 架構與規劃書](19-v3-astro-research-cinema-architecture-and-roadmap.md)、[18 技術盤點](18-v3-cinematic-experience-technology-decision.md)、[Agent 工作流](../2026-11-agent-repository-operations/06-agent-workflows.md)、[V2 美術規格](../../showcase/design/V2-ART-DIRECTION.md)。

---

**修訂紀錄｜2026-11-02 v1**：依 OpenAI GPT-5.6 與 Codex 官方指南，建立 V3 的主執行書、P0–P5 任務提示詞、審查提示詞與失誤對策。未在本 Repo 實際執行任何 GPT-5.6 任務。
