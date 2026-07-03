/* --- Access guard (remove this block to disable) --- */
(function(){
  var p = location.pathname.replace(/\/+$/, '') || '/';
  var open = /^\/(access|soundlax|soundlax-app)(\/|$)/;
  if (open.test(p)) return;
  if (!sessionStorage.getItem('bentoji_ok')) {
    sessionStorage.setItem('bentoji_ret', p + location.search);
    location.replace('/access/');
  }
})();
/* --------------------------------------------------- */

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

      var svcVisuals = [
        '<div class=\"svc-visual\"><svg viewBox=\"0 0 460 192\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"56\" y=\"10\" width=\"108\" height=\"170\" stroke=\"rgba(0,0,0,0.2)\" stroke-width=\"1\"/><rect x=\"64\" y=\"23\" width=\"92\" height=\"144\" fill=\"rgba(0,0,0,0.03)\"/><rect x=\"95\" y=\"14\" width=\"30\" height=\"7\" fill=\"rgba(0,0,0,0.18)\"/><rect x=\"68\" y=\"50\" width=\"39\" height=\"33\" fill=\"rgba(0,0,0,0.08)\" stroke=\"rgba(0,0,0,0.3)\" stroke-width=\"0.9\"/><rect x=\"73\" y=\"55\" width=\"16\" height=\"3\" fill=\"rgba(0,0,0,0.4)\"/><rect x=\"73\" y=\"62\" width=\"26\" height=\"7\" fill=\"rgba(0,0,0,0.1)\"/><rect x=\"73\" y=\"73\" width=\"19\" height=\"3\" fill=\"rgba(0,0,0,0.55)\"/><rect x=\"113\" y=\"50\" width=\"38\" height=\"33\" stroke=\"rgba(0,0,0,0.12)\" stroke-width=\"0.8\"/><rect x=\"118\" y=\"55\" width=\"16\" height=\"3\" fill=\"rgba(0,0,0,0.12)\"/><rect x=\"118\" y=\"62\" width=\"26\" height=\"7\" fill=\"rgba(0,0,0,0.07)\"/><rect x=\"118\" y=\"73\" width=\"19\" height=\"3\" fill=\"rgba(0,0,0,0.07)\"/><rect x=\"70\" y=\"97\" width=\"6\" height=\"6\" stroke=\"rgba(0,0,0,0.22)\" stroke-width=\"0.8\"/><rect x=\"81\" y=\"99\" width=\"56\" height=\"3\" fill=\"rgba(0,0,0,0.16)\"/><rect x=\"70\" y=\"114\" width=\"6\" height=\"6\" stroke=\"rgba(0,0,0,0.14)\" stroke-width=\"0.8\"/><rect x=\"81\" y=\"116\" width=\"48\" height=\"3\" fill=\"rgba(0,0,0,0.12)\"/><rect x=\"70\" y=\"131\" width=\"6\" height=\"6\" stroke=\"rgba(0,0,0,0.1)\" stroke-width=\"0.8\"/><rect x=\"81\" y=\"133\" width=\"52\" height=\"3\" fill=\"rgba(0,0,0,0.1)\"/><line x1=\"168\" y1=\"96\" x2=\"288\" y2=\"96\" stroke=\"rgba(0,0,0,0.12)\" stroke-width=\"0.8\" stroke-dasharray=\"4 3\"/><path d=\"M284 91.5l6 4.5-6 4.5\" stroke=\"rgba(0,0,0,0.2)\" stroke-width=\"1\" stroke-linecap=\"round\" fill=\"none\"/><rect x=\"296\" y=\"10\" width=\"108\" height=\"170\" stroke=\"rgba(0,0,0,0.2)\" stroke-width=\"1\"/><rect x=\"304\" y=\"23\" width=\"92\" height=\"144\" fill=\"rgba(0,0,0,0.03)\"/><circle cx=\"350\" cy=\"47\" r=\"14\" stroke=\"rgba(0,0,0,0.18)\" stroke-width=\"0.8\"/><circle cx=\"350\" cy=\"43\" r=\"6\" fill=\"rgba(0,0,0,0.12)\"/><rect x=\"322\" y=\"67\" width=\"56\" height=\"5\" fill=\"rgba(0,0,0,0.2)\"/><rect x=\"308\" y=\"86\" width=\"27\" height=\"21\" stroke=\"rgba(0,0,0,0.12)\" stroke-width=\"0.8\"/><rect x=\"341\" y=\"86\" width=\"27\" height=\"21\" stroke=\"rgba(0,0,0,0.12)\" stroke-width=\"0.8\"/><rect x=\"374\" y=\"86\" width=\"27\" height=\"21\" stroke=\"rgba(0,0,0,0.12)\" stroke-width=\"0.8\"/><rect x=\"308\" y=\"154\" width=\"88\" height=\"20\" fill=\"rgba(0,0,0,0.72)\"/><rect x=\"326\" y=\"161\" width=\"52\" height=\"4\" fill=\"rgba(255,255,255,0.5)\"/></svg></div>',
        '<div class=\"svc-visual\"><svg viewBox=\"0 0 460 192\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"22\" y=\"14\" width=\"416\" height=\"166\" stroke=\"rgba(0,0,0,0.18)\" stroke-width=\"1\"/><rect x=\"22\" y=\"14\" width=\"416\" height=\"30\" fill=\"rgba(0,0,0,0.04)\"/><circle cx=\"40\" cy=\"29\" r=\"4\" fill=\"rgba(0,0,0,0.22)\"/><circle cx=\"53\" cy=\"29\" r=\"4\" fill=\"rgba(0,0,0,0.14)\"/><circle cx=\"66\" cy=\"29\" r=\"4\" fill=\"rgba(0,0,0,0.08)\"/><rect x=\"120\" y=\"21\" width=\"220\" height=\"16\" stroke=\"rgba(0,0,0,0.12)\" stroke-width=\"0.8\"/><rect x=\"36\" y=\"53\" width=\"44\" height=\"6\" fill=\"rgba(0,0,0,0.22)\"/><rect x=\"220\" y=\"55\" width=\"28\" height=\"4\" fill=\"rgba(0,0,0,0.1)\"/><rect x=\"258\" y=\"55\" width=\"28\" height=\"4\" fill=\"rgba(0,0,0,0.1)\"/><rect x=\"296\" y=\"55\" width=\"28\" height=\"4\" fill=\"rgba(0,0,0,0.1)\"/><rect x=\"340\" y=\"50\" width=\"60\" height=\"18\" fill=\"rgba(0,0,0,0.72)\"/><rect x=\"36\" y=\"84\" width=\"178\" height=\"11\" fill=\"rgba(0,0,0,0.22)\"/><rect x=\"36\" y=\"100\" width=\"140\" height=\"11\" fill=\"rgba(0,0,0,0.15)\"/><rect x=\"36\" y=\"117\" width=\"168\" height=\"4\" fill=\"rgba(0,0,0,0.08)\"/><rect x=\"36\" y=\"136\" width=\"96\" height=\"22\" fill=\"rgba(0,0,0,0.72)\"/><rect x=\"260\" y=\"80\" width=\"156\" height=\"92\" stroke=\"rgba(0,0,0,0.1)\" stroke-width=\"0.9\" fill=\"rgba(0,0,0,0.04)\"/><rect x=\"36\" y=\"170\" width=\"118\" height=\"14\" stroke=\"rgba(0,0,0,0.09)\" stroke-width=\"0.8\"/><rect x=\"168\" y=\"170\" width=\"118\" height=\"14\" stroke=\"rgba(0,0,0,0.09)\" stroke-width=\"0.8\"/><rect x=\"300\" y=\"170\" width=\"118\" height=\"14\" stroke=\"rgba(0,0,0,0.09)\" stroke-width=\"0.8\"/></svg></div>',
        '<div class=\"svc-visual\"><svg viewBox=\"0 0 460 192\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"50\" y1=\"0\" x2=\"50\" y2=\"192\" stroke=\"rgba(0,0,0,0.05)\" stroke-width=\"0.7\"/><line x1=\"110\" y1=\"0\" x2=\"110\" y2=\"192\" stroke=\"rgba(0,0,0,0.05)\" stroke-width=\"0.7\"/><line x1=\"170\" y1=\"0\" x2=\"170\" y2=\"192\" stroke=\"rgba(0,0,0,0.05)\" stroke-width=\"0.7\"/><line x1=\"230\" y1=\"0\" x2=\"230\" y2=\"192\" stroke=\"rgba(0,0,0,0.05)\" stroke-width=\"0.7\"/><line x1=\"290\" y1=\"0\" x2=\"290\" y2=\"192\" stroke=\"rgba(0,0,0,0.05)\" stroke-width=\"0.7\"/><line x1=\"350\" y1=\"0\" x2=\"350\" y2=\"192\" stroke=\"rgba(0,0,0,0.05)\" stroke-width=\"0.7\"/><line x1=\"0\" y1=\"48\" x2=\"460\" y2=\"48\" stroke=\"rgba(0,0,0,0.05)\" stroke-width=\"0.7\"/><line x1=\"0\" y1=\"96\" x2=\"460\" y2=\"96\" stroke=\"rgba(0,0,0,0.05)\" stroke-width=\"0.7\"/><line x1=\"0\" y1=\"144\" x2=\"460\" y2=\"144\" stroke=\"rgba(0,0,0,0.05)\" stroke-width=\"0.7\"/><circle cx=\"210\" cy=\"96\" r=\"72\" stroke=\"rgba(0,0,0,0.14)\" stroke-width=\"0.9\"/><circle cx=\"210\" cy=\"96\" r=\"50\" stroke=\"rgba(0,0,0,0.08)\" stroke-width=\"0.7\"/><circle cx=\"234\" cy=\"96\" r=\"72\" stroke=\"rgba(0,0,0,0.1)\" stroke-width=\"0.9\"/><line x1=\"80\" y1=\"96\" x2=\"370\" y2=\"96\" stroke=\"rgba(0,0,0,0.1)\" stroke-width=\"0.7\" stroke-dasharray=\"3 3\"/><line x1=\"222\" y1=\"14\" x2=\"222\" y2=\"178\" stroke=\"rgba(0,0,0,0.1)\" stroke-width=\"0.7\" stroke-dasharray=\"3 3\"/><line x1=\"30\" y1=\"22\" x2=\"46\" y2=\"22\" stroke=\"rgba(0,0,0,0.16)\" stroke-width=\"0.9\"/><line x1=\"38\" y1=\"14\" x2=\"38\" y2=\"30\" stroke=\"rgba(0,0,0,0.16)\" stroke-width=\"0.9\"/><line x1=\"414\" y1=\"22\" x2=\"430\" y2=\"22\" stroke=\"rgba(0,0,0,0.16)\" stroke-width=\"0.9\"/><line x1=\"422\" y1=\"14\" x2=\"422\" y2=\"30\" stroke=\"rgba(0,0,0,0.16)\" stroke-width=\"0.9\"/><line x1=\"30\" y1=\"170\" x2=\"46\" y2=\"170\" stroke=\"rgba(0,0,0,0.16)\" stroke-width=\"0.9\"/><line x1=\"38\" y1=\"162\" x2=\"38\" y2=\"178\" stroke=\"rgba(0,0,0,0.16)\" stroke-width=\"0.9\"/><line x1=\"414\" y1=\"170\" x2=\"430\" y2=\"170\" stroke=\"rgba(0,0,0,0.16)\" stroke-width=\"0.9\"/><line x1=\"422\" y1=\"162\" x2=\"422\" y2=\"178\" stroke=\"rgba(0,0,0,0.16)\" stroke-width=\"0.9\"/><circle cx=\"222\" cy=\"96\" r=\"18\" fill=\"rgba(0,0,0,0.1)\" stroke=\"rgba(0,0,0,0.25)\" stroke-width=\"0.9\"/><circle cx=\"222\" cy=\"96\" r=\"3\" fill=\"rgba(0,0,0,0.6)\"/><rect x=\"372\" y=\"48\" width=\"60\" height=\"20\" fill=\"rgba(0,0,0,0.06)\"/><rect x=\"372\" y=\"74\" width=\"60\" height=\"20\" fill=\"rgba(0,0,0,0.22)\"/><rect x=\"372\" y=\"100\" width=\"60\" height=\"20\" fill=\"rgba(0,0,0,0.5)\"/><rect x=\"372\" y=\"126\" width=\"60\" height=\"20\" fill=\"rgba(0,0,0,0.8)\"/></svg></div>',
        '<div class=\"svc-visual\"><svg viewBox=\"0 0 460 192\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"rotate(-4 225 110)\"><rect x=\"75\" y=\"24\" width=\"270\" height=\"152\" stroke=\"rgba(0,0,0,0.06)\" stroke-width=\"0.8\" fill=\"rgba(0,0,0,0.02)\"/></g><g transform=\"rotate(-2 225 110)\"><rect x=\"65\" y=\"16\" width=\"270\" height=\"152\" stroke=\"rgba(0,0,0,0.1)\" stroke-width=\"0.8\" fill=\"rgba(0,0,0,0.025)\"/></g><rect x=\"54\" y=\"10\" width=\"270\" height=\"152\" stroke=\"rgba(0,0,0,0.18)\" stroke-width=\"0.9\" fill=\"rgba(0,0,0,0.02)\"/><rect x=\"54\" y=\"10\" width=\"270\" height=\"24\" fill=\"rgba(0,0,0,0.72)\"/><rect x=\"64\" y=\"17\" width=\"80\" height=\"5\" fill=\"rgba(255,255,255,0.45)\"/><line x1=\"189\" y1=\"42\" x2=\"189\" y2=\"154\" stroke=\"rgba(0,0,0,0.07)\" stroke-width=\"0.7\"/><rect x=\"64\" y=\"42\" width=\"110\" height=\"6\" fill=\"rgba(0,0,0,0.22)\"/><rect x=\"64\" y=\"52\" width=\"80\" height=\"4\" fill=\"rgba(0,0,0,0.1)\"/><rect x=\"64\" y=\"78\" width=\"115\" height=\"48\" stroke=\"rgba(0,0,0,0.1)\" stroke-width=\"0.8\" fill=\"rgba(0,0,0,0.04)\"/><rect x=\"199\" y=\"42\" width=\"98\" height=\"6\" fill=\"rgba(0,0,0,0.12)\"/><rect x=\"199\" y=\"52\" width=\"108\" height=\"4\" fill=\"rgba(0,0,0,0.08)\"/><rect x=\"199\" y=\"88\" width=\"3\" height=\"28\" fill=\"rgba(0,0,0,0.55)\"/><rect x=\"208\" y=\"92\" width=\"85\" height=\"4\" fill=\"rgba(0,0,0,0.15)\"/><rect x=\"208\" y=\"100\" width=\"70\" height=\"4\" fill=\"rgba(0,0,0,0.1)\"/><rect x=\"338\" y=\"28\" width=\"86\" height=\"114\" stroke=\"rgba(0,0,0,0.14)\" stroke-width=\"0.8\" fill=\"rgba(0,0,0,0.025)\"/><rect x=\"338\" y=\"28\" width=\"86\" height=\"22\" fill=\"rgba(0,0,0,0.1)\"/><rect x=\"338\" y=\"48\" width=\"4\" height=\"22\" fill=\"rgba(0,0,0,0.5)\"/><rect x=\"348\" y=\"34\" width=\"46\" height=\"5\" fill=\"rgba(0,0,0,0.22)\"/><rect x=\"348\" y=\"58\" width=\"66\" height=\"4\" fill=\"rgba(0,0,0,0.1)\"/><rect x=\"348\" y=\"68\" width=\"56\" height=\"4\" fill=\"rgba(0,0,0,0.08)\"/><rect x=\"348\" y=\"78\" width=\"60\" height=\"4\" fill=\"rgba(0,0,0,0.1)\"/></svg></div>'
      ];
      function renderServices(items) {
        var grid = document.querySelector('[data-svc-grid]');
        if (!grid || !items || !items.length) return;
        grid.innerHTML = items.map(function (it, i) {
          var paras = (it.paragraphs || []).map(function (x) { return '<p>' + escCms(x) + '</p>'; }).join('');
          var list  = (it.list || []).map(function (li) { return '<li>' + escCms(li) + '</li>'; }).join('');
          return '<div class="svc-exp reveal' + (i % 2 ? ' d2' : '') + '">' +
            (svcVisuals[i] || '') +
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

  function placeholderInner(ph) {
    var number = ph && ph.number ? '<span class="ph-number">' + esc(ph.number) + '</span>' : '';
    var label = ph && ph.label ? esc(ph.label) : 'Website snapshot placeholder';
    return '<div class="placeholder-inner">' + number + '<span class="ph-label">' + label + '</span></div>';
  }

  function richText(value) {
    if (!Array.isArray(value)) return esc(value);
    return value.map(function (part) {
      if (typeof part === 'string') return esc(part);
      if (part && part.href) {
        return '<a href="' + esc(part.href) + '" target="_blank" rel="noopener noreferrer">' + esc(part.text || part.href) + '</a>';
      }
      return esc(part && part.text ? part.text : '');
    }).join('');
  }

  function classTokens(value) {
    return String(value || '').split(/\s+/).filter(function (token) {
      return /^[a-z0-9_-]+$/i.test(token);
    }).join(' ');
  }

  function shotHTML(shot, i, title, extraClass) {
    var cls = 'shot' + (extraClass ? ' ' + extraClass : '');
    if (typeof shot === 'string') {
      return '<figure class="' + cls + '"><img src="' + esc(shot) + '" alt="' + esc(title) + ' - screen ' + (i + 1) + '" loading="lazy"></figure>';
    }
    if (shot && shot.src) {
      return '<figure class="' + cls + '"><img src="' + esc(shot.src) + '" alt="' + esc(shot.alt || title + ' - screen ' + (i + 1)) + '" loading="lazy"></figure>';
    }
    return '<figure class="' + cls + ' shot-placeholder" role="img" aria-label="' + esc((shot && shot.label) || title + ' screen placeholder') + '">' + placeholderInner(shot || {}) + '</figure>';
  }

  function cardHTML(p) {
    var thumbClass = classTokens(p.thumbClass);
    var thumb = p.thumb
      ? '<div class="thumb-art' + (thumbClass ? ' ' + thumbClass : '') + '"><img src="' + p.thumb + '" alt="' + esc(p.title) + '" loading="lazy"></div>'
      : p.thumbPlaceholder
        ? '<div class="thumb-art thumb-placeholder" role="img" aria-label="' + esc(p.thumbPlaceholder.label || p.title) + '">' + placeholderInner(p.thumbPlaceholder) + '</div>'
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
      var visibleProjects = window.PROJECTS.filter(function (project) { return !project.hidden; });
      var list = limit ? visibleProjects.slice(0, limit) : visibleProjects;
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

  /* Navigate to a project without a full page reload */
  function loadProject(slug) {
    history.pushState({slug: slug}, '', '/work/' + slug + '/');
    renderWorkDetail();
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function renderWorkDetail() {
    var root = document.querySelector('[data-work-detail]');
    if (!root) return;

    document.body.classList.add('work-page');

    /* Measure nav height for sticky offset */
    var navEl = document.querySelector('.site-nav');
    if (navEl) document.documentElement.style.setProperty('--nav-h', navEl.offsetHeight + 'px');

    /* Resolve slug from URL */
    var slug = new URLSearchParams(location.search).get('p');
    if (!slug) {
      var parts = location.pathname.replace(/\/+$/, '').split('/');
      slug = parts[1] === 'work' && parts[2] ? decodeURIComponent(parts[2]) : '';
    }

    var p = window.PROJECTS.filter(function (x) { return x.slug === slug; })[0];
    if (!p) { location.replace('/work/'); return; }
    document.title = p.title + ' - Bentoji';

    /* Visible list for next */
    var visible = window.PROJECTS.filter(function (x) { return !x.hidden; });
    var idx = -1;
    visible.forEach(function (x, i) { if (x.slug === slug) idx = i; });
    var nextP = idx >= 0 && idx < visible.length - 1 ? visible[idx + 1] : null;

    /* SVGs */
    var backSvg  = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><path d="M10 3L5 8l5 5"/></svg>';
    var arrowR   = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="M6 3l5 5-5 5"/></svg>';
    var chevron  = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><path d="M4 6l4 4 4-4"/></svg>';

    /* Group body into accordion sections by heading, skip inline images */
    var sections = [];
    var cur = null;
    (p.body || []).forEach(function (b) {
      if (b.h) {
        cur = { title: b.h, items: [] };
        sections.push(cur);
      } else if (b.image) {
        /* skip: images go in the imagery panel */
      } else if (cur) {
        cur.items.push(b);
      } else {
        if (!sections.length) { cur = { title: 'Overview', items: [] }; sections.push(cur); }
        sections[0].items.push(b);
      }
    });
    if (!sections.length) {
      sections = [{ title: 'Overview', items: p.tagline ? [{ p: p.tagline }] : [] }];
    }

    /* Accordion HTML */
    var accHTML = sections.map(function (s, i) {
      var inner = s.items.map(function (b) {
        if (b.list) return '<ul>' + b.list.map(function (li) { return '<li>' + richText(li) + '</li>'; }).join('') + '</ul>';
        if (b.p)    return '<p>' + richText(b.p) + '</p>';
        return '';
      }).join('');
      return '<div class="acc-item' + (i === 0 ? ' open' : '') + '">' +
        '<button class="acc-trigger" type="button">' +
          '<span class="acc-label">' + esc(s.title) + '</span>' +
          '<span class="acc-icon">' + chevron + '</span>' +
        '</button>' +
        '<div class="acc-body"><div class="acc-inner">' + inner + '</div></div>' +
        '</div>';
    }).join('');

    /* Next project button */
    var nextBtn = nextP
      ? '<a class="work-nav-btn" href="/work/' + nextP.slug + '/" data-nav-slug="' + nextP.slug + '">' +
          '<span class="work-nav-label">Next project</span>' +
          '<span class="work-nav-title">' + esc(nextP.title) + '</span>' +
          '<span class="work-nav-dir">' + arrowR + '</span>' +
        '</a>'
      : '';

    /* Visit live site button */
    var visitBtn = p.visit
      ? '<a class="btn btn-ghost work-visit-btn" href="' + esc(p.visit) + '" target="_blank" rel="noopener noreferrer">Visit live site <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M7 17 17 7M9 7h8v8"/></svg></a>'
      : '';

    /* Sidebar */
    var sidebar =
      '<aside class="work-sidebar">' +
        '<div class="work-sidebar-head">' +
          '<a class="work-back" href="/work/">' + backSvg + ' All work</a>' +
          '<div class="work-sidebar-meta">' +
            '<span class="work-cat">' + esc(p.category) + '</span>' +
            '<h1 class="work-title">' + esc(p.title) + '</h1>' +
            (p.location ? '<div class="work-loc">' + esc(p.location) + '</div>' : '') +
          '</div>' +
        '</div>' +
        '<div class="work-accordion">' + accHTML + '</div>' +
        '<div class="work-sidebar-foot">' +
          (visitBtn ? '<div class="work-visit-wrap">' + visitBtn + '</div>' : '') +
          (nextBtn  ? '<div class="work-nav-btns">' + nextBtn + '</div>' : '') +
        '</div>' +
      '</aside>';

    /* Imagery panel */
    var imgs = (p.gallery || []).map(function (src) {
      return '<div class="work-img-wrap"><img src="' + esc(src) + '" alt="' + esc(p.title) + '" loading="lazy"></div>';
    }).join('');
    if (!imgs) imgs = '<div class="work-img-placeholder"></div>';
    var imagery = '<div class="work-imagery">' + imgs + '</div>';

    root.innerHTML = '<div class="work-detail-v2">' + sidebar + imagery + '</div>';

    /* Accordion click handlers */
    root.querySelectorAll('.acc-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc-item');
        var wasOpen = item.classList.contains('open');
        root.querySelectorAll('.acc-item').forEach(function (el) { el.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    });

    /* SPA navigation */
    root.querySelectorAll('[data-nav-slug]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        loadProject(el.getAttribute('data-nav-slug'));
      });
    });
  }

  /* Handle browser back/forward within work detail SPA navigation */
  window.addEventListener('popstate', function () {
    if (document.querySelector('[data-work-detail]')) {
      renderWorkDetail();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  });

  /* Expose for inline onclick handlers in work detail */
  window.loadProject = loadProject;

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

})();
