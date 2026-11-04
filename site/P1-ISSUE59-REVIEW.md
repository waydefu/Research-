# Issue #59｜47 份研究來源的逐檔證據稽核（2026-11-04）

> **狀態：第一輪來源分級、第二輪 47/47 逐檔最終處置與讀者提示已完成；不是 47 篇全文皆完成事實查核。** 唯一追蹤 Issue：[ #59 ](https://github.com/waydefu/Research-/issues/59)。原始參照提交：[`7d75fa961afe`](https://github.com/waydefu/Research-/commit/7d75fa961afec6115342aaef73786205358a5a29)。機器可檢查清單：[P1-ISSUE59-REVIEW.json](P1-ISSUE59-REVIEW.json)。

## 結果與方法

| 判定 | 數量 | 界線 |
| --- | ---: | --- |
| 已對照官方來源的**指定主張** | 19 | 只確認報告裡寫出的主張，**不是整篇、所有引用、授權或實測已核實** |
| 索引／來源清單／研究模板 | 11 | 逐檔辨識用途，不要求硬改寫成技術正文；每條外部 URL 的可用性仍需巡檢 |
| 十月歷史與個人專案案例 | 7 | 保留案例和當時資料，不把個人量測數據當通用 benchmark |
| 研究主張尚待深入核對 | 10 | 含課堂原始 PDF、未重跑的候選工具測試、未知授權或分項版本 |

**共 47/47 份已建立來源 Blob SHA、日期、型態與下一步；全部的 `externallyVerifiedAllClaims=false`。** 若任一原始 Markdown 內容改變，`site/tests/issue59-source-review.test.mjs` 使用 Git Blob SHA-1 對照，必須重新核對，不可復用先前的查證結論。

**程序：**閱讀每份原始研究的段落與來源、把來源型態分類，再以 NIST、OWASP、官方框架發版、WCAG、實際開源專案和字型 OFL 授權檔核對具有時效或安全影響的選定主張。對教材 PDF、台灣法規、私有使用者環境效能、未重新測試的上游效能宣稱，**不推定通過**。

## 值得保留的查證結論

- **身分與密碼**：NIST SP 800-63B-4 對單因子密碼長度、定期輪換限制；OWASP Argon2id／salt；FIDO2 透過網域綁定抗釣魚。這是技術指引，不是直接對台灣法規作法律結論。參見 [NIST 正式發布](https://csrc.nist.gov/pubs/sp/800/63/B/4/final)、[Authenticator](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/)、[OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)。
- **Next.js**：2026-10-14 官方明列 Cache Components typed arrays RCE、SVG 圖片最佳化 RCE、Server Actions DoS，16.4.1/15.5.28 是**當時初始修補**。16.4.3 10/23 發布可查，但採用時必須再查是否有更新安全版。[Next 官方](https://nextjs.org/blog/nextjs-security-update-october-14-2026)、[v16.4.3 發布](https://github.com/vercel/next.js/releases/tag/v16.4.3)。
- **React／Prisma／TypeScript／Vite**：React 19.3 的 ViewTransition 穩定化、Prisma 8 截至 11/03 仍 RC、TypeScript 6 與 Vite 8 的正式發布均有官方來源；不等於保證所有相關套件在所有專案可直接升版。[React](https://react.dev/blog/2026/09/09/react-19-3)、[Prisma](https://www.prisma.io/docs/orm/release-status)、[TS](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)、[Vite](https://vite.dev/blog/announcing-vite8)。
- **效能／無障礙**：LCP 2.5 秒、INP 200ms、CLS 0.1 的良好門檻；WCAG 2.2 AA 24×24 CSS px 觸控目標有豁免；WebGPU 仍為非全面可用，均屬官方規範而非本站現場實測。[Web Vitals](https://web.dev/articles/vitals)、[WCAG](https://www.w3.org/TR/WCAG22/)、[MDN WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)。
- **AI Agent／資料庫**：Claude Advisor 實驗性且收到完整歷史對話，不等同獨立 Goldfish；EGM Fresh-context reviewer、Jev 預設 shadow、Datapace Memory Benchmark 10 題單種子，以及 LiteLLM DB-less 預算 fail open 均找到一手說明。其餘聲稱節省百分比仍需相同環境 A/B。[Claude](https://code.claude.com/docs/en/advisor)、[EGM](https://github.com/google/elephant-goldfish-model)、[Jev](https://github.com/weiping/jev-claude-code)、[Datapace](https://github.com/datapace-ai/agent-memory-benchmark)、[LiteLLM](https://docs.litellm.ai/docs/proxy/users)。
- **授權**：Google Fonts 中 Instrument Serif、Manrope、IBM Plex Mono 的 `OFL.txt` 都標示 SIL OFL 1.1；IBM Plex 保留字型名稱。Remotion 免費授權對個人／最多 3 人組織有條件成立，不能概括成所有商業自動化用途免費。[字體上游](https://github.com/google/fonts/tree/main/ofl)、[Remotion 授權](https://www.remotion.dev/docs/license/pricing)。

## 逐檔決策／待辦

每個檔案路徑均對應固定提交及 [JSON 清單](P1-ISSUE59-REVIEW.json) 裡的 `sourceBlobSha`。表格中「部分主張」僅代表有限範圍有官方依據，**未核部分一律保留**。


### 2026-11-information-security（6）

| 原始檔（固定版本） | 本輪判定 | 下階段所需證據 |
| --- | --- | --- |
| [`README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/README.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |
| [`SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/SOURCES.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |
| [`identity-and-authentication.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/identity-and-authentication.md) | 部分主張有一手依據 | 需要原始課程 PDF、當地法規及設施規格才能對教材頁碼或法律/溫濕度主張逐一驗證 |
| [`information-security-principles.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/information-security-principles.md) | 待逐條核對來源 | 需要原始課程 PDF、當地法規及設施規格才能對教材頁碼或法律/溫濕度主張逐一驗證 |
| [`infrastructure-and-physical-security.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/infrastructure-and-physical-security.md) | 待逐條核對來源 | 需要原始課程 PDF、當地法規及設施規格才能對教材頁碼或法律/溫濕度主張逐一驗證 |
| [`security-guidance-evidence-review.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/security-guidance-evidence-review.md) | 部分主張有一手依據 | 需要原始課程 PDF、當地法規及設施規格才能對教材頁碼或法律/溫濕度主張逐一驗證 |

### 2026-11-agent-repository-operations（8）

| 原始檔（固定版本） | 本輪判定 | 下階段所需證據 |
| --- | --- | --- |
| [`02-search-routing.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/02-search-routing.md) | 待逐條核對來源 | 方法論與候選工具清單保留；未在同環境跑過 A/B、License/Release 與權限負向測試 |
| [`03-index-database-design.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/03-index-database-design.md) | 待逐條核對來源 | 方法論與候選工具清單保留；未在同環境跑過 A/B、License/Release 與權限負向測試 |
| [`04-cost-context-and-routing.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/04-cost-context-and-routing.md) | 部分主張有一手依據 | 方法論與候選工具清單保留；未在同環境跑過 A/B、License/Release 與權限負向測試 |
| [`05-memory-and-rag.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/05-memory-and-rag.md) | 部分主張有一手依據 | 方法論與候選工具清單保留；未在同環境跑過 A/B、License/Release 與權限負向測試 |
| [`06-agent-workflows.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/06-agent-workflows.md) | 部分主張有一手依據 | 方法論與候選工具清單保留；未在同環境跑過 A/B、License/Release 與權限負向測試 |
| [`10-github-project-catalog.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/10-github-project-catalog.md) | 待逐條核對來源 | 方法論與候選工具清單保留；未在同環境跑過 A/B、License/Release 與權限負向測試 |
| [`README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/README.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |
| [`SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/SOURCES.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |

### 2026-11-universal-web-engine（11）

| 原始檔（固定版本） | 本輪判定 | 下階段所需證據 |
| --- | --- | --- |
| [`02-nextjs-deep-dive.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/02-nextjs-deep-dive.md) | 部分主張有一手依據 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`03-frontend-ui-and-state.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/03-frontend-ui-and-state.md) | 部分主張有一手依據 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`04-backend-data-and-auth.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/04-backend-data-and-auth.md) | 部分主張有一手依據 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`05-runtime-build-and-dx.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/05-runtime-build-and-dx.md) | 部分主張有一手依據 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`06-graphics-and-compatibility.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/06-graphics-and-compatibility.md) | 部分主張有一手依據 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`07-performance-and-accessibility.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/07-performance-and-accessibility.md) | 部分主張有一手依據 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`08-security-testing-and-deployment.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/08-security-testing-and-deployment.md) | 部分主張有一手依據 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`09-reference-stacks-and-migration.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/09-reference-stacks-and-migration.md) | 待逐條核對來源 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`11-motion-graphics-and-rendering.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/11-motion-graphics-and-rendering.md) | 部分主張有一手依據 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`13-design-performance-and-architecture.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/13-design-performance-and-architecture.md) | 部分主張有一手依據 | 技術可作研究參考，但動態套件版本、特定主機性能與第三方素材權利需於採用前重查 |
| [`SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/SOURCES.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |

### 2026-11-agent-engineering（7）

| 原始檔（固定版本） | 本輪判定 | 下階段所需證據 |
| --- | --- | --- |
| [`01-egm.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/01-egm.md) | 部分主張有一手依據 | 第三方 Agent 工具或社群主張需核最新版本/支援宿主；不宣稱已安裝 |
| [`02-claude-code-multi-model.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/02-claude-code-multi-model.md) | 部分主張有一手依據 | 第三方 Agent 工具或社群主張需核最新版本/支援宿主；不宣稱已安裝 |
| [`03-imagine.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/03-imagine.md) | 待逐條核對來源 | 第三方 Agent 工具或社群主張需核最新版本/支援宿主；不宣稱已安裝 |
| [`04-jev.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/04-jev.md) | 部分主張有一手依據 | 第三方 Agent 工具或社群主張需核最新版本/支援宿主；不宣稱已安裝 |
| [`06-claim-check.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/06-claim-check.md) | 待逐條核對來源 | 第三方 Agent 工具或社群主張需核最新版本/支援宿主；不宣稱已安裝 |
| [`README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/README.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |
| [`SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/SOURCES.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |

### 2026-11-systems-analysis-design（4）

| 原始檔（固定版本） | 本輪判定 | 下階段所需證據 |
| --- | --- | --- |
| [`README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-systems-analysis-design/README.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |
| [`SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-systems-analysis-design/SOURCES.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |
| [`information-systems-and-development.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-systems-analysis-design/information-systems-and-development.md) | 待逐條核對來源 | 課程教材歸納與一般概念應保留來源 PDF 的頁碼，但目前未取得本輪可核對的教材全文 |
| [`project-planning-and-risk.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-systems-analysis-design/project-planning-and-risk.md) | 待逐條核對來源 | 課程教材歸納與一般概念應保留來源 PDF 的頁碼，但目前未取得本輪可核對的教材全文 |

### 2026-10-retrospective（9）

| 原始檔（固定版本） | 本輪判定 | 下階段所需證據 |
| --- | --- | --- |
| [`03-agent-skills-and-governance.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/03-agent-skills-and-governance.md) | 歷史案例；不能當現行實測 | 十月個人研究/實測屬歷史快照，不應呈現為 2026-11 最新環境或外部通用 benchmark |
| [`04-ui-design-skills.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/04-ui-design-skills.md) | 歷史案例；不能當現行實測 | 十月個人研究/實測屬歷史快照，不應呈現為 2026-11 最新環境或外部通用 benchmark |
| [`05-web-motion-3d.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/05-web-motion-3d.md) | 歷史案例；不能當現行實測 | 十月個人研究/實測屬歷史快照，不應呈現為 2026-11 最新環境或外部通用 benchmark |
| [`06-secure-agent-cicd.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/06-secure-agent-cicd.md) | 歷史案例；不能當現行實測 | 十月個人研究/實測屬歷史快照，不應呈現為 2026-11 最新環境或外部通用 benchmark |
| [`07-audio-dsp.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/07-audio-dsp.md) | 歷史案例；不能當現行實測 | 十月個人研究/實測屬歷史快照，不應呈現為 2026-11 最新環境或外部通用 benchmark |
| [`08-local-llm-models.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/08-local-llm-models.md) | 歷史案例；不能當現行實測 | 十月個人研究/實測屬歷史快照，不應呈現為 2026-11 最新環境或外部通用 benchmark |
| [`09-video-automation.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/09-video-automation.md) | 部分主張有一手依據 | 十月個人研究/實測屬歷史快照，不應呈現為 2026-11 最新環境或外部通用 benchmark |
| [`10-candidate-backlog.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/10-candidate-backlog.md) | 歷史案例；不能當現行實測 | 十月個人研究/實測屬歷史快照，不應呈現為 2026-11 最新環境或外部通用 benchmark |
| [`README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/README.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |

### 研究模板（1）

| 原始檔（固定版本） | 本輪判定 | 下階段所需證據 |
| --- | --- | --- |
| [`RESEARCH-TEMPLATE.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/RESEARCH-TEMPLATE.md) | 索引或模板；不當成獨立技術證據 | 確認每個關聯外部來源仍有效；索引不應按正文做 87 篇通用改寫 |

### showcase 字體（1）

| 原始檔（固定版本） | 本輪判定 | 下階段所需證據 |
| --- | --- | --- |
| [`V2-FONT-LICENSES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/showcase/design/V2-FONT-LICENSES.md) | 部分主張有一手依據 | 尚待逐項核實原始授權與實際部署邊界 |

## 尚未解除的高風險查證

1. 來自課堂或外部 PDF 的原始內容，只有部分實務差異經一手技術指引交叉核對，**原 PDF 頁碼及台灣法令**未重新逐項核實。
2. 將第三方 UI 元件、3D 模型、Shader、字體或影片工具投入正式生產前，仍應查商業使用授權、作者授權與最新發布；不能用「GitHub 有 Repo」推定可自由鏡像與散布。
3. 十月歷史 A/B 和本地 LLM／DSP／遊戲工程觀察，不可當作最新全機型測速；需要完整測試條件才能推廣。
4. 未改寫的原始技術文可能仍包含個人專案案例；站內應依「公開技術導讀／歷史原文」區分，不能隱去史實或冒稱一般研究全都完成通用編輯。

## #59 最終處置與關閉語義（2026-11-04）

**47/47 逐檔完成的是「來源審閱、公開適用性處置與採用 Gate 記錄」；不是 47/47 完成全部外部事實主張驗證。** 下方逐檔結果採用「有限證據保留／索引用途／歷史案例／有條件技術參考」四類。各份原始 Markdown 保持不動；網站文章現在會顯示個別查核範圍、採用前限制與已核對的公開依據。

- **19 篇**原本已有部分主張的一手證據；未核主張仍須在被引用為現行結論時再查。
- **10 篇**先前標記需深入查證，已補「具體處置理由」，其中 **5 篇**再補新的官方來源指定範圍核對；沒有把教材頁碼、第三方全部授權或性能硬說成 PASS。
- **11 篇**是目錄／SOURCES／模板，維持來源導航功能而非硬改寫成技術正文。
- **7 篇**是歷史案例，保留時間語境，明確不得外推為最新效能／安全狀態。

> GitHub Issue #59 的 `completed` 僅表示本輪**47/47 文獻處置契約**已有明確結果和可維護的保護機制。外部工具最新版、法律、商業授權、目標宿主實測屬未來實際採用該項技術時的條件驗證，不能由 Issue 關閉豁免，也不應拿「已處置」冒充「全文事實正確」。

### 逐份最終處置紀錄

| 原始來源（固定 SHA） | 處置結果 | 可對外引用與採用限制 |
| --- | --- | --- |
| [`2026-11-information-security/README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/README.md) | 索引／來源／模板 | 保留 2026-11-information-security 研究的導覽索引；此頁的章節連結與主題分類不能取代個別來源的時效及事實查證。 |
| [`2026-11-information-security/SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/SOURCES.md) | 索引／來源／模板 | 保留 2026-11-information-security 的來源與查證邊界；上游網址與當時版本屬可追溯入口，正式採用前仍須核對最新變化。 |
| [`2026-11-information-security/identity-and-authentication.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/identity-and-authentication.md) | 限定主張有一手來源 | NIST 單因子密碼至少 15 字、MFA 可 8 字、禁止常規週期輪換；OWASP Argon2id/唯一 salt；FIDO2 domain binding 的主張已對照（課程原 PDF 全文未核）。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-information-security/information-security-principles.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/information-security-principles.md) | 條件式技術參考 | CIA、ISMS、ISO/IEC 27001 屬一般概念；國際標準可核實，但教學 PDF 頁碼、台灣法律責任仍不得當現行法規引用。 |
| [`2026-11-information-security/infrastructure-and-physical-security.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/infrastructure-and-physical-security.md) | 條件式技術參考 | 備份、UPS 和復原方法可作基礎教學；20–25°C／40–60% 是原教材例子，不是所有機房適用的環境標準。 |
| [`2026-11-information-security/security-guidance-evidence-review.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-information-security/security-guidance-evidence-review.md) | 限定主張有一手來源 | 針對 NIST 密碼長度／輪換／字元組合、OWASP 雜湊、FIDO2 抗釣魚作項目式核對；機房溫濕度、台灣法律、原教學 PDF 頁碼仍需人工查證。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-agent-repository-operations/02-search-routing.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/02-search-routing.md) | 條件式技術參考 | ripgrep、SCIP 和 Zoekt 有上游文件支持其用途；工具選擇優先順序是研究策略，不是跨環境的效能實測排名。 |
| [`2026-11-agent-repository-operations/03-index-database-design.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/03-index-database-design.md) | 條件式技術參考 | SQLite FTS5 的 trigram tokenizer 可核；多層索引與原子切換屬架構設計，Codebase Memory 的 10 倍聲稱與舊 21/21 freshness FAIL 必須區分。 |
| [`2026-11-agent-repository-operations/04-cost-context-and-routing.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/04-cost-context-and-routing.md) | 限定主張有一手來源 | LiteLLM 缺 PostgreSQL 資料庫時 budgets 無硬限制、特定 max_budget fail open；上游文件確認。其他模型成本節省幅度未實測。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-agent-repository-operations/05-memory-and-rag.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/05-memory-and-rag.md) | 限定主張有一手來源 | Datapace 2026-09 pilot 為 10 題／單 seed；沒有證實通用記憶模型排名。其他基準及部署效能仍未重測。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-agent-repository-operations/06-agent-workflows.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/06-agent-workflows.md) | 限定主張有一手來源 | EGM 上游使用獨立上下文的 reviewer，且需人批准設計；僅核對這項模式，非聲稱本 Repo 已實裝 Harness。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-agent-repository-operations/10-github-project-catalog.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/10-github-project-catalog.md) | 條件式技術參考 | 專案清單是 2026-11-02 候選地圖，不代表每一套開源工具的授權、維護與安全公告都已驗收。 |
| [`2026-11-agent-repository-operations/README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/README.md) | 索引／來源／模板 | 保留 2026-11-agent-repository-operations 研究的導覽索引；此頁的章節連結與主題分類不能取代個別來源的時效及事實查證。 |
| [`2026-11-agent-repository-operations/SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-repository-operations/SOURCES.md) | 索引／來源／模板 | 保留 2026-11-agent-repository-operations 的來源與查證邊界；上游網址與當時版本屬可追溯入口，正式採用前仍須核對最新變化。 |
| [`2026-11-universal-web-engine/02-nextjs-deep-dive.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/02-nextjs-deep-dive.md) | 限定主張有一手來源 | Next 官方 2026-10-14 安全公告初始修補 16.4.1/15.5.28；GitHub v16.4.3 為 10/23 正式發版。今日最新版本仍應於採用當天再查。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-universal-web-engine/03-frontend-ui-and-state.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/03-frontend-ui-and-state.md) | 限定主張有一手來源 | React 19.3 於 2026-09-09 將 ViewTransition 穩定化；此項與官方相符。UI 套件個別授權及最新版未全查。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-universal-web-engine/04-backend-data-and-auth.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/04-backend-data-and-auth.md) | 限定主張有一手來源 | Prisma 官方 2026-11-03 Release status 仍載明 ORM 8 為 RC，且 npm latest 為 8.0.0-rc.30；未測實際遷移與 DB/ORM 授權邊界。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-universal-web-engine/05-runtime-build-and-dx.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/05-runtime-build-and-dx.md) | 限定主張有一手來源 | TypeScript 6 於 2026-03-23 正式、Vite 8 於 2026-03-12 正式使用 Rolldown；此兩項與官方相符，其餘工具版本尚未逐項核對。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-universal-web-engine/06-graphics-and-compatibility.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/06-graphics-and-compatibility.md) | 限定主張有一手來源 | MDN 目前標示 WebGPU Limited availability、HTTPS secure context；不能聲稱全部手機支援。Polyfork CDN 授權另待個案查核。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-universal-web-engine/07-performance-and-accessibility.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/07-performance-and-accessibility.md) | 限定主張有一手來源 | Google 公開 Core Web Vitals good LCP≤2.5s、INP≤200ms、CLS≤0.1；這是門檻不是本站實測值。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-universal-web-engine/08-security-testing-and-deployment.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/08-security-testing-and-deployment.md) | 限定主張有一手來源 | Next 2026-10-14 官方公告三種風險（cache typed arrays RCE、SVG sharp RCE、Server Actions DoS）及原版修補；本文提到的 CI 只屬範例非已全採用。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-universal-web-engine/09-reference-stacks-and-migration.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/09-reference-stacks-and-migration.md) | 條件式技術參考 | 三套架構與權重是未實測方案；Astro 6 是當時研究參考，現在已非最新已部署技術選擇，須重查官方版本。 |
| [`2026-11-universal-web-engine/11-motion-graphics-and-rendering.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/11-motion-graphics-and-rendering.md) | 限定主張有一手來源 | MDN WebGPU 瀏覽器支援不足以列為 Baseline，必須支援 WebGL/DOM 降級；Renderer 效能、特效規格未在本 Repo 實測。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-universal-web-engine/13-design-performance-and-architecture.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/13-design-performance-and-architecture.md) | 限定主張有一手來源 | WCAG 2.2 AA 2.5.7 拖曳替代與 2.5.8 24×24 CSS px（有例外）；CWV good 門檻亦與原始文件一致。性能預算不代表實測。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-universal-web-engine/SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-universal-web-engine/SOURCES.md) | 索引／來源／模板 | 保留 2026-11-universal-web-engine 的來源與查證邊界；上游網址與當時版本屬可追溯入口，正式採用前仍須核對最新變化。 |
| [`2026-11-agent-engineering/01-egm.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/01-egm.md) | 限定主張有一手來源 | Google EGM 官方 Repo 支援 Codex/Claude 外掛、Elephant/Goldfish 上下文分工、非 Google 正式支援產品；當前宿主安裝仍未驗證。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-agent-engineering/02-claude-code-multi-model.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/02-claude-code-multi-model.md) | 限定主張有一手來源 | Claude Code Advisor 為實驗性、接收完整對話與工具結果、不可當 fresh-context 子代理；需要目標帳號與實際用量測試。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-agent-engineering/03-imagine.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/03-imagine.md) | 條件式技術參考 | Anthropic 官方證實 Claude Custom Visuals；公開轉載的 Imagine 規範及其五模組不能當作可獨立安裝的官方 SDK。 |
| [`2026-11-agent-engineering/04-jev.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/04-jev.md) | 限定主張有一手來源 | Jev Claude Code 插件上游宣稱 typed choice/score/yes-no 並以 shadow mode 為預設；不代表已在使用者宿主安裝或完成安全測試。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-11-agent-engineering/06-claim-check.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/06-claim-check.md) | 條件式技術參考 | Claude Code Advisor 與 Subagents 功能可由官方文檔核實；社群作者身份、貼文來源與效能／成本結論尚無獨立證據。 |
| [`2026-11-agent-engineering/README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/README.md) | 索引／來源／模板 | 保留 2026-11-agent-engineering 研究的導覽索引；此頁的章節連結與主題分類不能取代個別來源的時效及事實查證。 |
| [`2026-11-agent-engineering/SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-agent-engineering/SOURCES.md) | 索引／來源／模板 | 保留 2026-11-agent-engineering 的來源與查證邊界；上游網址與當時版本屬可追溯入口，正式採用前仍須核對最新變化。 |
| [`2026-11-systems-analysis-design/README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-systems-analysis-design/README.md) | 索引／來源／模板 | 保留 2026-11-systems-analysis-design 研究的導覽索引；此頁的章節連結與主題分類不能取代個別來源的時效及事實查證。 |
| [`2026-11-systems-analysis-design/SOURCES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-systems-analysis-design/SOURCES.md) | 索引／來源／模板 | 保留 2026-11-systems-analysis-design 的來源與查證邊界；上游網址與當時版本屬可追溯入口，正式採用前仍須核對最新變化。 |
| [`2026-11-systems-analysis-design/information-systems-and-development.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-systems-analysis-design/information-systems-and-development.md) | 條件式技術參考 | SDLC、資訊系統五要素等是課程筆記；原 PDF 全文與圖表本輪無法對照，不能聲稱教材頁碼或跨組織適用性全面查核。 |
| [`2026-11-systems-analysis-design/project-planning-and-risk.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-11-systems-analysis-design/project-planning-and-risk.md) | 條件式技術參考 | WBS、PERT/CPM、風險應對是課程概念；原 PDF 頁碼未重核，項目成本、工期與 ROI 的實際數值仍需專案實證。 |
| [`2026-10-retrospective/03-agent-skills-and-governance.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/03-agent-skills-and-governance.md) | 保留歷史 | 保留十月 Agent Skills 與小說專案治理案例，不推論其他 Repo 已相同配置。 |
| [`2026-10-retrospective/04-ui-design-skills.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/04-ui-design-skills.md) | 保留歷史 | 保留十月 UI/UX Skills 的比較與候選，正式引用元件前逐一核對版本與授權。 |
| [`2026-10-retrospective/05-web-motion-3d.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/05-web-motion-3d.md) | 保留歷史 | 保留歷史 Web Motion／3D 研究與遊戲工具案例，不推論所有裝置達目標 FPS。 |
| [`2026-10-retrospective/06-secure-agent-cicd.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/06-secure-agent-cicd.md) | 保留歷史 | 保留十月 CI、權限與供應鏈管理案例，不作今日 GitHub 權限實況。 |
| [`2026-10-retrospective/07-audio-dsp.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/07-audio-dsp.md) | 保留歷史 | 保留音訊 DSP 工具比較與失真觀察，缺統一素材/硬體條件不能當可重現性能基準。 |
| [`2026-10-retrospective/08-local-llm-models.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/08-local-llm-models.md) | 保留歷史 | 保留特定手機上本地 LLM 6–10 tokens/s 的觀察，不作所有量化、裝置或版本的吞吐排名。 |
| [`2026-10-retrospective/09-video-automation.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/09-video-automation.md) | 限定主張有一手來源 | Remotion 官方授權頁：個人或最多 3 人組織有條件可使用免費授權，4+ 人合作或自動化產品需核實收費條款。這是上游條款，非個案法律意見。其他外部聲稱、真機／授權／最新版仍維持未驗。 |
| [`2026-10-retrospective/10-candidate-backlog.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/10-candidate-backlog.md) | 保留歷史 | 保留歷史候選清單，未測工具不得宣稱已安裝或已滿足安全/商用授權要求。 |
| [`2026-10-retrospective/README.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/2026-10-retrospective/README.md) | 索引／來源／模板 | 保留 2026-10-retrospective 研究的導覽索引；此頁的章節連結與主題分類不能取代個別來源的時效及事實查證。 |
| [`research/RESEARCH-TEMPLATE.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/research/RESEARCH-TEMPLATE.md) | 索引／來源／模板 | 空白研究模板供填寫方法、來源及採用決策；沒有可供核實的具體技術主張，不應變成已審核文章。 |
| [`design/V2-FONT-LICENSES.md`](https://github.com/waydefu/Research-/blob/7d75fa961afec6115342aaef73786205358a5a29/showcase/design/V2-FONT-LICENSES.md) | 限定主張有一手來源 | Google Fonts 官方 OFL.txt 核對 Instrument Serif、Manrope、IBM Plex Mono 都是 SIL OFL 1.1，IBM Plex Mono 保留 Reserved Font Name Plex；只核授權文字，未重新審核本地字形檔/所有商標權。其他外部聲稱、真機／授權／最新版仍維持未驗。 |

### 第二輪新增的官方限定查核

- `research/2026-11-information-security/information-security-principles.md`：ISO/IEC 27001:2022 官方要求 ISMS；不延伸至原教學頁碼與當地法規。[官方來源](https://www.iso.org/standard/27001)。
- `research/2026-11-agent-repository-operations/02-search-routing.md`：Sourcegraph 區分搜尋型與精確導航，SCIP 使用索引資料。[官方來源](https://sourcegraph.com/docs/code-navigation)。
- `research/2026-11-agent-repository-operations/03-index-database-design.md`：SQLite FTS5 trigram tokenizer 和 SCIP indexer 格式。[官方來源](https://www.sqlite.org/fts5.html)、[官方來源](https://sourcegraph.com/docs/code-navigation/writing-an-indexer)。
- `research/2026-11-agent-engineering/03-imagine.md`：Claude web/desktop 的 Custom Visuals beta 是官方聊天內功能。[官方來源](https://support.claude.com/en/articles/13979539-custom-visuals-in-chat-and-cowork)。
- `research/2026-11-agent-engineering/06-claim-check.md`：Claude Advisor／Subagents 官方文件所述的現有功能。[官方來源](https://code.claude.com/docs/en/advisor)、[官方來源](https://code.claude.com/docs/en/sub-agents)。

### 如何確認結果沒有隨原文漂移

- `P1-ISSUE59-REVIEW.json` 的每一筆都保存**原始 Git Blob SHA**，而且有 `dispositionStatus`、`dispositionType`、`dispositionReason`、`publicNotice`、`adoptionGate`、日期及有限證據範圍。
- `site/tests/issue59-source-review.test.mjs` 要求 47/47 與未完成公開技術正文來源集合一致，SHA 不變，且所有 `externallyVerifiedAllClaims` 必須維持 false。
- `site/src/pages/[collection]/[...slug].astro` 只在相應未編輯原始來源頁顯示查核與警示，不覆蓋歷史 Markdown。正式升級工具／用其作法律、授權、效能承諾時依 `adoptionGate` 重新核對。

**這次的範圍可以結案，但「所有外部事實全面驗證」仍不是已取得的證據，也不應轉化成百分比上的 100% 可信度。**
