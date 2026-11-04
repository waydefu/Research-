import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {allDocs} from '../src/lib/catalog.mjs';
import {getPublicArticle} from '../src/lib/public-articles.mjs';

const reviewed=JSON.parse(readFileSync(resolve(process.cwd(),'P1-ISSUE59-REVIEW.json'),'utf8'));

test('Issue #59: exactly every unpublished public technical body has one dated review disposition',()=>{
  const docs=allDocs(),missing=docs.filter(d=>!getPublicArticle(d.file)).map(d=>d.file).sort();
  const registered=reviewed.items.map(x=>x.path).sort();
  assert.equal(reviewed.schemaVersion,1);
  assert.equal(reviewed.issue,59);
  assert.equal(reviewed.items.length,47);
  assert.equal(new Set(registered).size,registered.length,'duplicate source');
  assert.deepEqual(registered,missing,'no missing, renamed, added, or stale source record');
  assert.ok(reviewed.items.every(x=>x.reviewedOn&&x.remainingWork),'all items need a review date and next action');
});

test('Issue #59: source blob hashes are immutable; all claimed evidence is scoped',()=>{
  const allowed=new Set([
    '索引／模板已盤點（不是技術正文）',
    '官方來源指定主張已交叉核對',
    '原文已審閱，主張待進一步核實',
    '歷史案例已辨識（實測不能外推)'
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
