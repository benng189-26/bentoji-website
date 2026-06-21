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
    var CONNECT = 130;
    var REPEL   = 120;
    var count;

    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.26;
      this.vy = (Math.random() - 0.5) * 0.26;
      this.r  = Math.random() * 1.0 + 0.4;
      this.a  = Math.random() * 0.20 + 0.07;
    };
    Particle.prototype.update = function () {
      var dx = this.x - mouse.x;
      var dy = this.y - mouse.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < REPEL * REPEL && d2 > 0.25) {
        var d = Math.sqrt(d2);
        var f = (1 - d / REPEL) * 0.6;
        this.vx += (dx / d) * f * 0.1;
        this.vy += (dy / d) * f * 0.1;
      }
      /* gentle random drift */
      this.vx += (Math.random() - 0.5) * 0.007;
      this.vy += (Math.random() - 0.5) * 0.007;
      this.vx *= 0.984;
      this.vy *= 0.984;
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
      count = W < 760 ? 44 : 78;
      particles = [];
      for (var i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawLines() {
      var cc = CONNECT * CONNECT;
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var d2 = dx * dx + dy * dy;
          if (d2 < cc) {
            var alpha = (1 - Math.sqrt(d2) / CONNECT) * 0.09;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.update();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = 'rgba(255,255,255,' + p.a + ')';
        ctx.fill();
      }
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
      if (!reduce) loop();
    }, { passive: true });

    resize();
    if (!reduce) loop();
  })();

})();
