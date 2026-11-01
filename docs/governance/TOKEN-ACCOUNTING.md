# Agent Token 用量欄位契約（2026-11-02）

本文件說明 [agent_usage_audit.py](../../scripts/agent_usage_audit.py) 的**事後用量核算格式**。本工具只依已收集的 JSONL 做總量報表，**不會讀取任何 Provider 帳單、不會向外部 API 查詢，也不會限制實際配額**。

## 已修正的風險

OpenAI Responses 的 `usage.input_tokens` 已包含可由 `input_tokens_details.cached_tokens`、`cache_write_tokens` 分解的輸入 Token；不能把快取數再加一次。Anthropic Messages 的 `usage.input_tokens` 只代表未快取的輸入，另需加上 `cache_creation_input_tokens` 與 `cache_read_input_tokens`。

**新格式必須提供 `input_token_basis`，不可依模型名稱猜測。**

| `input_token_basis` | 輸入 Token 總數公式 | API 範例 |
| --- | --- | --- |
| `inclusive` | `input_tokens` | OpenAI Responses `usage.input_tokens` |
| `exclusive` | `input_tokens + cache_read_tokens + cache_write_tokens` | Anthropic Messages `usage` |

總 Token = 根據基礎語意計算的輸入 Token + `output_tokens`。快取數在 `inclusive` 下僅供觀測，不會重複加總；若任一快取部分大於總輸入，拒絕該筆紀錄。兩種語意的 **成本仍不可單純用統一每 Token 單價推算**：快取讀／寫有不同價格與 TTL，`cost_usd` 必須使用已核實的資料來源，未知填 `null`。

## 每行 JSONL 必填

`task_id`、`model`、`input_token_basis`、`input_tokens`、`output_tokens`、`cache_read_tokens`、`cache_write_tokens`、`tool_calls`、`duration_ms`、`success`、`cost_usd`。

- `input_token_basis` 只接受 `inclusive` 或 `exclusive`。舊紀錄若缺少此欄，**刻意失敗**，避免誤報。
- `input_tokens`、`output_tokens`、快取 Token、工具呼叫與耗時都必須是非負整數；`success` 必須是 JSON boolean。
- `cost_usd` 使用非負美元數字／字串或 `null`；若任何一筆未知，總貨幣成本維持 `null`。
- `duration_ms` 是各次呼叫耗時的加總，不等於實際任務牆鐘時間。
- 單一任務的 `success` 若任一次模型呼叫為 true，目前會被計為成功任務；請由資料輸入端在任務結束時明確定義成功標記，避免誤用模型請求成功作為業務完成。

### 例子 A：OpenAI Responses（輸入已含快取）

```json
{"task_id":"demo-openai","model":"example-openai-model","input_token_basis":"inclusive","input_tokens":100,"output_tokens":20,"cache_read_tokens":30,"cache_write_tokens":10,"tool_calls":1,"duration_ms":100,"success":true,"cost_usd":null}
```

計算結果：**100 + 20 = 120 tokens**，不是 160。

### 例子 B：Anthropic Messages（快取額外分項）

```json
{"task_id":"demo-anthropic","model":"example-anthropic-model","input_token_basis":"exclusive","input_tokens":60,"output_tokens":20,"cache_read_tokens":30,"cache_write_tokens":10,"tool_calls":1,"duration_ms":100,"success":true,"cost_usd":null}
```

計算結果：**60 + 30 + 10 + 20 = 120 tokens**。

這兩行都只是**人工合成範例**，不是使用者的真實 Token 消耗。

## 使用

```bash
python3 scripts/agent_usage_audit.py local-usage.jsonl --warn-above-tokens 100000
```

- 從原始 OpenAI Responses 對應：`input_tokens = usage.input_tokens`；`cache_read_tokens = usage.input_tokens_details.cached_tokens`；`cache_write_tokens = usage.input_tokens_details.cache_write_tokens`；`output_tokens = usage.output_tokens`；`input_token_basis = inclusive`。
- 從 Anthropic Messages 對應：`input_tokens = usage.input_tokens`；`cache_read_tokens = usage.cache_read_input_tokens`；`cache_write_tokens = usage.cache_creation_input_tokens`；`output_tokens = usage.output_tokens`；`input_token_basis = exclusive`。
- 若新模型／第三方 Gateway 用量語意不明確：**不要匯入或填猜測值**，先查核對方 API 規格，決定輸入是 inclusive 或 exclusive。
- `--warn-above-tokens` 只會讓**報表命令**在超過門檻時回傳非零；**不代表可中止已經發生的 API 使用**。

## 原始來源

- [OpenAI Responses API Usage](https://developers.openai.com/api/reference/resources/responses/methods/create)
- [OpenAI API Usage and Costs](https://help.openai.com/en/articles/10478918-reviewing-api-usage-and-costs)
- [Anthropic Messages API Usage](https://platform.claude.com/docs/en/api/typescript/messages)

**驗收狀態：** 預期由 PR 的 GitHub CI 跑 `test_agent_usage_audit.py`，目前不宣稱有外部真實模型用量資料或已實施硬限額。
