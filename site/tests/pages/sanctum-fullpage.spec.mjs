import { test, expect } from '@playwright/test';

const BASE = '/Research-/v3/';
const PREVIEW = BASE + 'atlas/sanctum/';

test('Design Atlas prominently opens the current full-page Sanctum preview', async ({ page }) => {
  await page.goto(BASE + 'atlas/');
  await expect(page.getByRole('link',{name:/開啟高保真全頁神殿原型/})).toHaveAttribute('href',PREVIEW);
  await page.getByRole('link',{name:/開啟高保真全頁神殿原型/}).click();
  await expect(page).toHaveURL(new RegExp('/Research-/v3/atlas/sanctum/'));
  await expect(page.getByRole('heading',{name:/Observatory Sanctum/})).toBeVisible();
  await expect(page.locator('.hero-discovery input[name="q"]')).toBeVisible();
});

for (const width of [320,360,393,430,768,1440]) {
  test('Sanctum fixed world, readable gradient glass, images and no overflow at '+width+'px', async ({ page }, testInfo) => {
    await page.setViewportSize({width,height:width <= 430 ? 852 : 900});
    await page.goto(PREVIEW);
    await expect(page.locator('.world-backdrop')).toBeAttached();
    await expect(page.locator('.featured')).toBeVisible();
    const before = await page.evaluate(() => ({
      rootWidth:document.documentElement.scrollWidth,
      viewport:innerWidth,
      backgroundPosition:getComputedStyle(document.querySelector('.world-backdrop')).position,
      glass:getComputedStyle(document.querySelector('.narrative-glass')).backdropFilter,
      veil:parseFloat(getComputedStyle(document.body).getPropertyValue('--veil-alpha')),
      assets:Array.from(document.images).every(im=>im.getAttribute('src')?.startsWith('./assets/'))
    }));
    expect(before.rootWidth,'Horizontal overflow').toBeLessThanOrEqual(width+1);
    expect(before.backgroundPosition).toBe('fixed');
    expect(before.glass).toContain('blur(');
    expect(before.assets,'Editorial assets should be local, cached WebP files').toBe(true);
    await page.locator('img').evaluateAll(imgs=>imgs.forEach(im=>{im.loading='eager'}));
    await expect.poll(async()=>page.evaluate(()=>Array.from(document.images).every(im=>im.complete&&im.naturalWidth>0))).toBe(true);
    await page.evaluate(() => window.scrollTo(0, Math.min(1000,document.documentElement.scrollHeight/2)));
    await expect.poll(async()=>await page.evaluate(()=>parseFloat(getComputedStyle(document.body).getPropertyValue('--veil-alpha')))).toBeGreaterThan(before.veil);
    const after = await page.evaluate(() =>({
      bg:getComputedStyle(document.querySelector('.world-backdrop')).position,
      article:document.querySelector('.featured .feature-card')?.getAttribute('href'),
      veil:parseFloat(getComputedStyle(document.body).getPropertyValue('--veil-alpha'))
    }));
    expect(after.bg).toBe('fixed');
    expect(after.article).toContain('/Research-/v3/research/');
    expect(after.veil).toBeGreaterThan(0.1);
    await page.screenshot({path:testInfo.outputPath('sanctum-glass-'+width+'.png')});
  });
}

test('Sanctum mobile navigation is actionable and Escape restores accessibility',async ({page})=>{
  await page.setViewportSize({width:393,height:852});
  await page.goto(PREVIEW);
  const toggle=page.getByRole('button',{name:'開啟導覽選單'});
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(page.getByRole('dialog',{name:'觀測所研究目錄'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#menuOverlay')).not.toBeVisible();
});

test('Sanctum has no JavaScript dependency for content and research links',async ({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
  const page=await context.newPage();
  await page.goto(PREVIEW);
  await expect(page.getByRole('heading',{name:/Observatory Sanctum/})).toBeVisible();
  await expect(page.locator('.feature-card')).toHaveCount(3);
  await expect(page.locator('.vault-index a')).toHaveCount(4);
  await expect(page.locator('.feature-card').first()).toHaveAttribute('href',/\/Research-\/v3\/research\//);
  await context.close();
});

test('Sanctum uses one continuous glass narrative instead of boxed content panels', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto(PREVIEW);
  const narrative=page.locator('.narrative-glass');
  await expect(narrative.locator('.featured')).toHaveCount(1);
  await expect(narrative.locator('.at-glance')).toHaveCount(1);
  await expect(narrative.locator('.library-vault')).toHaveCount(1);
  const presentation=await page.evaluate(() => {
    const narrative=document.querySelector('.narrative-glass');
    const featured=getComputedStyle(document.querySelector('.featured'));
    const vault=getComputedStyle(document.querySelector('.library-vault'));
    const card=getComputedStyle(document.querySelector('.feature-card'));
    return {
      narrativeGradient:getComputedStyle(narrative).backgroundImage,
      featuredRadius:featured.borderTopLeftRadius,
      featuredBorder:featured.borderTopWidth,
      vaultRadius:vault.borderTopLeftRadius,
      vaultBorder:vault.borderTopWidth,
      articleBackground:card.backgroundColor,
    };
  });
  expect(presentation.narrativeGradient).toContain('linear-gradient');
  expect(presentation.featuredRadius).toBe('0px');
  expect(presentation.featuredBorder).toBe('0px');
  expect(presentation.vaultRadius).toBe('0px');
  expect(presentation.vaultBorder).toBe('0px');
  expect(presentation.articleBackground).toBe('rgba(0, 0, 0, 0)');
  await expect(page.locator('.feature-card')).toHaveCount(3);
  await expect(page.locator('.vault-index a')).toHaveCount(4);
});


test('Sanctum uses cached scene assets and meaningful internal navigation',async ({page})=>{
  await page.goto(PREVIEW);
  const result=await page.evaluate(()=>({
    inlineImages:document.documentElement.outerHTML.includes('data:image/webp;base64,'),
    resources:[...new Set([...document.images].map(img=>new URL(img.src).pathname))],
    preloads:[...document.querySelectorAll('link[rel="preload"][as="image"]')].map(x=>({href:x.getAttribute('href'),media:x.media})),
    researchLinks:[...document.querySelectorAll('.feature-card')].map(a=>({target:a.getAttribute('target'),href:a.getAttribute('href')})),
    primaryNav:[...document.querySelectorAll('.primary-nav a')].map(x=>x.textContent.trim())
  }));
  expect(result.inlineImages).toBe(false);
  expect(result.resources).toHaveLength(3);
  expect(result.resources.every(x=>x.startsWith('/Research-/v3/atlas/sanctum/assets/'))).toBe(true);
  expect(result.preloads).toHaveLength(2);
  expect(result.preloads.some(x=>x.media.includes('min-width'))).toBe(true);
  expect(result.preloads.some(x=>x.media.includes('max-width'))).toBe(true);
  expect(result.researchLinks).toHaveLength(3);
  for(const link of result.researchLinks){
    expect(link.target).toBeNull();
    expect(link.href).toMatch(/^\/Research-\/v3\/research\//);
  }
  expect(result.primaryNav).toContain('全文搜尋');
  expect(result.primaryNav).toContain('研究領域');
});

test('Sanctum has multiple scroll chapters, without hijacking the page', async ({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto(PREVIEW);
  const values=[];
  const max=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
  for(const distance of [0,Math.round(max*.22),Math.round(max*.52),max]){
    await page.evaluate(y=>scrollTo(0,y),distance);
    await expect.poll(async()=>page.evaluate(()=>Number(getComputedStyle(document.body).getPropertyValue('--veil-alpha')))).toBeGreaterThan(0);
    await page.waitForTimeout(80);
    values.push(await page.evaluate(()=>Number(getComputedStyle(document.body).getPropertyValue('--veil-alpha'))));
  }
  expect(values[0]).toBeCloseTo(.035,2);
  expect(values[3]).toBeGreaterThan(.30);
  for(let i=1;i<values.length;i++)expect(values[i]).toBeGreaterThan(values[i-1]);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).overflow)).not.toBe('hidden');
});

test('homepage search form navigates to an actual full-text query',async({page})=>{
  await page.setViewportSize({width:393,height:852});
  await page.goto('/Research-/');
  const form=page.locator('.hero-discovery');
  await expect(form.getByText('你想了解什麼？直接搜尋研究')).toBeVisible();
  await form.locator('input[name="q"]').fill('網站速度');
  await form.getByRole('button',{name:/搜尋研究/}).click();
  await expect(page).toHaveURL(/\/Research-\/v3\/search\/\?q=/);
  await expect(page.locator('#search-term')).toHaveValue('網站速度');
});
