// Public technical article bodies for a reviewed four-document pilot.
// Editorial descriptions are source-bounded, not independent fact-checking.
// Original research Markdown remains the sole historical evidence in research/.
export const PUBLIC_ARTICLES=Object.freeze({
  "research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap.md": {
    "sections": [
      {
        "heading": "內容網站為什麼選靜態輸出",
        "explanation": "以 Markdown 保存正文，再於建置時使用 Astro Content Collections 轉成可直接閱讀的 HTML，是內容量大、更新可預期的網站選項。文章有獨立網址，無 JavaScript 時也應保有基本閱讀能力。",
        "limit": "若需要大量即時寫入、會員或個人化內容，應重新評估伺服器功能與渲染策略。"
      },
      {
        "heading": "全文搜尋與資料來源怎麼串接",
        "explanation": "建置完成後可交由 Pagefind 建立靜態全文索引；分類、標籤及原文來源應保留一致識別，避免搜尋只找到過期標題。站內引用轉為可開啟的文章網址，官方外部來源則保留連結。",
        "limit": "來源提交紀錄與查證時間各有用途，不能把歷史文章的日期當成當前技術的有效保證。"
      },
      {
        "heading": "3D 視覺不應阻擋閱讀",
        "explanation": "Three.js 與動畫可以加強畫面敘事，但文字、搜尋、章節目錄與按鈕仍應使用可存取的 HTML。視覺場景是漸進增強功能，而不是內容網站正常運作的前提。",
        "limit": "網頁關閉 GPU、停用動態或關閉 JavaScript 時，主要閱讀路徑仍需保留。"
      },
      {
        "heading": "如何驗收內容架構",
        "explanation": "先檢查文件數量、路由、內部連結、來源版本與全文搜尋，再使用瀏覽器測試鍵盤、手機及無 JavaScript 體驗。CI 可以防止已知錯誤回歸，但不能代替真機測速與人工可讀性檢查。",
        "limit": "此處說明的是可參考的工程方法，不宣稱任何跨頁 3D 世界或效能指標已完成驗收。"
      }
    ]
  },
  "research/2026-11-universal-web-engine/20-v3-chatgpt-5-6-execution-brief.md": {
    "sections": [
      {
        "heading": "程式代理的任務需要明確合約",
        "explanation": "有效的開發任務應清楚列出 Goal、Context、Constraints 與 Done when：要解決的問題、需要閱讀的資料、不可越過的權限，以及如何確認完成。模糊要求容易造成超出需求的修改。",
        "limit": "代理看到文件不等於取得授權；修改管理設定、部署或合併仍需適當批准。"
      },
      {
        "heading": "把長期規範與單次需求分開",
        "explanation": "AGENTS.md 適合保存穩定的程式約定、權限及測試要求，單次任務則只需提供當次目標與明確驗收條件。開始前先核對現行程式和最新 CI，避免歷史交接書覆蓋實際狀態。",
        "limit": "減少重複上下文有助於閱讀效率，但節省幅度必須在相同任務與環境下測試。"
      },
      {
        "heading": "用獨立 PR 保存修改與證據",
        "explanation": "代理應在隔離分支完成小範圍改動，執行測試後提交 PR，再由審查者確認權限、風險及回退方案。構建成功、功能可用與美術品質屬不同的驗收面向。",
        "limit": "不把綠燈解讀成外部服務、安全或實機效能皆已全面驗證。"
      },
      {
        "heading": "模型設定需要隨版本重新驗證",
        "explanation": "代理能力、子代理操作及提示詞習慣會隨模型與工具版本變動，舊文中的型號與節省成本數字只屬當時的研究線索。比較時要固定測試任務、品質標準與計費方式。",
        "limit": "不能把特定歷史版本的使用建議當成目前模型的正式能力保證。"
      }
    ]
  },
  "research/2026-11-universal-web-engine/21-p0-acceptance-and-p1-handoff.md": {
    "sections": [
      {
        "heading": "驗收不是單一的通過標記",
        "explanation": "靜態內容網站需要分別核對資料完整性、站內連結、搜尋、可讀性、無障礙、裝置相容性與部署狀態。各項證據的時間、程式版本與檢查範圍必須清楚記錄。",
        "limit": "過去的 CI 成績只代表當時提交的檢查結果，不能代替現在的系統狀態。"
      },
      {
        "heading": "測試應涵蓋實際閱讀路徑",
        "explanation": "建置檢查可以發現缺頁、來源資訊不一致或索引問題；Playwright 可重現點擊、鍵盤、窄螢幕與無 JavaScript 情況。自動無障礙工具有助發現部分缺陷，但仍需人工評估。",
        "limit": "模擬手機瀏覽器不等於真正測量 Android 或 iPhone 的 GPU、耗電與發熱。"
      },
      {
        "heading": "失敗情境與漸進增強",
        "explanation": "正式閱讀流程應能在動畫、外部 iframe、GPU 或部分 JavaScript 不可用時繼續操作。複雜互動應有清晰的 HTML 替代入口，並尊重減少動態偏好。",
        "limit": "圖片、字型和第三方服務的載入失敗也應列入測試。"
      },
      {
        "heading": "交接文件要明示版本限制",
        "explanation": "有用的交接紀錄會說明已完成工作、待確認項目、授權界線、最新可核對的測試證據和回退方法。歷史版本的 PR、階段計畫與網址需要明確標記為快照。",
        "limit": "跨專案套用方法時必須重新核對實際環境，不能直接套用另一個網站的驗收結果。"
      }
    ]
  },
  "research/2026-11-universal-web-engine/25-open-design-agent-kit-and-observatory-adoption.md": {
    "sections": [
      {
        "heading": "Open Design Agent Kit 的定位",
        "explanation": "Open Design Agent Kit 針對 Codex、Claude Code 等程式代理提供 UI 設計相關的開發方法與範例，協助整理設計規範、候選介面及瀏覽器檢查。它不是要求一般網站訪客安裝的前端執行套件。",
        "limit": "工具的可用功能應以實際安裝版本與官方文件為準，不能把研究記錄當作安裝成功。"
      },
      {
        "heading": "從設計規範到畫面驗收",
        "explanation": "先整理資訊層級、色彩、字級、長標題、圖片焦點及手機操作，再產出候選版面。瀏覽器截圖與多尺寸測試可以協助找出文字遮擋、導航重複和水平溢出。",
        "limit": "工具產生的畫面仍需人工判斷可讀性、美術品質與內容準確性。"
      },
      {
        "heading": "授權與安全界線",
        "explanation": "主程式庫授權與範例圖片、字體或第三方素材的授權未必相同；使用前應分別核對上游來源、相依版本及素材權利。試用應限制在開發分支，不任意授予部署或機密存取權限。",
        "limit": "不以工具宣傳、示範截圖或未實際執行的流程宣稱網站成果已交付。"
      }
    ]
  }
});
export const getPublicArticle=path=>PUBLIC_ARTICLES[path]||null;
export const publicBodyCoverage=paths=>({total:paths.length,ready:paths.filter(path=>Boolean(PUBLIC_ARTICLES[path])).length,stale:Object.keys(PUBLIC_ARTICLES).filter(path=>!paths.includes(path))});
