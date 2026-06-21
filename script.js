(function () {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const langToggle = document.getElementById('lang-toggle');
  const langToggleMobile = document.getElementById('lang-toggle-mobile');
  let currentLang = localStorage.getItem('vevarz-lang') || 'bn';

  function closeMenu() {
    if (navToggle) navToggle.checked = false;
    document.body.classList.remove('menu-open');
    if (mobileDrawer) mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileOverlay) mobileOverlay.setAttribute('aria-hidden', 'true');
  }

  function openMenu() {
    document.body.classList.add('menu-open');
    if (mobileDrawer) mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileOverlay) mobileOverlay.setAttribute('aria-hidden', 'false');
  }

  function applyLanguage(lang) {
    document.body.style.opacity = '0.92';
    currentLang = lang;
    localStorage.setItem('vevarz-lang', lang);
    document.documentElement.lang = lang;
    document.body.classList.toggle('lang-en', lang === 'en');
    document.body.classList.toggle('lang-bn', lang === 'bn');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (I18N[lang] && I18N[lang][key] !== undefined) {
        el.textContent = I18N[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (I18N[lang] && I18N[lang][key]) {
        el.placeholder = I18N[lang][key];
      }
    });

    document.querySelectorAll('.tagline .en').forEach((el) => {
      el.style.display = lang === 'en' ? 'none' : '';
    });

    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl && I18N[lang]['meta.title']) {
      titleEl.textContent = I18N[lang]['meta.title'];
    }

    const label = lang === 'bn' ? 'EN' : 'BN';
    document.querySelectorAll('.lang-label, .lang-label-mobile').forEach((el) => {
      el.textContent = label;
    });

    requestAnimationFrame(() => {
      document.body.style.opacity = '';
    });
  }

  function toggleLanguage() {
    applyLanguage(currentLang === 'bn' ? 'en' : 'bn');
  }

  if (langToggle) langToggle.addEventListener('click', toggleLanguage);
  if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLanguage);

  applyLanguage(currentLang);

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });

  if (navToggle) {
    navToggle.addEventListener('change', () => {
      if (navToggle.checked) openMenu();
      else closeMenu();
    });
  }

  if (drawerClose) drawerClose.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.drawer-links a, .drawer-brand, .drawer-cta').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  const revealClasses = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .case-card, .found-card, .timeline-step, .join-card, .feature-card, .video-card, .reunited-card, .footer-brand, .footer-col, .footer-cta-inner';

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll(revealClasses).forEach((el) => observer.observe(el));

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
        statObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statObserver.observe(statsBar);

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString(currentLang === 'bn' ? 'bn-BD' : 'en-US');
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const sections = document.querySelectorAll('section[id], main[id]');
  const navLinks = document.querySelectorAll('[data-nav]');

  function setActiveNav() {
    let current = 'home';
    sections.forEach((section) => {
      const top = section.offsetTop - 130;
      if (window.scrollY >= top) current = section.id || 'home';
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();
})();
