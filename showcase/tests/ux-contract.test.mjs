import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const read = file => readFileSync(fileURLToPath(new URL('../' + file, import.meta.url)), 'utf8');

test('concept-map selection refreshes its active SVG and both filter states', () => {
  const app = read('app.js');
  const start = app.indexOf('function goGroup(');
  const end = app.indexOf('function makeSVG(', start);
  assert.ok(start >= 0 && end > start, 'group navigation handler is present');
  const source = app.slice(start, end);
  assert.match(source, /renderFilters\(\);renderGraph\(\);applyFilter\(\)/);
  assert.match(app, /'aria-pressed':String\(state\.group===d\.id\)/);
  assert.match(app, /e\.preventDefault\(\);goGroup\(d\.id,true\)/);
  assert.match(source, /focus\(\{preventScroll:true\}\)/);
});

test('search announces concise counts and offers a working no-JS fallback', () => {
  const html = read('index.html');
  const app = read('app.js');
  assert.match(html, /id="results-count" role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(html, /id="results" class="results"><\/div>/);
  assert.match(html, /<noscript>[\s\S]*github\.com\/waydefu\/Research-\/tree\/main\/research[\s\S]*<\/noscript>/);
  assert.match(html, /id="explorer-title" tabindex="-1"/);
  assert.match(app, /index-source-link/);
  assert.match(app, /fallback\.target='_blank'/);
});

test('mobile removes decorative fixed noise without hiding content or controls', () => {
  const css = read('styles.css');
  assert.match(css, /@media\(max-width:760px\)\{\.noise\{display:none\}\}/);
  assert.match(css, /\.no-js-index/);
});
