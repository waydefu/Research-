import test from 'node:test';
import assert from 'node:assert/strict';
import {enrichResearch,CURATED,topicsFor,tagsFor} from '../src/lib/research-metadata.mjs';

test('new Markdown automatically acquires sensible topic without manual curation',()=>{
  const result=enrichResearch({
    file:'research/future-lab/threejs-ocean.md',id:'future-lab/threejs-ocean',group:'future-lab',
    title:'Three.js 海洋 Shader 原理',text:'# Three.js 海洋 Shader 原理\n\n這份研究說明用何種光照及水面法線調整畫面，並保留尚未實測的流暢度資訊。'
  });
  assert.equal(result.topic,'3D 場景與 Shader');
  assert.equal(result.publicTitle,result.title);
  assert.equal(result.summaryReviewed,false);
  assert.ok(result.tags.includes('Three.js'));
});
test('edited articles keep original title and show reviewed introduction',()=>{
  const key='research/2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow.md';
  const result=enrichResearch({file:key,id:'2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow',group:'2026-11-universal-web-engine',title:'17｜原始研究標題',text:'# 17｜原始研究標題'});
  assert.equal(result.title,'17｜原始研究標題');
  assert.match(result.publicTitle,/Arctic Waters/);
  assert.equal(result.summaryReviewed,true);
  assert.equal(result.demos.length,2);
  assert.match(result.demos[0].url,/3ditions/);
  assert.match(result.demos[1].url,/threejs\.org/);
  assert.notEqual(result.demos[0].url,result.demos[1].url);
  assert.ok(CURATED[key].creator?.url);
});
test('source extraction excludes own repo, duplicates and unsafe schemes',()=>{
  const result=enrichResearch({
    file:'research/more/sample.md',id:'more/sample',group:'more',title:'Source Example',
    text:'# Source Example\n\n[原作者](https://example.org/guide)\n[同一網址](https://example.org/guide)\n[本站 PR](https://github.com/waydefu/Research-/pull/1)\n[不安全](javascript:alert(1))\n[其他參考](https://example.net/page)'
  });
  assert.deepEqual(result.externalLinks.map(a=>a.url),['https://example.org/guide','https://example.net/page']);
});
test('facets remain deterministic and recognize optional tags',()=>{
  const docs=[
    {topic:'3D 場景與 Shader',tags:['Three.js','WebGL']},
    {topic:'Agent 工作流程',tags:['LLM']},
    {topic:'3D 場景與 Shader',tags:['WebGL']}
  ];
  assert.deepEqual(topicsFor(docs),['3D 場景與 Shader','Agent 工作流程'].sort((a,b)=>a.localeCompare(b,'zh-TW')));
  assert.ok(tagsFor(docs).includes('WebGL'));
});

test('article title and basename override an unrelated parent directory',()=>{
  const safety=enrichResearch({
    file:'research/2026-11-agent-repository-operations/23-report.md',
    id:'2026-11-agent-repository-operations/23-report',
    group:'2026-11-agent-repository-operations',
    title:'安全與稽核：執行邊界驗證',text:'# 安全與稽核'
  });
  assert.equal(safety.topic,'安全、權限與稽核');
  assert.equal(safety.kind,'技術研究');
  assert.ok(!safety.tags.includes('Agent'));
  const mixed=enrichResearch({
    file:'research/2026-11-agent-repository-operations/agent-security.md',
    id:'2026-11-agent-repository-operations/agent-security',
    group:'2026-11-agent-repository-operations',
    title:'Agent 系統安全與稽核',text:'# Agent 系統安全與稽核'
  });
  assert.equal(mixed.topic,'安全、權限與稽核');
  const fallback=enrichResearch({
    file:'research/2026-11-agent-repository-operations/general.md',
    id:'2026-11-agent-repository-operations/general',
    group:'2026-11-agent-repository-operations',
    title:'一般設計筆記',text:'# 一般設計筆記'
  });
  assert.equal(fallback.topic,'Agent 工作流程');
});
test('reference source index never silently truncates a long cited source list',()=>{
  const references=Array.from({length:33},(_,i)=>'[參考 '+(i+1)+'](https://example.org/source-'+(i+1)+')').join('\n');
  const result=enrichResearch({
    file:'research/lab/reference-audit.md',id:'lab/reference-audit',group:'lab',
    title:'來源完整性',text:'# 來源完整性\n'+references
  });
  assert.equal(result.externalLinks.length,33);
  assert.equal(result.externalLinks.at(-1).url,'https://example.org/source-33');
});

test('technical previews do not leak code fences or CLI terminal output',()=>{
  const md=[
    '# 層級推論架構',
    '',
    '研究者整理了多種記憶體管理策略，並比較不同情況下如何依照模型需求選擇資料存放的位置，避免把單次測量結果當成所有電腦都能達到的速度。',
    '',
    '~~~text',
    'GLM-5.2 · 744B MoE · int4',
    'ready in 32s',
    '~~~',
    '',
    '這份技術文件也提醒讀者記憶體需求與實際產生文字的速度有所不同，需要查看硬體規格和公開測量的條件。'
  ].join('\n');
  const r=enrichResearch({file:'research/lab/inference.md',id:'lab/inference',group:'lab',title:'大型模型推論說明',text:md});
  assert.match(r.summary,/研究者整理了/);
  assert.doesNotMatch(r.summary,/~{3}|\x60{3}|ready in 32s|GLM-5/);
});
test('Colibri receives beginner-readable headline and context while preserving source',()=>{
  const file='research/2026-11-local-ai-inference/01-colibri-moe-streaming.md';
  const r=enrichResearch({file,id:'2026-11-local-ai-inference/01-colibri-moe-streaming',
    group:'2026-11-local-ai-inference',title:'01 | Colibri VRAM / RAM / NVMe',
    text:'# 01 | Colibri VRAM / RAM / NVMe'});
  assert.equal(r.title,'01 | Colibri VRAM / RAM / NVMe');
  assert.match(r.publicTitle,/記憶體不足時/);
  assert.match(r.summary,/固態硬碟/);
  assert.equal(r.summaryReviewed,true);
});

test('high-end Three.js research has accurate searchable metadata and distinct credited demos',()=>{
  const files=[
    '27-threejs-r187-ultra-rendering-ceiling.md',
    '28-advanced-shader-pipeline-and-hd2d-recipes.md',
    '29-rendering-ceiling-benchmark-and-adoption-gates.md'
  ];
  const hrefs=new Set();
  for(const file of files){
    const path='research/2026-11-universal-web-engine/'+file;
    const data=CURATED[path];
    assert.equal(data.schemaVersion,1);
    assert.equal(data.domain,'2026-11-universal-web-engine');
    assert.equal(data.topic,'即時 3D 渲染與 Shader');
    assert.equal(data.verifiedAt,'2026-11-05');
    assert.ok(data.tags.includes('Three.js'));
    assert.equal(data.demo.length,1);
    assert.ok(!hrefs.has(data.demo[0].url));
    hrefs.add(data.demo[0].url);
    const doc=enrichResearch({file:path,id:'2026-11-universal-web-engine/'+file.replace(/\.md$/,''),group:'2026-11-universal-web-engine',
      title:'研究原始標題',text:'# 研究原始標題'});
    assert.equal(doc.topic,'即時 3D 渲染與 Shader');
    assert.equal(doc.publicTitle,data.publicTitle);
    assert.equal(doc.summaryReviewed,true);
  }
});
