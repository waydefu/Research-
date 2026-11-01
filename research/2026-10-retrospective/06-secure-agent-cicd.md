# 06｜Agent 程式工程治理：CI、安全、權限與證據閘門

**價值：很高。** 比提高代理數量更適合當所有專案的預設原則。

## 十月研究／工作涉及的核心

| 技術 | 核心目的 | 研究定位 |
| --- | --- | --- |
| GitHub Actions | PR 檢查、測試、自動品質閘門 | 多 Repo 實際使用 |
| [Semgrep](https://github.com/semgrep/semgrep) | 靜態分析、偵測危險模式 | 安全 CI 選項／部分整合歷史 |
| [Gitleaks](https://github.com/gitleaks/gitleaks) | Git 內容的秘密憑證掃描 | 安全 CI 選項／部分整合歷史 |
| npm / dependency audit | 套件相依性漏洞 | 工程檢查 |
| Playwright | 真實瀏覽器 E2E、行動裝置模擬 | 前端驗收 |
| Firestore Emulator | 權限規則與資料行為的測試環境 | clinic 驗收 |
| RBAC / Trust Boundary | 明確角色權限、信任邊界、可稽核操作 | clinic 高優先度工程治理 |
| AGENTS.md / authority hook | 限制代理範圍及寫入權 | 模型無關治理 |

## 不能略過的硬規則

- 「CI 綠燈」只代表**已設定的檢查**成功，不代表所有安全問題都不存在。
- 「模型覺得安全」不能取代伺服器端權限驗證、密鑰隔離和日誌。
- PR、測試、覆蓋率、靜態掃描、人工批准需有可追溯證據；禁止無來源宣稱完成。
- 變更 GitHub Actions、Terraform、授權／部署權限等基礎設施，必須額外驗證是否引入權限升級路徑。
- 不可自動把 `workflow_dispatch`、工具權限、Repo 秘密或合併權限放寬。
- 靜態掃描可能漏報或誤報；安全相關結果要附分類和緩解決策。

## 實務上的三層驗收

1. **事實來源：** 現有程式、架構、資料庫規則、官方 API；不能依賴模型臆測。
2. **機械閘門：** lint / typecheck / unit / E2E / secret scan / dependency check；區分哪些關卡實際存在。
3. **人工批准：** 涉及權限、部署、資料刪除、合併及未知取捨，等待授權。

## 十月值得獨立查核的實例

- `clinic` 的認證、RBAC、Firebase／Firestore Rules、伺服器端權限與 CI。
- `chat-beta` 的回歸測試、PR 分段及缺陷追蹤。
- `2026novel` 的 Skills schema 與 Hook／CI 檢查。
- `delta` 的 3D mesh、模型檔 SHA、素材授權、資料來源和實機真值隔離。

上述專案並非所有檢查均完整；研究庫不把「曾提到」提升為「本次已確認部署」。

### 原始來源

- [GitHub Actions](https://docs.github.com/en/actions)
- [Semgrep](https://github.com/semgrep/semgrep)
- [Gitleaks](https://github.com/gitleaks/gitleaks)
- [Playwright](https://playwright.dev/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [clinic](https://github.com/waydefu/clinic)
- [chat-beta](https://github.com/waydefu/chat-beta)
