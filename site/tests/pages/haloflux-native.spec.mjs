import {test,expect} from '@playwright/test';
const root='/Research-/';
for(const [name,width,height] of [['phone',390,844],['desktop',1440,900]]) {
  test(`native HALOFLUX draws a substantive light field on ${name}`, async({page},testInfo)=>{
    await page.setViewportSize({width,height});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(root+'v3/library/');
    const canvas=page.locator('.halo-stage');
    await expect(canvas).toBeAttached();
    await expect.poll(async()=>canvas.evaluate(c=>{
      const ctx=c.getContext('2d');
      const {data}=ctx.getImageData(0,0,c.width,c.height);
      let bright=0;for(let i=0;i<data.length;i+=4)if(data[i]+data[i+1]+data[i+2]>180)bright++;
      return bright/(data.length/4);
    }),{timeout:15000}).toBeGreaterThan(.003);
    await page.screenshot({path:testInfo.outputPath('native-halo-'+name+'.png')});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
    expect(errors).toEqual([]);
  });
}
test('phone light field animates when motion is enabled',async({page},testInfo)=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:390,height:844});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(root+'v3/library/');
  const canvas=page.locator('.halo-stage');
  const first=await canvas.evaluate(c=>c.toDataURL());
  await page.waitForTimeout(1200);
  const later=await canvas.evaluate(c=>c.toDataURL());
  expect(later).not.toBe(first);
  await page.screenshot({path:testInfo.outputPath('native-halo-animated-phone.png')});
  expect(errors).toEqual([]);
});
test('root homepage displays its canvas over the background on mobile',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(root);
  await expect(page.locator('html')).toHaveClass(/haloflux-ready/);
  const metrics=await page.evaluate(()=>({
    isolation:getComputedStyle(document.querySelector('.hero-world')).isolation,
    stageZ:getComputedStyle(document.querySelector('.hero-world .halo-stage')).zIndex,
    titleZ:getComputedStyle(document.querySelector('.hero-world .hero')).zIndex
  }));
  expect(metrics.isolation).toBe('isolate');
  expect(Number(metrics.stageZ)).toBeLessThan(Number(metrics.titleZ));
  await page.screenshot({path:testInfo.outputPath('native-halo-home-phone.png')});
});
