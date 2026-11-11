# HALOFLUX：Canvas 光環、非均勻節拍時鐘與手機版優化

研究日期：2026-11-11（Asia/Taipei）  
上游版本：`Ryder191/haloflux`，main `02174503d0f391b1bb2537b8cad75e8e5f9997f2`  
研究狀態：公開 HTML、README 和 LICENSE 已核對；未執行即時渲染、未測真機 FPS。

## 是什麼

作者使用原生 Canvas 2D 在單檔 HTML 生成科技資料環、發光線束、面板和鏡頭轉場，另有 `lab.html`、`mobile.html` 與 Wallpaper Engine 網頁壁紙版本。它是**即時生成的視覺特效**，而非把固定影片逐幀塞入 Canvas；預設有可編輯的節奏、鏡頭、光圈、光束、景深等參數。

## 重要技術

### 不等間距節拍控制

`lab.html` 以 `PATTERN=[0.5,0.25,0.25,0.5,0.5,0.75,0.25,0.25,0.25,1.0]` 建立 beat clock，每次觸發後更新 `beatT += PATTERN[i] * 0.92 / tempo`。亮度包絡 `env = exp(-sinceBeat*4.5)` 隨節拍退去，並帶動旋轉環衝刺／停頓、成組的 comet、資料方塊閃爍與外層衝擊波。不是只調一個全畫面的 CSS 動畫速度。

### 運鏡與渲染循環

`buildShots()` 定義七個 shot，hold 段附帶緩慢 zoom；各 shot 間以 2.2s ease 插值，倍率經對數空間插值而非簡單線性縮放。主循環調用 `drawStage(dt)`、`drawAdv(dt)`、`drawDiff()`、`drawVal()`、`drawIdx()`、`agentsTick(dt)`，以 `dt=min(0.05,Δms/1000)` 限制過大步長。

### 手機版明確降成本

`mobile.html` 將 runnerCount 乘 0.5、flyerCount 乘 0.55、burstSize 乘 0.75、bokeh 乘 0.6，resize 時 `devicePixelRatio` 上限 1.75（桌機上限 2）。這些是實作的工作量削減，**不能據此推算真機 FPS 或聲稱畫面一樣精細**。

## 能學的、不能假設的

可把「事件驅動的亮度包絡 + 慣性旋轉 + 鏡頭慢推」抽象成自己的動畫規格；但若直接複製 HALOFLUX 畫面構圖、原始碼或產出的視覺作品，必須服從作者 [LICENSE](https://github.com/Ryder191/haloflux/blob/02174503d0f391b1bb2537b8cad75e8e5f9997f2/LICENSE)。

**授權：**2026-10-26 起作者明示使用 PolyForm Noncommercial 1.0.0，個人研究與非商業用途可依條款使用，禁止商業用途；轉發影片、截圖、改作時要按條款保留來源、作者與通知。音樂 `sw421k.mp3` 是作者記載的 CC0 獨立權利，不代表視覺引擎是 CC0。若考慮商業用途，應創作自己的獨立實現與資產，且不得將受限制的衍生作品當成無權利障礙。

## 來源、測試計畫

- [lab.html：節拍、運鏡與主循環](https://github.com/Ryder191/haloflux/blob/02174503d0f391b1bb2537b8cad75e8e5f9997f2/lab.html)
- [mobile.html：手機縮減常數與 DPR](https://github.com/Ryder191/haloflux/blob/02174503d0f391b1bb2537b8cad75e8e5f9997f2/mobile.html)
- [README：操作與作者聲明](https://github.com/Ryder191/haloflux/blob/02174503d0f391b1bb2537b8cad75e8e5f9997f2/README.md)

驗收尚未執行：在固定 60Hz/120Hz、相同分辨率和 preset 下，量測 p50/p95 frame time、Canvas backing store 記憶體、頁面隱藏/重開、熱降頻、電力消耗及 prefers-reduced-motion。Android 早期 bootanimation 不執行 Web Canvas：必須預渲染或以系統支援方式另行實作。
