# Issue #59｜47 份研究來源的逐檔證據稽核（2026-11-04）

> **狀態：第一輪逐檔盤點＋指定主張外部交叉核對完成；不是 47 篇全文皆完成事實查核。** 唯一追蹤 Issue：[ #59 ](https://github.com/waydefu/Research-/issues/59)。原始參照提交：[`7d75fa961afe`](https://github.com/waydefu/Research-/commit/7d75fa961afec6115342aaef73786205358a5a29)。機器可檢查清單：[P1-ISSUE59-REVIEW.json](P1-ISSUE59-REVIEW.json)。

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

## #59 關閉條件

所有仍標為「主張待查」「歷史案例」「索引外連未核」的項目必須有**個別處置**（來源證據、需要修訂的公開導讀/正文、或保留歷史且對讀者有明確限制）。19 份部分交叉核對也需對未核定部分留下處置。這份報告可被審查並合入主線，但**不能拿 47/47 盤點去取代 47/47 事實驗證或自行關閉 Issue**。原始 `research/` 與 `showcase/design/` 文件在本工作包不變。
