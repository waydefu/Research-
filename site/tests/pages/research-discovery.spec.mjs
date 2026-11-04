import {test,expect} from '@playwright/test';
const BASE='/Research-/v3/';
const DOC=BASE+'research/2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow/';

test('library can narrow by domain, detailed topic, technology and keyword on mobile',async({page})=>{
  await page.setViewportSize({width:360,height:800});
  await page.goto(BASE+'library/');
  await expect(page.getByRole('heading',{name:/想了解一項技術/})).toBeVisible();
  const entries=page.locator('#library-results li');
  expect(await entries.count()).toBeGreaterThan(60);
  await page.locator('#library-topic').selectOption('互動作品與設計案例');
  const visible=entries.locator('visible=true');
  const count=await visible.count();
  expect(count).toBeGreaterThan(0);
  for(const topic of await visible.evaluateAll(nodes=>nodes.map(n=>n.dataset.topic)))expect(topic).toBe('互動作品與設計案例');
  await page.locator('#library-keyword').fill('Arctic Waters');
  await expect(page.locator('#library-result-count')).toContainText('1 /');
  const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(horizontal).toBeLessThanOrEqual(1);
  await page.locator('#library-clear').click();
  await expect(page.locator('#library-result-count')).toContainText('顯示 '+(await entries.count())+' /');
});

test('document keeps original research, shows author and only loads third-party demo on click',async({page})=>{
  await page.route(/https:\/\/(?:3ditions\.drop3\.app|threejs\.org)\//,route=>route.abort());
  await page.goto(DOC);
  await expect(page.getByRole('heading',{name:/Arctic Waters：Three\.js 海洋作品的製作流程/})).toBeVisible();
  await expect(page.locator('article .article-content')).not.toBeEmpty();
  await expect(page.locator('.source-original a')).toHaveAttribute('href',/3ditions\.drop3\.app/);
  const frames=page.locator('.demo-viewport iframe');
  await expect(frames).toHaveCount(2);
  expect(await frames.evaluateAll(nodes=>nodes.every(frame=>!frame.hasAttribute('src')))).toBe(true);
  await page.locator('.demo-load').first().click();
  await expect(frames.first()).toHaveAttribute('src',/3ditions\.drop3\.app/);
  await expect(page.locator('.demo-viewport').first()).toBeVisible();
  await expect(page.locator('.demo-record').last().locator('a')).toHaveAttribute('href',/threejs\.org/);
});

test('search has topic and technology filters without losing keyword search',async({page})=>{
  await page.goto(BASE+'search/');
  await expect(page.locator('#search-feedback')).toContainText('輸入關鍵字');
  await page.locator('#topic-filter').selectOption('即時 3D 渲染與 Shader');
  await page.locator('#search-term').fill('Three.js');
  await page.getByRole('button',{name:'搜尋'}).click();
  await expect(page.locator('#search-feedback')).toContainText(/找到 \d+ 項結果/);
  expect(await page.locator('#search-results a').count()).toBeGreaterThan(0);
  await expect(page.locator('#tag-filter')).toBeVisible();
});

test('library and curated article remain available without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
  const page=await context.newPage();
  await page.goto(BASE+'library/');
  await expect(page.locator('#library-results li').first()).toBeVisible();
  await page.goto(DOC);
  await expect(page.locator('.article-content')).not.toBeEmpty();
  await expect(page.locator('.source-original a')).toBeVisible();
  await expect(page.locator('.demo-record a').first()).toBeVisible();
  await context.close();
});

test('mobile demo open-close-reopen unloads the heavy external iframe',async({page})=>{
  await page.setViewportSize({width:393,height:852});
  await page.route(/https:\/\/(?:3ditions\.drop3\.app|threejs\.org)\//,route=>route.abort());
  await page.goto(DOC);
  const button=page.locator('.demo-load').first();
  const panel=page.locator('.demo-viewport').first();
  const frame=panel.locator('iframe');
  await expect(button).toHaveText('在這裡載入示範');
  await expect(button).toHaveAttribute('aria-expanded','false');
  await expect(frame).not.toHaveAttribute('src',/https:/);
  await button.click();
  await expect(frame).toHaveAttribute('src',/3ditions\.drop3\.app/);
  await expect(button).toHaveAttribute('aria-expanded','true');
  await expect(panel).toBeVisible();
  await button.click();
  await expect(panel).toBeHidden();
  await expect(frame).not.toHaveAttribute('src',/3ditions\.drop3\.app/);
  expect(await frame.getAttribute('src')).toBeNull();
  await expect(button).toHaveText('在這裡載入示範');
  await expect(button).toHaveAttribute('aria-expanded','false');
  await button.click();
  await expect(frame).toHaveAttribute('src',/3ditions\.drop3\.app/);
  await expect(panel).toBeVisible();
  await expect(button).toHaveText('收合示範畫面');
});

test('reference case exposes the entire deduplicated list of citations',async({page})=>{
  await page.goto(BASE+'research/2026-11-universal-web-engine/10-creative-direction-and-reference-sites/');
  const index=page.locator('.source-index');
  await expect(index.locator('summary')).toContainText(/完整 33 筆/);
  await index.locator('summary').click();
  await expect(index.locator('li')).toHaveCount(33);
  const urls=await index.locator('a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  expect(new Set(urls).size).toBe(33);
});

test('search results beyond fifty remain reachable through progressive loading',async({page})=>{
  // Deterministic fixture covers >50 matches even if the real corpus is smaller.
  const mockJs=[
    "export async function options(){return true}",
    "export async function search(){return {results:Array.from({length:61},(_,i)=>({data:async()=>({url:'/Research-/v3/research/mock/report-'+i+'/',meta:{title:'測試研究 '+i},plain_excerpt:'研究示例 '+i})}))}}"
  ].join('\n');
  await page.route('**/pagefind/pagefind.js',route=>route.fulfill({
    status:200,contentType:'text/javascript',body:mockJs
  }));
  await page.goto(BASE+'search/');
  await page.locator('#search-term').fill('研究');
  await page.getByRole('button',{name:'搜尋'}).click();
  await expect(page.locator('#search-results a')).toHaveCount(25);
  const more=page.getByRole('button',{name:'載入更多研究'});
  await expect(more).toBeVisible();
  await more.click();
  await expect(page.locator('#search-results a')).toHaveCount(50);
  await expect(more).toBeVisible();
  await more.click();
  await expect(page.locator('#search-results a')).toHaveCount(61);
  await expect(more).toBeHidden();
  await expect(page.locator('#search-feedback')).toContainText('已顯示 61 項');
  await expect(page.locator('#search-results a').last()).toHaveAttribute('href','/Research-/v3/research/mock/report-60/');
  const links=await page.locator('#search-results a').evaluateAll(nodes=>nodes.map(a=>a.href));
  expect(new Set(links).size).toBe(61);
});


test('archived-original search is explicit, complete and retains provenance without exposing the excluded threat model',async({page})=>{
  await page.goto(BASE+'search/');
  expect(await page.evaluate(()=>performance.getEntriesByType('resource').some(e=>e.name.includes('original-search-index.json')))).toBe(false);
  const response=await page.request.get(BASE+'original-search-index.json');
  expect(response.ok()).toBe(true);
  const index=await response.json();
  expect(index.scope).toBe('archived-original-markdown');
  expect(index.documents).toHaveLength(87);
  expect(index.documents.some(d=>d.file.includes('THREAT-MODEL.md'))).toBe(false);
  const curated=index.documents.find(d=>d.file==='docs/governance/OPERATIONS.md');
  expect(curated?.text.length).toBeGreaterThan(100);
  expect(curated.sha).toMatch(/^[a-f0-9]{40}$/);
  await page.locator('input[name="search-scope"][value="original"]').check();
  await page.locator('#search-term').fill('Research-');
  await page.getByRole('button',{name:'搜尋'}).click();
  await expect(page.locator('#search-feedback')).toContainText(/找到 \d+ 項結果/);
  await expect(page.locator('#search-results a').first()).toBeVisible();
  await expect(page.locator('#search-results li').first()).toContainText('歷史原始研究｜未重新查證');
  await expect(page.locator('#search-results a').first()).toHaveAttribute('href',/^\/Research-\/v3\//);
  await page.locator('#search-term').fill('不應存在的測試關鍵字xyz987654');
  await page.getByRole('button',{name:'搜尋'}).click();
  await expect(page.locator('#search-feedback')).toContainText('找到 0 項結果');
});
