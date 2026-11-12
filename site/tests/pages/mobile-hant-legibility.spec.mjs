import {test,expect} from '@playwright/test';
import {allDocs} from '../../src/lib/catalog.mjs';
const BASE='/Research-/v3/';
const pages=[
  ['library',BASE+'library/'],
  ['search',BASE+'search/'],
  ['domain',BASE+'domains/2026-11-local-ai-inference/'],
  ['article',BASE+'research/2026-11-local-ai-inference/01-colibri-moe-streaming/']
];
for(const width of [320,393,430]){
  for(const [kind,url] of pages){
    test('Traditional UI & mobile readability / '+kind+' / '+width,async({page},testInfo)=>{
      await page.setViewportSize({width,height:852});
      await page.goto(url);
      await expect(page.locator('html')).toHaveAttribute('lang','zh-Hant-TW');
      await expect(page.locator('h1').first()).toBeVisible();
      const measured=await page.evaluate(kind=>{
        const px=selector=>{
          const node=document.querySelector(selector);
          return node?parseFloat(getComputedStyle(node).fontSize):null;
        };
        const body=getComputedStyle(document.body).fontFamily;
        return {
          width:document.documentElement.scrollWidth-innerWidth,
          body:px('body'),
          title:px('main h1'),
          text:px(kind==='article'?'.article-content':kind==='library'?'.archive-intro .intro-sub':kind==='search'?'#search-term':'.domain-what'),
          label:px(kind==='article'?'.provenance':kind==='library'?'.domain-summary>small':kind==='search'?'#search-feedback':'.domain-usage'),
          bodyFont:body,
          mainText:document.querySelector('main')?.innerText||''
        };
      },kind);
      expect(measured.width).toBeLessThanOrEqual(1);
      expect(measured.body).toBeGreaterThanOrEqual(16);
      expect(measured.text).toBeGreaterThanOrEqual(kind==='article'?17:16);
      expect(measured.label).toBeGreaterThanOrEqual(kind==='article'?12:kind==='library'?13:kind==='search'?14:15);
      expect(measured.title).toBeGreaterThanOrEqual(28);
      expect(measured.bodyFont).toContain('Chiron Hei HK');
      if(width===393)await page.screenshot({path:testInfo.outputPath('mobile-hant-'+kind+'.png')});
    });
  }
}
test('archive source bytes/SHA remain unchanged; localized search display fields are supplemental',async({page})=>{
  const index=(await (await page.request.get(BASE+'original-search-index.json')).json());
  expect(index.scope).toBe('archived-original-markdown');
  expect(index.documents.length).toBe(allDocs().length);
  for(const original of allDocs()){
    const doc=index.documents.find(x=>x.file===original.file);
    expect(doc).toBeTruthy();
    expect(doc.text).toBe(original.text);
    expect(doc.sha).toBe(original.sha);
    expect(doc.href).toBe(original.href);
  }
  expect(index.documents.some(d=>d.file==='docs/governance/THREAT-MODEL.md')).toBe(false);
});
test('HALOFLUX integration index keeps stable URLs while offering Traditional display fields',async({page})=>{
  const idx=(await (await page.request.get(BASE+'haloflux-research/research-data.json')).json());
  expect(idx.scope).toBe('public-research-catalog');
  expect(idx.documents.length).toBe(allDocs().length);
  for(const doc of idx.documents){
    expect(doc.href).toMatch(/^\/Research-\/v3\//);
    expect(doc.sha).toBeTruthy();
    expect(doc.source).not.toContain('THREAT-MODEL.md');
  }
});
