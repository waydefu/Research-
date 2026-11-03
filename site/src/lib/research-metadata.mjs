// Editorial metadata overlay. The original Markdown is never rewritten.
export const CURATED = {
  'research/2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow.md': {
    title:'Arctic Waters：電影級 Three.js 海洋怎麼做？',
    lead:'拆解作者公開描述的製作流程：從模型生成、Blender 修整到瀏覽器即時場景，並清楚區分作者自述與尚未獨立驗證的數據。',
    topic:'3D 場景與 Shader',
    creator:{label:'Arctic Waters 原創作品（3DITIONS）',url:'https://3ditions.drop3.app/watch/arctic-waters/?film=hydra'},
    demos:[
      {label:'Arctic Waters / Hydra 原作互動頁',url:'https://3ditions.drop3.app/watch/arctic-waters/?film=hydra',note:'第三方作者作品；嵌入支援未驗證，無法顯示請使用原站'},
      {label:'Three.js 官方海面 Shader 範例',url:'https://threejs.org/examples/webgl_shaders_ocean',note:'通用教學示範；不是 Arctic Waters 的原始碼或同一作品'}
    ]
  },
  'research/2026-11-universal-web-engine/16-active-theory-quality-benchmark.md': {
    title:'Active Theory：頂級互動網站為什麼有質感？',
    lead:'比較可追溯的設計案例與我們可借鏡的原則，重點是場景、互動與內容是否服務同一個目的，而不只是特效數量。',
    topic:'視覺語言與 UX',
    creator:{label:'Active Theory 官方作品網站',url:'https://activetheory.net/'}
  },
  'research/2026-11-universal-web-engine/10-creative-direction-and-reference-sites.md': {
    title:'28 個互動網站案例：從美術到操作體驗',
    lead:'按照創作團隊與作品來源整理互動網站的視覺策略，並分清作者證據、案例目錄和我們尚未實測的內容。',
    topic:'案例與設計參考'
  },
  'research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap.md': {
    title:'Research- V3：研究館與電影式網站如何結合？',
    lead:'解釋為什麼選用 Astro 靜態內容館、如何保留全文與搜尋，以及 3D、敘事與正式上線應分階段完成的原因。',
    topic:'網站架構與內容系統'
  },
  'research/2026-11-universal-web-engine/22-immersive-scrollytelling-and-asset-performance.md': {
    title:'電影式網站：捲動、圖片載入與閱讀效能',
    lead:'把捲動敘事、資源預載與無障礙驗收拆成可執行的規則；不把 HTML 縮小比例當作載入速度提升。',
    topic:'網站效能與無障礙'
  }
};
const TOPIC_RULES = [
  ['3D 場景與 Shader', /three.?js|webgl|webgpu|shader|渲染|3d|glb|blender|sdf|nanite|gpu/i],
  ['動畫與互動', /motion|gsap|動畫|動效|滾動|捲動|scroll|transition|rive/i],
  ['視覺語言與 UX', /ui.?ux|美術|字型|字體|typography|ux|視覺|設計系統|design/i],
  ['網站架構與內容系統', /astro|next.?js|框架|framework|網站架構|web 架構|ssr|rsc|content collection/i],
  ['網站效能與無障礙', /性能|效能|accessibility|無障礙|lcp|inp|cls|performance/i],
  ['搜尋、索引與 RAG', /search|搜尋|fts5|rag|索引|檢索|retriev|向量|embedding/i],
  ['LLM 模型與推論', /llm|model|模型|moe|推論|tokens?|量化|qwen/i],
  ['Agent 工作流程', /agent|代理|orchestrat|mcp|hermes|子代理|skill/i],
  ['GitHub 與自動化', /github|ci.?cd|actions|workflow|自動化|流水線/i],
  ['安全、權限與稽核', /安全|security|auth|授權|audit|稽核|威脅|風險/i],
  ['資料庫與資料品質', /database|資料庫|sql|資料品質|etl|data/i],
  ['專案治理與規格', /治理|governance|規劃|規範|評估|評分|驗收|測試/i],
  ['案例與設計參考', /case|案例|作品|參考|benchmark|比較/i]
];
const TAG_RULES = [
  ['Astro', /Astro/i],['Three.js',/Three.?js/i],['WebGL',/WebGL/i],['WebGPU',/WebGPU/i],
  ['JavaScript',/JavaScript/i],['TypeScript',/TypeScript/i],['Next.js',/Next.js/i],
  ['React',/React/i],['CSS',/CSS/i],['GSAP',/GSAP/i],['Blender',/Blender/i],
  ['LLM',/LLM/i],['RAG',/RAG/i],['MCP',/MCP/i],['Agent',/Agent|代理/i],
  ['CI/CD',/CI.CD|GitHub Actions/i],['安全',/安全|Security/i],['搜尋',/搜尋|Search/i],
  ['效能',/效能|Performance/i],['介面設計',/UI.UX|介面|美術/i],['資料',/資料庫|Database/i]
];
const plain = value => value.replace(/!\[([^\]]*)\]\([^)]+\)/g,'$1')
  .replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/<[^>]+>/g,'')
  .replace(/[*_~#]/g,'').replace(/\s+/g,' ').trim();
function overview(raw){
  const paragraphs=raw.split(/\n\s*\n/).map(p=>p.trim()).filter(p=>
    p.length>=55 && p.length<=650 && !/^(#|\||- |\* |>)/.test(p)
    && !p.includes('\n|') && !p.startsWith('**研究日期') && !p.startsWith('**查證日期')
  );
  const line=plain(paragraphs[0]||'');
  return line.length>190?line.slice(0,187).replace(/[,，；; ]+$/,'')+'…':line;
}
function externalLinks(raw){
  const seen=new Set(),out=[];
  for(const m of raw.matchAll(/(?<!!)\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g)){
    const label=plain(m[1]),url=m[2].replace(/&amp;/g,'&');
    let parsed;try{parsed=new URL(url)}catch{continue}
    if(parsed.protocol!=='https:' || parsed.hostname==='github.com'&&parsed.pathname.startsWith('/waydefu/Research-'))continue;
    if(!label||seen.has(url))continue;
    seen.add(url);out.push({label:label.slice(0,90),url});
    if(out.length>=12)break;
  }
  return out;
}
export function enrichResearch(doc){
  const c=CURATED[doc.file]||{};
  const token=doc.title+' '+doc.id;
  const topic=c.topic||TOPIC_RULES.find(([,re])=>re.test(token))?.[0]||'跨領域研究';
  const tags=TAG_RULES.filter(([,re])=>re.test(token)).map(([name])=>name).slice(0,5);
  const intro=c.lead||overview(doc.text);
  return {
    ...doc,publicTitle:c.title||doc.title,summary:intro||'原始研究已收錄；白話導讀尚待補充。',
    summaryReviewed:Boolean(c.lead),topic,tags,
    kind:/案例|case|benchmark|作品/i.test(token)?'案例解析':/規範|治理|驗收|guide|workflow/i.test(token)?'工程方法':'技術研究',
    creator:c.creator||null,demos:c.demos||[],externalLinks:externalLinks(doc.text)
  };
}
export const topicsFor=docs=>[...new Set(docs.map(d=>d.topic))].sort((a,b)=>a.localeCompare(b,'zh-TW'));
export const tagsFor=docs=>[...new Set(docs.flatMap(d=>d.tags))].sort((a,b)=>a.localeCompare(b,'zh-TW'));
