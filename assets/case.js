/* ===================================================================
   Case study renderer (v1, Oct 2026)
   A case study page is a shell (work/<slug>/index.html) with
   <main data-case="/content/cases/<slug>.json">. This file reads the
   JSON and builds the page from blocks.

   JSON shape
   ----------
   {
     "name":  "SoundLax app",                    shown in the section menu
     "theme": { "dark": "#060d27", "dark2": "#0d1736", "accent": "#f94e22" },
     "hero":  { "pill", "title", "intro", "links": [{text, href}], "image": IMAGE },
     "facts": [{ "k": "Role", "v": "…", "href": optional }],
     "sections": [{ "id", "nav", "tone": "dark" | "grey", "pill", "heading", "blocks": [BLOCK] }],
     "next":  { "title", "href" }
   }

   BLOCK types
   -----------
   text       { "p": ["…"], "heading": optional small label,
                "columns": 2 for two text columns on wide screens }
   statement  { "text" }                       big sentence in the heading font
   chips      { "items": ["…"] }                row of orange pills
   decision   { "num", "title", "p": [], "image": IMAGE, "flip": bool }
   image      IMAGE + { "title", "caption", "seamless": bool,
                "side": true puts it in the right column of a text run }
   bleed      { "src", "alt" }                  full-width photo between sections
   swatches   { "items": [{ "name", "hex" }] }
   quotes     { "items": [{ "text", "source", "stars": 5, "avatar", "name" }] }
   badge      { "href", "src", "alt", "text" }  (e.g. the App Store badge)
   stats      { "items": [{ "value", "label" }], "note" }
   list       { "items": ["…"], "heading": optional }
   gallery    { "items": [IMAGE + optional "label"], "cols": 2 | 3, "masonry": true, "title", "caption" }
              images side by side; one column on phones
   type       { "items": [TYPEFACE], "dark": bool }   font specimens, one card each
   TYPEFACE   { "name", "role", "sample", "chars": bool (show A–Z, a–z, 0–9),
                "family": CSS font-family name,
                "font": "/assets/type/cases/<file>.woff2"  loads the font
                        for this card only; until the file exists the card
                        says which file to add, rather than faking the look,
                "src", "alt", "prepare", "size": an SVG/PNG sample instead,
                        if the font can't be used on the web }

   IMAGE      { "src", "alt", "prepare", "size", "ratio", "video": bool }
   If "prepare" is set and the file at "src" doesn't exist yet, a
   placeholder box shows what to export. Export the file to that exact
   path and it replaces the placeholder automatically.

   Sections alternate "tone": "dark" and "grey". Two dark sections in a
   row get a hairline between them.
   Sections with "id" and "nav" appear in the floating section menu at
   the bottom of the screen, numbered in order.

   Image sizes (export at 2x, JPG quality 80, under 400 KB):
   hero          1200 x 1000  (6:5), a 600 x 500 frame at 2x; it sits beside
                 the headline on wide screens (column about 590 px wide)
   full width    2400 x 1350  (16:9), height can vary, width stays 2400
   decision      1600 x 1200  (4:3), same ratio for every decision
   bleed photo   2880 x 1440  (2:1), cropped to fit, keep the subject central
   video         1920 x 1080  MP4, muted, 15 s max, under 4 MB
   card thumb    2400 x 1500  (16:10), for assets/projects.js
   Export close-ups on the project's dark colour with at least 80 px of
   space around the subject, so they blend into the page.

   Inline markup in any text: [[words]] = orange highlight,
   {{words}} = a gap Ben still needs to fill.

   theme.highlight: "pill" (default, SoundLax) or "text" (bold coloured
   words, TEDx); theme.highlightColor sets the colour for "text".
   theme.eyebrow: "pill" (default) or "text" (plain uppercase labels
   above headings, in the highlight colour; TEDx).
   theme.accentInk: text colour on top of a light accent (Kmart mint):
   pills, chips and the active menu item use it, and accent-coloured
   labels on light sections switch to ink so they stay readable.
   theme.highlight "marker": highlighted words sit on the accent colour
   like a highlighter pen (works on light and dark sections).
   A run of text blocks that includes a statement is laid out in two
   columns on wide screens: paragraphs left, statement right, starting
   50–60 px lower (less on small screens) for an asymmetric look. Default for every case study.

   A swatches block followed by a type block (or the reverse) sits side
   by side on wide screens: colours left, typefaces right.

   The template is a starting point, not a fixed format. Each case study
   picks the sections, blocks and visual touches that suit its project:
   add or remove sections freely, and use [[highlights]] and chips only
   when they belong to that project's look (they come from SoundLax).
   With nothing project-specific, plain text is the default.
   =================================================================== */
(function () {
  var main = document.querySelector('[data-case], [data-case-project]');
  if (!main) return;

  var arrowRight = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var arrowLeft = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function rich(s) {
    /* arrays mix plain text and links: ["Live at ", {text, href}, "."] */
    if (Array.isArray(s)) {
      return s.map(function (part) {
        if (part && typeof part === 'object') return '<a href="' + esc(part.href) + '">' + esc(part.text || part.href) + '</a>';
        return rich(part);
      }).join('');
    }
    return esc(s)
      .replace(/\[\[(.+?)\]\]/g, '<mark class="c-hl">$1</mark>')
      .replace(/\{\{(.+?)\}\}/g, '<span class="c-todo">$1</span>');
  }
  /* decorative artwork in a section's corners (Robarica plants):
     "decor": [{ "src", "pos": "top-right" | "top-left" | "bottom-right" | "bottom-left",
                 "w": 280 (px at full size), "rot": 8, "x": -40, "y": 40 }] */
  function decorHTML(list) {
    return (list || []).map(function (d) {
      var pos = (d.pos || 'top-right').split('-');
      var st = '--w:' + (d.w || 260) + 'px;--rot:' + (d.rot || 0) + 'deg;' +
        pos[0] + ':' + (d.y != null ? d.y : 48) + 'px;' + pos[1] + ':' + (d.x != null ? d.x : -40) + 'px;';
      return '<span class="c-decor is-' + pos[1] + '" style="' + st + '" aria-hidden="true"><img src="' + esc(d.src) + '" alt="" loading="lazy" decoding="async"></span>';
    }).join('');
  }
  function wireDecor(scope) {
    var els = scope.querySelectorAll('.c-decor');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(function (e) { io.observe(e); });
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
      return '<div class="c-text' + (b.columns === 2 ? ' is-cols' : '') + '">' + (b.heading ? '<h3>' + esc(b.heading) + '</h3>' : '') + paras(b.p) + '</div>';
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
    type: function (b) {
      return '<div class="c-type' + (b.dark ? ' is-dark' : '') + '">' + (b.items || []).map(function (t) {
        var sample;
        if (t.src) {
          sample = media({ src: t.src, alt: t.alt || (t.name + ' sample'), prepare: t.prepare, size: t.size, ratio: t.ratio || '15/7' });
        } else {
          var ff = t.family ? ' style="font-family:\'' + esc(t.family) + '\',sans-serif"' : '';
          sample = '<div class="c-type-live"' + ff + '>' +
            '<p class="c-type-aa">Aa</p>' +
            (t.sample ? '<p class="c-type-line">' + esc(t.sample) + '</p>' : '') +
            (t.chars ? '<p class="c-type-chars">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 &amp;@!?</p>' : '') +
          '</div>';
        }
        var attrs = (t.font && t.family) ? ' data-font="' + esc(t.font) + '" data-family="' + esc(t.family) + '"' : '';
        return '<div class="c-type-card' + (attrs ? ' is-loading' : '') + '"' + attrs + '>' +
          (t.role ? '<p class="c-type-role">' + esc(t.role) + '</p>' : '') +
          '<div class="c-type-sample">' + sample + '</div>' +
          '<p class="c-type-name">' + esc(t.name) + '</p>' +
        '</div>';
      }).join('') + '</div>';
    },
    gallery: function (b) {
      var cols = b.cols || 2;
      return '<figure class="c-figure c-gallery" style="--cols:' + cols + '">' +
        (b.title ? '<p class="c-figure-title">' + esc(b.title) + '</p>' : '') +
        '<div class="c-gallery-grid' + (b.masonry ? ' is-masonry' : '') + '">' + (b.items || []).map(function (it) {
          return it.label ? '<div class="c-gallery-item">' + media(it) + '<span class="c-gallery-label">' + esc(it.label) + '</span></div>' : media(it);
        }).join('') + '</div>' +
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
        var stars = q.stars ? '<span class="c-quote-stars" role="img" aria-label="' + q.stars + ' out of 5 stars">' + new Array(q.stars + 1).join('\u2605') + '</span>' : '';
        var who = (q.avatar ? '<img class="c-quote-avatar" src="' + esc(q.avatar) + '" alt="" loading="lazy">' : '') +
          '<span class="c-quote-who">' + (q.name ? '<strong>' + esc(q.name) + '</strong>' : '') + '<cite>' + rich(q.source) + '</cite></span>';
        return '<blockquote class="c-quote">' + stars + '<p>' + rich(q.text) + '</p><footer class="c-quote-by">' + who + '</footer></blockquote>';
      }).join('') + '</div>';
    },
    badge: function (b) {
      return '<div class="c-badge">' + (b.text ? '<p>' + rich(b.text) + '</p>' : '') +
        '<a href="' + esc(b.href) + '" target="_blank" rel="noopener"><img src="' + esc(b.src) + '" alt="' + esc(b.alt) + '" height="56"></a></div>';
    },
    list: function (b) {
      return '<div class="c-text">' + (b.heading ? '<h3>' + esc(b.heading) + '</h3>' : '') +
        '<ul class="c-list">' + (b.items || []).map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul></div>';
    },
    stats: function (b) {
      return '<div class="c-stats">' + (b.items || []).map(function (s) {
        return '<div class="c-stat"><span class="c-stat-value">' + esc(s.value) + '</span><span class="c-stat-label">' + rich(s.label) + '</span></div>';
      }).join('') + (b.note ? '<p class="c-stats-note">' + rich(b.note) + '</p>' : '') + '</div>';
    }
  };

  /* Text runs that contain a statement use the empty space on the right:
     paragraphs on the left, the statement beside them. Everything else
     renders full width as before. On small screens it stacks in order. */
  var TEXTISH = { text: 1, chips: 1, list: 1, statement: 1 };
  function isSide(b) { return b.type === 'statement' || (b.type === 'image' && b.side); }
  function renderBlocks(list) {
    var out = '', run = [];
    function flush() {
      var side = run.filter(isSide);
      var main = run.filter(function (b) { return !isSide(b); });
      if (side.length && main.length) {
        /* paragraphs on the left; statements and side images stacked on the right */
        var html = '', row = 0, sideDone = false;
        run.forEach(function (b) {
          if (isSide(b)) {
            if (sideDone) return;
            sideDone = true;
            html += '<div class="c-split-side" style="--r:1 / span ' + main.length + '">' +
              side.map(function (x) { return blocks[x.type](x); }).join('') + '</div>';
          } else {
            row++;
            html += '<div class="c-split-main" style="--r:' + row + '">' + blocks[b.type](b) + '</div>';
          }
        });
        out += '<div class="c-split">' + html + '</div>';
      } else {
        run.forEach(function (b) { out += blocks[b.type](b); });
      }
      run = [];
    }
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      if (!blocks[b.type]) continue;
      if (TEXTISH[b.type] || (b.type === 'image' && b.side) || (b.type === 'gallery' && b.inline)) { run.push(b); continue; }
      flush();
      /* colours and type next to each other: shown side by side */
      var nx = list[i + 1];
      if (nx && ((b.type === 'swatches' && nx.type === 'type') || (b.type === 'type' && nx.type === 'swatches'))) {
        out += '<div class="c-pair">' + blocks[b.type](b) + blocks[nx.type](nx) + '</div>';
        i++;
        continue;
      }
      out += blocks[b.type](b);
    }
    flush();
    return out;
  }

  function render(d) {
    var t = d.theme || {};
    if (t.dark) document.body.style.setProperty('--h-navy', t.dark);
    if (t.dark2) document.body.style.setProperty('--h-navy-2', t.dark2);
    if (t.accent) document.body.style.setProperty('--c-accent', t.accent);
    /* highlight style per project: "pill" (SoundLax) or "text" (bold coloured words) */
    if (t.highlight === 'text') document.body.classList.add('hl-text');
    if (t.highlightColor) document.body.style.setProperty('--c-hl', t.highlightColor);
    /* light accents (e.g. mint) need dark text on pills, chips and markers */
    if (t.accentInk) { document.body.classList.add('accent-light'); document.body.style.setProperty('--c-accent-ink', t.accentInk); }
    if (t.highlight === 'marker') document.body.classList.add('hl-marker');
    /* eyebrow labels above headings: "pill" (default) or "text" (plain uppercase) */
    if (t.eyebrow === 'text') document.body.classList.add('eyebrow-text');

    var h = d.hero || {};
    var html = '';

    /* the list the visitor came from (homepage, /portfolio or /portfolio/all)
       decides "Next project" and where "All work" goes back to */
    var backHref = '/portfolio';
    try {
      var trail = JSON.parse(sessionStorage.getItem('bentoji_trail') || 'null');
      var slug = d.slug || location.pathname.split('/').filter(Boolean).pop();
      var at = trail && trail.items ? trail.items.map(function (x) { return x.slug; }).indexOf(slug) : -1;
      if (at > -1) {
        backHref = trail.back || backHref;
        if (trail.items.length > 1) d.next = trail.items[(at + 1) % trail.items.length];
      }
    } catch (e) {}

    /* hero: text and image side by side on wide screens (layout A), facts below */
    html += '<section class="h-dark c-hero' + (h.image ? ' has-media' : '') + '" id="top"><div class="container">' +
      '<div class="c-hero-grid"><div class="c-hero-text">' +
      '<a class="c-back" href="' + esc(backHref) + '">' + arrowLeft + 'All work</a>' +
      (h.pill ? '<p class="h-pill">' + esc(h.pill) + '</p>' : '') +
      '<h1 class="h-head">' + rich(h.title) + '</h1>' +
      (h.intro ? '<p class="h-lead">' + rich(h.intro) + '</p>' : '') +
      ((h.links || []).length ? '<div class="h-actions">' + h.links.map(function (l, i) {
        return '<a class="h-btn ' + (i ? 'h-btn-ghost' : 'h-btn-primary') + '" href="' + esc(l.href) + '">' + esc(l.text) + '</a>';
      }).join('') + '</div>' : '') +
      '</div>' +
      (h.image ? '<figure class="c-figure c-hero-media">' + media(h.image) + '</figure>' : '') +
      '</div>' +
      ((d.facts || []).length ? '<dl class="c-facts">' + d.facts.map(function (f) {
        var v = f.href ? '<a href="' + esc(f.href) + '">' + rich(f.v) + '</a>' : rich(f.v);
        return '<div class="c-fact"><dt>' + esc(f.k) + '</dt><dd>' + v + '</dd></div>';
      }).join('') + '</dl>' : '');
    html += '</div></section>';

    /* section menu: floating bar at the bottom, shown while reading */
    var navs = (d.sections || []).filter(function (s) { return s.nav && s.id; });
    if (navs.length) {
      html += '<nav class="c-subnav" data-adapt aria-label="Case study sections"><div class="c-subnav-inner">' +
        '<a class="c-subnav-name" href="#top">' + esc(d.name || '') + '</a>' +
        '<div class="c-subnav-links">' + navs.map(function (s, i) {
          return '<a href="#' + esc(s.id) + '" data-sub="' + esc(s.id) + '"><span>' + (i < 9 ? '0' : '') + (i + 1) + '</span>' + esc(s.nav) + '</a>';
        }).join('') + '</div></div></nav>';
    }

    /* sections */
    var navIndex = 0;
    (d.sections || []).forEach(function (s) {
      if (s.bleed) {
        /* "contain": a full-screen band with the image at its own size in the middle, for images too small to stretch */
        html += s.bleed.contain
          ? '<div class="c-bleed-wrap is-contain"><div class="container"><img class="c-bleed-inner" src="' + esc(s.bleed.src) + '" alt="' + esc(s.bleed.alt) + '" loading="lazy" decoding="async"></div></div>'
          : '<div class="c-bleed-wrap"><img class="c-bleed" src="' + esc(s.bleed.src) + '" alt="' + esc(s.bleed.alt) + '" loading="lazy" decoding="async"></div>';
        return;
      }
      html += '<section class="h-section c-section h-' + (s.tone === 'grey' ? 'grey' : 'dark') + '"' + (s.id ? ' id="' + esc(s.id) + '"' : '') + '><div class="container">' +
        (s.pill ? '<p class="h-pill">' + (s.nav && s.id ? '<span class="c-pill-num">' + (++navIndex < 10 ? '0' : '') + navIndex + '</span> ' : '') + esc(s.pill) + '</p>' : '') +
        (s.heading ? '<h2 class="h-head h-title' + (s.tone === 'grey' ? ' is-orange' : '') + '">' + rich(s.heading) + '</h2>' : '') +
        '<div class="c-blocks">' + renderBlocks(s.blocks || []) + '</div>' +
      '</div>' + decorHTML(s.decor) + '</section>';
    });

    /* next project */
    if (d.next) {
      html += '<a class="h-dark c-next" href="' + esc(d.next.href) + '"><div class="container">' +
        '<p class="h-pill">Next project</p><p class="h-head">' + esc(d.next.title) + arrowRight + '</p></div></a>';
    }

    main.innerHTML = html;

    /* fade content in as it scrolls into view (site.js); the whole page is
       rescanned because the close section only moves below the fold now */
    if (window.bentojiReveal) requestAnimationFrame(function () { window.bentojiReveal(document); });
    wireDecor(document);

    /* type specimens: load each font file just for its card */
    main.querySelectorAll('.c-type-card[data-font]').forEach(function (card) {
      var src = card.getAttribute('data-font'), fam = card.getAttribute('data-family');
      function missing() {
        card.classList.remove('is-loading');
        card.querySelector('.c-type-sample').innerHTML =
          '<div class="c-ph" style="--ratio:15/7"><span class="c-ph-tag">Font file to add</span>' +
          '<p class="c-ph-file">' + esc(src) + '</p></div>';
      }
      if (!('FontFace' in window)) return missing();
      new FontFace(fam, 'url(' + src + ')').load().then(function (f) {
        document.fonts.add(f);
        card.classList.remove('is-loading');
      }, missing);
    });

    /* missing prepared images fall back to the placeholder */
    main.querySelectorAll('.c-media[data-prepare="1"] img, .c-media[data-prepare="1"] video').forEach(function (el) {
      el.addEventListener('error', function () {
        var item = findImage(d, el.getAttribute('src'));
        if (item) el.closest('.c-media').outerHTML = placeholder(item);
      });
    });

    setupSubnav();

    if (location.hash) {
      var target = document.querySelector(location.hash);
      if (target) setTimeout(function () { scrollToEl(target, false); }, 60);
    }
  }

  /* ---------- section menu ---------- */
  function offset() {
    var nav = document.querySelector('.site-nav');
    return nav ? nav.offsetHeight : 0;
  }
  function scrollToEl(el, smooth) {
    var top = el.id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - offset() + 1;
    if (window.lenis && smooth !== false) window.lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top: top, behavior: smooth === false ? 'auto' : 'smooth' });
  }
  function setupSubnav() {
    var sub = main.querySelector('.c-subnav');
    if (!sub) return;
    var links = Array.prototype.slice.call(sub.querySelectorAll('a[href^="#"]'));

    sub.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      scrollToEl(el);
      history.replaceState(null, '', a.getAttribute('href') === '#top' ? location.pathname : a.getAttribute('href'));
    });

    /* highlight the section being read, and keep its link in view on mobile */
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute('data-sub')); }).filter(Boolean);
    var linkBox = sub.querySelector('.c-subnav-links');
    function update() {
      var line = offset() + window.innerHeight * 0.25;
      var current = null;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s.id; });
      links.forEach(function (a) {
        var on = a.getAttribute('data-sub') === current;
        if (on && !a.classList.contains('is-active') && linkBox.scrollWidth > linkBox.clientWidth) {
          linkBox.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' });
        }
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      /* show after the hero, hide again at the end of the case study */
      var hero = main.querySelector('.c-hero');
      var end = main.querySelector('.c-next');
      var pastHero = hero && hero.getBoundingClientRect().bottom < window.innerHeight * 0.5;
      var atEnd = end && end.getBoundingClientRect().top < window.innerHeight * 0.85;
      sub.classList.toggle('is-visible', !!(pastHero && !atEnd));
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function findImage(d, src) {
    var found = null;
    function check(o) { if (o && o.src === src) found = o; }
    check(d.hero && d.hero.image);
    (d.sections || []).forEach(function (s) {
      (s.blocks || []).forEach(function (b) { check(b); check(b.image); (b.items || []).forEach(check); });
    });
    return found;
  }

  /* ---------- older projects: build the page from assets/projects.js ---------- */
  function slugify(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function fromProject() {
    var all = window.PROJECTS || [];
    var slug = new URLSearchParams(location.search).get('p');
    if (!slug) {
      var parts = location.pathname.replace(/\/+$/, '').split('/');
      slug = parts[1] === 'work' && parts[2] ? decodeURIComponent(parts[2]) : '';
    }
    var p = all.filter(function (x) { return x.slug === slug; })[0];
    if (!p) { location.replace('/portfolio'); return null; }
    /* projects with their own page go there */
    if (p.link && p.link.replace(/\/+$/, '') !== location.pathname.replace(/\/+$/, '')) { location.replace(p.link); return null; }
    document.title = p.title + ' | Bentoji, Ben Nguyen';

    var sections = [], cur = null;
    function push(block) {
      if (!cur) { cur = { blocks: [] }; sections.push(cur); }
      cur.blocks.push(block);
    }
    (p.body || []).forEach(function (b) {
      if (b.h) {
        if (cur && !cur.blocks.length) { push({ type: 'text', heading: b.h, p: [] }); return; }
        cur = { id: slugify(b.h), nav: b.h, heading: b.h, blocks: [] };
        sections.push(cur);
      } else if (b.p) {
        var last = cur && cur.blocks[cur.blocks.length - 1];
        if (last && last.type === 'text') last.p.push(b.p);
        else push({ type: 'text', p: [b.p] });
      } else if (b.list) {
        push({ type: 'list', items: b.list });
      } else if (b.image) {
        push({ type: 'image', src: b.image.src, alt: b.image.alt || p.title });
      }
    });
    var used = {};
    sections.forEach(function (s) { s.blocks.forEach(function (b) { if (b.src) used[b.src] = 1; }); });
    var gallery = (p.gallery || []).filter(function (g) { return !used[typeof g === 'string' ? g : g.src]; });
    if (gallery.length) {
      sections.push({ id: 'screens', nav: 'Screens', heading: 'Screens', blocks: gallery.map(function (g) {
        return { type: 'image', src: typeof g === 'string' ? g : g.src, alt: (g && g.alt) || p.title };
      }) });
    }
    sections.forEach(function (s, i) { s.tone = i % 2 ? 'dark' : 'grey'; });

    var visible = all.filter(function (x) { return !x.hidden; });
    /* while the showcase list is set, its case studies link to each other in that order */
    if (window.SHOWCASE && window.SHOWCASE.indexOf(p.slug) > -1) {
      visible = window.SHOWCASE.map(function (s) { return all.filter(function (x) { return x.slug === s; })[0]; }).filter(Boolean);
    }
    var idx = visible.indexOf(p);
    var next = visible[(idx + 1) % visible.length];
    var facts = (p.facts || []).map(function (f) { return { k: f.k, v: f.v }; });
    if (p.year) facts.push({ k: 'Year', v: p.year });
    return {
      name: p.title,
      hero: {
        pill: p.category, title: p.title, intro: p.tagline,
        links: p.visit ? [{ text: 'Visit the live site', href: p.visit }] : [],
        image: (p.cover || p.thumb) ? { src: p.cover || p.thumb, alt: p.title } : null
      },
      facts: facts,
      sections: sections,
      next: next && next !== p ? { title: next.title, href: next.link || ('/work?p=' + encodeURIComponent(next.slug)) } : null
    };
  }

  if (main.hasAttribute('data-case-project')) {
    var built = fromProject();
    if (built) render(built);
    return;
  }

  fetch(main.getAttribute('data-case'))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () {
      main.innerHTML = '<section class="h-dark c-hero"><div class="container"><p class="h-lead">This case study could not load. <a class="h-link" href="/portfolio">Back to all work</a></p></div></section>';
    });
})();
