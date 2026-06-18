/* ===================================================================
   Bentoji Studio — shared site behaviour
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

    /* ---- in-page anchor smooth scroll ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (!h || h.length < 2) return;
      a.addEventListener('click', function (e) {
        var t = document.querySelector(h);
        if (!t) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { offset: -70, duration: 1.1 });
        else t.scrollIntoView({ behavior: 'smooth' });
      });
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
      ? '<div class="thumb-art"><img src="' + p.thumb + '" alt="' + esc(p.title) + '" loading="lazy"><div class="glass"></div></div>'
      : '<div class="thumb-art" style="--c1:' + p.c1 + ';--c2:' + p.c2 + ';--c3:' + p.c3 + '"><div class="mesh"></div><div class="glass"></div></div>';
    return '' +
      '<a class="work-card reveal" href="' + projectHref(p) + '"' + (p.external ? ' target="_blank" rel="noopener"' : '') + '>' +
        thumb +
        '<span class="cat">' + esc(p.category) + '</span>' +
        '<div class="work-meta"><h3>' + esc(p.title) + '</h3><span class="yr">' + esc(p.year) + '</span></div>' +
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
    document.title = p.title + ' — Bentoji Studio';

    var facts = (p.facts || []).map(function (f) {
      return '<div class="fact"><div class="k">' + esc(f.k) + '</div><div class="v">' + esc(f.v) + '</div></div>';
    }).join('');

    var body = (p.body || []).map(function (b) {
      if (b.h) return '<h3>' + esc(b.h) + '</h3>';
      return '<p>' + esc(b.p) + '</p>';
    }).join('');

    var cover = p.cover
      ? '<div class="thumb-art"><img src="' + p.cover + '" alt="' + esc(p.title) + '"></div>'
      : '<div class="thumb-art" style="--c1:' + p.c1 + ';--c2:' + p.c2 + ';--c3:' + p.c3 + '"><div class="mesh"></div></div>';

    var visit = p.visit ? '<div class="hero-actions"><a class="btn btn-light" href="' + p.visit + '">Visit project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg></a></div>' : '';

    root.innerHTML =
      '<div class="container work-hero">' +
        '<a class="text-link" href="/portfolio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> All work</a>' +
        '<div class="cat" style="margin-top:24px">' + esc(p.category) + '</div>' +
        '<h1>' + esc(p.title) + '</h1>' +
        '<p class="lead">' + esc(p.tagline) + '</p>' + visit +
        '<div class="work-cover">' + cover + '</div>' +
        '<div class="work-facts">' + facts + '</div>' +
        '<div class="work-body">' + body + '</div>' +
      '</div>';
  }

  /* ---------- Web3Forms ---------- */
  function initForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      var btn = form.querySelector('button[type=submit]');
      var key = form.querySelector('input[name=access_key]');
      if (!key || /YOUR_WEB3FORMS/.test(key.value)) {
        if (note) { note.className = 'form-note err'; note.textContent = 'Form not configured yet — add your Web3Forms access key.'; }
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
          if (note) { note.className = 'form-note ok'; note.textContent = 'Thanks — your message is on its way.'; }
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
})();
