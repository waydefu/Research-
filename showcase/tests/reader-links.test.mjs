import test from 'node:test';
import assert from 'node:assert/strict';
import { readerHref } from '../reader-links.js';

test('V2 research rows open V3 full articles in the current Pages site', () => {
  assert.equal(readerHref('research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap.md'), './v3/research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap/');
  assert.equal(readerHref('research/2026-11-agent-engineering/README.md'), './v3/research/2026-11-agent-engineering/README/');
  assert.equal(readerHref('docs/governance/RULES.md'), './v3/governance/RULES/');
  assert.equal(readerHref('research/知識 研究.md'), './v3/research/%E7%9F%A5%E8%AD%98%20%E7%A0%94%E7%A9%B6/');
});

test('never create guessed V3 routes for unavailable or unsafe sources', () => {
  for (const path of [
    'README.md', 'docs/governance/THREAT-MODEL.md', 'docs/governance/sub/THREAT-MODEL.md',
    'docs/governance/THREAT-MODEL.MD',
    'showcase/design/README.md', 'notes/test.md', '../research/secret.md',
    'research/../../secret.md', 'research//bad.md', 'research/x/../bad.md',
    'research/test.md#fragment', 'research/test.md?foo=bar',
    'research\\test.md', '', null, 7
  ]) {
    assert.equal(readerHref(path), null, String(path));
  }
});
