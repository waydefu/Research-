import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {allDocs} from '../src/lib/catalog.mjs';
import {PUBLIC_ARTICLES,getPublicArticle,publicBodyCoverage} from '../src/lib/public-articles.mjs';
import {auditPublicDocs} from '../src/lib/public-content-audit.mjs';
const docs=allDocs();
test('inventory covers every published source and never calls automated flags factual verification',()=>{
  const audit=auditPublicDocs(docs);
  assert.equal(audit.total,90);
  assert.equal(audit.records.length,new Set(audit.records.map(x=>x.file)).size);
  assert.ok(audit.records.every(x=>['優先整理','人工核對','一般內容候選'].includes(x.priority)));
  assert.ok(audit.records.some(x=>x.priority==='優先整理'));
  assert.equal(audit.curated,40);
  // P0.5 publication gate: any original containing internal repository markers
  // must have a separately authored public technical body, preserving its source.
  assert.deepEqual(audit.records.filter(x=>x.internalHits>0&&x.publicBody!=='已完成技術正文').map(x=>x.file),[]);
});
test('P0.5 closeout covers forty technical guides with unaltered original files with exact source mapping',()=>{
  assert.deepEqual(publicBodyCoverage(docs.map(d=>d.file)),{total:90,ready:40,stale:[]});
  assert.equal(Object.keys(PUBLIC_ARTICLES).length,40);
  const batchTwo=[
    'research/2026-11-universal-web-engine/18-v3-cinematic-experience-technology-decision.md',
    'docs/governance/BASELINE-2026-11-02.md',
    'docs/governance/OPERATIONS.md',
    'showcase/design/V2-ART-DIRECTION.md',
    'showcase/design/V2-ENGINEERING-ACCEPTANCE.md',
    'showcase/design/V2-IMPLEMENTATION-REVIEW.md',
    'research/2026-10-retrospective/11-adoption-roadmap.md',
    'research/2026-11-agent-repository-operations/09-implementation-roadmap.md'
  ];
  for(const file of batchTwo)assert.ok(PUBLIC_ARTICLES[file],file);
  const batchThree=[
    'docs/governance/REPO-TOOLING.md',
    'docs/governance/RULESETS.md',
    'docs/governance/TOKEN-ACCOUNTING.md',
    'research/2026-11-universal-web-engine/15-creative-web-evidence-and-adoption.md',
    'research/2026-11-universal-web-engine/14-effects-recipes-and-poc-validation.md',
    'research/2026-10-retrospective/01-agent-orchestration.md',
    'research/2026-10-retrospective/02-code-intelligence-benchmarks.md',
    'research/2026-11-agent-engineering/05-integration.md'
  ];
  assert.equal(batchThree.length,8);
  for(const file of batchThree)assert.ok(PUBLIC_ARTICLES[file],file);
  // Third batch includes the final project-specific history normalization.
  // This is not a claim that all 87 source bodies were rewritten.
  const allGuides=new Set(Object.keys(PUBLIC_ARTICLES));
  const uncurated=docs.filter(x=>!allGuides.has(x.file));
  assert.equal(uncurated.length,50);
  assert.ok(uncurated.every(x=>auditPublicDocs([x]).records[0].internalHits===0),
    'no uncurated source may expose internal repository narrative by default');
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
