/* ===================================================================
   Work index (Oct 2026)
   Reads PROJECTS, PIECES and WORK_TYPES from assets/projects.js.

   [data-work-index]  full Work page: type filters + grid + lightbox.
                      Filters are shareable: /portfolio?type=ads
   [data-type-tiles]  homepage tiles, one per work type, linking to
                      the filtered Work page.
   [data-case-cards]  homepage case study cards (projects with
                      featured: true).
   =================================================================== */
(function () {
  var TYPES = window.WORK_TYPES || [];
  var PROJECTS = (window.PROJECTS || []).filter(function (p) { return !p.hidden; });
  var PIECES = window.PIECES || [];
  var SHOW_DRAFTS = window.SHOW_DRAFTS !== false;

  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function typeLabel(id) {
    var t = TYPES.filter(function (x) { return x.id === id; })[0];
    return t ? t.label : '';
  }

  /* one list of items: projects (with their own page) and single pieces */
  function items() {
    var proj = PROJECTS.map(function (p) {
      return {
        kind: 'project', id: p.slug, title: p.title, types: p.types || [],
        label: '', year: p.year,
        image: p.thumb, pos: (p.thumbClass || '').indexOf('thumb-top') > -1 ? 'center top' : '',
        href: p.link || ('/work?p=' + encodeURIComponent(p.slug)), desc: p.tagline
      };
    });
    var pcs = PIECES.filter(function (x) { return SHOW_DRAFTS || !x.prepare; }).map(function (x) {
      return {
        kind: 'piece', id: x.id, title: x.title, types: [x.type], label: x.label, year: x.year,
        image: (x.images || [])[0], images: x.images || [], pos: x.pos, fit: x.fit,
        caption: x.caption, link: x.link, prepare: x.prepare
      };
    });
    /* mix projects and pieces so range shows straight away; slots last */
    var real = pcs.filter(function (x) { return !x.prepare; });
    var slots = pcs.filter(function (x) { return x.prepare; });
    var out = [], i = 0;
    while (i < Math.max(proj.length, real.length)) {
      if (proj[i]) out.push(proj[i]);
      if (real[i]) out.push(real[i]);
      i++;
    }
    return out.concat(slots);
  }

  function slotHTML(it) {
    return '<div class="w-slot"><span class="w-slot-tag">To add</span><p>' + esc(it.prepare) + '</p>' +
      '<p class="w-slot-file">' + esc(it.image) + '</p></div>';
  }
  function cardHTML(it) {
    var meta = [it.label, it.year].filter(Boolean).join(' · ');
    var media = '<div class="w-media' + (it.fit === 'contain' ? ' is-contain' : '') + '"' +
      (it.prepare ? ' data-slot="1"' : '') + '>' +
      '<img src="' + esc(it.image) + '" alt="' + esc(it.title) + '" loading="lazy" decoding="async"' +
      (it.pos ? ' style="object-position:' + esc(it.pos) + '"' : '') + '>' +
      (it.kind === 'project' ? '<span class="w-badge">Case study</span>' : '') +
      '</div>';
    var inner = media +
      '<span class="w-type">' + esc(it.types.map(typeLabel).join(' · ')) + '</span>' +
      '<h3 class="w-title">' + esc(it.title) + '</h3>' +
      (meta ? '<span class="w-meta">' + esc(meta) + '</span>' : '');
    var attrs = ' class="w-card' + (it.prepare ? ' is-slot' : '') + '" data-types="' + esc(it.types.join(' ')) + '"';
    if (it.kind === 'project') return '<a' + attrs + ' href="' + esc(it.href) + '">' + inner + '</a>';
    return '<button type="button"' + attrs + ' data-piece="' + esc(it.id) + '">' + inner + '</button>';
  }

  /* cards whose slot image doesn't exist yet show the "to add" note */
  function wireSlots(scope, list) {
    scope.querySelectorAll('.w-media[data-slot="1"] img').forEach(function (img) {
      img.addEventListener('error', function () {
        var card = img.closest('.w-card');
        var it = list.filter(function (x) { return x.id === card.getAttribute('data-piece'); })[0];
        if (it) img.closest('.w-media').outerHTML = '<div class="w-media is-empty">' + slotHTML(it) + '</div>';
        card.classList.add('is-missing');
        card.disabled = true;
      });
    });
  }

  /* ---------- Work page ---------- */
  function workIndex(root) {
    var list = items();
    var counts = {};
    list.forEach(function (it) {
      if (it.prepare) return;
      it.types.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });
    var realTotal = list.filter(function (x) { return !x.prepare; }).length;
    var filters = '<div class="w-filters" role="group" aria-label="Filter work by type">' +
      '<button type="button" data-filter="all">All <span>' + realTotal + '</span></button>' +
      TYPES.filter(function (t) { return counts[t.id] || SHOW_DRAFTS; }).map(function (t) {
        return '<button type="button" data-filter="' + t.id + '">' + esc(t.label) + ' <span>' + (counts[t.id] || 0) + '</span></button>';
      }).join('') + '</div>';
    root.innerHTML = filters + '<div class="w-grid">' + list.map(cardHTML).join('') + '</div>' +
      '<p class="w-empty" hidden>Nothing here yet. More is on the way.</p>';
    wireSlots(root, list);

    var grid = root.querySelector('.w-grid');
    var empty = root.querySelector('.w-empty');
    function apply(type, push) {
      var shown = 0;
      grid.querySelectorAll('.w-card').forEach(function (c) {
        var on = type === 'all' || (' ' + c.getAttribute('data-types') + ' ').indexOf(' ' + type + ' ') > -1;
        c.hidden = !on;
        if (on) shown++;
      });
      empty.hidden = shown > 0;
      root.querySelectorAll('[data-filter]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-filter') === type ? 'true' : 'false');
      });
      if (push) {
        var url = type === 'all' ? location.pathname : location.pathname + '?type=' + type;
        history.replaceState(null, '', url);
      }
    }
    root.addEventListener('click', function (e) {
      var f = e.target.closest('[data-filter]');
      if (f) { apply(f.getAttribute('data-filter'), true); return; }
      var c = e.target.closest('[data-piece]');
      if (c && !c.classList.contains('is-missing')) openPiece(c.getAttribute('data-piece'));
    });
    var start = new URLSearchParams(location.search).get('type');
    apply(TYPES.some(function (t) { return t.id === start; }) ? start : 'all', false);
  }

  /* ---------- lightbox ---------- */
  var box = null, current = null;
  function openPiece(id) {
    var real = PIECES.filter(function (x) { return !x.prepare; });
    var p = real.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    current = p;
    if (!box) {
      box = document.createElement('div');
      box.className = 'w-box';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      document.body.appendChild(box);
      box.addEventListener('click', function (e) {
        if (e.target === box || e.target.closest('[data-close]')) closeBox();
        var nav = e.target.closest('[data-step]');
        if (nav) step(parseInt(nav.getAttribute('data-step'), 10));
      });
      document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeBox();
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      });
    }
    box.setAttribute('aria-label', p.title);
    box.innerHTML = '<div class="w-box-inner">' +
      '<div class="w-box-head">' +
        '<div><span class="w-type">' + esc(typeLabel(p.type)) + '</span>' +
        '<h2 class="w-box-title">' + esc(p.title) + '</h2>' +
        '<p class="w-box-meta">' + esc([p.label, p.year].filter(Boolean).join(' · ')) + '</p></div>' +
        '<div class="w-box-actions">' +
          '<button type="button" data-step="-1" aria-label="Previous piece">&larr;</button>' +
          '<button type="button" data-step="1" aria-label="Next piece">&rarr;</button>' +
          '<button type="button" data-close aria-label="Close">&times;</button>' +
        '</div>' +
      '</div>' +
      (p.caption ? '<p class="w-box-caption">' + esc(p.caption) + '</p>' : '') +
      (p.link ? '<p><a class="w-box-link" href="' + esc(p.link.href) + '">' + esc(p.link.text) + ' ' + arrow + '</a></p>' : '') +
      (p.images || []).map(function (src) { return '<img src="' + esc(src) + '" alt="' + esc(p.title) + '" decoding="async">'; }).join('') +
    '</div>';
    box.classList.add('is-open');
    box.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
    box.querySelector('[data-close]').focus();
  }
  function step(dir) {
    var real = PIECES.filter(function (x) { return !x.prepare; });
    var i = real.indexOf(current);
    openPiece(real[(i + dir + real.length) % real.length].id);
  }
  function closeBox() {
    box.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    if (window.lenis) window.lenis.start();
  }

  /* ---------- homepage: tiles per type ---------- */
  function typeTiles(root) {
    var list = items().filter(function (x) { return !x.prepare; });
    root.innerHTML = TYPES.map(function (t) {
      var of = list.filter(function (it) { return it.types.indexOf(t.id) > -1; });
      if (!of.length && !SHOW_DRAFTS) return '';
      var cover = of.filter(function (it) { return it.kind === 'piece'; })[0] || of[0];
      var count = of.length ? of.length + (of.length === 1 ? ' piece' : ' pieces') : 'Samples coming soon';
      return '<a class="w-tile' + (of.length ? '' : ' is-soon') + '" href="/portfolio?type=' + t.id + '">' +
        '<div class="w-media' + (cover && cover.fit === 'contain' ? ' is-contain' : '') + '">' +
          (cover ? '<img src="' + esc(cover.image) + '" alt="" loading="lazy"' + (cover.pos ? ' style="object-position:' + esc(cover.pos) + '"' : '') + '>' : '') +
        '</div>' +
        '<span class="w-tile-label">' + esc(t.label) + '</span>' +
        '<span class="w-meta">' + count + '</span>' +
      '</a>';
    }).join('');
  }

  /* ---------- homepage: case study cards ---------- */
  function caseCards(root) {
    var featured = PROJECTS.filter(function (p) { return p.featured; }).slice(0, parseInt(root.getAttribute('data-limit') || '3', 10));
    root.innerHTML = featured.map(function (p) {
      return '<a class="w-case" href="' + esc(p.link || ('/work?p=' + encodeURIComponent(p.slug))) + '">' +
        '<div class="w-media"><img src="' + esc(p.thumb) + '" alt="' + esc(p.title) + '" loading="lazy"' +
          ((p.thumbClass || '').indexOf('thumb-top') > -1 ? ' style="object-position:center top"' : '') + '></div>' +
        '<span class="w-type">' + esc((p.types || []).map(typeLabel).join(' · ')) + '</span>' +
        '<h3 class="w-title">' + esc(p.title) + '</h3>' +
        '<p class="w-desc">' + esc(p.tagline) + '</p>' +
        '<span class="w-more">Read the case study ' + arrow + '</span>' +
      '</a>';
    }).join('');
  }

  function init() {
    document.querySelectorAll('[data-work-index]').forEach(workIndex);
    document.querySelectorAll('[data-type-tiles]').forEach(typeTiles);
    document.querySelectorAll('[data-case-cards]').forEach(caseCards);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
