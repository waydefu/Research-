# NVIDIA AI Workbench：用 Git 與容器管理本地／遠端 AI Agent 開發環境

**資料核對：2026-11-07（Asia/Taipei）**  
**官方來源：** [NVIDIA AI Workbench 使用指南](https://docs.nvidia.com/ai-workbench/overview/introduction)／[安裝說明](https://docs.nvidia.com/ai-workbench/user-guide/latest/installation/overview.html)。  
**分類：** 開發環境管理、可重現容器、Git 變更監視、遠端 GPU、Agent 隔離。**未下載軟體、啟動容器、執行模型或連線遠端主機。**

## 這不是一鍵自動訓練模型的平台

AI Workbench 是 NVIDIA 提供的**免費開發環境管理平台**，在 Windows、macOS 或 Ubuntu 使用 Desktop App，可在本機或遠端工作站／GPU 主機管理專案；CLI 指令 `nvwb` 支援以 JSON 回傳供自動化操作。每個 Project 是帶有版本化環境描述的 Git Repo，透過容器執行開發工具、代理與應用。免費使用平台**不等於雲端算力、模型訓練、第三方服務或商業授權一律免費**。

| 組件 | 官方定位 | 工程意義 |
| --- | --- | --- |
| Project | Git Repo + 版本化設定 | 程式、套件與環境設定可追蹤 |
| `.project/spec.yaml` | 主環境規格檔，類似 devcontainer.json | 封裝容器建置／執行設定並保存版本 |
| Project Container | 專案隔離容器 | IDE、CLI、AI Agent 的程序與相依套件可限定在專案環境 |
| Location | 本地或遠端主機 | 同一套工作流在筆電、工作站、遠端 GPU 之間切換 |
| CLI / Desktop App | `nvwb` 與圖形介面 | 可視化變更、管理環境／工具與遠端位置 |

官方指引說明 VS Code、Cursor、Claude 等可連到容器環境；Web App（例如 JupyterLab）也能裝在容器內。**容器不是完整的惡意程式防護邊界**，Volume 掛載、網路、主機 Socket、GPU 裝置和 Agent 權限仍須單獨管控。不能把「隔離」理解為具備硬體虛擬機等級的保證。

## GPU 與作業系統的界線

NVIDIA [官方 FAQ](https://docs.nvidia.com/ai-workbench/user-guide/latest/reference/faqs/integration-faq.html) 明確表示**可在只有 CPU 的電腦安裝使用**；有 GPU 計算需求時可連接支援的遠端 GPU 環境，不是「一律需要 RTX 才能啟動」。Windows/macOS/Ubuntu 支援範圍與容器引擎／驅動需求須依最新版安裝文件核對。

**注意授權：** AI Workbench 下載／安裝受到 [NVIDIA AI Product Agreement / EULA](https://docs.nvidia.com/ai-workbench/user-guide/latest/installation/overview.html) 規範；不得把「免費工具」寫成「全部原始碼開源 MIT」。若在他人主機部署需核對遠端成本、連線方式、憑證與 SSH 信任邊界。

## 可重現的導入實驗（提案，非完成）

1. 建立同一份純測試 Git Repo 與 `.project/spec.yaml`；逐一記錄 Workbench 版本、Host OS、容器基底 Digest、CPU／GPU 裝置、驅動、Lockfile。
2. 在本地建立容器、跑最小單元測試；檢查 git diff 是否記錄環境變更及可否回退。
3. 移到另一個 Location 重建，比對依賴、命令輸出與實際 GPU 可用性；不要把網路可通當成權限安全。
4. 用沒有敏感金鑰的模擬 Agent 驗證檔案寫入邊界、Volume 權限、容器外網權限、GPU 服務及資料是否外洩。
5. 完整核對費用、介面限制與 EULA，再評估需要它還是一般 devcontainer + Docker／Podman 就足夠。

## 採用取捨

對需要在多部 Windows/Linux 主機重建 AI 工作環境、切換遠端 GPU 或把 Agent 固定在每個專案容器的人，它提供便利；對只需要簡單 npm／Python virtualenv 的專案，可能增加額外容器與平台維護成本。它是**候選工作流**，不代表已整合到既有開發系統。

## 來源台帳

- [NVIDIA AI Workbench Overview](https://docs.nvidia.com/ai-workbench/overview/introduction) — A：功能、容器、Git／遠端工作原理。
- [Install Guide](https://docs.nvidia.com/ai-workbench/user-guide/latest/installation/overview.html) — A：平台安裝與 EULA 提示。
- [官方 FAQ](https://docs.nvidia.com/ai-workbench/user-guide/latest/reference/faqs/integration-faq.html) — A：CPU-only 安裝聲明。
- [遠端環境管理](https://docs.nvidia.com/ai-workbench/how-to/locations/overview/) — A：SSH、Brev、Sync 與 GPU Location。
- 成本比較及威脅模型 — C：工程推論；**NOT RUN**。
