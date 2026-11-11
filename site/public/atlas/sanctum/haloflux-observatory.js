/*
 * Adapted radial light-field drawing from HALOFLUX by Ryder191
 * (RYDER CODE / Ms MAIKEBAIs CAT), mobile.html, commit 02174503d0f391b1bb2537b8cad75e8e5f9997f2.
 * https://github.com/Ryder191/haloflux
 * Required Notice: Copyright (c) 2026 Ryder191 (RYDER CODE / Ms MAIKEBAIs CAT) - https://github.com/Ryder191/haloflux
 * Required Notice: Noncommercial use only. Any commercial use is strictly prohibited. No commercial licenses are offered.
 * See HALOFLUX-LICENSE.txt for full terms.
 */
(() => {
  const canvas = document.querySelector('.halo-stage');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, raf = 0, active = true, time = 0, previous = 0;
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  // HALOFLUX's deterministic radial-line variation, adapted for this scene.
  const hash = x => { const s = Math.sin(x * 12.9898) * 43758.5453; return s - Math.floor(s); };
  function radialLines(a0, a1, step, r0, length, seed, low, cx, cy) {
    ctx.beginPath();
    let k = 0;
    for (let a = a0; a < a1; a += step, k++) {
      const l = length * (low + (1 - low) * hash(k + seed));
      const ca = Math.cos(a), sa = Math.sin(a);
      ctx.moveTo(cx + ca * r0, cy + sa * r0);
      ctx.lineTo(cx + ca * (r0 + l), cy + sa * (r0 + l));
    }
    ctx.stroke();
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const mobile = width <= 800;
    const cx = width * (mobile ? .5 : .61) + pointerX, cy = height * (mobile ? .48 : .46) + pointerY;
    const r = Math.min(width * (mobile ? .22 : .14), height * .25, 175);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.4);
    glow.addColorStop(0, 'rgba(255,234,176,.58)');
    glow.addColorStop(.16, 'rgba(228,180,81,.22)');
    glow.addColorStop(.48, 'rgba(64,212,222,.075)');
    glow.addColorStop(1, 'rgba(6,12,24,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(time * .08); ctx.scale(1, .67);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(0, 0, r * (.65 + i * .14), 0, Math.PI * 2);
      ctx.lineWidth = i === 2 ? 1.5 : .65;
      ctx.strokeStyle = i % 2 ? 'rgba(64,212,222,.35)' : 'rgba(228,180,81,.58)';
      ctx.stroke();
    }
    for (let i = 0; i < 96; i++) {
      const a = i * Math.PI / 48, outer = r * (i % 8 === 0 ? 1.4 : 1.31);
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*r*1.24, Math.sin(a)*r*1.24);
      ctx.lineTo(Math.cos(a)*outer, Math.sin(a)*outer); ctx.strokeStyle='rgba(240,204,135,.52)'; ctx.stroke();
    }
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.lineWidth = .7;
    ctx.strokeStyle='rgba(228,180,81,.21)';
    radialLines(-Math.PI, Math.PI, .032, r * 1.1, r * 1.4, 18 + Math.floor(time / 4), .12, cx, cy);
    ctx.strokeStyle='rgba(64,212,222,.13)';
    radialLines(-Math.PI, Math.PI, .053, r * 1.16, r * 1.75, 73, .08, cx, cy);
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, Math.max(2, r * .025), 0, Math.PI * 2);
    ctx.fillStyle='#fff1c6'; ctx.fill();
  }
  function frame(now) {
    raf = 0;
    if (!active || document.hidden || motion.matches) return;
    if (previous) time += Math.min((now - previous) / 1000, .05);
    previous = now;
    pointerX += (targetX - pointerX) * .035; pointerY += (targetY - pointerY) * .035;
    draw(); raf = requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(raf); raf = 0; previous = 0;
    draw();
    if (active && !document.hidden && !motion.matches) raf = requestAnimationFrame(frame);
  }
  function resize() {
    const box = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.5);
    width = box.width; height = box.height;
    canvas.width = Math.max(1, Math.round(width * dpr)); canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); sync();
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { active = entries[0].isIntersecting; sync(); }).observe(canvas);
  addEventListener('resize', resize, { passive: true });
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    addEventListener('pointermove', event => {
      if (motion.matches) return;
      targetX = (event.clientX / innerWidth - .5) * 20;
      targetY = (event.clientY / innerHeight - .5) * 14;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
  }
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  resize();
})();
