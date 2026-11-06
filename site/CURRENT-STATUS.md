# Research-｜現況（2026-11-06）

> 這是**帶日期的快照**，不是自動更新的看板。動手前先查 [main commits](https://github.com/waydefu/Research-/commits/main)、[Open PR](https://github.com/waydefu/Research-/pulls)、[Actions](https://github.com/waydefu/Research-/actions)。2026-11-04 的舊版已封存為 [archive/CURRENT-STATUS-2026-11-04.md](./archive/CURRENT-STATUS-2026-11-04.md)；文件分類見 [DOCS-INDEX.md](./DOCS-INDEX.md)。

## 一句話

研究內容館（Astro 靜態站）與 Sanctum 首頁已上線；**即時 3D 觀測所仍是 `noindex` 預覽，尚未取代正式首頁**，因為真機量測與 Owner 美術簽核還沒完成。

## 已查證的事實

| 項目 | 結果 | 查證方式與界線 |
| --- | --- | --- |
| main 基線 | `03642d8`（合併 PR #87 之後） | GitHub 查詢；之後的提交需重新確認 |
| Open PR | 收錄研究 36、37 的 PR 之外為 0 件 | GitHub 查詢（2026-11-06） |
| PR #87 的必過檢查 | 三條（Markdown/治理完整性、Astro 建置、單一站點組裝）皆 success 後合併 | [Research integrity run](https://github.com/waydefu/Research-/actions/runs/42226641146) |
| 網站頁數 | 99 頁、99 篇來源文章（含新收錄的研究 36、37） | 本地 `npm run build` 與 `unify-home` 輸出 |
| 依賴安全 | `npm audit` 0 個漏洞（先前 11/04 記錄的 critical／high 已不存在） | 本地 `npm audit --audit-level=low` |
| 單元與整合測試 | `astro check` + Node 測試 69／69 通過；Python 測試通過 | 本地執行 |
| 瀏覽器測試 | `tests/browser` 11／11、`tests/pages` 158／158 通過 | 本地以軟體 WebGL（SwiftShader）執行；**不等於真機** |

## 即時 3D 觀測所（`/v3/observatory/`）

2026-11-06 起，即時場景與海報採同一套美術方向：自製夜間觀測廳環境反射、發光核心光源、與海報一致的金色材質、深色底座，並遮罩背景避免出現兩座天文儀。直向螢幕會自動拉遠鏡頭以免裁切最大的環。

- **已驗證：** 桌面 1440 與手機 393 寬度的軟體渲染截圖、GLB 結構測試、WebGL 失效退化路徑測試。
- **未量測（不得寫成 PASS）：** Android／iPhone 真機的 FPS、GPU 時間、發熱與耗電；LCP／INP／CLS；Owner 對照原始參考圖的目視簽核。
- **仍然成立的限制：** 模型是程式生成的原創幾何，不是 Blender 精雕；沒有 UV、法線或 ORM 貼圖。

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
