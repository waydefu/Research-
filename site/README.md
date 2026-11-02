# THE OBSERVATORY V3 · P0 研究內容館

此目錄是 V3 靜態研究網站。P0 不含 Three.js、GSAP、Blender 模型，也不影響正式 V2 站點。內容從 `../research/`、`../docs/governance/`、`../showcase/design/` 於建置時讀取；原始 Markdown 不會被改動或納入 site 的版本化副本。

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

預覽 base 為 `/Research-/v3/`，首頁、領域、研究原文、治理原文、設計規格、搜尋頁均為 Astro 靜態頁；研究文件原有 slug 保持不變，畫面領域名稱為繁體中文。
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

## 部署界線

本 PR 的 CI **只建置、檢驗、上傳 Artifact**；沒有正式 GitHub Pages 部署、沒有修改既有 V2。若要放到 `/Research-/v3/` 網址，需要 Owner 審核後另以獨立 PR 處理 workflow 及 Pages 設定。
