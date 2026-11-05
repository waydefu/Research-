# ADR-0002｜單一網站發佈：退役 V2 而不保留多份備份

**日期：2026-11-05；狀態：待 PR/CI 審核。**

## 決策與目標

- Repository 只維護 **一條網站生產線：Astro（site/）**。發布產物唯一由 site/dist 組裝為 site/pages-dist，沒有平行的 showcase/dist 網站與舊版 JS bundle。
- 正式首頁現階段仍使用已驗收的 Sanctum 美術；G1-01 新版是獨立待審預覽。等 Owner 批准後才以獨立 PR 切換首頁，不把未驗收 3D 直接發布為正式首頁。
- V3 研究路由、Pagefind、實際來源 SHA/日期、分類與可存取 HTML 不受切換影響。

## 清理內容

- 移除舊 V2 網站的原生 JS、CSS、靜態 HTML、產物快照、字型／圖片、建置腳本及獨立測試，共 26 個 showcase/ 舊站檔案。
- 移除不再運作的 V2 專屬 GitHub Actions workflow（共 **27 個**已追蹤檔案）。必過的 Research integrity 保留完整 Astro / 來源 / 安全稽核。
- 唯一保留在 showcase/ 的是 **design/** 下原始美術研究文件和草圖；這些是技術研究來源，不是另一套執行網站，不要誤刪或改寫。
- root 產物不再複製 V2。`/Research-/v2/` 只生成一個 meta refresh + 原生 HTML 超連結，把既有書籤導向 `/Research-/v3/library/`；沒有舊 JavaScript、CSS、字型與第二個搜尋索引。
- 組裝器保留既有檔名 site/scripts/unify-home.mjs 以避免影響導航入口，但輸出與驗證全面改用 site/pages-dist；新建置會清除**產物資料夾**後重新打包，不刪真正 Git source。
- 首頁移除「舊版備份」外連，避免使用者進入已退役網站。

## 風險防護與確認

1. 完整 Repo `research/`、`docs/governance/`、`showcase/design/` 原始 Markdown 均保留；網站每篇文章 URL 和 SHA 繼續由 Astro 的原始倉庫檔案計算。
2. GitHub Actions PR 只能執行唯讀建置；main push 的 Pages deploy job 保留雙重 main 條件與 pages:write/OIDC 的窄權限。Ruleset 不變。
3. site/scripts/verify-pages-bundle.mjs 必須證明來源 V3 全部複製、歷史 V2 只有一個轉址 HTML，且不存在舊 app.js、styles.css、data/research-index.json、reader-links.js。
4. Playwright 必須驗證正式 root、V3 搜尋、原研究頁和舊 /v2 書籤轉址。未通過不可以合併。
5. 版本回退一律使用 Git commit / revert；**不新增 backup_v2、oldsite2、legacy-copy 等工作樹複本**。保留歷史研究文件不等同保留舊網站。

## 未包含

- 不修改 Ruleset、密鑰或治理權限，不發布任何尚未審核的新版首頁。
- 不刪除作者研究或原始 Markdown，即使歷史文件提及 V2，也應保持其研究時間背景。
- 不承諾第三方原作者內容已逐條事實查證，也不宣稱實機效能／美術已獲核准。
