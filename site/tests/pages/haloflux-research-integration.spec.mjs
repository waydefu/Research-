import {test,expect} from '@playwright/test';
import {allDocs,domains} from '../../src/lib/catalog.mjs';
const BASE='/Research-/v3/';
const DIR=BASE+'haloflux-research/';

for(const [edition,width,height] of [['lab',1440,900],['mobile',390,844]]){
  test('HALOFLUX × real Research- catalog / '+edition,async({page},testInfo)=>{
    await page.setViewportSize({width,height});
    await page.emulateMedia({reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    const response=await page.request.get(DIR+'research-data.json');
    expect(response.ok()).toBe(true);
    const index=await response.json();
    expect(index.scope).toBe('public-research-catalog');
    expect(index.counts.documents).toBe(allDocs().length);
    expect(index.counts.areas).toBe(domains().length);
    expect(index.documents.map(d=>d.source)).not.toContain('docs/governance/THREAT-MODEL.md');
    await page.goto(DIR+edition+'.html');
    await expect(page.locator('html')).toHaveAttribute('data-research-index','ready');
    await expect(page.locator('.brand h1')).toHaveText('RESEARCH—');
    await expect(page.locator('#k0')).toHaveText(String(index.documents.length));
    await expect(page.locator('#k1')).toHaveText(String(index.counts.research));
    await expect(page.locator('#k2')).toHaveText(String(index.areas.length));
    await expect(page.locator('#feed .source-feed-title')).toHaveCount(12);
    await expect(page.locator('#routes .research-route-name')).toHaveCount(index.areas.length);
    await expect(page.locator('#agents .research-subject')).toHaveCount(index.areas.length);
    await expect(page.locator('#code .research-code-link')).toHaveCount(9);
    await expect(page.locator('#bgmBtn')).toBeAttached();
    await expect(page.locator('.console')).toBeVisible();
    const pixels=await page.locator('#stage').evaluate(c=>{
      const ctx=c.getContext('2d'),im=ctx.getImageData(0,0,c.width,c.height);
      let nonblack=0;
      for(let i=0;i<im.data.length;i+=4)if(im.data[i]+im.data[i+1]+im.data[i+2]>75)nonblack++;
      return nonblack/(im.data.length/4);
    });
    expect(pixels).toBeGreaterThan(.0001);
    await page.locator('#research-explore summary').click();
    await expect(page.locator('.research-drawer')).toBeVisible();
    await expect(page.locator('#research-domain-list a')).toHaveCount(index.areas.length);
    await page.locator('#research-query').fill('Shader');
    await expect(page.locator('form.research-find')).toHaveAttribute('action',BASE+'search/');
    await expect(page.locator('#research-domain-list a').first()).toHaveAttribute('href',/^\/Research-\/v3\/domains\//);
    await page.screenshot({path:testInfo.outputPath('haloflux-integrated-'+edition+'.png')});
    expect(errors).toEqual([]);
  });
}

test('real source links navigate to Research- article pages',async({page})=>{
  await page.goto(DIR+'lab.html');
  await expect(page.locator('html')).toHaveAttribute('data-research-index','ready');
  const href=await page.locator('#feed .source-feed-title').first().getAttribute('href');
  expect(href).toMatch(/^\/Research-\/v3\/(?:research|design|governance)\//);
  await page.locator('#feed .source-feed-title').first().click();
  await expect(page.locator('article[data-pagefind-body]')).toBeVisible();
});

test('without JavaScript, native navigation and source attribution are still usable',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(DIR+'mobile.html');
  await page.locator('#research-explore summary').click();
  await expect(page.locator('form.research-find input[name=q]')).toBeVisible();
  await expect(page.locator('a[href="'+BASE+'library/"]').first()).toBeVisible();
  await expect(page.locator('a[href="https://github.com/Ryder191/haloflux"]').first()).toBeAttached();
  await context.close();
});

test('when motion is enabled, the unchanged HALOFLUX canvas continues animating',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(DIR+'mobile.html');
  await expect(page.locator('html')).toHaveAttribute('data-research-index','ready');
  const first=await page.locator('#stage').evaluate(c=>c.toDataURL());
  await page.waitForTimeout(850);
  const later=await page.locator('#stage').evaluate(c=>c.toDataURL());
  expect(later).not.toEqual(first);
});
