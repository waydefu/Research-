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
