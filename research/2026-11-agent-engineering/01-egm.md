# 01｜Elephant–Goldfish Model（EGM）

**專案：** https://github.com/google/elephant-goldfish-model  
**官方站：** https://egm.dev/  
**狀態：** 已核對官方專案與文件；未在使用者本機執行完整端對端測試。

## 1. 這是什麼

EGM 是開源的 **Spec-Driven Development（規格驅動開發）插件**，不是新的底層語言模型。它讓熟悉專案背景的 Elephant 草擬設計文件，再用新上下文（fresh-context）Goldfish 子代理審查設計缺漏、假設、與程式碼的一致性，最後由使用者決定。

官方專案明確標註 **not an officially supported Google product**；有 Google 開源來源，卻不代表有商用 Google 支援 SLA。

## 2. 角色與資訊邊界

- **Elephant：** 使用專案架構、需求、先前決策與溝通紀錄編寫規格。
- **Goldfish：** 從新對話上下文開始，讀取規格與相關原始碼，不能繼承 Elephant 的先前對話。這是上下文隔離，不是完全斷網、斷檔案系統。
- **Human：** 選擇取捨、批准設計和實作權限；AI 審查不代替 CI、測試、安全審查。

## 3. 官方 Skills

| Skill | 作用 |
| --- | --- |
| `egm-brainstorm` | 思考需求邊界並找出風險 |
| `egm-draft` | 產出逐節確認的 Markdown 設計文件 |
| `egm-review` | 多階段獨立審查規格 |
| `egm-review-loop` | 調度不同角色的審查 |
| `egm-resolve` | 分類審查發現並討論修正 |
| `egm-bootstrap` | 為既有程式庫建立／更新架構文件 |
| `egm-drift-report` | 查找核准規格與實際程式碼的落差 |

官方建議步驟：Brainstorm → Draft → Review/Resolve → 人工批准 → Implement → 適時 Drift Report；Skills 可視需求選用，不必每次全跑。

## 4. 官方安裝示例（僅研究，不會自動執行）

Claude Code：

```sh
claude plugin marketplace add google/elephant-goldfish-model
claude plugin install egm@egm
```

Codex：

```sh
codex plugin marketplace add google/elephant-goldfish-model
codex plugin add egm@egm
```

需安裝**完整插件**，不能只複製 `skills/`；它依賴 `agents/` 與 `resources/` 等內容。啟動新 Session 後確認實際可用。Codex 透過 Skill 選擇器，Claude Code 一般使用 `/egm:egm-draft` 等命令。

## 5. 如何放進 Repository

- **推薦：** 把 EGM 產出的規格、審查記錄與決策放在 Repo 的 `docs/designs/` 等目錄，以 Git 追蹤。
- **插件啟用：** 由支援的代理宿主依官方規則安裝／啟用；Repo 裡有設定，不等於該機器已經下載並跑通插件。
- **完整內嵌插件：** 要評估授權、版本固定、上游安全更新與所有 runtime 檔案，不能只丟一個 `SKILL.md`。
- **安全：** 禁用子代理的宿主，Goldfish review 應停止；不要讓父代理假冒獨立審查。

## 6. 評估

**適合：** 架構修改、資料模型變更、安全信任邊界、規格模糊的大型功能。  
**不適合：** 一行明確的小修、時間與使用額度極受限的簡單任務。

可能減少返工，但目前**沒有在此研究中測出** Bug 下降率、節省 Token 比例或成功率。Review 的可用性要在目標宿主驗證。

## 7. 延伸到 AKM

在 `waydefu/delta` 的 AKM 計算研究上，最值得先產生的是「配件相容性與面板算法規格」。先標注遊戲實測與推導公式的證據等級，再讓獨立審查找矛盾。EGM 不會自動取得遊戲真實機制。

先前有 [DELTA LAB EGM 整合 PR #15](https://github.com/waydefu/delta/pull/15)；PR 存在不等於 Hermes 本機已驗收、合併或 Goldfish review 已完成。

## 來源

- [Google EGM README](https://github.com/google/elephant-goldfish-model)
- [EGM Getting Started](https://github.com/google/elephant-goldfish-model/blob/main/docs/getting_started.md)
- [EGM Harnesses：支援與限制](https://github.com/google/elephant-goldfish-model/blob/main/docs/harnesses.md)
- [EGM Codex 整合](https://github.com/google/elephant-goldfish-model/blob/main/docs/codex.md)
- [EGM 測試指引](https://github.com/google/elephant-goldfish-model/blob/main/TESTING.md)
