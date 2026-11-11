# dsh-550c-boot：解析期首幀遮罩、SVG 路徑書寫與敘事時間線

研究日期：2026-11-11（Asia/Taipei）  
上游版本：`yannicksong0106/dsh-550c-boot`，main `df7d202f62088897f476961ef87f408fb525b1ac`  
研究狀態：原始碼、架構、手冊已核對；沒有啟動 DSH 瀏覽器試播。

## 從首幀避免原生 Loading 閃現

作者 [架構文檔](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/docs/ARCHITECTURE.md) 的宿主探針顯示，DSH 原生載入卡在導航後 67ms 出現，而 client 遮罩在 338ms 才能掛載。僅用 z-index，無法回補原先的 271ms 視覺空檔。因此 Host 利用 `webserver/index-inject` 在文件解析階段注入底色首幀，之後再與可見遮罩交接。程式有 250ms 偵測和 12s 絕對上限，避免覆蓋層無限殘留。上述毫秒值是**上游文檔報告**，並非本次機器量測。

## SVG 與程序化時間線

`assets/550C-source.html` 是 Voidpocket 提供的原始 HTML 動畫；`scripts/extract.mjs` 定點移植到 Shadow DOM，修正根層 CSS、查找作用域和可取消 timer，不是重新發明原本動畫。`src/show.js` 為生成產物，手動修改源碼時應維持單一來源與 build 一致性。

`playBoot()` 依 Logo path `getBBox().x` 排序，為第 i 條路徑安排 `250+i*300ms` 延遲，使用 `clip-path` 在 `0.6s cubic-bezier(.4,0,.2,1)` 內畫出，`bootText` 於 2400ms 出現。完整檔 `run()` 段落依序為：

`BOOT → AUTH → LINK → TUNNEL → ISOLATE → REWRITE → VERIFY → DISARM → FINISH`。

47 個節點的逐一覆寫演出，在節點 07、23 插入故障視窗與恢復分鏡，讓技術敘事不只是固定速度填滿進度條。簡易檔約四秒、完整檔約 17 秒，是作者公開說明的預設值；跨環境應以實際時間測量為準。

## 退場與異常

`src/client.js` 統一自然完播、ESC、點擊、例外與 watchdog 的 `finish()` 收口，並在 `skip()` 取消等待中的時間線工作。作者的雙段退場是先約 **200ms** 消除前景動畫，再讓遮罩底色經 **420ms** 淡出。這避免高對比大 Logo 的半透明殘影留在真正對話頁之上。

`docs/STATUS.md` 記錄 Web 與 Desktop 動畫長度不同，以及秒／毫秒混用造成音量淡出過早完成。現行 `rememberSplashMs` 僅採集自然播完的有效時長，略過不能污染下一次排程。切勿把歷史待辦直接判為最新版本仍有 bug。

## 權利與採用判斷

[LICENSE](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/LICENSE) 是插件 MIT，作者 [CREDITS](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/CREDITS.md) 另註明 Voidpocket 原稿來源及第三方思路致謝；若再使用原稿應逐項追溯原作者的權利。畫面中出現的虛構授權或品牌語彙不能自動視為原 IP 的官方授權。

這個案例適合借鏡**首幀無閃爍、可取消敘事與雙段淡出**，不能直接複製其 DSH Hook 到 Android 系統啟動階段。

## 原始碼

[lib/index.js](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/lib/index.js)／[src/show.js](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/src/show.js)／[src/client.js](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/src/client.js)／[scripts/extract.mjs](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/scripts/extract.mjs)。
