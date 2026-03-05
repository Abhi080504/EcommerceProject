// public/libs/webgl-fluid.js
(function () {
  // Minimal fluid-like canvas with splat support.
  function createFluidSim({ canvas, config } = {}) {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // resize helper
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // subtle animated base (keeps background lively)
    let t = 0;
    let rafId = null;
    function baseDraw() {
      t += 0.012;
      const r = Math.floor(30 + 40 * Math.sin(t * 0.9));
      const g = Math.floor(40 + 40 * Math.cos(t * 0.7));
      const b = Math.floor(80 + 60 * Math.sin(t * 0.5));
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.06)`);
      grad.addColorStop(1, `rgba(${b}, ${r}, ${g}, 0.06)`);
      // fade previous slightly to create motion trail
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      rafId = requestAnimationFrame(baseDraw);
    }
    rafId = requestAnimationFrame(baseDraw);

    // keep a simple splat queue so splats fade naturally
    const splats = [];

    function addSplat(normX, normY, radiusPx, color) {
      // normX/normY = 0..1 relative to canvas
      const cx = normX * canvas.width;
      const cy = normY * canvas.height;
      const radius = radiusPx || Math.min(canvas.width, canvas.height) * 0.02;
      const now = performance.now();
      splats.push({ cx, cy, radius, color, created: now });
      drawSplatsOnce(); // immediate draw (splats will also persist visually)
    }

    // draw splats (one-shot additive radial gradients)
    function drawSplatsOnce() {
      // draw all current splats with small fade based on age
      const now = performance.now();
      for (let i = 0; i < splats.length; i++) {
        const s = splats[i];
        const age = (now - s.created) / 90; // seconds
        const life = 1.4; // seconds until remove
        if (age > life) continue;
        const alpha = Math.max(0, 0.5 * (1 - age / life));
        const grd = ctx.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, s.radius);
        const col = s.color || { r: 90, g: 160, b: 255 };
        grd.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`);
        grd.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = grd;
        ctx.fillRect(s.cx - s.radius, s.cy - s.radius, s.radius * 2, s.radius * 2);
        ctx.globalCompositeOperation = 'source-over';
      }
      // cleanup old splats
      for (let i = splats.length - 1; i >= 0; i--) {
        if ((now - splats[i].created) / 1000 > 1.4) splats.splice(i, 1);
      }
    }

    // Periodically redraw splats so they fade smoothly (keeps CPU low).
    let splatInterval = setInterval(drawSplatsOnce, 60);

    return {
      // public splat API: normalized coords (0..1), radius in px optional, color optional {r,g,b}
      splat(normX, normY, radiusPx, color) {
        try { addSplat(normX, normY, radiusPx, color); }
        catch (e) { console.warn('splat error', e); }
      },
      destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        clearInterval(splatInterval);
        window.removeEventListener('resize', resize);
      }
    };
  }

  // expose globally
  window.createFluidSim = createFluidSim;
})();
