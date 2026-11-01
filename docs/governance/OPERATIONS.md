# Research- 治理操作與故障回退手冊

**只適用研究資料庫，不會操作其他專案或本機 Agent。**

## 日常流程

1. 在 Issue／PR 說清楚研究目標、證據來源、排除範圍與期限。
2. 使用主分支之外的工作分支編輯 Markdown／JSON；新研究更新根目錄索引。
3. 運行 `python3 scripts/check_repository.py` 與 `python3 -m unittest discover -s tests -v`。
4. PR 中列出實際測試、資料來源與仍不確定的項目；審核時特別注意 `AGENTS.md`、`.github/`、`scripts/`。
5. GitHub 必過 CI 和 Ruleset 尚未設定完成前，**不可稱為強制審核流程**；是否合併由 Repo Owner 顯式決策。

## 文件驗證的能力和盲點

**目前可驗證：** 追蹤檔案的相對 Markdown 連結、JSON 語法、EAG-100 20 項控制與五項 P0 的存在、驗證程式單元測試。

**不能驗證：** 網站外部連結是否仍正確、論述是否真實、程式碼安全漏洞、個人資料、授權、GitHub 分支保護是否生效、外部模型行為。這些需另一層工具與人工審查。

## 緊急處理（需要人類批准）

- **遇到惡意或越權 Agent 行為：** 立即停用該 Agent / revoke 相關 token（需具有管理權限的人員執行）；記錄時間、影響檔案／權限與受影響帳號；不要把 secrets 放進 Issue。
- **PR 檢查失敗：** 讀取該 PR 的 Actions Log，先修內容／驗證器，不直接跳過檢查。
- **新 CI 或驗證器阻擋合法工作：** 在獨立 PR 提出可重現的誤報案例及修正；必要時由授權人暫停使用，但不得暗中降低 P0。
- **研究內容被改壞：** 用 Git Diff 找出差異，在審核後用 revert PR 回退；必要時恢復有來源的前一版 Markdown。
- **錯誤研究結論散布：** 標記撤回／修正、更新引用處、保留歷史與原因，避免直接刪掉研究證據。

## 演練項目（尚未執行）

| 演練 | PASS 條件 |
| --- | --- |
| 壞掉的 Markdown 本地連結 | CI 拒絕 PR |
| 無效 JSON | CI 拒絕 PR |
| 研究標準遺漏控制 ID | CI 拒絕 PR |
| GitHub Branch Ruleset | 未批准/未通過 Required Checks 的 PR 無法合併 |
| Git history recovery | 從已知 SHA 恢復文件，內容 hash 一致 |
| Prompt injection | 研究文件中的惡意指令不能取得工具權限 |
| Token Budget / Kill Switch | 超過限制時拒絕而不是越權重試 |

**RTO/RPO 不適合空口保證：** 研究庫的恢復目標應在實際演練後按需要設定，不能憑文件標稱零資料損失。