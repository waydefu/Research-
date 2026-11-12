import test from 'node:test';
import assert from 'node:assert/strict';
import {localizeHtml,toTaiwanHant} from '../src/lib/zh-hant-display.mjs';

test('Taiwan Traditional conversion includes phrase-context handling and preserves English technical terms',()=>{
  assert.equal(toTaiwanHant('简体中文、汉字、机器学习和软件开发'),'簡體中文、漢字、機器學習和軟件開發');
  assert.equal(toTaiwanHant('头发与发展，里面的资料'),'頭髮與發展，裡面的資料');
  assert.equal(toTaiwanHant('OpenAI GPT-6 / WebGPU Three.js 2.0'),'OpenAI GPT-6 / WebGPU Three.js 2.0');
});
test('visible HTML and accessible name are localized but source code, URL, source SHA and scripts remain untouched',()=>{
  const html='<html lang="zh-Hant-TW"><head><meta name="description" content="简体中文标题"><title>机器学习和 GPU</title></head><body>'+
    '<a href="/Research-/v3/research/机器学习/" aria-label="软件设计" title="计算机">简体中文</a>'+
    '<img alt="图形设计" src="/static/机器学习.webp"><pre><code>const name="简体中文";</code></pre>'+
    '<script>const a="头发";</script><style>.x:after{content:"发展"}</style>'+
    '<div data-source-sha="fdaa2923">头发与发展</div></body></html>';
  const result=localizeHtml(html);
  assert.match(result,/<title>機器學習和 GPU<\/title>/);
  assert.match(result,/content="簡體中文標題"/);
  assert.match(result,/aria-label="軟件設計"/);
  assert.match(result,/alt="圖形設計"/);
  assert.match(result,/>頭髮與發展<\/div>/);
  assert.ok(result.includes('href="/Research-/v3/research/机器学习/"'));
  assert.ok(result.includes('src="/static/机器学习.webp"'));
  assert.ok(result.includes('const name="简体中文";'));
  assert.ok(result.includes('const a="头发";'));
  assert.ok(result.includes('content:"发展"'));
  assert.ok(result.includes('data-source-sha="fdaa2923"'));
});
test('real-world nested inline code stays raw, source citation remains readable',()=>{
  const actual=localizeHtml('<h2>软件的优势</h2><p>运行 <code>print("汉字")</code> 保留源代码。</p>');
  assert.match(actual,/<h2>軟件的優勢<\/h2>/);
  assert.match(actual,/<code>print\("汉字"\)<\/code>/);
  assert.match(actual,/保留源代碼/);
});
