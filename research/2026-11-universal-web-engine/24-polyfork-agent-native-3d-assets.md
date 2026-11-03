# 24｜Polyfork：Agent-native 3D、Parametric Assets 與 Asset-as-Code

**查證日期：2026-11-03（Asia/Taipei）**  
**官方網站：** [polyfork.dev](https://polyfork.dev/)  
**資產目錄：** [polyfork.dev/assets](https://polyfork.dev/assets)  
**Agent / MCP：** [polyfork.dev/agents](https://polyfork.dev/agents)  
**授權：** Polyfork 自訂資產授權；不是 MIT / Apache 等開源軟體授權。  
**定位：** Creative Web → Agent-native 3D → Procedural / Parametric Assets → Asset-as-Code

## 一句話結論

Polyfork 最值得研究的不是「又一個 3D 素材網站」，而是它把 3D 資產設計成：

> **可被程式呼叫、可由 typed knobs 重建、可被 Agent 檢索與修改的資產程式。**

對本技術庫而言，它補上目前 Three.js / WebGPU 研究最缺的一層：

```text
Agent
  ↓
Asset discovery / selection / variants
  ↓
Polyfork parametric assets
  ↓
Three.js scene / animation
  ↓
LOD / culling / streaming / WebGPU
```

Three.js 解「怎麼畫」；threejs-nanites 解「大量幾何怎麼畫」；Polyfork 則主要解「場景裡的 3D 東西從哪裡來、怎麼讓 Agent 理解與修改」。

---

## 1. 目前官方提供什麼

截至 2026-11-03，Polyfork 首頁顯示：

- **2,901 個 low-poly assets**。
- low-poly catalog 全部免費。
- **1,567 個 HD editions**，屬付費層。
- themed kits。
- 直接 Three.js ES module import。
- GLB / FBX / USDZ / OBJ。
- REST API。
- MCP server。
- procedural terrain。
- machine-readable remix knobs。

這些數字是**官方網站時間快照**，會持續變動，不應寫死成永久規模。

---

## 2. Asset-as-Code：不是只有 frozen mesh

Polyfork 自己把資產描述為「a small program, not a frozen mesh」。

Three.js 路徑可直接：

```js
import { createAsset } from 'https://polyfork.dev/cdn/{id}.mjs'

const asset = createAsset()
scene.add(asset)
```

官方說明：

- `createAsset()` 回傳 `THREE.Group`。
- 不需要額外 loader。
- 不需要 `await`。
- modules 以目前 Three.js stable core API 為目標。
- 同一資產也有 GLB。

這裡真正值得留下的是**資產的程式化表示**：

```text
Asset
├─ geometry builder
├─ typed knobs
├─ palette / materials
├─ proportions
├─ optional part counts
├─ named groups
├─ pivots / hinges / axles
├─ dimensions / metadata
└─ matching / kit relationship
```

對 Agent 而言，這比「拿到一個完全不透明的 GLB」更容易推理與修改。

---

## 3. Parametric / Remixable 資產

官方目前的 remixable assets 可暴露：

- curated palettes
- per-part colors
- shape options
- proportions
- part counts

網站 slider 改動時，資產可重新生成。

另外 knobs 會以 machine-readable JSON 發布，讓 AI coding tools 可以直接控制。

### 研究價值

這建立了一個比普通 asset library 更適合 Agent 的操作面：

```text
prompt
  ↓
選資產
  ↓
讀 knob schema
  ↓
修改參數
  ↓
重新生成 geometry
  ↓
preview / place into scene
```

這不是 generative 3D model 本身；比較接近**可被 Agent 操作的 parametric asset factory interface**。

---

## 4. Agent-native MCP / API

官方目前提供：

```text
MCP  https://polyfork.dev/mcp
REST https://polyfork.dev/api
```

MCP 是 JSON-RPC 2.0 over HTTP POST / Streamable HTTP，官方列出的 tools 包含：

- `search_assets`
- `get_asset`
- `find_matching`
- `get_variant`
- `preview_scene`
- `list_kits`
- `get_kit`
- `get_terrain`
- `who_am_i`
- `buy_plan`
- `get_help`
- `report_need`

Browsing 不需要 API key；Bearer key 主要用於存取帳號已擁有的付費檔案。

REST 也提供：

- asset search
- asset metadata
- matching assets
- variants
- kits
- demand requests

### 對 Agent 工程的意義

這是一個很好的「**domain-specific MCP**」案例：

Agent 不必先：

1. Google 找模型。
2. 猜授權。
3. 下載十個 GLB。
4. 自己解析尺寸與名稱。
5. 再人工試擺。

而可以直接以結構化 metadata 查：

- 這是什麼資產？
- 尺寸多大？
- triangle budget 是否可接受？
- 有哪些 matching assets？
- 屬於哪個 kit？
- 有哪些 knob？
- 可否先 preview？

這種 MCP 的價值應以**完成場景任務是否省 Token / 時間 / 返工**驗證，而不是只看 tool 數量。

---

## 5. Kit Contract：美術一致性也結構化

官方說明 themed kit 內的 assets 共用：

- palette
- scale
- grid

因此 kit 不只是「一個資料夾裡很多模型」，而是某種可機器理解的 style contract。

這對 Agent 自動組場景很重要。

生成式場景常見問題是：

> 每個物件單獨合理，但比例、色盤、風格彼此打架。

Kit metadata 可以把「同一世界」這件事部分變成資料約束，而不是只靠 Agent 的視覺猜測。

---

## 6. Procedural Terrain 與 64m World Grid

Polyfork 官方 FAQ 說：

- 每個 kit 可帶 procedural terrain program。
- terrain 本身也有 knobs。
- 不同 kit 的 terrain 採共用 **64m world grid**。
- 設計目標是可 edge-to-edge 拼接。

這讓 Agent 做世界組裝時，可以使用固定 grid 而不是完全自由手擺。

### 可借鑑的設計

```text
World
├─ Kit A
│  ├─ terrain tile
│  ├─ buildings
│  └─ props
├─ Kit B
│  ├─ terrain tile
│  ├─ vegetation
│  └─ vehicles
└─ Shared 64m grid
```

對 Web 3D、簡化版 world builder、互動式故事場景都很適合。

---

## 7. 動畫友善的資產結構

官方說明，應該會動的零件會拆成 named groups，並把 pivot 放在合理位置，例如：

- lid → hinge
- wheel → axle
- door → hinge

因此很多基礎動畫不必重新進 Blender 修 pivot。

對 Creative Web 很實用：

```js
door.rotation.y = angle
wheel.rotation.x += speed
```

但這不代表資產都有完整 skeletal animation / rig。

---

## 8. 格式與引擎相容性

官方目前提供：

| 格式 | 主要用途 |
| --- | --- |
| ES Module | Three.js 直接程式化使用 |
| GLB | Three.js / Godot / Blender / glTF engines |
| FBX | Unity / Unreal / Maya / 3ds Max |
| USDZ | iOS AR Quick Look |
| OBJ | 基礎 geometry interchange |

Polyfork 表示 Three.js modules 以 r150+ stable core APIs 為目標。

**研究判斷：**真正有差異化的是 ES module + knob schema；其他 mesh formats 則提供一般 DCC / engine interoperability。

---

## 9. 授權邊界：這裡要非常精確

Polyfork 使用自己的資產授權。

### 一般可做

官方 licensing 頁允許：

- personal projects
- commercial projects
- games / apps / websites
- client work
- products
- recolor / remix / decimate / combine / animate
- 無需 attribution

### 不能做

- 把 asset 本身重新販售。
- 把 asset 當 asset pack / template library 重新散布。
- 把原始或修改後檔案重新上傳到其他 marketplace / file sharing。
- 用 catalog 建立或訓練一個**商業 3D asset generator**。
- 把 Polyfork generation 直接包成自己的對外生成服務，除非另外取得協議。

### 免費資產 hotlink 是特例

這點非常重要。

官方明確寫：

> **直接從 Polyfork CDN 載入免費 low-poly assets，不算 redistribution。**

因此 world builder、agent、platform 可以：

- 讓使用者搜尋免費模型。
- 從 Polyfork API 選資產。
- 直接 hotlink Polyfork CDN。
- 在使用者的 browser / app 由 Polyfork 端載入。

這種情況**不需要 Platform License**。

### 什麼時候要 Platform License

如果產品：

- 把資產存到自己的 server。
- mirror 到自己的 CDN。
- proxy / cache 成自己的副本。
- 從自己的服務把 standalone asset file 發給使用者。
- 自己託管 HD assets 給平台使用者。

那就是 redistribution / serving，需 Platform License。

### 對本 Repo 的操作規則

**Research Showcase 若要使用免費 low-poly：**

優先：

```text
Polyfork CDN URL → browser
```

不要未經授權：

```text
Polyfork file → copy into our repo/public/assets → redistribute
```

如果要把檔案永久 vendor 進專案、自己 CDN、離線部署，先重新核對當時授權。

---

## 10. 一個值得注意的資料不一致

2026-11-03 查證時：

- 首頁目前顯示 **2,901 low-poly assets**。
- Platform Licensing 頁仍出現較舊的 catalog 數字。

因此：

> **資產總數應以當日 catalog / homepage 動態值為主，不應把不同頁面的歷史數字混成精確統計。**

這也證明採用外部 asset API 時，catalog size 是動態資料。

---

## 11. 與 threejs-nanites / Three.js 的關係

三者不是競爭品。

### Polyfork
解：

> 有什麼 3D 資產？Agent 怎麼選？怎麼改？怎麼保持風格一致？

### Three.js
解：

> 場景、材質、燈光、相機、動畫、shader 怎麼渲染？

### threejs-nanites
解：

> geometry / instance 量爆炸時，如何用 LOD、GPU culling、HZB、impostor、streaming 控制成本？

組合可變成：

```text
Prompt / design intent
        ↓
Agent
        ↓
Polyfork MCP / REST
        ↓
Asset + knobs + kit metadata
        ↓
Three.js scene graph
        ↓
Animation / lighting / shaders
        ↓
if massive scene:
LOD / culling / impostor / WebGPU
```

這是目前技術庫中很完整的一條 **Agent-native 3D Web pipeline**。

---

## 12. 對 Research Showcase 的適用性

### 很適合

- low-poly / stylized world。
- 背景 props。
- 建築 / 車輛 /植被。
- 需要快速建立一致美術世界。
- Agent 自動找素材與生成 scene draft。
- 手機友善的簡化 3D 場景。

### 不一定適合

- 寫實人物主角。
- 超高寫實 hero asset。
- photogrammetry。
- AAA cinematic close-up。
- 必須完全原創、不希望看出 catalog style 的作品。

因此 Research Showcase 比較適合：

> **Polyfork 當「場景基礎層 / props layer」，原創 hero visuals 與 shader art 仍自己做。**

這樣比較不會把整個網站做成「素材包展示頁」。

---

## 13. Agent 導入前的最低 PoC

如果未來真的接 MCP，不應直接全站採用。

至少做一個小型場景：

```text
需求：中型戶外場景
- 1 terrain
- 2 buildings
- 5 props
- 1 vehicle
- 1 animated door / wheel
```

記錄：

1. Agent 找到正確資產的成功率。
2. MCP tool calls。
3. Token。
4. wall time。
5. 是否需要人工重選。
6. triangle count。
7. draw calls。
8. asset load time。
9. 手機 FPS / frame time。
10. aesthetic consistency。
11. license path 是否符合。
12. CDN failure / 429 的 fallback。

如果 Agent 很會找，但最後美術品質不夠，就不能因為 MCP 很炫而強行採用。

---

## 14. 採用評級

| 面向 | 評級 | 理由 |
| --- | --- | --- |
| Web-ready 3D asset source | **A** | 格式齊、low-poly 免費、直接 Web 使用 |
| Three.js asset workflow | **A+** | ES module + THREE.Group + no loader |
| Parametric / procedural asset | **A** | typed knobs、可重建、terrain |
| Agent-native integration | **A+** | MCP + REST + metadata + preview |
| Creative Web | **A** | 適合作為場景素材層 |
| Massive-scene renderer | **不是它的工作** | 應交給 Three.js / WebGPU / culling pipeline |
| AAA realism | **B-/C** | 不是主要定位 |
| 授權簡潔度 | **B** | 商用友善，但屬自訂條款，平台 / redistribution 有明確邊界 |

---

## 15. 本技術庫的分類

```text
Creative Web
└─ Agent-native 3D
   ├─ Asset discovery
   │  ├─ MCP
   │  └─ REST
   ├─ Asset-as-Code
   │  ├─ Three.js ES module
   │  ├─ typed knobs
   │  └─ machine-readable metadata
   ├─ World consistency
   │  ├─ kits
   │  ├─ palette
   │  ├─ scale
   │  └─ 64m grid
   └─ Runtime handoff
      ├─ Three.js
      ├─ glTF / GLB
      └─ massive-scene rendering
```

## 原始來源

- [Polyfork](https://polyfork.dev/)
- [Assets](https://polyfork.dev/assets)
- [Licensing](https://polyfork.dev/licensing)
- [Platform Licensing](https://polyfork.dev/platform)
- [Agents / MCP](https://polyfork.dev/agents)
- [MCP endpoint](https://polyfork.dev/mcp)
- [REST API](https://polyfork.dev/api)
- [llms.txt](https://polyfork.dev/llms.txt)
- [prompt.txt](https://polyfork.dev/prompt.txt)

**證據界線：** 本條目依 2026-11-03 Polyfork 官方網站與授權頁整理；沒有在本 Repo 連接 MCP、下載資產、執行性能測試，也沒有法律意見。供應商對「AI-native」或 catalog 定位的描述視為產品自述，不當成第三方獨立驗證。
