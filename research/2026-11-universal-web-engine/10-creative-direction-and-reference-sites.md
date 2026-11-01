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
| 7 | Dogstudio | [Virgin Galactic](https://dogstudio.co/cases/) | 高級產品／旅程展示 | 工作室標記 Strategy、Design、Web、3D；可研究敘事→CTA 路徑 | B |
| 8 | Dogstudio | [Geske](https://dogstudio.co/cases/) | 產品展示與電商 | 官方標記 3D/eCommerce；應驗證 3D 是否協助理解產品 | B |
| 9 | Dogstudio | [DEPT Pioneer](https://dogstudio.co/cases/) | 電影與 Web 的跨媒介語言 | 工作室明列 Film Direction、3D Animation；技術實作 Unknown | B |
| 10 | Dogstudio | [Adobe Taking Shape](https://dogstudio.co/cases/) | 品牌形變與設計工具敘事 | 官方明列 Web/3D；體驗動作細節待人工瀏覽 | B |
| 11 | Dogstudio | [Meebits](https://dogstudio.co/cases/) | 數位角色／收藏品展示 | 官方明列 Web/3D；資產規模與 API Unknown | B |
| 12 | Dogstudio | [Jaeger-LeCoultre: Reverso Hybris Mechanica](https://dogstudio.co/cases/) | 奢侈品材質與鏡頭語言 | 官方列 Design/Film Direction/Development；精確 3D 技術 Unknown | B |
| 13 | makemepulse | [Cartier Le Choeur des pierres](https://www.makemepulse.com/case-studies) | 奢侈品珠寶敘事 | 官方定位為沉浸式高級珠寶旅程；聚焦材質／節奏與選購資訊分層 | B |
| 14 | makemepulse | [Ruinart – Digital fresco](https://www.makemepulse.com/case-studies) | 數位壁畫互動 | 官方定位為數位壁畫重構；需核對是否真 GPU 筆觸 | B |
| 15 | makemepulse | [Benno’s Light](https://www.makemepulse.com/case-studies) | 高情緒密度的歷史見證 | 以敘事清晰、尊重內容優先，不應拿 Glitch 為噱頭 | B |
| 16 | makemepulse | [McDonald’s Rösti Fall](https://www.makemepulse.com/case-studies) | 遊戲化行銷 | 官方描述為忠誠度遊戲；需驗證任務→獎勵 UX | B |
| 17 | makemepulse | [Brunello Cucinelli Human-Centred AI](https://www.makemepulse.com/case-studies) | 意圖驅動電商 | 官方描述 intent-led experience；要區分導購有效性與視覺特效 | B |
| 18 | Hello Monday | [Bang & Olufsen – See Yourself in Sound](https://hellomonday.com/work) | 感官化品牌敘事 | 工作室列為體驗；研究聲音→視覺映射是否可關閉／替代 | B |
| 19 | Hello Monday | [The Web Can Do What?! with Google](https://hellomonday.com/work) | 瀏覽器能力敘事 | 官方列 Experience；可借鑑單一技術能力→可理解的互動示範 | B |
| 20 | Hello Monday | [Star Atlas](https://hellomonday.com/work) | 虛擬世界入門 | 官方列虛擬遊戲宇宙體驗；應審查導航與載入等待 | B |
| 21 | Hello Monday | [Hollow](https://hellomonday.com/work/hollow) | 3D 展覽與側向敘事 | 作者指出側向捲動的明暗敘事、互動圖片及 3D 雕塑 | A |
| 22 | Hello Monday | [MoMA surreal digital exhibition](https://hellomonday.com/work) | 文化藝術展示 | 官方作品目錄證明存在；渲染引擎 Unknown | B |
| 23 | Locomotive | [Baillat Studio](https://locomotive.ca/en/work/baillat-studio) | 黑白編輯式字體設計 | 官方說明粗體排版、極簡導覽、模組化系統；低特效也有高質感 | A |
| 24 | Locomotive | [Elektra Virtual Museum](https://locomotive.ca/en/work/elektra-virtual-museum) | 文化展覽、品牌容器 | 官方區分可持續更新的網站與獨立虛擬體驗；內容與引擎分離 | A |
| 25 | Locomotive | [Zap Energy](https://locomotive.ca/en/work/zap) | 複雜技術品牌的資訊架構 | 官方強調 IA、內容策略與動畫微互動結合，不是 GPU 優先 | A |
| 26 | Locomotive | [Webisoft](https://locomotive.ca/en/work/webisoft) | 未來科技美術方向 | 官方描述流暢動態與未來感導航；具體渲染技術 Unknown | A |
| 27 | Locomotive | [FinalFinal](https://locomotive.ca/en/work/finalfinal) | 產品故事與互動示範 | 工作室強調 sound/motion/storytelling 與平台實際工作流程一致 | A |
| 28 | Locomotive | [Truck'n Roll](https://locomotive.ca/en/work/truck-n-roll) | 真實照片與動態品牌 | 官方描述客製攝影，服務商業開發與招聘；內容可信優先 | A |

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
