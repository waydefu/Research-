# 網站架構契約｜P0.5 收斂版

**範圍**：僅說明目前已存在的 `site/` 靜態網站架構與最低維護邊界。此文件不是 Three.js、P2 或全站重構的開工授權。

## 內容與顯示單向流

1. `research/`、`docs/governance/`（排除 THREAT-MODEL）與 `showcase/design/` 保留唯一來源 Markdown。
2. `site/src/lib/catalog.mjs` 建立檔案路徑、來源 SHA、領域與永久網址；`research-metadata.mjs` 組合 `research-taxonomy.mjs`、`research-leads.mjs`、`metadata-schema.mjs`。
3. `public-articles.mjs` 是逐篇核對的通用技術正文編輯層；原文仍可展開閱讀。未完成正文的來源不能冒稱已編輯。
4. `research-visuals.mjs` 與 `exhibit-info.mjs` 提供可追溯的原創示意圖、分類圖與標示，不能冒充原作者照片或測速結果。
5. Astro `src/pages/` 與 `src/layouts/` 將來源與元資料輸出為語意化 HTML；Pagefind 在建置後索引。第三方示範要點擊才載入。
6. `site/scripts/unify-home.mjs` 從 Astro 輸出組裝 Sanctum 根首頁和 V3 全文閱讀，舊 V2 僅提供相容轉址，不再打包第二個應用；正式部署來源不應分叉。

## 機械邊界與不可推論事項

- `site/src/lib/*.mjs` 不直接反向 import `pages/`、`layouts/` 或 `styles/`；新增時由 `site/tests/p05-entry.test.mjs` 檢查。
- 設計變數集中在 `site/src/styles/tokens.css`，`global.css` 只引用。這是抽出一層共用 Token，**不是宣稱所有 CSS 已完成組件化**。
- 既有 Node/Playwright 覆蓋來源、搜尋、無 JS、鍵盤、行動版及桌面版。沒有建立視覺快照差異基準時，不把截圖存在視為完成視覺回歸。
- 新研究進站前需通過人工對照表覆蓋與來源驗證；Canonical Metadata v1 目前仍支援 opt-in，後續是否全面改成必填需另經決策。
- 刪改原研究、調整 Rulesets、安裝工具、部署、合併與 P2 仍受 `site/AGENTS.md` 約束。

**決策紀錄**：[ADR-0001](./ADR-0001-content-and-design-boundaries.md)。
**階段入口**：[P0.5 → P1 狀態與剩餘阻塞](../P0.5-EXIT-P1-ENTRY.md)。
