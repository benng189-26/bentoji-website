/* ===================================================================
   Homepage hero: space scene (17 Oct 2026)
   - A large dark planet, lower right. Its atmosphere is rendered pixel
     by pixel with real light falloff (a thin hot rim, warm scattering,
     violet haze further out), brightest where it faces the sun and fading
     towards both ends, with fine grain so there is no gradient banding.
   - A crisp rim line on top, whose bright patch drifts slowly.
   - One orbit (a tilted ellipse around the planet) with a small moon-like
     satellite travelling along it, leaving a short fading trail.
   - A small crescent moon on the left, lit from the same sun.
   - Slowly twinkling stars.
   - On scroll: layers move at different speeds (parallax) and the scene
     fades into the next section, so the page changes smoothly.
   The scene pauses when off screen. With "reduce motion" on it is still.
   =================================================================== */
(function () {
  var hero = document.querySelector('.h-hero.has-space');
  if (!hero) return;
  var space = hero.querySelector('.h-space');
  var glowC = space.querySelector('.h-glow');
  var fxC = space.querySelector('.h-fx');
  var starC = space.querySelector('.h-stars');
  var content = hero.querySelector('.container');
  if (!glowC || !glowC.getContext) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  var SUN = norm(-0.58, -0.81);          /* light comes from the upper left */
  var W, H, HS, G = {}, stars = [], moon = {}, orbit = {};

  function norm(x, y) { var l = Math.sqrt(x * x + y * y); return { x: x / l, y: y / l }; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function geometry() {
    W = hero.offsetWidth; H = hero.offsetHeight; HS = space.offsetHeight;
    var narrow = W < 900;
    G.R = narrow ? 720 : 1320;
    G.cx = narrow ? W * 0.34 + G.R : Math.max(W * 0.30, W - 1100) + G.R;
    G.cy = narrow ? H * 0.70 + G.R : H * 0.47 + G.R;
    G.k = G.R / 1320;                       /* scale for falloff distances */
    moon = narrow ? { x: W * 0.83, y: H * 0.17, r: 16 } : { x: Math.max(80, W * 0.08), y: H * 0.17, r: 28 };
    /* orbit: tilted ellipse just outside the rim */
    orbit = { rx: G.R * 1.085, ry: G.R * 1.03, rot: -0.12, range: null };
    var vis = [];
    for (var i = 0; i < 1440; i++) {
      var a = i / 1440 * Math.PI * 2, p = orbitPoint(a);
      if (p.x > -40 && p.x < W + 40 && p.y > -40 && p.y < HS * 0.86) vis.push(a);
    }
    if (vis.length) {
      /* the visible stretch can wrap past 2π; find the largest gap and start after it */
      var gaps = 0, gi = 0;
      for (var j = 0; j < vis.length; j++) {
        var nxt = j + 1 < vis.length ? vis[j + 1] : vis[0] + Math.PI * 2;
        if (nxt - vis[j] > gaps) { gaps = nxt - vis[j]; gi = j; }
      }
      var start = vis[(gi + 1) % vis.length], end = vis[gi];
      if (end < start) end += Math.PI * 2;
      orbit.range = [start, end];
    }
  }
  function orbitPoint(a) {
    var x = Math.cos(a) * orbit.rx, y = Math.sin(a) * orbit.ry;
    var c = Math.cos(orbit.rot), s = Math.sin(orbit.rot);
    return { x: G.cx + x * c - y * s, y: G.cy + x * s + y * c };
  }

  /* ---- the planet and its atmosphere, rendered once per size ---- */
  /* real photographs underneath the rendered light:
     a Milky Way star field, and a dark planet's surface mapped onto the disc */
  var PHOTO = { stars: '/assets/img/space/stars.webp', surface: '/assets/img/space/planet-surface.webp', moon: '/assets/img/space/moon.webp' };
  var SURFACE_R = 1165;                     /* radius of the disc inside planet-surface.webp (2400 px) */
  var pics = {};
  function loadPics(done) {
    var keys = Object.keys(PHOTO), left = keys.length;
    keys.forEach(function (k) {
      var im = new Image(); im.decoding = 'async';
      im.onload = im.onerror = function () { if (im.naturalWidth) pics[k] = im; if (--left === 0) done(); };
      im.src = PHOTO[k];
    });
  }
  function baseLayer(w, h, scale) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
    if (pics.stars) {
      var iw = pics.stars.naturalWidth, ih = pics.stars.naturalHeight, f = Math.max(w / iw, h / ih);
      x.globalAlpha = 0.5;
      x.drawImage(pics.stars, (w - iw * f) / 2, (h - ih * f) / 2, iw * f, ih * f);
      x.globalAlpha = 1;
      /* keep it quieter behind the headline */
      var v = x.createLinearGradient(0, 0, w * 0.7, 0);
      v.addColorStop(0, 'rgba(0,0,0,0.55)'); v.addColorStop(0.75, 'rgba(0,0,0,0.25)'); v.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = v; x.fillRect(0, 0, w, h);
    }
    var R = G.R * scale, cx = G.cx * scale, cy = G.cy * scale;
    x.save(); x.beginPath(); x.arc(cx, cy, R, 0, 6.2832); x.clip();
    x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
    if (pics.surface) {
      var s = R / SURFACE_R, sz = 2400 * s;
      x.drawImage(pics.surface, cx - sz / 2, cy - sz / 2, sz, sz);
    }
    x.restore();
    return x.getImageData(0, 0, w, h).data;
  }

  function renderGlow() {
    var scale = W > 1600 ? 0.75 : 1;        /* soft light: a little lower resolution is fine on big screens */
    var w = Math.round(W * scale), h = Math.round(HS * scale);
    glowC.width = w; glowC.height = h;
    glowC.style.width = W + 'px'; glowC.style.height = HS + 'px';
    var ctx = glowC.getContext('2d');
    var img = ctx.createImageData(w, h), d = img.data;
    var base = baseLayer(w, h, scale);
    var R = G.R * scale, cx = G.cx * scale, cy = G.cy * scale, k = G.k * scale;
    var exp = Math.exp, sqrt = Math.sqrt, max = Math.max, pow = Math.pow;
    for (var y = 0; y < h; y++) {
      var fy = y / h;
      /* deep space: almost black at the top, a touch of navy lower down */
      var br = 2 + fy * 4, bg = 3 + fy * 6, bb = 6 + fy * 9;
      var dy = y - cy;
      for (var x = 0; x < w; x++) {
        var dx = x - cx;
        var dist = sqrt(dx * dx + dy * dy);
        var t = dist - R;                   /* <0 inside the planet */
        var nx = dx / dist, ny = dy / dist;
        var facing = nx * SUN.x + ny * SUN.y;
        var lit = facing > 0 ? 0.06 + 0.94 * pow(facing, 4) : 0.06 * max(0, 1 + facing);
        var r, g, b;
        if (t >= 0) {
          var tt = t / k;
          var core = exp(-tt / 1.4), inner = exp(-tt / 8), mid = exp(-tt / 38), outer = exp(-tt / 150), far = exp(-tt / 440);
          /* warm close to the rim (brand orange), cooling to violet further out */
          r = br + lit * (core * 255 + inner * 240 + mid * 150 + outer * 52 + far * 14);
          g = bg + lit * (core * 240 + inner * 120 + mid * 52 + outer * 26 + far * 8);
          b = bb + lit * (core * 228 + inner * 70 + mid * 46 + outer * 96 + far * 30);
        } else {
          var ti = -t / k;
          var rim = exp(-ti / 1.6), glow = exp(-ti / 22), deep = exp(-ti / 140);
          /* night side: dark, with the atmosphere showing just inside the edge */
          r = lit * (rim * 255 + glow * 130 + deep * 22);
          g = lit * (rim * 226 + glow * 50 + deep * 10);
          b = 2 + lit * (rim * 210 + glow * 40 + deep * 28);
        }
        var n = (Math.random() - 0.5) * 3;  /* grain: hides banding */
        var o = (y * w + x) * 4;
        /* add the light on top of the photo (stars outside, planet surface inside) */
        var pr = base[o], pg = base[o + 1], pb = base[o + 2];
        if (t < 0) { var keep = 0.42; pr *= keep; pg *= keep; pb *= keep; }
        d[o] = pr + r + n; d[o + 1] = pg + g + n; d[o + 2] = pb + b + n; d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  /* ---- stars ---- */
  function buildStars() {
    starC.width = W * DPR; starC.height = HS * DPR;
    starC.style.width = W + 'px'; starC.style.height = HS + 'px';
    stars = [];
    var n = Math.round(W * HS / 26000);
    for (var i = 0; i < n; i++) {
      var x = Math.random() * W, y = Math.random() * HS;
      var dist = Math.sqrt((x - G.cx) * (x - G.cx) + (y - G.cy) * (y - G.cy));
      if (dist < G.R + 30) continue;        /* no stars in front of the planet */
      var warm = Math.random();
      stars.push({ x: x, y: y,
        r: Math.random() < 0.07 ? rnd(1, 1.5) : rnd(0.35, 0.85),
        a: rnd(0.15, 0.7), s: rnd(0.12, 0.5), p: rnd(0, 6.28),
        c: warm < 0.12 ? '255,214,190' : warm < 0.24 ? '200,205,255' : '236,238,246' });
    }
  }
  function drawStars(t) {
    var ctx = starC.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, HS);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = reduce ? s.a : s.a * (0.5 + 0.5 * Math.sin(t * s.s + s.p));
      ctx.fillStyle = 'rgba(' + s.c + ',' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
    }
  }

  /* ---- crisp rim, orbit, satellite, moon ---- */
  function sizeFx() {
    fxC.width = W * DPR; fxC.height = HS * DPR;
    fxC.style.width = W + 'px'; fxC.style.height = HS + 'px';
  }
  function drawMoon(ctx) {
    var m = moon, r = m.r;
    var halo = ctx.createRadialGradient(m.x, m.y, r * 0.9, m.x, m.y, r * 3.2);
    halo.addColorStop(0, 'rgba(220,226,255,0.10)'); halo.addColorStop(1, 'rgba(220,226,255,0)');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(m.x, m.y, r * 3.2, 0, 6.2832); ctx.fill();
    if (!pics.moon) return;
    var mc = document.createElement('canvas'), S = Math.ceil(r * 2 * DPR);
    mc.width = mc.height = S;
    var x = mc.getContext('2d');
    x.drawImage(pics.moon, 0, 0, S, S);
    /* shade the side facing away from the light, so it sits in the same scene */
    x.globalCompositeOperation = 'source-atop';
    var c = S / 2, sx = c - SUN.x * c * 0.95, sy = c - SUN.y * c * 0.95;
    var g = x.createRadialGradient(sx, sy, c * 0.1, sx, sy, c * 1.6);
    g.addColorStop(0, 'rgba(4,5,9,0.85)'); g.addColorStop(0.55, 'rgba(4,5,9,0.4)'); g.addColorStop(1, 'rgba(4,5,9,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    ctx.globalAlpha = 1;
    ctx.drawImage(mc, m.x - r, m.y - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  }
  function drawFx(t) {
    var ctx = fxC.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, HS);
    /* crisp rim line, brightest where it faces the sun; the bright patch drifts */
    var drift = reduce ? 0 : Math.sin(t / 30 * Math.PI * 2) * 0.07;
    var sunA = Math.atan2(SUN.y, SUN.x) + drift;
    if (ctx.createConicGradient) {
      var cg = ctx.createConicGradient(sunA - Math.PI * 0.42, G.cx, G.cy);
      cg.addColorStop(0, 'rgba(255,236,220,0)');
      cg.addColorStop(0.42 * 0.5, 'rgba(255,236,220,0.55)');
      cg.addColorStop(0.42, 'rgba(255,248,240,1)');
      cg.addColorStop(0.42 * 1.5, 'rgba(255,236,220,0.55)');
      cg.addColorStop(0.84, 'rgba(255,236,220,0)');
      cg.addColorStop(1, 'rgba(255,236,220,0)');
      ctx.strokeStyle = cg;
    } else ctx.strokeStyle = 'rgba(255,236,220,0.75)';
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.arc(G.cx, G.cy, G.R + 0.5, 0, 6.2832); ctx.stroke();

    /* orbit and satellite */
    if (orbit.range) {
      var a0 = orbit.range[0], a1 = orbit.range[1], span = a1 - a0;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(230,222,255,0.16)';
      ctx.beginPath();
      for (var i = 0; i <= 160; i++) { var p = orbitPoint(a0 + span * i / 160); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }
      ctx.stroke();
      var period = 40;                         /* seconds to cross the screen */
      var f = reduce ? 0.42 : (t / period) % 1;
      var a = a0 + span * f;
      var fade = Math.min(1, f / 0.08, (1 - f) / 0.08);
      /* trail */
      for (var k = 0; k < 28; k++) {
        var q1 = orbitPoint(a - span * 0.004 * k), q2 = orbitPoint(a - span * 0.004 * (k + 1));
        ctx.strokeStyle = 'rgba(255,214,190,' + (0.32 * (1 - k / 28) * fade).toFixed(3) + ')';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.stroke();
      }
      var s = orbitPoint(a);
      var gl = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
      gl.addColorStop(0, 'rgba(255,226,206,' + (0.35 * fade).toFixed(3) + ')');
      gl.addColorStop(1, 'rgba(255,170,130,0)');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(255,250,245,' + fade.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, 6.2832); ctx.fill();
    }
  }
  /* the moon sits on its own layer so it can move at its own speed on scroll */
  var moonC = document.createElement('canvas');
  moonC.className = 'h-moon';
  space.appendChild(moonC);
  function renderMoon() {
    var pad = moon.r * 4;
    moonC.width = pad * 2 * DPR; moonC.height = pad * 2 * DPR;
    moonC.style.width = pad * 2 + 'px'; moonC.style.height = pad * 2 + 'px';
    moonC.style.left = (moon.x - pad) + 'px'; moonC.style.top = (moon.y - pad) + 'px';
    var ctx = moonC.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var real = moon; moon = { x: pad, y: pad, r: real.r };
    drawMoon(ctx);
    moon = real;
  }

  /* ---- scroll: parallax and a soft hand-over to the next section ---- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (y > H * 1.6) return;
    var p = Math.min(1, y / H);
    glowC.style.transform = fxC.style.transform = 'translate3d(0,' + (y * 0.38).toFixed(1) + 'px,0) scale(' + (1 + p * 0.05).toFixed(4) + ')';
    starC.style.transform = 'translate3d(0,' + (y * 0.62).toFixed(1) + 'px,0)';
    moonC.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
    if (content) {
      content.style.transform = 'translate3d(0,' + (y * 0.16).toFixed(1) + 'px,0)';
      content.style.opacity = Math.max(0, 1 - p * 1.25).toFixed(3);
    }
  }

  var running = false, raf = 0, visible = true;
  function frame(now) { var t = now / 1000; drawStars(t); drawFx(t); raf = requestAnimationFrame(frame); }
  function start() { if (!reduce && !running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function all() {
    geometry(); renderGlow(); buildStars(); sizeFx(); renderMoon();
    var t = performance.now() / 1000; drawStars(t); drawFx(t); onScroll();
  }
  all();
  loadPics(function () { renderGlow(); renderMoon(); space.classList.add('is-ready'); });
  setTimeout(function () { space.classList.add('is-ready'); }, 2500);
  var rt = 0, lastW = W;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (hero.offsetWidth !== lastW || Math.abs(hero.offsetHeight - H) > 80) { lastW = hero.offsetWidth; all(); } }, 200);
  }, { passive: true });
  if (!reduce) window.addEventListener('scroll', onScroll, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); else stop(); }).observe(space);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  start();
})();
