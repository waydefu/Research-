# 04｜Jev（JEV）型別化決策模型與路由

**查證狀態：** Jev 模型概念與相關社群插件原始碼可查；在 Hermes／Claude Code／Codex 的效率、毫秒延遲、成本降低幅度**未在此研究實測**。

## 1. Jev 是做什麼的

Jev 不是一般聊天模型。它接收「狀態 + 事先限定的問題與選項」，產出適合程式使用的結構化判斷，例如：
- **choice**：從已知幾個選項選擇路由；
- **score**：按指定級距判斷風險或重要度；
- **noul**：輸出 yes/no 類問題的機率。

模型結果可能含機率或信心資訊，但**這不是對真實正確率的保證**；應有人工審核、拒絕、fallback、離線基線與日誌。

## 2. 與一般 AI 程式代理的分工

```text
需求 / 工作狀態
      │
      ▼
Jev：分類、評分、建議下一個路徑
      │
      ▼
確定性程式：檢查 schema、權限、閾值、白名單
      │
      ├─ 可安全執行 → 指派適合模型或工具
      ├─ 不確定 → 人工確認 / 上升級別
      └─ 不可執行 → 阻擋
```

Jev 的「選擇」是模型推斷；真正的執行決策應仍由程式規則掌控。不能把「模型很快」等同於「程式毫秒級確定性」。

## 3. 社群 Claude Code 插件

[weiping/jev-claude-code](https://github.com/weiping/jev-claude-code) 的 README 描述：
- `PreToolUse(Bash)`：權限建議；
- `PostToolUse(Bash)`：長輸出濃縮；
- `UserPromptSubmit`、`SessionStart`：按需載入上下文；
- `PreToolUse(Agent)`：子代理路由與重複工作辨識；
- **預設 shadow mode**：只記錄判斷，不影響操作，轉 enforce 才真正介入。

這是**第三方插件**，不是 Anthropic 內建 Claude Code 功能；需要核對版本、API 金鑰、實際計費與權限掛鉤。

## 4. 安全與測量

建議採三階段：
1. **Baseline**：不使用 Jev，記錄成功率、延遲、總 Token、成本；
2. **Shadow**：讓 Jev 只做判斷與紀錄，不控制工具；
3. **Enforce（需明確授權）**：通過基線與安全測試後，才允許它控制低風險路由。

必須在測試中處理模型不可用、無答案、低信心、路由錯誤、權限邊界和非預期工具。高風險動作不能僅憑 Jev 評分自動放行。

## 5. 可能適用與不適用

**可能適用：** 大量小型任務需要反覆分類、工具選擇或代理指派，且每個選項可被清楚定義。  
**不適用：** 複雜長鏈推理、未知問題的自由生成、沒有備援機制的安全裁決。

## 來源

- [Jev AI：模型與 typed decisions 的公開說明](https://github.com/jev-ai/typesafe-ai-jev)
- [TypeSafe 官方文件入口](https://docs.typesafe.ai/)
- [weiping/jev-claude-code 原始碼](https://github.com/weiping/jev-claude-code)
- [相關工程實驗範例（社群，非效能保證）](https://github.com/TypeSafeAI/jev-harness)
