import {test,expect} from '@playwright/test';

// G0 automated *lab* acceptance. The Chromium viewport/touch results are NOT
// Android/iOS hardware validation, nor subjective visual signoff.
const ROOT='/Research-/';
const CASES=[
  {name:'sanctum',path:ROOT,heading:/技術研究與實作知識庫/},
  {name:'library',path:ROOT+'v3/library/',heading:/想了解一項技術/},
  {name:'search',path:ROOT+'v3/search/',heading:/搜尋整座研究館/},
  {name:'article',path:ROOT+'v3/research/2026-11-universal-web-engine/17-arctic-waters-threejs-creative-workflow/',heading:/Arctic Waters/}
];
const sizes=[
  {width:320,height:720},
  {width:360,height:780},
  {width:393,height:852},
  {width:430,height:932},
  {width:768,height:1024},
  {width:1440,height:900}
];

for(const size of sizes){
  test('G0 Chromium viewport evidence '+size.width+'px across all four page types',async({page},testInfo)=>{
    await page.setViewportSize(size);
    for(const item of CASES){
      await page.goto(item.path);
      await expect(page.getByRole('heading',{level:1,name:item.heading}).first()).toBeVisible();
      const evidence=await page.evaluate(()=>{
        const root=document.documentElement,body=document.body;
        const title=document.querySelector('h1'),header=document.querySelector('header');
        const overflow=root.scrollWidth-innerWidth;
        const background=getComputedStyle(body).backgroundImage;
        const headingStyle=title?getComputedStyle(title):null;
        const navCount=[...document.querySelectorAll('a[href]')].filter(a=>a.getAttribute('href')?.startsWith('/Research-/')).length;
        return {
          url:location.pathname,
          viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},
          scrollWidth:root.scrollWidth,overflow,
          text:title?.textContent?.trim().slice(0,140),
          fontFamily:headingStyle?.fontFamily,fontSize:headingStyle?.fontSize,
          color:headingStyle?.color,
          bodyBackground:background.slice(0,250),
          documentReady:document.readyState,
          localResearchLinks:navCount,
          headerVisible:Boolean(header&&header.getBoundingClientRect().width>0),
          imageCount:document.images.length
        };
      });
      expect(evidence.overflow,item.name+' overflow '+JSON.stringify(evidence)).toBeLessThanOrEqual(1);
      expect(evidence.headerVisible,item.name+' missing site header').toBe(true);
      if(item.name!=='sanctum'){
        await expect(page.locator('.global-header .brand-type')).toContainText('RESEARCH—');
        await expect(page.locator('.global-header .brand-mark')).toHaveText('✦');
      }
      expect(evidence.localResearchLinks,item.name+' lost local navigation').toBeGreaterThan(0);
      expect(evidence.text?.length).toBeGreaterThan(4);
      await testInfo.attach('g0-'+item.name+'-'+size.width+'.json',{
        body:Buffer.from(JSON.stringify(evidence,null,2)),contentType:'application/json'
      });
      await page.screenshot({path:testInfo.outputPath('g0-'+item.name+'-'+size.width+'-top.png')});
    }
  });
}

// Capture different scene beats, not merely four separate page headers.
for(const width of [393,1440]){
  test('G0 scroll narrative contact points at '+width+'px',async({page},testInfo)=>{
    await page.setViewportSize({width,height:width<500?852:900});
    await page.goto(ROOT);
    await expect(page.locator('.narrative-glass')).toBeAttached();
    const max=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
    expect(max).toBeGreaterThan(200);
    for(const [name,fraction] of [['arrival',0],['research',.35],['archive',.75],['ending',1]]){
      await page.evaluate(y=>window.scrollTo(0,y),Math.round(max*fraction));
      await page.waitForTimeout(80);
      const scrollY=await page.evaluate(()=>window.scrollY);
      expect(Math.abs(scrollY-Math.round(max*fraction))).toBeLessThan(4);
      await page.screenshot({path:testInfo.outputPath('g0-sanctum-'+width+'-'+name+'.png')});
    }
  });
}

test('G0 Android-like Chromium touch emulation: find content and collapse embedded demo',async({browser})=>{
  // Emulator configuration only; this test is NOT POCO F8 Ultra hardware evidence.
  const context=await browser.newContext({
    viewport:{width:393,height:852},deviceScaleFactor:3,
    isMobile:true,hasTouch:true,reducedMotion:'reduce'
  });
  const page=await context.newPage();
  await page.goto(ROOT);
  await expect(page.getByRole('heading',{name:/技術研究與實作知識庫/})).toBeVisible();
  await expect(page.locator('.site-footer')).toContainText('RESEARCH LIBRARY');
  await expect(page.locator('.site-footer')).not.toContainText('CONCEPT STUDY');
  await page.goto(ROOT+'v3/library/');
  await page.locator('#library-keyword').fill('Arctic Waters');
  await expect(page.locator('#library-result-count')).toContainText('1 /');
  await page.locator('#library-results li:visible a').first().tap();
  await expect(page.locator('.source-studio')).toBeVisible();
  const button=page.locator('.demo-load').first();
  const frame=page.locator('.demo-viewport iframe').first();
  await page.route(/https:\/\/(?:3ditions\.drop3\.app|threejs\.org)\//,route=>route.abort());
  await button.tap();
  await expect(frame).toHaveAttribute('src',/3ditions\.drop3\.app/);
  await button.tap();
  await expect(frame).not.toHaveAttribute('src',/https:/);
  await expect(button).toHaveAttribute('aria-expanded','false');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await context.close();
});

test('G0 reduced motion leaves reading, controls and full references usable',async({browser})=>{
  const context=await browser.newContext({viewport:{width:360,height:780},reducedMotion:'reduce',javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto(ROOT+'v3/library/');
  await expect(page.locator('#library-results li').first()).toBeVisible();
  await page.goto(ROOT+'v3/research/2026-11-universal-web-engine/10-creative-direction-and-reference-sites/');
  await expect(page.locator('.article-content')).not.toBeEmpty();
  await expect(page.locator('.source-index li')).toHaveCount(33);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await context.close();
});

for(const width of [320,393]){
  test('G0 simulated mobile navigation has practical touch targets at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:852});
    await page.goto(ROOT+'v3/library/');
    const targets=await page.locator('.global-header nav a:visible').evaluateAll(links=>links.map(a=>({
      label:a.textContent.trim(),width:a.getBoundingClientRect().width,height:a.getBoundingClientRect().height
    })));
    // The masthead itself is the home link; the mobile nav needs only two actions.
    await expect(page.getByRole('link',{name:/RESEARCH— THE OBSERVATORY.*返回天文觀測神殿首頁/})).toHaveAttribute('href','/Research-/');
    expect(targets.length).toBe(2);
    for(const target of targets){
      expect(target.height,target.label+' is too short to tap').toBeGreaterThanOrEqual(36);
      expect(target.width,target.label+' is too narrow to tap').toBeGreaterThanOrEqual(24);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    const sameRow=await page.evaluate(()=>{
      const brand=document.querySelector('.global-header .brand').getBoundingClientRect();
      const nav=document.querySelector('.global-header nav').getBoundingClientRect();
      return Math.abs(brand.top-nav.top)<8;
    });
    expect(sameRow,'Brand and mobile navigation unexpectedly wrapped into two rows').toBe(true);
  });
}
