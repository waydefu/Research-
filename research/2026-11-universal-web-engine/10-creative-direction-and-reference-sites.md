# 10｜世界級數位作品、美術方向與成熟 UX（28 案例）
**查證日期：2026-11-02（Asia/Taipei）**　**狀態：官方作品目錄／作者文章交叉研究；未使用可操作瀏覽器完成逐頁動態量測。**

> 這裡的 **A** = 作者或出品方提供具體設計／工程描述；**B** = 出品方名錄證實案例與分類、細節仍待檢查；**C** = 獎項索引確認存在、作品行為 Unknown。這不是 Awwwards 官方分數，也不是本站效能評等。作品未必在 2026 年仍能正常操作。不得從畫面猜 React、Three.js 或 GSAP。

## 既有研究去重及本次增量
- 沿用 [05 Web Motion 3D](../2026-10-retrospective/05-web-motion-3d.md) 對特效的基礎概念、[06 圖形與相容性](06-graphics-and-compatibility.md) 的 WebGPU 降級觀念、[07 效能](07-performance-and-accessibility.md) 的 CWV 門檻；本篇新增**作品層級的美術策略、資訊路徑、觀察信心**。
- 未找到既有 25+ 個作品的逐項分析、能量測的 Art Direction Gate。既有研究不作重寫。

## 案例資料表（28 個不同作品）
| # | 團隊 | 作品／來源 | 可研究的風格與 UX 問題 | 已知資訊及分析限制 | 證據 |
|---:|---|---|---|---|:---:|
| 1 | Active Theory | [Paper Planes](https://experiments.withgoogle.com/paper-planes) | 跨裝置參與式敘事 | 摺紙手勢→投擲→全球路徑回饋；真實 WebGL/GLSL／Workers／Instancing 有作者說明 | A |
| 2 | Active Theory | [Portfolio（2024）](https://www.commarts.com/webpicks/active-theory-2) | 藝術化入口與極簡導航 | 速度感知導覽、AI 查找作品與即時互動；官方訪談確認 WebGL JS | A |
| 3 | Resn | [Zentry](https://bestawards.co.nz/studios/resn/) | 遊戲品牌互動 | 僅獎項目錄確認作品；具體機制與實作 Unknown | C |
| 4 | Resn | [Getty Tracing Art](https://bestawards.co.nz/studios/resn/) | 藝術教育沉浸展示 | 作品名稱與獎項已核對；互動與引擎 Unknown | C |
| 5 | Resn | [Getty Sculpting Harmony](https://bestawards.co.nz/studios/resn/) | 藝術／文化敘事 | 作品名稱已核對；材質／渲染技術 Unknown | C |
| 6 | Resn | [Breakthrough Energy](https://bestawards.co.nz/studios/resn/) | 科技敘事 | 2026 入選名稱已核對；技術 Unknown | C |
| 7 | Dogstudio | [Virgin Galactic](https://dogstudio.co/cases/virgin-galactic/) | 高級產品／旅程展示 | 作者確認 AstroGL 多 WebGL 子場景、預計算環境貼圖近似反射及雙向 pin/clipping；效能數據未提供 | A |
| 8 | Dogstudio | [Geske](https://dogstudio.co/cases/geske/) | 產品展示與電商 | 作者確認自有 WebGL framework、Strapi/Shopware、旋轉產品檢視與 lazy/adaptive loading；實際轉換效益未測 | A |
| 9 | Dogstudio | [DEPT Pioneer](https://dogstudio.co/cases/dept-pioneer/) | 電影與 Web 的跨媒介語言 | 作者確認 Nuxt.js + 自有 WebGL framework、雙路導覽與即時點雲 Entity（2023 個案）；現行技術 Unknown | A |
| 10 | Dogstudio | [Adobe Taking Shape](https://dogstudio.co/cases/adobe-taking-shape/) | 品牌形變與設計工具敘事 | 官方明列 Web/3D；體驗動作細節待人工瀏覽 | B |
| 11 | Dogstudio | [Meebits](https://dogstudio.co/cases/meebits/) | 數位角色／收藏品展示 | 官方明列 Web/3D；資產規模與 API Unknown | B |
| 12 | Dogstudio | [Jaeger-LeCoultre: Reverso Hybris Mechanica](https://dogstudio.co/cases/jaeger-lecoultre-reverso-hybris-mechanica/) | 奢侈品材質與鏡頭語言 | 官方列 Design/Film Direction/Development；精確 3D 技術 Unknown | B |
| 13 | makemepulse | [Cartier Le Choeur des pierres](https://www.makemepulse.com/case-study/cartier-le-choeur-des-pierres) | 奢侈品珠寶敘事 | 官方定位為沉浸式高級珠寶旅程；聚焦材質／節奏與選購資訊分層 | B |
| 14 | makemepulse | [Ruinart – Digital fresco](https://www.makemepulse.com/case-study/maison-ruinart-digital-fresco) | 數位壁畫互動 | 官方定位為數位壁畫重構；需核對是否真 GPU 筆觸 | B |
| 15 | makemepulse | [Benno’s Light](https://www.makemepulse.com/case-study/bennos-light-claims-conference) | 高情緒密度的歷史見證 | 以敘事清晰、尊重內容優先，不應拿 Glitch 為噱頭 | B |
| 16 | makemepulse | [McDonald’s Rösti Fall](https://www.makemepulse.com/case-study/mcdonalds-france-rosti-fall-loyalty-mobile-game) | 遊戲化行銷 | 官方描述為忠誠度遊戲；需驗證任務→獎勵 UX | B |
| 17 | makemepulse | [Brunello Cucinelli Human-Centred AI](https://www.makemepulse.com/case-study/brunello-cucinelli-ai-shopping-experience) | 意圖驅動電商 | 官方描述 intent-led experience；要區分導購有效性與視覺特效 | B |
| 18 | Hello Monday | [Bang & Olufsen – See Yourself in Sound](https://hellomonday.com/work/bang%26olufsen) | 感官化品牌敘事 | 工作室列為體驗；研究聲音→視覺映射是否可關閉／替代 | B |
| 19 | Hello Monday | [The Web Can Do What?! with Google](https://hellomonday.com/work/the-web-can-do-what) | 瀏覽器能力敘事 | 官方列 Experience；可借鑑單一技術能力→可理解的互動示範 | B |
| 20 | Hello Monday | [Star Atlas](https://hellomonday.com/work/staratlas) | 虛擬世界入門 | 官方列虛擬遊戲宇宙體驗；應審查導航與載入等待 | B |
| 21 | Hello Monday | [Hollow](https://hellomonday.com/work/hollow) | 3D 展覽與側向敘事 | 作者指出側向捲動的明暗敘事、互動圖片及 3D 雕塑 | A |
| 22 | Hello Monday | [MoMA Magritte surreal digital exhibition](https://hellomonday.com/work/moma-magritte) | 文化藝術展示 | 作者描述 Magritte 主題、旁白、配樂、視覺轉場及修復素材；渲染引擎 Unknown | A |
| 23 | Locomotive | [Baillat Studio](https://locomotive.ca/en/work/baillat-studio) | 黑白編輯式字體設計 | 官方說明粗體排版、極簡導覽、模組化系統；低特效也有高質感 | A |
| 24 | Locomotive | [Elektra Virtual Museum](https://locomotive.ca/en/work/elektra-virtual-museum) | 文化展覽、品牌容器 | 官方區分可持續更新的網站與獨立虛擬體驗；內容與引擎分離 | A |
| 25 | Locomotive | [Zap Energy](https://locomotive.ca/en/work/zap) | 複雜技術品牌的資訊架構 | 官方強調 IA、內容策略與動畫微互動結合，不是 GPU 優先 | A |
| 26 | Locomotive | [Webisoft](https://locomotive.ca/en/work/webisoft) | 未來科技美術方向 | 官方描述流暢動態與未來感導航；具體渲染技術 Unknown | A |
| 27 | Locomotive | [FinalFinal](https://locomotive.ca/en/work/finalfinal) | 產品故事與互動示範 | 工作室強調 sound/motion/storytelling 與平台實際工作流程一致 | A |
| 28 | Locomotive | [Truck'n Roll](https://locomotive.ca/en/work/truck-n-roll) | 真實照片與動態品牌 | 官方描述客製攝影，服務商業開發與招聘；內容可信優先 | A |

### 官方個案頁補證（2026-11-02）

以下只列**工作室自己明確公開的行為或技術**。括號內的工程建議屬研究推論，不代表作者使用同樣的實作，也未做網站實機性能測試：

- **DEPT Pioneer**： [官方個案](https://dogstudio.co/cases/dept-pioneer/) 說明 2023 年版本以 Nuxt.js + 自有 WebGL framework、點雲 Entity 與兩條 UX 導覽路徑呈現；使用者可跳過 AI 問答直接閱讀內容。**建議推論：**沉浸式引導不應阻擋快速進入內容。
- **Virgin Galactic**： [官方個案](https://dogstudio.co/cases/virgin-galactic/) 明述 AstroGL、多 WebGL 子場景、相機位置觸發的環境貼圖切換、鏡頭與雙向 pin/clipping swipe。**建議推論：**高成本即時反射應先比較靜態／預算內替代方案；未取得真實 FPS。
- **Geske**： [官方個案](https://dogstudio.co/cases/geske/) 明述 Strapi、Shopware、自有前端／WebGL 框架，及減面、壓縮、懶載入與 adaptive loading。**建議推論：**3D 產品視圖應與商品資訊及購買工作流程整合；未取得轉換率數據。
- **MoMA Magritte**： [官方個案](https://hellomonday.com/work/moma-magritte) 指出 René Magritte 展覽使用旁白、配樂、超現實視覺轉場，以及 X-ray／紅外線／修復影像支援內容探索。**建議推論：**效果須服務藝術知識而不是強迫跳過內容；未確認其使用何種 WebGL/Shader 架構。

單一作品頁只提高「來源定位精確度」，**不自動提升證據等級**；本章僅對有作者技術或互動描述的案例升至 A。Resn 只有獎項來源的作品維持 C，其他官方名錄案例仍維持 B。

## 五個深度拆解

### 1. Active Theory — Paper Planes（**作者技術已確認**）
- **品牌／概念：**「跨螢幕送出一架紙飛機」是可用一句話解釋的主題，手勢不是表演而是投遞行為。折、丟、接、展開、蓋章形成閉環；地球 flight path 是延遲回饋。
- **空間鏡頭：**低多邊形地球作為一致的空間參考；多架飛機透過 instanced buffer geometry 並在 shader 中調整姿態。不是一架飛機就一個 draw call。
- **工程：**作者公開 WebGL、GLSL、morph targets、GPU instancing、CPU + Web Workers 的 flocking。作者**曾比較** GPGPU 與 Workers，最終選 Workers；不要泛稱「粒子必須 GPU Compute」。
- **跨端：**2016 案例說明大型投影與手機共用系統，但調小飛機數與執行緒；**這不是 2026 手機效能驗收**。
- **可複用：**互動流程先從明確的動作出發；渲染層只負責高密度視覺，模擬可以由 Worker 承擔。
- 來源：[Google Experiments](https://experiments.withgoogle.com/paper-planes)／[Android Developers 的作者訪談](https://android-developers.googleblog.com/2016/09/extending-web-technology-with-android.html)／[Active Theory 技術文章](https://medium.com/active-theory/paper-planes-6b0008c56c17)。

### 2. Active Theory — Portfolio
- **使用者任務：**先找作品或聯絡工作室；導覽只服務這兩個行為。即使背景有繁複生成圖形，最上層資訊架構仍低複雜度。
- **動態：**工作室訪談明言導航膠囊與捲動速度反應、AI 導覽作品及多人共享的光帶互動；WebGL + state-based JS 架構為作者自述。
- **工程取捨：**速度是物理感的驅動參數，但導覽不應被 velocity 造成不可預測的位移；需加 reduced-motion、鍵盤、固定目標。
- **流程啟示：**「一個強 Hero + 兩個清晰入口 + 次要自由探索」，不是每個元件都做磁吸。
- 來源：[Communication Arts 作者問答](https://www.commarts.com/webpicks/active-theory-2)。

### 3. Hello Monday — Hollow
- **美術：**明暗從黑到白的側向敘事、光影與實體裝置呼應，使 3D 成為知識入口，不是裝飾。
- **UX 風險：**水平捲動容易失去位置感；需章節標記、方向回饋、可跳過、鍵盤／觸控對應，不能僅依賴滑鼠滾輪劫持。
- **資產層：**照片 → 3D 展覽 → 樹種知識，要求相對應的圖片品質與語義文字備援。
- 來源：[Hello Monday 官方 Case](https://hellomonday.com/work/hollow)。

### 4. Locomotive — Baillat Studio／Zap Energy（作為兩個不同風格驗證）
- **Baillat：**黑白、粗體文字、極少導覽、品牌檔案模組化。證明「電影感」不等於 Bloom 和粒子；字體節奏、裁切、段落比例也能構成強烈畫面。
- **Zap Energy：**技術難懂時先做 IA、內容結構與清楚的視覺比喻，再做微互動；科技網站不能只放假儀表板和發光線條。
- **推導：**企業網站與沉浸站共用同一 Design System，但視覺戲劇性只作用於關鍵敘事段。
- 來源：[Baillat](https://locomotive.ca/en/work/baillat-studio)／[Zap](https://locomotive.ca/en/work/zap)。

### 5. Dogstudio／makemepulse 奢侈品與展演作品
- **確定的分類：**Dogstudio 官方將 Virgin Galactic、Geske、DEPT Pioneer 列為 Web／3D 類；makemepulse 官方展示 Cartier、Ruinart 等體驗。
- **設計研究建議：**「產品材質真實性」應由 PBR 與資產攝影驗證；「看起來像玻璃」不足以證明使用 ray tracing。開場的情緒節奏與結尾 CTA 必須成完整敘事。
- **未知事項：**沒有觀測 network waterfall、shader、frame trace，故 shader 類型、3D 引擎、手機 FPS、是否使用 ray marching 均標 Unknown。
- 來源：[Dogstudio](https://dogstudio.co/cases/)／[makemepulse](https://www.makemepulse.com/case-studies)。

## 可重複使用的「非 AI 模板感」設計語法
1. **概念先於效果：**一個可用 1 句話解釋的體驗比 20 個技巧堆疊更有辨識度。
2. **主次鏡頭：**每屏只有 1 個視覺主角；標題、主 CTA 和敘事圖像建立讀取順序。次要資料以低對比但可讀的資訊帶呈現。
3. **一套空間規則：**光源方向、反射粗糙度、投影距離、顆粒密度、視差層級要一致；禁止把不相容的玻璃風和黏土風拼在一起。
4. **字體是畫面：**中文字形與英數搭配、行高／字重／字距、斷行節奏。建立 editorial hero、dense technical、immersive caption 三種層級而非萬用圓角卡。
5. **動畫服從語義：**回饋 < 導覽 < 敘事高潮；長轉場要能跳過，操作觸發效果應立即確認命令已接受。
6. **動態是受控節奏：**統一 easing／delay／視差幅度；單次互動不超過一個主要視覺事件。
7. **手機重排不是縮小：**把長鏡頭拆章節，保留有意義的貼近／遠離或觸控角度，刪除背景高頻粒子。
8. **原生功能永遠可用：**DOM 主導航、可選文字、常規表單、清楚 focus、跳過動畫／3D 備援。
9. **反例 Gate：**在無 3D、無動畫、純灰階時，資訊仍清楚、品牌仍能識別；否則重做設計而非加特效。
10. **檢核法：**用 5 秒首屏品牌回憶、3 次 click 內完成主任務、手機單手操作、鍵盤讀序、降低動態模式、低網速首屏測試驗收；這些是**建議測試設計，不是已取得的使用者測試結果**。

## 待查事項
- 所有案例未跑 2026 實機瀏覽器瀑布圖與性能 trace；案例表只描述**來源可確認內容**與待驗證研究重點。
- Resn 網站在文字擷取環境只返回圖片／空白；採用獎項索引，**不可把 Resn 各作品技術寫成已查證**。
- 尚無真正的 25 個作品逐頁完整 UX walkthrough。若用於商業創作，應在 PoC 階段挑 5 個案例再做錄影、實際鍵盤與觸控檢驗。


## 第二輪：28 件作品逐案「設計主張 → 工程翻譯 → 待驗證」審核

> **2026-11-02 增補：** 本表不是逐站 live browser 實測。**證據欄**描述作者／獎項目錄能支持的內容；**工程轉譯**是本研究原創實作建議；**Unknown** 欄表示沒有捕獲到的裝置行為、材質、shader 或第三方 runtime。出品方有作品但無底層實作資訊時，明確不推斷 framework。

| # | 官方作品可證實的任務／定位 | 工程與 UX 可轉用原則（**建議**） | 需補的證據 |
|---:|---|---|---|
| 1 | Paper Planes：跨螢幕摺紙、投擲、接取；WebGL | 以紙飛機動作代替導覽頁堆積；視覺物件用 instancing，互動回饋獨立於粒子 | 2026 網站可用性、行動版本與即時後端 |
| 2 | Active Theory Portfolio：作品與聯絡的雙入口、AI 探索、分享光帶 | 先兩個明確 CTA，再把光帶與 AI 當可略過的探索；導覽速度回饋不應改 hit target | 手機鍵盤導覽、Network waterfall、LCP 真實資料 |
| 3 | Zentry：產品生態系的中心入口，跨玩家／投資者 | 首屏按受眾分流，世界觀是跨產品索引，不是沒有出口的沉浸迷宮 | 導覽 click path、SSR / 渲染 stack Unknown |
| 4 | Getty Tracing Art：藝術學習／展示作品名由獎項索引確認 | 歷史材料與自由探索分層；每個熱點有可閱讀替代描述 | 主互動流程、GPU 技術、行動降級 Unknown |
| 5 | Getty Sculpting Harmony：音樂廳的檔案材料、空拍、互動 3D、音樂 | 3D 模型當知識索引，時間軸與空間探索可切換；聲音默認可控 | 音效開關、3D 互動路徑與效能 Unknown |
| 6 | Breakthrough Energy：2026 大型網站獎項目錄確認存在 | 複雜能源資訊優先 IA，動畫只引導下一個概念 | 未找到足夠作者工程說明，stack Unknown |
| 7 | Virgin Galactic：商業太空旅遊 3D 沉浸敘事 | 大景別鏡頭→短說明→內容段落→轉換 CTA；雙向剪裁轉場須保留返回路徑 | 真機 3D 參數、景別時長和是否原生 scroll |
| 8 | Geske：WebGL 商品視圖、Shopware/Strapi、壓縮與 lazy loading | 商品材質放大檢視接真實購物 CTA；中文/多語字體不能壓在 shader bitmap | 版本、Bundle bytes、KTX2/meshopt 是否使用（作者未指明） |
| 9 | DEPT Pioneer：工作室標記 Web/3D/Film/動畫 | 以影像導演的定鏡/推鏡控制節奏，不用假裝所有鏡頭即時渲染 | 真正 3D 與影片占比 Unknown |
| 10 | Adobe Taking Shape：工作室標記 Web/3D | 將品牌 shape／typography 的規則映射進形變，不為形變犧牲文案可選性 | 實際 pipeline / 客戶端引擎 Unknown |
| 11 | Meebits：工作室標記 Web/3D | 大量數位角色優先 LOD、選中角色高品質、列表語意 UI | 是否採用 instancing、mesh compression Unknown |
| 12 | Reverso Hybris Mechanica：腕錶創意展示的影像導演與開發 | 高精材質/微距鏡頭/產品數據分工；不把影片標成 WebGL PBR | 是否存在即時 3D Unknown |
| 13 | Cartier Le Choeur des pierres：高級珠寶敘事作品 | 一致的金屬/寶石光照、留白、低速鏡頭；優先資產真實性 | 實際光照模型、相容性 Unknown |
| 14 | Ruinart Digital Fresco：實體壁畫→App-free AR／網頁，20+ 熱點及提示 | 不同交互 modality 對應相同資訊樹；深層熱點要有引導入口 | 網頁與 AR 各自 render path、FPS Unknown |
| 15 | Benno’s Light：作品集列歷史敘事 | 歷史創傷內容以可讀、可信與尊重為主，避免無關 Glitch | 完整導覽、GPU 技術 Unknown |
| 16 | McDonald’s Rösti Fall：品牌忠誠度遊戲 | 任務→回饋→獎勵的 loop 比粒子密度重要；失敗重試須可理解 | 是否 WebGL/Canvas、轉換率 Unknown |
| 17 | Brunello Cucinelli：意圖導向品牌導購體驗 | 產品需求查找與品牌探索分層，AI 不得隱藏商品必要資訊 | 推薦品質、實際購物完成率 Unknown |
| 18 | Bang & Olufsen：See Yourself in Sound 體驗 | 聲波材質轉成個人化視覺時仍有靜音、字幕、文字提示 | 即時音訊處理／渲染 stack Unknown |
| 19 | The Web Can Do What?!：Google 網頁能力展示 | 一次只傳達一個 API 能力，減少多效果同屏認知負擔 | 各子 demo 的 browser support 與原始碼 Unknown |
| 20 | Star Atlas：虛擬世界遊戲體驗 | 善用分段載入、顯示「體驗中」與明顯返回；不能無限預載 | 3D streaming 與低端裝置路徑 Unknown |
| 21 | Hollow：側向夜→晝影像、互動照片、3D 木雕 | 用水平位置表達時間主題；手勢／鍵盤提供等價章節跳轉 | 圖片載入體積、FPS Unknown |
| 22 | MoMA surreal exhibition：官方列展覽作品 | 透過資訊分層／章節導航保留策展邏輯，而不是自由鏡頭到迷路 | 現存網址與 engine Unknown |
| 23 | Baillat Studio：黑白／粗體的編輯式設計 | 用字階、模組與留白形成識別，不需要 GPU 背景 | 視覺對比實測、真實 keyboard focus Unknown |
| 24 | Elektra Virtual Museum：網站與 3D 虛擬展示 | 讓一般內容索引與虛擬漫遊共享同一 item ID / URL；資料與渲染分離 | 3D 物件結構、虛擬空間操作 Unknown |
| 25 | Zap Energy：核融合品牌科技內容 | 科技名詞先建立前後概念的對應，再引入 scroll scene | 真實用戶理解測試與 JS 成本 Unknown |
| 26 | Webisoft：軟體及 AI 品牌官網 | 以技術實證圖/案例替代抽象「未來霓虹」；產品頁保持文字可讀 | 具體動畫實作 Unknown |
| 27 | FinalFinal：音樂協作平台 | 把文件／版本／回饋的時間線當資訊主幹，品牌視覺只在主入口加強 | 操作完成率、可及性與前端框架 Unknown |
| 28 | Truck'n Roll：演出物流品牌、原創拍攝與編輯內容 | 讓攝影、排版、CTA 解釋服務價值；不需要 3D | 內容/圖片 load budget 未知 |

### 第二輪新增直接可核對的案例材料

- [Resn / Zentry 獎項作品描述](https://bestawards.co.nz/digital/large-scale-websites/resn/zentry/)：明確為跨多產品、玩家與投資人定位的平台。原表的「遊戲品牌互動」描述過於粗糙，以上補正。
- [Getty Sculpting Harmony（Purple Pin 評審與作品說明）](https://designersinstitute.nz/case-study/sculpting-harmony/)：實際有檔案文獻、空拍、3D renderings 與交響樂的文化敘事；**不可由此推出引擎名稱**。
- [Dogstudio Geske 完整作者文章](https://dogstudio.co/cases/geske/)：明確說明專用 WebGL 前端＋Strapi＋Shopware、模型減面、壓縮與 lazy/adaptive loading；不是作者證實採用了 Draco/KTX2。
- [Dogstudio Virgin Galactic](https://dogstudio.co/cases/virgin-galactic/)：有大型 3D 場景、無重力感動態與段落鏡頭節奏。
- [makemepulse Ruinart](https://www.makemepulse.com/case-study/maison-ruinart-digital-fresco)：確有 20+ 互動點、網頁/AR 兩路與提示頁，屬 UX 支援複雜互動的證據。
- [Hello Monday Hollow](https://hellomonday.com/work/hollow)、[Hello Monday Work](https://hellomonday.com/work)：Hollow 設計細節直接由作者說明；其餘作品尚多屬官方名錄。
- [Locomotive Work](https://locomotive.ca/en/work)：Baillat、Elektra、Zap、Webisoft、FinalFinal、Truck'n Roll 的存在與類別已核對。

### 作品研究提升到「真正能複用」的驗證方式
1. **同題目 UX 對照**：品牌官網 vs 展演網站各挑 2 案；同時做不載入 GPU 的首屏截圖，排除只是靠特效造成高級感的錯覺。
2. **鏡頭腳本**：記錄每個 Hero 的 shot ID、起點/終點、camera path、與文案同步點、skip/end state；不是單一無限動畫。
3. **投入報酬**：對每個效果記錄它支持的任務（看懂產品／找到內容／完成導購／傳達品牌），沒有任務只標 decorational。
4. **效能／可及性**：需另用真實瀏覽器、錄影或 trace 取得鍵盤、滾動、網路、FPS；本輪未持有實際逐站操作證據，不能把上述 28 筆轉譯當作驗證通過。
