# 21｜THE OBSERVATORY V3：P0 驗收報告與 P1 交接書

> **版本：歷史 P0 交接 + 2026-11-03 現況校正**
>
> **現況規則：** 本文件前半保留 P0 歷史驗收證據；若與 2026-11-03 現況衝突，以本文件 Current Baseline、最新 main、open PR 與 CI 為準。
>
> **範圍說明：** 本文件記錄 V3 P0 研究內容館、保留 V2 的部署方式，以及 V2 研究入口與手機研究領域星圖的交互驗收。它**不是** P1 美術定案、也不是 WCAG 認證或效能測試報告。

## 0. Current Baseline（2026-11-03）

- 正式根入口目前是 Sanctum：\`/Research-/\`。
- 舊 V2 已歸檔：\`/Research-/v2/\`。
- V3 研究閱讀／搜尋仍位於：\`/Research-/v3/\`。
- \`site/scripts/unify-home.mjs\` 明確輸出「One front door: /Research-/; V2 archive: /v2/; V3 reader and search remain」。
- PR #26、#31、#33 已是後續已完成變更；PR #35 是本基線建立時的首頁修正候選。**PR 是否仍 open 不作永久事實；執行／合併本文件前重新讀取 current main 與 PR #35，若已合併就直接採用新 main。**
- PR #36 在審查前 HEAD \`8fb9e3695d0b463adfdbad131b103e6ed5b84c8a\` 的 Research integrity、V3 P0、Publish Research Showcase 三組 CI 均 SUCCESS；文件更新後必須看新 HEAD。
- 下方任何「V2 是 root」「P5 才切 root」「未准任何 P1 工作」均屬**歷史 P0 敘述**，不可當成目前執行命令。

## 0.1 歷史 P0 決策摘要

**以下保留 P0 當時的驗收脈絡，用於追溯，不代表 2026-11-03 的現行路由。**

- **V3 內容館：** Astro 6 靜態輸出、原始 Markdown 站內全文、Pagefind 中文全文搜尋、領域分類、來源 SHA／日期、章節目錄／反向連結與無 JavaScript 閱讀降級。
- **部署（歷史狀態）：** P0 當時 V2 曾保留在 `/Research-/`、V3 在 `/v3/`；**現況已由後續 PR 改為 Sanctum root + `/v2/` legacy + `/v3/` reader。**
- **閱讀入口：** V2 研究列表的文章標題改為同分頁進入 V3；GitHub 原始碼是獨立的明確標示連結。V3 沒有收錄的來源不製造不存在的站內網址。
- **Owner 實機驗收：** 使用者回報 P0 五項操作通過；提出的唯一可見問題為 V2 手機星圖：固定桌面 SVG viewBox 壓縮中文／英文標籤、節點過小、空間分配不佳，已附手機截圖。本次修補限定在星圖手機投影、標籤與觸控，**待合併後重新檢查**。
- **P1 授權邊界：** 已授權／已進行的 G0 收尾與必要 bugfix 可繼續；新的大規模 P1 production implementation 依 P0.5 Blocking Gates 或 Owner waiver 決定。

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

### 本次修正後可查驗的 CI 與手機截圖（2026-11-03）

**驗證程式 commit：** `d04d0ec9ea53a5b0de7e1c230ba7542b88aefb3e`。此後若再修改報告文字，需要對最終 PR HEAD 重新執行 CI；不能用此成功紀錄覆蓋新版本失敗。

| 工作流程 | Actions run | 實際結果 |
| --- | --- | --- |
| Publish Research Showcase | `41482519993` | **SUCCESS**；V2 + V3 產物驗證、Chromium 9/9（V2→V3 與手機星圖） |
| Showcase static validation | `41482519833` | **SUCCESS** |
| Research integrity | `41482519857` | **SUCCESS** |
| V3 P0 build and checks | `41482519864` | **SUCCESS**；維持中文搜尋、無 JS、axe 等原有回歸驗證 |

本輪 Pages CI：`P0 preflight: 68 Markdown files`、V2→V3 **64 條**站內文章路徑可達、2 條明確限於原始碼；**68 篇 V3 文件**與 **176 個完全一致的 V3 產物檔**已通過驗證。新增的 P0 報告已被計入研究全文。

**視覺與操作證據：** `v2-v3-reader-test-evidence` artifact（run `41482519993`，保留七天），包含 `mobile-map-320.png`、`mobile-map-360.png`、`mobile-map-393.png`、`mobile-map-430.png`、`mobile-map-760.png`。Chromium 檢查每個節點文字邊界、彼此距離、最小觸控直徑、領域點選與桌面 ↔ 手機版回復。已人工檢視其中 320／360 截圖，沒有原先的標籤溢出；**此證據仍不是 Owner 實機複驗**。

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

## 4. P0.5 治理與 P1 邊界

### 4.1 A：Current CI Verification

A 不再假設「目前 CI 有 blocker」。

本輪審查前 PR #36 HEAD \`8fb9e3695d0b463adfdbad131b103e6ed5b84c8a\`（2026-11-03）已取得：
- Research integrity：SUCCESS
- V3 P0 build and checks：SUCCESS
- Publish Research Showcase：SUCCESS

因此在該 SHA 上 A = **PASS evidence**。本文件修改後只需對新的最終 HEAD 重新驗證；若仍全綠，更新 SHA / 日期後關閉 A；只有出現真實 regression 才開修復工作。

### 4.2 Blocking / Parallel / Break-glass

| 類型 | 項目 |
| --- | --- |
| **Blocking（新的大規模 P1 production 前）** | C Metadata、D Architecture/ADR、E 模組化/Design System、F Code/Visual Gate、G 視覺/繁中、H 單一 deploy source |
| **Parallel** | B Safe Required Checks、I Security/Dependency 完整治理、J Supply-chain/License Registry、K Skills、L Re-baseline、M ingestion |
| **Break-glass** | production bug、security/secret、license/legal、重大 a11y、CI outage；可隨時插隊 |

**既有 G0 收尾與必要首頁／閱讀 bugfix 不被 P0.5 凍結。**

### 4.3 B：Required Checks 的安全前置條件

目前 \`v3-p0-build.yml\` 與 \`publish-showcase.yml\` 的 \`pull_request\` 都有 \`paths:\` 過濾，所以**不能直接把現有 raw workflow context 設成全 Repo Required Check**。

先做：
1. every-PR always-reporting wrapper（或等價穩定 context）；
2. path classifier 決定跑昂貴 V3/Pages 或輕量檢查；
3. 用 root/docs-only PR 與 site/research PR 各驗一次；
4. 兩類 PR 都會回報明確 status 後，才修改 \`main-eag-100\`。

### 4.4 Waiver / Break-glass 紀錄

\`\`\`text
Decision maker:
Reason:
Scope:
Risk accepted:
Expires / revisit by:
Deferred verification:
Follow-up issue / PR:
\`\`\`

Security、secret、license、production regression 不等待 H 或其他治理階段；先止血，再補回歸與追蹤。

### 4.5 P1 開工規則

- **已授權／已進行的 G0 收尾：可繼續。**
- **低風險 bugfix：可繼續。**
- **新的大規模 P1 production implementation：Blocking C–H 完成，或 Owner 留下具體 waiver 後才進。**
- Parallel governance 未完成不會自動凍結所有產品工作，但必須保持可見狀態與 follow-up。

## 5. P1 美術 G0 接手內容

**北極星：** 研究館必須像一部連續、有導演意圖的數位藝術作品，而不是模板卡片拼成的科技企業官網；但研究閱讀、搜尋、來源與可及性永遠優先，不讓 Canvas 取代文字或導覽。

**必讀已存在的規格（不重寫基礎研究）：**

- [19｜V3 架構與 P0–P5 規劃](19-v3-astro-research-cinema-architecture-and-roadmap.md)：第 6.1、7、9 節；以 §9 的 Blocking / Parallel / Break-glass 規則為準。
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
- **現況 root 已是 Sanctum、V2 已在 `/v2/`；禁止把舊 P0 路由敘述當成回退指令。** 本階段不引進 Three.js／GSAP／額外依賴；新依賴或權限變更先請 Owner 決策。
- 不使用別人的品牌素材、影片、模型、圖片或原始碼當作網站成品。
- 以 320、360、393、430、768、1440 CSS px、reduced motion 檢視靜止構圖；不偽稱真機 FPS／LCP。
- P1 的 Owner 核准是 G0，P2 仍需獨立授權與 PR；新的大規模 production 依 Blocking Gate / waiver，既有 G0 收尾與 break-glass 修補不受 Parallel Governance 阻擋。

## 6. 可核對的檔案與操作

- V3 內容：`site/src/`、`site/scripts/`、`site/tests/browser/p0.spec.mjs`
- V2 研究入口：`showcase/app.js`、`showcase/reader-links.js`
- V2 手機星圖：`showcase/app.js`、`showcase/styles.css`
- 手機回歸測試：`site/tests/pages/mobile-constellation.spec.mjs`
- Pages 整包交叉驗證：`site/scripts/verify-pages-bundle.mjs`
- 正式站點：`https://waydefu.github.io/Research-/`（Sanctum root）、`https://waydefu.github.io/Research-/v2/`（legacy V2）、`https://waydefu.github.io/Research-/v3/`（研究閱讀／搜尋）
- 本文件屬於公開網站研究內容，不儲存病患或任何私密診所資料。

## 7. Owner 最終簽核欄位

| 檢查項 | 狀態 |
| --- | --- |
| 本 PR 修補程式版 CI | **四組成功、9/9 Pages E2E 通過**；本報告文字更新後仍需最終 HEAD CI 重驗 |
| 手機星圖正式站點複驗 | **待 Owner** |
| P0 可否標記 PASS | **待 Owner** |
| P1 G0 / 收尾 | **依後續 Owner 已授權工作與 open PR 現況執行；本歷史欄位不再覆蓋後續授權** |

**終態規則：** 不以「PR 已開」或「CI 綠燈」等同正式完成；Owner 確認 P0 手機缺陷消失後才結案。
