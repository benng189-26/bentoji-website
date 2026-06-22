// SoundLax landing page - interactions

document.addEventListener('DOMContentLoaded', function () {

  /* -------------------------------------------------
     Apple-style smooth scrolling (Lenis)
  ------------------------------------------------- */
  var lenis = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: false,
      touchMultiplier: 1.4
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* smooth scroll for in-page anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var hash = a.getAttribute('href');
    if (hash === '#' || hash.length < 2) return;
    a.addEventListener('click', function (e) {
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* -------------------------------------------------
     Open external links in a new tab
  ------------------------------------------------- */
  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var isExternal = /^https?:\/\//i.test(href) || /^mailto:/i.test(href);
    if (isExternal) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });

  /* -------------------------------------------------
     Mobile slide-out menu
  ------------------------------------------------- */
  var toggle = document.getElementById('menuToggle');
  var slideout = document.getElementById('slideout');
  var closeBtn = document.getElementById('slideoutClose');

  function openMenu() {
    slideout.classList.add('open');
    slideout.setAttribute('aria-hidden', 'false');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    slideout.classList.remove('open');
    slideout.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (slideout) {
    slideout.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* -------------------------------------------------
     Scroll reveal - animate once, then stop
  ------------------------------------------------- */
  var revealSelectors = [
    '.section-head', '.meet-copy', '.meet-media', '.diff-media',
    '.feature-media', '.support-copy', '.support-media',
    '.rain-inner', '.newsletter-inner', '.cta-inner', '.faq-list', '.footer-grid'
  ];
  revealSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add('reveal'); });
  });

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* hero reveal on load */
  setTimeout(function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el) { el.classList.add('in'); });
  }, 150);

  /* -------------------------------------------------
     Newsletter form (front-end only)
  ------------------------------------------------- */
  var form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type=email]');
      var note  = document.getElementById('formNote');
      var btn   = form.querySelector('button[type=submit]') || form.querySelector('button');
      if (!email.value || email.value.indexOf('@') === -1) { email.focus(); return; }

      var data = Object.fromEntries(new FormData(form).entries());
      if (data.botcheck) return; // honeypot tripped
      // record checkbox preferences clearly in the email
      var upd = form.querySelector('input[name=updates]');
      var pro = form.querySelector('input[name=promos]');
      data.updates = upd && upd.checked ? 'Yes' : 'No';
      data.promos  = pro && pro.checked ? 'Yes' : 'No';

      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Joining\u2026'; }
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res.success) {
          if (note) { note.hidden = false; note.className = 'form-note ok'; note.textContent = "Thanks \u2013 you're on the list."; }
          form.reset();
          if (btn) { btn.textContent = 'Joined'; }
        } else { throw new Error(res.message || 'failed'); }
      }).catch(function () {
        if (note) { note.hidden = false; note.className = 'form-note err'; note.textContent = 'Something went wrong. Please email soundlax.studio@gmail.com.'; }
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Join'; }
      });
    });
  }

});

/* ═══════════════════════════════════════════════════════
   Premium: nav frost + Rain Museum waveform + content loading
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Nav: deepen backdrop on scroll ── */
  var header = document.querySelector('.site-header');
  if (header) {
    var _navTick = false;
    window.addEventListener('scroll', function () {
      if (!_navTick) {
        requestAnimationFrame(function () {
          header.classList.toggle('scrolled', window.scrollY > 56);
          _navTick = false;
        });
        _navTick = true;
      }
    }, { passive: true });
  }

  /* ── Rain Museum: animated waveform ── */
  (function () {
    var canvas = document.getElementById('waveform');
    if (!canvas || !canvas.getContext) return;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var BAR_COUNT = 60;
    var GAP = 3;

    var bars = Array.from({ length: BAR_COUNT }, function (_, i) {
      var dist = Math.abs(i / (BAR_COUNT - 1) - 0.5);
      return {
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.85,
        base:  0.14 + (1 - dist * 1.6) * 0.52
      };
    });

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var t = 0;
    var running = false;

    function draw() {
      var w = canvas.offsetWidth;
      var h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      var barW = Math.max(2, (w - (BAR_COUNT - 1) * GAP) / BAR_COUNT);
      bars.forEach(function (bar, i) {
        var wave   = Math.sin(bar.phase + t * bar.speed);
        var height = Math.max(4, bar.base * h * (0.44 + 0.56 * ((wave + 1) / 2)));
        var x = i * (barW + GAP);
        var y = (h - height) / 2;
        var alpha = 0.18 + bar.base * 0.52;
        ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
        var r = Math.min(barW / 2, 3.5);
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barW, height, r);
        } else {
          ctx.rect(x, y, barW, height);
        }
        ctx.fill();
      });
      t += 0.016;
      requestAnimationFrame(draw);
    }

    if ('IntersectionObserver' in window) {
      var wObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !running) { running = true; draw(); }
        });
      }, { threshold: 0.1 });
      wObs.observe(canvas);
    } else {
      running = true; draw();
    }
  })();

  /* ── Hero video: fade in only when frames are ready ── */
  (function () {
    var hv = document.querySelector('video.hero-video');
    if (!hv) return;
    function tryPlay() {
      hv.play().then(function () {
        hv.classList.add('playing');
      }).catch(function () {});
    }
    hv.addEventListener('canplay', tryPlay);
    hv.addEventListener('canplaythrough', tryPlay);
    document.addEventListener('click', tryPlay, { once: true });
  })();

  /* ── Rain Museum: cycling tag highlight ── */
  (function () {
    var tags = Array.from(document.querySelectorAll('.rain-tag'));
    if (!tags.length) return;
    var idx = 0;
    function nextTag() {
      tags.forEach(function (t) { t.classList.remove('active'); });
      tags[idx].classList.add('active');
      idx = (idx + 1) % tags.length;
    }
    nextTag();
    setInterval(nextTag, 1800);
  })();

  /* -------------------------------------------------
     CMS content loading helpers
  ------------------------------------------------- */

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Testimonials carousel ── */
  function initCarousel() {
    var track    = document.getElementById('testiTrack');
    var carousel = document.getElementById('testiCarousel');
    var dots     = document.querySelectorAll('.testi-dot');
    if (!track || !dots.length) return;

    var current  = 0;
    var total    = dots.length;
    var autoTimer;

    // Centre the active slide in the viewport so the previous/next cards
    // peek in on either side (they're dimmed + edge-faded via CSS).
    function center(i) {
      var slides = track.children;
      if (!slides.length) return;
      var slide = slides[i];
      var cw = carousel.getBoundingClientRect().width;
      var sw = slide.getBoundingClientRect().width;
      var offset = slide.offsetLeft - (cw - sw) / 2;
      track.style.transform = 'translateX(' + (-offset) + 'px)';
      for (var k = 0; k < slides.length; k++) {
        slides[k].classList.toggle('is-active', k === i);
      }
    }
    function goTo(n) {
      current = ((n % total) + total) % total;
      center(current);
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
      updateBtns();
    }
    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { goTo(current + 1); }, 5500);
    }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    function updateBtns() {
      var prevBtn = document.getElementById('testiPrev');
      var nextBtn = document.getElementById('testiNext');
      if (prevBtn) prevBtn.disabled = (current === 0);
      if (nextBtn) nextBtn.disabled = (current === total - 1);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () { goTo(+this.dataset.page); resetAuto(); });
    });

    var startX = 0;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; clearInterval(autoTimer); }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); }
      startAuto();
    }, { passive: true });

    if (carousel) {
      carousel.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
      carousel.addEventListener('mouseleave', startAuto);
    }

    var prevBtn = document.getElementById('testiPrev');
    var nextBtn = document.getElementById('testiNext');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

    // keep the active slide centred when the viewport changes
    window.addEventListener('resize', function () { center(current); }, { passive: true });

    requestAnimationFrame(function () { goTo(0); });
    startAuto();
  }

  function initReadMore() {
    document.querySelectorAll('.testi-more').forEach(function (btn) {
      var body = btn.previousElementSibling;
      if (!body) return;
      var expanded = false;
      btn.addEventListener('click', function () {
        expanded = !expanded;
        body.classList.toggle('expanded', expanded);
        btn.textContent = expanded ? 'Read less' : 'Read more';
      });
      // Decide whether the button is needed AFTER layout + web fonts settle.
      // (Measuring too early — before fonts load or while the card width is
      // still changing — was hiding the button on long entries like the
      // Japanese review.)
      function measure() {
        if (expanded) return; // never hide while expanded
        var overflowing = body.scrollHeight > body.clientHeight + 4;
        btn.classList.toggle('hidden', !overflowing);
      }
      measure();
      requestAnimationFrame(measure);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { requestAnimationFrame(measure); });
      }
      window.addEventListener('resize', function () { requestAnimationFrame(measure); }, { passive: true });
    });
  }

  function renderTestimonials(data) {
    var track = document.getElementById('testiTrack');
    var dotsEl = document.getElementById('testiDots');
    if (!track || !dotsEl) return;

    // One testimonial per slide: each review is its own fixed-width card.
    // Adding more reviews to testimonials.json automatically adds more slides + dots.
    var reviews = data.reviews || [];

    track.innerHTML = reviews.map(function (r) {
      return '<div class="testi-page">' +
        '<blockquote class="testi">' +
          '<div class="testi-stars">★★★★★</div>' +
          '<h4 class="testi-title">' + escHtml(r.title) + '</h4>' +
          '<div class="testi-body"><p>' + escHtml(r.body) + '</p></div>' +
          '<button class="testi-more" aria-label="Read more">Read more</button>' +
          '<footer>' +
            '<span class="name">' + escHtml(r.name) + '</span>' +
            '<span class="role">' + escHtml(r.date) + ' · ' + escHtml(r.country) + '</span>' +
          '</footer>' +
        '</blockquote>' +
      '</div>';
    }).join('');

    dotsEl.innerHTML = reviews.map(function (_, i) {
      return '<button class="testi-dot' + (i === 0 ? ' active' : '') +
        '" data-page="' + i + '" aria-label="Review ' + (i + 1) + '"></button>';
    }).join('');

    initCarousel();
    initReadMore();
  }

  /* ── FAQ accordion ── */
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');

    function closeItem(it) {
      var b = it.querySelector('.faq-body');
      if (!b) return;
      b.style.maxHeight = b.scrollHeight + 'px';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          b.style.maxHeight = '0';
          it.classList.remove('is-open');
        });
      });
      setTimeout(function () { it.open = false; }, 390);
    }

    function openItem(it) {
      var b = it.querySelector('.faq-body');
      if (!b) return;
      it.open = true;
      b.style.maxHeight = '0';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          it.classList.add('is-open');
          b.style.maxHeight = (b.scrollHeight + 30) + 'px';
        });
      });
    }

    faqItems.forEach(function (item) {
      var summary = item.querySelector('summary');
      if (!summary) return;
      item.open = false;
      summary.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = item.classList.contains('is-open');
        faqItems.forEach(function (other) {
          if (other !== item && other.classList.contains('is-open')) closeItem(other);
        });
        if (isOpen) { closeItem(item); } else { openItem(item); }
      });
    });
  }

  function renderFAQ(data) {
    var list = document.getElementById('faqList');
    if (!list) return;
    list.innerHTML = (data.items || []).map(function (item) {
      return '<details class="faq-item">' +
        '<summary>' + escHtml(item.question) + '</summary>' +
        '<div class="faq-body">' + item.answer + '</div>' +
        '</details>';
    }).join('');
    initFAQ();
  }

  /* ── Fetch and render CMS content ── */
  var track = document.getElementById('testiTrack');
  if (track) {
    fetch('/content/testimonials.json')
      .then(function (r) { return r.json(); })
      .then(renderTestimonials)
      .catch(function () { initCarousel(); initReadMore(); });
  }

  var faqList = document.getElementById('faqList');
  if (faqList) {
    fetch('/content/faq.json')
      .then(function (r) { return r.json(); })
      .then(renderFAQ)
      .catch(function () { initFAQ(); });
  }

  /* section-by-section scroll handled by CSS scroll-snap */

});
