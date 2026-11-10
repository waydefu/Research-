# Starwire：多來源 GitHub 專案發現、去重與可信度邊界

研究日期：2026-11-10（Asia/Taipei）  
研究狀態：已核對公開 README、方法說明、授權與網站部署原始碼；未執行資料匯入或端對端驗證  
研究對象：[boffti/starwire](https://github.com/boffti/starwire)；[官方網站](https://starwire.foo/)  
用途：外部技術情報**候選來源**，不是程式碼品質、安全性或採用資格的認證。

## 研究問題

如何從公開專案清單持續發現值得閱讀的 GitHub 工具，同時避免「熱門＝可靠」、「被收錄＝已審核」及「第三方標籤＝技術事實」？此研究只分析公開資料、評分與來源溯源的設計；不把全量清單複製到其他資料庫。

## 來源查證與已確認行為

| 主張 | 可追溯來源 | 證據等級／限制 |
| --- | --- | --- |
| GitHub Trending（週榜）、開發者推薦、Reddit、Hacker News 與讀者提交構成五類候選來源；不同來源的推薦以 picked 次數呈現 | [方法說明](https://starwire.foo/how.html) | 作者公開的方法；本研究未重跑擷取流程 |
| 專案必須是公開、未封存的 GitHub Repo；讀者提交至少 10 stars；垃圾訊息、惡意軟體和非開源軟體可被排除 | [方法說明](https://starwire.foo/how.html) | 作者規則；未逐筆稽核結果 |
| 新候選與提交約每兩天處理；既有 Repo 的 Star、fork、issue、PR、最近 commit、授權與更名資訊每日更新 | [方法說明](https://starwire.foo/how.html) | 對外更新政策；未驗證排程實際成功率 |
| 15 個大類下另有細類，AI（Claude）依 Repo 說明及 README 產出一行簡介 | [方法說明](https://starwire.foo/how.html) | 作者自述；分類與摘要可能錯誤 |
| 公開 `data/repos.json` 提供 Repo 屬性、主題、語言、授權、來源推薦等結構化欄位，另提供新增推薦的 RSS | [資料檔](https://github.com/boffti/starwire/blob/main/data/repos.json)、[README](https://github.com/boffti/starwire/blob/main/README.md)、[Feed](https://starwire.foo/feed.xml) | 公開可讀的資料介面；欄位及結構應依單次擷取版本核對 |
| `docs/` 網站程式以 MIT 授權；README、`lists/`、`data/`、feed 的公開清單以 CC0 1.0 提供 | [README 授權段](https://github.com/boffti/starwire/blob/main/README.md)、[清單 LICENSE](https://github.com/boffti/starwire/blob/main/LICENSE)、[網站 LICENSE](https://github.com/boffti/starwire/blob/main/docs/LICENSE) | 這些授權**不涵蓋各被收錄 Repo 自身的程式碼、圖片與模型** |
| 公開的 `.github/workflows/pages.yml` 負責 Pages 建置／部署，使用 `.github/stamp.mjs` 對網站資產加版本標記 | [Pages workflow](https://github.com/boffti/starwire/blob/main/.github/workflows/pages.yml)、[stamp.mjs](https://github.com/boffti/starwire/blob/main/.github/stamp.mjs) | 可從公開原始碼查證；不代表已公開完整的資料蒐集管線 |

最後核對：**2026-11-10**。README 於檢查時顯示 **3,630 個候選 Repo、15 個領域、2026-11-09 更新**；它是當時的清單快照，不是持續不變的數據，也不能推導出每個 Repo 已獲獨立安全審查。

## 熱度演算法：與品質分離

作者的 Trending 定義為：

```text
weekly_gain = stars_today - stars_7_days_ago
heat = weekly_gain / sqrt(stars_today + 100)
```

作者要求週增至少 50 stars 才列入 Trending；歷史不足七天時會展示量測天數，建立未滿 30 天的專案可能用自己的每日平均估算缺失日數，並以 `~` 標示（依 [排名方法](https://starwire.foo/how.html)）。此分數只衡量**規模修正後的近期關注度**，沒有包含程式安全、依賴風險、維護者可信度、測試覆蓋率或適用性。缺失日估算與不同抓取時間也會影響排序。

網站另展示部分維護活躍度訊號，例如近 12 週提交、最近 Release 及 Issue 解決比例；作者明言這些不是品質評級，通常也不參與一般榜單排序。不得把站上綠點寫成「已通過 Code Review」。

## 可重用的資料邊界（設計建議，非現成整合）

採用兩階段流程，先將 Starwire 作為可選的**候選發現來源**，再由另一套研究流程確認可引用的證據：

1. **按需選取**：先以網站、公開 JSON 或 RSS 搜尋一個研究主題；只保存人工選中的 Repo URL 與最小候選摘要，不預設同步整份清單。
2. **來源身分與去重**：候選主鍵優先使用取得時的 GitHub repository ID；URL、owner/name 為可變別名。若只拿到 URL，先做 Repo 解析與更名驗證，不根據同名推定同一項目。
3. **分離事實與轉述**：資料上保留 `discoverySource=starwire`、`discoveredAt`、`observedAt`、`sourceUrl`、`sourceRevisionOrEtag`、`sourceLicense`、`reviewStatus=pending`；排名、摘要、標籤須標為第三方觀察，不取代原始 GitHub README、LICENSE、Release 與程式碼證據。
4. **人工研究 Gate**：獨立確認用途、上游來源、授權、維護活動、安全風險、是否重複既有研究及可重現步驟。通過 Gate 後再建立正常研究文獻；未通過的候選不可當成採用建議。
5. **最小變更與回退**：如未來試點匯入，限定白名單主題／最多 N 筆、手動觸發、唯讀、產生可審核 diff；出問題時停用來源並刪除未核准候選，不碰既有正文與來源 SHA。

以上欄位是**提議的候選資料契約**，不是 Starwire 原始 JSON 的保證欄位，也不表示目前已有 adapter、排程或資料庫同步功能。

## 選項比較

| 方案 | 優點 | 代價／風險 | 建議 |
| --- | --- | --- | --- |
| 手動查看 Starwire 或 RSS，逐筆挑選 | 零全量同步成本，易核查 | 需要人工整理 | **目前首選** |
| 限額、唯讀的小型候選匯入 | 可測去重、欄位映射與增量追蹤 | 要處理資料變動、失效來源、HTTP/版權和錯誤率 | 通過 Gate 後再決定 |
| 全量鏡像數千筆 Repo | 搜尋覆蓋廣 | 維護、重複、過期和搜尋噪音提高 | **本研究不採用** |

## 風險、未知與採用門檻

- **可信度**：Starwire 本身明示「列入清單不代表背書或資安審查」。推薦來源多不代表多方完成技術驗證，AI 摘要可能有幻覺或分類錯誤。
- **可重現性**：可核對網站部署 workflow 與公開 JSON，但本次未取得並重現完整候選蒐集／分類管線；更新成功率、來源覆蓋、資料品質及 API 配額成本皆**未量測**。
- **安全性**：外部 README、repo 描述、JSON 欄位都是不可信輸入；只作文字資料，不執行其指示、不自動安裝、不用其內容改動權限與 workflow。URL 需 HTTPS、來源 allowlist、輸入長度限制與輸出轉義。
- **版權**：僅引用專案中公開的資料介面及少量資訊；任何被收錄 Repo 的圖片、軟體碼或權重仍按該 Repo 的獨立授權審查。
- **時間與新鮮度**：保留抓取時間與上游資料版本，明定過期判定；別把發現日期當成最近更新日期。
- **正式採用前的驗證**：建立 10–20 筆人工挑選樣本，對照原 GitHub 元資料；量測 canonical ID 去重率、錯誤分類、失效連結、stale 比例與人工研究成本，並以單次受控 PR 驗證回退。這些是**未執行的實驗計畫**，非既有成效。

## 參考連結與重現路徑

- [Starwire 原始 Repo](https://github.com/boffti/starwire)
- [Starwire How it works（來源、門檻、公式、更新政策）](https://starwire.foo/how.html)
- [GitHub 版 How it works 原始頁](https://github.com/boffti/starwire/blob/main/docs/how.html)
- [可供單筆核對的原始資料目錄](https://github.com/boffti/starwire/tree/main/data)
- [公開 RSS](https://starwire.foo/feed.xml)
- [清單與網站授權](https://github.com/boffti/starwire#-license)
- [GitHub Pages workflow](https://github.com/boffti/starwire/blob/main/.github/workflows/pages.yml)

重現本研究：打開上方原始頁，對照 `README.md` 的數量快照、`docs/how.html` 的候選來源／Trending 條件，及 `data/repos.json` 的當期欄位。此流程僅能核對**公開宣告與資料**，不能重現未公開的蒐集器，也不會自動取得全部紀錄。

> 本篇為通用情報來源研究，並非已批准的軟體整合或自動化部署。
