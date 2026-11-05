# Repo Map｜Research- Agent 低成本導航圖

> 工作指引（2026-11-03）。本文只描述已核對的 repo 檔案／可驗證的資料流，不代表自動偵測到所有 runtime import 或呼叫關係。**不要把固定 SHA、舊 PR、舊 G0 報告當作目前主分支**；最新狀態一律先從 GitHub 查證。

## P0.5 收尾與 P1 准入

- 先開 [CURRENT-STATUS.md](./CURRENT-STATUS.md) 核對當期 main／PR／部署，再讀以下歷史 Gate；已合併的 #49～#53 不可重做。

- [P0.5 → P1 的證據、阻塞及整合次序](./P0.5-EXIT-P1-ENTRY.md)，所有動態 SHA／PR／CI 仍須從 GitHub 重新核對。
- [既有站點的架構邊界](./architecture/README.md) 與 [ADR-0001](./architecture/ADR-0001-content-and-design-boundaries.md)。
- `site/src/styles/tokens.css` 是共用設計變數入口；`site/tests/p05-entry.test.mjs` 檢查基本 import 邊界、來源覆蓋與樣式 Token。
- `site/src/lib/p1-readiness.mjs` 是各來源的 P1 證據狀態計算；使用 `cd site && node scripts/p1-readiness-report.mjs --json --strict` 驗證分類、導讀、圖片與限定審查登記。其 `structuralPass` 不代表真機、美術、授權或逐句事實核實。
- `site/scripts/p1-readiness-report.mjs` 是該報表的 CLI 入口，新研究若漏登記則 required CI 會失敗。
- `cd site && npm run gate:p05 -- --json` 取得**本地內容完整性**快照，不等於 GitHub 最新 CI、逐篇事實查證或實機驗收。

## 進 Repo 的最短路徑

1. 先讀根目錄 `AGENTS.md`（全域授權）與 `site/AGENTS.md`（網站權限）。
2. 根據下方任務表，只看對應入口 + 一個測試／原始檔。不要把所有研究、Skills 或 MCP 設定一次載入。
3. 先核對 `main` SHA、未合併 PR、各 PR HEAD 的 Research integrity／V3 P0／Publish Showcase 驗證結果。
4. 需要主張或來源時，先用 `rg` 或 `python3 scripts/research_search.py verify`，不新鮮就明確 rebuild 再查；命中片段只是定位線索，必須重讀原始文件。
5. 在 `site/` 改動後跑 `npm run check`、`npm run build`、`npm run provenance`、`npm run e2e`。CI 在最新 HEAD 真正 PASS 才能宣稱完成。

## 新版 3D 美術資產入口

- `site/scripts/generate-observatory-model.mjs` 由 `site/scripts/preflight.mjs` 建置時產生標準 glTF GLB 與來源清單；產物位於 `site/public/observatory/`（ignore），不要把二進位資產提交成備份。
- `site/src/experience/observatory/scene.js` 是唯一瀏覽器 Three.js renderer／GLTFLoader；`site/src/pages/observatory/index.astro` 是唯一新版站預覽。舊 G1 多邊形實驗只有轉址。
- 模型仍是程序化原創幾何，不是 Blender 精雕成品。真機和 Owner 美術 Gate 未通過前，不直接替換 `/Research-/` 正式首頁。

## 任務選哪個入口

| 想處理什麼 | 第一個該讀的檔案 | 接著看 | 驗證／注意 |
| --- | --- | --- | --- |
| Agent 授權、權限、治理 | `AGENTS.md` | `site/AGENTS.md`、`docs/governance/OPERATIONS.md` | `scripts/check_repository.py`；研究文件不能下達命令 |
| 原始研究、內部連結、來源 SHA | `site/src/lib/catalog.mjs` | `site/src/content.config.ts`、`site/src/lib/remark-links.mjs` | `site/tests/catalog.test.mjs`、`site/scripts/provenance-audit.mjs` |
| 精確標題、細分類、**逐篇導讀**與來源 | `site/src/lib/research-taxonomy.mjs` | `site/src/lib/research-metadata.mjs`、`site/src/lib/metadata-schema.mjs`；讀已合併的 `site/src/lib/research-leads.mjs` | `site/tests/research-taxonomy.test.mjs`；W1 增加 `site/tests/research-leads.test.mjs` |
| 分類圖片與**逐篇原創示意圖** | `site/src/lib/exhibit-info.mjs` | `site/public/research-exhibits/`；讀已合併的 `site/src/lib/research-visuals.mjs`、`site/scripts/generate-research-art.mjs` | `site/tests/pages/research-exhibits.spec.mjs`；W2 增加 `site/tests/research-visuals.test.mjs`、`site/tests/pages/research-visuals.spec.mjs` |
| 公開技術正文、歷史原文與全量初篩 | `site/src/lib/public-articles.mjs` | `site/src/lib/public-content-audit.mjs`、`site/scripts/audit-public-content.mjs` | `site/tests/public-articles.test.mjs`、`site/tests/pages/public-articles.spec.mjs` |
| 歷史原始研究的證據分級、採用限制與讀者提示 | `site/src/lib/source-review.mjs` | `site/P1-ISSUE59-REVIEW.json`、`site/P1-ISSUE59-REVIEW.md` | `site/tests/issue59-source-review.test.mjs`、`site/tests/pages/research-discovery.spec.mjs`；核對來源 Blob SHA 且不可把局部查證當全文通過 |
| 典藏、篩選、全文 | `site/src/pages/library/index.astro` | `site/src/pages/domains/[domain].astro`、`site/src/pages/[collection]/[...slug].astro`、`site/src/pages/search.astro` | `site/tests/pages/research-discovery.spec.mjs` |
| Sanctum 首頁、單一 Astro 組裝 | `site/scripts/unify-home.mjs` | `site/public/atlas/sanctum/index.html`、`site/scripts/verify-pages-bundle.mjs` | `site/tests/pages/unified-home.spec.mjs`；舊 V2 只保留導向研究館的轉址 |
| Astro 建置、Pagefind、CI | `site/package.json` | `site/scripts/preflight.mjs`、`site/scripts/postbuild-verify.mjs` | `.github/workflows/v3-p0-build.yml` 和 `.github/workflows/publish-showcase.yml` 的 paths 過濾不能等同每 PR 必觸發 |
| 離線研究索引／舊資料 | `scripts/research_search.py` | `docs/governance/REPO-TOOLING.md`、`site/src/pages/graph.json.ts` | `tests/test_research_search.py`，索引必須和 HEAD／內容 SHA 一致 |

## 實際內容資料流（程式結構摘要）

```text
research/ + docs/governance/ (THREAT-MODEL.md excluded) + showcase/design/
       |
       v
site/src/lib/catalog.mjs [Git source SHA, original H1, stable URL]
       |
       +-- site/src/lib/research-metadata.mjs [editorial, creator, external demo]
       |       +-- site/src/lib/research-taxonomy.mjs [reviewed topic/title/tags]
       |       +-- site/src/lib/metadata-schema.mjs [v1 validation]
       |
       v
Astro Content + pages/ [library / domains / research / search / graph.json]
       |
       v
site/scripts/preflight.mjs -> Astro build -> Pagefind -> postbuild/provenance
       |
       v
site/scripts/unify-home.mjs [Sanctum root + V3 reader + V2 redirect]
       |
       v
publish-showcase.yml [PR 只驗證；main 部署僅採 site/pages-dist]
```

**這是檔案與資料處理關係**，不是「所有函式呼叫的靜態分析圖」。`site/src/pages/graph.json.ts` 是研究**文件引用圖**，不是 JS 模組依賴圖。

## 導航完整性的驗證界線

- 測試會掃描 `site/src/lib/*.mjs` 與 `site/scripts/*.mjs`，新增而未登記的模組將觸發失敗；已登記的必要路徑若不存在，也會失敗。
- PR #42 導讀與 PR #43 圖像模組已於此前合併至 main；導航的可選群組是為支援不同分支組合而保留，模組存在時測試仍要求對應回歸一起存在。
- **這是路徑覆蓋檢查**，不是完整的 JS 函式呼叫圖。GitHub 最新 HEAD、PR 和 CI 仍必須即時查證。

## 已有工具先用好，不堆 MCP

- 本地：`rg -n 'keyword' research site`、`git ls-files`、`python3 scripts/research_search.py build|verify|search`。
- 編輯與治理：`.agents/skills/research-evidence/SKILL.md`、`.agents/skills/research-governance/SKILL.md`，按需讀取。
- 可選 Serena：`.serena/project.yml` 目前只設定 Python 唯讀；`.mcp.json.example` 不是已執行的 MCP，不能自行安裝或開啟。
- CI 與測試：`site/package.json`；修改研究資料與介面請測原始全文、搜尋、無 JS、來源 SHA、手機尺寸。

## 新舊狀態如何分辨

- GitHub API 現查的 main SHA、PR HEAD、Actions result 才是動態事實。
- `site/HANDOFF-CURRENT.md`、`research/2026-11-universal-web-engine/19-*.md`、V2 設計與歷史驗收都有時間戳；有衝突時**優先最新明示授權與 GitHub 動態事實**。
- P0.5 導讀／圖片／導航的歷史執行序列在 `site/P0.5-EDITORIAL-ASSETS-REPO-NAVIGATION-ROADMAP.md`；PR #41 已合併，但歷史規劃不能代替最新 Gate，應先讀 `site/P0.5-EXIT-P1-ENTRY.md`。
- PR #42／#43 的導讀與原創示意圖已整合，仍不可將舊 PR 的 CI 套用到新 HEAD；若在舊分支檢查，需重新核對實際存在的模組及來源。
- `site/REPO-MAP.md` 的導航契約以 `site/src/lib/repo-navigation.mjs` 為原始清單。新增、移除、重命名受管理的模組時，同步更新這兩處；`site/tests/repo-navigation.test.mjs` 同時拒絕不存在的路徑及未登記的新 JS 模組。

## 邊界

- 不能因為導航圖讀到某個腳本，就自行執行部署、合併、安裝 MCP、擴大研究、修改 workflow／Ruleset 或開啟 P2。
- 未經 Owner 核准，不改動 `research/`、`docs/`、`showcase/` 原文與根目錄 `AGENTS.md`。
- 若 navigation registry 因新版本有路徑差異，先找原因，不能為了 CI 綠燈靜默刪除安全相關入口。
