# 文件索引與狀態分類

> 更新：2026-11-06。**每一份放在 `site/` 頂層或 `docs/governance/` 的 Markdown 都必須出現在本表**，由 `scripts/check_repository.py` 在 CI 強制檢查；新增文件卻沒有分類會失敗。

## 狀態怎麼讀

| 狀態 | 意思 | 能不能當現況引用 |
| --- | --- | --- |
| **現行** | 描述目前規則、結構或狀態，需要保持最新 | 可以（仍須核對 GitHub 即時狀態） |
| **規格／協定** | 定義如何驗收或實作，不記錄某一天的結果 | 可以，當作要求 |
| **歷史快照** | 記錄某個日期的決策、審查或交接，內容原樣保留 | **不可以**；只能當追溯證據 |
| **封存** | 已被新版取代的快照，放在 `site/archive/` | 不可以 |

歷史快照與封存文件不改寫、不刪除；若與現行文件衝突，以現行文件與 GitHub 當下狀態為準。

## site/ 頂層文件

| 文件 | 狀態 | 用途 |
| --- | --- | --- |
| [README.md](./README.md) | 現行 | 網站的運作方式與驗證指令 |
| [AGENTS.md](./AGENTS.md) | 現行 | 網站範圍的 Agent 規則與授權邊界 |
| [CURRENT-STATUS.md](./CURRENT-STATUS.md) | 現行 | 帶日期的現況與未解事項 |
| [REPO-MAP.md](./REPO-MAP.md) | 現行 | 依任務找到負責的檔案與測試 |
| [RESEARCH-CURATION.md](./RESEARCH-CURATION.md) | 現行 | 新增研究、編輯與示範管理，含必過收錄流程 |
| [DOCS-INDEX.md](./DOCS-INDEX.md) | 現行 | 本檔 |
| [G0-REAL-DEVICE-PROTOCOL.md](./G0-REAL-DEVICE-PROTOCOL.md) | 規格／協定 | 真機與效能驗收的現場操作程序 |
| [P1-DESIGN-SYSTEM-BASELINE.md](./P1-DESIGN-SYSTEM-BASELINE.md) | 規格／協定 | 設計系統最小基線與視覺驗收方法 |
| [P1-ASSET-RIGHTS-REGISTER.md](./P1-ASSET-RIGHTS-REGISTER.md) | 規格／協定 | 原創素材與第三方權利登記 |
| [P1-EAG100-VALIDATION.md](./P1-EAG100-VALIDATION.md) | 規格／協定 | 可執行控制與仍需人工證明的安全 Gate |
| [P0.5-C-METADATA-SCHEMA.md](./P0.5-C-METADATA-SCHEMA.md) | 規格／協定 | 研究 Metadata Schema 最小可驗證方案 |
| [G1-01-CINEMATIC-OBSERVATORY.md](./G1-01-CINEMATIC-OBSERVATORY.md) | 規格／協定 | 即時 3D 預覽的範圍、檔案與未達成門檻 |
| [G1-02-MODEL-PIPELINE.md](./G1-02-MODEL-PIPELINE.md) | 規格／協定 | 程序化 GLB 管線與 Blender 接入介面 |
| [HANDOFF-CURRENT.md](./HANDOFF-CURRENT.md) | 歷史快照 | 2026-11-03 的接手交接書；其中的產品要求仍有參考價值 |
| [ATLAS-G0-REVIEW.md](./ATLAS-G0-REVIEW.md) | 歷史快照 | Sanctum 美術方向圖集審查 |
| [P0.5-C-TAXONOMY-AUDIT.md](./P0.5-C-TAXONOMY-AUDIT.md) | 歷史快照 | 逐篇細分類與公開標題校訂 |
| [P0.5-EDITORIAL-ASSETS-REPO-NAVIGATION-ROADMAP.md](./P0.5-EDITORIAL-ASSETS-REPO-NAVIGATION-ROADMAP.md) | 歷史快照 | 內容品質、圖片素材與導航的執行序列 |
| [P0.5-EXIT-GATE.md](./P0.5-EXIT-GATE.md) | 歷史快照 | P0.5 結案與進場驗證清單 |
| [P0.5-EXIT-P1-ENTRY.md](./P0.5-EXIT-P1-ENTRY.md) | 歷史快照 | P0.5 收尾到 P1 的准入紀錄 |
| [P0.5-G-EDITORIAL-AUDIT.md](./P0.5-G-EDITORIAL-AUDIT.md) | 歷史快照 | 87 篇繁中導讀校訂 |
| [P0.5-G-VISUAL-ASSET-AUDIT.md](./P0.5-G-VISUAL-ASSET-AUDIT.md) | 歷史快照 | 逐篇研究圖片與素材來源治理 |
| [P0.5-PUBLIC-CONTENT-AUDIT.md](./P0.5-PUBLIC-CONTENT-AUDIT.md) | 歷史快照 | 公開研究通用化的全量盤點 |
| [P1-DELIVERY-G0-ACCEPTANCE.md](./P1-DELIVERY-G0-ACCEPTANCE.md) | 歷史快照 | 研究館交付與 G0 驗收紀錄 |
| [P1-G0-01-READING-FLOW.md](./P1-G0-01-READING-FLOW.md) | 歷史快照 | 研究館場景連續性工作包 |
| [P1-G0-02-SANCTUM-ART-DIRECTION.md](./P1-G0-02-SANCTUM-ART-DIRECTION.md) | 歷史快照 | Sanctum 首頁美術候選 |
| [P1-G0-03-EVIDENCE-AND-REVIEW.md](./P1-G0-03-EVIDENCE-AND-REVIEW.md) | 歷史快照 | 美術／裝置證據與來源回收 |
| [P1-ISSUE59-REVIEW.md](./P1-ISSUE59-REVIEW.md) | 歷史快照 | 47 份研究來源的逐檔證據稽核；綁定來源 blob SHA，不得為新增文章而改寫 |
| [P1-SANCTUM-CSS-MODULARIZATION.md](./P1-SANCTUM-CSS-MODULARIZATION.md) | 歷史快照 | Sanctum CSS 模組邊界第一次抽離 |
| [P2-G1-00-WEBGL2-LAB.md](./P2-G1-00-WEBGL2-LAB.md) | 歷史快照 | 已退役的原生 WebGL2 實驗室（頁面只留轉址） |
| [archive/CURRENT-STATUS-2026-11-04.md](./archive/CURRENT-STATUS-2026-11-04.md) | 封存 | 2026-11-04 的現況快照 |

資料型登記檔（JSON，非 Markdown）：`P1-ISSUE59-REVIEW.json`、`P1-2026-11-05-GRAPHICS-REVIEW.json` 是歷史審查快照，不得為了新增文章而改寫；`P1-ONGOING-SOURCE-REVIEW.json` 是持續追加的有限來源審閱登記，規則見 [RESEARCH-CURATION.md](./RESEARCH-CURATION.md)。

## docs/governance/ 文件

| 文件 | 狀態 | 用途 |
| --- | --- | --- |
| [README.md](../docs/governance/README.md) | 現行 | 治理控制中心入口 |
| [OPERATIONS.md](../docs/governance/OPERATIONS.md) | 規格／協定 | 研究更新、故障與回退手冊 |
| [REPO-TOOLING.md](../docs/governance/REPO-TOOLING.md) | 現行 | 可用的 Repo 本地工具與啟用條件 |
| [RULESETS.md](../docs/governance/RULESETS.md) | 規格／協定 | GitHub Ruleset 設定建議與負向驗證；實際設定要查 GitHub |
| [TOKEN-ACCOUNTING.md](../docs/governance/TOKEN-ACCOUNTING.md) | 規格／協定 | 離線 Token 成本彙總方法（事後核算，不是配額強制） |
| [THREAT-MODEL.md](../docs/governance/THREAT-MODEL.md) | 規格／協定 | 威脅模型；刻意不出現在網站路由、Pagefind 或 graph |
| [BASELINE-2026-11-02.md](../docs/governance/BASELINE-2026-11-02.md) | 歷史快照 | 2026-11-02 稽核基線（當時 main 未保護） |

## 維護規則

1. 新增文件：先決定狀態再寫入本表，否則 `python3 scripts/check_repository.py` 會失敗。
2. 現行文件過期時：改寫並在文末留修訂紀錄；不要在標題外另開一份「最新版」。
3. 快照被新版取代時：用 `git mv` 移到 `site/archive/`，在檔首標明封存日期與取代者，修正其中的相對連結。
4. 絕不修改 `research/` 的原始研究檔來讓文件「看起來一致」。
