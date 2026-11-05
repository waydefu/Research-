import {test,expect} from '@playwright/test';
const ROOT='/Research-/',V3=ROOT+'v3/';
test('one public homepage with the full reviewed Sanctum',async({page})=>{
  await page.goto(ROOT);
  await expect(page.getByRole('heading',{name:/技術研究與實作知識庫/})).toBeVisible();
  await expect(page.locator('.world-backdrop')).toBeAttached();
  await expect(page.locator('.narrative-glass')).toBeAttached();
  expect(await page.locator('body').innerText()).not.toContain('THE UNKNOWN,');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://waydefu.github.io/Research-/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','index,follow');
  const assets=await page.evaluate(()=>[...document.querySelectorAll('link[rel="preload"][as="image"]')].map(a=>new URL(a.href).pathname));
  expect(assets).toEqual(expect.arrayContaining([V3+'atlas/sanctum/assets/world-desktop.webp',V3+'atlas/sanctum/assets/world-mobile.webp']));
  await expect(page.locator('a[href="'+V3+'library/"]')).not.toHaveCount(0);
});
test('secondary V3 homepage leads to the canonical root',async({page})=>{
  await page.goto(V3);
  await expect(page).toHaveURL(/\/Research-\/$/);
  await expect(page.getByRole('heading',{name:/技術研究與實作知識庫/})).toBeVisible();
});
test('retired V2 entry forwards to the single research archive without its own site',async({page})=>{
  await page.goto(V3+'library/');
  await expect(page.getByRole('heading',{name:/想了解一項技術/})).toBeVisible();
  await page.goto(ROOT+'v2/');
  await expect(page).toHaveURL(/\/Research-\/v3\/library\//);
  await expect(page.getByRole('heading',{name:/想了解一項技術/})).toBeVisible();
});
test('no-JS public root keeps original research article links',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
  const page=await context.newPage();
  await page.goto(ROOT);
  await expect(page.locator('.feature-card')).toHaveCount(3);
  await expect(page.locator('.vault-index a')).toHaveCount(4);
  await page.locator('.feature-card').first().click();
  await expect(page.locator('article[data-pagefind-body]')).toBeVisible();
  await context.close();
});
