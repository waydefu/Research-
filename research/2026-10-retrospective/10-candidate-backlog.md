# 10｜十月曾聊到，但需要再次查證的技術候選

**定位：研究線索儲存區，不是推薦安裝清單。** 有些名稱出現在比較或想法收集中，未確認原始 Repo、版本、維護狀態及與現有環境的相容性。

## 保留候選的規則

- 必須能指出可能解決的具體問題；不能只因名字很酷而進正式工具鏈。
- 找得到**原始來源、維護狀態、授權、安裝成本**才晉升為「已核對」。
- 如與既有工具高度重疊，以「測試相同任務的更低成本／更高品質」為採用依據。
- 若無法確認同名專案所指，保留原名稱與待查狀態，不隨意猜 GitHub URL。

## A. 代理觀測與協作

| 候選 | 當時討論用途 | 有價值的下一個問題 |
| --- | --- | --- |
| AgentHUD / agent-monitor-hs | 代理拓樸、執行視覺化 | 能否正確對接 Hermes 實際日誌，而非只支援 Claude 原生格式 |
| abtop / cctop / claude-monitor | Token、Context、會話成本 | 是否能整合 Codex provider 的費用口徑 |
| claude-code-dashboard | 代理圖形監控 | 是否增加常駐服務及安全風險 |
| Puppetmaster | 任務調度與重試 | 能否遵守單一 Profile／並發 2 的硬限制 |
| oh-my-hermes | 第三方 Hermes Skills／工具增強 | 是否與既有權限 hook 衝突 |
| codex_workflow | Codex 工程管線 | 與 EGM、CI 的責任範圍是否重疊 |

## B. 介面、動效與可視化

| 候選 | 當時用途 | 策略 |
| --- | --- | --- |
| oil-ui、oil-frontend、oil-motion | 專業視覺審查、工程作業規範 | 先確認 repo；設計方法可研究，不能覆蓋現有 Design North Star |
| 21st.dev、React Bits、Aceternity、Magic UI | 互動元件庫 | 檢查授權、framework、bundle 和動效負擔 |
| Theatre.js、Rive、Spline、Unicorn Studio | 複雜互動／視覺編排 | 先證明普通 CSS／WAAPI 不夠用 |
| Paper Shaders、OGL、curtains.js | Shader 和 WebGL 特效 | 真實手機壓力測試後才選型 |
| Codrops、Active Theory | 高階網站視覺參考 | **作為設計案例，不是可直接移植的 SDK** |
| Emil Kowalski、Matt Pocock、Addy Osmani Skills | 動效／開發實務技巧 | 指定具體 source repo 再評估 |
| Graphify、ISO-GLOW、iso-figure | 圖表、SVG 與等角投影 | 證明比現成 SVG 更具可維護性 |

## C. 多模型與其他延伸

| 候選 | 方向 | 關鍵限制 |
| --- | --- | --- |
| Tuskira Agent Gateway | 工具隔離、政策與密鑰 | 真正的執行控制權、故障回退及可信部署需驗證 |
| Graft／Agency Agents | 組織知識與角色化代理 | 不要因角色數量多就引入 |
| RepoMap／Atlas／mcp-context-graph | 程式庫結構／語意圖 | RepoMap 曾有成本上升的十月紀錄 |
| CodeXR 替代方案 | UI 特效與教學 | 優先研究免費、開源與授權明確的實作 |
| AI 影片服務 | Veo、Kling、Runway、Hailuo、Wan | 價格／水印／商用政策易變，重新確認 |
| 更多本地模型 | Mellum、Muse、Ornith、Granite Switch | 跑得動 ≠ 實際使用比現有模型划算 |

## 排除原則

- **未核對來源的性能口號**（如「3x 快、4x 省」）不可存成實測。
- **舊方案已被取代**：五子代理並行、多 Profile、RepoMap 強制啟用不再是現行建議。
- **未實機核驗的遊戲數據和 3D 功能**不得被工具研究推論為已完成。
- **自動代理寫入、合併與部署**沒有明確批准不得執行。

詳見 [實測 MCP 結論](02-code-intelligence-benchmarks.md) 與 [導入規劃](11-adoption-roadmap.md)。
