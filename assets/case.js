/* ===================================================================
   Case study renderer (v1, Oct 2026)
   A case study page is a shell (work/<slug>/index.html) with
   <main data-case="/content/cases/<slug>.json">. This file reads the
   JSON and builds the page from blocks.

   JSON shape
   ----------
   {
     "theme": { "dark": "#060d27", "dark2": "#0d1736", "accent": "#f94e22" },
     "hero":  { "pill", "title", "intro", "links": [{text, href}], "image": IMAGE },
     "facts": [{ "k": "Role", "v": "…", "href": optional }],
     "sections": [{ "id", "nav", "tone": "dark" | "grey", "pill", "heading", "blocks": [BLOCK] }],
     "next":  { "title", "href" }
   }

   BLOCK types
   -----------
   text       { "p": ["…"], "heading": optional small label }
   statement  { "text" }                       big sentence in the heading font
   chips      { "items": ["…"] }                row of orange pills
   decision   { "num", "title", "p": [], "image": IMAGE, "flip": bool }
   image      IMAGE + { "title", "caption", "seamless": bool }
   bleed      { "src", "alt" }                  full-width photo between sections
   swatches   { "items": [{ "name", "hex" }] }
   quotes     { "items": [{ "text", "source" }] }
   stats      { "items": [{ "value", "label" }], "note" }

   IMAGE      { "src", "alt", "prepare", "size", "ratio", "video": bool }
   If "prepare" is set and the file at "src" doesn't exist yet, a
   placeholder box shows what to export. Export the file to that exact
   path and it replaces the placeholder automatically.

   Inline markup in any text: [[words]] = orange highlight (use once
   per section at most), {{words}} = a gap Ben still needs to fill.
   =================================================================== */
(function () {
  var main = document.querySelector('[data-case]');
  if (!main) return;

  var arrowRight = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var arrowLeft = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function rich(s) {
    return esc(s)
      .replace(/\[\[(.+?)\]\]/g, '<mark class="c-hl">$1</mark>')
      .replace(/\{\{(.+?)\}\}/g, '<span class="c-todo">$1</span>');
  }
  function paras(list) {
    return (list || []).map(function (p) { return '<p>' + rich(p) + '</p>'; }).join('');
  }

  function placeholder(img) {
    var ratio = img.ratio ? ' style="--ratio:' + esc(img.ratio) + '"' : '';
    return '<div class="c-ph"' + ratio + '>' +
      '<span class="c-ph-tag">Image to prepare</span>' +
      '<p class="c-ph-text">' + rich(img.prepare || 'Image missing') + '</p>' +
      '<p class="c-ph-file">' + esc(img.src || '') + (img.size ? ' · ' + esc(img.size) : '') + '</p>' +
    '</div>';
  }
  function media(img) {
    if (!img) return '';
    if (!img.src) return placeholder(img);
    var tag = img.video
      ? '<video src="' + esc(img.src) + '" autoplay muted loop playsinline aria-label="' + esc(img.alt) + '"></video>'
      : '<img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '" loading="lazy" decoding="async">';
    return '<div class="c-media" data-prepare="' + (img.prepare ? '1' : '') + '">' + tag + '</div>';
  }

  var blocks = {
    text: function (b) {
      return '<div class="c-text">' + (b.heading ? '<h3>' + esc(b.heading) + '</h3>' : '') + paras(b.p) + '</div>';
    },
    statement: function (b) { return '<p class="c-statement">' + rich(b.text) + '</p>'; },
    chips: function (b) {
      return '<ul class="c-chips">' + (b.items || []).map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul>';
    },
    decision: function (b) {
      return '<div class="c-decision' + (b.flip ? ' is-flip' : '') + '">' +
        '<div class="c-decision-text"><span class="c-num">' + esc(b.num) + '</span><h3>' + rich(b.title) + '</h3>' +
          '<div class="c-text">' + paras(b.p) + '</div></div>' +
        '<figure class="c-figure">' + media(b.image) +
          (b.image && b.image.caption ? '<figcaption>' + rich(b.image.caption) + '</figcaption>' : '') + '</figure>' +
      '</div>';
    },
    image: function (b) {
      return '<figure class="c-figure' + (b.seamless ? ' is-seamless' : '') + '">' +
        (b.title ? '<p class="c-figure-title">' + esc(b.title) + '</p>' : '') +
        media(b) +
        (b.caption ? '<figcaption>' + rich(b.caption) + '</figcaption>' : '') +
      '</figure>';
    },
    swatches: function (b) {
      return '<div class="c-swatches">' + (b.items || []).map(function (s) {
        return '<div><div class="c-swatch-chip" style="background:' + esc(s.hex) + '"></div>' +
          '<p class="c-swatch-name">' + esc(s.name) + '</p><p class="c-swatch-hex">' + esc(s.hex) + '</p></div>';
      }).join('') + '</div>';
    },
    quotes: function (b) {
      return '<div class="c-quotes">' + (b.items || []).map(function (q) {
        return '<blockquote class="c-quote"><p>' + rich(q.text) + '</p><cite>' + rich(q.source) + '</cite></blockquote>';
      }).join('') + '</div>';
    },
    stats: function (b) {
      return '<div class="c-stats">' + (b.items || []).map(function (s) {
        return '<div class="c-stat"><span class="c-stat-value">' + esc(s.value) + '</span><span class="c-stat-label">' + rich(s.label) + '</span></div>';
      }).join('') + (b.note ? '<p class="c-stats-note">' + rich(b.note) + '</p>' : '') + '</div>';
    }
  };

  function render(d) {
    var t = d.theme || {};
    if (t.dark) document.body.style.setProperty('--h-navy', t.dark);
    if (t.dark2) document.body.style.setProperty('--h-navy-2', t.dark2);
    if (t.accent) document.body.style.setProperty('--c-accent', t.accent);

    var h = d.hero || {};
    var html = '';

    /* hero + facts + jump links */
    html += '<section class="h-dark c-hero"><div class="container">' +
      '<a class="c-back" href="/portfolio">' + arrowLeft + 'All work</a><br>' +
      (h.pill ? '<p class="h-pill">' + esc(h.pill) + '</p>' : '') +
      '<h1 class="h-head">' + rich(h.title) + '</h1>' +
      (h.intro ? '<p class="h-lead">' + rich(h.intro) + '</p>' : '') +
      ((h.links || []).length ? '<div class="h-actions">' + h.links.map(function (l, i) {
        return '<a class="h-btn ' + (i ? 'h-btn-ghost' : 'h-btn-primary') + '" href="' + esc(l.href) + '">' + esc(l.text) + '</a>';
      }).join('') + '</div>' : '') +
      (h.image ? '<figure class="c-figure c-hero-media">' + media(h.image) + '</figure>' : '') +
      ((d.facts || []).length ? '<dl class="c-facts">' + d.facts.map(function (f) {
        var v = f.href ? '<a href="' + esc(f.href) + '">' + rich(f.v) + '</a>' : rich(f.v);
        return '<div class="c-fact"><dt>' + esc(f.k) + '</dt><dd>' + v + '</dd></div>';
      }).join('') + '</dl>' : '');
    var navs = (d.sections || []).filter(function (s) { return s.nav && s.id; });
    html += (navs.length ? '<nav class="c-jump" aria-label="Sections">' + navs.map(function (s) {
      return '<a href="#' + esc(s.id) + '">' + esc(s.nav) + '</a>';
    }).join('') + '</nav>' : '<div class="c-jump"></div>');
    html += '</div></section>';

    /* sections */
    (d.sections || []).forEach(function (s) {
      if (s.bleed) {
        html += '<div class="c-bleed-wrap"><img class="c-bleed" src="' + esc(s.bleed.src) + '" alt="' + esc(s.bleed.alt) + '" loading="lazy" decoding="async"></div>';
        return;
      }
      html += '<section class="h-section c-section h-' + (s.tone === 'grey' ? 'grey' : 'dark') + '"' + (s.id ? ' id="' + esc(s.id) + '"' : '') + '><div class="container">' +
        (s.pill ? '<p class="h-pill">' + esc(s.pill) + '</p>' : '') +
        (s.heading ? '<h2 class="h-head h-title' + (s.tone === 'grey' ? ' is-orange' : '') + '">' + rich(s.heading) + '</h2>' : '') +
        '<div class="c-blocks">' + (s.blocks || []).map(function (b) {
          var fn = blocks[b.type];
          return fn ? fn(b) : '';
        }).join('') + '</div>' +
      '</div></section>';
    });

    /* next project */
    if (d.next) {
      html += '<a class="h-dark c-next" href="' + esc(d.next.href) + '"><div class="container">' +
        '<p class="h-pill">Next project</p><p class="h-head">' + esc(d.next.title) + arrowRight + '</p></div></a>';
    }

    main.innerHTML = html;

    /* missing prepared images fall back to the placeholder */
    main.querySelectorAll('.c-media[data-prepare="1"] img, .c-media[data-prepare="1"] video').forEach(function (el) {
      el.addEventListener('error', function () {
        var item = findImage(d, el.getAttribute('src'));
        if (item) el.closest('.c-media').outerHTML = placeholder(item);
      });
    });

    if (location.hash) {
      var target = document.querySelector(location.hash);
      if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
    }
  }

  function findImage(d, src) {
    var found = null;
    function check(o) { if (o && o.src === src) found = o; }
    check(d.hero && d.hero.image);
    (d.sections || []).forEach(function (s) {
      (s.blocks || []).forEach(function (b) { check(b); check(b.image); });
    });
    return found;
  }

  fetch(main.getAttribute('data-case'))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () {
      main.innerHTML = '<section class="h-dark c-hero"><div class="container"><p class="h-lead">This case study could not load. <a class="h-link" href="/portfolio">Back to all work</a></p></div></section>';
    });
})();
