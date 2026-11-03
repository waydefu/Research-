# P1｜研究館交付紀錄與 G0 視覺／實機驗收

> **2026-11-03 交接後最新狀態：** [HANDOFF-CURRENT.md](./HANDOFF-CURRENT.md) 為目前的 main、已合併 PR、最新 CI、優先待辦唯一入口。下文 PR #31 Draft、未合併、未部署、84 篇與舊 SHA 均是**當時的歷史取證**，不可當成目前狀態。G0 真機效能／Owner 美術簽核仍未由 CI 替代。

**更新日期**：2026-11-03（Asia/Taipei）  
**範圍**：Research- P1 視覺連續性、研究典藏、內頁、搜尋、手機與第三方互動示範；不進入 P2。  
**原則**：工程 PASS、實際畫面 PASS、實機 PASS 三者分開紀錄；缺證據一律列「未驗」。  
**本紀錄性質**：先封存已交付內容與既有證據，再展開 G0 驗收；未授權即不得合併或部署 PR #31。

## 一、交付基線（已查 GitHub API）

| 項目 | 可追溯版本／結果 | 判定 |
| --- | --- | --- |
| 正式單一首頁 | [PR #26](https://github.com/waydefu/Research-/pull/26) 已合併；正式網站 `/Research-/` 使用 Sanctum 主入口 | 已正式發佈，仍須實際視覺審查 |
| 研究內頁視覺與分類 | [PR #31](https://github.com/waydefu/Research-/pull/31) HEAD `d97048f04c18348ac6f94687168327f6be9be1a7`；Draft／Open／未合併 | 完成工程候選，未進主站 |
| 審查意見 | #31 的 4 條 inline threads 已逐條回覆、程式修正並 resolved | 已結案（不代表美術簽核） |
| 網站組裝及瀏覽器回歸 | [Actions 41590785401](https://github.com/waydefu/Research-/actions/runs/41590785401)：成功、Playwright **41/41 PASS** | Chromium 工程 PASS |
| 研究館 QA | [Actions 41590785338](https://github.com/waydefu/Research-/actions/runs/41590785338)：成功、P0 E2E **11/11 PASS** | Chromium 工程 PASS |
| 資料完整性 | [Actions 41590785443](https://github.com/waydefu/Research-/actions/runs/41590785443)：成功，84 篇、Pagefind 與研究圖完整 | 工程 PASS |
| 單元測試 | 上述 CI 日誌：至少 12/12 PASS，涵蓋分類優先序與來源清單 | 工程 PASS |
| 正式部署 | PR #31 的 Pages deploy job **skipped**，未發布此 PR | 未部署（預期） |

## 二、此次交付內容

- 首頁與資訊架構：P1 原創暗金神殿為唯一主入口；V2 在 `/v2/`、研究典藏在 `/v3/library/`，研究全文搜尋與文章深連結仍可到達。
- 內頁視覺：搜尋、領域、典藏及研究閱讀共用暗金排版、深色背景、繁體中文視覺層級，本文主體保留原始 Markdown。
- 發現研究：主領域、細分主題、技術標籤與全文搜尋；新研究 Markdown 可由現有 Astro 管線自動產生路由。
- 外部作品與權利：原作者／原作連結與通用技術範例分開；示範點擊才載入，收合會卸載 iframe；第三方 CSP 禁止嵌入時要保留原站連結。
- 修補證據：分類以標題＋檔名優先、資料夾作 fallback；外部來源不截斷；超過 50 筆可分批取回；新增瀏覽器與單元回歸。
- **不宣稱** 84 篇都已完成真人導讀；目前人工校對的展示導讀僅 5 篇，其他保留原文概覽。

## 三、G0 Gate（驗收項目及證據等級）

| Gate | 要求 | 2026-11-03 初始狀態 |
| --- | --- | --- |
| G0-A｜場景／美術 | 暗金主導、冰藍點綴、神殿構圖完整、捲動連續；桌面／手機比較實際畫面 | **待視覺證據與 Owner 簽核** |
| G0-B｜閱讀與版式 | 中文主標、分級標題、72ch 左右閱讀欄、行距、連結與焦點，320–1440 寬不得橫溢 | **Chromium 自動測試已過；實際視覺待驗** |
| G0-C｜導航／研究 | 全部文章、分類、標籤與搜尋可用；無 JS 文章可閱讀、未截斷 | **Chromium CI PASS** |
| G0-D｜第三方示範 | 點擊才載入；收合終止活動 iframe；原站連結常在 | **mock／Chromium CI PASS；真實外站嵌入待驗** |
| G0-E｜真實裝置 | Android Chrome（含 POCO F8 Ultra）、iOS Safari 實際觸控／輸入／可讀性、轉向／回退 | **未有連接真機的可核實證據** |
| G0-F｜效能／熱負載 | 真機畫面掉幀、GPU/CPU/熱、背景圖和 iframe 開關、實際網路下的 LCP/INP/CLS | **未量測；不可標 PASS** |
| G0-G｜字體／3D | 三套繁中字型盲測／涵蓋度；原 Atlas 設定之 3D 三視角輪廓 | **原規格未完成；若維持 Gate，不可標 PASS** |

**G0 總判定（封存時）：未完成／不得簽核。** CI 成功只代表工程檢查，不能替代實機、美術或作者網站實際嵌入結果。

## 四、人工與實機驗收紀錄欄位

對每個裝置記錄：裝置型號／OS 版本／瀏覽器版本、網址與測試 commit、寬高與 DPR、網路類型、開始時電量與溫度概況、首頁／典藏／搜尋／文章／示範五個情境的截圖或錄影、錯誤與可重現步驟、平均與最差幀時間（必須注明測量工具），最後標記 Owner 目視結論。若只能跑桌面 Chromium 的 mobile viewport／touch emulation，必須明標**模擬**。

## 五、交接與禁止越界

- [ ] 最新版實際畫面／截圖人工比對（不只看 HTML 或 CI PASS）。
- [ ] Android 真機：內容觸控、彈性排版、示範載入與卸載、熱量及掉幀。
- [ ] iOS Safari 真機：相同路徑及返回行為。
- [ ] Owner 核准 G0 美術與未達成 Gate 的處置。
- [ ] G0 證據確認後，才更新結論；不可由本紀錄自動授權 P2。
- [ ] PR #31 維持 Draft，不自行合併、不部署。

**來源**：上列 PR 與 GitHub Actions 均為 Repository 原始紀錄；需重查最新 HEAD，不能沿用舊提交的綠燈當新提交證據。

## 六、2026-11-03 G0 視覺／瀏覽器證據完成記錄

**候選 HEAD（取證時）**：`7a796a4ffcadad3357e62615aadfc326665fe476`；仍是 PR #31 Draft，**未合併、未部署**。先前交付基線 `d97048f` 是審查修補基準，**不能代替此版的 CI**。

### 實際取得的畫面

- [Pages CI 與截圖證據（53/53 PASS）](https://github.com/waydefu/Research-/actions/runs/41595653259)；[截圖 Artifact #13212166972](https://github.com/waydefu/Research-/actions/runs/41595653259/artifacts/13212166972)，GitHub 預計保留至 2026-11-10。
- Playwright Chromium **6 個寬度（320、360、393、430、768、1440）× 首頁／典藏／搜尋／研究文章 4 類頁面，共 24 組頂部截圖**。
- 額外有手機 393 與桌面 1440 各 4 個捲動敘事位置（進場／精選／典藏／結尾），**共 8 張過渡證據**；其餘測試截圖為輔助。
- 在本輪檢查中，已實際檢視至少 320、393、768、1440 的版面與手機／桌面敘事拼圖：**未見文字或主視覺被橫向裁掉**，暗金主題與神殿背景能延續到閱讀頁，手機標題有依寬度自然換行。
- 指出並修正三個實際 G0 細節：正式首頁頁尾過時的「P1 CONCEPT STUDY」字樣、內頁品牌標識不一致、手機導覽觸控尺寸及換行；改成品牌標識連到首頁、手機保留分類和搜尋兩個 40px 高導覽目標。修正過程還發現 aria-label 與可見品牌名稱不一致，已修補並由 axe 重新驗證。
- 上述是**使用 Chromium CI 產出的真實渲染截圖進行的畫面審視**，不是 Photoshop 示意圖；但仍非在 Android／iOS 物理裝置上觀察，因此不得推論實際 GPU、發熱或字體載入完全等同。

### 新版候選的功能與無障礙結果

| 證據 | 結果 |
| --- | --- |
| [Pages 整合與 Chromium Playwright](https://github.com/waydefu/Research-/actions/runs/41595653259) | **53/53 PASS**，含六種 viewport、同站內頁、模擬觸控、第三方示範開啟／卸載及 320/393px 40px 導覽目標 |
| [V3 P0 QA](https://github.com/waydefu/Research-/actions/runs/41595652880) | **11/11 PASS**，含 20 種繁中搜尋案例、無 JS、WCAG 2.2 axe serious／critical 掃描 |
| [研究完整性](https://github.com/waydefu/Research-/actions/runs/41595652838) | **SUCCESS**；共 84 篇研究、全部來源路由及 Pagefind 正常 |
| 頁面資料與單元測試 | **12/12 PASS**，分類、超過 50 筆結果、引用來源完整性保留 |
| PR 正式部署工作 | **skipped**，未發布此版本 |

### 實機／最終簽核結論（不可省略）

**G0 桌面與手機寬度視覺／功能模擬：已完成、可供 Owner 審查。**  
**G0 實體 Android／iPhone：未完成；沒有可連接的物理裝置、PR 專用可訪問實機預覽 URL、性能 traces、外站真實 iframe 截圖。**  
**G0 字體盲測與原 Atlas 3D 三視角：仍是舊 Gate 的待處理條件，未藉 Chromium 測試消除。**  
**G0 最終判定：HOLD / BLOCKED，不得自動寫成 PASS，亦不得自行允許 P2。**

已新增 [G0 實機測試操作與證據格式](./G0-REAL-DEVICE-PROTOCOL.md)，涵蓋 POCO／Android Chrome 與真 iPhone Safari、研究長文、鍵盤／觸控、3D iframe、長時間熱負載、Core Web Vitals 與現場紀錄要求。需要在**相同 PR SHA** 的可訪問測試網址上由物理裝置執行並提交證據，才可完成實機 Gate。

外部技術標準參考：[web.dev CWV 門檻定義](https://web.dev/articles/defining-core-web-vitals-thresholds)、[Chrome Android remote debugging](https://developer.chrome.com/docs/devtools/remote-debugging/)、[Apple iOS Web Inspector](https://developer.apple.com/documentation/safari-developer-tools/inspecting-ios)。

**提醒：** 若本文件後又有新提交，需以新 HEAD 重新檢查工作流程結論；本段只代表以上特定版號的紀錄。
