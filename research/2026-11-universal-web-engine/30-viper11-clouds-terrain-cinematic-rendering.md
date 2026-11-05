# 30｜VIPER 11：瀏覽器如何做到可穿越的體積雲、真實地形與電影級鏡頭？

**研究日期／來源最後核對：2026-11-05（Asia/Taipei）**  
**研究狀態：作者技術筆記已直接核對；遊戲程式碼、DevTools trace、手機 GPU 效能未獨立實測**  
**研究分類：即時 3D 渲染與 Shader／體積雲與大氣／地理地形串流／鏡頭後製／飛行物理**  
**案例作者：** apek（官方筆記署名）；相關開源函式庫作者 Shota Matsuda，兩者不可混為一談。

## 這是什麼？為何值得關心？

[VIPER 11](https://viperoneone.com/) 是在瀏覽器運作的 3D 飛行遊戲。比起「套一張漂亮天空」的展示方式，其作者公開了可穿入的體積雲、動態雲影、真實高程與航照地形、特殊廣角鏡頭、HDR 後製、飛行控制等技術拆解。價值不在於複製飛機或地圖，而在於它示範了「環境、多尺度資料、攝影語言、可測量性能回退」如何組成同一條畫面管線。

## 主要結論與證據級別

| 主張 | 判定 | 證據 |
| --- | --- | --- |
| 使用 three.js、WebGL2、Web Audio | **作者官方文件明示** | [雲層筆記](https://viperoneone.com/notes/clouds/) 頁尾 |
| 遠景雲與天空主要基於 takram 的 `three-clouds`、`three-atmosphere` | **作者明示；未驗證遊戲實際打包版本** | [雲層筆記](https://viperoneone.com/notes/clouds/) |
| 雲層採 raymarch、時間重建、級聯雲影，近距離另加特別處理 | **作者技術描述；未獨立擷取 shader** | [雲層筆記](https://viperoneone.com/notes/clouds/) |
| 地形採真實高程、航照瓦片、CDLOD／四元樹、LOD morph | **作者技術描述；未抓取或檢查 tile assets** | [地形筆記](https://viperoneone.com/notes/nellis/) |
| 多視角廣角、鏡頭玻璃、HDR／ACES／LUT | **作者技術描述；未獨立跑 GPU trace** | [鏡頭筆記](https://viperoneone.com/notes/lens/) |
| 所有桌面與手機都能達成相同 60 FPS | **無證據，不得宣稱** | 未取得固定條件效能紀錄 |
| 全部遊戲源碼 MIT 開源 | **無證據，不得宣稱** | 函式庫授權不等於作品授權 |

## 1｜體積雲：可走入雲內的渲染不是一張天空圖

官方解釋雲是具有空間密度的體積：每個像素沿視線採樣密度與向光方向的遮蔽，以 Beer–Lambert 透射及 Henyey–Greenstein 相函數近似散射。頁面列出至多 500 個視線採樣步、雙 HG lobes（約 g=0.7 與 -0.2）、以及基於衰減的提前結束。**這些數值是該作者頁面所述實作參數，不是普遍最佳值，也不是本研究的實測數據。**

成本控制有幾層：

1. **Temporal reconstruction：**一個 4×4 像素區塊每幀更新一個採樣位置，16 幀覆蓋一輪；相機移動後重投影歷史影像。主要風險是快速視角變化、遮擋、ghosting。
2. **雲影：**作者描述三張 512×512 級聯 shadow maps，涵蓋至約 80 km；此處是作品自述的雲影覆蓋，不代表每段地形陰影皆以相同解析度計算。
3. **雲內特寫：**靠近或穿過雲時，另外以近場 marching、blue-noise jitter、世界座標 wisps 避免遠場材質在近距離顯得平板。
4. **品質階梯：**負載變重時降低 resolution scale、步數與雲影尺寸。畫質降級不能只用靜止幀驗收，需看高速相機運動下的穩定性。

上游路徑：[takram-design-engineering/three-geospatial](https://github.com/takram-design-engineering/three-geospatial)（其套件與授權需依實際 package/tag 再核對）；原作者的筆記將 `three-clouds`、`three-atmosphere` 稱為 MIT 開源元件。本研究**未確認遊戲所用版本或本體授權**。

## 2｜真實大地形：影像來源、LOD 與局部微細節缺一不可

作者以 AWS Terrain Tiles 的高程、USGS／NAIP 航照與補洞影像組成多解析瓦片，描述了十級 tile pyramid、4,559 組影像與高度瓦片，以及「飛行中只傳輸看得到的區域」。場景使用 CDLOD/quadtree，並在 LOD 交界透過頂點向父層位置插值和影像混合來減少 popping；資料以 coarse-first / near-first 載入。

此案例可抽象為通用地形工程規則：

- **大尺度**用 DEM + 影像瓦片、quadtrees、LOD 和視野裁切；不要把整個世界當單一網格常駐。
- **中尺度**加入地表顏色匹配、道路／海岸／建物與曲面地形連接。
- **近尺度**用程序化材質、細碎石、草木與碰撞細節補足航照在地面視角的低解析。
- **植被**可先從地表或地理資料推定位置，再以 instancing 承載；作者描述透過 NAIP 近紅外與 NDVI 判斷沙漠植被、加入大量灌木／草／石實例，**此方法是否能轉移到其他生態系需重新實測**。
- **資料授權**對地圖、航照、衛星圖、數位高程、素材庫逐一檢查；「公開可下載」不等於「無條件可商用」。

## 3｜電影鏡頭：合理失真比疊加泛光更重要

作者解釋以三視角混合重建 165° 特殊魚眼視野，讓畫面中心保持可讀、邊緣產生廣角變形；作者自述副視角造成約 45% 額外 frame time，**無法當作其他場景的基準開銷**。玻璃污漬、刮痕、菲涅耳反射、雲中水滴依光源與氣流狀態反應，而非不分場合常開的裝飾 overlay。

後製順序的核心是把 3D 畫面維持在線性 HDR，完成曝光／色調處理後才進最終顯示轉換。官方提到 log-average 自動曝光、ACES tone mapping、33³ LUT、受遮蔽的 flare 與 bloom、僅作用於世界畫面的 motion blur。此案例說明：**構圖與鏡頭語言、反射/材質的場景關聯、合理曝光，常比任意增加 shader passes 更決定電影感。**

## 4｜互動與物理：渲染之外的獨立系統

飛行筆記描述六自由度剛體模型，以 240 Hz 迭代，並簡化飛控法則以保有可玩性；這是**作者對其模型的描述**，不代表飛行行為經航空認證。環境、操作、聲音與物理應有不同更新率，避免因 GPU 品質回退直接變動遊戲力學。參考：[飛控筆記](https://viperoneone.com/notes/flight/)。

## 5｜可重現的 PoC 設計（本文未執行）

| 實驗 | 同場景 A/B 比較 | 指標 | 失敗／回退 |
| --- | --- | --- | --- |
| 雲 | 平面天空 vs 體積雲 | GPU p95、移動 ghosting、雲形可讀 | 回退低密度雲／靜態天空 |
| 雲影 | 關閉 vs 分級級聯雲影 | 地面陰影連續性、GPU cost | 降 cascade 或關閉 |
| 地形 | 固定全景網格 vs quadtree LOD | 峰值記憶體、串流延遲、LOD pop | 降瓦片等級、預載遠景 |
| 植被 | 個別 mesh vs instancing | draw calls、CPU frame time、視覺密度 | 裁切、impostor |
| 鏡頭 | 一視角 vs 多視角 + LUT | GPU p95、中心可讀性、眩暈 | 一視角與 reduced-motion |

固定鏡頭、照明、seed、解析度、資產 SHA、renderer 版本及輸出資料，再於桌面與真手機測量。**本研究不填任何未測 FPS、改善百分比或裝置表現。**

## 6｜權利與採用決策

- **已確認存在且可閱讀：**官方 15 篇筆記索引；本次直接核對雲、鏡頭、地形、飛控四篇。
- **尚未確認：**遊戲打包與實際源碼、效能追蹤、所用 npm 版本、完整素材商用權、iframe 可否嵌入。
- **候選採用：**優先學習分層環境渲染／資產串流／QA 方法。不得把第三方遊戲資產或 shader 片段直接搬進其他網站。
- **決策狀態：**僅研究紀錄，**未批准導入**；真正導入需另提 PoC、授權盤點及設備驗收。

## 來源台帳（2026-11-05）

| 主張 | 原始來源 | 證據級別 |
| --- | --- | --- |
| 15 篇作品技術筆記 | [官方 Notes 索引](https://viperoneone.com/notes/) | A：作者一手公開說明 |
| Raymarch／時間重建／雲影／上游庫 | [Clouds you can fly through](https://viperoneone.com/notes/clouds/) | A：作者自述原理與數字；非獨立測試 |
| 地形資料／LOD／植被 | [A real airfield](https://viperoneone.com/notes/nellis/) | A：作者自述原理與數字；非獨立測試 |
| 廣角鏡頭／ACES／LUT | [The GoPro that doesn't exist](https://viperoneone.com/notes/lens/) | A：作者自述原理與數字；非獨立測試 |
| 飛行力學模型與簡化範圍 | [Fly-by-wire in a browser](https://viperoneone.com/notes/flight/) | A：作者模型描述；非航空級認證 |
| 可重用開源候選 | [three-geospatial 上游專案](https://github.com/takram-design-engineering/three-geospatial) | B：專案存在；版本、許可與適配待核對 |
| PoC、優化／降級順序 | 本文研究推導 | C：未實測 |

**修訂紀錄：**2026-11-05 建立第一版；未替換既有渲染研究、未執行實作。
