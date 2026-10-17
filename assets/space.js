/* ===================================================================
   Homepage hero: space scene (17 Oct 2026, v4)
   - Star field: a Milky Way photo (in the HTML), plus code stars that
     drift slowly and now and then blink out and back.
   - Planet and atmosphere: rendered on the GPU (WebGL) at full screen
     resolution, every pixel worked out from the distance to the planet's
     edge. Light is calculated in linear space, tone-mapped and dithered,
     so the falloff is smooth with no banding. Colours follow real limb
     light: a white-hot thin edge, blue scattering, deep blue haze, and a
     faint warm tint near the ends where the light passes at a low angle.
   - One orbit and a small light travelling along it.
   - A real moon photo on the left, shaded away from the light.
   - Scroll: the hero is pinned while the view moves in towards the lit
     edge (re-rendered, so it stays sharp), the text lifts away and the
     next section slides over.
   With "reduce motion" on, nothing moves and the hero is not pinned.
   =================================================================== */
(function () {
  var hero = document.querySelector('.h-hero.has-space');
  if (!hero) return;
  var track = hero.parentElement && hero.parentElement.classList.contains('hero-track') ? hero.parentElement : null;
  var space = hero.querySelector('.h-space');
  var field = space.querySelector('.h-starfield');
  var starC = space.querySelector('.h-stars');
  var planetC = space.querySelector('.h-planet');
  var fxC = space.querySelector('.h-fx');
  var moonC = space.querySelector('.h-moon');
  var content = hero.querySelector('.container');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var SUN = norm(-0.58, -0.81);              /* light from the upper left */
  var W, H, G = {}, V = {}, moon = {}, orbits = [], stars = [], scrollE = 0;

  function norm(x, y) { var l = Math.sqrt(x * x + y * y); return { x: x / l, y: y / l }; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function geometry() {
    W = hero.offsetWidth; H = hero.offsetHeight;
    var narrow = W < 900;
    /* the whole planet, lower right, lit from the upper left */
    G.R = narrow ? W * 0.62 : Math.min(W * 0.30, H * 0.50);
    G.k = 1;
    G.cx = narrow ? W * 0.96 : W * 0.87;
    G.cy = narrow ? H * 1.02 : H * 0.82;
    moon = narrow ? { x: W * 0.82, y: H * 0.16, r: 17 } : { x: Math.max(84, W * 0.08), y: H * 0.18, r: 30 };
    view(0);
    /* three orbits around the same centre, each with a satellite at its own pace */
    var defs = narrow
      ? [{ f: 1.20, period: 34, dir: 1, off: 0.10 }, { f: 1.42, period: 52, dir: -1, off: 0.55 }, { f: 1.70, period: 80, dir: 1, off: 0.80 }]
      : [{ f: 1.16, period: 40, dir: 1, off: 0.05 }, { f: 1.34, period: 64, dir: -1, off: 0.45 }, { f: 1.58, period: 95, dir: 1, off: 0.75 }];
    orbits = defs.map(function (o) {
      o.range = null;
      var vis = [];
      for (var a = 0; a < 1440; a++) {
        var ang = a / 1440 * Math.PI * 2, rr = G.R * o.f;
        var x = G.cx + Math.cos(ang) * rr, y = G.cy + Math.sin(ang) * rr;
        if (x > -30 && x < W + 30 && y > -30 && y < H + 30) vis.push(ang);
      }
      if (vis.length) {
        var gap = 0, gi = 0;
        for (var j = 0; j < vis.length; j++) {
          var nx = j + 1 < vis.length ? vis[j + 1] : vis[0] + Math.PI * 2;
          if (nx - vis[j] > gap) { gap = nx - vis[j]; gi = j; }
        }
        var s = vis[(gi + 1) % vis.length], e = vis[gi];
        if (e < s) e += Math.PI * 2;
        o.range = [s, e];
      }
      return o;
    });
  }
  /* the view moves in towards the lit edge as the page scrolls */
  function view(e) {
    var s = 1 + 0.22 * e, ox = G.cx + SUN.x * G.R, oy = G.cy + SUN.y * G.R;
    V.cx = ox + (G.cx - ox) * s;
    V.cy = oy + (G.cy - oy) * s - H * 0.14 * e;
    V.R = G.R * s; V.s = s;
  }
  function sizeCanvas(c, dpr) { dpr = dpr || DPR; c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); c.style.width = W + 'px'; c.style.height = H + 'px'; }

  /* ---------------- planet: photo, drawn to scale each frame ---------------- */
  var planetImg = new Image(), PLANET_R = 1071.4;   /* disc radius inside planet.webp (2400 px) */
  planetImg.decoding = 'async';
  planetImg.onload = function () { drawPlanet(); space.classList.add('is-ready'); };
  planetImg.src = '/assets/img/space/planet.webp';
  function drawPlanet() {
    var ctx = planetC.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!planetImg.naturalWidth) return;
    var size = 2400 * V.R / PLANET_R;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(planetImg, V.cx - size / 2, V.cy - size / 2, size, size);
  }

  /* ---------------- stars ---------------- */
  function buildStars() {
    sizeCanvas(starC);
    stars = [];
    var n = Math.round(W * H / 4200);
    for (var i = 0; i < n; i++) {
      var tint = Math.random();
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() < 0.09 ? rnd(1.3, 2.0) : rnd(0.55, 1.1),
        a: rnd(0.5, 1),
        vx: rnd(-2.2, -0.4), vy: rnd(-0.6, 0.6),
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
      /* hidden behind the planet */
      var dx = s.x - V.cx, dy = s.y - V.cy;
      if (dx * dx + dy * dy < V.R * V.R) continue;
      var a = reduce ? s.a : s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.p));
      if (s.blink && !reduce) {
        var ph = ((t + s.blink.off) % s.blink.every) / s.blink.len;
        if (ph < 1) a *= Math.abs(1 - ph * 2);
      }
      if (a < 0.01) continue;
      if (s.r > 1.25) {                        /* the bigger ones get a soft glow */
        ctx.fillStyle = 'rgba(' + s.c + ',' + (a * 0.16).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.2, 0, 6.2832); ctx.fill();
      }
      ctx.fillStyle = 'rgba(' + s.c + ',' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
    }
  }

  /* ---------------- orbits ---------------- */
  function drawFx(t) {
    var ctx = fxC.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (var n = 0; n < orbits.length; n++) {
      var o = orbits[n];
      if (!o.range) continue;
      var rr = V.R * o.f, a0 = o.range[0], span = o.range[1] - a0;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(214,224,255,' + (0.11 - n * 0.025).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(V.cx, V.cy, rr, a0, a0 + span); ctx.stroke();
      var f = reduce ? o.off : ((t / o.period + o.off) % 1);
      if (o.dir < 0) f = 1 - f;
      var a = a0 + span * f, fade = Math.min(1, f / 0.08, (1 - f) / 0.08);
      /* trail: a short arc behind it, fading out */
      var trail = 90 / rr * o.dir;
      for (var k = 0; k < 24; k++) {
        var b0 = a - trail * k / 24, b1 = a - trail * (k + 1) / 24;
        ctx.strokeStyle = 'rgba(235,240,255,' + (0.38 * (1 - k / 24) * fade).toFixed(3) + ')';
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(V.cx, V.cy, rr, Math.min(b0, b1), Math.max(b0, b1)); ctx.stroke();
      }
      var x = V.cx + Math.cos(a) * rr, y = V.cy + Math.sin(a) * rr, size = n === 0 ? 3.2 : n === 1 ? 2.6 : 2.2;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.95 * fade).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(x, y, size, 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,' + (0.18 * fade).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(x, y, size * 1.8, 0, 6.2832); ctx.fill();
    }
  }

  /* ---------------- moon ---------------- */
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

  /* ---------------- scroll ---------------- */
  var lastP = -1;
  function onScroll() {
    if (reduce) return;
    var p;
    if (track) {
      var rect = track.getBoundingClientRect(), run = track.offsetHeight - H;
      p = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 0;
    } else p = Math.min(1, Math.max(0, (window.scrollY || 0) / H));
    if (Math.abs(p - lastP) < 0.0005) return;
    lastP = p;
    var e = p * p * (3 - 2 * p);
    scrollE = e;
    view(e);
    drawPlanet();
    if (!running) drawFx(performance.now() / 1000);
    field.style.transform = 'scale(' + (1 + 0.10 * e).toFixed(4) + ')';
    starC.style.transform = 'scale(' + (1 + 0.18 * e).toFixed(4) + ')';
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
  function start() { if (!reduce && !running && visible && !document.hidden) { running = true; last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function all() {
    geometry(); buildStars();
    sizeCanvas(planetC); sizeCanvas(fxC); renderMoon();
    lastP = -1; onScroll(); view(scrollE);
    var t = performance.now() / 1000; drawPlanet(); drawStars(t, 0); drawFx(t);
  }
  all();
  setTimeout(function () { space.classList.add('is-ready'); }, 2500);

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
