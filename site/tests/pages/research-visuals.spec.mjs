import {test,expect} from '@playwright/test';
import {allDocs} from '../../src/lib/catalog.mjs';
import {visualFilename,ART_BASE} from '../../src/lib/research-visuals.mjs';
const BASE='/Research-/v3/';
test('all research cards have distinct generated illustrations and usable source labels',async({page})=>{
  await page.goto(BASE+'library/');
  const imgs=page.locator('#library-results .research-item-visual img');
  const urls=await imgs.evaluateAll(nodes=>nodes.map(img=>img.getAttribute('src')));
  // Every published source must have one unique, exact-path illustration.
  const expected=allDocs().map(d=>ART_BASE+visualFilename(d.file)).sort();
  expect(urls).toHaveLength(expected.length);
  expect(new Set(urls).size).toBe(expected.length);
  expect([...urls].sort()).toEqual(expected);
  for(const url of urls) expect(url).toMatch(/^\/Research-\/v3\/research-figures\/research-[0-9a-f]{8}\.svg$/);
  await imgs.first().scrollIntoViewIfNeeded();
  await expect.poll(()=>imgs.first().evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
});
test('article has a real per-source diagram, no third-party media and provenance remains visible',async({page})=>{
  await page.setViewportSize({width:393,height:852});
  await page.goto(BASE+'research/2026-11-universal-web-engine/26-luminati-hd2d-browser-engine/');
  const hero=page.locator('.article-research-art img');
  await expect(hero).toHaveAttribute('src',/\/research-figures\/research-/);
  await expect(hero).toHaveAttribute('alt',/原創技術示意圖.*Luminati.*非原作者作品截圖/);
  await hero.scrollIntoViewIfNeeded();
  await expect.poll(()=>hero.evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
  await expect(page.locator('.article-research-art figcaption')).toContainText('非作者原作畫面');
  await expect(page.locator('.provenance .sha')).not.toBeEmpty();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
