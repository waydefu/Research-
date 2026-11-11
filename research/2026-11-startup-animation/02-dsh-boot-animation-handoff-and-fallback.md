# dsh-boot-animation：影片尾段溶解、啟動狀態同步與播放備援

研究日期：2026-11-11（Asia/Taipei）  
上游版本：`lxj5820/dsh-boot-animation`，main `6c2ef4b1d5ca4b791323d247fea5b7f6e272cc71`  
研究狀態：公開 JavaScript 與手冊原始碼核對，未在 DSH 真實宿主執行。

## 已確認的核心設計

原作者將開機動畫作為 DSH Web 應用啟動時的影片覆蓋層。`entry.js` 在載入前插入啟動頁腳本，提供素材清單與支援 HTTP Range 的影片服務；`src/renderers.js` 把 video、image、animated、Live2D 適配器抽象為一致渲染契約；屏保 `src/screensaver.js` 為獨立生命週期。

`src/boot-screen.js` 用 `clipDone` 與 `namespace.bootedAt` 控制交接：**影片結束 AND 核心就緒**才自然進入，若影片先結束，停留最後一幀直到核心可用。預設 `enterMode='tail'` 於影片剩餘時間小於 `FADE_MS` 時啟動疊合退場，預設 2000ms。以 `requestAnimationFrame` 追蹤時間，另設 `timeupdate` 對抗背景分頁幀回呼被降速；未知片長改走有界停留，長度過短改在片尾後淡出。

## 可靠性處理

| 場景 | 實際實作策略 | 限制 |
| --- | --- | --- |
| manifest 無回應 | 10 秒釋放媒體等待，待核心就緒仍可進入 | 不是主程式的完整啟動上限 |
| 媒體 6 秒沒有畫面 | 將當前來源標為無幀並嘗試下一素材 | 不是所有解碼/網路問題都能修復 |
| 圖片或未知影片時長 | `ENDLESS_MS=20000` 備援 | 不以無限等待取代動畫完成 |
| 影片短於兩倍淡出時間 | 先播完再淡，避免一開始就露出底層 | 非完全片尾同步 |
| 跳過與正常片尾 | 畫面 opacity 與音量一起控制，提前略過有音訊 grace | 音訊 autoplay 仍受 Chromium 規則 |
| 片頭素材與屏保 | 分別由 boot 與 screensaver 池管理 | 屏保碎片不是片頭的原生退場 |

媒體服務採分段串流與 `Cache-Control: no-store`；作者程式註解指出被取消的 Range 回應可能留下不完整快取，導致下一次解碼錯誤。這是上游的工程背景，不是本次獨立故障復現。

屏保退場支援 particles、fall、glitch，現行用單一 Canvas 繪製碎片。原始碼提及昔日 DOM 12,180 個動畫元素僅四幀耗費約 11.9 秒；**此數字為作者程式註解的歷史測試，不是本文測量**。

## 使用情境、授權與限制

優點是用既有影片做高品質視覺、不必即時算角色或 3D 光效；缺點是片頭互動性有限，影片尺寸、編碼與瀏覽器 autoplay 決定起播穩定性。不能將 DSH 腳本當成手機 bootloader 的系統動畫。

[LICENSE](https://github.com/lxj5820/dsh-boot-animation/blob/6c2ef4b1d5ca4b791323d247fea5b7f6e272cc71/LICENSE) 明確：**程式碼與文件採 MIT；影片／屏保媒體不在 MIT 授權，保留非商業使用與再散布限制**。不能直接搬出素材做其他桌布或商業套件。

## 重現來源

- [boot-screen.js](https://github.com/lxj5820/dsh-boot-animation/blob/6c2ef4b1d5ca4b791323d247fea5b7f6e272cc71/src/boot-screen.js) — `maybeEnter`、`tailCheck`、`enter`。
- [entry.js](https://github.com/lxj5820/dsh-boot-animation/blob/6c2ef4b1d5ca4b791323d247fea5b7f6e272cc71/entry.js) — 注入、Range、no-store。
- [screensaver.js](https://github.com/lxj5820/dsh-boot-animation/blob/6c2ef4b1d5ca4b791323d247fea5b7f6e272cc71/src/screensaver.js) — Canvas 碎片退場。
- [MANUAL.md](https://github.com/lxj5820/dsh-boot-animation/blob/6c2ef4b1d5ca4b791323d247fea5b7f6e272cc71/MANUAL.md) — 當期作者手冊。

已查證：上游原始碼的分支與函式；未查：Chromium 實際 GPU 效能、每一影片可重用性、DSH 新版本兼容。
