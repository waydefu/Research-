# THE OBSERVATORY V3 / P0

P0 是研究內容館，不含 3D，也不替代正式展示站。來源 Markdown 只讀取 `../research/`、`../docs/governance/`、`../showcase/design/`；未經使用者同意不修改 GitHub Pages 或工作流程。

## 啟動（在完整 checkout 且可連線 npm 的開發環境）

```sh
cd site
npm install
npm run check
npm run build
npm run preview
```

必要環境 Node.js 22.12+。正式提交依規範需要提交 npm 產生的 `package-lock.json` 並使用 `npm ci`；目前無網路安裝環境，尚未生成 lockfile，也尚未宣稱通過實際 Astro build。所有依賴須在可用環境安裝、鎖定、測試後再申請正式合併。

## 路由

- `/Research-/v3/` — 研究目錄
- `/Research-/v3/research/<檔案相對路徑>/` — 研究正文
- `/Research-/v3/governance/<檔案相對路徑>/` — 公開治理正文（排除 THREAT-MODEL）
- `/Research-/v3/design/<檔案相對路徑>/` — 設計規格
- `/Research-/v3/domains/<領域>/` — 領域清單
- `/Research-/v3/search/` — JS Pagefind 全文搜尋，無 JS 時列出文件

## P0 尚需驗證

1. Astro 6 `glob()` 在真實 CI 中對上層路徑的讀取與原始 VFile 路徑。
2. 所有 Markdown 的 H1、站內連結與真實圖片路徑。
3. 20 個繁中詞語在 Pagefind 的實際搜尋結果。
4. 無 JS／360、768、1440 px／reduced-motion／axe-core。
5. 安裝產生的 lockfile、真正 build 以及 `npm run check`。

沒有真機與建置證據的項目均為「未驗收」，不可作為合併 Gate。
