# 21｜THE OBSERVATORY V3：P0 驗收報告與 P1 交接書

> **版本：P0 closeout candidate｜2026-11-03（Asia/Taipei）**
>
> **審查狀態：待 Owner 審核 P0 手機星圖修正 PR、合併後正式站點複驗，才可標記「P0 已結案」。**
>
> **範圍說明：** 本文件記錄 V3 P0 研究內容館、保留 V2 的部署方式，以及 V2 研究入口與手機研究領域星圖的交互驗收。它**不是** P1 美術定案、也不是 WCAG 認證或效能測試報告。

## 0. 決策摘要

**P0 主功能已具備，正式結案只差最後一項手機星圖缺陷的修補與 Owner 複驗。**

- **V3 內容館：** Astro 6 靜態輸出、原始 Markdown 站內全文、Pagefind 中文全文搜尋、領域分類、來源 SHA／日期、章節目錄／反向連結與無 JavaScript 閱讀降級。
- **部署：** V2 根站保留在 `/Research-/`；V3 內容館位於 `/Research-/v3/`。不切換根路徑、不部署新的 3D 世界。
- **閱讀入口：** V2 研究列表的文章標題改為同分頁進入 V3；GitHub 原始碼是獨立的明確標示連結。V3 沒有收錄的來源不製造不存在的站內網址。
- **Owner 實機驗收：** 使用者回報 P0 五項操作通過；提出的唯一可見問題為 V2 手機星圖：固定桌面 SVG viewBox 壓縮中文／英文標籤、節點過小、空間分配不佳，已附手機截圖。本次修補限定在星圖手機投影、標籤與觸控，**待合併後重新檢查**。
- **P1 不自動啟動：** 此文件提供 G0 設計研究交接，不等於授權修改 P1 網頁、引入 3D／GSAP 或合併部署。

## 1. 建置、程式與資料狀態

| 項目 | P0 現況／證據 | 驗收性質 |
| --- | --- | --- |
| 靜態內容館 | `site/` Astro 6 + 獨立 `/Research-/v3/` base | 已合併實作 |
| Markdown 來源 | `research/`、`docs/governance/`、`showcase/design/`；依實際文件自動生成 HTML，不複製正文到獨立 Git 來源 | 自動驗證 |
| 排除規則 | `docs/governance/THREAT-MODEL.md` 不進 V3 HTML、搜尋或研究圖；**公開 GitHub Repo 本身仍可讀取此來源** | 自動驗證＋重要風險 |
| 全文索引 | Pagefind，20 個繁中關鍵字（治理、模型、研究、效能、安全、測試、代理、網頁、授權、資料庫、架構、索引、搜尋、動畫、來源、渲染、部署、工具、技術、設計） | Playwright Chromium，自動驗證 |
| 文件數 | PR #22 時：V3 67 篇全文、V2 65 筆來源索引，其中 63 筆可對應 V3，2 筆只有原始碼入口（`README.md`、`THREAT-MODEL.md`） | **歷史基線**；本報告加入後會增加一篇，以當次 CI 動態數量為準 |
| 文件溯源 | 每篇已產生的 V3 文章包含真實 git SHA／日期；站內連結、文件圖與路由完整性經建置驗證 | CI 通過，不代表外部研究內容全部真實正確 |
| 部署邊界 | PR 只建置，不部署；合併進 main 的受控 workflow 才可正式發布 | Workflow gate |
| V2 文章入口 | 點文章標題進 V3 同分頁、GitHub 原文另開 | Chromium E2E 及 Owner 操作回報 |

**相關已合併 PR：** #20 P0 內容館；#21 V2 + V3 併站部署；#22 V2 研究入口改為 V3 站內閱讀。這些編號是證據索引，不代表本次手機星圖修正已合併。

### 已知 GitHub Actions 通過紀錄（本次修正之前）

- PR #22 的 `Publish Research Showcase`：run `41477768527`，SUCCESS（整包 V2+V3、逐篇站內路徑驗證、Chromium 真正點擊 2/2）。
- PR #22 的 `Showcase static validation`：run `41477768469`，SUCCESS。
- PR #22 的 `Research integrity`：run `41477768573`，SUCCESS。
- PR #22 的 `V3 P0 build and checks`：run `41477768634`，SUCCESS。
- PR #22 路由稽核：63 筆實際站內路由存在、2 筆僅原始碼；V3 產物檔案逐件 hash 驗證。**本次新報告與修補仍需重新跑 CI。**

上述數字為曾實際回傳的 CI 結果，不是新 PR 的預先結論。

## 2. Gate 分級與剩餘問題

| Gate | 已取得的證據 | 判定 |
| --- | --- | --- |
| 站內全文與文件連結 | 67 篇歷史基線、來源 SHA／日期、建置前後與圖資料驗證 | **自動通過**，新增報告需再驗 |
| 中文全文搜尋 | 20 個詞在 Pagefind 回傳可開啟的站內結果 | **自動通過** |
| 無 JS／無 GPU 仍能閱讀 | V3 文章與無 JS 搜尋替代列表經 Chromium 驗證；P0 內容館不依賴 GPU | **自動通過**；不代表 V2 WebGL GPU 真機已驗 |
| 站內閱讀入口 | V2→V3 同分頁 Chromium E2E；Owner 回報五項操作皆通過 | **已驗證** |
| 響應式閱讀 | V3 360／768／1440 CSS px Playwright；Owner 實機回報其他功能正常 | **已驗證部分** |
| 無障礙 | axe WCAG 2.x 規則在 V3 代表頁面無 serious／critical 違規；鍵盤表格與 reduced motion 測試 | **自動通過其檢測範圍**，非 WCAG 2.2 AA 全面認證 |
| V2 手機研究領域星圖 | Owner 手機截圖顯示圓形與節點文字比例不適、過多空白 | **原版本不通過；修正 PR 待 CI／真機複驗** |
| P0 正式結案 | 本報告已提交審查，Owner 尚未批准本次星圖修補、部署後複驗 | **待 Owner** |

### 唯一已回報的手機視覺缺陷

原因：`showcase/index.html` 原用 `viewBox="0 0 1100 480"`，`showcase/styles.css` 在手機把圖高鎖為 340 CSS px，`showcase/app.js` 以桌面座標與英文單行標籤繪製，造成節點及字體縮小而擠在中段。

本次 PR 的修法：在 `max-width:760px` 使用獨立 `330×530` 直向座標、六個不重疊的星圖節點、繁體中文雙行文字及合宜的觸控尺寸；在桌機沿用舊 `1100×480` 佈局。新增 Playwright 320／360／393／430／760 CSS px 幾何、觸控選取、桌機↔手機視窗切換測試及截圖。

**驗收條件：** 所有六個節點可見；標籤完整置於其圓形範圍；節點間不相撞；所有領域可用點觸選取；桌機版節點佈局不變。CI 合格後，仍須 Owner 於真實手機確認構圖與實際觸控體驗。

## 3. 未驗證、風險與非 P0 項目

1. **真實手機 GPU 表現與熱量、耗電、FPS、Web Vitals p75：未量測。** 不以 Playwright／桌面 Chromium 模擬結果宣稱 POCO 或 iOS 性能達標。
2. **原生 TalkBack／VoiceOver、iOS Safari 行為與完整 WCAG 2.2 AA 人工稽核：未驗證。** 自動 axe 只擋 serious／critical。
3. **電影級美術、字體盲測、跨頁常駐 3D 場景、連續相機轉場：P1–P3 範圍，P0 沒有完成，也不應以 V2 星空圖代替 G0 設計方向。**
4. **來源隱私邊界：** `THREAT-MODEL.md` 僅排除 V3 發布；GitHub Repository 公開，文件仍可在 GitHub 讀取。若內容真的不能公開，須 Owner 另行處理資料保護與 Repo 可見性，不屬本次 PR。
5. **版本與文字漂移：** 原規劃書第 9 節是「未實作前的計畫」，本報告是截至本階段實際驗收的狀態；與較早的 V2 README 描述衝突時，以原始提交、最新 CI 與本報告的證據分級為準。

## 4. P0 正式結案程序

1. 本 PR 的 Showcase、Pages、V3、研究完整性 CI 全綠；手機版 E2E／對應證據可檢視。
2. Owner 審核 PR 變更，准予合併；部署到正式 Pages，V2 根路徑與 V3 子路徑均可讀。
3. Owner 在手機上重新確認六顆研究星圖節點的閱讀性、觸控與篩選；截圖上的原問題已消失。
4. 確認上述事項後，**Owner 明確標記 P0 Closeout：PASS**，再啟動獨立 P1 PR。若任一項失敗，維持 `P0 closeout pending` 並只修缺陷；不能直接宣告通過。

## 5. P1 美術 G0 接手內容

**北極星：** 研究館必須像一部連續、有導演意圖的數位藝術作品，而不是模板卡片拼成的科技企業官網；但研究閱讀、搜尋、來源與可及性永遠優先，不讓 Canvas 取代文字或導覽。

**必讀已存在的規格（不重寫基礎研究）：**

- [19｜V3 架構與 P0–P5 規劃](19-v3-astro-research-cinema-architecture-and-roadmap.md)：第 6.1、7、9 節。
- [20｜V3 執行書](20-v3-chatgpt-5-6-execution-brief.md)：P1 任務、驗收與權限邊界。
- [16｜Active Theory 品質基準](16-active-theory-quality-benchmark.md)；[17｜Arctic Waters 創作方法](17-arctic-waters-threejs-creative-workflow.md)；[18｜完整技術組合](18-v3-cinematic-experience-technology-decision.md)。
- `showcase/design/V2-ART-DIRECTION.md`：色票、金色／青色語義、Evidence Engine 輪廓、不複製參考作品的素材。

### P1 必交付

| 交付 | 可審查的完成定義 |
| --- | --- |
| Design Atlas | **3 個真正不同的構圖與字體方向 × 首頁桌機、首頁手機、文件頁、搜尋頁**，共 12 張靜止截圖，使用真實 P0 內容，非虛構資料 |
| 中文字體盲測 | Noto Serif TC、霞鶩文楷 TC、芫荽；同字串無品牌資訊並列，附正確授權與字形覆蓋核查 |
| Evidence Engine | 三視角黑白輪廓；取消 Glow、Bloom、彩光後仍有辨識度 |
| 讀取／搜索保護 | 手機直向、桌機、reduced motion 視圖均維持可閱讀、可搜索、可鍵盤操作，不縮退 P0 |
| 美術審查 | 各方案寫明敘事軸線、構圖節奏、字級比例與動態預期；清楚標示本階段**沒有** 3D、GSAP、影片或 GPU 渲染 |
| Owner G0 決策 | Owner 從靜止 Atlas 選定方向，並確認黑白輪廓，不得自行選定或提前開 P2 |

### P1 開工界線

- 預期在 `site/src/pages/atlas/` 以獨立 PR 呈現可審查的靜止 HTML／CSS／SVG 與可重現截圖；**本交接文件不授權直接執行 P1 代碼修改**。
- 不改 `main` V2 首頁、不切換 `/Research-/` 至 V3、不引進 Three.js／GSAP／額外依賴；新依賴或權限變更先請 Owner 決策。
- 不使用別人的品牌素材、影片、模型、圖片或原始碼當作網站成品。
- 以 320、360、393、430、768、1440 CSS px、reduced motion 檢視靜止構圖；不偽稱真機 FPS／LCP。
- P1 的 Owner 核准是 G0，P2 仍需獨立授權與 PR。

## 6. 可核對的檔案與操作

- V3 內容：`site/src/`、`site/scripts/`、`site/tests/browser/p0.spec.mjs`
- V2 研究入口：`showcase/app.js`、`showcase/reader-links.js`
- V2 手機星圖：`showcase/app.js`、`showcase/styles.css`
- 手機回歸測試：`site/tests/pages/mobile-constellation.spec.mjs`
- Pages 整包交叉驗證：`site/scripts/verify-pages-bundle.mjs`
- 正式站點：`https://waydefu.github.io/Research-/`（V2）、`https://waydefu.github.io/Research-/v3/`（V3）
- 本文件屬於公開網站研究內容，不儲存病患或任何私密診所資料。

## 7. Owner 最終簽核欄位

| 檢查項 | 狀態 |
| --- | --- |
| 本 PR CI | 待執行／報告更新 |
| 手機星圖正式站點複驗 | **待 Owner** |
| P0 可否標記 PASS | **待 Owner** |
| P1 G0 是否准許開工 | **未授權；需 Owner 獨立指示** |

**終態規則：** 不以「PR 已開」或「CI 綠燈」等同正式完成；Owner 確認 P0 手機缺陷消失後才結案。
