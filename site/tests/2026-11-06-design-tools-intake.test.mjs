import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {allDocs} from '../src/lib/catalog.mjs';
import {REVIEWED_DOCUMENTS} from '../src/lib/research-taxonomy.mjs';
import {EDITORIAL_LEADS} from '../src/lib/research-leads.mjs';
import {reviewForSource} from '../src/lib/source-review.mjs';
import {visualForDoc} from '../src/lib/research-visuals.mjs';
import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};

const root=resolve(process.cwd(),'..');
const cases=[
  {file:'research/2026-11-universal-web-engine/36-gradientdeck-design-md-library-for-agents.md',
   topic:'介面設計與視覺系統',motif:'layout',source:'https://ui.gradientdeck.com/',evidence:/1,286/},
  {file:'research/2026-11-universal-web-engine/37-threejs-grassworks-webgpu-grass-and-forest-demo.md',
   topic:'即時 3D 渲染與 Shader',motif:'cube',source:'https://grassworks.techredux.co/',evidence:/WebGPU/}
];

test('GradientDeck and Grassworks studies are indexed, reviewed, and have distinct original schematics',()=>{
  const docs=allDocs();
  const arts=new Set();
  for(const row of cases){
    const doc=docs.find(d=>d.file===row.file);
    assert.ok(doc,row.file);
    assert.equal(doc.topic,row.topic);
    assert.equal(REVIEWED_DOCUMENTS[row.file]?.topic,row.topic);
    assert.equal(doc.summary,EDITORIAL_LEADS[row.file]);
    assert.ok([...doc.summary].length>=60&&[...doc.summary].length<=160,row.file);
    assert.equal(doc.summaryFactChecked,false,row.file);
    assert.match(doc.text,row.evidence);
    const review=reviewForSource(row.file);
    assert.ok(review,row.file);
    const scoped=ongoing.items.find(item=>item.path===row.file);
    assert.ok(scoped,row.file);
    assert.equal(scoped.benchmarkStatus,'NOT_RUN');
    assert.equal(review.externallyVerifiedAllClaims,false);
    assert.ok(review.evidenceUrls.some(u=>u.startsWith(row.source)));
    const visual=visualForDoc(doc);
    assert.equal(visual.motif,row.motif);
    assert.equal(visual.originalWork,false);
    assert.ok(!arts.has(visual.src),'duplicated research illustration');
    arts.add(visual.src);
  }
});

test('source review pins the exact blob of the committed Markdown',()=>{
  for(const row of cases){
    const body=readFileSync(resolve(root,row.file));
    const blob=createHash('sha1').update(Buffer.concat([Buffer.from('blob '+body.length+'\0'),body])).digest('hex');
    const item=ongoing.items.find(i=>i.path===row.file);
    assert.equal(item.sourceBlobSha,blob,row.file+' changed after its review was registered');
  }
});

test('studies keep licence, third-party content and unrun-test claims bounded',()=>{
  const docs=allDocs();
  const deck=docs.find(d=>d.file===cases[0].file)?.text;
  assert.match(deck,/第三方詮釋|詮釋/);
  assert.match(deck,/授權.*未|未.*授權|授權不明/);
  assert.match(deck,/不抄它的品牌|不把別人的色票/);
  const grass=docs.find(d=>d.file===cases[1].file)?.text;
  assert.match(grass,/NOT RUN/);
  assert.match(grass,/不得把購得的原始碼放進來|不要把購得的/);
  assert.match(grass,/檢索|嵌入/);
  assert.match(grass,/非法律意見/);
  assert.match(grass,/以 WebGL2 為基線/);
  assert.doesNotMatch(grass,/本站|Research-/,'public study must not narrate the internal project');
  assert.doesNotMatch(deck,/本站|Research-/,'public study must not narrate the internal project');
});
