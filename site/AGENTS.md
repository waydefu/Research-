# site/ — THE OBSERVATORY Agent 規範

> **先導航**：[REPO-MAP.md](./REPO-MAP.md) → 只讀任務相關原始碼與測試。歷史資料：[HANDOFF-CURRENT.md](./HANDOFF-CURRENT.md)。main／PR／CI 務必當場核對 GitHub，不引用過時 SHA 宣稱現況。

## 現況與權限

- `/Research-/` 是 Sanctum 靜態首頁，`/Research-/v2/` 是歷史 V2，`/Research-/v3/` 是 Astro 全文研究館；**不是已完成的 Three.js 跨頁 3D 世界**。不可逆向將 V2 設回 root。
- Owner 最新明示授權 > 本檔／導航 > 具日期的現況修訂 > 歷史計畫。有衝突先核對，不自行擴大需求。
- 可在 `site/` 編輯、測試、推分支與開 Draft PR；`research/`、`docs/`、`showcase/` 原始資料唯讀。
- 跨出 `site/`、改 workflow／Ruleset／Pages、加入未列技術、安裝工具、刪檔、合併、部署、啟動 P2，均需 Owner 額外明示同意。

## 技術與不可退讓的契約

- Astro 6／TypeScript／Content Collections／remark／rehype／Shiki／Pagefind；正式 build 由 `site/scripts/unify-home.mjs` 組裝根首頁與 V2/V3。
- 不擅自加入 React/R3F、Next.js、WebGPU-first、外部 CDN 字型／腳本或額外接管捲動。
- 來源 Markdown 原封保留；內部引用轉站內，外部原作連結保留。本站 GitHub Repo PR／Ruleset 不作外連，Git SHA 顯示為文字。
- `docs/governance/THREAT-MODEL.md` 不得出現在站內路由、Pagefind 或 graph；公開 Repo 中原檔仍可被讀取。
- HTML 正文／搜尋／導航可在無 JS 下閱讀；手機、鍵盤、無障礙、程式碼與表格都需能操作。美術不採卡片式 SaaS 模板，維持繁中閱讀與字體層次。
- 沒有真機實測的 FPS、發熱、效能、相容性或 Owner 視覺簽核，一律標示「未量測／未驗收」。

## 每包驗收

`npm run check` → `npm run build` → `npm run provenance` → `npm run e2e`（含 Pagefind 繁中、無 JS、axe、360／768／1440 px、reduced-motion）。Gate 未過不得宣稱完成；CI PASS 不取代實機。

Draft PR 需記錄：變更與授權範圍、最新 HEAD／CI、原文／素材溯源、未測部分、Owner 待決事項。不得自行合併或部署。

## P1 必過檢查（2026-11-04 新增提案）

- 本工作包將未過濾的 `Research integrity / Markdown, JSON and governance integrity` job 擴大為完整 P1 website gate。因該 job 已列入 main-eag-100 Required Checks，所有 PR 的網站測試、來源核對和高風險 npm advisory 都必須成功（待本 PR 合併後生效）。
- `V3 P0 build and checks` 與 `Publish Research Showcase` 仍提供額外建置證據，但因 paths filter 不把它們當成全路徑必過的唯一來源。
- 實際硬性拒絕效果必須在合併後用不同路徑測試 PR 證明；CI PASS 不代表真機、人工美術或第三方權利查核通過。
