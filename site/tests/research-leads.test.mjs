import test from 'node:test';
import assert from 'node:assert/strict';
import {allDocs,getDoc} from '../src/lib/catalog.mjs';
import {EDITORIAL_LEADS,editorialLeadCoverage} from '../src/lib/research-leads.mjs';
import {enrichResearch} from '../src/lib/research-metadata.mjs';
import {readFileSync} from 'node:fs';

const docs=allDocs();
test('current public sources have exact-path, nonempty Traditional Chinese editorial introductions',()=>{
  const coverage=editorialLeadCoverage(docs.map(d=>d.file));
  assert.equal(coverage.total,87);
  assert.deepEqual(coverage.missing,[]);
  assert.deepEqual(coverage.stale,[]);
  for(const d of docs){
    const text=EDITORIAL_LEADS[d.file];
    assert.ok(text && text.length>=60 && text.length<=160,d.file);
    assert.match(text,/[\u3400-\u9fff]/u,d.file);
    assert.equal(d.summary,text,d.file);
    assert.equal(d.summaryReviewed,true,d.file);
    assert.equal(d.summaryFactChecked,false,d.file);
    assert.equal(d.summarySource,'editorial-lead',d.file);
    assert.ok(!/^`{3}|^~~~/m.test(text),d.file);
    assert.equal(getDoc(d.collection,d.id),d);
  }
});
test('historical plans, indexes and source claims do not impersonate completed capabilities',()=>{
  const mustWarn=[
    'research/2026-11-universal-web-engine/18-v3-cinematic-experience-technology-decision.md',
    'research/2026-11-universal-web-engine/20-v3-chatgpt-5-6-execution-brief.md',
    'research/2026-11-agent-engineering/03-imagine.md',
    'research/2026-11-local-ai-inference/01-colibri-moe-streaming.md'
  ];
  for(const file of mustWarn) assert.match(EDITORIAL_LEADS[file],/不代表|未|不能|尚/,file);
  assert.match(EDITORIAL_LEADS['research/2026-11-agent-engineering/SOURCES.md'],/來源|索引/);
});
test('curated author and interactive demo metadata survive introduction replacement',()=>{
  const doc=docs.find(d=>d.file.endsWith('17-arctic-waters-threejs-creative-workflow.md'));
  assert.equal(doc.demos.length,2);
  assert.match(doc.creator.url,/3ditions\.drop3\.app/);
  assert.match(doc.summary,/Three\.js/);
  assert.match(doc.publicTitle,/Arctic Waters/);
});
test('canonical v1 entries still override optional editorial introductions',()=>{
  const f='research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap.md';
  const d=docs.find(x=>x.file===f);
  assert.ok(d);
  const unknown=enrichResearch({file:'research/future/new-idea.md',group:'future',id:'future/new-idea',
    title:'實驗中的網站',text:'# 實驗中的網站\n\n尚未整理完整原始研究內容。'});
  assert.equal(unknown.summaryReviewed,false);
  assert.equal(unknown.summaryFactChecked,false);
  assert.equal(unknown.summarySource,'source-excerpt');
});
test('reader label does not confuse editorial drafting with external verification',()=>{
  const page=readFileSync(new URL('../src/pages/[collection]/[...slug].astro',import.meta.url),'utf8');
  assert.match(page,/編輯導讀｜依原文整理；外部主張尚未逐項查證/);
  assert.doesNotMatch(page,/編輯導讀｜依原文與已核對資料整理/);
});
