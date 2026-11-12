import {test,expect} from '@playwright/test';
const HOME='/Research-/',ATLAS='/Research-/v3/atlas/sanctum/';
const STYLE='/Research-/v3/haloflux-site/immersive.css';
const OLD='/Research-/v3/atlas/sanctum/g0-02.css';
const FIELD='/Research-/v3/haloflux-site/field.html';

// Root optical design uses the real upstream drawing functions. The legacy
// Sanctum preview intentionally retains its earlier golden editorial direction.
for(const [width,height] of [[320,852],[393,852],[768,900],[1440,900]]){
 test('HFX canonical root optical field, readable Chinese and responsive scene '+width,async({page},testInfo)=>{
  await page.setViewportSize({width,height});
  await page.goto(HOME);
  await expect(page.locator('link[rel="stylesheet"][href="'+STYLE+'"]')).toHaveCount(1);
  await expect(page.getByRole('heading',{level:1,name:/技術研究與實作知識庫/})).toBeVisible();
  const info=await page.evaluate(()=>{
   const source=document.querySelector('.hfx-field');
   const title=getComputedStyle(document.querySelector('.hero h1 .zh'));
   const copy=document.querySelector('.hero-left').getBoundingClientRect();
   const dock=getComputedStyle(document.querySelector('.hero-dock'));
   const fallback=getComputedStyle(source,'::before');
   const search=getComputedStyle(document.querySelector('.hero-discovery-row input'));
   const vars=getComputedStyle(document.documentElement);
   return {
    teal:vars.getPropertyValue('--hfx-teal').trim(),
    ink:vars.getPropertyValue('--hfx-void').trim(),
    serif:title.fontFamily,weight:title.fontWeight,
    source:source.getBoundingClientRect().width,
    fixed:getComputedStyle(source).position,
    pointer:getComputedStyle(source).pointerEvents,
    fallback:fallback.backgroundImage,
    fieldSrc:source.querySelector('iframe')?.dataset.src,
    copyTop:copy.top,
    dock:dock.display,
    inputSize:parseFloat(search.fontSize),
    overflow:document.documentElement.scrollWidth-innerWidth
   };
  });
  expect(info.teal).toBe('#98e0cf');
  expect(info.ink).toBe('#08090b');
  expect(info.serif).toContain('Chiron Sung HK');
  expect(info.weight).toBe('500');
  expect(info.fixed).toBe('fixed');
  expect(info.pointer).toBe('none');
  expect(info.source).toBeGreaterThanOrEqual(width-1);
  expect(info.fallback).toContain('radial-gradient');
  expect(info.fieldSrc).toBe(FIELD);
  expect(info.overflow).toBeLessThanOrEqual(1);
  if(width<=520){
   expect(info.copyTop,'text must not occupy the mobile optical focal zone').toBeGreaterThanOrEqual(height*.64);
   expect(info.inputSize).toBeGreaterThanOrEqual(16);
   expect(info.dock).toBe('none');
  }else if(width>=1101)expect(info.dock).not.toBe('none');
  await page.screenshot({path:testInfo.outputPath('hfx-optic-'+width+'.png'),fullPage:true});
 });
}

test('historical Sanctum study keeps old art separate from canonical HALOFLUX',async({page})=>{
 await page.goto(ATLAS);
 await expect(page.locator('link[rel="stylesheet"][href="'+OLD+'"]')).toHaveCount(1);
 const historic=await page.locator('.hero h1 .zh').evaluate(el=>({
  weight:getComputedStyle(el).fontWeight,
  font:getComputedStyle(el).fontFamily,
  gold:getComputedStyle(document.documentElement).getPropertyValue('--g002-gold').trim()
 }));
 expect(historic.weight).toBe('600');
 expect(historic.font).toContain('Noto Serif TC');
 expect(historic.gold).toBe('#d9b579');
 await page.goto(HOME);
 await expect(page.locator('link[rel="stylesheet"][href="'+STYLE+'"]')).toHaveCount(1);
 expect(await page.locator('.hero h1 .zh').evaluate(el=>getComputedStyle(el).fontWeight)).toBe('500');
});

test('canonical root keeps no-JS research links and reduced-motion fallback',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce',viewport:{width:393,height:852}});
 const page=await context.newPage();await page.goto(HOME);
 await expect(page.locator('.hero-actions .gold-action')).toBeVisible();
 await expect(page.locator('.vault-index a')).toHaveCount(4);
 await expect(page.locator('.hfx-field iframe')).not.toHaveAttribute('src',FIELD);
 const state=await page.evaluate(()=>{
  const img=getComputedStyle(document.querySelector('.vault-picture img'));
  return {duration:img.transitionDuration,transform:img.transform,scroll:getComputedStyle(document.documentElement).scrollBehavior};
 });
 expect(state.duration.split(',').every(v=>parseFloat(v)<=.001)).toBe(true);
 expect(state.transform).toBe('none');
 expect(state.scroll).toBe('auto');
 await context.close();
});
