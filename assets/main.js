// SoundLax landing page — interactions

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
      smoothWheel: true,
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
     Scroll reveal — animate once, then stop
  ------------------------------------------------- */
  // auto-tag elements that should reveal on scroll
  var revealSelectors = [
    '.section-head', '.meet-copy', '.meet-media', '.diff-media',
    '.feature-media', '.testi', '.support-copy', '.support-media',
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
          io.unobserve(e.target); // reveal once, then stop
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    // gentle stagger for grouped items
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* hero reveal on load */
  setTimeout(function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el) { el.classList.add('in'); });
  }, 150);

  /* -------------------------------------------------
     FAQ accordion — one open at a time
  ------------------------------------------------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) { if (other !== item) other.open = false; });
      }
    });
  });

  /* -------------------------------------------------
     Newsletter form (front-end only)
  ------------------------------------------------- */
  var form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type=email]');
      if (!email.value || email.value.indexOf('@') === -1) { email.focus(); return; }
      var note = document.getElementById('formNote');
      if (note) note.hidden = false;
      form.querySelector('button').textContent = 'Joined';
    });
  }

});
