import {test,expect} from '@playwright/test';
import {allDocs} from '../../src/lib/catalog.mjs';
const BASE='/Research-/v3/';
const ARTICLE=BASE+'research/2026-11-local-ai-inference/01-colibri-moe-streaming/';
const PAGES=[
  {name:'library',url:BASE+'library/',section:'library',heading:/想了解一項技術/},
  {name:'search',url:BASE+'search/',section:'search',heading:/搜尋整座研究館/},
  {name:'domain',url:BASE+'domains/2026-11-local-ai-inference/',section:'domain',heading:/自己的電腦與手機/},
  {name:'article',url:ARTICLE,section:'article',heading:/記憶體不足時/}
];
test.describe('HALOFLUX editorial continuity across the research site',()=>{
  for(const p of PAGES){
    for(const width of [320,393,768,1440]){
      test(p.name+' / '+width+'px: native Traditional Chinese optical type + usable layout',async({page},testInfo)=>{
        await page.setViewportSize({width,height:900});
        await page.emulateMedia({reducedMotion:'reduce'});
        await page.goto(p.url);
        await expect(page.locator('html')).toHaveAttribute('lang','zh-Hant-TW');
        await expect(page.locator('html')).toHaveAttribute('data-art-direction','haloflux');
        await expect(page.locator('body')).toHaveClass(new RegExp('research-inner-'+p.section));
        await expect(page.getByRole('heading',{level:1,name:p.heading})).toBeVisible();
        const metrics=await page.evaluate(()=>{
          const header=document.querySelector('.global-header');
          const title=document.querySelector('main h1');
          const font=el=>getComputedStyle(el).fontFamily;
          const link=document.querySelector('a[aria-label="HALOFLUX 整合研究光場"]');
          return {bodyFont:font(document.body),headlineFont:font(title),
            pageWidth:document.documentElement.scrollWidth-innerWidth,
            links:[...header.querySelectorAll('nav a')].map(a=>a.getAttribute('href')),
            artLink:link?.getAttribute('href'),
            headerHeight:header.getBoundingClientRect().height};
        });
        expect(metrics.bodyFont).toContain('Chiron Hei HK');
        expect(metrics.headlineFont).toContain('Chiron Sung HK');
        expect(metrics.artLink).toBe(BASE+'haloflux-research/');
        expect(metrics.links).toContain(BASE+'search/');
        expect(metrics.links).toContain(BASE+'library/');
        expect(metrics.pageWidth).toBeLessThanOrEqual(1);
        expect(metrics.headerHeight).toBeGreaterThan(50);
        await expect(page.locator('.research-masthead-status strong')).toHaveText(String(allDocs().length));
        if(width===393||width===1440)await page.screenshot({path:testInfo.outputPath('editorial-'+p.name+'-'+width+'.png'),fullPage:false});
      });
    }
  }
  test('source article and provenance retain meaningful no-JS content',async({browser})=>{
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
    const page=await context.newPage();
    await page.goto(ARTICLE);
    await expect(page.locator('article[data-pagefind-body]')).toBeVisible();
    await expect(page.locator('.article-content')).not.toBeEmpty();
    await expect(page.locator('.provenance')).toBeVisible();
    await expect(page.locator('a[href="'+BASE+'haloflux-research/"]')).toBeAttached();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    await context.close();
  });
  test('archive topic disclosure and search inputs retain keyboard access',async({page})=>{
    await page.setViewportSize({width:393,height:852});
    await page.goto(BASE+'library/');
    const topic=page.locator('.topic-exhibit').first();
    await topic.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(topic).toHaveAttribute('open','');
    await expect(topic.locator('.topic-articles a').first()).toBeVisible();
    await page.goto(BASE+'search/');
    await page.locator('#search-term').focus();
    await expect(page.locator('#search-term')).toBeFocused();
    await expect(page.locator('#domain-filter')).toBeVisible();
  });
});
