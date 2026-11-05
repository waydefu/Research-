import {test,expect} from '@playwright/test';

const PREVIEW='/Research-/v3/observatory/';
const LIBRARY='/Research-/v3/library/';
const SEARCH='/Research-/v3/search/';
for(const width of [320,393,768,1440]){
  test('G1-01 cinematic site has real research routes, image-first hero and progressive rendering '+width,async({page},testInfo)=>{
    const height=width<=430?852:900;
    await page.setViewportSize({width,height});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(PREVIEW);
    await expect(page.getByRole('heading',{level:1,name:/在未知的邊界/})).toBeVisible();
    await expect(page.locator('.obs-world picture img')).toHaveAttribute('src',/world-desktop\.webp$/);
    await expect(page.locator('picture source')).toHaveAttribute('srcset',/world-mobile\.webp$/);
    await expect(page.locator('.obs-topic-list li')).toHaveCount(4);
    await expect(page.locator('.obs-featured li')).toHaveCount(3);
    await expect(page.getByRole('link',{name:/開啟完整典藏館/})).toHaveAttribute('href',LIBRARY);
    await expect(page.getByRole('link',{name:/全文檢索所有研究/})).toHaveAttribute('href',SEARCH);
    const visual=await page.evaluate(()=>{
      const copy=document.querySelector('.obs-intro-copy').getBoundingClientRect();
      const intro=document.querySelector('.obs-intro').getBoundingClientRect();
      return {copyTop:copy.top,introHeight:intro.height,
        overflow:document.documentElement.scrollWidth-innerWidth};
    });
    expect(visual.overflow).toBeLessThanOrEqual(1);
    if(width<=600){
      expect(visual.copyTop,'central armillary image obscured on mobile').toBeGreaterThanOrEqual(height*.63);
      expect(visual.introHeight).toBeGreaterThanOrEqual(height);
    }
    await page.screenshot({path:testInfo.outputPath('g1-01-first-scene-'+width+'.png')});
    await page.locator('#obs-scene').scrollIntoViewIfNeeded();
    await expect(page.locator('#obs-scene')).toHaveAttribute('data-renderer',/^(poster|three)$/);
    await page.waitForTimeout(800);
    const state=await page.locator('#obs-scene').getAttribute('data-renderer');
    if(state==='three'){
      await expect(page.locator('#obs-three-root canvas')).toBeVisible();
      await expect(page.locator('#obs-controls')).toBeVisible();
      await page.getByRole('button',{name:/節能畫質/}).click();
      await expect(page.getByRole('button',{name:'節能畫質：開'})).toHaveAttribute('aria-pressed','true');
    }else{
      await expect(page.locator('.obs-scene-backdrop')).toBeVisible();
      await expect(page.locator('#obs-controls')).toBeHidden();
    }
    await page.screenshot({path:testInfo.outputPath('g1-01-scene-'+width+'.png')});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('G1-01 forced poster path has accessible research links without GPU',async({page})=>{
  await page.goto(PREVIEW+'?poster=1');
  await page.locator('#obs-scene').scrollIntoViewIfNeeded();
  await expect(page.locator('#obs-scene')).toHaveAttribute('data-renderer','poster');
  await expect(page.locator('#obs-status')).toContainText('已強制使用');
  await expect(page.locator('#obs-controls')).toBeHidden();
  await page.getByRole('link',{name:/開啟完整典藏館/}).click();
  await expect(page).toHaveURL(new RegExp(LIBRARY));
});
test('G1-01 with JavaScript disabled still has chapters, original artwork and source-backed navigation',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
  const page=await context.newPage();
  await page.goto(PREVIEW);
  await expect(page.locator('.obs-world picture img')).toBeVisible();
  await expect(page.locator('.obs-topic-list li')).toHaveCount(4);
  await expect(page.locator('.obs-scene-backdrop')).toBeVisible();
  await page.getByRole('link',{name:/開啟完整典藏館/}).click();
  await expect(page).toHaveURL(new RegExp(LIBRARY));
  await context.close();
});
test('G1-01 mobile menu opens and closes accessibly',async({page})=>{
  await page.setViewportSize({width:393,height:852});
  await page.goto(PREVIEW);
  const menu=page.getByRole('button',{name:'展開網站選單'});
  await expect(menu).toHaveAttribute('aria-expanded','false');
  await menu.click();
  await expect(page.getByRole('button',{name:'收合網站選單'})).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#obs-mobile-nav')).toBeVisible();
  await page.locator('#obs-mobile-nav').getByRole('link',{name:'研究分類'}).click();
  await expect(page.locator('#obs-mobile-nav')).toBeHidden();
});
test('G1-01 preview remains unindexed and self-hosted without runtime CDN',async({page})=>{
  await page.goto(PREVIEW);
  const robots=page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute('content','noindex,follow');
  const url=await page.evaluate(()=>({
    external:[...document.querySelectorAll('script[src],link[rel="stylesheet"],img[src]')]
      .map(n=>n.getAttribute('src')||n.getAttribute('href'))
      .filter(s=>/^https?:\/\//i.test(s)),
    title:document.title
  }));
  expect(url.external).toEqual([]);
  expect(url.title).toContain('G1-01');
});
