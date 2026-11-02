import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE = '/Research-/v3/';
const ATLAS = BASE + 'atlas/';
const cases = ['concept-a','concept-b','concept-c'];
const viewports = [320,360,393,430,768,1440];

test('atlas entry exposes 3 distinct concepts and real P0 reading link', async ({ page }) => {
  await page.goto(ATLAS);
  await expect(page.getByRole('heading', { name: /讓研究有一座/ })).toBeVisible();
  for (const slug of cases) {
    expect(await page.locator('.atlas-option-image[href="' + ATLAS + slug + '/"]').count()).toBe(1);
  }
  await expect(page.getByRole('link', {name:/直接閱讀研究/})).toHaveAttribute('href',BASE+'search/');
});

for (const slug of cases) {
  test('G0 composition screenshots and functional source links: ' + slug, async ({ page }, testInfo) => {
    await page.setViewportSize({width:1440,height:900});
    await page.goto(ATLAS+slug+'/');
    for (const scene of ['home','article','search']) {
      const target = page.locator('[data-scene="'+scene+'"]');
      await expect(target).toBeVisible();
      const firstLink = target.locator('a[href^="'+BASE+'"]').first();
      await expect(firstLink).toHaveAttribute('href', /\/Research-\/v3\//);
      await target.screenshot({path:testInfo.outputPath(slug+'-'+scene+'-desktop.png')});
    }
    await page.setViewportSize({width:393,height:852});
    await page.reload();
    await page.locator('[data-scene="home"]').screenshot({path:testInfo.outputPath(slug+'-home-mobile.png')});
    const over = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    expect(over.scroll,slug+' mobile overflow').toBeLessThanOrEqual(over.width+1);
  });

  test('G0 mobile content and links remain accessible without JS: ' + slug, async ({browser}) => {
    const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:780}});
    const page = await context.newPage();
    await page.goto(ATLAS+slug+'/');
    await expect(page.locator('[data-scene="article"] h2')).not.toBeEmpty();
    await expect(page.locator('.atlas-search-launch')).toHaveAttribute('href',BASE+'search/');
    await page.locator('.atlas-search-launch').click();
    await expect(page).toHaveURL(new RegExp('/Research-/v3/search/'));
    await context.close();
  });
}

test('all 6 target widths: no horizontal document overflow and reachable Atlas pages',async ({page})=>{
  for (const width of viewports) {
    await page.setViewportSize({width,height:860});
    for(const path of ['','concept-a/','concept-b/','concept-c/','typography/','evidence/']) {
      await page.goto(ATLAS+path);
      const result = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
      expect(result.scroll, path+' at '+width+'px').toBeLessThanOrEqual(result.viewport+1);
    }
  }
});

test('reduced motion and serious/critical axe scan for G0 previews',async({browser})=>{
  const context = await browser.newContext({reducedMotion:'reduce',viewport:{width:393,height:852}});
  const page = await context.newPage();
  for(const path of ['','concept-a/','concept-b/','concept-c/','typography/','evidence/']){
    await page.goto(ATLAS+path);
    expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    const blocking=audit.violations.filter(v=>['critical','serious'].includes(v.impact));
    expect(blocking.map(v=>v.id+' '+v.nodes.map(n=>n.target.join(',')).join('|'))).toEqual([]);
  }
  await context.close();
});