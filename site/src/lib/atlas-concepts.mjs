export const concepts = [
  {
    slug: 'concept-a',
    code: 'A',
    title: '中央聖殿',
    subtitle: 'The Axis / 中央對稱',
    lead: '讓精密天文儀成為空間的絕對原點。',
    description: '沿著莊嚴的中軸線前進，從研究者的視角望向一座持續記錄未知的觀測核心。畫面著重對稱、比例與儀式性。',
    principle: '對稱構圖 · 建築重量 · 暗金輪廓',
    statement: '秩序先於奇觀。'
  },
  {
    slug: 'concept-b',
    code: 'B',
    title: '偏心觀測',
    subtitle: 'The Parallax / 偏心視角',
    lead: '讓知識的文字與觀測裝置共享主舞台。',
    description: '巨型觀測儀偏向畫面一側，另一側保留清晰的研究索引。非對稱的視線與有限的冷藍反光製造尺度感。',
    principle: '非對稱構圖 · 強烈留白 · 金色視線',
    statement: '每一次偏移，都有新的線索。'
  },
  {
    slug: 'concept-c',
    code: 'C',
    title: '長廊探索',
    subtitle: 'The Passage / 長廊透視',
    lead: '把進入研究館變成一段穿越知識的旅程。',
    description: '拱廊、觀測台與遠方光源沿透視軸線排列。訪客可以預見目的地，卻不必等待動畫才能立即閱讀內容。',
    principle: '深度構圖 · 遠近節奏 · 建築敘事',
    statement: '未知在長廊盡頭，也在每一篇記錄裡。'
  }
];
export const getConcept = slug => concepts.find(c => c.slug === slug);