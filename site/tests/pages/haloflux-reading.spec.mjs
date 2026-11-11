import {test, expect} from '@playwright/test';

const root='/Research-/';
const pages=[root,root+'v3/library/',root+'v3/search/',root+'v3/domains/2026-11-universal-web-engine/',root+'v3/research/2026-11-universal-web-engine/01-framework-selection/'];
for(const width of [360,768,1440]){
  test(`the light field and reading navigation work at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:850});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    for(const url of pages){
      await page.goto(url);
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('canvas.halo-stage')).toHaveCount(1);
      await expect(page.locator('a[href="https://github.com/Ryder191/haloflux"]')).toBeAttached();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
      expect(await page.locator('canvas.halo-stage').evaluate(c=>c.width>0&&c.height>0)).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
test('reduced motion retains a rendered, stationary light field',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce'});
  const page=await context.newPage(); await page.goto(root+'v3/library/');
  const canvas=page.locator('canvas.halo-stage');
  const before=await canvas.evaluate(c=>c.toDataURL());
  await page.waitForTimeout(300);
  expect(await canvas.evaluate(c=>c.toDataURL())).toBe(before);
  await expect(page.locator('h1')).toBeVisible();
  await context.close();
});
