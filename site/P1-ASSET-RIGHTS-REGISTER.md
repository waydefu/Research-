# P1｜原創素材與第三方權利登記（2026-11-04）

> 這是目前倉庫可核對的**資產類型與證據連結**，不是授權律師意見，不把程式生成素材或第三方 iframe 說成原作已獲授權。遇到新增外部來源，必須依實際檔案補一筆記錄並經 Owner 驗收。

| 資產 | 來源／產生方式 | 使用方式 | 目前證據與限制 |
| --- | --- | --- | --- |
| Sanctum 5 張 WebP 主場景與分區圖 | `site/public/atlas/sanctum/assets/` 的既有原創靜態素材 | 根首頁及 V3 預覽，非第三方下載 | 具體創作者與權利留存需由 Owner 確認；測試保證檔案與 URL 存在，不等於法律審核 |
| 87 張研究技術 SVG | `site/scripts/generate-research-art.mjs`、`src/lib/research-visuals.mjs` 依研究來源在 build 生成 | 技術示意，manifest 保留源路徑、alt、來源、kind、授權欄位；不是原作者真實測速或作品截圖 | `site/P0.5-G-VISUAL-ASSET-AUDIT.md` 和回歸測試；尚非 87 張逐張人工美術簽核 |
| 分類 SVG、品牌 icon | `site/public/research-exhibits/`、`showcase/assets/` | 導覽與站點 icon | 目前由程式／現有資料維護；無第三方圖像自動抓取 |
| V2 自架字體 | `showcase/scripts/fonts.mjs` 指定 Google Fonts ref 和 Git Blob SHA | build 時檢核後供本地靜態存取；不依賴 Runtime CDN | 授權記錄在 `showcase/design/V2-FONT-LICENSES.md`；未取得第三方授權法律鑑定 |
| 原作站與 Three.js 示範 | `site/src/lib/research-metadata.mjs` 登記原作 URL 和一般技術範例 | 只在明確點擊時載入第三方 iframe，拒絕內嵌時保留原網站連結 | 外站 CSP、可用性、追蹤與權利個案尚未人工核實；不複製其模型／影片／品牌內容 |

**新增資產准入**：登記上游作者、原始 URL、可核實授權與日期、檔案 hash／版本、用於何處、CSP／嵌入和低效能降級；沒有證據時列 Unknown 並只連結原站。任何新的 GPU 模型、CDN 或圖片庫須另經授權，不能以本登記表當作擴大需求許可。
