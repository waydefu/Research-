import {test,expect} from '@playwright/test';
const SHEET='/Research-/v3/atlas/sanctum/sanctum-core.css';
const G002='/Research-/v3/atlas/sanctum/g0-02.css';
const HFX='/Research-/v3/haloflux-site/immersive.css';
for(const route of ['/Research-/','/Research-/v3/atlas/sanctum/']){
 for(const width of [320,393,768,1440]){
  test('Canonical HFX vs retained Sanctum art study, responsive '+width+' '+route,async({page})=>{
   await page.setViewportSize({width,height:width<=430?852:900});
   await page.goto(route);
   await expect(page.locator('link[rel="stylesheet"][href="'+SHEET+'"]')).toHaveCount(1);
   await expect(page.locator('link[rel="stylesheet"][href="'+G002+'"]')).toHaveCount(1);
   await expect(page.getByRole('heading',{level:1,name:/技術研究與實作知識庫/})).toBeVisible();
   const metrics=await page.evaluate(()=>{
    const oldArt=getComputedStyle(document.querySelector('.world-backdrop'),'::before');
    const oldScene=getComputedStyle(document.querySelector('.world-backdrop'));
    const oldGlass=getComputedStyle(document.querySelector('.narrative-glass'));
    const title=getComputedStyle(document.querySelector('.hero h1 .zh'));
    const field=document.querySelector('.hfx-field');
    return {
     oldImage:oldArt.backgroundImage,
     oldPosition:oldScene.position,
     oldVisibility:oldScene.visibility,
     oldGlass:oldGlass.backgroundImage,
     weight:title.fontWeight,
     source:field?.querySelector('iframe')?.dataset.src,
     livePosition:field?getComputedStyle(field).position:null,
     liveFallback:field?getComputedStyle(field,'::before').backgroundImage:null,
     teal:getComputedStyle(document.documentElement).getPropertyValue('--hfx-teal').trim(),
     overflow:document.documentElement.scrollWidth-innerWidth,
     inlineStyles:document.querySelectorAll('head style').length
    };
   });
   expect(metrics.overflow).toBeLessThanOrEqual(1);
   expect(metrics.inlineStyles).toBe(0);
   if(route==='/Research-/'){
    // Original art still ships as archive CSS but is not the visible root.
    await expect(page.locator('link[rel="stylesheet"][href="'+HFX+'"]')).toHaveCount(1);
    expect(metrics.oldVisibility).toBe('hidden');
    expect(metrics.livePosition).toBe('fixed');
    expect(metrics.liveFallback).toContain('radial-gradient');
    expect(metrics.source).toBe('/Research-/v3/haloflux-site/field.html');
    expect(metrics.teal).toBe('#98e0cf');
    expect(metrics.weight).toBe('500');
   }else{
    expect(metrics.oldImage).toContain(width<=800?'world-mobile.webp':'world-desktop.webp');
    expect(metrics.oldPosition).toBe('fixed');
    expect(metrics.oldGlass).toContain('linear-gradient');
    expect(metrics.weight).toBe('600');
    expect(metrics.source).toBeUndefined();
   }
   const orig=await page.request.get(SHEET);
   expect(orig.ok()).toBe(true);
   expect(await orig.text()).toContain('.world-backdrop');
  });
 }
}
