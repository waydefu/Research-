# 17｜Arctic Waters / Hydra：即時 Three.js 3D 製作流程與 Creative Web 工程案例

**研究日期：** 2026-11-02（Asia/Taipei）  
**對象：** [Arctic Waters — 3DITIONS / film=hydra](https://3ditions.drop3.app/watch/arctic-waters/?film=hydra)  
**目的：** 研究可遷移到 THE OBSERVATORY / Evidence Engine V2 的製作方法、視覺 QA 與跨裝置性能治理；**不複製第三方素材**。

## 1. 研究結果與證據層級

| 主張 | 證據級別 | 判讀 |
| --- | --- | --- |
| 三頭 Hydra 與潛水員的 3D 模型使用 Tripo Studio，並經 Blender Rig／修整 | **作者自述** | 可見作者 2026-10-27 的公開敘述；並未下載原始 Blender 或模型檢查 |
| 作者聲稱環境由 Three.js 在瀏覽器即時渲染，而非預錄影片 | **作者自述** | 可相信其製作報告，但沒有逐頁驗證 `watch/?film=hydra` 是否完全相同的渲染執行模式 |
| 水面鏡像效果、漂冰、低角度北極日光、下潛光紋、泡泡及夜間紅色照明 | **作者自述 + 作品簡介** | 未由本次 DevTools 捕獲任何 shader source、材質參數或渲染 pass |
| Tripo H3.1 提供單張參考圖生成潛水員、8K 紋理、auto-rigging，後於 Blender 修整 | **作者自述** | 不代表每個場景物件都是 AI 生成、亦不代表 8K 貼圖會原尺寸載入手機 |
| 4K/60 FPS 即時執行 | **作者聲稱，未獨立實測** | 未知 GPU、瀏覽器、解析度縮放、畫面品質、測量方法與 p95 frame time |
| 商品文案描述海洋、船、四種大型生物、鯊魚、潛水員及 320 m 下潛 | **商品簡介的文字** | 不代表每個場景都可從提供的單一 `?film=hydra` 頁面直接操作 |
| 站點內某個函式、渲染套件、實際 Draw Calls／KTX2／反射方法 | **未知** | 沒有源碼或 Performance Trace，不得宣稱已確認 |

**檢索限制：** 本次網頁讀取工具無法直接打開 3DITIONS 互動展示頁，因此不是第一手逐畫面交互 Walkthrough。作者敘述來自公開社群貼文的第三方快照，應視為可追索的作者自述，而不是本研究完成源碼稽核。作者的 Tripo 推薦內容標示 **paid partnership / #ad**，評價有商業合作背景。

### 1.1 原始與輔助來源

1. [作品頁：Arctic Waters / film=hydra](https://3ditions.drop3.app/watch/arctic-waters/?film=hydra) — 本次直接讀取不可用；作為目標連結，不當作已檢視源碼證據。
2. [創作者 Chetan Ankola 的公開動態鏡像](https://teapawt.org/chetanankola) — 2026-10-27 詳述 Tripo、Blender、Three.js、Hydra 與 4K/60 自述；10-29 的內容另談設計 Atlas／控制滑桿。
3. [創作者媒體貼文鏡像](https://teapawt.org/chetanankola/media) — 協助定位同一段 Hydra 製作說明。
4. [Three.js 官方 examples](https://threejs.org/examples/?q=water) — 可研究一般水面渲染方案；**不是此作品的程式碼來源**。
5. [Three.js 官方文件](https://threejs.org/docs/) — Mesh／AnimationMixer／GLTFLoader／LOD／render target 的一般技術背景；不能反向推定作者採用某一套具體演算法。

## 2. 能從作品學到的「製作流程」而非場景抄襲

作者描述的流程：

```text
參考圖／預期畫面
    ↓
AI 3D 生成與貼圖（Tripo Studio）
    ↓
Blender：修網格、固定裝備、骨架 Rig、游泳動作
    ↓
Three.js：將角色、海面、光照、環境與動畫整合為即時場景
    ↓
設計迭代：調光源／相機／材質／霧、對比多種 Preset
    ↓
視覺 QA：暫停時間、自由移動相機、截圖查瑕疵
    ↓
性能／相容性／裝置獨立驗收（本研究未取得作者的證據）
```

**最有用的製作習慣（作者 10/29 公開建議）：**

- **Design Atlas 在先：** 開始寫 WebGL 或堆模型前，先做多個構圖、材質、配色候選；用一張具有可比性的圖集選方向，避免 AI 不斷迭代卻沒有美術決策。
- **參數面板：** 曝光、光源方向、FOV、金屬度、粗糙度、散射、反射、模糊、色調、尺寸、陰影等都應可直接調整並保存。
- **凍結時間 + 自由相機：** 顯示任意場景中間態，檢查模型破面、過曝、遮擋、陰影洩漏和深度衝突，再輸出可複查截圖。
- **對照同一個取景點：** 把材質風格與內容互動分開審查；避免只挑最好看的單張影像替整個作品背書。

以上「推薦流程」與「證明 Arctic Waters 已公開提供某個 QA 面板」是兩件事；後者目前沒有直接證據。

## 3. 值得研究的 WebGL／Three.js 工程技術（**候選，不是逆向辨識**）

| 系統 | 可試作方案 | GPU／工程代價 | 手機回退 |
| --- | --- | --- | --- |
| 水面微波與法線 | Vertex displacement + normal mapping | 幾何頂點、法線與 shader 精度 | 降低波形頻率及反射品質 |
| 鏡面反射 | 攝影機平面反射的 Render Target；或更便宜的 environment map | 多一遍或多遍場景渲染 | 低解析度、降低更新頻率／完全關閉 |
| 遠景與霧 | 線性／指數深度霧、有限層次視差 | Banding、透明混合及 overdraw | 避免多層透明 |
| 太陽與水下光路 | Key／rim lights、投影條紋與局部光錐 | Screen fill-rate、透明層／多 pass | 降採樣或預烘焙 |
| 角色資產 | Blender → glTF / GLB，動畫使用 AnimationMixer | 模型量、骨架 skinning、貼圖記憶體 | LOD、限制骨骼更新、精簡材質 |
| 大型場景後製 | 只對強光區做低解析 Bloom | 目標貼圖、記憶體頻寬、blur pass | 降比例、減少通道或停用 |

**不得暗示**以上候選就是 Arctic Waters 的確切 Renderer；未取得源碼、性能 trace 前，鏡面算法、shader pass 數量、模型面數、資產壓縮與畫質參數均為 Unknown。

## 4. 對 Research Showcase V2 / Evidence Engine 的可轉移做法

**核心取捨：** 我們是「可搜尋研究庫」而非海洋探索遊戲；不引入海面、潛水員或 Hydra。只引入*創意決策與測試方法*。

| 優先度 | 變更建議 | 為什麼 | 驗收證據 |
| --- | --- | --- | --- |
| P0 | 新增離線／開發專用 **Art Direction Lab** | QA 可以現場調光、FOV、材質、曝光、Bloom，而不是改 shader magic numbers | 控制項→渲染 uniform 可觀察；設定可序列化、復原 |
| P0 | **Design Atlas**：桌面、手機、reduced-motion／無 GPU 視覺比較 | 避免只做好 Hero 或一張圖 | 相同場景 3 視角／3 品質檔的截圖比較 |
| P0 | **Freeze／Free Camera** 開發工具 | 移除光效遮掩的幾何錯誤 | 可暫停／旋轉，儲存相機參數與 screenshot |
| P1 | 暖金主光 + 青藍 rim + 深鈦材料三者獨立調整 | 原創 Evidence Engine 的輪廓可讀性 | 黑白材質 silhouette 與反射高光雙模式 |
| P1 | GPU 套件品質階梯 + 負向測試 | 在手機保留搜尋和文本、降低熱負載 | WebGL lost/restored、eco、data saver、reduced-motion |
| P2 | Scene/Source State 敘事化 | 實際 Markdown 檔名／commit 不是虛構符文 | 索引與渲染一致；失敗可回 DOM |

**現況提醒：** 先前 PR #12–#15 採功能分支串接合併，並不代表所有 V2 功能進入 `main`。完整 V2 整合另由 [PR #16](https://github.com/waydefu/Research-/pull/16) 審查。這份案例研究 PR **不做站點實作或強制合併**。

## 5. 一個小而可驗證的 PoC — 不引入新套件

**目標：** 在既有 V2 mesh core 的開發／QA 模式，建立光照參數控制盤與可重現的畫面比較，不碰正式使用者 UI。

1. 建立獨立參數資料結構：`keyLightDir`、`goldIntensity`、`cyanRim`、`roughness`、`bloomStrength`、`cameraFov`（值域與單位逐一定義）。
2. 用同一個已固定的 research index commit、相機、瀏覽器尺寸與品質設定建立 3 種 Material Presets，保存為可讀 JSON；不記錄憑證或敏感資料。
3. QA 模式提供 Pause Scene 與 Free Camera，並可以保存相機 + uniform snapshot；正常站點仍只有原本 DOM 交互。
4. Desktop 1440、Mobile 390、reduced-motion、WebGL unavailable 四組截圖，先確保資訊不遮蔽與來源可點擊。
5. 用真實 GPU／CPU profile 對照前後效果：FPS／rAF p95、GPU frame time（若可取得）、INP（依測量方式註明）、長任務、電池／熱；不能用 SwiftShader 代表手機。
6. 在 benchmark、光照失敗的 fallback 和可讀性完成之前，不把此技術移入 production。

## 6. 授權、著作權與證據紅線

- 本研究只記錄**文字層級的可追溯製作方法**，不下載、重製、修改、散發或導入 Arctic Waters 的模型、角色、影片截圖、Shader、字體、紋理、UI 或 3D Kit。
- Three.js 為 MIT 授權的通用函式庫；**這不會自動授權第三方 3D Kit**。3DITIONS 的資產授權必須另行閱讀商品／購買條款，不能假設可重散布或放進公開 GitHub Repo。
- Chetan Ankola 的 Tripo 發文含明示付費合作：可以研究其流程，但不把商業行銷內容當第三方 benchmark。
- 原始碼／瀏覽器效能、手機 4K60、資產下載大小、原創材質使用範圍、互動完整度、售價／可商用條款，**目前均未獨立核實**。

## 7. 下一步：候選而非已完成

本文件可作為 V2 的美術工程輸入；真正實作應由單獨 PR 交付。**不把其他人的沉浸式 3D 海洋轉移到本站，而要把「設計圖集→可調參數→暫停／自由相機→真機量測」做成我們自己的品質系統。**
