# 04｜UI/UX Agent Skills：設計品質與可重現規範

**價值：高；研究更新：2026-11-02。** 下列工具曾於十月討論；最新功能以各原始來源為準。並非全數已安裝。

## 第一梯隊（原始專案已核對）

| 技術 | 最重要能力 | 最適合的場景 | 風險／限制 |
| --- | --- | --- | --- |
| [Impeccable](https://github.com/pbakaus/impeccable) | UX critique、視覺層級、可及性、排版、細節精修 | 既有畫面審查和 UI 精修 | 建議可能與產品既有視覺語言衝突 |
| [GOATED UI Skill](https://github.com/flash-hero/GOATED-UI-SKILL) | 互動與 Web 特效配方、GSAP／Lenis／CSS／WebGL | 高階展示、動效原型 | 動效堆疊、依賴、手機 GPU 與無障礙風險 |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | UX 設計模式、框架規範、色彩與 Design System 檢索 | 選擇風格、組織設計依據 | 版本和免費／付費功能需分清 |
| [Anthropic Skills](https://github.com/anthropics/skills) | 可重用 `SKILL.md` 標準與開發範例 | 製作自己的代理能力庫 | 不應取代測試與授權 |

### 對 AKM「軍械室」的真正價值

1. **Impeccable**：審查左右資訊層級、對比度、手機可操作性、焦點和錯誤狀態。
2. **GOATED UI**：只借用特定效果的配方，**不把全部 GSAP／Lenis／WebGL 動效框架一次塞進去**。
3. **UI UX Pro Max**：提供 typography、spacing、responsive、設計 token 的參照，與現有深色軍械室主題協調。
4. **現有 `DESIGN.md` 優先**：Skill 產生的是候選建議，不得直接覆蓋已批准的視覺風格或武器比例資料。

## 十月也研究過的第二梯隊

- **21st.dev、React Bits、Aceternity UI、Magic UI、Motion Primitives**：元件靈感與互動參考；避免複製缺乏授權確認的商業元件。
- **oil-ui / oil-frontend / oil-motion**：AI Art Director、前端規範與動畫設計思路；十月的研究結論是可當選項生成／獨立視覺審查，**不能當核心治理層**。
- **Emil Kowalski、Matt Pocock、Addy Osmani 系列 Skills**：具體 repo、維護狀況與最新授權尚待逐項核實，作為候選，不宣稱原生支援。
- **Graphify、Diagram Design、ISO-GLOW、iso-figure**：圖表及等角投影設計候選；不當成已安裝工具。

## 選型標準

| 評分維度 | 可量測的驗收 |
| --- | --- |
| 可讀性 | 手機文字是否可讀、資訊順序是否清楚 |
| 可及性 | 鍵盤焦點、reduced motion、色彩對比 |
| 效能 | 低階裝置 FPS、首次載入、JS 和 GPU 消耗 |
| 安全與授權 | 第三方程式／素材來源和授權已核對 |
| 風格一致性 | 不偏離已批准的 AKM 軍械室視覺 |

**建議：優先 Impeccable + UI UX Pro Max 的審查方法；特效再按需引入 GOATED UI。** 這是研究建議，不是安裝授權。
