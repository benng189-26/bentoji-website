/* ===================================================================
   Homepage hero: space scene (17 Oct 2026, v3)
   Photographs do the heavy lifting; code only places and moves them.
   - Star field: a Milky Way photo, full resolution.
   - Planet: a real photo of a dark planet's lit edge, clipped to a large
     disc lower right. Its glow is the same photo, blurred and screened
     outwards, so the light colour comes from the photograph.
   - Moon: a real moon photo, shaded on the side away from the light.
   - Code: drifting, blinking stars and one orbiting light on a curve.
   - Scroll: the hero is pinned while the view moves in towards the
     planet; the text lifts away, then the next section slides over it.
   With "reduce motion" on, nothing moves and the hero is not pinned.
   =================================================================== */
(function () {
  var hero = document.querySelector('.h-hero.has-space');
  if (!hero) return;
  var track = hero.parentElement && hero.parentElement.classList.contains('hero-track') ? hero.parentElement : null;
  var space = hero.querySelector('.h-space');
  var field = space.querySelector('.h-starfield');
  var starC = space.querySelector('.h-stars');
  var wrap = space.querySelector('.h-planet-wrap');
  var discs = wrap.querySelectorAll('.h-disc');
  var fxC = wrap.querySelector('.h-fx');
  var moonC = space.querySelector('.h-moon');
  var content = hero.querySelector('.container');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var SUN = norm(-0.58, -0.81);              /* light from the upper left, matching the photo */
  var IMG_FROM = -1.03, IMG_TO = 0.12;        /* planet-lit.webp covers this part of the disc, in radii */
  var W, H, G = {}, moon = {}, orbit = {}, stars = [];

  function norm(x, y) { var l = Math.sqrt(x * x + y * y); return { x: x / l, y: y / l }; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function geometry() {
    W = hero.offsetWidth; H = hero.offsetHeight;
    var narrow = W < 900;
    G.R = narrow ? 760 : 1320;
    G.cx = narrow ? W * 0.22 + G.R : Math.max(W * 0.30, W - 1100) + G.R;
    G.cy = narrow ? H * 0.64 + G.R : H * 0.50 + G.R;
    moon = narrow ? { x: W * 0.82, y: H * 0.16, r: 17 } : { x: Math.max(84, W * 0.08), y: H * 0.18, r: 30 };
    orbit = { rx: G.R * 1.085, ry: G.R * 1.03, rot: -0.12, range: null };
    /* the discs (planet and its two glows) share one box */
    /* the box is a little larger than the planet so the photo's soft edge is kept */
    var BR = G.R * 1.025, size = BR * 2;
    for (var i = 0; i < discs.length; i++) {
      var d = discs[i].style;
      d.width = d.height = size + 'px';
      d.left = (G.cx - BR) + 'px'; d.top = (G.cy - BR) + 'px';
      var im = discs[i].querySelector('img').style;
      im.left = (BR + IMG_FROM * G.R) + 'px'; im.top = (BR + IMG_FROM * G.R) + 'px';
      im.width = im.height = ((IMG_TO - IMG_FROM) * G.R) + 'px';
    }
    /* zoom towards the lit edge */
    wrap.style.transformOrigin = (G.cx + SUN.x * G.R) + 'px ' + (G.cy + SUN.y * G.R) + 'px';
    /* visible stretch of the orbit */
    var vis = [];
    for (var a = 0; a < 1440; a++) {
      var ang = a / 1440 * Math.PI * 2, p = orbitPoint(ang);
      if (p.x > -30 && p.x < W + 30 && p.y > -30 && p.y < H + 30) vis.push(ang);
    }
    orbit.range = null;
    if (vis.length) {
      var gap = 0, gi = 0;
      for (var j = 0; j < vis.length; j++) {
        var nx = j + 1 < vis.length ? vis[j + 1] : vis[0] + Math.PI * 2;
        if (nx - vis[j] > gap) { gap = nx - vis[j]; gi = j; }
      }
      var s = vis[(gi + 1) % vis.length], e = vis[gi];
      if (e < s) e += Math.PI * 2;
      orbit.range = [s, e];
    }
  }
  function orbitPoint(a) {
    var x = Math.cos(a) * orbit.rx, y = Math.sin(a) * orbit.ry, c = Math.cos(orbit.rot), s = Math.sin(orbit.rot);
    return { x: G.cx + x * c - y * s, y: G.cy + x * s + y * c };
  }

  function sizeCanvas(c) { c.width = W * DPR; c.height = H * DPR; c.style.width = W + 'px'; c.style.height = H + 'px'; }

  /* ---- stars that drift and blink, over the photo ---- */
  function buildStars() {
    sizeCanvas(starC);
    stars = [];
    var n = Math.round(W * H / 5200);
    for (var i = 0; i < n; i++) {
      var tint = Math.random();
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() < 0.06 ? rnd(0.9, 1.4) : rnd(0.3, 0.75),
        a: rnd(0.25, 0.85),
        vx: rnd(-2.2, -0.4), vy: rnd(-0.6, 0.6),         /* a slow drift, mostly to the left */
        tw: rnd(0.2, 0.7), p: rnd(0, 6.28),
        blink: Math.random() < 0.18 ? { every: rnd(5, 14), off: rnd(0, 14), len: rnd(0.8, 1.6) } : null,
        c: tint < 0.12 ? '255,220,200' : tint < 0.28 ? '205,215,255' : '240,242,250'
      });
    }
  }
  function drawStars(t, dt) {
    var ctx = starC.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (!reduce) {
        s.x += s.vx * dt; s.y += s.vy * dt;
        if (s.x < -4) s.x = W + 4;
        if (s.y < -4) s.y = H + 4; else if (s.y > H + 4) s.y = -4;
      }
      var a = reduce ? s.a : s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.p));
      if (s.blink && !reduce) {
        /* now and then a star fades out completely and comes back */
        var ph = ((t + s.blink.off) % s.blink.every) / s.blink.len;
        if (ph < 1) a *= Math.abs(1 - ph * 2);
      }
      if (a < 0.01) continue;
      ctx.fillStyle = 'rgba(' + s.c + ',' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
    }
  }

  /* ---- orbit and the light travelling along it ---- */
  function drawFx(t) {
    var ctx = fxC.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!orbit.range) return;
    var a0 = orbit.range[0], span = orbit.range[1] - a0;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(214,222,255,0.13)';
    ctx.beginPath();
    for (var i = 0; i <= 180; i++) { var p = orbitPoint(a0 + span * i / 180); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
    ctx.stroke();
    var f = reduce ? 0.42 : (t / 40) % 1;
    var a = a0 + span * f, fade = Math.min(1, f / 0.08, (1 - f) / 0.08);
    for (var k = 0; k < 26; k++) {
      var q1 = orbitPoint(a - span * 0.004 * k), q2 = orbitPoint(a - span * 0.004 * (k + 1));
      ctx.strokeStyle = 'rgba(235,240,255,' + (0.3 * (1 - k / 26) * fade).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.stroke();
    }
    var s = orbitPoint(a);
    ctx.fillStyle = 'rgba(255,255,255,' + (0.95 * fade).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(s.x, s.y, 1.8, 0, 6.2832); ctx.fill();
  }

  /* ---- the moon: real photo, shaded away from the light ---- */
  var moonImg = new Image();
  moonImg.decoding = 'async';
  moonImg.onload = function () { renderMoon(); };
  moonImg.src = '/assets/img/space/moon.webp';
  function renderMoon() {
    if (!moon.r) return;
    var r = moon.r, pad = r * 3.2, S = pad * 2;
    moonC.width = S * DPR; moonC.height = S * DPR;
    moonC.style.width = S + 'px'; moonC.style.height = S + 'px';
    moonC.style.left = (moon.x - pad) + 'px'; moonC.style.top = (moon.y - pad) + 'px';
    var ctx = moonC.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, S, S);
    var halo = ctx.createRadialGradient(pad, pad, r * 0.9, pad, pad, pad);
    halo.addColorStop(0, 'rgba(210,220,255,0.10)'); halo.addColorStop(1, 'rgba(210,220,255,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, S, S);
    if (!moonImg.naturalWidth) return;
    var mc = document.createElement('canvas'), M = Math.ceil(r * 2 * DPR);
    mc.width = mc.height = M;
    var x = mc.getContext('2d');
    x.drawImage(moonImg, 0, 0, M, M);
    x.globalCompositeOperation = 'source-atop';
    var c = M / 2, sx = c - SUN.x * c * 0.95, sy = c - SUN.y * c * 0.95;
    var g = x.createRadialGradient(sx, sy, c * 0.1, sx, sy, c * 1.6);
    g.addColorStop(0, 'rgba(4,5,9,0.85)'); g.addColorStop(0.55, 'rgba(4,5,9,0.4)'); g.addColorStop(1, 'rgba(4,5,9,0)');
    x.fillStyle = g; x.fillRect(0, 0, M, M);
    ctx.drawImage(mc, pad - r, pad - r, r * 2, r * 2);
  }

  /* ---- scroll: pinned hero, the view moves in towards the planet ---- */
  var lastP = -1;
  function onScroll() {
    if (reduce) return;
    var p;
    if (track) {
      var rect = track.getBoundingClientRect(), run = track.offsetHeight - H;
      p = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 0;
    } else {
      p = Math.min(1, Math.max(0, (window.scrollY || 0) / H));
    }
    if (Math.abs(p - lastP) < 0.0005) return;
    lastP = p;
    var e = p * p * (3 - 2 * p);               /* ease in and out */
    wrap.style.transform = 'translate3d(0,' + (-H * 0.16 * e).toFixed(1) + 'px,0) scale(' + (1 + 0.38 * e).toFixed(4) + ')';
    field.style.transform = 'scale(' + (1 + 0.10 * e).toFixed(4) + ')';
    starC.style.transform = 'scale(' + (1 + 0.22 * e).toFixed(4) + ')';
    moonC.style.transform = 'translate3d(' + (-W * 0.05 * e).toFixed(1) + 'px,' + (-H * 0.22 * e).toFixed(1) + 'px,0) scale(' + (1 + 0.5 * e).toFixed(3) + ')';
    moonC.style.opacity = (1 - e * 0.7).toFixed(3);
    if (content) {
      var tp = Math.min(1, p / 0.55);
      content.style.transform = 'translate3d(0,' + (-H * 0.10 * tp).toFixed(1) + 'px,0)';
      content.style.opacity = (1 - tp).toFixed(3);
      content.style.visibility = tp >= 1 ? 'hidden' : '';
    }
  }

  var running = false, raf = 0, visible = true, last = 0;
  function frame(now) {
    var t = now / 1000, dt = last ? Math.min(0.1, t - last) : 0; last = t;
    drawStars(t, dt); drawFx(t);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!running && visible && !document.hidden) { running = true; last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function all() {
    geometry(); buildStars(); sizeCanvas(fxC); renderMoon();
    var t = performance.now() / 1000; drawStars(t, 0); drawFx(t);
    lastP = -1; onScroll();
  }
  all();
  var ready = function () { space.classList.add('is-ready'); };
  var lit = wrap.querySelector('.h-planet img');
  if (lit.complete) ready(); else { lit.addEventListener('load', ready); setTimeout(ready, 3000); }

  var rt = 0, lastW = W, lastH = H;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (hero.offsetWidth !== lastW || Math.abs(hero.offsetHeight - lastH) > 120) { lastW = hero.offsetWidth; lastH = hero.offsetHeight; all(); }
    }, 180);
  }, { passive: true });
  window.addEventListener('scroll', function () { requestAnimationFrame(onScroll); }, { passive: true });
  if (reduce) return;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); else stop(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  start();
})();
