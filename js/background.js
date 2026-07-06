(() => {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d', { alpha: true });

  let w = 0;
  let h = 0;
  let dpr = 1;
  let t = 0;
  let particles = [];
  let wisps = [];

  const mouse = {
    x: 0,
    y: 0,
    active: false
  };

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createScene();
  }

  function createScene() {
    const count = Math.round(Math.min(180, Math.max(80, w * h / 13500)));

    particles = Array.from({ length: count }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(.45, 2.6),
      vx: rand(-.10, .12),
      vy: rand(-.15, -.035),
      a: rand(.09, .52),
      tw: rand(0, Math.PI * 2),
      speed: rand(.008, .022),
      depth: rand(.25, 1)
    }));

    wisps = Array.from({ length: 12 }, (_, i) => ({
      x: rand(-w * .15, w * 1.05),
      y: rand(h * .22, h * .78),
      rx: rand(w * .18, w * .46),
      ry: rand(42, 130),
      vx: rand(.08, .32) * (i % 2 ? 1 : -1),
      a: rand(.035, .11),
      phase: rand(0, Math.PI * 2),
      hue: rand(34, 48)
    }));
  }

  function drawLightBeam(cx, cy, angle, len, width, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const g = ctx.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, `rgba(255, 225, 160, ${alpha})`);
    g.addColorStop(.35, `rgba(219, 145, 56, ${alpha * .26})`);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -width * .20);
    ctx.lineTo(len, -width);
    ctx.lineTo(len, width);
    ctx.lineTo(0, width * .20);
    ctx.closePath();

    ctx.filter = 'blur(12px)';
    ctx.fill();
    ctx.restore();
    ctx.filter = 'none';
  }

  function draw() {
    t += 0.016;
    ctx.clearRect(0, 0, w, h);

    const px = mouse.active ? (mouse.x - w / 2) * 0.010 : Math.sin(t * .18) * 4;
    const py = mouse.active ? (mouse.y - h / 2) * 0.010 : Math.cos(t * .15) * 3;

    // Fasci di luce visibili ma morbidi.
    const cx = w * .50 + px * .25;
    const cy = h * .54 + py * .25;

    drawLightBeam(cx, cy, -Math.PI * .78 + Math.sin(t * .22) * .08, w * .95, 80, 0.075);
    drawLightBeam(cx, cy, -Math.PI * .28 + Math.cos(t * .18) * .08, w * .92, 72, 0.060);
    drawLightBeam(cx, cy, -Math.PI * .50 + Math.sin(t * .15) * .06, w * .75, 55, 0.045);

    // Nebbia viva in canvas.
    ctx.globalCompositeOperation = 'screen';

    for (const f of wisps) {
      f.x += f.vx;

      if (f.vx > 0 && f.x - f.rx > w * 1.18) f.x = -f.rx;
      if (f.vx < 0 && f.x + f.rx < -w * .18) f.x = w + f.rx;

      const y = f.y + Math.sin(t * .55 + f.phase) * 18;
      const g = ctx.createRadialGradient(f.x + px * .5, y + py * .5, 0, f.x + px * .5, y + py * .5, f.rx);

      g.addColorStop(0, `hsla(${f.hue}, 80%, 72%, ${f.a})`);
      g.addColorStop(.45, `hsla(${f.hue}, 80%, 54%, ${f.a * .36})`);
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(f.x + px * .5, y + py * .5, f.rx, f.ry, Math.sin(t * .08 + f.phase) * .18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pulviscolo luminoso.
    for (const p of particles) {
      p.x += p.vx * p.depth;
      p.y += p.vy * p.depth;
      p.tw += p.speed;

      if (p.y < -25) {
        p.y = h + 25;
        p.x = rand(0, w);
      }

      if (p.x < -40) p.x = w + 40;
      if (p.x > w + 40) p.x = -40;

      const alpha = p.a * (.45 + Math.sin(p.tw + t * .6) * .55);
      const rr = p.r * (7 + 10 * p.depth);
      const gx = p.x + px * p.depth;
      const gy = p.y + py * p.depth;
      const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, rr);

      grd.addColorStop(0, `rgba(255, 234, 185, ${alpha})`);
      grd.addColorStop(.26, `rgba(221, 151, 61, ${alpha * .46})`);
      grd.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(gx, gy, rr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  }, { passive: true });
  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  resize();
  draw();
})();
