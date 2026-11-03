import test from 'node:test';
import assert from 'node:assert/strict';
import {allDocs,displayDomain,getDoc,graph} from '../src/lib/catalog.mjs';
import {REVIEWED_DOCUMENTS,TOPIC_DESCRIPTORS,reviewedCoverage} from '../src/lib/research-taxonomy.mjs';
import {enrichResearch} from '../src/lib/research-metadata.mjs';
import {exhibitFor,topicFor} from '../src/lib/exhibit-info.mjs';
const docs=allDocs();
const find=path=>docs.find(d=>d.file.endsWith(path));

test('all current public documents have manually checked labels and topics',()=>{
  const files=docs.map(d=>d.file);
  const coverage=reviewedCoverage(files);
  assert.equal(coverage.total,docs.length);
  assert.deepEqual(coverage.unmatched,[]);
  assert.deepEqual(coverage.stale,[]);
  assert.ok(docs.length>=85);
  assert.equal(new Set(files).size,docs.length);
  assert.ok(Object.keys(TOPIC_DESCRIPTORS).length>=30);
  for(const d of docs){
    const c=REVIEWED_DOCUMENTS[d.file];
    assert.ok(c,d.file);
    assert.equal(d.publicTitle,c.publicTitle,d.file);
    assert.equal(d.topic,c.topic,d.file);
    assert.deepEqual(d.tags,c.tags,d.file);
    assert.ok(d.publicTitle.length>=8,d.file);
    assert.ok(topicFor(d.topic).why.length>=15,d.file);
    assert.ok(d.href.startsWith('/Research-/v3/'),d.file);
  }
});

test('source indexes, navigation and editorial document types are distinct',()=>{
  for(const d of docs){
    if(d.file.endsWith('/SOURCES.md')) assert.equal(d.kind,'來源索引',d.file);
    if(d.file.endsWith('/README.md')) assert.equal(d.kind,'研究導覽',d.file);
  }
  assert.equal(find('research/RESEARCH-TEMPLATE.md')?.kind,'研究模板');
});

test('specific documents avoid GPU, audio, Agent security and showcase classification mistakes',()=>{
  assert.equal(find('2026-10-retrospective/07-audio-dsp.md').topic,'音訊 DSP 與空間音效');
  assert.equal(find('2026-11-agent-repository-operations/07-security-and-ci.md').topic,'Agent 權限與安全');
  assert.equal(find('2026-11-agent-repository-operations/11-ai-framework-agent-cost.md').topic,'Agent 模型路由與成本');
  assert.equal(find('2026-11-universal-web-engine/23-threejs-nanites-gpu-driven-geometry.md').topic,'3D 資產與幾何最佳化');
  assert.equal(find('2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow.md').topic,'互動作品與設計案例');
  assert.equal(find('2026-11-universal-web-engine/26-luminati-hd2d-browser-engine.md').topic,'即時 3D 渲染與 Shader');
});

test('public domains are readable and retrospective is not mislabeled as only Web',()=>{
  for(const group of new Set(docs.map(d=>d.group))){
    assert.match(displayDomain(group),/[\u3400-\u9fff]/u,group);
    assert.match(exhibitFor(group).name,/[\u3400-\u9fff]/u,group);
  }
  assert.match(exhibitFor('2026-10-retrospective').name,/跨領域/);
});

test('original Markdown, stable permalink and source graph survive editorial renaming',()=>{
  const d=find('2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow.md');
  assert.ok(d.title.includes('Arctic Waters'));
  assert.notEqual(d.title,d.publicTitle);
  assert.ok(d.href.endsWith('/17-arctic-waters-threejs-creative-workflow/'));
  assert.equal(getDoc(d.collection,d.id),d);
  assert.equal(graph().nodes.length,docs.length);
});

test('an unknown future study still falls back rather than inventing author evidence',()=>{
  const path='research/future-experiment/nextjs-proposal.md';
  const d=enrichResearch({file:path,id:'future-experiment/nextjs-proposal',group:'future-experiment',
    title:'Next.js 架構與快取研究',text:'# Next.js 架構與快取研究\n\n這篇研究仍需核對相關快取條件。'});
  assert.equal(d.publicTitle,'Next.js 架構與快取研究');
  assert.equal(d.summaryReviewed,false);
  assert.equal(d.creator,null);
  assert.equal(REVIEWED_DOCUMENTS[path],undefined);
});
