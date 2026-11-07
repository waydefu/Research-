// Deterministic original SVG information illustrations, without external art, logos, scripts or fonts.
// Each research source gets a unique, traceable asset. These diagrams never impersonate source screenshots.
import {REVIEWED_DOCUMENTS} from './research-taxonomy.mjs';
export const ART_BASE='/Research-/v3/research-figures/';
export const ART_SOURCE='site/scripts/generate-research-art.mjs';
export const ART_LICENSE='本站原創技術示意圖；無第三方圖片／字體素材';

const hash = text => {
  let h=2166136261;
  for(let i=0;i<text.length;i++){h=Math.imul(h ^ text.charCodeAt(i),16777619)>>>0;}
  return h.toString(16).padStart(8,'0');
};
export const visualFilename = file => 'research-'+hash(file)+'.svg';
const svgText = x => String(x).replaceAll('&','&amp;').replaceAll('<','&lt;')
  .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
const words = x => [...String(x||'')].slice(0,27).join('');
const short = (x,max=23) => [...String(x)].length>max?[...String(x)].slice(0,max-1).join('')+'…':String(x);

export function motifFor(doc){
  const file=String(doc.file||'');
  const title=String(doc.publicTitle||'');
  // Navigation, sources, audit and evaluation records need different diagrams.
  if(/\/SOURCES\.md$/.test(file))return 'sources';
  if(/\/README\.md$/.test(file))return 'directory';
  if(/TEMPLATE/i.test(file))return 'template';
  if(/RULESETS|分支保護|權限治理/i.test(file+' '+title))return 'rules';
  if(/roadmap|交接|導入順序|採用排序|規劃/i.test(file+' '+title))return 'roadmap';
  if(/benchmark|評測|成本比較|品質評估/i.test(file+' '+title))return 'benchmark';
  if(/catalog|參考案例|案例清單|研究索引/i.test(file+' '+title))return 'references';
  const s=(doc.publicTitle||'')+' '+(doc.topic||'');
  if(/Luminati|像素遊戲|2\.5D/i.test(s))return 'pixels';
  // Source-specific schematics: agent score/audio, component motion, and CJK text layout.
  if(/38-noniv-webgpu-fft-ocean-renderer\.md$/.test(file))return 'ocean';
  if(/07-music-skill-editable-agent-composition\.md$/.test(file))return 'score';
  if(/34-forever-components-agent-retrieval-and-web-effects\.md$/.test(file))return 'motion';
  if(/35-ui-typography-readability-and-cjk\.md$/.test(file))return 'layout';
  if(/36-gradientdeck-design-md-library-for-agents\.md$/.test(file))return 'layout';
  if(/37-threejs-grassworks-webgpu-grass-and-forest-demo\.md$/.test(file))return 'cube';
  if(/UniForge3D/i.test(s))return 'geometry';
  if(/nanites|Virtualized Geometry|幾何|GPU 驅動/i.test(s))return 'geometry';
  if(/Polyfork|3D 素材|Asset-as-Code/i.test(s))return 'assets';
  if(/Colibri|MoE|記憶體|本機 LLM|模型推論/i.test(s))return 'chip';
  if(/音訊|DSP|HRTF/i.test(s))return 'audio';
  if(/影片|FFmpeg|Remotion/i.test(s))return 'film';
  if(/來源|證據|核查|稽核/i.test(s))return 'evidence';
  if(/身分驗證|MFA|生物辨識|密碼/i.test(s))return 'identity';
  if(/機房|實體安全|備份|復原/i.test(s))return 'servers';
  if(/資安|安全|權限|威脅|風險/i.test(s))return 'shield';
  if(/索引|搜尋|資料庫|RAG/i.test(s))return 'index';
  if(/成本|Token|模型路由|量測/i.test(s))return 'metrics';
  if(/Agent|代理|MCP|Harness|Skills|Claude Code|Jev|EGM/i.test(s))return 'agent';
  if(/3D|WebGL|WebGPU|Shader|渲染|光影/i.test(s))return 'cube';
  if(/動畫|動效|捲動|特效|轉場/i.test(s))return 'motion';
  if(/UI|UX|視覺|美術|字體|設計/i.test(s))return 'layout';
  if(/專案管理|排程|計畫|交接|治理|規劃/i.test(s))return 'timeline';
  if(/系統|需求|API|開發/i.test(s))return 'flow';
  if(/網站|Web|框架|JavaScript|Next\.js|TypeScript/i.test(s))return 'browser';
  return 'book';
}
export const SCENE_LAYOUTS=Object.freeze(['orbit','side-left','side-right','dual','engraved','layered']);
export const sceneKindFor=doc=>SCENE_LAYOUTS[parseInt(hash(doc.file),16)%SCENE_LAYOUTS.length];

// A subject glyph alone was not enough: 26 documents shared the generic evidence motif.
// Compose that glyph with distinct structural arrangements and source-specific keywords.
// This is an editorial schematic, never a depiction of measurements or original screenshots.
function composeScene(doc,drawing,seed,accent,muted,stroke){
  const kind=sceneKindFor(doc);
  const group=(cx,cy,s)=>'<g transform="translate('+cx+' '+cy+') scale('+s+') translate(-360 -150)">'+drawing+'</g>';
  const glyph=kind==='side-left'?group(300,145,.82):
    kind==='side-right'?group(422,145,.82):
    kind==='dual'?group(258,144,.65)+group(463,144,.65):
    kind==='layered'?group(351,113,.56)+group(389,195,.48):
    kind==='engraved'?group(360,146,.90):group(360,148,.96);
  const detail=(doc.tags||[]).slice(0,3).map((tag,i)=>
    '<text x="53" y="'+(92+i*47)+'" font-family="system-ui,sans-serif" font-size="13" fill="'+muted+'">'+svgText(short(tag,9))+'</text>').join('');
  const markers=Array.from({length:4},(_,i)=>{
    const y=79+i*49+((seed>>>(i*4))&7);
    const x=563+((seed>>>(i*5))&23);
    const radius=3+((seed>>>(i*3))&3);
    return '<circle cx="'+x+'" cy="'+y+'" r="'+radius+'" fill="'+accent+'" opacity=".64"/>'+
      '<path d="M'+(x+radius+8)+' '+y+' H'+(652-((seed>>>(i*2))&16))+'" stroke="'+accent+'" stroke-width="2" opacity=".55"/>';
  }).join('');
  const floor=kind==='orbit'?'<circle cx="356" cy="153" r="139" fill="none" stroke="'+accent+'" stroke-dasharray="3 12" opacity=".27"/>'+
      '<circle cx="356" cy="153" r="114" fill="none" stroke="'+accent+'" opacity=".12"/>':
    kind==='side-left'?'<path d="M514 42 V258 H660 M510 130 H651 M510 180 H623" fill="none" stroke="'+accent+'" stroke-width="2" opacity=".26"/>':
    kind==='side-right'?'<path d="M195 47 V262 H58 M195 130 H85 M195 189 H68" fill="none" stroke="'+accent+'" stroke-width="2" opacity=".26"/>':
    kind==='dual'?'<path d="M360 38 V256 M172 152 H549" stroke="'+accent+'" stroke-dasharray="5 11" fill="none" opacity=".26"/>':
    kind==='engraved'?Array.from({length:5},(_,i)=>'<path d="M'+(174+i*93)+' 38 V254" stroke="'+accent+'" opacity=".10"/>').join(''):
    '<path d="M200 87 H527 M201 212 H524 M207 87 L526 212" fill="none" stroke="'+accent+'" stroke-dasharray="4 9" opacity=".22"/>';
  const circuit=Array.from({length:3},(_,i)=>{
    const x=73+((seed>>>(i*7))&59);
    const y=243-i*21;
    return '<circle cx="'+x+'" cy="'+y+'" r="'+(3+i)+'" fill="none" stroke="'+accent+'" opacity=".53"/>';
  }).join('');
  return '<g data-scene="'+kind+'" data-motif="'+motifFor(doc)+'">'+floor+glyph+detail+markers+circuit+'</g>';
}
export function visualForDoc(doc){
  const has=Boolean(REVIEWED_DOCUMENTS[doc.file]);
  const filename=visualFilename(doc.file);
  return {
    src:has ? ART_BASE+filename : null,
    alt:has ? '原創技術示意圖：'+doc.publicTitle+'；主題為'+doc.topic+'，非原作者作品截圖。' : '',
    kind:has?'original-diagram':'unavailable',
    originalWork:false,
    license:has?ART_LICENSE:null,
    source:has?ART_SOURCE:null,
    sourceFile:doc.file,
    motif:motifFor(doc),scene:sceneKindFor(doc)
  };
}
export const visualManifest=docs=>docs.map(visualForDoc);
export const visualCoverage=docs=>({
  total:docs.length,
  known:docs.filter(d=>visualForDoc(d).src).length,
  filenames:[...new Set(docs.map(d=>visualFilename(d.file)))],
  unknown:docs.filter(d=>!visualForDoc(d).src).map(d=>d.file)
});
export function renderResearchArt(doc){
  if(!REVIEWED_DOCUMENTS[doc.file])throw new Error('研究圖片不能為未登錄來源捏造：'+doc.file);
  const seed=parseInt(hash(doc.file),16);
  const accent=['#c6a76d','#77b8c9','#cab37e','#92a6cf','#95b9a7','#c3a8bd'][seed%6];
  const muted=['#e3cfac','#c8dddf','#eed9af','#d6dcf0','#d4e7d6','#e9d6e6'][seed%6];
  const stroke='stroke="'+accent+'" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const line=(x1,y1,x2,y2)=>'<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" '+stroke+'/>';
  const circ=(x,y,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" '+stroke+'/>';
  const rect=(x,y,w,h,r=12)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" '+stroke+'/>';
  const polygon=points=>'<polygon points="'+points+'" '+stroke+'/>';
  const sym=visualForDoc(doc).motif;
  let drawing='';
  if(sym==='pixels'){
    drawing=rect(220,60,285,158,9)+Array.from({length:52},(_,i)=>{
      const x=247+(i%13)*18, y=82+Math.floor(i/13)*24;
      const on=((i*13+seed)%9)<4;return on?'<rect x="'+x+'" y="'+y+'" width="13" height="13" fill="'+accent+'" opacity="'+(.32+((i+seed)%5)*.12)+'"/>':'';
    }).join('')+line(246,200,479,200);
  }else if(sym==='geometry'||sym==='cube'||sym==='assets'){
    drawing=polygon('345,38 468,111 345,180 223,110')+polygon('223,110 345,180 345,265 223,194')+polygon('345,180 468,111 468,194 345,265')+
      line(345,38,345,180)+line(224,195,345,265)+line(345,265,469,194)+
      (sym==='geometry'?Array.from({length:4},(_,i)=>circ(260+i*58,110+i*8,9)).join(''):sym==='assets'?rect(475,70,56,43,5):'');
  }else if(sym==='ocean'){
    // Original sea-spectrum diagram: six frequency bands, a sun and layered wave fronts.
    drawing=circ(362,92,26)+
      Array.from({length:6},(_,i)=>{
        const y=145+i*17;
        return '<path d="M215 '+y+' Q250 '+(y-12-i%2*3)+' 288 '+y+
          ' T360 '+y+' T432 '+y+' T505 '+y+'" '+stroke+'/>';
      }).join('')+
      line(318,246,412,246);
  }else if(sym==='score'){
    // Original compact score schematic; bounded SVG geometry even when scene motifs repeat.
    drawing=rect(211,65,298,172,6)+
      Array.from({length:5},(_,i)=>line(235,100+i*19,482,100+i*19)).join('')+
      circ(295,157,11)+line(306,157,306,101)+
      circ(381,137,11)+line(392,137,392,91)+
      polygon('306,101 322,106 322,117 306,112');
  }else if(sym==='audio'){
    drawing=rect(200,65,320,174)+Array.from({length:49},(_,i)=>{
      let n=(Math.sin(i*.55+seed)*.35+Math.sin(i*1.32)*.18+.47)*78;
      return line(220+i*6,145-n,220+i*6,145+n);
    }).join('');
  }else if(sym==='film'||sym==='motion'){
    drawing=rect(216,58,291,180,8)+rect(240,86,244,122,4)+
      Array.from({length:7},(_,i)=>rect(224+i*42,67,23,9,1)+rect(224+i*42,215,23,9,1)).join('')+
      (sym==='motion'?polygon('322,100 322,178 398,140'):'<path d="M340 112 L395 145 L340 179 Z" fill="'+accent+'" opacity=".72"/>');
  }else if(sym==='shield'||sym==='identity'){
    drawing=polygon('354,52 451,95 437,203 354,259 271,203 257,95')+
      (sym==='identity'?rect(324,127,61,58,8)+circ(354,116,24)+line(354,153,354,166):polygon('316,154 344,183 403,118'));
  }else if(sym==='index'){
    drawing=rect(212,65,301,168,6)+Array.from({length:4},(_,i)=>rect(235,85+i*31,169-i*14,10,3)).join('')+
      circ(447,156,42)+line(477,186,517,226);
  }else if(sym==='chip'||sym==='metrics'){
    drawing=rect(270,57,178,178,10)+rect(301,91,116,106,6)+
      Array.from({length:8},(_,i)=>line(270+i*25,56,270+i*25,35)+line(270+i*25,236,270+i*25,255)).join('')+
      (sym==='metrics'?Array.from({length:4},(_,i)=>rect(321+i*22,164-i*15,14,33+i*15,2)).join(''):circ(359,145,30));
  }else if(sym==='servers'){
    drawing=Array.from({length:3},(_,i)=>rect(231,65+i*61,250,49,7)+circ(257,89+i*61,6)+line(285,90+i*61,458,90+i*61)).join('');
  }else if(sym==='layout'){
    drawing=rect(202,55,322,192,5)+rect(222,74,140,88,2)+rect(378,74,125,21,2)+
      rect(378,109,125,12,2)+rect(378,135,95,12,2)+rect(222,181,281,47,2);
  }else if(sym==='agent'){
    drawing=circ(357,129,48)+circ(229,193,28)+circ(485,193,28)+circ(357,246,17)+
      line(316,156,247,180)+line(397,157,466,180)+line(357,178,357,228)+
      '<text x="357" y="145" fill="'+muted+'" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="700">AI</text>';
  }else if(sym==='flow'||sym==='timeline'){
    drawing=rect(210,60,110,60)+rect(410,60,110,60)+rect(309,173,110,60)+
      line(320,89,409,89)+line(465,121,366,172)+line(262,121,343,172)+
      (sym==='timeline'?Array.from({length:4},(_,i)=>circ(248+i*72,259,4)).join(''):'');
  }else if(sym==='sources'){
    drawing=rect(237,53,247,197,8)+Array.from({length:4},(_,i)=>
      circ(274,89+i*41,11)+line(301,89+i*41,450-i*10,89+i*41)).join('')+
      line(281,90,281,211);
  }else if(sym==='directory'){
    drawing=rect(211,67,310,182,7)+rect(231,87,88,142,4)+
      Array.from({length:4},(_,i)=>rect(344,91+i*33,148-i*14,13,3)).join('')+
      circ(275,116,16)+circ(275,164,16);
  }else if(sym==='template'){
    drawing=rect(230,45,254,215,5)+rect(255,78,164,20,2)+
      Array.from({length:4},(_,i)=>rect(256,125+i*28,16,16,3)+line(284,133+i*28,449-(i%2)*40,133+i*28)).join('');
  }else if(sym==='rules'){
    drawing=polygon('355,48 454,103 437,211 355,259 273,211 256,103')+
      rect(325,109,65,60,6)+line(338,135,349,146)+line(349,146,375,122)+
      line(313,195,395,195);
  }else if(sym==='roadmap'){
    drawing=line(216,178,511,178)+Array.from({length:4},(_,i)=>{
      const x=244+i*79;
      return circ(x,178,17)+line(x,160,x,111-(i%2)*19)+rect(x-17,94-(i%2)*19,34,16,3);
    }).join('');
  }else if(sym==='benchmark'){
    drawing=rect(210,72,135,158,7)+rect(380,72,135,158,7)+
      Array.from({length:4},(_,i)=>line(229,104+i*29,322-i*11,104+i*29)+
      line(399,104+i*29,487-(i%3)*16,104+i*29)).join('')+
      circ(362,150,13);
  }else if(sym==='references'){
    drawing=rect(264,68,174,167,9)+
      Array.from({length:4},(_,i)=>circ(225+i*82,65+(i%2)*182,15)+
      line(240+i*70,79+(i%2)*100,311+i*22,126)).join('')+
      Array.from({length:3},(_,i)=>line(291,117+i*34,413,117+i*34)).join('');
  }else if(sym==='evidence'||sym==='book'){
    drawing=rect(222,61,270,188,6)+Array.from({length:5},(_,i)=>line(250,100+i*27,467-(i%3)*35,100+i*27)).join('')+
      (sym==='evidence'?polygon('445,41 462,58 493,21'):circ(465,226,18));
  }else{
    drawing=rect(211,66,310,184,10)+line(212,104,520,104)+
      circ(238,85,5)+circ(257,85,5)+circ(276,85,5)+
      polygon('282,136 256,167 282,191')+polygon('451,136 477,167 451,191')+line(408,128,330,202);
  }
  const scene=composeScene(doc,drawing,seed,accent,muted,stroke);
  const tags=(doc.tags||[]).slice(0,3).map(t=>short(t,14));
  const id=hash(doc.file);
  const heading=short(doc.publicTitle,30);
  const title2=short(doc.topic,28);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480" role="img" aria-labelledby="title desc">
<title id="title">${svgText(heading)}</title><desc id="desc">Research- 原創研究示意圖；非第三方作品截圖。</desc>
<defs><linearGradient id="bg" x2=".9" y2="1"><stop stop-color="#111f2c"/><stop offset="1" stop-color="#17202b"/></linearGradient><radialGradient id="gl"><stop stop-color="${accent}" stop-opacity=".13"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs>
<rect width="720" height="480" fill="url(#bg)"/><circle cx="363" cy="133" r="250" fill="url(#gl)"/>
<path d="M27 27 H693 V453 H27 Z" fill="none" stroke="${accent}" opacity=".30"/>
<path d="M38 294 H682" stroke="${accent}" opacity=".45"/>
<g opacity=".22" stroke="${accent}"><path d="M56 56 H161 M559 56 H663 M56 256 H161 M560 256 H662"/></g>
${scene}
<text x="52" y="335" font-family="system-ui,'Noto Sans TC',sans-serif" font-size="17" letter-spacing="1.4" fill="${accent}">${svgText(title2)}</text>
<text x="52" y="378" font-family="system-ui,'Noto Sans TC',sans-serif" font-size="24" font-weight="600" fill="#f0e6d4">${svgText(heading)}</text>
<text x="52" y="424" font-family="system-ui,'Noto Sans TC',sans-serif" font-size="14" fill="#b4c2cd">${svgText(tags.join('   ·   ')||'研究來源與方法')}</text>
<text x="666" y="425" text-anchor="end" font-family="monospace" font-size="12" fill="#8d9daa">${id}</text>
</svg>`;
}
