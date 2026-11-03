import {test,expect} from '@playwright/test';
const ROOT='/Research-/';
const BASE=ROOT+'v3/';
const ARTICLE=BASE+'research/2026-11-local-ai-inference/01-colibri-moe-streaming/';

for(const width of [320,393,430]){
  test('mobile home actions stay outside the reading glass and only one directory opener is visible at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:852});
    await page.goto(ROOT);
    const homeMenu=page.locator('#menuOpen'),duplicate=page.locator('#menuOpenDesktop');
    await expect(homeMenu).toBeVisible();
    await expect(duplicate).toBeHidden();
    const positions=await page.evaluate(()=>{
      const rect=sel=>document.querySelector(sel)?.getBoundingClientRect();
      const hero=rect('.hero'),actions=rect('.hero-actions'),glass=rect('.narrative-glass'),search=rect('.hero-discovery');
      return {hero:hero?.bottom,actions:actions?.bottom,glass:glass?.top,search:search?.bottom,overflow:document.documentElement.scrollWidth-innerWidth};
    });
    expect(positions.search).toBeLessThan(positions.actions);
    await expect(page.locator('.mobile-discovery-nav')).toBeHidden();
    await expect(page.locator('.hero-actions .outline-action')).toBeHidden();
    // Transparent glass can overlap the final hero padding, but never actionable controls.
    expect(positions.actions).toBeLessThanOrEqual(positions.glass+1);
    expect(positions.overflow).toBeLessThanOrEqual(1);
    await homeMenu.click();
    await expect(page.locator('#menuOverlay')).toHaveClass(/open/);
    await page.locator('#menuClose').click();
    await expect(page.locator('#menuOverlay')).not.toHaveClass(/open/);
  });
}
test('topic disclosure lists every article in place without search or script',async({page})=>{
  await page.goto(BASE+'library/');
  const target=page.locator('.topic-exhibit[data-topic="模型推論與記憶體"]');
  await expect(target).toBeVisible();
  const count=await page.locator('#library-results li[data-topic="模型推論與記憶體"]').count();
  expect(count).toBeGreaterThan(0);
  await expect(target.locator('.topic-articles a').first()).not.toBeVisible();
  const initial=page.url();
  await target.locator('summary').click();
  await expect(target).toHaveAttribute('open','');
  await expect(target.locator('.topic-articles a')).toHaveCount(count);
  await expect(target.locator('.topic-articles a').first()).toBeVisible();
  expect(page.url()).toBe(initial);
  await expect(page.locator('#library-topic')).toHaveValue('');
});
test('topic articles work without JavaScript and keep direct article links',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:780}});
  const page=await context.newPage();
  await page.goto(BASE+'library/');
  const target=page.locator('.topic-exhibit[data-topic="模型推論與記憶體"]');
  await target.locator('summary').click();
  await expect(target.locator('a').first()).toBeVisible();
  await target.locator('a').first().click();
  await expect(page.locator('.article-content')).not.toBeEmpty();
  await context.close();
});
test('local AI article is readable on mobile, has contextual gradient, not Markdown fences in preview',async({page})=>{
  await page.setViewportSize({width:393,height:852});
  await page.goto(ARTICLE);
  await expect(page.getByRole('heading',{level:1})).toContainText('記憶體不足時');
  await expect(page.locator('.reading-deck')).toContainText('固態硬碟');
  await expect(page.locator('.reading-deck')).not.toContainText('~~~');
  await expect(page.locator('.reading-deck')).not.toContainText('ready in 32s');
  const r=await page.evaluate(()=>{
    const side=document.querySelector('.reading-sidebar').getBoundingClientRect();
    const article=document.querySelector('.document').getBoundingClientRect();
    return {gap:article.top-side.bottom,background:getComputedStyle(document.querySelector('.reading-layout')).backgroundImage,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  expect(r.gap).toBeLessThan(55);
  expect(r.background).toContain('radial-gradient');
  expect(r.overflow).toBeLessThanOrEqual(1);
});
