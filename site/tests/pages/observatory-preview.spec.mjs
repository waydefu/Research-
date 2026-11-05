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
      const stageBounds=await page.locator('#obs-scene').boundingBox();
      expect(stageBounds,'cinematic 3D must be in a full-width scene, not a card').toBeTruthy();
      expect(stageBounds.x).toBeGreaterThanOrEqual(-1);
      expect(stageBounds.x).toBeLessThanOrEqual(1);
      expect(stageBounds.width).toBeGreaterThanOrEqual(width-2);
      expect(stageBounds.height).toBeGreaterThanOrEqual(520);
      expect(visual.copyTop,'central armillary image obscured on mobile').toBeGreaterThanOrEqual(height*.63);
      expect(visual.introHeight).toBeGreaterThanOrEqual(height);
    }
    await page.screenshot({path:testInfo.outputPath('g1-01-first-scene-'+width+'.png')});
    await page.locator('#obs-scene').scrollIntoViewIfNeeded();
    await expect(page.locator('#obs-scene')).toHaveAttribute('data-renderer',/^(poster|three)$/);
    const scene=page.locator('#obs-scene');
    const capable=await page.evaluate(()=>{
      try{return Boolean(document.createElement('canvas').getContext('webgl2'));}
      catch{return false;}
    });
    if(capable)await expect(scene,'3D must render when the browser supports WebGL2')
      .toHaveAttribute('data-renderer','three',{timeout:20000});
    const state=await scene.getAttribute('data-renderer');
    // Do not silently count a real WebGL2-capable Chromium renderer failure
    // as a passing 3D test. In browsers without WebGL2, poster is correct.
    if(capable)expect(state,'WebGL2 available but model failed').toBe('three');
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

test('G1-02 asset and build manifest are local and self-contained',async({page})=>{
  const asset='/Research-/v3/observatory/observatory-v1.glb';
  const manifest='/Research-/v3/observatory/model-manifest.json';
  const glb=await page.request.get(asset);
  expect(glb.ok()).toBe(true);
  const bytes=await glb.body();
  expect(bytes.subarray(0,4).toString('ascii')).toBe('glTF');
  expect(bytes.readUInt32LE(4)).toBe(2);
  expect(bytes.readUInt32LE(8)).toBe(bytes.length);
  expect(bytes.length).toBeLessThan(4_500_000);
  const meta=await page.request.get(manifest);
  expect(meta.ok()).toBe(true);
  const m=await meta.json();
  expect(m.sha256).toHaveLength(64);
  expect(m.authoredBy).toBe('repository-procedural-script');
  expect(m.blenderExported).toBe(false);
  expect(m.bytes).toBe(bytes.length);
});
test('G1-02 forced static poster must not fetch the optional GLB',async({page})=>{
  const fetched=[];
  page.on('request',req=>{if(req.url().endsWith('.glb'))fetched.push(req.url());});
  await page.goto('/Research-/v3/observatory/?poster=1');
  await page.locator('#obs-scene').scrollIntoViewIfNeeded();
  await expect(page.locator('#obs-scene')).toHaveAttribute('data-renderer','poster');
  expect(fetched).toEqual([]);
});

test('G1-02 failed GLB fetch must fall back to static art without breaking research links',async({page})=>{
  const glb='/Research-/v3/observatory/observatory-v1.glb';
  await page.route('**/observatory-v1.glb',route=>route.fulfill({
    status:503,contentType:'application/octet-stream',body:''
  }));
  await page.goto('/Research-/v3/observatory/');
  const capable=await page.evaluate(()=>{
    try{return Boolean(document.createElement('canvas').getContext('webgl2'));}
    catch{return false;}
  });
  await page.locator('#obs-scene').scrollIntoViewIfNeeded();
  if(capable){
    await expect(page.locator('#obs-status')).toContainText('已回到靜態觀測所美術',{timeout:20000});
    await expect(page.locator('#obs-scene')).toHaveAttribute('data-renderer','poster');
  }
  await expect(page.locator('.obs-archive-actions a[href="/Research-/v3/library/"]')).toBeVisible();
  const response=await page.request.get(glb);
  expect(response.ok()).toBe(true); // page.request bypasses the browser's route.
});

test('G1-02 first screen does not eagerly fetch optional geometry',async({page})=>{
  const requests=[];
  page.on('request',req=>{if(req.url().endsWith('.glb'))requests.push(req.url());});
  await page.setViewportSize({width:393,height:852});
  await page.goto('/Research-/v3/observatory/');
  await expect(page.getByRole('heading',{level:1,name:/在未知的邊界/})).toBeVisible();
  expect(requests).toEqual([]);
});
