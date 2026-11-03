import {test,expect} from '@playwright/test';
const BASE='/Research-/v3/research/2026-11-universal-web-engine/';
const paths=[
 '19-v3-astro-research-cinema-architecture-and-roadmap/',
 '20-v3-chatgpt-5-6-execution-brief/',
 '21-p0-acceptance-and-p1-handoff/',
 '25-open-design-agent-kit-and-observatory-adoption/'
];
for(const slug of paths){
 test('mobile article leads with general technology; original remains opt-in: '+slug,async({page})=>{
  await page.setViewportSize({width:393,height:852});
  await page.goto(BASE+slug);
  const guide=page.locator('.public-article');
  await expect(guide.locator('h2').first()).toBeVisible();
  await expect(guide).not.toContainText('THE OBSERVATORY');
  const original=page.locator('details.original-record');
  await expect(original).toHaveCount(1);
  await expect(original).not.toHaveAttribute('open');
  await original.locator('summary').click();
  await expect(original.locator('.article-content')).toBeVisible();
  await expect(original.locator('.article-content')).not.toBeEmpty();
  await expect(page.locator('.provenance .sha')).not.toBeEmpty();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 });
}
test('technical guide and archived original work without JavaScript; other articles unchanged',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:780}});
 const page=await context.newPage();
 await page.goto(BASE+paths[0]);
 await expect(page.locator('.public-article h2').first()).toBeVisible();
 await page.locator('.original-record summary').click();
 await expect(page.locator('.original-record .article-content')).toBeVisible();
 await page.goto(BASE+'17-arctic-waters-threejs-creative-workflow/');
 await expect(page.locator('.public-article')).toHaveCount(0);
 await expect(page.locator('.article-content')).toBeVisible();
 await context.close();
});
