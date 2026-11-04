# G0 真實裝置與性能驗收｜現場操作手冊

> **2026-11-04 P1 進場重新取證入口**：[P0.5-EXIT-P1-ENTRY.md](./P0.5-EXIT-P1-ENTRY.md)。本文件下方 PR #31 的 Draft、舊 Preview URL 等皆為歷史測試程序。**最新主線已到 #53、main `ddd77321fd4075be3815538b78255a1b898b9dcc`；後續任何新 PR 都須按實際 SHA 獨立取證。** 未連線實際 Android／iOS 的 FPS、熱與 Safari 結果必須記 Unknown，不可由模擬 viewport 或 Chromium 截圖冒稱通過。手動驗收完成後填入 [P1 設計／實機基線](./P1-DESIGN-SYSTEM-BASELINE.md) 的取證記錄與 Owner 結論。


> **2026-11-03 接手更新：** 本手冊起草時以 PR #31 Draft 為例，該 PR 現已合併。下一位請先參照 [HANDOFF-CURRENT.md](./HANDOFF-CURRENT.md) 核對正式 main／Pages SHA，再用**相同當前 SHA**的網址執行真機測試。下文所有「PR #31 尚未部署」是歷史前提，不可照字面執行。

**版本**：2026-11-03，Research- P1／PR #31。此文件是可重現測試規程，**不是已完成的裝置測量**。  
**狀態**：Android/iOS 實機尚未取得連線或可稽核的測試結果；Owner 美術簽核仍待確認。

## 一、測試前提與禁忌

- **必須測到 PR #31 的確切候選版本。** 目前 PR 尚為 Draft、GitHub Pages PR 的 deploy job skipped；正式主站沒有這次內頁改動。用已部署的舊版主站測試不可當成這個 PR 的驗收。
- 可透過 Owner 自行架設的 LAN 預覽或另經明確授權的 staging URL 執行；保留 URL、Git SHA、產物來源，避免把 `main` 和候選 PR 混淆。
- 用一支實際 Android 手機（優先 POCO F8 Ultra／HyperOS Android Chrome）及一支真 iPhone Safari，兩者分別測試。桌面 Chromium 的 `isMobile`／`hasTouch` 只是模擬。
- 初始瀏覽器測試先關閉省電限制與極端性能模式，保持亮度與室溫相近；第二輪再測省電、弱網與長時間使用。
- 不要把電池溫度、CPU 感測器讀值和手部感受到的表面溫度當成同一個量。沒有專用量測工具就只記「未量測」。

## 二、逐一操作的實機路徑（每個平台都要）

| 步驟 | 實際操作與驗收重點 | 必留證據 |
| --- | --- | --- |
| 01｜神殿開場 | 進入根首頁、等待主背景、從頂部滑到全頁底部，檢查畫面破裂、白屏、遮罩層和閃爍 | 首屏與末屏截圖、30 秒捲動錄影 |
| 02｜分類 | 從神殿進入典藏，組合領域／細分主題／標籤及關鍵字，清除並重新篩選，檢查觸控點擊區 | 選取前後截圖、搜尋關鍵字和結果數 |
| 03｜搜尋 | 輸入繁中和英文技術詞、至少一組多於 50 筆（若資料實際可滿足），操作載入更多到末頁 | 結果與末頁截圖、是否可打開文章 |
| 04｜完整閱讀 | 點進 Arctic Waters 等代表文章，逐段檢查標題、導讀、來源 SHA、程式碼、表格及「返回」 | 長文截圖、橫向捲動與返回錄影 |
| 05｜作者示範 | 確認尚未點擊不載入第三方；手動點開 → 收合 → 重開；不可嵌入時直接打開原站 | 記錄是否被 X-Frame-Options/CSP 阻擋、操作錄影及 CPU/GPU trace（如可取得） |
| 06｜可及性與情境 | 作業系統放大字體、橫豎切換、`prefers-reduced-motion`、Tab/讀屏操作及系統返回 | 顯示比例、文字遮擋與焦點追蹤 |
| 07｜長時間 | 持續捲動與切換研究 10 分鐘，對比背景圖與 demo 開啟前後的性能和溫熱 | Trace、幀時間或掉幀、測量工具／溫度（如有） |

## 三、Android 真機取證方法

1. 在 Android 設定啟用「開發人員選項」與「USB 偵錯」；把手機連到桌機。用 Android Chrome 打開 **PR #31 的預覽網址**。
2. 桌面 Chrome 開 `chrome://inspect/#devices`，確認已允許 USB debugging，按對應分頁的 **inspect**。用 DevTools Performance 對「神殿慢速滑動」和「3D demo 開關」各錄一段。
3. 收集 Performance 畫面上相應的長任務、幀率／影格時間（可提供則收集）、Network waterfall、Console errors。無法取得專業熱量數字時標未量測。
4. 不要聲稱一段 DevTools trace 等於 Google field INP 或 28 日 CWV p75。需要長期真實使用資料另行量測。

Chrome 官方操作來源：[Remote debug Android devices](https://developer.chrome.com/docs/devtools/remote-debugging/)。

## 四、iOS Safari 實機

1. 在 iPhone 設定的 Safari → Advanced 啟用 Web Inspector（實際選單名稱以系統版本為準）。
2. 以 Mac Safari 的 Develop 選單連到該 iPhone 的 Safari 分頁；依上表操作，記錄 Web Inspector 的 Network／Console／Timeline。
3. 若無可連線的 Mac，仍須在真 iPhone 上保存實際頁面截圖、操作錄影和功能結果，**不可把 macOS Safari 或 Chromium 裝置模擬稱作 iPhone 實機驗收**。

Apple 官方來源：[Inspecting iOS and iPadOS](https://developer.apple.com/documentation/safari-developer-tools/inspecting-ios)。

## 五、性能驗收證據與門檻

- Google Core Web Vitals **良好**門檻：LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1，應以行動與桌面真實使用資料**第 75 百分位數**判定；CI 預覽截圖、headless FPS 不能代替。
- 長動畫影格超過 50ms 是值得調查的卡頓訊號；60FPS 的單影格約 16.7ms 是理想幀時間，不等於跑一輪就已達標。
- 持續性能測試至少涵蓋 10 分鐘場景互動與示範收合；記錄溫度測量設備，若無硬體量測則保留 `Unknown`。
- 以頁面任務、真實使用舒適度、全功能退出路徑和可讀性優先；不因關閉某些裝飾性動畫而判 FAIL。

官方依據：[Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds)、[MDN Long Animation Frames](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Long_animation_frame_timing)。

## 六、提交判定格式（每個裝置一份）

| 欄位 | 需要填寫 |
| --- | --- |
| 版本 | PR SHA、建置和預覽網址 |
| 裝置 | 型號、OS、瀏覽器版本、橫豎、螢幕比例 |
| 網路與條件 | Wi-Fi／行動網路、亮度、溫度或其未量測狀態 |
| 功能 | 步驟 01～07 逐一 PASS／FAIL／BLOCKED，附截圖、Trace |
| 視覺 | 暗金比例、文字對比、排版、背景連續性與缺陷截圖 |
| 性能 | 觀測工具、資料取得方法、樣本數；沒有數字則 Unknown |
| Owner G0 結論 | 簽核日期及是否允許關閉 G0；不得由 CI 自動簽名 |

**G0 目前最後判定：BLOCKED（實機與 Owner 簽核缺少證據）**，不是「零缺陷 PASS」；候選程式可以保留 Draft 並補取資料後重新驗證。
