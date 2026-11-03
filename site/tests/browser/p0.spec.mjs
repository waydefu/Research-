import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const BASE = '/Research-/v3/';
const HOME = BASE + 'library/';
const DOC = BASE + 'research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap/';
const DOMAIN = BASE + 'domains/2026-11-universal-web-engine/';
const SEARCH = BASE + 'search/';
const words = ['治理', '模型', '研究', '效能', '安全', '測試', '代理', '網頁', '授權', '資料庫', '架構', '索引', '搜尋', '動畫', '來源', '渲染', '部署', '工具', '技術', '設計'];

test('20 real zh-TW queries return clickable results', async ({page}) => {
  await page.goto(SEARCH);
  await expect(page.locator('#search-feedback')).toContainText('輸入關鍵字');
  for (const word of words) {
    await page.locator('#search-term').fill(word);
    await page.getByRole('button', {name:'搜尋'}).click();
    await expect(page.locator('#search-feedback')).toContainText(/找到 \d+ 項結果/);
    const links = page.locator('#search-results a');
    const count = await links.count();
    expect(count, 'No result for ' + word).toBeGreaterThan(0);
    const first = await links.first().getAttribute('href');
    expect(first, 'Bad URL from ' + word).toContain('/Research-/v3/');
    console.log('[zh-TW search] ' + word + ': ' + count + ' shown; first: ' + first);
  }
});
test('search domain filter respects actual document domain', async ({page}) => {
  await page.goto(SEARCH);
  await expect(page.locator('#search-feedback')).toContainText('輸入關鍵字');
  await page.locator('#domain-filter').selectOption('2026-11-universal-web-engine');
  await page.locator('#search-term').fill('Astro');
  await page.getByRole('button', {name:'搜尋'}).click();
  await expect(page.locator('#search-feedback')).toContainText(/找到 \d+ 項結果/);
  const urls = await page.locator('#search-results a').evaluateAll(anchors => anchors.map(a=>a.getAttribute('href')));
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) expect(url).toContain('/research/2026-11-universal-web-engine/');
});
for (const [name, width, height] of [['phone',360,780], ['tablet',768,1024], ['desktop',1440,900]]) {
  test('readable and no horizontal page overflow: ' + name, async ({page}, testInfo) => {
    await page.setViewportSize({width,height});
    for (const [label,url] of [['home',HOME], ['document',DOC], ['search',SEARCH], ['domain',DOMAIN]]) {
      await page.goto(url);
      expect(await page.locator('h1').first().isVisible()).toBe(true);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth, innerWidth:innerWidth
      }));
      expect(overflow.scrollWidth, label + ' page overflow ' + JSON.stringify(overflow)).toBeLessThanOrEqual(width+1);
      await page.screenshot({path: testInfo.outputPath(name + '-' + label + '.png'), fullPage: true});
    }
    await page.goto(DOC);
    // The default page now shows a general technical guide. Historical tables
    // remain fully accessible after the reader opens the preserved source record.
    const sourceRecord=page.locator('details.original-record');
    await expect(sourceRecord).toHaveCount(1);
    await sourceRecord.locator('summary').click();
    const table = sourceRecord.locator('.table-scroll').first();
    await expect(table).toBeVisible();
    expect(await table.getAttribute('tabindex')).toBe('0');
    expect(await table.evaluate(el => el.scrollWidth >= el.clientWidth)).toBe(true);
    await table.focus();
    expect(await table.evaluate(el => document.activeElement === el)).toBe(true);
    if (name === 'desktop') {
      // A wide monitor must use its actual layout width, rather than leaving
      // unused space beside a 900px document and clipping whole columns.
      const size = await page.evaluate(() => {
        const article = document.querySelector('.reading-layout .document');
        const wrapper = document.querySelector('.original-record .table-scroll');
        const grid = wrapper.querySelector('table');
        return {
          articleWidth: article.getBoundingClientRect().width,
          wrapperWidth: wrapper.clientWidth,
          tableWidth: grid.getBoundingClientRect().width,
          overflow: wrapper.scrollWidth - wrapper.clientWidth
        };
      });
      expect(size.articleWidth).toBeGreaterThan(900);
      expect(size.tableWidth).toBeLessThanOrEqual(size.wrapperWidth + 1);
      expect(size.overflow).toBeLessThanOrEqual(1);
    }
  });
}
test('no JavaScript: reading and navigation remain available', async ({browser}, testInfo) => {
  const context = await browser.newContext({javaScriptEnabled:false, viewport:{width:360,height:780}});
  const page = await context.newPage();
  await page.goto(DOC);
  await expect(page.locator('article .article-content')).not.toBeEmpty();
  await page.locator('.reading-sidebar .back-link').click();
  await expect(page.locator('h1')).toContainText('網站、三維場景與互動設計');
  await page.goto(SEARCH);
  await expect(page.locator('#search-fallback ol li').first()).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('no-js-search.png'), fullPage:true});
  await context.close();
});
test('reduced motion: no smooth scroll and readable content', async ({browser}, testInfo) => {
  const context = await browser.newContext({reducedMotion:'reduce', viewport:{width:360,height:780}});
  const page = await context.newPage();
  await page.goto(DOC);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await expect(page.locator('article .article-content')).not.toBeEmpty();
  await page.screenshot({path:testInfo.outputPath('reduced-motion-document.png'),fullPage:true});
  await context.close();
});
for (const [label,url] of [['home',HOME],['document',DOC],['search',SEARCH],['domain',DOMAIN]]) {
  test('axe WCAG 2.2 serious/critical scan: ' + label, async ({page}) => {
    await page.goto(url);
    const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    const blocking = results.violations.filter(v => ['serious','critical'].includes(v.impact));
    expect(blocking.map(v => v.id + ' ' + v.description + ' ' + v.nodes.map(n => n.target.join(',')).join('|'))).toEqual([]);
  });
}
