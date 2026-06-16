// SoundLax landing page — interactions

document.addEventListener('DOMContentLoaded', function () {

  /* mobile slide-out menu */
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

  /* scroll reveal */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          setTimeout(function () { el.classList.add('in'); }, i * 120);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* trigger hero reveal on load */
  setTimeout(function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el) { el.classList.add('in'); });
  }, 150);

  /* FAQ — accordion: only one open at a time */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* newsletter form (front-end only) */
  var form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type=email]');
      if (!email.value || email.value.indexOf('@') === -1) {
        email.focus();
        return;
      }
      var note = document.getElementById('formNote');
      if (note) note.hidden = false;
      form.querySelector('button').textContent = 'Joined';
    });
  }

});
