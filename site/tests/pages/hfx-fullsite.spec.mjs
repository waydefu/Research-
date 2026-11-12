import {test,expect} from '@playwright/test';

const ROOT='/Research-/',BASE=ROOT+'v3/';
const FIELD=BASE+'haloflux-site/field.html';
const routes=[
 ['home',ROOT],
 ['library',BASE+'library/'],
 ['domain',BASE+'domains/2026-11-universal-web-engine/'],
 ['search',BASE+'search/'],
 ['article',BASE+'research/2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow/']
];

// No runtime Canvas for users requesting less motion. Browser tests for layout,
// search and a11y must not be starved by a purely decorative source engine.
for(const width of [320,393,1440]){
 for(const [kind,route] of routes){
  test('HFX safe static fallback / '+kind+' / '+width,async({page},testInfo)=>{
   await page.setViewportSize({width,height:width<500?852:900});
   await page.emulateMedia({reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(route);
   const stage=page.locator('.hfx-field iframe');
   await expect(stage).toHaveCount(1);
   await expect(stage).toHaveAttribute('data-src',FIELD);
   await expect(stage).not.toHaveAttribute('src',FIELD);
   await expect(stage).toHaveAttribute('aria-hidden','true');
   await expect(page.locator('html')).toHaveAttribute('lang','zh-Hant-TW');
   await expect(page.locator('h1').first()).toBeVisible();
   await expect(page.getByText('HALOFLUX by Ryder191').last()).toBeVisible();
   await expect(page.locator('.hfx-source-credit')).toContainText('RYDER CODE / Ms MAIKEBAIs CAT');
   const info=await page.evaluate(()=>{
    const field=document.querySelector('.hfx-field');
    return {
     overflow:document.documentElement.scrollWidth-innerWidth,
     pointer:getComputedStyle(field).pointerEvents,
     backdrop:getComputedStyle(field,'::before').backgroundImage
    };
   });
   expect(info.overflow).toBeLessThanOrEqual(1);
   expect(info.pointer).toBe('none');
   expect(info.backdrop).toContain('radial-gradient');
   expect(errors).toEqual([]);
   if(width===393&&['home','library','search','article'].includes(kind))
    await page.screenshot({path:testInfo.outputPath('static-'+kind+'.png')});
  });
 }
}

test('source-derived stage animates, exposes real chapter/focus input and can pause',async({page})=>{
 await page.setViewportSize({width:1280,height:800});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto(ROOT);
 const stage=page.locator('.hfx-field iframe');
 await expect(stage).toHaveAttribute('src',FIELD,{timeout:10000});
 const frame=page.frameLocator('.hfx-field iframe');
 await expect(frame.locator('html')).toHaveAttribute('data-hfx-source-stage','HALOFLUX',{timeout:12000});
 const canvas=frame.locator('#stage');
 const state=()=>frame.locator('html').evaluate(()=>({
  count:Number(document.documentElement.dataset.hfxFrameCount),
  running:integrationRunning,
  chapter:C.tempo,
  rim:C.rimBright,
  particles:C.runnerCount
 }));
 await expect.poll(async()=>(await state()).count,{timeout:15000}).toBeGreaterThan(2);
 let start=await state();
 expect(start.running).toBe(true);
 expect(start.particles).toBeLessThanOrEqual(230);
 // Direct frame pixels, not merely a present <canvas>.
 const signature=()=>canvas.evaluate(node=>{
  const c=document.createElement('canvas');c.width=48;c.height=48;
  const x=c.getContext('2d');x.drawImage(node,0,0,48,48);
  const pixels=x.getImageData(0,0,48,48).data;
  let hash=2166136261;
  for(let i=0;i<pixels.length;i+=7)hash=Math.imul(hash^pixels[i],16777619);
  return hash>>>0;
 });
 const before=await signature();
 await page.waitForTimeout(1100);
 const after=await signature();
 expect(after).not.toBe(before);
 await page.locator('.vault-index a').first().focus();
 await expect.poll(async()=>(await state()).rim).toBe(2.35);
 await expect.poll(async()=>(await state()).chapter).not.toBe(start.chapter);
 await page.locator('.hero-discovery input').focus();
 await expect.poll(async()=>(await state()).rim).toBe(1.8);
 const button=page.locator('.hfx-motion-control');
 await expect(button).toHaveAccessibleName('暫停動效');
 await button.click();
 await expect(button).toHaveAccessibleName('恢復動效');
 await expect(button).toHaveAttribute('aria-pressed','true');
 await expect.poll(async()=>(await state()).running).toBe(false);
});

test('no JavaScript leaves a real research website and does not load decorative iframe',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
 const page=await context.newPage();
 await page.goto(ROOT);
 await expect(page.locator('.feature-card')).toHaveCount(3);
 await expect(page.locator('.vault-index a')).toHaveCount(4);
 await expect(page.locator('.hfx-field iframe')).not.toHaveAttribute('src',FIELD);
 await page.locator('.feature-card').first().click();
 await expect(page.locator('article[data-pagefind-body]')).toBeVisible();
 await expect(page.locator('.article-content')).not.toBeEmpty();
 await context.close();
});

test('real research navigation stays keyboard accessible and page-integrated',async({page})=>{
 await page.goto(ROOT);
 const domain=page.locator('.vault-index a').first();
 await domain.focus();await expect(domain).toBeFocused();
 await domain.click();await expect(page).toHaveURL(/\/v3\/domains\//);
 await expect(page.locator('.hfx-field')).toBeAttached();
 await page.goto(BASE+'search/');
 await page.locator('#search-term').focus();
 await expect(page.locator('#search-term')).toBeFocused();
});
