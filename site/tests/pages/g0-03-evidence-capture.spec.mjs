import {test,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';

// Browser-emulated evidence ONLY. These files are candidate frames for human
// review, not approved pixel baselines, phone thermals or field CWV data.
const viewports=[
  {width:320,height:852},{width:393,height:852},
  {width:768,height:900},{width:1440,height:900}
];

for(const {width,height} of viewports){
  test('G0-03 evidence: rooted HALOFLUX original optical scene, story chapters and image safety '+width,async({page},testInfo)=>{
    await page.setViewportSize({width,height});
    await page.goto('/Research-/');
    await expect(page.locator('.hfx-field iframe')).toHaveAttribute('data-src','/Research-/v3/haloflux-site/field.html');
    await expect(page.getByRole('heading',{level:1,name:/技術研究與實作知識庫/})).toBeVisible();
    await expect(page.locator('.hero-discovery input[name="q"]')).toBeVisible();

    const chapters=['#vault','#featured','.at-glance'];
    const metrics=await page.evaluate(()=>{
      const rect=selector=>{
        const element=document.querySelector(selector);
        const box=element?.getBoundingClientRect();
        return box?{top:Math.round(box.top),bottom:Math.round(box.bottom),
          width:Math.round(box.width),height:Math.round(box.height)}:null;
      };
      const scene=getComputedStyle(document.querySelector('.hfx-field'));
      const art=getComputedStyle(document.querySelector('.hfx-field'),'::before');
      return {
        horizontalOverflow:document.documentElement.scrollWidth-innerWidth,
        scenePosition:scene.position,
        opticalFallback:art.backgroundImage,
        sourcePointer:scene.pointerEvents,
        headline:rect('.hero h1'),
        headlineCopy:rect('.hero-left'),
        search:rect('.hero-discovery'),
        glass:rect('.narrative-glass'),
        chapters:Object.fromEntries(['#vault','#featured','.at-glance'].map(k=>[k,rect(k)])),
        researchLinks:[...document.querySelectorAll('.vault-index a')].map(a=>a.getAttribute('href')),
        featuredLinks:[...document.querySelectorAll('.feature-card')].map(a=>a.getAttribute('href'))
      };
    });
    expect(metrics.horizontalOverflow).toBeLessThanOrEqual(1);
    expect(metrics.scenePosition).toBe('fixed');
    expect(metrics.opticalFallback).toContain('radial-gradient');
    expect(metrics.sourcePointer).toBe('none');
    expect(metrics.researchLinks).toHaveLength(4);
    expect(metrics.featuredLinks).toHaveLength(3);
    expect(metrics.search?.width).toBeGreaterThan(120);
    if(width<=520){
      expect(metrics.headlineCopy.top,'mobile central scene obstructed').toBeGreaterThanOrEqual(height*.64);
    }

    const screenshots=[];
    await page.screenshot({path:testInfo.outputPath('first-scene-'+width+'.png')});
    screenshots.push('first-scene-'+width+'.png');

    for(const [i,chapter] of chapters.entries()){
      await page.locator(chapter).scrollIntoViewIfNeeded();
      await expect(page.locator(chapter)).toBeVisible();
      const filename='chapter-'+(i+1)+'-'+width+'.png';
      await page.screenshot({path:testInfo.outputPath(filename)});
      screenshots.push(filename);
    }
    writeFileSync(testInfo.outputPath('g0-03-evidence-'+width+'.json'),
      JSON.stringify({
        schemaVersion:1,
        kind:'chromium-browser-emulation',
        approvedGolden:false,
        ownerSignoff:false,
        physicalAndroid:false,
        physicalIOS:false,
        fieldCWV:null,
        gpuFrameMs:null,
        measuredThermals:null,
        ciCheckoutSha:process.env.GITHUB_SHA||'LOCAL_UNBOUND',
        url:'/Research-/',
        viewport:{width,height},
        screenshots,
        metrics
      },null,2)+'\n');
  });
}

test('G0-03 story can reach source-backed article without image or JS trapping navigation',async({page})=>{
  await page.setViewportSize({width:393,height:852});
  await page.goto('/Research-/');
  await page.locator('.hero-actions .gold-action').click();
  await expect(page).toHaveURL(/\/Research-\/v3\/library\//);
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.goto('/Research-/v3/research/2026-11-universal-web-engine/29-rendering-ceiling-benchmark-and-adoption-gates/');
  await expect(page.locator('.article-content')).not.toBeEmpty();
  await expect(page.locator('.source-review')).toContainText('尚未實測');
});
