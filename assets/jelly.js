/* ===================================================================
   Moon jellyfish in the homepage hero (16 Oct 2026)
   A few jellyfish drift slowly upwards. Each one plays a real swim
   stroke (32 frames cut from a video of a moon jellyfish, keyed out of
   the water) and gets a small push each time its bell contracts.
   Size, position, depth and speed are random. The layer fades out as
   the page scrolls and stops once the hero is off screen. With
   "reduce motion" on, they stay still on a single frame.
   =================================================================== */
(function () {
  var hero = document.querySelector('.h-hero');
  if (!hero) return;
  var STILL = '/assets/img/jellyfish.webp';          /* shown until the stroke frames load */
  var SPRITE = '/assets/img/jellyfish-swim.webp';    /* 32 frames side by side, 260 × 233 each */
  var FRAMES = 32, RATIO = 233 / 260;
  var CONTRACT_FROM = 4, CONTRACT_TO = 15;           /* frames where the bell squeezes */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var layer = document.createElement('div');
  layer.className = 'jelly-layer';
  layer.setAttribute('aria-hidden', 'true');
  hero.insertBefore(layer, hero.firstChild);

  function rand(a, b) { return a + Math.random() * (b - a); }
  var W = 0, H = 0;
  function measure() { W = hero.offsetWidth; H = hero.offsetHeight; }
  measure();

  var count = W < 700 ? 3 : 5;
  var jellies = [];
  var spriteReady = false;

  /* depth 0 = far (small, faint, soft), 1 = near (large, clearer) */
  function setup(j, initial) {
    var depth = Math.random();
    var narrow = W < 700;
    j.w = (narrow ? rand(60, 130) : rand(90, 240)) * (0.6 + depth * 0.6);
    j.depth = depth;
    var minX = narrow ? 0.05 : 0.7;                    /* keep clear of the headline on wide screens */
    j.x = rand(minX, 0.97) * W - j.w / 2;
    j.y = initial ? rand(0.05, 1) * H : H + rand(20, 160);
    j.speed = rand(8, 15) * (0.6 + depth * 0.7);       /* px per second, upwards */
    j.stroke = rand(2.6, 3.6);                         /* seconds per swim stroke */
    j.offset = rand(0, 1);
    j.sway = rand(10, 24);
    j.swayPeriod = rand(14, 24);
    j.phase = rand(0, Math.PI * 2);
    j.tilt = rand(-6, 6);
    j.el.style.width = j.w.toFixed(1) + 'px';
    j.el.style.height = (j.w * RATIO).toFixed(1) + 'px';
    j.el.style.opacity = (0.3 + depth * 0.5).toFixed(2);
    j.el.style.filter = depth < 0.35 ? 'blur(' + (2.4 - depth * 6).toFixed(1) + 'px)' : 'none';
    j.el.style.zIndex = Math.round(depth * 10);
  }

  for (var i = 0; i < count; i++) {
    var el = document.createElement('div');
    el.className = 'jelly';
    el.style.backgroundImage = 'url(' + STILL + ')';
    layer.appendChild(el);
    var j = { el: el, frame: -1 };
    setup(j, true);
    j.y = (i + rand(0.1, 0.9)) / count * H;            /* spread out so they never start in a clump */
    jellies.push(j);
  }

  function useSprite() {
    spriteReady = true;
    jellies.forEach(function (j) {
      j.el.style.backgroundImage = 'url(' + SPRITE + ')';
      j.el.style.backgroundSize = (FRAMES * 100) + '% 100%';
      j.frame = -1;
    });
  }
  if (!reduce) {
    var load = function () { var im = new Image(); im.onload = useSprite; im.src = SPRITE; };
    if (document.readyState === 'complete') setTimeout(load, 200); else window.addEventListener('load', function () { setTimeout(load, 200); });
  }

  function strokeAt(j, t) { var p = (t / j.stroke + j.offset) % 1; return p < 0 ? p + 1 : p; }

  function draw(t) {
    for (var k = 0; k < jellies.length; k++) {
      var j = jellies[k];
      var x = j.x + Math.sin(t / j.swayPeriod * Math.PI * 2 + j.phase) * j.sway;
      var rot = j.tilt + Math.sin(t / j.swayPeriod * Math.PI * 2 + j.phase + 1) * 4;
      j.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + j.y.toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg)';
      if (spriteReady) {
        var f = Math.floor(strokeAt(j, t) * FRAMES) % FRAMES;
        if (f !== j.frame) { j.frame = f; j.el.style.backgroundPosition = (f / (FRAMES - 1) * 100).toFixed(4) + '% 0'; }
      }
    }
  }

  if (reduce) { draw(0); return; }

  var last = null, running = false, visible = true, raf = 0;
  function step(now) {
    var t = now / 1000;
    var dt = last == null ? 0 : Math.min(t - last, 0.1);
    last = t;
    for (var k = 0; k < jellies.length; k++) {
      var j = jellies[k];
      /* faster while the bell contracts, a slow glide the rest of the stroke */
      var f = strokeAt(j, t) * FRAMES;
      var push = (f >= CONTRACT_FROM && f <= CONTRACT_TO) ? 1.7 : 0.55;
      j.y -= j.speed * push * dt;
      if (j.y < -j.w * 1.2) setup(j, false);
    }
    draw(t);
    raf = requestAnimationFrame(step);
  }
  function start() { if (!running) { running = true; last = null; raf = requestAnimationFrame(step); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  /* fade out while scrolling down; pause when the hero is gone */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    var o = Math.max(0, 1 - y / (H * 0.55));
    layer.style.opacity = o.toFixed(3);
    if (o <= 0 || !visible) stop(); else if (!document.hidden) start();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else onScroll(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; onScroll(); }).observe(hero);
  }
  onScroll();
  start();
})();
