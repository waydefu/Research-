# RESEARCH— THE OBSERVATORY｜現行站點與 V3 研究館

> **新接手 Agent 先看 [REPO-MAP.md](./REPO-MAP.md)**（依任務找到負責模組和測試）與 [AGENTS.md](./AGENTS.md)（授權範圍）。[HANDOFF-CURRENT.md](./HANDOFF-CURRENT.md) 是具日期的歷史交接快照；main／PR／CI 必須重新查 GitHub。不要按歷史 P0 筆記把正式 root 改回 V2。

正式首頁為 `/Research-/` 的 Sanctum；原 V2 網站程式已退役，`/Research-/v2/` 只留下前往正式研究館的轉址，V3 的典藏、搜尋、研究全文保留 `/Research-/v3/`。目前是**靜態**神殿視覺＋Astro/Markdown/Pagefind 內容館，不代表已實作跨頁即時 3D。研究正文從 `../research/`、`../docs/governance/`、`../showcase/design/` 於建置讀取，不複製或修改原 Markdown。

## 在完整 Git clone 中操作

需要 Node.js 22.12+（建議 22 LTS）、可使用 npm registry 的環境：

```sh
cd site
npm ci --no-audit --no-fund
npm run check
npm run build
npm run provenance
npx playwright install --with-deps chromium
npm run e2e
npm run preview
```

`site/package-lock.json` 已正式提交。GitHub CI 使用唯讀權限與 `npm ci`，依鎖定版本執行。

## 網址與內容約束

V3 Astro base 仍為 `/Research-/v3/`；根首頁由 `site/scripts/unify-home.mjs` 組裝，舊 V2 路徑 `/Research-/v2/` 只導向 V3 研究館。研究文件 slug 保持不變，畫面領域名稱為繁體中文。
`docs/governance/THREAT-MODEL.md` 不產生公開頁面，也不納入 Pagefind／graph.json。但這個檔案在公開 GitHub Repository 仍可被直接讀取。

`site/scripts/preflight.mjs` 驗證來源、連結與資產；`postbuild-verify.mjs` 檢查每篇靜態 HTML、Pagefind 與文件圖；`provenance-audit.mjs` 要求每一篇皆有真正的最後提交 SHA 和日期。

## CI 的測試與限制

`npm run e2e` 使用 Playwright Chromium＋axe-core，於 CI 自架靜態檔服務下測試：

- 20 個繁中關鍵字有實際搜尋結果，並驗證 Pagefind 返回可點開的站內網址；
- 領域篩選；
- 360、768、1440 px 的首頁、正文、領域與搜尋頁（截圖會作為 CI Artifact）；
- JavaScript 關閉時的閱讀與導覽，以及 reduced-motion 下的可讀性；
- 四種代表頁面的 axe WCAG 2.x serious／critical 問題。

以上屬於 **Chromium 自動化驗收**；未涵蓋真實 POCO／iOS 設備、TalkBack／VoiceOver 人工操作、實際觸控與熱負載。CI 綠燈也不表示電影式美術定案，後者屬於 P1–P3。

## 目前部署與驗收界線

`.github/workflows/publish-showcase.yml` 在 main push 直接從 Astro 產生、驗證並發布唯一的 `site/pages-dist` Pages 產物；**PR CI 的發布步驟仍應跳過**，不代表任何人可自行合併／部署。具體 Main 版本與證據見 [現行交接書](./HANDOFF-CURRENT.md)。正式 Pages 部署成功不等於 Android／iPhone 實機或 G0 美術簽核成功。

P0.5 工作依 19 號文件 §9 的 Blocking / Parallel / Break-glass 排序。新增實作需用獨立 PR，保留 Owner 審核與安全邊界。
