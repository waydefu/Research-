# WebGL2／WebGPU 體積雲、統一風場與草木風動：從各自動畫到一致天氣系統

**來源最後核對：2026-11-08（Asia/Taipei）**  
**範圍：** Three.js、WebGL2、WebGPU／TSL、體積雲、地面雲影、草浪、樹冠／葉片、共用氣象狀態、行動裝置降級。  
**查證狀態：** 已讀原作者 README、官方 API／技術文件與上游相容限制；**本篇未實測，也沒有安裝任何工具、執行示範、進行 GPU benchmark 或驗收手機 FPS**。以下公式、架構與預算是可重現的**工程設計建議**，不是任何既有產品已測得的表現。

## 1｜問題：雲、草與樹若各自擺動，畫面仍像假的

雲往東飄、草卻以全場同步正弦朝西搖、樹葉任意抖、地面雲影與天上雲圖不同步，就算每一種效果各自精美也不具備一致的氣象因果。比較合理的設計是由**單一 Weather State** 掌管時間、主風向、風速、陣風、湍流、雲量、太陽方向；不同高度與材質則從同一套狀態**求出不同的有效風與物理反應**，而不是強迫海面、草尖和高雲以完全相同的速度移動。

一個可測試的設計模型：

`W(x,z,h,t) = meanWind(h,t) + gustField(x,z,t) + turbulence(x,z,h,t)`

- `meanWind`：地表、樹冠與雲層可使用不同高度剖面；同一陣天氣下存在相關但不同的速度。
- `gustField`：用連續、隨風平移的低頻空間場產生**傳播中的草浪**，不能只讓每個實例獨立亂跳。
- `turbulence`：小尺度擾動、相位偏差及遮蔽效應；要限制時間頻譜，避免閃爍與太大頂點位移。
- `weather`：以漸變方式更新風向、速度、雲覆蓋、雨勢與照明；當天氣突變時，雲影、海浪、粒子和聲音共用**同一個天氣事件時間軸**。

## 2｜六個上游案例：選研究技法，不要一次綁六套渲染器

| 上游與公開示範 | 已核對的作者技術說明 | 主要導入限制 |
| --- | --- | --- |
| [Eanpa Sky](https://github.com/SkyeShark/Eanpa-Sky) ／ [Demo](https://skyeshark.github.io/Eanpa-Sky/) | Three.js WebGPU／TSL，體積天空、八類天氣、雲影、日夜、閃電、植被風動；Performance 模式以間歇捕捉的雲圖降低重複 Raymarch | 早期 v0.2.1、帶本地修改的 Three.js renderer、原版 Demo 下載負載與 shader warm-up 較高。上游 [KNOWN_ISSUES](https://github.com/SkyeShark/Eanpa-Sky/blob/main/KNOWN_ISSUES.md) 報約 345MB 首次載入，**非本篇測量**；音訊素材另含非商業授權 |
| [Takram Three Clouds](https://github.com/takram-design-engineering/three-geospatial/tree/main/packages/clouds) | `@takram/three-clouds` Beta：體積雲、Beer shadow maps、Temporal upscaling、光束與霾；上游 [README](https://github.com/takram-design-engineering/three-geospatial/blob/main/packages/clouds/README.md) | 現有 API 需 `postprocessing` composer，**不相容** Three.js examples 內的 `EffectComposer`；WebGPU 雲端重構仍在開發。套件包 `package.json` 標示 MIT；第三方依賴及版本須鎖定 |
| [Three.js 官方 WebGL 體積雲範例](https://threejs.org/examples/webgl_volume_cloud.html)／[WebGPU 範例](https://threejs.org/examples/webgpu_volume_cloud.html) | 官方 Volume Cloud 範例可用來理解 3D density、Raymarch、雲層厚度、與渲染路徑的最小技術實驗 | **只是示範，不是完整風場／天氣／雲影庫**；不能將 Demo 成功外推到完整場景手機效能 |
| [Three.js Field Grass](https://github.com/matthew-kissinger/threejs-field-grass)／[Demo](https://matthew-kissinger.github.io/threejs-field-grass/) | TSL Instanced grass，三個 octave 風場、決定性 scatter、玩家經過後單調恢復的 wake field；可測 WebGPU 與 WebGL2 fallback | 0.1.0 公開原始碼預覽，npm 尚未正式發布；上游指定 Three.js `0.185.x`，升級必須確認 TSL 相容；Demo 中角色資產授權與草核心 MIT **不同** |
| [SeedThree](https://github.com/SkyeShark/SeedThree)／[Demo](https://skyeshark.github.io/SeedThree/) | 作者稱 20 種程序植物、階層式 LOD、樹葉卡片／針葉、實例化風動、草地、GLB 匯出 | v0.1.0-alpha；WebGPU 優先，WebGL2 回退須實測；生成紋理、示範音效及其他資產權利**不應隨程式碼授權一併假定** |
| [VIPER 11 Clouds 技術筆記](https://viperoneone.com/notes/clouds/) | 公開文章說明雲層光學、遠距 March、時間重用、不同 cascade 雲影及畫質 governor 的設計考量 | 是特定作品技術說明，不是可直接移植的完整版程式庫；不能把作者自述步數與效能當成另一款遊戲的實測值 |

**資料來源與權利：** Eanpa 的 LICENSE 為 MIT 程式碼，但 README 指出部分鳥聲音檔採 CC BY-NC-SA；Field Grass README 宣告核心 MIT，示範角色／動畫等有額外授權。不能以「開源 Repo」四字概括所有聲音、圖片與 3D 資產。需要複製 Shader 或合併組件時，應逐檔檢查 LICENSE/NOTICE 和依賴。

## 3｜同一風場如何驅動不同物理層

| 受風目標 | 建議的 Shader／更新策略 | 避免的錯誤 |
| --- | --- | --- |
| 雲團體積 | 3D 噪聲密度採樣座標沿 `W_cloud * t` 對流，低／高層雲有不同速度，陣風可改變形狀與 erosion | 只平移一張天空貼圖卻宣稱可以穿越體積雲 |
| 地面雲影 | 雲密度／透光度和太陽方向投影到地表及屋頂；優先**共用密度來源**，而非另生成隨機陰影 | 陰影方向與可見雲不一致、陰影被當作物理真實但只是亮度遮罩 |
| 草浪 | `InstancedMesh` 頂點偏移，根部權重近零、葉尖較大，低頻陣風場以世界座標傳播，疊加小幅高頻抖動 | 每根草各自用單一 `sin(time)`、全場機械同步、CPU 每草每幀重建 |
| 樹木 | 樹幹小幅彎曲、樹枝中頻反應、葉片局部高頻 flutter；質量／剛度與冠層高度決定延遲 | 整棵樹像一張卡片等幅平移、葉片速度與枝幹相同 |
| 水面與船帆 | 共用大尺度風向，波峰方向／浪高與帆布響應另依流體及材質設定 | 以畫面草尖位移直接當作海浪振幅 |
| 粒子與聲音 | 落葉／煙霧以風場積分軌跡；環境風聲以風速與遮蔽平滑映射混音參數 | 用畫面每幀亂數直接控制音量與速度 |

**雲影更新與品質分級：** 可見體積雲每幀做低解析度 Raymarch 或逐幀重投影；陰影可使用較低頻率重算的共用透光度貼圖。上游 Eanpa 的雲影更新、分層 capture 和近場照明是**架構參考**，不可不量測就照抄其解析度、更新 Hz、陰影範圍或 GPU 成本。室內與山後應考慮遮擋、天空可視率與反射延遲，基礎品質不做完整體積雲仍可保留一致的 2D／2.5D 雲場投影。

## 4｜適合 Three.js WebGL2 專案的漸進導入路線

1. **保持現有 Renderer，不強制轉 WebGPU：** 先建立 `WeatherState`、`sampleWind(position,height,time)`、`sampleCloudDensity(position,time)` 和 `sampleCloudShadow(position,sun,time)` 的明確 API，以及 deterministic seed；用同一時鐘寫雲、風、影的測試。
2. **草與樹先做世界座標陣風：** 更新 shader uniforms，不逐格重建草幾何；採樣風場的空間相關性，而不是只共享浮動時間相位。核對 instancing、透明排序、Vertex Animation 與 shadow caster 的一致性。
3. **獨立 Canvas 驗證體積雲 PoC：** WebGL2 3D texture／Raymarch，測雲體厚度、光線散射近似、雲體移動、關閉時的畫面回退；限定低解析度與步數，避免在手機直接開啟全部效果。
4. **High 模式比較 Takram／Eanpa 技法：** 若需完整 Library，先評估 Composer、Three.js 版本、WebGPU、資產和部署成本；**沒有相容性證據前只借用公開技法，不直接塞入整庫**。
5. **同時導入動態天氣音訊介面：** 把風場與雲雨事件公開給 Audio Director，不在圖形層混入音訊解碼、硬體輸出或使用者自動播放策略。搭配同資料庫另一篇 [Web Audio 動態聲景研究](41-web-audio-spatial-coastal-soundscape-and-asset-rights.md)。

## 5｜可驗證的畫質、物理合理性與效能 Gate（尚未跑）

- **A／B：** 固定種子、相同日照與風場，對照基準 2D 雲、High 體積雲與降級路徑的天空／陰影／植被。
- **同步：** 將風向從東旋轉到西，雲影、草浪、海水波向、落葉與音效**依各自物理時間常數平滑轉換**，不能瞬間反向；觀測雲影與可見雲的空間一致性。
- **動態：** 陣風沿空間傳播而非全草同相；草尖／枝幹／葉片不同頻段；雨雲與地面暗度／聲音同事件但不必逐幀一一相等。
- **效能：** 在相同 scene、相機路徑、解析度、pixel ratio、電源／溫度下，記錄 GPU/CPU frame p50/p95、shader 編譯、貼圖記憶體、流暢度與長時間發熱；桌機和 Android 各自量測。
- **故障：** WebGPU 不可用、Context/device loss、低端手機、背景分頁恢復、天氣快速切換時，驗證 renderer 與雲層安全降級。
- **資產：** 記錄風場來源實作與所有第三方貼圖／音效的授權；外部 Demo 僅提供原站連結，不預設可 iframe。

## 來源台帳

- [Eanpa Sky README](https://github.com/SkyeShark/Eanpa-Sky)、[Cloud Shadow integration](https://github.com/SkyeShark/Eanpa-Sky/blob/main/docs/SKY_SYSTEM_INTEGRATION.md)、[Known Issues](https://github.com/SkyeShark/Eanpa-Sky/blob/main/KNOWN_ISSUES.md) — A：上游作者自述架構與限制，非本次 GPU 實測。
- [Takram three-geospatial](https://github.com/takram-design-engineering/three-geospatial)、[clouds README](https://github.com/takram-design-engineering/three-geospatial/blob/main/packages/clouds/README.md)、[套件資訊](https://github.com/takram-design-engineering/three-geospatial/blob/main/packages/clouds/package.json) — A：官方功能、Composer 相容及 MIT 宣告。
- [Three.js WebGL 體積雲](https://threejs.org/examples/webgl_volume_cloud.html)、[WebGPU 體積雲](https://threejs.org/examples/webgpu_volume_cloud.html) — A：官方可供實作參考的示範路徑；本次研究未執行。
- [Field Grass](https://github.com/matthew-kissinger/threejs-field-grass)、[SeedThree](https://github.com/SkyeShark/SeedThree) — A：上游原始碼 README，版本與資產邊界以作者明示為準。
- [VIPER 11 Clouds](https://viperoneone.com/notes/clouds/) — A：作者技術文章；不可代替第三方量測。
- 本文統一 `WeatherState` 模型、品質路線、GPU 驗收規格 — C：工程推導；**NOT RUN**。
