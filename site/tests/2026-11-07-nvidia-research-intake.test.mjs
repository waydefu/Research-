import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};
import {allDocs} from '../src/lib/catalog.mjs';
import {REVIEWED_DOCUMENTS,TOPIC_DESCRIPTORS} from '../src/lib/research-taxonomy.mjs';
import {EDITORIAL_LEADS} from '../src/lib/research-leads.mjs';
import {reviewForSource} from '../src/lib/source-review.mjs';
import {visualForDoc,renderResearchArt} from '../src/lib/research-visuals.mjs';

const cases=[
  {path:'research/2026-11-agent-engineering/08-nvidia-skillspector-agent-skill-security.md',topic:'Agent 權限與安全',motif:'scan',creator:'https://github.com/NVIDIA/SkillSpector',demo:'https://docs.nvidia.com/skills/scanning-agent-skills',proof:/71.*68|68.*71|71 種.*68 種/},
  {path:'research/2026-11-agent-engineering/09-nvidia-ai-workbench-reproducible-agent-containers.md',topic:'AI 開發環境與容器',motif:'container',creator:'https://docs.nvidia.com/ai-workbench/overview/introduction',demo:'https://docs.nvidia.com/ai-workbench/overview/introduction',proof:/CPU/},
  {path:'research/2026-11-local-ai-inference/02-nvidia-parakeet-v3-multilingual-asr.md',topic:'語音辨識與字幕',motif:'speech',creator:'https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3',demo:'https://huggingface.co/spaces/nvidia/parakeet-tdt-0.6b-v3',proof:/沒有中文/},
  {path:'research/2026-11-local-ai-inference/03-nvidia-broadcast-rtx-audio-video-effects.md',topic:'影片製作與自動化',motif:'camera',creator:'https://www.nvidia.com/en-us/geforce/broadcasting/broadcast-app/',demo:'https://www.nvidia.com/en-us/geforce/broadcasting/broadcast-app/',proof:/RTX 2060/}
];

test('four NVIDIA research entries have distinct, evidence-scoped public curation',()=>{
  const docs=allDocs();
  const illustrations=new Set();
  for(const c of cases){
    const matches=docs.filter(doc=>doc.file===c.path);
    assert.equal(matches.length,1,c.path);
    const doc=matches[0];
    assert.equal(REVIEWED_DOCUMENTS[c.path]?.topic,c.topic);
    assert.equal(doc.topic,c.topic);
    assert.ok(TOPIC_DESCRIPTORS[c.topic],c.topic);
    assert.equal(doc.publicTitle,REVIEWED_DOCUMENTS[c.path]?.publicTitle);
    assert.equal(doc.summary,EDITORIAL_LEADS[c.path]);
    assert.ok([...doc.summary].length>=60 && [...doc.summary].length<=160,c.path);
    assert.equal(doc.summaryFactChecked,false);
    assert.equal(doc.creator?.url,c.creator);
    assert.ok(doc.demos.some(d=>d.url===c.demo));
    assert.match(doc.text,c.proof);
    assert.match(doc.text,/NOT RUN|未安裝|未測量|未下載/);
    const art=visualForDoc(doc);
    assert.equal(art.motif,c.motif,c.path);
    assert.equal(art.originalWork,false);
    assert.match(art.alt,/非原作者作品截圖/);
    assert.ok(!illustrations.has(art.src),c.path);
    illustrations.add(art.src);
    const svg=renderResearchArt(doc);
    assert.ok(svg.length<16000,c.path);
    assert.match(svg,/data-motif=/);
    assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|(?:onload|onclick)\s*=/i);
  }
});

test('four immutable research blobs and last-source commits match dated review records',()=>{
  for(const c of cases){
    const raw=ongoing.items.filter(row=>row.path===c.path);
    assert.equal(raw.length,1,c.path);
    const row=raw[0];
    const src=readFileSync(resolve(process.cwd(),'..',c.path));
    const blob=createHash('sha1').update(Buffer.from('blob '+src.byteLength+'\0')).update(src).digest('hex');
    assert.equal(row.sourceBlobSha,blob,c.path);
    assert.equal(row.sourceRevision,allDocs().find(doc=>doc.file===c.path).sha,c.path);
    assert.equal(row.reviewedOn,'2026-11-07');
    assert.equal(row.benchmarkStatus,'NOT_RUN');
    assert.equal(row.externallyVerifiedAllClaims,false);
    assert.ok(row.knownSources.every(u=>u.startsWith('https://')));
    const review=reviewForSource(c.path);
    assert.ok(review);
    assert.equal(review.externallyVerifiedAllClaims,false);
    assert.ok(review.evidenceUrls.includes(c.creator)||review.evidenceUrls.includes(c.demo));
  }
});

test('ASR language restrictions, proprietary terms and scanner scope are not misrepresented',()=>{
  const docs=allDocs();
  const by=m=>docs.find(doc=>doc.file.includes(m)).text;
  assert.match(by('nvidia-parakeet-v3'),/不含中文|沒有中文/);
  assert.match(by('nvidia-broadcast-rtx'),/免費使用.*開源/);
  assert.match(by('nvidia-ai-workbench-reproducible'),/EULA/);
  assert.match(by('nvidia-skillspector-agent'),/68.*71|71.*68|71 種.*68 種/);
});
