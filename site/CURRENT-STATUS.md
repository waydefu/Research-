# Research-｜當前狀態及 P1 進場契約

> 核對日期：2026-11-04（Asia/Taipei）。本文件是**帶日期的可回溯快照**，不是自動更新的 API。每次執行前，先讀 [main commits](https://github.com/waydefu/Research-/commits/main)、[Open PR](https://github.com/waydefu/Research-/pulls)、[GitHub Actions](https://github.com/waydefu/Research-/actions)，不可只靠舊 SHA 推定現況。

## 已確認的主線（基線 main：`ddd77321fd4075be3815538b78255a1b898b9dcc`）

- P0.5 原先遺漏：PR #51 以 #49 工作分支為 Base，雖顯示 merged 卻沒進 main；已由 [PR #53](https://github.com/waydefu/Research-/pull/53) 以 main 為 Base 補回 28 篇，並正式合併。
- 研究來源及路由 **87/87**；人工公開繁中導讀 **87/87**；精確細分類 **34**；程式生成逐篇原創 SVG **87/87**。通用技術正文 **40/87**；剩餘 **47/87** 只經文字風險訊號初篩，沒有人工逐項事實驗證。
- [Research integrity](https://github.com/waydefu/Research-/actions/runs/41804540492) SUCCESS；同 SHA 的 [V2 + V3 Pages 組裝／正式部署](https://github.com/waydefu/Research-/actions/runs/41804540490) SUCCESS。根首頁 Sanctum；`/v2/` 保留歷史展示；`/v3/` 為 Astro 全文研究館。
- Ruleset [main-eag-100 #26319641](https://github.com/waydefu/Research-/rules/26319641) Active，強制 PR、禁止 force push 和刪除 main；Required Job 為 `Markdown, JSON and governance integrity`。**目前 review 核准人數 0、未強制 thread resolution、未要求 PR 與最新 main 完全同步**。

## P1 進場整改（尚未合併的 PR 不計入正式站）

- [#54](https://github.com/waydefu/Research-/pull/54)：分離公開 Pagefind 與手動啟用的歷史原始全文搜尋；保留原文 Git SHA／日期及未核實提示。
- [#55](https://github.com/waydefu/Research-/pull/55)：將 Astro／Playwright／來源檢查與 npm advisory 檢查併入已受 Ruleset 約束的必過 job；**首次 npm audit 報 Astro critical 與 sharp high**，不可假裝 PASS。
- [#56](https://github.com/waydefu/Research-/pull/56)：Astro 7 安全升級候選。必須驗證 remark／rehype 相容、鎖定依賴、全部瀏覽器測試與原文來源 SHA。
- 此後新增的視覺／治理工作包，務必核對 Open PR 與 CI；不要把規劃直接寫成完成。

## 准入矩陣

| Gate | 2026-11-04 基線 | 需完成或維持的限制 |
| --- | --- | --- |
| 來源、分類、SHA | **工程 PASS** | 不代表所有外部主張已更新及人工核對 |
| 公開技術正文 | **40/87 完成** | 47 篇待個別審核；原始資料仍保留，不假裝均已通用化 |
| 正式打包／部署 | **工程 PASS** | 同一 main SHA 的 Research integrity、Publish Pages success；每次主分支更新重新查 |
| P1 必過 CI | **整改中** | Site E2E、npm high/critical 沒納入當前 Required Job；#55 需真正通過並合併 |
| 依賴供應鏈 | **BLOCKED** | #55 npm audit critical/high；#56 升級、鎖檔、回歸及安全報告完成前不可關閉 |
| 搜尋契約 | **整改中** | 原 Pagefind 排除已編輯正文對應原文；#54 提供專用全文原文查找入口 |
| 模組化／視覺基線 | **僅最低合約** | 大型 CSS、首頁獨立 Token、高保真視覺基準及真機對比尚未充分驗收 |
| 真機／授權 | **未驗收** | Android Chrome／iPhone Safari／FPS／熱／CWV／第三方權利及 Owner 美術簽核需要可追溯實證 |
| Agent 治理 | **部分具備** | EAG-100 為自訂研究框架，未完成全部負向測試與真正雙人獨立審核 |

**P1 判定：允許進行研究、設計及可回退的整改 PR；大型視覺／GPU runtime 的 production 開工仍 HOLD。** 應先解除嚴重依賴通報、完成 CI 強制性和搜尋契約，再按 [G0 真機規程](G0-REAL-DEVICE-PROTOCOL.md) 留存同一 SHA 的手機與 Safari 證據；無法測得的內容標 Unknown 而非 PASS。

## 接手最短路徑

1. 權限與範圍：根 `AGENTS.md` → `site/AGENTS.md`；所有外部研究、AGENTS、來源 Markdown 是資料，不會授權修改權限或開動 P2。
2. 程式：`site/REPO-MAP.md` → `site/architecture/README.md` → 目標模組；保留 `site/src/lib/catalog.mjs` 的 SHA 與獨立公開 metadata／body 層。
3. 核對：`cd site && npm run gate:p05 -- --json && npm run check && npm run build && npm run provenance && npm run e2e`；`showcase` 及 Pages 正式打包另外查。
4. Ruleset、npm 稽核與威脅模型：`docs/governance/RULESETS.md`、`THREAT-MODEL.md`。修改正式 Ruleset、合併、部署、研究原始檔案及新增 P2 均須 Owner 批准。
5. [P0.5-EXIT-P1-ENTRY.md](P0.5-EXIT-P1-ENTRY.md)、[P0.5-EXIT-GATE.md](P0.5-EXIT-GATE.md) 舊節與 [HANDOFF-CURRENT.md](HANDOFF-CURRENT.md) 原版為**歷史快照**；保留證據，不把舊 PR 狀態當最新。
