/* Marsive GreenCare East Africa - main.js
   Same behaviour as before, but safe on every page (no crashes when an
   element is missing), with the commented-out Supabase code removed. */
(function () {
  'use strict';

  var FORMSPREE_URL = 'https://formspree.io/f/xykavwlo';
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Mobile navigation ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  var closeMenu = document.getElementById('closeMenu');
  var bookBtn = document.getElementById('bookBtn');

  function setMenu(open) {
    if (!navLinks) return;
    navLinks.classList.toggle('active', open);
    if (hamburger) hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!navLinks.classList.contains('active'));
    });
    hamburger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMenu(!navLinks.classList.contains('active'));
      }
    });
    document.addEventListener('click', function (e) {
      if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        e.target !== hamburger &&
        !hamburger.contains(e.target)
      ) {
        setMenu(false);
      }
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }
  if (closeMenu) closeMenu.addEventListener('click', function () { setMenu(false); });
  if (bookBtn) bookBtn.addEventListener('click', function () { setMenu(false); });

  /* ---------- Welcome section: fade-up with stagger ---------- */
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.service-box1'));
  if (boxes.length) {
    if (hasIO) {
      var boxObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = boxes.indexOf(entry.target) * 200;
            setTimeout(function () { entry.target.classList.add('visible'); }, delay);
            boxObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      boxes.forEach(function (box) { boxObserver.observe(box); });
    } else {
      boxes.forEach(function (box) { box.classList.add('visible'); });
    }
  }

  /* ---------- Hero animation ---------- */
  var heroText = document.querySelector('.hero-text');
  if (heroText) {
    if (hasIO) {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            heroText.classList.add('visible');
            heroObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      heroObserver.observe(heroText);
    } else {
      heroText.classList.add('visible');
    }
  }

  /* ---------- services.html: fade-in for .service-part blocks ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var serviceSection = document.querySelector('.services-section');
    if (!serviceSection) return;
    var parts = serviceSection.querySelectorAll('.service-part');
    if (!parts.length) return;

    if (!hasIO) {
      parts.forEach(function (p) { p.classList.add('fade-in'); });
      return;
    }
    setTimeout(function () { parts[0].classList.add('fade-in'); }, 300);
    var partObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (index * 0.25) + 's';
          entry.target.classList.add('fade-in');
          partObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    parts.forEach(function (p) { partObserver.observe(p); });
  });

  /* ---------- Forms (all sent to Formspree) ---------- */
  function wireForm(form, opts) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(form);

      for (var i = 0; i < opts.required.length; i++) {
        if (!formData.get(opts.required[i])) {
          alert('⚠️ Please fill in all required fields.');
          return;
        }
      }
      if (opts.validate && !opts.validate(form)) return;
      if (opts.beforeSend) opts.beforeSend(formData);

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            alert(opts.success);
            form.reset();
          } else {
            return response.json().then(function (errorData) {
              console.error('Formspree error:', errorData);
              alert(opts.failure);
            });
          }
        })
        .catch(function (error) {
          console.error('Network error:', error);
          alert('❌ Network error. Please check your connection.');
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  wireForm(document.getElementById('reviewForm'), {
    required: ['name', 'email', 'message'],
    success: '✅ Review submitted successfully!',
    failure: '❌ Error submitting review. Please try again.'
  });

  wireForm(document.getElementById('appointmentForm'), {
    required: ['name', 'email', 'phone', 'location', 'appointment-time'],
    success: '✅ Appointment booked successfully!',
    failure: '❌ Error booking appointment. Please try again.',
    validate: function () {
      var cb = document.getElementById('termsCheckbox');
      var err = document.getElementById('termsError');
      var box = document.getElementById('termsBox');
      if (cb && !cb.checked) {
        if (err) err.hidden = false;
        if (box) box.classList.add('has-error');
        cb.setAttribute('aria-invalid', 'true');
        (box || cb).scrollIntoView({ behavior: 'smooth', block: 'center' });
        cb.focus({ preventScroll: true });
        return false;
      }
      return true;
    },
    beforeSend: function (formData) {
      formData.set('terms_agreed', 'Yes - agreed to the Terms & Conditions and Cancellation Policy on ' + new Date().toLocaleString());
      var raw = formData.get('appointment-time');
      var d = new Date(raw);
      if (!isNaN(d.getTime())) formData.set('appointment-time', d.toLocaleString());
    }
  });

  document.querySelectorAll('.newsletter-form').forEach(function (f) {
    wireForm(f, {
      required: ['name', 'email'],
      success: '✅ Thank you for subscribing to our newsletter!',
      failure: '❌ Error submitting subscription. Please try again.'
    });
  });

  /* ---------- Terms checkbox: clear the gentle reminder once ticked ---------- */
  var termsCb = document.getElementById('termsCheckbox');
  if (termsCb) {
    termsCb.addEventListener('change', function () {
      var err = document.getElementById('termsError');
      var box = document.getElementById('termsBox');
      if (termsCb.checked) {
        if (err) err.hidden = true;
        if (box) box.classList.remove('has-error');
        termsCb.removeAttribute('aria-invalid');
      }
    });
  }

  /* ---------- Page fade-in / fade-out ---------- */
  function showPage() {
    document.body.style.opacity = '';
    document.body.classList.add('fade-in');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showPage);
  } else {
    showPage();
  }
  // Back/forward cache restores the page with opacity 0 otherwise
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) showPage();
  });

  document.querySelectorAll('a[href]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var sameSite =
        (link.protocol === 'http:' || link.protocol === 'https:') &&
        link.hostname === window.location.hostname;
      if (!sameSite) return;
      if (link.target === '_blank') return;
      if (link.href.indexOf('#') !== -1) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;

      e.preventDefault();
      var target = link.href;
      document.body.style.opacity = 0;
      setTimeout(function () { window.location.href = target; }, 400);
    });
  });
})();
