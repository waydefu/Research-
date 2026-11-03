import {test,expect} from '@playwright/test';
const BASE='/Research-/v3/';

test('every parent research category has its own picture and specific explanation',async({page})=>{
  await page.goto(BASE+'library/');
  const categories=page.locator('.exhibit-list li');
  const count=await categories.count();
  expect(count).toBeGreaterThanOrEqual(6);
  const data=await categories.evaluateAll(nodes=>nodes.map(li=>({
    src:li.querySelector('img')?.getAttribute('src'),
    name:li.querySelector('.domain-summary strong')?.textContent?.trim(),
    what:li.querySelector('.domain-summary > span')?.textContent?.trim(),
    purpose:li.querySelector('.domain-summary small')?.textContent?.trim()
  })));
  expect(new Set(data.map(d=>d.src)).size).toBe(count);
  for(const item of data){
    expect(item.src).toMatch(/^\/Research-\/v3\/research-exhibits\/.*\.svg$/);
    expect(item.name?.length).toBeGreaterThan(4);
    expect(item.what?.length).toBeGreaterThan(15);
    expect(item.purpose?.length).toBeGreaterThan(15);
  }
  for(const img of await page.locator('.exhibit-list img').all()){
    await img.scrollIntoViewIfNeeded();
    await expect.poll(()=>img.evaluate(node=>node.complete&&node.naturalWidth>0)).toBeTruthy();
  }
});
test('child topics explain what the reader will learn, not just technical labels',async({page})=>{
  await page.goto(BASE+'domains/2026-11-universal-web-engine/');
  await expect(page.getByRole('heading',{level:1,name:'網站、三維場景與互動設計'})).toBeVisible();
  await expect(page.locator('.domain-topic')).not.toHaveCount(0);
  const entries=page.locator('.domain-topic-intro p:not(.eyebrow)');
  expect(await entries.count()).toBeGreaterThan(2);
  for(const text of await entries.allTextContents())expect(text.trim().length).toBeGreaterThan(14);
  await expect(page.locator('.domain-topic .document-list a').first()).toBeVisible();
});
for(const width of [320,393,768,1440]){
  test('visual category grid does not overflow at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:852});
    await page.goto(BASE+'library/');
    await expect(page.locator('.exhibit-list img').first()).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
