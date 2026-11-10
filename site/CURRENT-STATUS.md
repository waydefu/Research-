# Research-｜現況（2026-11-06）

> 這是**帶日期的快照**，不是自動更新的看板。動手前先查 [main commits](https://github.com/waydefu/Research-/commits/main)、[Open PR](https://github.com/waydefu/Research-/pulls)、[Actions](https://github.com/waydefu/Research-/actions)。2026-11-04 的舊版已封存為 [archive/CURRENT-STATUS-2026-11-04.md](./archive/CURRENT-STATUS-2026-11-04.md)；文件分類見 [DOCS-INDEX.md](./DOCS-INDEX.md)。

## 一句話

研究內容館（Astro 靜態站）與 Sanctum 首頁已上線；**即時 3D 觀測所仍是 `noindex` 預覽，尚未取代正式首頁**，因為真機量測與 Owner 美術簽核還沒完成。

## 已查證的事實

| 項目 | 結果 | 查證方式與界線 |
| --- | --- | --- |
| main 基線 | `67a0c80`（合併 PR #88 之後） | GitHub 查詢；之後的提交需重新確認 |
| Open PR | 典藏館視覺 PR 之外為 0 件 | GitHub 查詢（2026-11-06） |
| PR #87 的必過檢查 | 三條（Markdown/治理完整性、Astro 建置、單一站點組裝）皆 success 後合併 | [Research integrity run](https://github.com/waydefu/Research-/actions/runs/42226641146) |
| 網站頁數 | 99 頁、99 篇來源文章（含新收錄的研究 36、37） | 本地 `npm run build` 與 `unify-home` 輸出 |
| 依賴安全 | `npm audit` 0 個漏洞（先前 11/04 記錄的 critical／high 已不存在） | 本地 `npm audit --audit-level=low` |
| 單元與整合測試 | `astro check` + Node 測試 69／69 通過；Python 測試通過 | 本地執行 |
| 瀏覽器測試 | `tests/browser` 11／11、`tests/pages` 158／158 通過 | 本地以軟體 WebGL（SwiftShader）執行；**不等於真機** |

## 即時觀測所場景（`/v3/observatory/`）

2026-11-10 起，場景由**單一 WebGL2 著色器**即時繪製：中央奇點與十字星芒、向中心收束的等離子牆、環形刻度、飛散碎片、發光龜裂與反光地面，三種色彩主題（金色奇點、赤焰裂隙、冷光透鏡）。往下捲動時，畫面依序經歷「細縫 → 撕裂 → 龜裂 → 爆發」。不再使用 Three.js、GLB 模型或 Blender；設計說明見 [G1-01](./G1-01-CINEMATIC-OBSERVATORY.md)。

- **已驗證（軟體 WebGL，非真機）：** 畫面有白熱核心與深色空域、會動且暫停時不動、主題切換會改變色調、捲動會改變相位、強制海報／模組載入失敗／可見性恢復／context 遺失與恢復的退化行為；建置產物含著色器且無模型資產。
- **未量測（不得寫成 PASS）：** Android／iPhone 真機的 FPS、GPU 時間、發熱與耗電；LCP／INP／CLS；Owner 的目視簽核。程式會在裝置跟不上時自動降畫質，但降級門檻是依常識設定，沒有真機資料。
- **成本提醒：** 全螢幕片段著色器的耗電高於靜態頁面；`prefers-reduced-motion` 會停止動態，節能畫質開關與自動降級是目前唯一的保護。

## 典藏館（`/v3/library/`）

2026-11-06 起，英雄區改用與觀測所相同的海報大廳（取代通用的放大鏡插圖），領域列表為編號列與金框縮圖，主題與篩選區沿用同一套金色細線語言。`global.css` 內重複定義的規則已合併（相同層疊結果，20 張整頁截圖逐像素一致），三種近似的金色統一為單一 token。

- **已驗證：** 393／768／1024／1440 px 的整頁截圖；其他頁面的像素差異最多 0.74%、單通道偏差最大 8／255，Sanctum 首頁無變化。
- **未驗收：** 真機呈現與 Owner 視覺簽核；`global.css` 仍有 15 組因 `@media` 夾在中間而刻意保留的重複選擇器，尚未重構。

## 仍然開放的事項

| 事項 | 為何開放 | 下一步 |
| --- | --- | --- |
| 真機驗收 | 沒有實體裝置資料 | 依 [G0-REAL-DEVICE-PROTOCOL.md](./G0-REAL-DEVICE-PROTOCOL.md) 在同一 SHA 留存證據 |
| 正式首頁是否切換到 3D 觀測所 | 需要 Owner 目視簽核與真機結果 | 簽核後以獨立 PR 切換；舊首頁可用 git revert 還原 |
| Blender 精雕資產 | 目前程序化幾何與海報仍有細節差距 | 真機通過、確認瓶頸在材質細節後再投資 |
| 47 篇原始研究的逐項事實驗證 | 目前只有分類、處置與查證界線登記 | 依 [P1-ISSUE59-REVIEW.md](./P1-ISSUE59-REVIEW.md) 逐篇補強；不改原文 |
| EAG-100 完整驗收 | 缺少沙盒、權限提升負向測試、不可竄改稽核等證據 | 見 [docs/governance](../docs/governance/README.md) |
| GitHub Ruleset 現況 | 本次沒有查詢 GitHub 設定頁 | 11/04 記錄為已啟用 `main-eag-100`；變更前重新確認 |

## 接手最短路徑

1. 規則：根目錄 [AGENTS.md](../AGENTS.md) → [AGENTS.md（site）](./AGENTS.md)。
2. 程式：[REPO-MAP.md](./REPO-MAP.md) → [architecture/README.md](./architecture/README.md) → 目標模組與其測試。
3. 驗證（在 `site/`）：`npm ci` → `npm run check` → `npm run build` → `npm run provenance` → `npm run e2e`；完整頁面組裝另跑 `node scripts/unify-home.mjs && node scripts/verify-pages-bundle.mjs && npx playwright test --config playwright.pages.config.mjs`。
4. 新增研究：[RESEARCH-CURATION.md](./RESEARCH-CURATION.md)「新增研究 PR｜必過收錄流程」。

## 修訂紀錄

- 2026-11-06：重寫為只含已查證事實的現況；舊版原樣封存。
