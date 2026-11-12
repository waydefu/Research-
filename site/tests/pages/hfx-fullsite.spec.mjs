import {test,expect} from '@playwright/test';
const ROOT='/Research-/',BASE=ROOT+'v3/',FIELD=BASE+'haloflux-site/field.html';
const routes=[
  ['home',ROOT],
  ['library',BASE+'library/'],
  ['domain',BASE+'domains/2026-11-universal-web-engine/'],
  ['search',BASE+'search/'],
  ['article',BASE+'research/2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow/']
];
for(const width of [393,1440]){
  for(const [kind,route] of routes){
    test('live HALOFLUX source stage throughout '+kind+' / '+width,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width<500?852:900});
      await page.emulateMedia({reducedMotion:'reduce'});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(route);
      const stage=page.locator('.hfx-field iframe');
      await expect(stage).toHaveCount(1);
      await expect(stage).toHaveAttribute('src',FIELD);
      await expect(stage).toHaveAttribute('aria-hidden','true');
      await expect(page.locator('link[href="'+BASE+'haloflux-site/immersive.css"]')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang','zh-Hant-TW');
      await expect(page.frameLocator('.hfx-field iframe').locator('html')).toHaveAttribute('data-hfx-source-stage','HALOFLUX');
      const info=await page.evaluate(()=>{
        const stage=document.querySelector('.hfx-field');
        return {
          overflow:document.documentElement.scrollWidth-innerWidth,
          interactive:getComputedStyle(stage).pointerEvents,
          body:document.body.className,
          title:document.querySelector('h1')?.innerText
        };
      });
      expect(info.overflow).toBeLessThanOrEqual(1);
      expect(info.interactive).toBe('none');
      expect(info.title).toBeTruthy();
      await expect(page.locator('a[href="'+BASE+'search/"]').first()).toBeAttached();
      await expect(page.getByText('HALOFLUX by Ryder191').last()).toBeVisible();
      if(width===393&&kind==='home')
        await page.screenshot({path:testInfo.outputPath('hfx-home-mobile.png')});
      if(width===1440&&kind==='home')
        await page.screenshot({path:testInfo.outputPath('hfx-home-desktop.png')});
      expect(errors).toEqual([]);
    });
  }
}
test('source-derived Canvas animates on the real homepage and can be paused by reader control',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(ROOT);
  const source=page.frameLocator('.hfx-field iframe');
  await expect(source.locator('html')).toHaveAttribute('data-hfx-source-stage','HALOFLUX');
  const canvas=source.locator('#stage');
  const initialTempo=await source.locator('html').evaluate(()=>C.tempo);
  await page.locator('.vault-index a').first().focus();
  await expect.poll(async()=>source.locator('html').evaluate(()=>C.rimBright)).toBe(2.35);
  await expect.poll(async()=>source.locator('html').evaluate(()=>C.tempo)).not.toBe(initialTempo);
  await page.locator('.hero-discovery input').focus();
  await expect.poll(async()=>source.locator('html').evaluate(()=>C.rimBright)).toBe(1.8);
  const first=await canvas.evaluate(el=>el.toDataURL());
  await page.waitForTimeout(1050);
  const later=await canvas.evaluate(el=>el.toDataURL());
  expect(later).not.toEqual(first);
  const pause=page.locator('.hfx-motion-control');
  await expect(pause).toBeVisible();
  await pause.click();
  await expect(pause).toHaveAttribute('aria-pressed','true');
  await expect(pause).toHaveText('恢復動效');
  await expect.poll(async()=>source.locator('html').evaluate(()=>integrationRunning)).toBe(false);
});
test('no JavaScript preserves first-party reading and source navigation',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
  const page=await context.newPage();
  await page.goto(ROOT);
  await expect(page.locator('.feature-card')).toHaveCount(3);
  await expect(page.locator('.vault-index a')).toHaveCount(4);
  await expect(page.locator('.hfx-field')).toHaveCount(1);
  await page.locator('.feature-card').first().click();
  await expect(page.locator('article[data-pagefind-body]')).toBeVisible();
  await expect(page.locator('.article-content')).not.toBeEmpty();
  await context.close();
});
test('search and domain selection preserve native navigation with live optical feedback',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto(ROOT);
  const domain=page.locator('.vault-index a').first();
  await domain.focus();
  await expect(domain).toBeFocused();
  await domain.click();
  await expect(page).toHaveURL(/\/v3\/domains\//);
  await expect(page.locator('.hfx-field iframe')).toBeAttached();
  await page.goto(BASE+'search/');
  await page.locator('#search-term').focus();
  await expect(page.locator('#search-term')).toBeFocused();
});
