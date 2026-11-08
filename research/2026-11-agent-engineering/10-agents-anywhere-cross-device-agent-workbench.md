# Agents Anywhere：跨裝置管理 Codex、Claude Code 與自架 Agent 工作台

**研究與來源最後核對：2026-11-07（Asia/Taipei）**  
**原作者：** [anywhere-labs／Agents-Anywhere](https://github.com/anywhere-labs/Agents-Anywhere)（本次以 GitHub main 的 [README](https://github.com/anywhere-labs/Agents-Anywhere/blob/main/README.md)、[Connector 文件](https://github.com/anywhere-labs/Agents-Anywhere/blob/main/connector/README.md)、[部署文件](https://github.com/anywhere-labs/Agents-Anywhere/blob/main/docker/README.md)及[正式 Releases](https://github.com/anywhere-labs/Agents-Anywhere/releases)交叉核對）。  
**分類：** Agent 多端管理／遠端 Connector／Runtime 協議／自架服務／權限與資料流。  
**證據狀態：** 已查閱原作者文件和發行說明；**未安裝** Windows／Android／Linux 客戶端，未部署 Server、配對裝置、實測會話接管或進行安全滲透測試。

## 1｜這是什麼？不是把手機當作模型算力機

Agents Anywhere 是跨裝置 Agent 工作台，讓桌面、Android、iOS/iPadOS 和 Web 使用同一個後端存取已連線工作設備的 Agent 會話、進度、核准、檔案、終端機及工具操作。主要支援 Codex、Claude Code、DeepSeek Harness（DSH），實際能力依 Runtime 與發布版本而異。

**職責界線要分清：** 手機與瀏覽器是控制端；真正操作程式碼、執行 Shell 和調用 Agent 的是工作設備上的 Connector 與 Runtime。手機安裝控制用 APK **不代表**能在手機本機直接執行 Windows Agent。官方另提供 headless/Linux Connector CLI，但未保證 Android Termux 內完整 Runtime 能用。

## 2｜真實架構與資料信任邊界

`桌面／Android／iOS／Web 使用者 → Server（認證、會話、Timeline、轉發、附件） → Connector（工作設備） → Codex／Claude／DSH Runtime → 工作目錄、命令與檔案`

| 部件 | 官方文件明示能力 | 審查風險 |
| --- | --- | --- |
| 客戶端 | Android 8.0+、Windows x64、macOS、iOS、Web；回覆 Agent 請求、查看工作區及互動終端 | 行動裝置遺失、令牌持久性、操作核准身份 |
| Connector | 由 [connector/README.md](https://github.com/anywhere-labs/Agents-Anywhere/blob/main/connector/README.md) 描述本地 RPC、文件讀寫／下載、shell、終端、Agent 會話轉發 | **遠端命令高權限入口**；必須限制工作目錄與網路出口，不可把登入當完整權限防護 |
| Server | 支援官方 Cloud 和 [Docker 自架](https://github.com/anywhere-labs/Agents-Anywhere/blob/main/docker/README.md)，後端使用 PostgreSQL／Redis | 會話內容與上傳附件可經過或保存在 Server；須確認保留、刪除、備份、訪問紀錄與管轄 |
| Runtime | 透過工作設備既有 Agent 安裝與帳號執行 | 模型費用／可用性受該 Runtime 與帳號規則約束，非本工具贈送算力 |

官方 README 說 Cloud 服務位於**中國大陸**。處理公司原始碼、機密、私人文件或帶有長期 Access Token 的控制台時，應先確認服務端資料處理及跨境條件，並優先評估隔離與自架方案，不能假定端到端加密、零資料留存或國際合規已經獨立驗證。

## 3｜目前版本與相容性：不能只看 README

2026-11-07 對照正式 [GitHub Releases](https://github.com/anywhere-labs/Agents-Anywhere/releases)：**v2.1.0**（2026-10-27 發布）是最新可見正式版；但 GitHub **README 下載表仍標 v2.0.3**。另外 main 開發分支的 Connector 套件版本不代表已有該版本的可供一般使用者下載安裝包。本文不把 README、Release 或 main 的功能無差別合併。

[2.1.0 發行說明](https://github.com/anywhere-labs/Agents-Anywhere/releases/tag/v2.1.0) 特別指出 Desktop、Connector、DSH 插件的本機通訊轉為 MeshCall，**2.0.x 與 2.1.0 不相容**；自架 Server 需做資料庫遷移 `v2_42` 至 `v2_44`。安卓和 iOS 的 2.0.3 客戶端仍可使用部分功能，但特定續期／模型清單能力需 2.1.0。新部署或升級應使用同一個相容版本組合，先備份再升級。

## 4｜建議的審核型導入程序（尚未執行）

1. 在測試環境部署一個**與正式帳號、真實金鑰隔離**的 Server 和 Connector，固定 v2.1.0 標籤與套件來源；不直接把管理介面暴露在公開網際網路。
2. 建立低權限的測試工作目錄，驗證手機登入、建立／恢復會話、查看歷史及人工核准；保留 API 日誌與角色矩陣。
3. 執行負向案例：登出後憑證是否失效、不同帳號能否跨專案讀檔、斷線重新連接時是否重複執行、舊 Android APK 是否與新 Server 正常相容。
4. 核對 Server 的附件持久化、PostgreSQL／Redis 備份與還原、憑證輪換、傳輸 HTTPS、Connector 本地寫入邊界與 Terminal 審計。
5. 若要用於正式程式庫，先證明權限收斂、人工核准、故障恢復及機密文件處理能符合組織規範；再比較 Tailscale／SSH 遠端操作與專用 Agent 管理工作台的維護成本。

## 5｜採用判斷與授權

這項工具最有價值的是**多端監看、核准與原生 Agent 會話交接**。若只需要單一終端 CLI，也可能不值得引入持久 Server、Token 與附件資料庫。它不是 Agent 能力增強、Token 額度提升或讓手機直接具備桌機算力的解決方案。

官方 README 聲明原始碼 **MIT**，但本次未找到可直接讀取的根目錄 `LICENSE` 檔；因此只把「README 自述 MIT」記為作者授權主張，**實際商用再使用需核對發行檔與逐項第三方授權**。

## 來源台帳

- [GitHub README](https://github.com/anywhere-labs/Agents-Anywhere/blob/main/README.md) — A：官方定位、架構、客戶端與 Cloud 區域；文件可能落後發行版。
- [Connector/README](https://github.com/anywhere-labs/Agents-Anywhere/blob/main/connector/README.md) — A：RPC、Runtime 與本地系統權限；未執行或測安全。
- [Docker README](https://github.com/anywhere-labs/Agents-Anywhere/blob/main/docker/README.md)、[首次設定指南](https://github.com/anywhere-labs/Agents-Anywhere/blob/main/docs/getting-started.md) — A：官方自架與 Connector 流程，未搭建。
- [v2.1.0 Releases](https://github.com/anywhere-labs/Agents-Anywhere/releases/tag/v2.1.0) — A：發布版本、相容性與遷移要求；未在實機驗證。
- Agent 權限、資料治理與試驗設計 — C：工程推導；**NOT RUN**。
