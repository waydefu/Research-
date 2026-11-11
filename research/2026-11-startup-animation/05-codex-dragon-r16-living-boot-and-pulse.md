# Codex Dragon R16：三段角色動畫、淚滴波紋交接與桌布生命週期

研究日期：2026-11-11（Asia/Taipei）  
上游版本：`HanwenZhang-George/codex-startup-animation`，Release tag `community-v34-r5`，內容實際 **R16 / 34.16.0.0**  
研究狀態：Release、JavaScript、C#、媒體 manifest 靜態核對；**369,681,871 bytes 的完整 ZIP 未下載，因此未解碼六部 MP4 或執行 Windows。**

## 發行身分，不能只看檔名

[Release](https://github.com/HanwenZhang-George/codex-startup-animation/releases/tag/community-v34-r5) 保留 `r5` 固定 URL，但發行內容已更新至 R16。作者公開標示壓縮包 369,681,871 bytes、SHA-256 `23243E01A53A80C7B73E5A970160D46556B7A0D727FB7991E5693EAA4268C3FF`、199 項正式檔案、46 項媒體／圖片／字型及 6 部 MP4。哈希為**發布者聲明，本文未重新下載核算**。

## 三片的分段播放狀態機

`FilmSplashV2.cs / LivingFilmPlayback` 使用 `startup-intro.mp4`、`startup-idle.mp4`、`startup-finale.mp4`：

1. **Intro：**角色入場影片開始後，預熱下一段 Idle。
2. **Idle：**Intro 播完且 Idle 滿足 `Warm()` 才切換；可循環等待 Codex 真正準備完成。
3. **Finale：**同時滿足正式視窗幾何、焦點、桌布解碼、預熱波紋與 Finale 準備等必要條件後開始；不是單靠固定倒數。
4. **Reveal：**淚滴撞擊時使用 PulseReveal 露出已就緒的 Codex，而不是把尚未載入的視窗硬塞進影片結尾。

`Warm()` 判斷 MediaOpened、至少兩個渲染循環、載入後至少 80ms 及有效解碼尺寸。舊媒體在 **120ms** 內淡出，約 **160ms** 後回收解碼器；作者日誌聲明至多兩個影片表面。Idle 眨眼區間約 1.35–1.73 秒，`TryStartFinale` 在 1.25–1.85 秒禁止切入，避免半閉眼和 Finale 張眼素材不連續。

## 波紋不是全螢幕一般淡出

`launcher.config.xml` 設 `finaleImpactSeconds=2.6527777777777777`，這是 **Finale 片內時間**，不是從按下 Launch.exe 開始的總秒數。`PulseReveal.cs` 使用角色淚滴落點，對應設計矩形和實際窗口尺寸：`waveTravel=0.32p+2.36p²−1.68p³`；從已有撞擊環半徑延續、橢圓形擴張露出正式窗口，外疊三個逐漸消退的光環和一次短暫白光。

`CinematicScene.cs` 有另外一套程序化線稿→材質化→開眼→雙淚滴落下的時間演算法；**不可將該時間軸直接當成 R16 三段 MP4 的逐幀統計**。R16 實際素材需完整 ZIP 才能驗證編碼、解析度、PTS、首尾連續性。

## 桌布與 R16 穩定性

`renderer.js` 正式視窗背後的視頻 opacity 約 0.26，另外疊漸層保留文字對比。第一回桌布為 ambient，後續在每個週期選擇常態（75%）或粒子片段（25%）；兩次之間隔 10–15 秒隨機。它區分 `video.readyState>=2` 的解碼緩衝與 `requestVideoFrameCallback` 真正提交影格，`getVideoPlaybackQuality()` 可讀 dropped frames，但這不是本次量測的 FPS。

R16 的 `ApplyAnimationSkip` 將 Esc、動畫 ×、Pulse × 與一般動畫視窗關閉統一成「略過片頭、保留桌布啟動意圖」，真實故障與系統退出仍另行處理。`OnClosed` 優先恢復輸入與正式視窗，再釋放解碼器。作者 [VERIFICATION](https://github.com/HanwenZhang-George/codex-startup-animation/blob/community-v34-r5/VERIFICATION.txt) 報告數百項合成／隔離驗收成功，**不等於本文 Windows 實機通過，亦不能推論所有未來 Codex 版本兼容**。

## 系統與權利邊界

主要相依 Windows 10/11 x64、.NET Framework 4.8+、WPF、Microsoft Store 官方 Codex Electron 私有 CDP 管道；Tauri/Wry/WebView2 未實作壁紙傳輸。它是社群啟動器，不是 OpenAI 官方安裝包，也不是 Android bootanimation。

[Source provenance](https://github.com/HanwenZhang-George/codex-startup-animation/blob/community-v34-r5/community-v34/SOURCE-PROVENANCE.txt) 明確說明上游原始碼授權未完全釐清，社群貢獻者不自行替原素材與程式碼新增 MIT；**不直接複製人物圖片、影片或可執行檔**。

## 原始文件

[FilmSplashV2.cs](https://github.com/HanwenZhang-George/codex-startup-animation/blob/community-v34-r5/community-v34/src/FilmSplashV2.cs)／[PulseReveal.cs](https://github.com/HanwenZhang-George/codex-startup-animation/blob/community-v34-r5/community-v34/src/PulseReveal.cs)／[CinematicScene.cs](https://github.com/HanwenZhang-George/codex-startup-animation/blob/community-v34-r5/community-v34/src/CinematicScene.cs)／[renderer.js](https://github.com/HanwenZhang-George/codex-startup-animation/blob/community-v34-r5/community-v34/renderer.js)／[media-manifest.json](https://github.com/HanwenZhang-George/codex-startup-animation/blob/community-v34-r5/community-v34/media-manifest.json)。
