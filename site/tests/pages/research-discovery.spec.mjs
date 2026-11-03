import {test,expect} from '@playwright/test';
const BASE='/Research-/v3/';
const DOC=BASE+'research/2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow/';

test('library can narrow by domain, detailed topic, technology and keyword on mobile',async({page})=>{
  await page.setViewportSize({width:360,height:800});
  await page.goto(BASE+'library/');
  await expect(page.getByRole('heading',{name:/研究，不只是收藏答案/})).toBeVisible();
  const entries=page.locator('#library-results li');
  expect(await entries.count()).toBeGreaterThan(60);
  await page.locator('#library-topic').selectOption('3D 場景與 Shader');
  const visible=entries.locator('visible=true');
  const count=await visible.count();
  expect(count).toBeGreaterThan(0);
  for(const topic of await visible.evaluateAll(nodes=>nodes.map(n=>n.dataset.topic)))expect(topic).toBe('3D 場景與 Shader');
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
  await expect(page.getByRole('heading',{name:/Arctic Waters：電影級 Three\.js/})).toBeVisible();
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
  await page.locator('#topic-filter').selectOption('3D 場景與 Shader');
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
