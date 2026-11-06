# site/ — THE OBSERVATORY Agent 規範

> **先導航**：[REPO-MAP.md](./REPO-MAP.md) → 只讀任務相關原始碼與測試。現況：[CURRENT-STATUS.md](./CURRENT-STATUS.md)；文件分類：[DOCS-INDEX.md](./DOCS-INDEX.md)；歷史交接：[HANDOFF-CURRENT.md](./HANDOFF-CURRENT.md)。main／PR／CI 務必當場核對 GitHub，不引用過時 SHA 宣稱現況。

## 現況與權限

- `/Research-/` 是 Sanctum 靜態首頁，`/Research-/v2/` 只保留前往正式研究館的相容轉址，`/Research-/v3/` 是 Astro 全文研究館。`/Research-/v3/observatory/` 是 `noindex` 的即時 Three.js 預覽（單一天文儀場景），**不是已完成的跨頁 3D 世界，也尚未取代正式首頁**。不可逆向將 V2 設回 root。
- Owner 最新明示授權 > 本檔／導航 > 具日期的現況修訂 > 歷史計畫。有衝突先核對，不自行擴大需求。
- 可在 `site/` 編輯、測試、推分支與開 Draft PR。`research/` 下的原始研究檔**不得改動**（網站的來源 SHA 與審查登記綁定其內容）；`docs/`、`showcase/` 的改動限於治理與說明文件本身。
- 跨出 `site/`、改 workflow／Ruleset／Pages、加入未列技術、安裝工具、刪檔、合併、部署、啟動 P2，均需 Owner 當次明示同意。**2026-11-06 的一次性翻新授權及其範圍見根目錄 [AGENTS.md](../AGENTS.md)「授權紀錄」，不是常設授權。**

## 技術與不可退讓的契約

- Astro 7／TypeScript／Content Collections／remark／rehype／Shiki／Pagefind；正式 build 由 `site/scripts/unify-home.mjs` 組裝根首頁與 V2/V3。
- 不擅自加入 React/R3F、Next.js、WebGPU-first、外部 CDN 字型／腳本或額外接管捲動。
- 來源 Markdown 原封保留；內部引用轉站內，外部原作連結保留。本站 GitHub Repo PR／Ruleset 不作外連，Git SHA 顯示為文字。
- `docs/governance/THREAT-MODEL.md` 不得出現在站內路由、Pagefind 或 graph；公開 Repo 中原檔仍可被讀取。
- HTML 正文／搜尋／導航可在無 JS 下閱讀；手機、鍵盤、無障礙、程式碼與表格都需能操作。美術不採卡片式 SaaS 模板，維持繁中閱讀與字體層次。
- 沒有真機實測的 FPS、發熱、效能、相容性或 Owner 視覺簽核，一律標示「未量測／未驗收」。

## 每包驗收

`npm run check` → `npm run build` → `npm run provenance` → `npm run e2e`（含 Pagefind 繁中、無 JS、axe、360／768／1440 px、reduced-motion）。Gate 未過不得宣稱完成；CI PASS 不取代實機。

Draft PR 需記錄：變更與授權範圍、最新 HEAD／CI、原文／素材溯源、未測部分、Owner 待決事項。不得自行合併或部署。

## 必過檢查

- 未過濾的 `Research integrity / Markdown, JSON and governance integrity` job 已是完整的網站 gate，並列入 main-eag-100 的 Required Checks：所有 PR 的網站單元測試、建置、來源溯源、瀏覽器測試與高風險 npm advisory 都必須成功。（2026-11-04 提案、其後已併入 main；Ruleset 設定本身以 GitHub 當下為準。）
- `Publish Research Showcase`（單一 Pages 站點的組裝、`verify-pages-bundle` 與 `tests/pages` 瀏覽器測試）提供額外的組裝證據；它有 paths filter，不是全路徑必過的唯一來源。
- `docs/governance/` 與 `site/` 頂層的 Markdown 必須在 [DOCS-INDEX.md](./DOCS-INDEX.md) 分類，否則 `scripts/check_repository.py` 失敗。
- CI PASS 不代表真機、人工美術或第三方權利查核通過。
