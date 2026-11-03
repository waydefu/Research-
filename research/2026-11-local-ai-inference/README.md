# 2026/11｜Local AI Inference：大型 MoE、分層記憶體與本地推論

**研究日期：2026-11-03（Asia/Taipei）**  
**範圍：** 本地 AI 推論引擎、MoE expert streaming、RAM/VRAM/NVMe 分層、量化與實機效能。  
**證據原則：** 上游 benchmark 與社群測量只視為特定硬體證據；沒有在本 Repo 重跑就不標成已驗收。

## 技術條目

1. [01｜Colibri：讓超大型 MoE 以 VRAM / RAM / NVMe 分層執行](01-colibri-moe-streaming.md)

## 分類

```text
Local AI
└─ Inference Runtime
   ├─ Dense / mostly-resident
   │  └─ llama.cpp / GGUF 類
   └─ Sparse MoE / heterogeneous memory
      └─ Colibri
         ├─ hot experts   → VRAM
         ├─ warm experts  → RAM
         └─ cold experts  → NVMe / disk
```

這裡的重點不是「用很少 RAM 神奇壓縮整個模型」，而是**不要求所有參數同時常駐快速記憶體**，把 MoE 的稀疏啟用特性轉成可用的分層儲存與推論策略。

**本研究沒有在任何個人裝置安裝 Colibri，也沒有下載數百 GB 模型。**
