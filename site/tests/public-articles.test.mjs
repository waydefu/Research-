import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {allDocs} from '../src/lib/catalog.mjs';
import {PUBLIC_ARTICLES,getPublicArticle,publicBodyCoverage} from '../src/lib/public-articles.mjs';
import {auditPublicDocs} from '../src/lib/public-content-audit.mjs';
const docs=allDocs();
test('inventory covers every published source and never calls automated flags factual verification',()=>{
  const audit=auditPublicDocs(docs);
  assert.equal(audit.total,87);
  assert.equal(audit.records.length,new Set(audit.records.map(x=>x.file)).size);
  assert.ok(audit.records.every(x=>['優先整理','人工核對','一般內容候選'].includes(x.priority)));
  assert.ok(audit.records.some(x=>x.priority==='優先整理'));
  assert.equal(audit.curated,4);
});
test('pilot has four human-authored technology guides with exact source mapping',()=>{
  assert.deepEqual(publicBodyCoverage(docs.map(d=>d.file)),{total:87,ready:4,stale:[]});
  assert.equal(Object.keys(PUBLIC_ARTICLES).length,4);
  for(const [file,body] of Object.entries(PUBLIC_ARTICLES)){
    const doc=docs.find(x=>x.file===file);
    assert.ok(doc,file);
    assert.ok(doc.sha.match(/^[0-9a-f]{40}$/),file);
    assert.ok(body.sections.length>=3,file);
    for(const section of body.sections){
      assert.match(section.heading,/[\u3400-\u9fff]/,file);
      assert.ok(section.explanation.length>45,file);
      assert.ok(section.limit.length>22,file);
      const visible=[section.heading,section.explanation,section.limit].join(' ');
      assert.doesNotMatch(visible,/Research-|THE OBSERVATORY|waydefu|本專案|本站|本 Repo|本輪|Owner|\bV[23]\b/i,file);
      assert.doesNotMatch(visible,/<script|<iframe|javascript:|onerror\s*=/i,file);
    }
    assert.strictEqual(getPublicArticle(file),body);
  }
  assert.equal(getPublicArticle('research/new-unreviewed.md'),null);
});
test('public article displays a technical guide but keeps expandable original with git SHA',()=>{
  const text=readFileSync(new URL('../src/pages/[collection]/[...slug].astro',import.meta.url),'utf8');
  assert.match(text,/class="public-article"/);
  assert.match(text,/<details class="original-record" data-pagefind-ignore>/);
  assert.equal((text.match(/class="article-content"><Content \/>/g)||[]).length,2);
  assert.match(text,/doc\.sha/);
});
