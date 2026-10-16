/* ===================================================================
   Moon jellyfish in the homepage hero (16 Oct 2026)
   A few jellyfish drift slowly upwards with a pulsing swim. Size,
   position, depth and speed are random. The layer fades out as the
   page scrolls and stops animating once the hero is off screen.
   With "reduce motion" on, they stay still.
   =================================================================== */
(function () {
  var hero = document.querySelector('.h-hero');
  if (!hero) return;
  var SRC = '/assets/img/jellyfish.webp';
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

  /* depth 0 = far (small, faint, soft), 1 = near (large, clearer) */
  function setup(j, initial) {
    var depth = Math.random();
    var narrow = W < 700;
    j.w = (narrow ? rand(56, 130) : rand(90, 250)) * (0.6 + depth * 0.6);
    j.depth = depth;
    /* keep most of them to the right of the headline on wide screens */
    var minX = narrow ? 0.05 : 0.6;
    j.x = rand(minX, 0.97) * W - j.w / 2;
    j.y = initial ? rand(0.05, 1) * H : H + rand(20, 160);
    j.speed = rand(7, 14) * (0.6 + depth * 0.7);       /* px per second, upwards */
    j.period = rand(3.2, 4.6);                          /* seconds per swim stroke */
    j.phase = rand(0, Math.PI * 2);
    j.sway = rand(10, 26);
    j.swayPeriod = rand(14, 24);
    j.tilt = rand(-6, 6);
    j.el.style.width = j.w + 'px';
    j.el.style.opacity = (0.28 + depth * 0.5).toFixed(2);
    j.el.style.filter = depth < 0.35 ? 'blur(' + (2.5 - depth * 6).toFixed(1) + 'px)' : 'none';
    j.el.style.zIndex = Math.round(depth * 10);
  }

  for (var i = 0; i < count; i++) {
    var img = document.createElement('img');
    img.src = SRC; img.alt = ''; img.decoding = 'async';
    img.className = 'jelly';
    layer.appendChild(img);
    var j = { el: img };
    setup(j, true);
    /* spread the first ones out vertically so they never start in a clump */
    j.y = (i + rand(0.1, 0.9)) / count * H;
    jellies.push(j);
  }

  function draw(t) {
    for (var k = 0; k < jellies.length; k++) {
      var j = jellies[k];
      var s = Math.sin(t / j.period * Math.PI * 2 + j.phase);   /* -1..1 */
      var sx = 1 + s * 0.05, sy = 1 - s * 0.08;                  /* bell squeezes and relaxes */
      var x = j.x + Math.sin(t / j.swayPeriod * Math.PI * 2 + j.phase) * j.sway;
      var rot = j.tilt + Math.sin(t / j.swayPeriod * Math.PI * 2 + j.phase + 1) * 4;
      j.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + j.y.toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
    }
  }

  if (reduce) { draw(0); layer.classList.add('is-in'); return; }

  var last = null, running = false, visible = true, raf = 0;
  function step(now) {
    var t = now / 1000;
    var dt = last == null ? 0 : Math.min(t - last, 0.1);
    last = t;
    for (var k = 0; k < jellies.length; k++) {
      var j = jellies[k];
      /* a little push on each stroke, then a glide */
      var push = 0.55 + 0.45 * Math.max(0, Math.sin(t / j.period * Math.PI * 2 + j.phase + 0.6));
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
  window.addEventListener('resize', function () { measure(); }, { passive: true });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else onScroll(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; onScroll(); }).observe(hero);
  }
  requestAnimationFrame(function () { layer.classList.add('is-in'); });
  onScroll();
  start();
})();
