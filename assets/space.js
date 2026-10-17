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
  var W, H, G = {}, V = {}, moon = {}, orbit = {}, stars = [], scrollE = 0;

  function norm(x, y) { var l = Math.sqrt(x * x + y * y); return { x: x / l, y: y / l }; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function geometry() {
    W = hero.offsetWidth; H = hero.offsetHeight;
    var narrow = W < 900;
    G.R = narrow ? 1100 : Math.max(1900, W * 1.45);
    G.k = narrow ? 0.7 : Math.max(1, W / 1440); /* scale for light falloff distances */
    /* place the planet so its lit edge passes through this point (the band then
       sweeps from the bottom middle up to the top right, like the reference) */
    var px = narrow ? W * 0.94 : W * 0.84, py = narrow ? H * 0.84 : H * 0.40;
    G.cx = px - SUN.x * G.R; G.cy = py - SUN.y * G.R;
    moon = narrow ? { x: W * 0.82, y: H * 0.16, r: 17 } : { x: Math.max(84, W * 0.08), y: H * 0.18, r: 30 };
    orbit = { gap: narrow ? 46 : 70, range: null };   /* a circle around the planet, the same centre */
    view(0);
    var vis = [];
    for (var a = 0; a < 1440; a++) {
      var ang = a / 1440 * Math.PI * 2, p = orbitPoint(ang);
      if (p.x > -30 && p.x < W + 30 && p.y > -30 && p.y < H + 30) vis.push(ang);
    }
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
  /* the view moves in towards the lit edge as the page scrolls */
  function view(e) {
    var s = 1 + 0.32 * e, ox = G.cx + SUN.x * G.R, oy = G.cy + SUN.y * G.R;
    V.cx = ox + (G.cx - ox) * s;
    V.cy = oy + (G.cy - oy) * s - H * 0.14 * e;
    V.R = G.R * s; V.s = s;
  }
  function orbitR() { return V.R + orbit.gap * G.k * V.s; }
  function orbitPoint(a) { var r = orbitR(); return { x: V.cx + Math.cos(a) * r, y: V.cy + Math.sin(a) * r }; }
  function sizeCanvas(c, dpr) { dpr = dpr || DPR; c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); c.style.width = W + 'px'; c.style.height = H + 'px'; }

  /* ---------------- planet: WebGL ---------------- */
  var gl = null, prog, loc = {};
  var FRAG = [
    'precision highp float;',
    'uniform vec2 uRes; uniform vec2 uC; uniform float uR; uniform vec2 uSun; uniform float uK;',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }',
    /* light at one point: h = distance from the edge in design pixels (negative inside) */
    'vec3 shade(vec2 fc, out float inside){',
    '  vec2 p = fc - uC; float d = length(p);',
    '  float h = (d - uR) / uK;',
    '  float f = dot(p / d, uSun);',
    '  float lit = smoothstep(-0.30, 0.95, f); lit *= lit;',          /* broad, fades towards both ends */
    '  float wide = smoothstep(-0.55, 0.9, f);',
    '  inside = step(h, 0.0);',
    '  vec3 c;',
    '  if (h >= 0.0) {',
    '    c = lit * (exp(-h / 4.5) * vec3(1.00, 0.98, 1.00) * 1.6',     /* white-hot edge */
    '             + exp(-h / 26.0) * vec3(0.82, 0.76, 1.00) * 0.95',   /* lavender */
    '             + exp(-h / 62.0) * vec3(0.46, 0.32, 1.00) * 0.55',   /* violet */
    '             + exp(-h / 170.0) * vec3(0.20, 0.12, 0.70) * 0.10)', /* deep violet-blue */
    '      + wide * exp(-h / 480.0) * vec3(0.05, 0.035, 0.20) * 0.06;',
    '  } else {',
    '    float hi = -h;',
    '    c = vec3(0.0006, 0.0006, 0.0014)',
    '      + lit * (exp(-hi / 3.5) * vec3(1.00, 0.97, 0.96) * 1.2',      /* the same bright edge, seen from above */
    '             + exp(-hi / 34.0) * vec3(1.00, 0.64, 0.44) * 0.40',   /* warm peach haze over the surface */
    '             + exp(-hi / 95.0) * vec3(0.50, 0.36, 0.95) * 0.26',   /* violet scattering */
    '             + exp(-hi / 260.0) * vec3(0.08, 0.06, 0.24) * 0.12);',/* fading into the night side */
    '  }',
    '  return c;',
    '}',
    'void main(){',
    '  vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);',
    /* four samples per pixel: smooth edges, no stair steps */
    '  float i0, i1, i2, i3;',
    '  vec3 col = shade(fc + vec2(-0.125, -0.375), i0) + shade(fc + vec2(0.375, -0.125), i1)',
    '           + shade(fc + vec2(0.125, 0.375), i2) + shade(fc + vec2(-0.375, 0.125), i3);',
    '  col *= 0.25; float cov = (i0 + i1 + i2 + i3) * 0.25;',
    '  col = 1.0 - exp(-col * 1.2);',
    '  col = pow(col, vec3(1.0 / 2.2));',
    '  col += (hash(fc) - 0.5) * (1.5 / 255.0);',
    '  gl_FragColor = vec4(max(col, 0.0), cov);',
    '}'
  ].join('\n');
  var VERT = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }';

  function initGL() {
    try { gl = planetC.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false }) || planetC.getContext('experimental-webgl'); } catch (e) { gl = null; }
    if (!gl) return false;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { gl = null; return false; }
    prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl = null; return false; }
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var a = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    ['uRes', 'uC', 'uR', 'uSun', 'uK'].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
    return true;
  }
  function drawPlanet(t) {
    var dpr = planetC.width / W;
    if (gl) {
      gl.viewport(0, 0, planetC.width, planetC.height);
      /* the brightest part of the edge drifts slowly back and forth */
      var a = reduce ? 0 : Math.sin(t / 34 * Math.PI * 2) * 0.06, c = Math.cos(a), s = Math.sin(a);
      gl.uniform2f(loc.uRes, planetC.width, planetC.height);
      gl.uniform2f(loc.uC, V.cx * dpr, V.cy * dpr);
      gl.uniform1f(loc.uR, V.R * dpr);
      gl.uniform2f(loc.uSun, SUN.x * c - SUN.y * s, SUN.x * s + SUN.y * c);
      gl.uniform1f(loc.uK, G.k * V.s * dpr);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return;
    }
    /* no WebGL: a simple soft rim */
    var x = planetC.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
    x.fillStyle = '#05060a'; x.beginPath(); x.arc(V.cx, V.cy, V.R, 0, 6.2832); x.fill();
    x.shadowColor = 'rgba(120,170,255,0.8)'; x.shadowBlur = 40;
    x.strokeStyle = 'rgba(235,242,255,0.9)'; x.lineWidth = 1.5;
    x.beginPath(); x.arc(V.cx, V.cy, V.R, Math.PI * 0.9, Math.PI * 1.7); x.stroke();
  }

  /* ---------------- stars ---------------- */
  function buildStars() {
    sizeCanvas(starC);
    stars = [];
    var n = Math.round(W * H / 3600);
    for (var i = 0; i < n; i++) {
      var tint = Math.random();
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() < 0.06 ? rnd(0.9, 1.4) : rnd(0.3, 0.75),
        a: rnd(0.25, 0.85),
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
      ctx.fillStyle = 'rgba(' + s.c + ',' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
    }
  }

  /* ---------------- orbit ---------------- */
  function drawFx(t) {
    var ctx = fxC.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!orbit.range) return;
    var a0 = orbit.range[0], span = orbit.range[1] - a0;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(214,224,255,0.12)';
    ctx.beginPath(); ctx.arc(V.cx, V.cy, orbitR(), a0, a0 + span); ctx.stroke();
    var f = reduce ? 0.42 : (t / 40) % 1;
    var a = a0 + span * f, fade = Math.min(1, f / 0.08, (1 - f) / 0.08);
    /* trail: a short arc behind it, fading out */
    var trail = 90 / orbitR();
    for (var k = 0; k < 24; k++) {
      ctx.strokeStyle = 'rgba(235,240,255,' + (0.38 * (1 - k / 24) * fade).toFixed(3) + ')';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(V.cx, V.cy, orbitR(), a - trail * (k + 1) / 24, a - trail * k / 24); ctx.stroke();
    }
    var s = orbitPoint(a);
    ctx.fillStyle = 'rgba(255,255,255,' + (0.95 * fade).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(s.x, s.y, 3.2, 0, 6.2832); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,' + (0.18 * fade).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(s.x, s.y, 5.5, 0, 6.2832); ctx.fill();
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
    if (!running) { var t = performance.now() / 1000; drawPlanet(t); drawFx(t); }
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
    drawPlanet(t); drawStars(t, dt); drawFx(t);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!reduce && !running && visible && !document.hidden) { running = true; last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function all() {
    geometry(); buildStars();
    sizeCanvas(planetC); sizeCanvas(fxC); renderMoon();
    lastP = -1; onScroll(); view(scrollE);
    var t = performance.now() / 1000; drawPlanet(t); drawStars(t, 0); drawFx(t);
  }
  initGL();
  all();
  requestAnimationFrame(function () { space.classList.add('is-ready'); });

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
