import test from 'node:test';
import assert from 'node:assert/strict';
import { allDocs, getDoc, resolveLocal, backlinks, graph, domainDocs } from '../src/lib/catalog.mjs';

test('collects source docs without copying them', () => {
  const docs = allDocs();
  assert.ok(docs.length >= 60, 'Expected real repository markdown');
  assert.equal(new Set(docs.map(d => d.file)).size, docs.length);
  assert.ok(!docs.some(d => d.file.endsWith('THREAT-MODEL.md')));
  assert.ok(docs.every(d => d.title && d.href.startsWith('/Research-/v3/')));
});
test('all generated URLs identify a unique document', () => {
  const docs = allDocs();
  assert.equal(new Set(docs.map(d => d.href)).size, docs.length);
  for (const d of docs) {
    assert.equal(getDoc(d.collection, d.id), d);
    assert.ok(domainDocs(d.group).includes(d));
  }
});
test('relative source markdown resolves to internal route', () => {
  const doc = allDocs().find(d => /\/README\.md$/.test(d.file));
  assert.ok(doc);
  assert.equal(resolveLocal(doc, '#section').url, '#section');
  assert.equal(resolveLocal(doc, 'https://example.com/').url, 'https://example.com/');
  const result = resolveLocal(doc, './README.md');
  assert.equal(result.url, doc.href);
});
test('excluded governance content is never published', () => {
  const g = allDocs().find(d => d.collection === 'governance');
  assert.ok(g);
  const x = resolveLocal(g, 'THREAT-MODEL.md');
  assert.equal(x.kind, 'plain');
  assert.equal(graph().nodes.length, allDocs().length);
  assert.ok(!graph().nodes.some(n => n.id.endsWith('/THREAT-MODEL.md')));
});
test('backlinks only point to real entries', () => {
  const docs = allDocs();
  for (const doc of docs) assert.ok(backlinks(doc).every(b => docs.includes(b)));
});
