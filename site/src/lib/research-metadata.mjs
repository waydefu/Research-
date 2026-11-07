import {validateMetadataRegistry} from './metadata-schema.mjs';
import {REVIEWED_DOCUMENTS} from './research-taxonomy.mjs';
import {EDITORIAL_LEADS} from './research-leads.mjs';
// Editorial metadata overlay. The original Markdown is never rewritten.
export const CURATED = {
  'research/2026-11-agent-engineering/10-agents-anywhere-cross-device-agent-workbench.md': {
    title:'Agents Anywhere：跨手機與電腦管理 Codex、Claude Code 工作階段',
    topic:'Agent 遠端工作台',
    creator:{label:'Agents Anywhere 官方原始碼',url:'https://github.com/anywhere-labs/Agents-Anywhere'},
    demos:[
      {label:'官方 Web 工作台',url:'https://web.agents-anywhere.com',note:'需登入的原站服務；未註冊或實測，未核准嵌入'},
      {label:'官方正式發行版',url:'https://github.com/anywhere-labs/Agents-Anywhere/releases',note:'需依 Desktop／Connector／Android 實際版本核對相容性'}
    ]
  },
  'research/2026-11-edge-infrastructure/01-android-phone-termux-proot-home-server.md': {
    title:'舊 Android 手機當低功耗伺服器：Termux、PRoot 與長期可靠性',
    topic:'邊緣設備與自架服務',
    creator:null,
    demos:[{label:'Termux 官方 PRoot-Distro 文件',url:'https://github.com/termux/proot-distro',note:'技術文件而非 Redmi 10C 作者原始展示，未在 Android 設備實測'}]
  },
  'research/2026-11-agent-engineering/08-nvidia-skillspector-agent-skill-security.md': {
    title:'NVIDIA SkillSpector：安裝 Agent Skills 前如何掃描安全風險？',
    topic:'Agent 權限與安全',
    creator:{label:'NVIDIA / SkillSpector 官方原始碼',url:'https://github.com/NVIDIA/SkillSpector'},
    demos:[{label:'NVIDIA 官方技能掃描指南',url:'https://docs.nvidia.com/skills/scanning-agent-skills',note:'僅原站文件連結；未安裝、執行或放行任何掃描器'}]
  },
  'research/2026-11-agent-engineering/09-nvidia-ai-workbench-reproducible-agent-containers.md': {
    title:'NVIDIA AI Workbench：本地與遠端 AI 開發容器管理',
    topic:'AI 開發環境與容器',
    creator:{label:'NVIDIA AI Workbench 官方文件',url:'https://docs.nvidia.com/ai-workbench/overview/introduction'},
    demos:[{label:'官方功能與設定說明',url:'https://docs.nvidia.com/ai-workbench/overview/introduction',note:'文件非互動 Demo；未下載或連接遠端 GPU'}]
  },
  'research/2026-11-local-ai-inference/02-nvidia-parakeet-v3-multilingual-asr.md': {
    title:'NVIDIA Parakeet 第三版：25 種歐語辨識與中文支援限制',
    topic:'語音辨識與字幕',
    creator:{label:'NVIDIA Parakeet TDT 0.6B V3 模型卡',url:'https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3'},
    demos:[{label:'NVIDIA Parakeet 官方試用 Space',url:'https://huggingface.co/spaces/nvidia/parakeet-tdt-0.6b-v3',note:'僅連至原作者 Demo；本站未上傳音檔、未測試外站嵌入'}]
  },
  'research/2026-11-local-ai-inference/03-nvidia-broadcast-rtx-audio-video-effects.md': {
    title:'NVIDIA Broadcast：RTX 人聲降噪、鏡頭特效與檔案處理',
    topic:'影片製作與自動化',
    creator:{label:'NVIDIA Broadcast 官方產品頁',url:'https://www.nvidia.com/en-us/geforce/broadcasting/broadcast-app/'},
    demos:[{label:'官方功能展示與下載頁',url:'https://www.nvidia.com/en-us/geforce/broadcasting/broadcast-app/',note:'產品說明頁非通用 SDK；未測試 RTX 特效或允許 iframe'}]
  },
  'research/2026-11-universal-web-engine/38-noniv-webgpu-fft-ocean-renderer.md': {
    title:'Noniv Web Ocean：原生 WebGPU 六層 FFT 海面、泡沫與天空渲染',
    topic:'即時 3D 渲染與 Shader',
    creator:{label:'Noniv / web-ocean 原作者程式庫',url:'https://github.com/Noniv/web-ocean'},
    demos:[{label:'Web Ocean 作者互動展示',url:'https://ocean-noniv.vercel.app/',note:'僅保留原站連結；未實機執行 WebGPU，也未核准或驗證 iframe 內嵌'}]
  },
  'research/2026-11-universal-web-engine/36-gradientdeck-design-md-library-for-agents.md': {
    title:'GradientDeck UI：把真實網站整理成 DESIGN.md，讓 Agent 照風格設計',
    topic:'介面設計與視覺系統',
    creator:null,
    demos:[
      {label:'GradientDeck UI 官方資料庫',url:'https://ui.gradientdeck.com/',note:'僅連至原網站；未測試或允許 iframe 內嵌；運營者身分與內容授權未查證'}
    ]
  },
  'research/2026-11-universal-web-engine/37-threejs-grassworks-webgpu-grass-and-forest-demo.md': {
    title:'Three.js Grassworks：WebGPU 草地系統、森林展示與商用授權',
    topic:'即時 3D 渲染與 Shader',
    creator:{label:'Tech Redux／Three.js Grassworks 官方頁面',url:'https://grassworks.techredux.co/'},
    demos:[
      {label:'廢棄屋森林展示（官方）',url:'https://grassworks.techredux.co/forest-demo',note:'僅連至原網站；需 WebGPU 的桌機 Chrome／Edge；未測試或允許 iframe 內嵌；本站未執行此展示'}
    ]
  },
  'research/2026-11-universal-web-engine/34-forever-components-agent-retrieval-and-web-effects.md': {
    title:'Forever Components：可檢索網頁動效與 Agent 元件選型',
    topic:'創意前端工具與函式庫',
    creator:{label:'Forever AI Components 官方原始碼',url:'https://github.com/isas1/forever-ai-components'},
    demos:[
      {label:'官方網頁元件索引',url:'https://forevercomponents.com/components/',note:'僅連至原網站；未測試或允許 iframe 內嵌'},
      {label:'Kinetic Typography',url:'https://forevercomponents.com/components/kinetic-type/',note:'外部作者示例，沒有複製程式碼或預覽素材'}
    ]
  },
  'research/2026-11-agent-engineering/07-music-skill-editable-agent-composition.md': {
    title:'music-skill：AI Agent 如何寫出可修改的原創配樂？',
    topic:'Agent 工具與 Skills',
    creator:{label:'owoevan-dev / music-skill 官方原始碼',url:'https://github.com/owoevan-dev/music-skill'}
  },
  'research/2026-11-universal-web-engine/35-ui-typography-readability-and-cjk.md': {
    title:'UI 字體排版六原則：繁中、行長、字距與無障礙',
    topic:'介面設計與視覺系統',
    creator:null
  },
  'research/2026-11-universal-web-engine/33-uniforge3d-anchor-guided-multiview-3d-reconstruction.md': {
    title:"UniForge3D：少量多視角照片如何重建完整 3D 資產？",
    lead:"UniForge3D 將相機姿態未知的多視角照片，透過共同錨定座標空間連結幾何重建與生成模型，並為不同立體區域選擇最有用的照片特徵，最後輸出 GLB。研究核對論文、推論程式及原始授權；模型權重與背景移除工具的商用限制、GPU 成本和輸出品質仍需另行驗證。",
    topic:"AI 3D 重建與生成",
    creator:{"label":"UniForge3D 論文作者與官方作品頁","url":"https://xishuxishu.github.io/uniforge3d-project/"}
  },
  'research/2026-11-universal-web-engine/30-viper11-clouds-terrain-cinematic-rendering.md': {
    title:"VIPER 11：可穿越體積雲、真實地形與電影級鏡頭",
    lead:"從 VIPER 11 作者公開的技術筆記，理解瀏覽器體積雲、地表動態雲影、真實地形串流與電影鏡頭的協作方式。文章區分作者自述、可再利用的開源候選和尚未實測的效能數據。",
    topic:"即時 3D 渲染與 Shader",
    creator:{"label":"VIPER 11 官方作品與技術筆記","url":"https://viperoneone.com/notes/"}
  },
  'research/2026-11-universal-web-engine/31-brinewater-browser-open-world-and-agent-workflow.md': {
    title:"Brinewater：瀏覽器開放世界與 AI Agent 開發案例",
    lead:"Brinewater 展示以真實城市資料製作瀏覽器開放世界的可能性，並提供 AI Agent 分工、獨立工作樹與視覺驗收的研究線索。文章明確標示作者自述與未經遊戲實測的工程建議。",
    topic:"互動作品與設計案例",
    creator:{"label":"Brinewater 官方遊戲入口","url":"https://brinewater.vlad.yt/play/"}
  },
  'research/2026-11-universal-web-engine/32-aurea-residences-immersive-luxury-web-ux-review.md': {
    title:"ÁUREA Residences：精品住宅網站的視覺與互動驗收",
    lead:"以 ÁUREA Residences 作為精品住宅網站研究入口，整理全頁構圖、字體層級、捲動敘事與手機體驗的驗收方法。尚未取得可重現的 JavaScript 畫面，不能指認實際框架或動畫技術。",
    topic:"介面設計與視覺系統",
    creator:null
  },
  'research/2026-11-universal-web-engine/27-threejs-r187-ultra-rendering-ceiling.md': {
    schemaVersion:1,
    publicTitle:'Three.js r187 畫質上限：WebGPU、TSL、全域光與路徑追蹤',
    summary:'從官方 Three.js r187、WebGPU 渲染器和 TSL 出發，分析 PBR、SSGI、SSR、景深、陰影與 GPU 路徑追蹤的實際能力。比較可玩即時畫質與漸進式照片渲染，清楚標示 API 相容與尚未實測的性能。',
    domain:'2026-11-universal-web-engine',
    topic:'即時 3D 渲染與 Shader',
    tags:['Three.js','WebGPU','TSL','Shader','全域光'],
    creator:null,
    originalSource:{label:'Three.js 官方 WebGPURenderer 文件',url:'https://threejs.org/manual/pages/webgpurenderer'},
    demo:[{label:'官方 WebGPU SSGI 互動示範',url:'https://threejs.org/examples/webgpu_postprocessing_ssgi.html',note:'Three.js 官方範例；瀏覽器需支援相應後端，嵌入可用性未驗證'}],
    license:null,verifiedAt:'2026-11-05',image:null,evidenceLevel:'secondary'
  },
  'research/2026-11-universal-web-engine/28-advanced-shader-pipeline-and-hd2d-recipes.md': {
    schemaVersion:1,
    publicTitle:'高階 Shader 配方：海水、峽灣霧、反射、HD-2D',
    summary:'拆解海浪 Fresnel、Beer-Lambert、海岸泡沫、SSGI、SSR、體積霧與像素角色抗鋸齒的工程設計。整理 Frame Graph、降級方案與三個可重現 PoC；配方是設計推導，不是已部署程式。',
    domain:'2026-11-universal-web-engine',
    topic:'即時 3D 渲染與 Shader',
    tags:['Three.js','Shader','WebGPU','HD-2D','海水'],
    creator:null,
    originalSource:{label:'Three.js 官方 WebGPU RenderPipeline 指引',url:'https://threejs.org/manual/pages/webgpu-postprocessing.html'},
    demo:[{label:'Three.js 官方 SSR 反射示範',url:'https://threejs.org/examples/webgpu_postprocessing_ssr.html',note:'官方示範場景，使用的第三方模型素材由範例自行標示作者及授權'}],
    license:null,verifiedAt:'2026-11-05',image:null,evidenceLevel:'secondary'
  },
  'research/2026-11-universal-web-engine/29-rendering-ceiling-benchmark-and-adoption-gates.md': {
    schemaVersion:1,
    publicTitle:'3D 高畫質怎麼驗收？GPU 成本、真機與降級關卡',
    summary:'將 Three.js 高階視覺拆成行動裝置、桌面高畫質、研究級 Ultra 與漸進式照片模式；提供 Buffer 記憶體估算、效能診斷、資產壓縮、裝置測試欄位與 Go/No-go 標準，不虛構 FPS。',
    domain:'2026-11-universal-web-engine',
    topic:'即時 3D 渲染與 Shader',
    tags:['Three.js','GPU','WebGPU','效能','效能驗收'],
    creator:null,
    originalSource:{label:'Three.js 官方 WebGPURenderer 文件',url:'https://threejs.org/manual/pages/webgpurenderer'},
    demo:[{label:'WebGPU 路徑追蹤作者展示',url:'https://gkjohnson.github.io/three-gpu-pathtracer/index.html',note:'第三方開源作品示範；依裝置支援 WebGPU，非本站效能實測'}],
    license:null,verifiedAt:'2026-11-05',image:null,evidenceLevel:'secondary'
  },
  'research/2026-11-local-ai-inference/01-colibri-moe-streaming.md': {
    title:'Colibri：記憶體不足時，超大型 AI 模型怎麼運作？',
    lead:'Colibri 把大型 AI 模型的一部分資料留在固態硬碟，需要時才讀進電腦記憶體或顯示卡記憶體。它的目的是減少同時占用的記憶體，但不表示超大型模型能流暢對話；原作者的速度數據尚未經本站實測。',
    topic:'LLM 模型與推論'
  },
  'research/2026-11-local-ai-inference/README.md': {
    title:'本機 AI 入門：大型模型如何分配記憶體？',
    lead:'想在自己的電腦跑 AI，卻發現模型太大、記憶體裝不下？這篇先說明顯示卡記憶體、電腦記憶體和固態硬碟如何分工，再介紹 Colibri 的方法與速度限制。',
    topic:'LLM 模型與推論'
  },
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
validateMetadataRegistry(CURATED);
const TOPIC_RULES = [
  ['3D 場景與 Shader', /three.?js|webgl|webgpu|shader|渲染|3d|glb|blender|sdf|nanite|gpu/i],
  ['動畫與互動', /motion|gsap|動畫|動效|滾動|捲動|scroll|transition|rive/i],
  ['視覺語言與 UX', /ui.?ux|美術|字型|字體|typography|ux|視覺|設計系統|design/i],
  ['網站架構與內容系統', /astro|next.?js|框架|framework|網站架構|web 架構|ssr|rsc|content collection/i],
  ['網站效能與無障礙', /性能|效能|accessibility|無障礙|lcp|inp|cls|performance/i],
  ['搜尋、索引與 RAG', /search|搜尋|fts5|rag|索引|檢索|retriev|向量|embedding/i],
  ['LLM 模型與推論', /llm|model|模型|moe|推論|tokens?|量化|qwen/i],
  ['安全、權限與稽核', /安全|security|auth|授權|audit|稽核|威脅|風險/i],
  ['Agent 工作流程', /agent|代理|orchestrat|mcp|hermes|子代理|skill/i],
  ['GitHub 與自動化', /github|ci.?cd|actions|workflow|自動化|流水線/i],
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
  .replace(/\[([^\]]+)\]\([^)]+\)/g,'$1')
  .replace(/\x60([^\x60]+)\x60/g,'$1')
  .replace(/<[^>]+>/g,'').replace(/[*_~#]/g,'')
  .replace(/\s+/g,' ').trim();

function overview(raw) {
  const lines=String(raw).split(/\r?\n/);
  const visible=[];let fence=null;
  for(const line of lines){
    const edge=line.trim().match(/^(\x60{3,}|~{3,})/);
    if(edge){
      if(!fence)fence=edge[1][0];
      else if(fence===edge[1][0])fence=null;
      continue;
    }
    if(!fence)visible.push(line);
  }
  const paragraphs=visible.join('\n').split(/\n\s*\n/).map(x=>x.trim()).filter(p=>{
    if(p.length<50||p.length>850||!/[\u3400-\u9fff]/.test(p))return false;
    if(/^(#|\||[-*+] |\d+[.)]\s|>|<|---)/.test(p))return false;
    if(/^\*\*(研究日期|查證日期|更新日期|上游|範圍|證據原則|授權|定位|最新正式版)/.test(p))return false;
    if(/(?:^|\n)\s*(?:\||\d+[.)]\s|[-*+]\s)/m.test(p))return false;
    return true;
  });
  const text=plain(paragraphs[0]||'');
  return text.length>160?text.slice(0,157).replace(/[,，；; ]+$/,'')+'…':text;
}
function externalLinks(raw){
  const seen=new Set(),out=[];
  for(const m of raw.matchAll(/(?<!!)\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g)){
    const label=plain(m[1]),url=m[2].replace(/&amp;/g,'&');
    let parsed;try{parsed=new URL(url)}catch{continue}
    if(parsed.protocol!=='https:' || parsed.hostname==='github.com'&&parsed.pathname.startsWith('/waydefu/Research-'))continue;
    if(!label||seen.has(url))continue;
    seen.add(url);out.push({label:label.slice(0,90),url});
  }
  return out;
}
export function enrichResearch(doc){
  const c=CURATED[doc.file]||{};
  const reviewed=REVIEWED_DOCUMENTS[doc.file]||null;
  // Match the subject of this document before its parent folder.
  // A generic "agent" directory must not override a clear security/audit title.
  const basename=String(doc.id||doc.file||'').split('/').at(-1)||'';
  const subject=doc.title+' '+basename;
  const directory=String(doc.id||'').split('/').slice(0,-1).join('/') || doc.group || '';
  const topic=(c.schemaVersion===1 ? c.topic : reviewed?.topic||c.topic)||TOPIC_RULES.find(([,re])=>re.test(subject))?.[0]
    ||TOPIC_RULES.find(([,re])=>re.test(directory))?.[0]||'跨領域研究';
  if(c.schemaVersion===1 && c.domain!==doc.group) throw new Error('Metadata domain 與來源路徑不符：'+doc.file);
  const tags=c.schemaVersion===1 ? c.tags : reviewed?.tags||TAG_RULES.filter(([,re])=>re.test(subject)).map(([name])=>name).slice(0,5);
  const token=subject;
  // Canonical v1 remains authoritative. Current documents use individually reviewed,
  // source-bounded introductions; preserve old CURATED author/demo references.
  const editorialLead=EDITORIAL_LEADS[doc.file]||null;
  const intro=(c.schemaVersion===1 ? c.summary : editorialLead||c.lead)||overview(doc.text);
  return {
    ...doc,publicTitle:(c.schemaVersion===1 ? c.publicTitle : reviewed?.publicTitle||c.title)||doc.title,summary:intro||'原始研究已收錄；白話導讀尚待補充。',
    summaryReviewed:Boolean(c.schemaVersion===1 ? c.summary : editorialLead||c.lead),
    // Editorial work is not independent verification of external claims.
    summaryFactChecked:false,
    summarySource:c.schemaVersion===1&&c.summary?'canonical-v1':editorialLead?'editorial-lead':c.lead?'legacy-curated':'source-excerpt',
    topic,tags,
    kind:reviewed?.kind||(/案例|case|benchmark|作品/i.test(token)?'案例解析':/規範|治理|驗收|guide|workflow/i.test(token)?'工程方法':'技術研究'),
    creator:c.creator||null,demos:(c.schemaVersion===1 ? c.demo : c.demos)||[],externalLinks:externalLinks(doc.text),
    originalSource:c.schemaVersion===1 ? c.originalSource : null,
    license:c.schemaVersion===1 ? c.license : null,
    verifiedAt:c.schemaVersion===1 ? c.verifiedAt : null,
    image:c.schemaVersion===1 ? c.image : null,
    evidenceLevel:c.schemaVersion===1 ? c.evidenceLevel : 'unverified'
  };
}
export const topicsFor=docs=>[...new Set(docs.map(d=>d.topic))].sort((a,b)=>a.localeCompare(b,'zh-TW'));
export const tagsFor=docs=>[...new Set(docs.flatMap(d=>d.tags))].sort((a,b)=>a.localeCompare(b,'zh-TW'));
