# 16｜Research Showcase V2：Active Theory 品質基準、原始來源與設計轉譯

> **文件定位：2026-11-02／研究報告與設計決策，不是已實作功能、真機量測或獲獎保證。**
>
> **需求來源：** Repo Owner 指定 Active Theory 為最低品質參考，並提供三張高密度金色／青藍放射式動畫畫面供**配色和光學語言**參考。**禁止複製**該動畫的角色、標誌、文字、紋樣、鏡頭與構圖。
>
> **工作邊界：** 本輪只研究、定義美術與互動規範，不更改已上線的 Showcase、不部署、不合併。

## 0. 研究問題

不是「能否用 WebGL 做光環」，而是：**如何讓抽象技術研究具備可辨識的藝術風格、可探索的空間邏輯和真正有用的資料互動，同時維持可信來源、閱讀效率與手機可靠性？**

目前第一版 THE OBSERVATORY 已具備 WebGL2 SDF 裝飾性雕塑、研究索引、概念圖、靜態 Pages 與 CSS 降級。它有完整的基本體驗，但缺乏作品主軸與研究資料的因果關係：渲染器主要是背景，資料庫主要是 DOM 清單，兩者沒有構成同一種交互敘事。**這是可直接從 Repo 程式結構核對的設計差距，不等於測得原站品質分數。**

## 1. Active Theory：可證實的做法 vs 可借鑑的原理

| 案例／材料 | 作者或訪談直接支持的事實 | 可用於 Research- 的設計推論 | 不得推斷 |
| --- | --- | --- | --- |
| Active Theory V5／Webby 採訪 | 以品牌地點與重要專案建立多個可轉換的 3D 環境；原型約三個，完成時擴至八個；使用自有 Hydra JS/WebGL framework | **場景轉換必須傳遞不同意義**，不只改光色；Research 可用不同「研究認知狀態」建立空間章節 | 必須做八個場景；原封不動複製 Hydra 或其資產 |
| V5／Communication Arts | 中央大屏幕用以真正展示作品；快速任務用分類導覽，探索者用環境體驗；後端有 CMS | **沉浸路徑與快速索引並存**，不要讓訪客必須看完動畫才能找文件 | 「3D 一定比 DOM 好找資訊」 |
| V6／Communication Arts 共同創辦人採訪 | 自述簡單導航、AI 引導案例、WebGL、偏狀態／函數式的 JS 架構；鼠標／觸控彩色線條會讓同時在線使用者互相看見 | 建立**資料驅動的主場景狀態機**，並確保互動會影響可理解的內容 | Research 需要 AI chat、多使用者 WebSocket、外部後端 |
| V6 同一採訪 | 製作約兩個月，受訪者稱約 80% 時間花在 polish | 視覺節奏、資產、過渡、細節檢查必須有專門驗收項 | 本站也要花相同比例時間；這是通用工程統計 |
| Google I/O Paper Planes／Active Theory 官方作者文章 | 同一核心體驗連接大型螢幕、桌機與手機；GPU instancing；嘗試 GPU 與 Worker flocking 後採 Worker；手機減少同步數量和執行緒 | **以相同互動語義做不同密度的裝置呈現**；根據真測量選 CPU/GPU，不憑技術名字 | 本站必須引入 flocking、Worker 或數千粒子 |
| Experiments Hub／Communication Arts | 個別實驗多用 WebGL／自有框架；有分類 CMS，設計讓實驗自己當主角；避免無理由重複實驗 | 每一個 shader 或轉場都需有**情感／資訊目的**及停用判準 | 沒有 WebGL 的內容不可能達標 |
| Active Theory／Craft Matters 2026-02-12 | 團隊談到 WebGL 應服務敘事、互動、意圖；能用影片或靜態圖更清楚完成任務時就不應強上 WebGL | 採取 **quality of intent > number of effects**；一個有作用的裝置優於十種裝飾粒子 | 因使用 WebGL 就自動高性能或具備獲獎品質 |

**來源和證據等級：**

- [ATv5 × Webby Awards — 作者設計／技術答問](https://www.webbyawards.com/crafted-with-code/active-theory/)（A：作者原始描述）
- [ATv5 × Communication Arts](https://www.commarts.com/webpicks/active-theory-1)（A：採訪轉述作者）
- [ATv6 × Communication Arts](https://www.commarts.com/webpicks/active-theory-2)（A：採訪轉述作者）
- [Paper Planes × Active Theory 官方作者文章](https://medium.com/active-theory/paper-planes-6b0008c56c17)（A：作者原始技術案例）
- [Experiments Hub × Communication Arts](https://www.commarts.com/webpicks/experiments-hub)（A：採訪轉述）
- [Craft Matters by Active Theory／LBB 2026-02-12](https://lbbonline.com/news/Craft-Matters-by-Active-Theory)（B：具名團隊訪談摘要）
- [Active Theory 目前官方站](https://activetheory.net/)（官方站 Web Reader 目前只返回「Please enable javascript」，**尚未實際以桌面／手機操作整站，勿標為已 Walkthrough**）。

### 1.1 Benchmark 精神，不是視覺複製

1. 有**一句能被體驗感知的核心命題**，而非五行行銷形容詞。
2. 主角、空間、文字和資料彼此有**因果反應**；訪客做的事會改變情境。
3. 有**資訊上的快路**：不進動畫，照樣 1–2 次操作到達研究內容。
4. 場景前後有**導演節奏**：安靜 → 問題 → 聚焦 → 揭露 → 可繼續探索。
5. 動畫的「停止」也須有完整構圖，並保證可讀性／操作性。
6. 真正完成後仍需對材質、光照、字距、互動手感、跨裝置和退出路徑反覆打磨。

## 2. 使用者三張動畫截圖：觀察而非複製

三張圖是**使用者提供的視覺參照**，不是 Active Theory 的技術案例，也不是 Repo 的再授權素材。以下只抽取色彩／構圖語言，不在 Repo 保存原圖或把原動畫標誌用於品牌。

| 畫面 | 可直接觀察到的色彩與構圖 | 可轉譯的抽象設計語言 |
| --- | --- | --- |
| A：菱形中心／金色華麗裝飾 | 複雜金色輪廓、細密放射線、深色電路式背景；白色／暖金集中在中央 | **權威的觀測核心**：線條密度由中心證據強度控制，中心裝置需有獨創輪廓 |
| B：金色圓環／中央爆發 | 多層圓形／環形文字、徑向軌跡、亮金中心；暗背景有冷色對比 | **驗證的聚焦過程**：稀疏資料 → 對齊的幾何 → 結果顯示，不採用可閃爍造成不適的快速爆閃 |
| C：青藍白光／太空網格 | 青藍色弧線、向中心收斂的空間向量、白光核心和縱深 | **未知的搜索空間**：視覺重心從暖金切至冷青，代表「問題仍未釐清」而非成功完成 |

### 2.1 圖片取樣與人為美術決策

以使用者提供的低解析度畫面做顏色聚類抽樣，可觀察到暖金／銅褐／海藍／青綠為重要聚類；例如 A 的一組暖金聚類約 RGB(183,119,24)，B 的一組金色聚類約 RGB(188,135,44)，C 的青色聚類約 RGB(45,162,170)。這些為**抽樣近似值**，受字幕、編碼與畫面混色影響，**不是原作色票，也不是網站指定的成品色碼**。

因此不以自動 K-means 色塊直接取代 Art Direction；成品要重新設計材質、明暗比例與無障礙色彩 token。候選色票見 [V2-ART-DIRECTION.md](../../showcase/design/V2-ART-DIRECTION.md)。

## 3. 對第一版的差距分析

| 分類 | V1 現況（程式／內容可核對） | V2 必須有的改變 |
| --- | --- | --- |
| 主視覺 | 固定 SDF 金屬環 + DOM 文字，視覺與資料庫內容關聯有限 | 單一、原創的 **Evidence Engine／光譜觀測核心**，隨 research domain / evidence state 有可理解的幾何與色彩變化 |
| 敘事 | Hero → premise → concept map → explorer → protocol | 具有「未知 → 偵測 → 比對 → 驗證 → 開啟原文」的空間連續性，**不可妨礙快速跳到 Explorer** |
| 美術 | 黑、暗綠、橘與編輯式 typography | 使用者指定暖金／青藍／深空色；保持極少面積的白光峰值、精密圓環造型、深色高對比正文 |
| 互動 | 星圖選分類、關鍵字搜尋，3D 僅回應 pointer | 點選研究節點 → 觀測核心重組 → 對應內容同步；DOM 與場景使用**同一狀態** |
| 結果可信度 | Markdown 建置索引、GitHub 檔案連結 | 實際來源／SHA、研究狀態與 Unknown 顯示清楚；不能把視覺強度當作科學信心分數 |
| Mobile | 響應式 DOM + 低階 CSS poster | 有自己安排過的構圖、觸控目標和內容節奏；不可只是縮小桌面 3D |
| 規格完整性 | 有 CI／基本 shader lifecycle regression | 增加藝術品質、操控與真機特效的獨立 QA；CI PASS 不等於 Active Theory 等級 |

**不要在 V2 宣稱「證據越多，金色越亮」是客觀量化。** 只有 Repo 中的可驗證 evidence-status metadata 有定義時，才建立資料和視覺的正式映射；否則是清楚標示的敘事示意。

## 4. 候選技術與選擇理由

| 元件 | 建議起點（提案，非決定完成） | 原因 | 風險／排除 |
| --- | --- | --- | --- |
| Content / SEO / Search | 保留原生 HTML + build-time Markdown index | Google Pages 靜態 hosting、零資料服務、原文直達 | 不把標題和資料變 3D texture |
| Hero | WebGL2 1 scene + GLSL shader/material + DOM text | 可在一個 GPU 空間實現層次、光色、物件反應 | 手機 overdraw；需要畫質 tier 和 context-loss |
| Morph／核心結構 | 自訂 SDF 或少量 mesh（PoC A/B 決定） | SDF 可程序生成；mesh 可取得更準確材質與法線 | ray marching 多步 fill-rate vs mesh 資產成本，**無測試不選最終版** |
| 連結／研究圖 | DOM/SVG 首選，視覺層可由 WebGL 額外增強 | 鍵盤、搜尋與資料一致性 | SVG 交互不可被 Canvas 壟斷 |
| 光暈 | 一個有界小區域 glow pass／合成式光暈（試作比對） | 只在敘事峰值使用，不需全屏 Bloom | 全屏多 pass 會增加 fill-rate |
| Camera / Motion | 一個 timeline/state director；CSS/WAAPI；必要時才用 GSAP | 避免主畫面與 DOM 動畫競速 | GSAP 必須查當期 license；現階段不新增依賴 |
| WebGPU | **非 V2 基本前提**；只有 PoC 證明增益才開選型 PR | MDN 仍標記有限支援 | 不得聲稱 WGSL / GLSL 可無痛互換 |
| 音效 | 預設無音效；可選擇性之後提案 | 避免自動播放與增加負擔 | 使用者沒有授權再製作受保護音樂或素材 |

## 5. 成品品質基準 — 評分方法（尚未評分）

這不是把主觀「世界級」寫成已取得的證書。完成 V2 後由不同角色評核：

| 維度 | 檢查重點 | 不合格例 |
| --- | --- | --- |
| 原創美術 | 核心輪廓、材質、字體、燈光、版面有一致個性 | 可直接認出在抄動漫／工作室作品 |
| 互動因果 | 使用者操作有可見且可理解的系統回饋 | 背景隨便跳色；查詢結果與主場景脫節 |
| 導演節奏 | 動作有起承轉合、停格有設計 | 全站每個元素都不斷脈動 |
| 內容價值 | 從視覺進入可查證的原始研究 | 找文獻必須繞 3D 場景 |
| 細節完整 | focus、hover、touch、loading、error、fallback 一致 | 只有桌面正常，手機被擋住 |
| 圖形工程 | geometry/shader 正確、能釋放、context loss 復原 | RAF 泄漏或超額 overdraw |
| 性能 | 來源明確的測量，低階可降級 | 把裝置型號或假 FPS 當驗收 |
| 無障礙 | WCAG 2.2 AA 設計/實測、reduced motion、鍵盤 | 光暈壓過文字；SVG 唯一可操作入口 |

**門檻設計建議（非成果）**：每項以 1–5 分人工記錄並附證據；8 項都至少 4/5 且沒有功能 P0，才提交「接近指定參考品質」的人工審核。**不能據此宣稱與 Active Theory 真正同等、得獎或通過外部評審。**

## 6. 瀏覽器、安全與性能不可讓步

- 主要 HTML 標題不能等待 shader compilation 才出現；LCP 依實際 p75 驗證，官方良好閾值 ≤2.5s；INP ≤200ms；CLS ≤0.1。來源：[Google Web Vitals](https://web.dev/articles/vitals)。
- 需完整 reduced motion 與避免閃爍、偏頭暈的替代；WCAG **2.3.3 Animation from Interactions 是 AAA**，不應錯稱 AA 必須項；V2 可把它當額外自訂目標。來源：[W3C](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)、[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)。
- WebGL context 恢復時舊 resource 已失效；重新建 texture/buffer/program 或重建 renderer。來源：[MDN restored](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event)。
- Chrome paint flashing／layout shift overlay 可用於找多餘重繪；**不是 GPU FPS 報告**。來源：[Chrome DevTools](https://developer.chrome.com/docs/devtools/rendering/performance)。
- WebGPU feature detection 只能代表 API 能力，不能當作快或支援所有 shader 的證據。來源：[MDN WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)。
- 不得複製第三方動畫影片、受版權保護角色、文字裝置、Active Theory 的 Logo、素材或專有 Hydra 程式碼。

## 7. 後續交付門檻

依序：1) 美術 direction 與 storyboard 審查；2) 靜態視覺仍成立；3) Hero 兩種 renderer PoC A/B；4) 數據映射 schema；5) 手機與桌機互動；6) 真機效能；7) accessibility；8) 交互細節打磨；9) owner 批准合併與發布。

具體規格：
- [V2 藝術指導與故事板](../../showcase/design/V2-ART-DIRECTION.md)
- [V2 圖形架構／測試與決策閘門](../../showcase/design/V2-ENGINEERING-ACCEPTANCE.md)

**結論：Active Theory 的最低標準不是某一種特效，而是「概念與工程共同構成的完整作品」。我們有明確的 V1→V2 方向；截至此文沒有完成實作，也沒有做跨端真機 benchmark。**
