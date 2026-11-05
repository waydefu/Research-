import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {allDocs} from '../src/lib/catalog.mjs';
import {getPublicArticle} from '../src/lib/public-articles.mjs';
import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};

const reviewed=JSON.parse(readFileSync(resolve(process.cwd(),'P1-ISSUE59-REVIEW.json'),'utf8'));
const graphics=JSON.parse(readFileSync(resolve(process.cwd(),'P1-2026-11-05-GRAPHICS-REVIEW.json'),'utf8'));

test('Issue #59: exactly every unpublished public technical body has one dated review disposition',()=>{
  const docs=allDocs(),missing=docs.filter(d=>!getPublicArticle(d.file)).map(d=>d.file).sort();
  const registered=reviewed.items.map(x=>x.path).sort();
  const incremental=new Set([...graphics.items,...ongoing.items].map(x=>x.path));
  assert.equal(reviewed.schemaVersion,2);
  assert.match(reviewed.dispositionCompletedAt,/^2026-11-04$/);
  assert.equal(reviewed.issue,59);
  assert.equal(reviewed.items.length,47);
  assert.equal(new Set(registered).size,registered.length,'duplicate source');
  assert.deepEqual(registered,missing.filter(p=>!incremental.has(p)),
    'historical Issue #59 source review remains unchanged');
  assert.deepEqual([...registered,...incremental].sort(),missing,
    'new sources must have an independently dated review register');
  assert.ok(reviewed.items.every(x=>x.reviewedOn&&x.remainingWork),'all items need a review date and next action');
});

test('Issue #59: source blob hashes are immutable; all claimed evidence is scoped',()=>{
  const allowed=new Set([
    '索引／模板已盤點（不是技術正文）',
    '官方來源指定主張已交叉核對',
    '原文已審閱，主張待進一步核實',
    '歷史案例已辨識（實測不能外推）'
  ]);
  for(const row of reviewed.items){
    assert.ok(allowed.has(row.reviewClass),row.path);
    const raw=readFileSync(resolve(process.cwd(),'..',row.path));
    const sha=createHash('sha1')
      .update(Buffer.from('blob '+raw.byteLength+'\0'))
      .update(raw).digest('hex');
    assert.equal(row.sourceBlobSha,sha,'source changed after human review: '+row.path);
    assert.match(row.sourceRevision,/^[0-9a-f]{40}$/);
    assert.equal(row.externallyVerifiedAllClaims,false,'spot-check != full independent verification: '+row.path);
    assert.equal(row.dispositionStatus,'accepted-with-scope',row.path);
    assert.ok(['bounded-evidence','index-or-template','historical-reference','context-limited'].includes(row.dispositionType),row.path);
    assert.ok(row.dispositionReason?.length>30,row.path);
    assert.ok(row.publicNotice?.length>25,row.path);
    assert.ok(row.adoptionGate?.length>20,row.path);
    assert.ok(row.dispositionReviewedOn?.length>=10,row.path);
    assert.ok(Array.isArray(row.additionalEvidenceUrls),row.path);
    assert.ok(row.additionalEvidenceUrls.every(u=>u.startsWith('https://')),row.path);
    if(row.additionalEvidenceUrls.length)assert.ok(row.additionalEvidenceScope?.length>15,row.path);
    else assert.equal(row.additionalEvidenceScope,null,row.path);
    assert.ok(Array.isArray(row.evidenceUrls));
    if(row.reviewClass==='官方來源指定主張已交叉核對'){
      assert.ok(row.verifiedScope&&row.verifiedScope.length>25,row.path);
      assert.ok(row.evidenceUrls.length>=1,row.path);
      assert.ok(row.evidenceUrls.every(u=>u.startsWith('https://')),row.path);
    }else{
      assert.equal(row.verifiedScope,null,row.path);
      assert.deepEqual(row.evidenceUrls,[],row.path);
    }
  }
});

test('Issue #59: no release-facing source decision silently masquerades as fully verified',()=>{
  const unique=new Set(reviewed.items.map(x=>x.path));
  assert.equal(unique.size,47);
  const counts=reviewed.items.reduce((m,x)=>{m[x.dispositionType]=(m[x.dispositionType]||0)+1;return m;},{});
  assert.deepEqual(counts,{
    'index-or-template':11,'bounded-evidence':19,'context-limited':10,'historical-reference':7
  });
  const oldAstro=reviewed.items.find(x=>x.path.endsWith('/09-reference-stacks-and-migration.md'));
  assert.match(oldAstro.publicNotice,/Astro 6/);
  assert.match(oldAstro.publicNotice,/最新/);
  for(const row of reviewed.items){
    assert.notEqual(row.dispositionStatus,'fully-verified');
    assert.equal(row.externallyVerifiedAllClaims,false);
    assert.ok(!/全部.*通過獨立查證/.test(row.publicNotice),row.path);
  }
});

test('new graphics research has separate 2026-11-05 scoped review and exact source identity',()=>{
  assert.equal(graphics.schemaVersion,1);
  assert.equal(graphics.reviewDate,'2026-11-05');
  assert.equal(graphics.items.length,3);
  assert.equal(new Set(graphics.items.map(x=>x.path)).size,3);
  for(const row of graphics.items){
    assert.ok(row.path.startsWith('research/2026-11-universal-web-engine/2'),row.path);
    const raw=readFileSync(resolve(process.cwd(),'..',row.path));
    const sha=createHash('sha1')
      .update(Buffer.from('blob '+raw.byteLength+'\0'))
      .update(raw).digest('hex');
    assert.equal(row.sourceBlobSha,sha,'recorded research source changed: '+row.path);
    assert.match(row.sourceRevision,/^[0-9a-f]{40}$/);
    assert.equal(row.reviewedOn,'2026-11-05');
    assert.equal(row.externallyVerifiedAllClaims,false);
    assert.equal(row.benchmarkStatus,'NOT_RUN');
    assert.ok(row.verifiedScope.length>20);
    assert.ok(row.remainingWork.length>20);
    assert.ok(row.knownSources.length>=2);
    assert.ok(row.knownSources.every(u=>u.startsWith('https://')));
  }
});
