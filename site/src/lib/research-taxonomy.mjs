// Reviewed public labels are an editorial overlay; source Markdown and stable routes stay untouched.
// Every current public Markdown source is explicitly mapped. New sources keep deterministic fallback.
const raw = {
  "docs/governance": [
    [
      "BASELINE-2026-11-02.md",
      "治理稽核與操作",
      "GitHub 治理基線：如何記錄分支保護與驗證證據",
      [
        "治理",
        "稽核"
      ]
    ],
    [
      "OPERATIONS.md",
      "治理稽核與操作",
      "GitHub 程式碼庫治理：PR 審查與故障回退",
      [
        "治理",
        "回退"
      ]
    ],
    [
      "README.md",
      "資料來源與研究索引",
      "專案治理索引：規範、工具與稽核",
      [
        "治理",
        "導覽"
      ]
    ],
    [
      "REPO-TOOLING.md",
      "Agent 工具與 Skills",
      "Repo 工具選型：搜尋索引、成本統計與可選 MCP",
      [
        "MCP",
        "索引",
        "成本"
      ]
    ],
    [
      "RULESETS.md",
      "治理稽核與操作",
      "GitHub Rulesets：分支保護建議與授權邊界",
      [
        "GitHub",
        "分支保護"
      ]
    ],
    [
      "TOKEN-ACCOUNTING.md",
      "Agent 模型路由與成本",
      "Agent Token 成本核算：JSONL 欄位與限制",
      [
        "Token",
        "成本"
      ]
    ]
  ],
  "research/2026-10-retrospective": [
    [
      "01-agent-orchestration.md",
      "Agent 協作與任務調度",
      "十月 Agent 調度研究：模型分工與權限治理",
      [
        "Agent",
        "模型路由",
        "治理"
      ]
    ],
    [
      "02-code-intelligence-benchmarks.md",
      "程式碼搜尋與索引",
      "Serena、RepoMap、Codebase Memory：程式碼查找工具評估",
      [
        "MCP",
        "索引",
        "評測"
      ]
    ],
    [
      "03-agent-skills-and-governance.md",
      "Agent 工具與 Skills",
      "Agent Skills：可重用技能與專案治理研究",
      [
        "Agent",
        "Skills",
        "治理"
      ]
    ],
    [
      "04-ui-design-skills.md",
      "AI 視覺創作工具",
      "UI/UX Agent Skills：設計規範與工具選型",
      [
        "UI/UX",
        "Agent",
        "Skills"
      ]
    ],
    [
      "05-web-motion-3d.md",
      "即時 3D 渲染與 Shader",
      "手機介面的 Web 動效與 3D：技術選型與取捨",
      [
        "WebGL",
        "3D",
        "動效"
      ]
    ],
    [
      "06-secure-agent-cicd.md",
      "Agent 權限與安全",
      "Agent 程式工程安全：CI、權限與證據閘門",
      [
        "Agent",
        "CI/CD",
        "安全"
      ]
    ],
    [
      "07-audio-dsp.md",
      "音訊 DSP 與空間音效",
      "空間音訊工程：DSP、HRTF 與失真測試",
      [
        "DSP",
        "空間音訊",
        "測試"
      ]
    ],
    [
      "08-local-llm-models.md",
      "模型推論與記憶體",
      "本機 LLM：手機推論、模型比較與運作成本",
      [
        "LLM",
        "本機推論",
        "成本"
      ]
    ],
    [
      "09-video-automation.md",
      "影片製作與自動化",
      "AI 影片製作：OpenFilm、Remotion、FFmpeg 自動化",
      [
        "影片",
        "AI",
        "自動化"
      ]
    ],
    [
      "10-candidate-backlog.md",
      "網站架構與交付規劃",
      "十月技術候選清單：尚未驗證的工具與想法",
      [
        "研究候選",
        "待驗證"
      ]
    ],
    [
      "11-adoption-roadmap.md",
      "網站架構與交付規劃",
      "十月研究導入排序：依證據與成本決定優先級",
      [
        "研究規劃",
        "成本"
      ]
    ],
    [
      "README.md",
      "資料來源與研究索引",
      "十月跨領域技術研究：導覽與實驗回顧",
      [
        "導覽",
        "研究回顧"
      ]
    ]
  ],
  "research/2026-11-agent-engineering": [
    [
      "01-egm.md",
      "Agent 協作與任務調度",
      "Elephant–Goldfish Model（EGM）：Agent 規格與資訊分層",
      [
        "Agent",
        "EGM",
        "工作流程"
      ]
    ],
    [
      "02-claude-code-multi-model.md",
      "Agent 模型路由與成本",
      "Claude Code 多模型協作：Advisor、子代理與限制",
      [
        "Claude Code",
        "模型路由",
        "Agent"
      ]
    ],
    [
      "03-imagine.md",
      "AI 視覺創作工具",
      "Imagine 與 Custom Visuals：工具身分與功能查證",
      [
        "Imagine",
        "設計工具",
        "來源查證"
      ]
    ],
    [
      "04-jev.md",
      "Agent 模型路由與成本",
      "Jev／JEV：型別化決策與模型路由研究",
      [
        "Jev",
        "模型路由",
        "Agent"
      ]
    ],
    [
      "05-integration.md",
      "Agent 協作與任務調度",
      "EGM、Claude Code、Imagine、Jev：整合可行性評估",
      [
        "EGM",
        "Claude Code",
        "Agent"
      ]
    ],
    [
      "06-claim-check.md",
      "AI 評測與證據核查",
      "Threads 多模型主張與 Imagine 截圖：證據核查",
      [
        "來源查證",
        "Agent"
      ]
    ],
    ["07-music-skill-editable-agent-composition.md","Agent 工具與 Skills","music-skill：AI Agent 如何寫出可修改的原創配樂？",["music-skill","Agent Skills","音樂製作","MIDI","FluidSynth"]],
    ["08-nvidia-skillspector-agent-skill-security.md","Agent 權限與安全","NVIDIA SkillSpector：安裝 Agent Skills 前如何掃描安全風險？",["NVIDIA","SkillSpector","Agent Skills","提示注入","供應鏈","MCP","SARIF"]],
    ["09-nvidia-ai-workbench-reproducible-agent-containers.md","AI 開發環境與容器","NVIDIA AI Workbench：本地與遠端 AI 開發容器管理",["NVIDIA","AI Workbench","容器","Git","遠端 GPU","Agent"]],
    ["10-agents-anywhere-cross-device-agent-workbench.md","Agent 遠端工作台","Agents Anywhere：跨手機與電腦管理 Codex、Claude Code 工作階段",["Agents Anywhere","Agent","Connector","Codex","Claude Code","遠端管理","自架"]],
    [
      "README.md",
      "資料來源與研究索引",
      "AI Coding 代理工程：研究目錄與閱讀順序",
      [
        "Agent",
        "導覽"
      ]
    ],
    [
      "SOURCES.md",
      "資料來源與研究索引",
      "AI 代理工程：原始來源與證據等級索引",
      [
        "Agent",
        "來源索引"
      ]
    ]
  ],
  "research/2026-11-agent-repository-operations": [
    [
      "01-governance-and-authority.md",
      "Agent 權限與安全",
      "GitHub Agent 治理：權限、核准與信任邊界",
      [
        "GitHub",
        "Agent",
        "權限"
      ]
    ],
    [
      "02-search-routing.md",
      "程式碼搜尋與索引",
      "Agent 搜尋路由：精準查找與減少上下文耗用",
      [
        "索引",
        "搜尋",
        "Token"
      ]
    ],
    [
      "03-index-database-design.md",
      "程式碼搜尋與索引",
      "Repo 索引資料庫：增量同步、FTS5 與新鮮度",
      [
        "資料庫",
        "FTS5",
        "索引"
      ]
    ],
    [
      "04-cost-context-and-routing.md",
      "Agent 模型路由與成本",
      "Agent 成本工程：Token、上下文與模型路由",
      [
        "Token",
        "模型路由",
        "成本"
      ]
    ],
    [
      "05-memory-and-rag.md",
      "長期記憶與 RAG",
      "Agent 長期記憶與 RAG：來源真值及更新策略",
      [
        "RAG",
        "記憶",
        "索引"
      ]
    ],
    [
      "06-agent-workflows.md",
      "Agent 協作與任務調度",
      "Agent Harness：有限併行、可恢復工作流與成本",
      [
        "Agent",
        "Harness",
        "併行"
      ]
    ],
    [
      "07-security-and-ci.md",
      "Agent 權限與安全",
      "Agent 安全與 CI：不可信輸入及供應鏈控制",
      [
        "Agent",
        "CI/CD",
        "安全"
      ]
    ],
    [
      "08-evaluation-and-benchmarks.md",
      "AI 評測與證據核查",
      "Agent 評測設計：搜尋品質、成本與任務成功率",
      [
        "Agent",
        "評測",
        "成本"
      ]
    ],
    [
      "09-implementation-roadmap.md",
      "網站架構與交付規劃",
      "Agent Repo 治理導入順序：由低成本索引開始",
      [
        "治理",
        "導入規劃"
      ]
    ],
    [
      "10-github-project-catalog.md",
      "Agent 工具與 Skills",
      "Agent Repo 開源工具目錄：治理、索引與評測",
      [
        "GitHub",
        "索引",
        "Agent"
      ]
    ],
    [
      "11-ai-framework-agent-cost.md",
      "Agent 模型路由與成本",
      "JavaScript 框架的 AI 開發成本：Token、時間與限制",
      [
        "JavaScript",
        "Agent",
        "成本"
      ]
    ],
    [
      "EAG-100-AUDIT-TEMPLATE.md",
      "治理稽核與操作",
      "AI Agent 治理稽核表：權限、證據與風險",
      [
        "治理",
        "稽核"
      ]
    ],
    [
      "EAG-100.md",
      "治理稽核與操作",
      "AI Agent 治理評分方法與控制項",
      [
        "治理",
        "Agent",
        "評分"
      ]
    ],
    [
      "README.md",
      "資料來源與研究索引",
      "Agent Repository 治理與搜尋研究：導覽",
      [
        "Agent",
        "治理",
        "導覽"
      ]
    ],
    [
      "SOURCES.md",
      "資料來源與研究索引",
      "Agent Repository：治理、搜尋與成本研究來源索引",
      [
        "來源索引",
        "Agent"
      ]
    ]
  ],
  "research/2026-11-information-security": [
    [
      "README.md",
      "資料來源與研究索引",
      "資訊安全研究：基本原則、基礎設施與身分驗證導覽",
      [
        "資安",
        "導覽"
      ]
    ],
    [
      "SOURCES.md",
      "資料來源與研究索引",
      "資訊安全：教材與現代技術指引來源索引",
      [
        "資安",
        "來源索引"
      ]
    ],
    [
      "identity-and-authentication.md",
      "身分驗證與存取控制",
      "身分驗證：密碼、生物辨識、MFA、Kerberos 與 FIDO",
      [
        "MFA",
        "身分驗證",
        "密碼"
      ]
    ],
    [
      "information-security-principles.md",
      "資訊安全原則與風險",
      "資訊安全基本原則：CIA、威脅、弱點與風險管理",
      [
        "資安",
        "CIA",
        "風險"
      ]
    ],
    [
      "infrastructure-and-physical-security.md",
      "基礎設施與實體安全",
      "資訊基礎設施安全：機房、備份與災難復原",
      [
        "資安",
        "機房",
        "備份"
      ]
    ],
    [
      "security-guidance-evidence-review.md",
      "資訊安全原則與風險",
      "身分驗證安全指引：教材與 NIST／OWASP 建議差異",
      [
        "NIST",
        "OWASP",
        "身分驗證"
      ]
    ]
  ],
  "research/2026-11-edge-infrastructure": [
    ["01-android-phone-termux-proot-home-server.md","邊緣設備與自架服務","舊 Android 手機當低功耗伺服器：Termux、PRoot 與長期可靠性",["Android","Termux","PRoot","Debian","Pi-hole","低功耗","家庭伺服器"]]
  ],
  "research/2026-11-local-ai-inference": [
    [
      "01-colibri-moe-streaming.md",
      "模型推論與記憶體",
      "Colibri：記憶體不足時，大型 MoE 如何分層使用 VRAM、RAM 與 SSD？",
      [
        "MoE",
        "VRAM",
        "本機推論"
      ]
    ],
    ["02-nvidia-parakeet-v3-multilingual-asr.md","語音辨識與字幕","NVIDIA Parakeet 第三版：25 種歐語辨識與中文支援限制",["NVIDIA","Parakeet","ASR","字幕","時間戳","中文限制","CC BY 4.0"]],
    ["03-nvidia-broadcast-rtx-audio-video-effects.md","影片製作與自動化","NVIDIA Broadcast：RTX 人聲降噪、鏡頭特效與檔案處理",["NVIDIA","Broadcast","RTX","降噪","Eye Contact","File Processor","MCP"]],
    [
      "README.md",
      "資料來源與研究索引",
      "本機 AI 推論導覽：MoE、記憶體與儲存分層",
      [
        "MoE",
        "本機推論",
        "導覽"
      ]
    ]
  ],
  "research/2026-11-systems-analysis-design": [
    [
      "README.md",
      "資料來源與研究索引",
      "系統分析與設計：課程研究導覽",
      [
        "系統分析",
        "導覽"
      ]
    ],
    [
      "SOURCES.md",
      "資料來源與研究索引",
      "系統分析與設計：參考教材及證據來源索引",
      [
        "系統分析",
        "來源索引"
      ]
    ],
    [
      "business-case-and-feasibility.md",
      "需求、商業分析與可行性",
      "資訊系統立案：商業個案、系統請求與可行性分析",
      [
        "商業分析",
        "可行性",
        "系統請求"
      ]
    ],
    [
      "information-systems-and-development.md",
      "系統分析與開發方法",
      "資訊系統開發：五大要素、SDLC 與開發方法",
      [
        "SDLC",
        "系統分析"
      ]
    ],
    [
      "project-planning-and-risk.md",
      "專案管理與風險",
      "資訊系統專案管理：排程、成本、任務依賴與風險",
      [
        "專案管理",
        "風險",
        "排程"
      ]
    ]
  ],
  "research/2026-11-universal-web-engine": [
    [
      "01-framework-selection.md",
      "Web 框架與技術選型",
      "2026 Web 框架選型：依產品需求比較技術棧",
      [
        "Web",
        "框架",
        "選型"
      ]
    ],
    [
      "02-nextjs-deep-dive.md",
      "Web 框架與技術選型",
      "Next.js 16：功能、適用場景與維護風險",
      [
        "Next.js",
        "React"
      ]
    ],
    [
      "03-frontend-ui-and-state.md",
      "前端 UI 與狀態",
      "前端 UI 與狀態管理：CSS、表單和無障礙",
      [
        "UI",
        "CSS",
        "狀態管理"
      ]
    ],
    [
      "04-backend-data-and-auth.md",
      "後端 API 與資料",
      "後端 API 與資料存取：ORM、快取與驗證",
      [
        "API",
        "資料庫",
        "ORM"
      ]
    ],
    [
      "05-runtime-build-and-dx.md",
      "建置工具與開發體驗",
      "TypeScript、Node.js、Vite 與 Monorepo 工具鏈",
      [
        "TypeScript",
        "Node.js",
        "Vite"
      ]
    ],
    [
      "06-graphics-and-compatibility.md",
      "即時 3D 渲染與 Shader",
      "WebGPU／WebGL：3D 引擎、GPU 運算與相容性",
      [
        "WebGPU",
        "WebGL",
        "3D"
      ]
    ],
    [
      "07-performance-and-accessibility.md",
      "網頁效能與無障礙",
      "網頁效能與無障礙：Core Web Vitals 和驗收方法",
      [
        "Core Web Vitals",
        "無障礙"
      ]
    ],
    [
      "08-security-testing-and-deployment.md",
      "網站安全、測試與部署",
      "Web 專案安全與部署：漏洞修補、測試和 CI/CD",
      [
        "安全",
        "CI/CD",
        "部署"
      ]
    ],
    [
      "09-reference-stacks-and-migration.md",
      "Web 框架與技術選型",
      "三種 Web 技術棧：SaaS、內容網站與互動工具",
      [
        "Web",
        "技術選型",
        "遷移"
      ]
    ],
    [
      "10-creative-direction-and-reference-sites.md",
      "互動作品與設計案例",
      "28 個互動網站案例：視覺設計與 UX 比較",
      [
        "UI/UX",
        "案例",
        "互動網站"
      ]
    ],
    [
      "11-motion-graphics-and-rendering.md",
      "即時 3D 渲染與 Shader",
      "電影級 Web 動效與 GPU 渲染：技術分層與限制",
      [
        "WebGL",
        "Shader",
        "動效"
      ]
    ],
    [
      "12-github-creative-ecosystem.md",
      "創意前端工具與函式庫",
      "創意前端 GitHub 專案：70 候選與 18 項選型",
      [
        "GitHub",
        "創意前端",
        "工具"
      ]
    ],
    [
      "13-design-performance-and-architecture.md",
      "介面設計與視覺系統",
      "高階 UI/UX 設計系統：Token、效能與架構",
      [
        "UI/UX",
        "Design Tokens",
        "效能"
      ]
    ],
    [
      "14-effects-recipes-and-poc-validation.md",
      "網頁動效與捲動敘事",
      "10 種 Web 特效：實作原理、降級與 PoC 驗證",
      [
        "動效",
        "Shader",
        "PoC"
      ]
    ],
    [
      "15-creative-web-evidence-and-adoption.md",
      "AI 評測與證據核查",
      "Creative Web 研究證據：來源分級、衝突與採用判斷",
      [
        "來源查證",
        "Creative Web"
      ]
    ],
    [
      "16-active-theory-quality-benchmark.md",
      "互動作品與設計案例",
      "Active Theory 視覺品質研究：證據與設計轉譯",
      [
        "Active Theory",
        "案例",
        "UI/UX"
      ]
    ],
    [
      "17-arctic-waters-threejs-creative-workflow.md",
      "互動作品與設計案例",
      "Arctic Waters：Three.js 海洋作品的製作流程",
      [
        "Three.js",
        "Blender",
        "案例"
      ]
    ],
    [
      "18-v3-cinematic-experience-technology-decision.md",
      "網站架構與交付規劃",
      "沉浸式互動網站：3D、動畫與框架選型",
      [
        "Astro",
        "設計規劃",
        "V3"
      ]
    ],
    [
      "19-v3-astro-research-cinema-architecture-and-roadmap.md",
      "網站架構與交付規劃",
      "Astro 技術內容網站：架構、全文搜尋與演進",
      [
        "Astro",
        "架構",
        "V3"
      ]
    ],
    [
      "20-v3-chatgpt-5-6-execution-brief.md",
      "網站架構與交付規劃",
      "AI Coding Agent：網站開發規格與驗收方法",
      [
        "Agent",
        "V3",
        "實作指引"
      ]
    ],
    [
      "21-p0-acceptance-and-p1-handoff.md",
      "驗收、測試與交接",
      "靜態內容網站：建置驗收與行動版測試",
      [
        "驗收",
        "交接",
        "V3"
      ]
    ],
    [
      "22-immersive-scrollytelling-and-asset-performance.md",
      "網頁動效與捲動敘事",
      "沉浸式網頁：捲動敘事、素材效能與無障礙",
      [
        "捲動敘事",
        "效能",
        "無障礙"
      ]
    ],
    [
      "23-threejs-nanites-gpu-driven-geometry.md",
      "3D 資產與幾何最佳化",
      "threejs-nanites：GPU 驅動幾何與可見性裁剪",
      [
        "Three.js",
        "WebGPU",
        "LOD"
      ]
    ],
    [
      "24-polyfork-agent-native-3d-assets.md",
      "3D 資產與幾何最佳化",
      "Polyfork：參數化 3D 素材與 Asset-as-Code",
      [
        "3D",
        "參數化資產",
        "Agent"
      ]
    ],
    [
      "25-open-design-agent-kit-and-observatory-adoption.md",
      "AI 視覺創作工具",
      "Open Design Agent Kit：介面設計 Agent 工具研究",
      [
        "Agent",
        "UI/UX",
        "設計工具"
      ]
    ],
    [
      "26-luminati-hd2d-browser-engine.md",
      "即時 3D 渲染與 Shader",
      "Luminati：Three.js 2.5D 像素遊戲引擎研究",
      [
        "Three.js",
        "2.5D",
        "遊戲引擎"
      ]
    ],
    ["27-threejs-r187-ultra-rendering-ceiling.md","即時 3D 渲染與 Shader","Three.js r187 畫質上限：WebGPU、TSL、全域光與路徑追蹤",["Three.js","WebGPU","TSL","Shader","全域光"]],
    ["28-advanced-shader-pipeline-and-hd2d-recipes.md","即時 3D 渲染與 Shader","高階 Shader 配方：海水、峽灣霧、反射、HD-2D",["Three.js","Shader","WebGPU","HD-2D","海水"]],
    ["29-rendering-ceiling-benchmark-and-adoption-gates.md","即時 3D 渲染與 Shader","3D 高畫質怎麼驗收？GPU 成本、真機與降級關卡",["Three.js","GPU","WebGPU","效能","效能驗收"]],
    ["30-viper11-clouds-terrain-cinematic-rendering.md","即時 3D 渲染與 Shader","VIPER 11：可穿越體積雲、真實地形與電影級鏡頭",["Three.js","WebGL2","體積雲","地形 LOD","HDR"]],
    ["31-brinewater-browser-open-world-and-agent-workflow.md","互動作品與設計案例","Brinewater：瀏覽器開放世界與 AI Agent 開發案例",["開放世界","交通模擬","Agent","Git Worktree","視覺驗收"]],
    ["32-aurea-residences-immersive-luxury-web-ux-review.md","介面設計與視覺系統","ÁUREA Residences：精品住宅網站的視覺與互動驗收",["UI/UX","精品網站","視覺敘事","捲動互動","跨裝置驗收"]],
    ["33-uniforge3d-anchor-guided-multiview-3d-reconstruction.md","AI 3D 重建與生成","UniForge3D：少量多視角照片如何重建完整 3D 資產？",["UniForge3D","多視角重建","3D 生成","VGGT","GLB","授權"]],
    ["34-forever-components-agent-retrieval-and-web-effects.md","創意前端工具與函式庫","Forever Components：可檢索網頁動效與 Agent 元件選型",["Forever Components","Agent","UI 動效","SVG","Canvas","索引"]],
    ["35-ui-typography-readability-and-cjk.md","介面設計與視覺系統","UI 字體排版六原則：繁中、行長、字距與無障礙",["Typography","繁體中文","可及性","WCAG","字體排版"]],
    ["36-gradientdeck-design-md-library-for-agents.md","介面設計與視覺系統","GradientDeck UI：把真實網站整理成 DESIGN.md，讓 Agent 照風格設計",["GradientDeck","DESIGN.md","設計系統","Agent","UI"]],
    ["37-threejs-grassworks-webgpu-grass-and-forest-demo.md","即時 3D 渲染與 Shader","Three.js Grassworks：WebGPU 草地系統、森林展示與商用授權",["Three.js","WebGPU","TSL","草地","授權"]],
    ["38-noniv-webgpu-fft-ocean-renderer.md","即時 3D 渲染與 Shader","Noniv Web Ocean：原生 WebGPU 六層 FFT 海面、泡沫與天空渲染",["WebGPU","WGSL","FFT","JONSWAP","CDLOD","LEAN","海洋渲染"]],
    ["39-infinitra-mathematical-world-volumetric-generation.md","程序生成與世界架構","INFINITRA：數學定義世界、體積生成與無縫細節切換",["INFINITRA","程序生成","體積世界","LOD","決定性生成","Delta 儲存","授權"]],
    ["40-volumetric-clouds-unified-wind-vegetation-weather.md","即時 3D 渲染與 Shader","體積雲與統一風場：讓雲影、草浪與樹葉同一天氣系統連動",["Three.js","WebGL2","WebGPU","體積雲","風場","草地","雲影","WeatherState"]],
    ["41-web-audio-spatial-coastal-soundscape-and-asset-rights.md","音訊技術與空間聲景","Web Audio 海岸聲景：海浪、海鷗、風聲的空間音效與授權",["Web Audio","Three.js","HRTF","海浪","海鷗","風聲","音效授權","CC0"]],
    ["42-ten-cloud-genera-procedural-algorithms-and-rendering.md","即時 3D 渲染與 Shader","十種雲怎麼用程式生成？WMO 雲屬與體積雲 Shader 演算法",["WMO","十種雲","Atmosphere","GLSL","Cloud Density","Raymarch","雲層","WebGPU","MIT"]],
    ["43-webgl2-rendering-performance-visibility-and-benchmark-protocol.md","即時 3D 渲染與 Shader","WebGL2 大型場景效能：量測、空間合批與剔除",["Three.js","WebGL2","Frustum Culling","BatchedMesh","GPU Timer","Benchmark"]],
    ["44-seamless-world-streaming-lod-hlod-resource-lifecycle.md","即時 3D 渲染與 Shader","無縫大世界如何設計？Chunk、LOD、HLOD 與資源生命週期",["Three.js","Chunk Streaming","LOD","HLOD","World State","Meshopt"]],
    [
      "README.md",
      "資料來源與研究索引",
      "現代 Web 工程與互動技術：研究導覽",
      [
        "Web",
        "導覽"
      ]
    ],
    [
      "SOURCES.md",
      "資料來源與研究索引",
      "現代 Web 工程：官方文件與查證來源索引",
      [
        "Web",
        "來源索引"
      ]
    ]
  ],
  "research": [
    [
      "RESEARCH-TEMPLATE.md",
      "資料來源與研究索引",
      "研究紀錄模板：問題、證據、比較與驗證",
      [
        "研究方法",
        "模板"
      ]
    ]
  ],
  "showcase/design": [
    [
      "V2-ART-DIRECTION.md",
      "介面設計與視覺系統",
      "電影式網頁：美術方向與場景敘事原則",
      [
        "UI/UX",
        "美術",
        "V2"
      ]
    ],
    [
      "V2-ENGINEERING-ACCEPTANCE.md",
      "驗收、測試與交接",
      "高互動網站：工程規格、效能與降級驗收",
      [
        "工程規格",
        "驗收",
        "V2"
      ]
    ],
    [
      "V2-FONT-LICENSES.md",
      "授權、字體與素材治理",
      "網站字體與素材：授權和來源查核",
      [
        "字體",
        "授權",
        "V2"
      ]
    ],
    [
      "V2-IMPLEMENTATION-REVIEW.md",
      "驗收、測試與交接",
      "互動網站實作審查：可讀性、效能與限制",
      [
        "審查",
        "V2",
        "歷史紀錄"
      ]
    ]
  ]
};
export const TOPIC_DESCRIPTORS = Object.freeze({
  "治理稽核與操作": {
    "why": "治理基線、工作準則、分支保護與稽核方法",
    "image": "vault.svg"
  },
  "Agent 權限與安全": {
    "why": "限制 AI 代理的工具權限、CI 與不可信資料風險",
    "image": "vault.svg"
  },
  "Agent 協作與任務調度": {
    "why": "設計代理分工、上下文交接與可恢復工作流程",
    "image": "workflow.svg"
  },
  "Agent 遠端工作台": {"why":"管理跨裝置 Agent 會話、Connector 權限、遠端核准及自架服務","image":"robot.svg"},
  "邊緣設備與自架服務": {"why":"研究舊手機等低功耗裝置部署 Linux 服務的可靠性、安全與成本","image":"servers.svg"},
  "AI 開發環境與容器": {"why":"管理可重現容器、Git 環境、遠端 GPU 與 Agent 隔離","image":"workflow.svg"},
  "語音辨識與字幕": {"why":"研究 ASR 模型、語言支援、字幕時間戳及轉錄誤差","image":"studio.svg"},
  "Agent 工具與 Skills": {
    "why": "比較程式代理工具、MCP 與可重用技能",
    "image": "robot.svg"
  },
  "Agent 模型路由與成本": {
    "why": "分析不同模型分工、Token 與工作成本",
    "image": "robot.svg"
  },
  "模型推論與記憶體": {
    "why": "研究本機模型、MoE 與記憶體／儲存分層",
    "image": "chip.svg"
  },
  "程式碼搜尋與索引": {
    "why": "建立 Repo 搜尋、資料庫索引與查找路由",
    "image": "servers.svg"
  },
  "長期記憶與 RAG": {
    "why": "比較檢索增強、知識更新與來源追溯",
    "image": "servers.svg"
  },
  "AI 評測與證據核查": {
    "why": "驗證模型及技術主張，區分測試、引用與推測",
    "image": "analysis.svg"
  },
  "AI 視覺創作工具": {
    "why": "評估設計 Agent、介面生成與協作工具",
    "image": "studio.svg"
  },
  "音訊 DSP 與空間音效": {
    "why": "研究聲音訊號處理、空間定位與失真測試",
    "image": "servers.svg"
  },
  "影片製作與自動化": {
    "why": "分析影片製作管線、工具及自動化條件",
    "image": "studio.svg"
  },
  "Web 框架與技術選型": {
    "why": "依產品需求挑選前後端框架、網站技術棧",
    "image": "browser.svg"
  },
  "前端 UI 與狀態": {
    "why": "處理介面元件、樣式、表單與狀態管理",
    "image": "studio.svg"
  },
  "後端 API 與資料": {
    "why": "建立後端服務、資料存取、快取與驗證",
    "image": "servers.svg"
  },
  "建置工具與開發體驗": {
    "why": "管理程式工具鏈、執行環境與建置流程",
    "image": "workflow.svg"
  },
  "網頁效能與無障礙": {
    "why": "理解 Core Web Vitals、頁面載入速度、互動延遲、無障礙與各種裝置的相容性",
    "image": "workflow.svg"
  },
  "網站安全、測試與部署": {
    "why": "維護 Web 系統安全、測試、CI 和發布流程",
    "image": "vault.svg"
  },
  "音訊技術與空間聲景": {
    "why": "研究 Web Audio、3D 音源、動態聲景、混音、素材授權與音效效能",
    "image": "studio.svg"
  },
  "即時 3D 渲染與 Shader": {
    "why": "比較 WebGL/WebGPU、著色器與即時場景引擎",
    "image": "browser.svg"
  },
  "AI 3D 重建與生成": {
    "why": "研究照片到三維資產的幾何重建、生成補完、模型推論與素材品質驗收",
    "image": "chip.svg"
  },
  "程序生成與世界架構": {"why":"研究決定性三維世界、體積生成、無縫 LOD 與玩家修改持久化","image":"browser.svg"},
  "3D 資產與幾何最佳化": {
    "why": "研究 3D 模型、LOD、可見性裁剪與素材管線",
    "image": "chip.svg"
  },
  "網頁動效與捲動敘事": {
    "why": "分析互動動畫、轉場及捲動敘事方法",
    "image": "studio.svg"
  },
  "介面設計與視覺系統": {
    "why": "規劃 UI/UX、字體、色彩和設計 Token",
    "image": "studio.svg"
  },
  "創意前端工具與函式庫": {
    "why": "整理互動網站常用的開源特效與前端工具",
    "image": "browser.svg"
  },
  "互動作品與設計案例": {
    "why": "分析具體網站與原創作品，區分作者證據和建議",
    "image": "studio.svg"
  },
  "網站架構與交付規劃": {
    "why": "整理網站架構、技術決策與分階段實作",
    "image": "analysis.svg"
  },
  "驗收、測試與交接": {
    "why": "核對交付結果、限制、測試及歷史交接紀錄",
    "image": "workflow.svg"
  },
  "資料來源與研究索引": {
    "why": "查看研究目錄、來源索引、證據與研究模板",
    "image": "books.svg"
  },
  "資訊安全原則與風險": {
    "why": "理解威脅、弱點、CIA 與風險分析",
    "image": "privacy.svg"
  },
  "身分驗證與存取控制": {
    "why": "研究密碼、MFA、生物辨識與鑑別協定",
    "image": "vault.svg"
  },
  "基礎設施與實體安全": {
    "why": "保護機房、設備、網路、備份與災難復原",
    "image": "servers.svg"
  },
  "系統分析與開發方法": {
    "why": "學習資訊系統組成、SDLC 和系統分析",
    "image": "analysis.svg"
  },
  "需求、商業分析與可行性": {
    "why": "理解系統請求、商業個案與可行性評估",
    "image": "analysis.svg"
  },
  "專案管理與風險": {
    "why": "拆解任務、規劃時程、成本和風險管理",
    "image": "workflow.svg"
  },
  "授權、字體與素材治理": {
    "why": "記錄第三方字體、素材及使用權利",
    "image": "studio.svg"
  }
});
const out = Object.create(null);
for (const [folder, entries] of Object.entries(raw)) for (const [name, topic, publicTitle, tags] of entries) {
  if (!TOPIC_DESCRIPTORS[topic]) throw new Error('未知研究細分類：'+topic);
  if (!publicTitle || !/[\u3400-\u9fff]/u.test(publicTitle)) throw new Error('對外標題缺少中文：'+folder+'/'+name);
  const file = folder+'/'+name;
  if (out[file]) throw new Error('重複研究登錄：'+file);
  const kind = name==='SOURCES.md' ? '來源索引' : name==='README.md' ? '研究導覽' :
    name.includes('TEMPLATE') ? '研究模板' : folder==='showcase/design' ? '設計規格' :
    folder==='docs/governance' ? '治理規範' : null;
  out[file] = Object.freeze({topic, publicTitle, tags:Object.freeze(tags), kind});
}
export const REVIEWED_DOCUMENTS = Object.freeze(out);
export const reviewedCoverage = files => ({total:files.length, reviewed:files.filter(file=>Boolean(REVIEWED_DOCUMENTS[file])).length, unmatched:files.filter(file=>!REVIEWED_DOCUMENTS[file]), stale:Object.keys(REVIEWED_DOCUMENTS).filter(file=>!files.includes(file))});
