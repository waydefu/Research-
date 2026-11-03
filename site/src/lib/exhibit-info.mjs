import {TOPIC_DESCRIPTORS} from './research-taxonomy.mjs';
// Reader-first exhibit descriptors. Source folder names remain unchanged for stable URLs.
// Art is locally authored, purpose-specific SVG, never the shared Sanctum background.
const IMG='/Research-/v3/research-exhibits/';
export const EXHIBITS={
  '2026-10-retrospective':{name:'十月跨領域技術回顧',what:'整理 AI 代理、Web 3D、音訊、影片自動化與工程治理的研究摘要。',use:'適合從不同技術領域回顧研究結果，並辨識尚待查證的候選工具。',image:IMG+'books.svg'},
  '2026-11-information-security':{name:'資訊安全與保護資料',what:'認識網路攻擊、帳號權限、加密與漏洞，理解資料怎樣避免被偷走或誤用。',use:'適合想保護帳號、網站、公司資料或學習基本資安知識的讀者。',image:IMG+'privacy.svg'},
  '2026-11-local-ai-inference':{name:'讓 AI 在自己的電腦與手機運作',what:'研究本機模型、記憶體與執行速度，理解不用全靠雲端也能運行 AI。',use:'適合想在自己的硬體部署模型，或比較效能與成本的讀者。',image:IMG+'chip.svg'},
  '2026-11-systems-analysis-design':{name:'系統分析與需求設計',what:'從釐清需求、畫出流程到設計資料與畫面，學習如何規劃一個能真正運作的系統。',use:'適合資訊管理課程、產品規劃或想從零設計資訊系統的人。',image:IMG+'analysis.svg'},
  '2026-11-universal-web-engine':{name:'網站、三維場景與互動設計',what:'研究網頁外觀、動畫、3D 場景與載入效能，包含真實網站案例。',use:'適合想製作網站、互動作品或改善使用體驗的人。',image:IMG+'browser.svg'},
  '2026-11-agent-engineering':{name:'人工智慧代理與工具',what:'了解 AI 如何分步使用工具、分析任務、讀寫資料並檢查成果。',use:'從理解一般聊天 AI 到建立能工作的自動化代理。',image:IMG+'robot.svg'},
  '2026-11-agent-repository-operations':{name:'自動化工作與程式協作',what:'介紹如何安排代理、版本控制、測試、交接與工作流程，減少重複操作。',use:'適合多人協作、長期維護專案或希望自動化重複工作的讀者。',image:IMG+'workflow.svg'},
  'governance':{name:'系統安全與品質治理',what:'了解權限、資料來源、稽核與驗收，避免系統出錯或洩漏不該公開的內容。',use:'適合管理專案、驗證 AI 輸出或擬定安全規範。',image:IMG+'vault.svg'},
  'design':{name:'視覺設計與介面規格',what:'從版面、字體、色彩和互動規則出發，製作一致而能操作的介面。',use:'適合把設計方向轉成可以讓工程人員實作的具體規格。',image:IMG+'studio.svg'},
  'RESEARCH-TEMPLATE':{name:'研究方法與寫作範本',what:'學習如何記錄問題、引用來源、區分事實與推測，再寫成容易查找的文章。',use:'適合從零開始整理可靠資料與撰寫可重現研究。',image:IMG+'notes.svg'}
};
export const topicInfo={
  '3D 場景與 Shader':{why:'讓瀏覽器顯示立體物件、水面與光影，理解 Three.js 和 GPU 的角色。',image:IMG+'browser.svg'},
  '動畫與互動':{why:'研究按鈕、捲動與轉場如何回應使用者操作。',image:IMG+'studio.svg'},
  '視覺語言與 UX':{why:'讓使用者看得懂、找得到、操作順手，並讓配色與排版有一致性。',image:IMG+'studio.svg'},
  '網站架構與內容系統':{why:'理解網站由哪些部分組成，文章、頁面與資料怎麼連在一起。',image:IMG+'browser.svg'},
  '網站效能與無障礙':{why:'讓網頁在手機上載入更快，也讓更多人能讀、能操作。',image:IMG+'workflow.svg'},
  '搜尋、索引與 RAG':{why:'把文章整理成能搜尋的索引，找出與問題真正相關的資料。',image:IMG+'servers.svg'},
  'LLM 模型與推論':{why:'認識語言模型如何產生回答，如何選擇模型並評估成本。',image:IMG+'robot.svg'},
  'Agent 工作流程':{why:'讓 AI 依步驟使用工具、完成工作並自行檢查結果。',image:IMG+'robot.svg'},
  'GitHub 與自動化':{why:'用版本控制、測試與自動流程讓團隊更容易修改程式。',image:IMG+'workflow.svg'},
  '安全、權限與稽核':{why:'知道誰可以存取資料，如何查出錯誤和保留可追蹤紀錄。',image:IMG+'vault.svg'},
  '資料庫與資料品質':{why:'整理資料、檢查是否可靠，讓系統能快速讀取和使用。',image:IMG+'servers.svg'},
  '專案治理與規格':{why:'把需求、責任與驗收方式寫清楚，避免專案失去方向。',image:IMG+'notes.svg'},
  '案例與設計參考':{why:'閱讀真正的網站與作品，分清作者實作與我們的推測。',image:IMG+'studio.svg'},
  '跨領域研究':{why:'包含涉及多項技術、仍待進一步人工分類的研究。',image:IMG+'books.svg'}
};
for (const [topic, descriptor] of Object.entries(TOPIC_DESCRIPTORS)) topicInfo[topic] = {why:descriptor.why,image:IMG+descriptor.image};
export const exhibitFor=group=>EXHIBITS[group]||{name:'其他研究領域',what:'收錄尚未完成分類的研究，提供原文與來源。',use:'可透過關鍵字與技術標籤繼續尋找。',image:IMG+'books.svg'};
export const topicFor=topic=>topicInfo[topic]||topicInfo['跨領域研究'];
