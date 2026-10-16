/* ===================================================================
   Homepage hero background (17 Oct 2026)
   Abstract and quiet: a planet's lit edge sweeping across the dark,
   a faint field of stars that twinkle slowly, and one thin orbit line
   with a small dot travelling along it. Built in code, no images.
   Stars pause when the hero is off screen; with "reduce motion" on,
   everything stays still.
   =================================================================== */
(function () {
  var hero = document.querySelector('.h-hero.has-space');
  if (!hero) return;
  var canvas = hero.querySelector('.h-stars');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var stars = [], W = 0, H = 0;

  function build() {
    W = hero.offsetWidth; H = hero.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    var n = Math.round(W * H / 9000);
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() < 0.08 ? 1.1 + Math.random() * 0.6 : 0.4 + Math.random() * 0.6,
        a: 0.15 + Math.random() * 0.55,
        s: 0.15 + Math.random() * 0.5,     /* twinkle speed */
        p: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = reduce ? s.a : s.a * (0.55 + 0.45 * Math.sin(t * s.s + s.p));
      ctx.globalAlpha = a;
      ctx.fillStyle = '#e9ecf5';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  build(); draw(0);
  window.addEventListener('resize', function () { build(); draw(performance.now() / 1000); }, { passive: true });
  if (reduce) return;

  var running = false, raf = 0, visible = true;
  function loop(now) { draw(now / 1000); raf = requestAnimationFrame(loop); }
  function start() { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(loop); } }
  function stop() { running = false; cancelAnimationFrame(raf); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); else stop(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  start();
})();
