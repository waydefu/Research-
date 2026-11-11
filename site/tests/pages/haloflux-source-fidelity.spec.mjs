import {test, expect} from '@playwright/test';

const origin='/Research-/v3/haloflux/';
for(const [edition,width,height] of [['lab',1440,900],['mobile',390,844]]) {
  test(`HALOFLUX original ${edition}: full canvas and moving source scene`, async({page})=>{
    await page.setViewportSize({width,height});
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.goto(origin+`${edition}.html`);
    const canvas=page.locator('canvas#stage');
    await expect(canvas).toBeVisible();
    await expect(page.locator('.brand h1')).toContainText('RYDER CODE');
    await expect(page.locator('#bgmBtn')).toBeAttached();
    await expect(page.locator('.panels')).toBeVisible();
    await expect.poll(()=>canvas.evaluate(el=>el.width>100 && el.height>100)).toBeTruthy();
    const imageBefore=await canvas.evaluate(el=>el.toDataURL('image/png'));
    await page.waitForTimeout(950);
    const imageAfter=await canvas.evaluate(el=>el.toDataURL('image/png'));
    expect(imageAfter).not.toBe(imageBefore);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
  });
}
test('HALOFLUX entry preserves original mobile/desktop routing and attribution',async({page})=>{
  await page.goto(origin);
  await expect.poll(()=>page.url().endsWith('/mobile.html') || page.url().endsWith('/lab.html')).toBe(true);
  await expect(page.locator('.brand h1')).toContainText('RYDER CODE');
});
