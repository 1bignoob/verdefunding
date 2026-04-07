document.addEventListener('DOMContentLoaded', function () {
  function getSiteBasePath() {
    var path = window.location.pathname || '/';
    if (window.location.hostname.endsWith('github.io')) {
      var parts = path.split('/').filter(Boolean);
      return parts.length ? '/' + parts[0] + '/' : '/';
    }
    return '/';
  }

  var navToggle = document.querySelector('.nav-toggle');
  var primaryNav = document.getElementById('primary-navigation');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      primaryNav.setAttribute('aria-hidden', String(expanded));
    });

    primaryNav.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.addEventListener('click', function () {
      if (primaryNav.getAttribute('aria-hidden') === 'false') {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.setAttribute('aria-hidden', 'true');
      }
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var forms = document.querySelectorAll('.js-funding-form');
  forms.forEach(function (form) {
    var status = form.querySelector('.form-status');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (status) {
        status.textContent = '';
        status.style.color = '';
      }

      var fd = new FormData(form);
      var name = (fd.get('name') || '').toString().trim();
      var email = (fd.get('email') || '').toString().trim();

      if (!name || !email) {
        if (status) {
          status.textContent = 'Please provide your full name and email address.';
          status.style.color = '#ff9f9f';
        }
        return;
      }

      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        if (status) {
          status.textContent = 'Thanks. Your request was received.';
          status.style.color = '#9cd8ad';
        }
        form.reset();
        return;
      }

      if (status) {
        status.textContent = 'Sending...';
      }

      try {
        var response = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: fd
        });

        if (response.ok) {
          window.location.href = getSiteBasePath() + 'thank_you/';
          return;
        }

        var serverMessage = '';
        try {
          var data = await response.json();
          serverMessage = data.error || data.message || '';
        } catch (err) {
          serverMessage = await response.text().catch(function () {
            return '';
          });
        }

        if (status) {
          status.textContent = serverMessage || 'There was a problem submitting your request. Please try again.';
          status.style.color = '#ff9f9f';
        }
      } catch (err) {
        if (status) {
          status.textContent = 'Network error. Please try again later.';
          status.style.color = '#ff9f9f';
        }
      }
    });
  });

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  var flipCards = document.querySelectorAll('.flip-card');
  if (flipCards.length) {
    var resetFlipCards = function () {
      flipCards.forEach(function (card) {
        card.classList.remove('is-flipped');
        card.setAttribute('aria-pressed', 'false');
      });
    };

    flipCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.stopPropagation();
        var shouldFlip = !card.classList.contains('is-flipped');
        resetFlipCards();
        if (shouldFlip) {
          card.classList.add('is-flipped');
          card.setAttribute('aria-pressed', 'true');
        }
      });

      card.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') {
          return;
        }
        e.preventDefault();
        var shouldFlip = !card.classList.contains('is-flipped');
        resetFlipCards();
        if (shouldFlip) {
          card.classList.add('is-flipped');
          card.setAttribute('aria-pressed', 'true');
        }
      });
    });

    document.addEventListener('click', function () {
      resetFlipCards();
    });
  }
});
