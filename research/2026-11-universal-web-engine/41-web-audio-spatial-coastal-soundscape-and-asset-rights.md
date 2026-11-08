# 海浪、海鷗與風聲如何形成真正會變化的 3D 聲景？Web Audio、動態混音與素材授權

**來源最後核對：2026-11-08（Asia/Taipei）**  
**主題：** Web Audio API／Three.js Audio、環境聲分層、HRTF、場景音區、天氣連動、音效素材授權及網頁效能。  
**查證界線：** 已核對 Three.js／MDN 官方 API、音效素材發布頁與 Sonniss 2026 授權原文；**沒有下載／聆聽／轉檔任何音效，沒有在瀏覽器或耳機實測音場**。全部參數和流程均為待驗證的工程方案，不代表可直接宣稱聲音達 AAA 或商用權利已獲審定。

## 1｜核心原則：不是把一段海浪 WAV 永遠循環

自然聲景應同時具備：
1. **Ambient Bed**：寬廣、持續而不引起注意的海洋低頻、遠風、自然底噪（非單一點音源）。
2. **Localized Emitter**：沿海岸、碼頭、樹林或建築放置少數定位聲源，讓玩家接近才逐漸清晰。
3. **Event Detail**：海鷗的短鳴、船索拉緊、木頭吱嘎、浪花拍打、腳步和偶發人聲，應按位置與時間稀疏觸發，避免固定循環。
4. **Reactive Mix**：同一個天氣與風場改變聲音的速度、比例、低高頻；走進建築內或躲到山後時處理遮蔽。
5. **User Control**：必須由使用者手勢啟用音訊，提供主音量、環境音、音效、靜音及背景分頁處理。

海岸線聲景的關鍵是**一個寬廣聲場加上分散的局部事件**。將整片海面只設為一個 3D 點音源，會有非自然的方位與距離變化；反之海鷗、船體和腳步適合定位。

## 2｜可行技術棧（優先原生 Web Audio）

`AudioContext → Source Nodes → Bus Gains/Filters → Master Gain/Limiter → device output`

| 功能 | 優先候選 | 重要限制 |
| --- | --- | --- |
| 相機聆聽點 | [Three.js AudioListener](https://threejs.org/docs/pages/AudioListener.html) 一般掛在 Camera，對應 Web Audio `AudioContext` | 場景通常共用一個 listener；必須更新聆聽位置及方向 |
| 3D 音源 | [Three.js PositionalAudio](https://threejs.org/docs/pages/PositionalAudio.html) ／原生 [PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode) | HRTF 更適合少量重要近場聲源；非所有背景音都要啟用 HRTF |
| 短事件音效 | `AudioBuffer` 快取＋每次建立新的 `AudioBufferSourceNode` | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode) 明定 source node **只能 start 一次**，同一 AudioBuffer 可多次重用 |
| 長環境音 | 分層持續播放、交叉淡化（可評估 HTMLMediaElement + MediaElementAudioSourceNode 供長音串流） | 解碼後常駐大量長音效會增加 RAM；需實際比對串流與 `AudioBuffer` 的適用性 |
| 音量與音色 | `GainNode`、`BiquadFilterNode`、`DynamicsCompressorNode`、緩變的 AudioParam | 所有聲音相加可能削波；不能用設定百分比直接當作總輸出 |
| 室內／遮蔽 | 少量區域參數、低通濾波、可選 ConvolverNode／演算法混響 | 不等於真實即時聲線追蹤，需控制處理延遲與 CPU |
| 音訊啟動 | 第一次「啟用音效」點擊事件中 `AudioContext.resume()` | [MDN Autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) 說明瀏覽器可能阻擋無互動的有聲播放 |
| 離線資產 | 優先具明確來源的自然錄音，輸出 Web 相容的壓縮格式 | Opus、Vorbis、MP3 支援依裝置與容器而異，不能只憑副檔名判定可播 |

若遊戲已有 Three.js scene，`AudioListener` + `PositionalAudio` 可以直接對齊 3D 座標；對環境床、淡化、隨機事件與動態 Bussing 仍可使用 Web Audio 原生節點。初期不必因此引入大型第三方遊戲音訊引擎。

## 3｜八種聲音應如何調度？

| 音景 | 錄音策略及播放行為 | 關聯的環境事件 |
| --- | --- | --- |
| 海上風浪底床 | 長、寬廣環境聲，兩至三種變體用 crossfade 交替；遠景先保留底噪 | 風速、海況、岸線距離；音量與高頻需平滑 |
| 海岸浪花 | 沙灘／礁石／碼頭周圍的少數定位點；按破浪週期稀疏觸發、加微小時間偏差 | 海浪泡沫、岩石與船體附近的浪拍事件 |
| 海鷗 | 多支短音效變體，按日夜／區域／群體密度隨機排程 | 叫聲對應飛行個體**當下座標**，不用全部海鷗同時叫 |
| 風聲 | 近處樹林沙沙聲與遠距寬頻風聲分開兩層；分開設置音量及低高頻 | 風場風速、陣風、山脊／建築遮蔽 |
| 草木摩擦 | 依植被密度和低頻 gust 決定播放強度、局部樣本 | 世界座標的 gustField，陣風穿過林冠時有先後 |
| 港口生活 | 船木吱嘎、繩索、木樁水聲、工具敲打 | 位置距離、船隻運動、物件接觸 |
| 地面腳步 | 根據材質分層（沙、石、木、濕泥）與步速隨機選擇 | 腳步事件、地形與濕度 |
| 降雨雷暴 | 雨聲廣域床＋近處滴答＋延遲雷鳴、風暴浪濤 | 雲量與雨勢、雷暴位置、建築屋頂遮蔽 |

**不能把畫面同步誤解成聲音逐幀硬同步。** 玩家每幀都可能看到海面波動，但浪花「拍岸」應由較低頻、較明確的波相位／泡沫事件觸發；海鷗朝鏡頭飛不代表每秒必定要叫。日夜、雨量、樹林密度與風場是**決定機率、強度、音色**的共同條件。

## 4｜動態聲景的最小抽象

`AudioDirector` 統一擁有 lifecycle、`Listener`、匯流排、來源 buffer cache、聲音池、排程、音量儲存／預設、天氣事件訂閱與釋放；畫面渲染不直接管理音效檔案。

`updateSoundscape({camera,position,biome,shoreDistance,wind,weather,timeOfDay,occlusion})`

- `shoreDistance` 經過平滑的距離曲線控制近岸與遠海聲景比例，而非硬切換；空間化的散點聲源限制個數。
- `wind.meanSpeed` 與 `wind.gust` 分別控制持續風底床／突發樹葉摩擦，低通、音量、淡化設定變化速率上限；可額外加入樹枝延遲反應。
- `biome`、`timeOfDay`、`weather` 調整事件發生頻率與音色；海鷗白天活躍只是起始**美術規則**，不是所有海鷗物種的固定生物學事實。
- `occlusion` 使用場景區域與少量 raycast 結果估計。窗邊、門洞、森林和房間的高頻衰減／殘響可用簡化的聲學狀態轉場，不能宣稱物理聲學追蹤。
- 防止音源過多：以距離、可聽度和優先級做 **voice virtualization**，只有靠近且重要的物件需要 HRTF；較遠物件可以混入非定位底床或停止播放。
- Android／低功耗平台先限制同時發聲、長音記憶體、混響節點及頁面隱藏背景播放；釋放前停止音源、斷開節點、關閉／暫停 context，避免每次場景重建疊加多份聲音。

## 5｜素材來源：權利按**每份音檔**核對

| 候選來源 | 已核對的標示及用途 | 風險 |
| --- | --- | --- |
| [Beach Ocean Waves — OpenGameArt](https://opengameart.org/content/beach-ocean-waves) | 作者 jasinski、由 qubodup 提交；頁面列 **4 段 FLAC** 與 **CC0**，原 Freesound 作品連結在同頁 | 可作 4 種海浪節奏候選，仍需保留來源及檔案 SHA；本次**未下載或聆聽** |
| [Solo Seagull Sound Effects — OpenGameArt](https://opengameart.org/content/solo-seagull-sound-effects) | 頁面標 **CC0**、Rango Mango 整理多支單隻海鷗音效；上傳者註明素材來自另一段 YouTube 影片，並聲稱取得完整轉載與商用許可 | **授權鏈未獨立確認**；不能單因 OGA 標 CC0 就自行保證原錄音權利完整。需確認原作者授權，否則換可追溯的聲源 |
| [Sonniss GDC 2026 Bundle](https://gdc.sonniss.com/) | 官網顯示約 **7.47GB、347+ 檔**，允許商業媒體作品；[2026-08-27 生效的 EULA v2.0](https://sonniss.com/gdc-bundle-license/) 明示遊戲內同步使用、可改音效、無需署名 | **專用授權非 CC0**；不得把原始或改造音效當素材包、SDK、模板、獨立音效檔散布；禁止 AI／ML 訓練。公開 Git Repo 放音檔前必須查核是否屬不准的素材再散布 |
| 實地自行錄音 | 可錄海浪、草木、岸邊船體及鳥鳴，自行建立來源與地點/時間/裝置記錄 | 需確認是否涉及他人表演、背景音樂、保護地／場地規定及錄音隱私；原創不表示每種情境都無權利問題 |

**公開研究不能把可商用遊戲「嵌入成品」誤寫成可以免費分發裸音檔。** Sonniss 條款尤其重要：即使有產品權利，仍可能不允許讓別人從 GitHub 取得裸素材後再利用。素材 manifest 應保存 `id, source, author, upstreamLicense, assetSha256, reviewedOn, usageScope, redistributionAllowed`，並為每檔核對改編版本與下載來源。不把任何錄音用於 AI 訓練，除非授權明確允許。

## 6｜音效品質與手機效能的可重現驗收（均未執行）

1. **輸入素材：** 對每個海浪／海鷗來源保存作者、URL、license 版本、下載時間、檔案 SHA、是否可原檔再散布的確認；檢查底噪、突兀拼接、削波及左右聲道一致性。
2. **循環與交叉淡化：** 量測循環點波形跳變、短時 LUFS 或 RMS 變動與相位；聽取 5 分鐘以上是否出現可察覺的週期重複。不同錄音交疊時不可把峰值加到過載。
3. **3D 方位／遮蔽：** 用一致的相機移動軌跡走過碼頭、海岸、樹林與室內，對照耳機 HRTF 主觀定位與遠距 volume curve；不聲稱一般雙聲道喇叭具有完全相同感知。
4. **場景一致：** 強風逐漸增大時，雲、草、樹、海浪與環境音**由同一 Weather State 控制**但反應可有延遲；雨停止後環境底噪自然收斂，無突兀關閉。
5. **瀏覽器：** 首次啟用手勢、切回分頁、裝置切換、Web Audio suspend/resume、Android Chrome／Firefox 及桌機的格式兼容與音量記憶。
6. **效能：** 以相同音軌／場景／裝置測 p50/p95 音訊 callback／main-thread 壓力、音訊 RAM、同時 HRTF 數量、CPU、耗電與熱降頻。不要拿 Graphics FPS 代替音訊穩定度。
7. **用戶控制：** 主音量、環境聲、效果聲、Mute、動態範圍選項、語音／重要提示可辨識性；遵守使用者降低音量選擇。

### 採用順序與範圍

**最小閉環：** 一條海洋底床 + 少量近岸浪拍 + 稀疏定位海鷗 + 共用風場驅動的風／樹葉層。先完成人工試聽，再加入港口、室內空間、雨雷、音訊壓縮、混響及更多生態。對需要即時互動的遊戲，**自然錄音 + 規則調度 + Web Audio** 比把所有聲音交給即時音樂／音效 AI 生成更容易控制成本、延遲、權利與一致性。

## 來源台帳

- [Three.js AudioListener](https://threejs.org/docs/pages/AudioListener.html)、[PositionalAudio](https://threejs.org/docs/pages/PositionalAudio.html) — A：官方 3D listener／定位聲 API。
- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)、[AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode)、[PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)、[Autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) — A：瀏覽器規格與自動播放限制。
- [Beach Ocean Waves](https://opengameart.org/content/beach-ocean-waves)、[Solo Seagull](https://opengameart.org/content/solo-seagull-sound-effects) — A：素材頁授權標示；第二項原始權利鏈為**作者轉述，未獨立驗證**。
- [Sonniss GDC 2026](https://gdc.sonniss.com/)、[GDC Bundle License v2.0](https://sonniss.com/gdc-bundle-license/) — A：原廠發佈／條款。授權是否適合特定交付形式，須按原文與實際授權契約重新核對。
- [統一風場與雲影研究](40-volumetric-clouds-unified-wind-vegetation-weather.md) — C：同一研究包的跨系統設計方案。
- 混音架構、聲音事件機率、空間音區、效能 Gate — C：本文工程設計，**NOT RUN**。
