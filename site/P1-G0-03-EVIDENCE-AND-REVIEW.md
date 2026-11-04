# P1 G0-03｜可重現的美術／裝置證據與研究來源回收

> **狀態：工程候選。** 本文件不表示任何真機、審美、授權或效能量測已通過。使用者已要求推進全部剩餘工作；本包只完成可於 Repo 和 CI 中驗證的部分。

## 1. 這包交付哪些可執行工具

- `site/tests/pages/g0-03-evidence-capture.spec.mjs`：在 320／393／768／1440 寬擷取首屏與分類／精選／閱讀功能三個捲動章節。每組生成 `g0-03-evidence-*.json`，標明本次 CI 的 checkout SHA、viewport、頁面幾何與**不是實體手機**。
- `site/src/lib/source-review.mjs`：合併 Issue #59 的 47 份與 2026-11-05 圖形研究 3 份的**有限來源審查提示**。新 Three.js 研究將顯示「效能尚未實測」；任何資料不得顯示為全文已核實。
- `site/scripts/p1-readiness-report.mjs`：依本地真實 `allDocs()` 產生編輯正文覆蓋、審查登記、導讀、圖像與缺漏項目；`--json` 可接其他治理／Dashboard，`--strict` 只對**結構缺口**失敗，而非假造人類簽核。使用 `--records` 查看逐篇紀錄。
- Node 測試、Playwright 真實渲染與 no-JS 回歸全在既有必過網站 CI 中執行，不新增 npm 依賴、第三方資產或新部署路徑。

## 2. Owner 驗收順序（所有項目獨立）

1. **實際畫面／Golden 候選**：從 PR 的 Actions 下載 browser evidence；同尺寸比較首屏與各章節，明確記錄通過／退回原因。未定稿不能提交為經核准的 Golden。
2. **實體 Android**：在同 SHA 正式版本或經核准的 staging URL，以 POCO F8 Ultra Chrome 測首頁、分類、全文、搜尋、返回、10 分鐘捲動。保存完整 URL、OS、瀏覽器版、錄影與任何 Performance trace。
3. **實體 iOS**：真 iPhone Safari 走同樣的操作。桌面 Chromium viewport 不等於 iOS Safari。
4. **效能**：LCP / INP / CLS 的真實使用門檻須記錄樣本／工具／來源；FPS、GPU 計時、溫度、熱降頻沒有儀器即填 `Unknown`；不從 Playwright 截圖推導。
5. **第三方作品／圖片授權**：原作者網址、iframe 允許與否、創作者與素材權利需逐件核對；CI 只能保證本站引用和程式退化路徑，不能保證外站 CSP 或授權。
6. **內容編輯**：所有未編輯正文來源維持獨立有限審查提示，新增每一份研究要有日期、證據範圍；逐篇公開化及外部事實查證仍須由具體來源佐證。

## 3. G0 接受紀錄模板

| 欄位 | 填寫要求 |
| --- | --- |
| main / PR exact SHA | `Unknown` 不算有效版本 |
| 試驗網址及證據 | 包含 Actions run 與 artifact / 實機截圖 |
| 手機型號與 OS | Android / iPhone 各一行，不使用模擬代填 |
| 瀏覽器版本及網路 | 實際值，缺則 Unknown |
| 首屏／三章節畫面 | PASS / FAIL / 未驗；附可重現描述 |
| 字體三方案主觀比較 | PASS / FAIL / 未驗；記錄實際安裝的系統字型 |
| 真機導航、搜尋與原文 | PASS / FAIL / 未驗 |
| 外站 demo 與 CSP | 可嵌入 / 不可嵌入 / 未驗；保留原站超連結 |
| Core Web Vitals / FPS / 熱 | 工具、樣本、原始量測或 Unknown |
| 圖像來源與權利 | 每件原始作者、來源網址、License 或 Unknown |
| Owner 核准 Golden / G0 | **只由 Owner 實際確認**；無記錄視為未通過 |

## 4. 後續工作與硬界線

- `npm run check`（Node 測試）、`npm run build`、`npm run provenance`、`npm run e2e` 是工程路徑；PR 的三組 GitHub Actions 須以**最新 HEAD**審。
- 經 Owner 核准 Golden 後才在新 PR 加入像素差異比對門檻；避免假 Golden 帶來永遠變綠的測試。
- 新增來源的 metadata、圖像、授權、外部事實及 3D shader 性能需各自驗證，不能以 `structuralPass` 當 EAG-100 或 G0 最終完成證明。
- P2–P5 的 GPU／導演／研究互動／發布是**不同里程碑**；本包不自動安裝或啟動新的 3D runtime。
