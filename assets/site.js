/* ===================================================================
   Bentoji Studio - shared site behaviour
   =================================================================== */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- Lenis smooth scrolling ---- */
    var lenis = null;
    if (window.Lenis && !reduce) {
      lenis = new Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    /* ---- in-page anchor smooth scroll (delegated, covers dynamically-added links) ---- */
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var h = a.getAttribute('href');
      if (!h || h.length < 2) return;
      var t = document.querySelector(h);
      if (!t) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(t, { offset: -90, duration: 1.1 });
      else t.scrollIntoView({ behavior: 'smooth' });
    });

    /* ---- external links open in new tab ---- */
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });

    /* ---- mobile menu ---- */
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.documentElement.style.overflow = open ? 'hidden' : '';
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.documentElement.style.overflow = '';
        });
      });
    }

    /* ---- scroll reveal (once) ---- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---- CMS-driven content (homepage / contact) ----
       Text nodes use data-cms="dotted.path". Repeatable sections
       (services / why / process) are rendered from arrays, replacing the
       hard-coded HTML fallback only once the JSON loads successfully. ---- */
    if (document.querySelector('[data-cms]')) {
      function escCms(s) {
        return String(s == null ? '' : s)
          .replace(/&/g, '&amp;').replace(/</g, '&lt;')
          .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
      function dig(obj, path) {
        return path.split('.').reduce(function (o, k) { return (o == null) ? o : o[k]; }, obj);
      }
      function pad(n) { return (n < 10 ? '0' : '') + n; }
      function reobserve(scope) {
        var nodes = scope.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
          var o = new IntersectionObserver(function (en) {
            en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
          }, { threshold: 0.12 });
          nodes.forEach(function (el) { o.observe(el); });
        } else {
          nodes.forEach(function (el) { el.classList.add('in'); });
        }
      }
      var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

      function renderServices(items) {
        var grid = document.querySelector('[data-svc-grid]');
        if (!grid || !items || !items.length) return;
        grid.innerHTML = items.map(function (it, i) {
          var paras = (it.paragraphs || []).map(function (x) { return '<p>' + escCms(x) + '</p>'; }).join('');
          var list  = (it.list || []).map(function (li) { return '<li>' + escCms(li) + '</li>'; }).join('');
          return '<div class="svc-exp reveal' + (i % 2 ? ' d2' : '') + '">' +
            '<span class="num">' + pad(i + 1) + '</span>' +
            '<h4>' + escCms(it.title) + '</h4>' +
            (it.tagline ? '<p class="svc-tagline">' + escCms(it.tagline) + '</p>' : '') +
            paras +
            (it.listLabel ? '<p class="svc-list-label">' + escCms(it.listLabel) + '</p>' : '') +
            (list ? '<ul>' + list + '</ul>' : '') +
            (it.linkText ? '<a class="svc-link" href="/contact">' + escCms(it.linkText) + ' ' + arrow + '</a>' : '') +
          '</div>';
        }).join('');
        reobserve(grid);
      }
      function renderWhy(items) {
        var grid = document.querySelector('[data-why-grid]');
        if (!grid || !items || !items.length) return;
        grid.innerHTML = items.map(function (it, i) {
          return '<div class="why-item reveal' + (i % 2 ? ' d2' : '') + '">' +
            '<h4>' + escCms(it.title) + '</h4><p>' + escCms(it.body) + '</p></div>';
        }).join('');
        reobserve(grid);
      }
      function renderProcess(items) {
        var grid = document.querySelector('[data-process-grid]');
        if (!grid || !items || !items.length) return;
        grid.innerHTML = items.map(function (it, i) {
          return '<div class="process-step reveal' + (i % 2 ? ' d2' : '') + '">' +
            '<span class="step-num">' + pad(i + 1) + '</span>' +
            '<h4>' + escCms(it.title) + '</h4><p>' + escCms(it.body) + '</p></div>';
        }).join('');
        reobserve(grid);
      }

      var cmsSrc = document.body.getAttribute('data-content') || '/content/homepage.json';
      fetch(cmsSrc)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          document.querySelectorAll('[data-cms]').forEach(function (el) {
            var val = dig(d, el.getAttribute('data-cms'));
            if (val == null) return;
            if (Array.isArray(val)) {
              el.innerHTML = val.map(function (x) { return '<p>' + escCms(x) + '</p>'; }).join('');
            } else {
              el.textContent = val;
            }
          });
          if (d.services) renderServices(d.services.items);
          if (d.why)      renderWhy(d.why.items);
          if (d.process)  renderProcess(d.process.items);
        })
        .catch(function () {});
    }

        /* ---- current year ---- */
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* ---- render portfolio (if a target exists & PROJECTS available) ---- */
    if (window.PROJECTS) {
      renderWorkGrid();
      renderWorkDetail();
    }

    /* ---- forms (Web3Forms) ---- */
    document.querySelectorAll('form[data-web3form]').forEach(initForm);
  });

  /* ---------- portfolio rendering ---------- */
  function projectHref(p) { return p.link ? p.link : ('/work?p=' + encodeURIComponent(p.slug)); }

  function cardHTML(p) {
    var thumb = p.thumb
      ? '<div class="thumb-art"><img src="' + p.thumb + '" alt="' + esc(p.title) + '" loading="lazy"></div>'
      : '<div class="thumb-art"><div class="mesh"></div></div>';
    return '' +
      '<a class="work-card reveal" href="' + projectHref(p) + '"' + (p.external ? ' target="_blank" rel="noopener"' : '') + '>' +
        thumb +
        '<span class="cat">' + esc(p.category) + '</span>' +
        '<div class="work-meta"><h3>' + esc(p.title) + '</h3><span class="yr">' + esc(p.year) + '</span></div>' +
        (p.location ? '<p class="loc">' + esc(p.location) + '</p>' : '') +
        '<p class="desc">' + esc(p.tagline) + '</p>' +
        '<span class="arrow">View project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7M9 7h8v8"/></svg></span>' +
      '</a>';
  }

  function renderWorkGrid() {
    document.querySelectorAll('[data-work-grid]').forEach(function (grid) {
      var limit = parseInt(grid.getAttribute('data-limit') || '0', 10);
      var list = limit ? window.PROJECTS.slice(0, limit) : window.PROJECTS;
      grid.innerHTML = list.map(cardHTML).join('');
      // re-observe new reveal nodes
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12 });
        grid.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
      } else {
        grid.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      }
    });
  }

  function renderWorkDetail() {
    var root = document.querySelector('[data-work-detail]');
    if (!root) return;
    var slug = new URLSearchParams(location.search).get('p');
    var p = window.PROJECTS.filter(function (x) { return x.slug === slug; })[0];
    if (!p) { location.replace('/portfolio'); return; }
    document.title = p.title + ' - Bentoji Studio';

    var facts = (p.facts || []).map(function (f) {
      return '<div class="fact"><div class="k">' + esc(f.k) + '</div><div class="v">' + esc(f.v) + '</div></div>';
    }).join('');

    var toc = [];
    var body = (p.body || []).map(function (b) {
      if (b.h) { var id = 's-' + slugify(b.h); toc.push('<a href="#' + id + '">' + esc(b.h) + '</a>'); return '<h3 id="' + id + '">' + esc(b.h) + '</h3>'; }
      if (b.list) return '<ul class="work-list">' + b.list.map(function (li) { return '<li>' + esc(li) + '</li>'; }).join('') + '</ul>';
      return '<p>' + esc(b.p) + '</p>';
    }).join('');
    var tocHTML = toc.length ? '<nav class="work-toc" aria-label="Sections">' + toc.join('') + '</nav>' : '';

    var shots = (p.gallery || []).map(function (src, i) {
      return '<figure class="shot"><img src="' + src + '" alt="' + esc(p.title) + ' - screen ' + (i + 1) + '" loading="lazy"></figure>';
    }).join('');

    var coverImg = p.cover || p.thumb;
    var cover = coverImg
      ? '<div class="thumb-art"><img src="' + coverImg + '" alt="' + esc(p.title) + '"></div>'
      : '<div class="thumb-art"><div class="mesh"></div></div>';

    var visit = p.visit ? '<div class="hero-actions"><a class="btn btn-light" href="' + p.visit + '">Visit project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg></a></div>' : '';

    root.innerHTML =
      '<div class="container work-detail">' +
        '<a class="text-link work-back" href="/portfolio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> All work</a>' +
        '<div class="work-detail-grid">' +
          '<aside class="work-side reveal">' +
            '<div class="cat">' + esc(p.category) + '</div>' +
            '<h1>' + esc(p.title) + '</h1>' +
            (p.location ? '<p class="loc">' + esc(p.location) + '</p>' : '') +
            '<div class="work-facts">' + facts + '</div>' +
            tocHTML + visit +
          '</aside>' +
          '<div class="work-main reveal d1">' +
            '<p class="lead">' + esc(p.tagline) + '</p>' +
            '<div class="work-cover">' + cover + '</div>' +
            '<div class="work-body">' + body + '</div>' +
            (shots ? '<div class="work-shots">' + shots + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>';

    // the detail HTML was injected after the page-load reveal observer ran,
    // so observe the newly-added .reveal elements now (otherwise they stay hidden).
    var newReveals = root.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); dio.unobserve(e.target); } });
      }, { threshold: 0.06 });
      newReveals.forEach(function (el) { dio.observe(el); });
    } else {
      newReveals.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- Web3Forms ---------- */
  function initForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      var btn = form.querySelector('button[type=submit]');
      // validate required fields (name, email, message) and email format
      if (!form.checkValidity()) {
        if (note) { note.className = 'form-note'; note.textContent = ''; }
        form.reportValidity();
        return;
      }
      var key = form.querySelector('input[name=access_key]');
      if (!key || /YOUR_WEB3FORMS/.test(key.value)) {
        if (note) { note.className = 'form-note err'; note.textContent = 'Form not configured yet - add your Web3Forms access key.'; }
        return;
      }
      var data = Object.fromEntries(new FormData(form).entries());
      if (data.botcheck) return; // honeypot
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
      fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res.success) {
          if (note) { note.className = 'form-note ok'; note.textContent = 'Thanks - your message is on its way.'; }
          form.reset();
        } else { throw new Error(res.message || 'failed'); }
      }).catch(function () {
        if (note) { note.className = 'form-note err'; note.textContent = 'Something went wrong. Please email soundlax.studio@gmail.com directly.'; }
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Send'; }
      });
    });
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /* ---- Hero: interactive particle canvas ---- */
  (function () {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles, raf;
    var mouse = { x: -9999, y: -9999 };
    var CONNECT = 152;
    var REPEL   = 185;
    var count;

    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.z  = Math.random();                 // depth: 0 = far, 1 = near
      this.vx = (Math.random() - 0.5) * 0.62 * (0.5 + this.z);
      this.vy = (Math.random() - 0.5) * 0.62 * (0.5 + this.z);
      this.r  = 0.55 + this.z * this.z * 3.6;   // near particles much larger
      this.a  = 0.16 + this.z * 0.64;           // near particles much brighter
      this.pulse = Math.random() * 6.2832;      // subtle size "breathing"
    };
    Particle.prototype.update = function () {
      var ds = 0.45 + this.z * 1.25;           // depth speed scale (near = faster)
      var dx = this.x - mouse.x;
      var dy = this.y - mouse.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < REPEL * REPEL && d2 > 0.25) {
        var d = Math.sqrt(d2);
        var f = (1 - d / REPEL);
        this.vx += (dx / d) * f * 0.55 * (0.5 + this.z);
        this.vy += (dy / d) * f * 0.55 * (0.5 + this.z);
      }
      /* lively random drift */
      this.vx += (Math.random() - 0.5) * 0.02;
      this.vy += (Math.random() - 0.5) * 0.02;
      this.vx *= 0.995;
      this.vy *= 0.995;
      /* Keep every particle autonomously moving (not just on hover):
         clamp speed into [MIN, MAX] every frame. MIN guarantees constant drift. */
      var sp = this.vx * this.vx + this.vy * this.vy;
      var MIN = 0.45 * ds, MAX = 2.6 * ds;
      if (sp > MAX * MAX) {
        var sc = MAX / Math.sqrt(sp); this.vx *= sc; this.vy *= sc;
      } else if (sp < MIN * MIN) {
        if (sp < 1e-4) {
          var ang = Math.random() * 6.2832;
          this.vx = Math.cos(ang) * MIN; this.vy = Math.sin(ang) * MIN;
        } else {
          var su = MIN / Math.sqrt(sp); this.vx *= su; this.vy *= su;
        }
      }
      this.x += this.vx;
      this.y += this.vy;
      /* wrap edges */
      if (this.x < -14) this.x = W + 14;
      if (this.x > W + 14) this.x = -14;
      if (this.y < -14) this.y = H + 14;
      if (this.y > H + 14) this.y = -14;
    };

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      count = W < 760 ? 66 : 132;
      particles = [];
      for (var i = 0; i < count; i++) particles.push(new Particle());
      particles.sort(function (a, b) { return a.z - b.z; }); // far -> near (painter's order)
    }

    function drawLines() {
      var cc = CONNECT * CONNECT;
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var d2 = dx * dx + dy * dy;
          if (d2 < cc) {
            var alpha = (1 - Math.sqrt(d2) / CONNECT) * 0.34;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }
    }

    function drawMouseLines() {
      if (mouse.x < -9000) return;
      var R = REPEL, rr = R * R;
      for (var i = 0; i < particles.length; i++) {
        var dx = particles[i].x - mouse.x;
        var dy = particles[i].y - mouse.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < rr) {
          var a = (1 - Math.sqrt(d2) / R) * 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(255,255,255,' + a + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      drawMouseLines();
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.update();
        p.pulse += 0.02;
        var rr = p.r * (0.86 + 0.14 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, rr, 0, 6.2832);
        ctx.fillStyle = 'rgba(255,255,255,' + p.a + ')';
        ctx.fill();
      }
    }

    function loop() {
      drawFrame();
      raf = requestAnimationFrame(loop);
    }

    /* mouse / touch on the hero section (canvas is pointer-events:none) */
    var hero = canvas.parentElement;
    hero.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    hero.addEventListener('mouseleave', function () {
      mouse.x = -9999; mouse.y = -9999;
    }, { passive: true });
    hero.addEventListener('touchmove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - r.left;
      mouse.y = e.touches[0].clientY - r.top;
    }, { passive: true });

    window.addEventListener('resize', function () {
      cancelAnimationFrame(raf);
      resize();
      if (reduce) drawFrame(); else loop();
    }, { passive: true });

    /* Robust init.
       - rAF is suspended in hidden/background tabs, so a single rAF at load
         can silently never fire. Wait for the tab to become visible first.
       - The hero height may not be computed on the first frame, so retry
         until offsetHeight is non-zero.
       - Respect reduced motion by rendering one static frame (no loop). */
    var started = false;
    function start() {
      if (started) return;
      if (canvas.offsetHeight === 0) { requestAnimationFrame(start); return; }
      started = true;
      resize();
      if (reduce) drawFrame(); else loop();
    }
    if (document.visibilityState === 'hidden') {
      document.addEventListener('visibilitychange', function onVis() {
        if (document.visibilityState === 'visible') {
          document.removeEventListener('visibilitychange', onVis);
          start();
        }
      });
    } else {
      requestAnimationFrame(start);
    }
  })();

})();
