import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {FONT_REF,FONTS} from '../scripts/fonts.mjs';
const read=path=>readFileSync(fileURLToPath(new URL('../'+path,import.meta.url)),'utf8');

test('V2 original tokens, semantic contrast and no live font CDN',()=>{
  const css=read('styles.css'),html=read('index.html');
  assert.match(css,/--void:#0A101D/);
  assert.match(css,/--gold:#E4B451/);
  assert.match(css,/--cyan:#40D4DE/);
  assert.match(css,/@font-face/);
  assert.match(css,/assets\/fonts\/manrope-variable\.ttf/);
  assert.match(html,/THE UNKNOWN,/);
  assert.doesNotMatch(html,/fonts\.googleapis|fonts\.gstatic|cdnjs/);
});
test('four distinct self-hosted OFL fonts and license texts are immutable',()=>{
  assert.match(FONT_REF,/^[a-f0-9]{40}$/);
  assert.equal(FONTS.filter(x=>x.file.endsWith('.ttf')).length,4);
  assert.equal(FONTS.filter(x=>x.file.endsWith('-OFL.txt')).length,3);
  for(const font of FONTS){
    assert.match(font.blob,/^[a-f0-9]{40}$/);
    assert.ok(font.path.startsWith('ofl/'));
    assert.ok(!font.file.includes('/'));
  }
});
