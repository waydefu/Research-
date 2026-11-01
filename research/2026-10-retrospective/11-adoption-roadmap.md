# 11｜研究成果的實際使用優先順序

**這是一份研究決策建議，不是執行任務或授權。**  
評估基準：可追溯證據、有效回報、與現有工程契合、成本／額度、權限風險。

## 第一優先：拿現有證據減少返工

| 技術／做法 | 最適合的專案 | 不改設定就能開始的工作 | Gate |
| --- | --- | --- | --- |
| EGM 規格文件與 Drift 檢查理念 | delta、clinic、MUSIC | 先產生可核對設計規格與驗收條件 | 原版 Goldfish 需真正子代理 |
| Serena 唯讀 symbol 定位 | 多數 Coding Repo | 精準讀程式碼和引用點 | 工具範圍、回傳完整性 |
| 安全 CI（Semgrep／Gitleaks 等） | clinic、chat-beta、delta | 審閱現有掃描證據與 coverage | 不以單項 PASS 宣稱安全 |
| Impeccable／UI UX Pro Max | delta 網站 UI | 產出 UX 缺陷清單、版面和設計 token 建議 | 不直接改已批准風格 |
| 真實 A/B Bench | Hermes、所有新 MCP | 用固定樣本測量 ROI | 同模型、同任務、同版本 |

## 第二優先：針對現有產品補上量測

| 問題 | 建議實驗 | 需要的證據 |
| --- | --- | --- |
| AKM 動效不夠好 | 原生 WAAPI vs Motion／GSAP 原型 | FPS、首次載入、手機溫度、操作可及性 |
| AURORA 100% 有失真 | True Peak／THD+N／LUFS／phase 測試 | 固定輸入訊號、輸出音檔與版本 |
| 手機 LLM 太慢 | 不同量化和推論後端對照 | TTFT、t/s、RAM、熱節流 |
| 影片自動化 | OpenFilm vs Remotion 試作同一個 2–3 分鐘科普題目 | 素材成本、生成時間、人工修正、授權 |
| Agent 搜尋太重 | Native／Serena／CBM 對照試驗 | 讀檔次數、正確率、token、延遲、freshness |

## 暫不建議的行動

- 沒有通過 freshness oracle 就開啟 Codebase Memory MCP。
- 在既有 `default` Hermes 設定內直接打開並行 Haiku/Goldfish 子代理。
- 為了好看而同時導入多套前端動畫框架。
- 把 JEV 機率性路由結果當作安全授權決策。
- 未核實素材來源就批量製作商用影片。
- 因網路熱帖或宣傳數字就升級大型模型訂閱／購入套件。

## 從研究到實作的七個確認點

1. 來源、發佈日期與版本是否可追蹤？
2. 此工具對**一個明確問題**是否有必要？
3. 有無更簡單的原生方法？
4. 是否需要寫入、敏感權限、網路或憑證？
5. 有無可重現的對照組與驗收測試？
6. 結論和過去實驗是否衝突？是否已修復過去失敗條件？
7. 由使用者批准後，才進入另外 Repo 的實作 PR。

## 維護方式

每次新研究新增：`研究主題 / 原始來源 / 日期 / 有效性與限制 / 實測 / 採用決策 / 回退`。若證據無法復原，就標示**歷史說法待重驗**，而不是直接刪除失敗的研究。

這份十月總覽與 [十一月 EGM／Claude／Imagine／Jev](../2026-11-agent-engineering/README.md) 一起構成基礎技術資料庫。
