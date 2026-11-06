import test from 'node:test';
import assert from 'node:assert/strict';
import {allDocs} from '../src/lib/catalog.mjs';
import {REVIEWED_DOCUMENTS} from '../src/lib/research-taxonomy.mjs';
import {EDITORIAL_LEADS} from '../src/lib/research-leads.mjs';
import {reviewForSource} from '../src/lib/source-review.mjs';
import ongoing from '../P1-ONGOING-SOURCE-REVIEW.json' with {type:'json'};
import {visualForDoc} from '../src/lib/research-visuals.mjs';

const cases = [
  {
    file: 'research/2026-11-universal-web-engine/34-forever-components-agent-retrieval-and-web-effects.md',
    topic: '創意前端工具與函式庫', motif: 'motion',
    source: 'https://github.com/isas1/forever-ai-components',
    evidence: /604|791/
  },
  {
    file: 'research/2026-11-universal-web-engine/35-ui-typography-readability-and-cjk.md',
    topic: '介面設計與視覺系統', motif: 'layout',
    source: 'https://www.w3.org/WAI/WCAG22/Understanding/text-spacing',
    evidence: /繁體中文|CJK/
  },
  {
    file: 'research/2026-11-agent-engineering/07-music-skill-editable-agent-composition.md',
    topic: 'Agent 工具與 Skills', motif: 'audio',
    source: 'https://github.com/owoevan-dev/music-skill',
    evidence: /FluidSynth/
  }
];

test('three November research entries are indexed, reviewed, and have distinct original schematics', () => {
  const docs = allDocs();
  const arts = new Set();
  for (const row of cases) {
    const doc = docs.find(d => d.file === row.file);
    assert.ok(doc, row.file);
    assert.equal(doc.topic, row.topic);
    assert.equal(REVIEWED_DOCUMENTS[row.file]?.topic, row.topic);
    assert.equal(doc.summary, EDITORIAL_LEADS[row.file]);
    assert.ok([...doc.summary].length >= 60 && [...doc.summary].length <= 160, row.file);
    assert.equal(doc.summaryFactChecked, false, row.file);
    assert.match(doc.text, row.evidence);
    const review = reviewForSource(row.file);
    assert.ok(review, row.file);
    const scopedRow = ongoing.items.find(item => item.path === row.file);
    assert.ok(scopedRow, row.file);
    assert.equal(scopedRow.benchmarkStatus, 'NOT_RUN');
    assert.equal(review.externallyVerifiedAllClaims, false);
    assert.ok(review.evidenceUrls.some(u => u.startsWith(row.source)));
    assert.ok(review.dispositionReason.length > 25);
    const visual = visualForDoc(doc);
    assert.equal(visual.motif, row.motif);
    assert.equal(visual.originalWork, false);
    assert.ok(visual.src?.startsWith('/Research-/v3/research-figures/'));
    assert.ok(!arts.has(visual.src), 'duplicated research illustration');
    arts.add(visual.src);
  }
});

test('study keeps image copyright and numeric claims bounded', () => {
  const docs = allDocs();
  const original = docs.find(d => d.file === cases[1].file)?.text;
  assert.match(original, /不將原圖複製|未複製圖像/);
  assert.match(original, /不是.*固定|不能直接.*固定/);
  const forever = docs.find(d => d.file === cases[0].file)?.text;
  assert.match(forever, /791/);
  assert.match(forever, /604/);
  assert.match(forever, /未實測|未測/);
  const music = docs.find(d => d.file === cases[2].file)?.text;
  assert.match(music, /未.*聆聽|尚未人工聆聽/);
});
