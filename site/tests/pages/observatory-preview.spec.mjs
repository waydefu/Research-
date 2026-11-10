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
      expect(stageBounds,'the live scene must be full width, not a card').toBeTruthy();
      expect(stageBounds.x).toBeGreaterThanOrEqual(-1);
      expect(stageBounds.x).toBeLessThanOrEqual(1);
      expect(stageBounds.width).toBeGreaterThanOrEqual(width-2);
      expect(stageBounds.height).toBeGreaterThanOrEqual(560);
      expect(visual.copyTop,'hero artwork obscured by copy on mobile').toBeGreaterThanOrEqual(height*.63);
      expect(visual.introHeight).toBeGreaterThanOrEqual(height);
    }
    await page.screenshot({path:testInfo.outputPath('g1-01-first-scene-'+width+'.png')});
    await page.locator('#obs-scene').scrollIntoViewIfNeeded();
    await expect(page.locator('#obs-scene')).toHaveAttribute('data-renderer',/^(poster|shader)$/);
    const scene=page.locator('#obs-scene');
    const capable=await page.evaluate(()=>{
      try{return Boolean(document.createElement('canvas').getContext('webgl2'));}
      catch{return false;}
    });
    if(capable)await expect(scene,'the effect must render when the browser supports WebGL2')
      .toHaveAttribute('data-renderer','shader',{timeout:20000});
    const state=await scene.getAttribute('data-renderer');
    // Do not silently count a real WebGL2-capable Chromium renderer failure
    // as a passing 3D test. In browsers without WebGL2, poster is correct.
    if(capable)expect(state,'WebGL2 available but the shader failed').toBe('shader');
    if(state==='shader'){
      await expect(page.locator('#obs-fx-root canvas')).toBeVisible();
      await expect(page.locator('#obs-controls')).toBeVisible();
      await expect(page.locator('#obs-themes button')).toHaveCount(3);
      await page.getByRole('button',{name:/節能畫質/}).click();
      await expect(page.getByRole('button',{name:'節能畫質：開'})).toHaveAttribute('aria-pressed','true');
      await expect(scene).toHaveAttribute('data-quality','low');
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
  expect(url.title).toContain('電影式場景預覽');
});

const SHADER_CHUNK=/singularity[^/]*\.js(\?|$)/;
const webgl2=page=>page.evaluate(()=>{
  try{return Boolean(document.createElement('canvas').getContext('webgl2'));}catch{return false;}
});
// Decodes a screenshot inside the page and returns brightness and colour statistics.
const stats=async(page,locator)=>{
  const png=(await locator.screenshot()).toString('base64');
  return page.evaluate(async data=>{
    const blob=await (await fetch('data:image/png;base64,'+data)).blob();
    const bitmap=await createImageBitmap(blob);
    const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
    const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);
    const px=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let sum=0,max=0,dark=0,r=0,b=0;const n=px.length/4;
    for(let i=0;i<px.length;i+=4){
      const l=(.2126*px[i]+.7152*px[i+1]+.0722*px[i+2])/255;
      sum+=l;if(l>max)max=l;if(l<.08)dark++;r+=px[i];b+=px[i+2];
    }
    return {mean:sum/n,max,darkShare:dark/n,redMinusBlue:(r-b)/n};
  },png);
};

test('shader module and shader scene ship as local files, with no model asset or CDN',async({page})=>{
  const loaded=[];
  page.on('request',req=>loaded.push(req.url()));
  await page.goto(PREVIEW);
  await page.locator('#obs-scene').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  expect(loaded.filter(u=>/\.(glb|gltf)(\?|$)/i.test(u)),'no 3D model may be requested').toEqual([]);
  expect(loaded.filter(u=>!u.startsWith('http://127.0.0.1')&&!u.startsWith('data:')),'no third-party request').toEqual([]);
});
test('forced static poster must not fetch the shader module',async({page})=>{
  const fetched=[];
  page.on('request',req=>{if(SHADER_CHUNK.test(req.url()))fetched.push(req.url());});
  await page.goto(PREVIEW+'?poster=1');
  await page.locator('#obs-scene').scrollIntoViewIfNeeded();
  await expect(page.locator('#obs-scene')).toHaveAttribute('data-renderer','poster');
  expect(fetched).toEqual([]);
});
test('a failed shader module fetch falls back to static art without breaking research links',async({page})=>{
  await page.route(SHADER_CHUNK,route=>route.fulfill({status:503,contentType:'text/javascript',body:''}));
  await page.goto(PREVIEW);
  const capable=await webgl2(page);
  await page.locator('#obs-scene').scrollIntoViewIfNeeded();
  if(capable){
    await expect(page.locator('#obs-status')).toContainText('已回到靜態觀測所美術',{timeout:20000});
    await expect(page.locator('#obs-scene')).toHaveAttribute('data-renderer','poster');
  }
  await expect(page.locator('.obs-archive-actions a[href="/Research-/v3/library/"]')).toBeVisible();
});
test('first screen does not eagerly fetch the shader module',async({page})=>{
  const requests=[];
  page.on('request',req=>{if(SHADER_CHUNK.test(req.url()))requests.push(req.url());});
  await page.setViewportSize({width:393,height:852});
  await page.goto(PREVIEW);
  await expect(page.getByRole('heading',{level:1,name:/在未知的邊界/})).toBeVisible();
  expect(requests).toEqual([]);
});
test('the shader really paints: a hot core, a dark void and moving frames',async({page})=>{
  test.setTimeout(90_000);
  await page.setViewportSize({width:1280,height:800});
  await page.goto(PREVIEW+'?phase=1&q=low');
  const scene=page.locator('#obs-scene');
  await scene.scrollIntoViewIfNeeded();
  test.skip(!await webgl2(page),'WebGL2 unavailable: poster fallback covered separately');
  await expect(scene).toHaveAttribute('data-renderer','shader',{timeout:30_000});
  await expect.poll(()=>scene.getAttribute('data-frames').then(Number),{timeout:30_000}).toBeGreaterThan(1);
  const s=await stats(page,scene);
  expect(s.max,'a white-hot core must exist').toBeGreaterThan(.85);
  // Measured 0.19 on the default theme at phase 1 (violet haze fills part of the void).
  expect(s.darkShare,'there must be a dark void around the light').toBeGreaterThan(.12);
  expect(s.mean,'not a blank or a washed-out frame').toBeGreaterThan(.03);
  expect(s.mean).toBeLessThan(.6);
});
test('the picture moves when motion is allowed and holds still when it is not',async({page})=>{
  test.setTimeout(120_000);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1280,height:800});
  await page.goto(PREVIEW+'?phase=1&q=low');
  const scene=page.locator('#obs-scene');
  await scene.scrollIntoViewIfNeeded();
  test.skip(!await webgl2(page),'WebGL2 unavailable: poster fallback covered separately');
  await expect(scene).toHaveAttribute('data-renderer','shader',{timeout:30_000});
  await expect.poll(()=>scene.getAttribute('data-frames').then(Number),{timeout:30_000}).toBeGreaterThan(3);
  const first=(await scene.screenshot()).toString('base64');
  await page.waitForTimeout(2500);
  const second=(await scene.screenshot()).toString('base64');
  expect(second,'frames must differ while animating').not.toBe(first);
  await page.getByRole('button',{name:'暫停動態'}).click();
  await expect(page.getByRole('button',{name:'播放動態'})).toHaveAttribute('aria-pressed','true');
  await page.waitForTimeout(700);
  const frozenA=(await scene.screenshot()).toString('base64');
  await page.waitForTimeout(1500);
  const frozenB=(await scene.screenshot()).toString('base64');
  expect(frozenB,'a paused scene must not change').toBe(frozenA);
});
test('colour themes switch and the picture changes with them',async({page})=>{
  test.setTimeout(120_000);
  await page.setViewportSize({width:1280,height:800});
  await page.goto(PREVIEW+'?phase=1&q=low');
  const scene=page.locator('#obs-scene');
  await scene.scrollIntoViewIfNeeded();
  test.skip(!await webgl2(page),'WebGL2 unavailable: poster fallback covered separately');
  await expect(scene).toHaveAttribute('data-renderer','shader',{timeout:30_000});
  await page.getByRole('button',{name:'赤焰裂隙'}).click();
  await expect(scene).toHaveAttribute('data-theme','ember');
  await expect(page.getByRole('button',{name:'赤焰裂隙'})).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button',{name:'金色奇點'})).toHaveAttribute('aria-pressed','false');
  await page.waitForTimeout(1500);
  const ember=await stats(page,scene);
  await page.getByRole('button',{name:'冷光透鏡'}).click();
  await expect(scene).toHaveAttribute('data-theme','nebula');
  await page.waitForTimeout(1500);
  const nebula=await stats(page,scene);
  expect(ember.redMinusBlue,'ember is warm').toBeGreaterThan(nebula.redMinusBlue+10);
  expect(nebula.redMinusBlue,'nebula leans cold').toBeLessThan(ember.redMinusBlue);
});
test('scrolling drives the narrative phase of the effect',async({page})=>{
  test.setTimeout(120_000);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1280,height:800});
  await page.goto(PREVIEW+'?q=low');
  const scene=page.locator('#obs-scene');
  test.skip(!await webgl2(page),'WebGL2 unavailable: poster fallback covered separately');
  const place=fraction=>page.evaluate(f=>{
    const rect=document.getElementById('obs-scene').getBoundingClientRect();
    scrollBy(0,rect.top-innerHeight*f);
  },fraction);
  await place(.7);
  await expect(scene).toHaveAttribute('data-renderer','shader',{timeout:40_000});
  await place(.97);
  await expect.poll(()=>scene.getAttribute('data-phase').then(Number),{timeout:40_000}).toBeLessThan(.2);
  await place(.08);
  await expect.poll(()=>scene.getAttribute('data-phase').then(Number),{timeout:60_000}).toBeGreaterThan(.8);
});

// Reliability: headless Chromium does not necessarily mark a second
// browser tab as hidden; simulate document.hidden so the real document event
// handler and animation scheduling, not an unrelated resize, are tested.
test('animation resumes after document visibility is restored',async({page})=>{
  test.setTimeout(70_000);
  // The pages CI defaults to reduced motion, which intentionally pauses the renderer.
  // This test needs active animation frames to verify background/foreground rescheduling.
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.addInitScript(()=>{
    window.__obsFrameTicks=0;
    const request=window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame=cb=>request(time=>{
      window.__obsFrameTicks++;
      cb(time);
    });
  });
  await page.goto(PREVIEW);
  const scene=page.locator('#obs-scene');
  await scene.scrollIntoViewIfNeeded();
  const capable=await page.evaluate(()=>Boolean(document.createElement('canvas').getContext('webgl2')));
  test.skip(!capable,'WebGL2 unavailable: poster fallback already covered separately');
  await expect(scene).toHaveAttribute('data-renderer','shader',{timeout:25_000});
  await expect.poll(()=>page.evaluate(()=>window.__obsFrameTicks),{timeout:12_000}).toBeGreaterThan(4);
  await page.evaluate(()=>{
    Object.defineProperty(document,'hidden',{configurable:true,value:true});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(220); // Allow any frame queued before hiding to finish.
  const hiddenTicks=await page.evaluate(()=>window.__obsFrameTicks);
  await page.waitForTimeout(120);
  expect(await page.evaluate(()=>window.__obsFrameTicks)).toBe(hiddenTicks);
  await page.evaluate(()=>{
    Object.defineProperty(document,'hidden',{configurable:true,value:false});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(()=>page.evaluate(()=>window.__obsFrameTicks),{timeout:12_000})
    .toBeGreaterThan(hiddenTicks+4);
  await expect(scene).toHaveAttribute('data-renderer','shader');
});

test('simulated WebGL context loss hides inactive controls and restores the shader',async({page})=>{
  test.setTimeout(80_000);
  await page.goto(PREVIEW);
  const stage=page.locator('#obs-scene');
  await stage.scrollIntoViewIfNeeded();
  const capable=await page.evaluate(()=>Boolean(document.createElement('canvas').getContext('webgl2')));
  test.skip(!capable,'WebGL2 unavailable: poster fallback already covered separately');
  await expect(stage).toHaveAttribute('data-renderer','shader',{timeout:25_000});
  const canLose=await page.evaluate(()=>{
    const canvas=document.querySelector('#obs-fx-root canvas');
    const context=canvas?.getContext('webgl2');
    const extension=context?.getExtension('WEBGL_lose_context');
    if(!extension)return false;
    window.__observatoryContextExtension=extension;
    extension.loseContext();
    return true;
  });
  test.skip(!canLose,'WEBGL_lose_context not supported by this browser');
  await expect(stage).toHaveAttribute('data-renderer','poster');
  await expect(page.locator('#obs-controls')).toBeHidden();
  await expect(page.locator('#obs-status')).toContainText('圖形上下文已中斷');
  await expect(page.locator('.obs-archive-actions a[href="/Research-/v3/library/"]')).toBeVisible();
  await page.evaluate(()=>window.__observatoryContextExtension.restoreContext());
  await expect(stage).toHaveAttribute('data-renderer','shader',{timeout:30_000});
  await expect(page.locator('#obs-controls')).toBeVisible();
});
