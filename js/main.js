/* ============================================
   GCEYA 7 — Portfolio JavaScript
   ============================================ */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ---------- Custom Cursor ----------
  const cursorDot = $('#cursorDot');
  const cursorRing = $('#cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  function initCursor() {
    if (matchMedia('(hover: none)').matches) return;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverEls = $$('a, button, .tab-btn, .open-code, .design-card, input, textarea');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // ---------- Theme Toggle ----------
  function initTheme() {
    const saved = localStorage.getItem('gceya7-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    const toggle = $('#themeToggle');
    const toggleMobile = $('#themeToggleMobile');

    function switchTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('gceya7-theme', next);
    }

    if (toggle) toggle.addEventListener('click', switchTheme);
    if (toggleMobile) toggleMobile.addEventListener('click', switchTheme);
  }

  // ---------- Mobile Menu ----------
  function initMobileMenu() {
    const hamburger = $('#hamburger');
    const menu = $('#mobileMenu');
    const overlay = $('#mobileOverlay');
    const links = $$('.mobile-nav-link');

    function toggleMenu() {
      hamburger.classList.toggle('active');
      menu.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      menu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));
  }

  // ---------- Smooth Scroll & Active Nav ----------
  function initNavigation() {
    const navLinks = $$('.nav-link');
    const mobileLinks = $$('.mobile-nav-link');
    const sections = $$('.section');

    function smoothScroll(e) {
      e.preventDefault();
      const target = $(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    navLinks.forEach(link => link.addEventListener('click', smoothScroll));
    mobileLinks.forEach(link => link.addEventListener('click', smoothScroll));

    // Active section highlighting
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l => l.classList.remove('active'));
          mobileLinks.forEach(l => l.classList.remove('active'));
          const activeNav = $(`.nav-link[data-section="${id}"]`);
          const activeMob = $$(`.mobile-nav-link`).find(l => l.getAttribute('href') === '#' + id);
          if (activeNav) activeNav.classList.add('active');
          if (activeMob) activeMob.classList.add('active');
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }

  // ---------- Scroll Animations ----------
  function initScrollAnimations() {
    const fadeEls = $$('.fade-in');
    const skillFills = $$('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Animate skill bars
          const fills = $$('.skill-fill', entry.target);
          fills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            setTimeout(() => { fill.style.width = width + '%'; }, 200);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(el => observer.observe(el));
  }

  // ---------- Counter Animation ----------
  function initCounters() {
    const counters = $$('.stat-number');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          let current = 0;
          const increment = target / 40;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current);
          }, 40);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // ---------- Parallax Scrolling ----------
  function initParallax() {
    const parallaxEls = $$('[data-parallax]');

    function updateParallax() {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax'));
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY) * speed;
        el.style.transform = `translateY(${scrollY * speed * -1}px)`;
      });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- Project Tabs ----------
  function initProjectTabs() {
    const tabBtns = $$('.tab-btn');
    const tabContents = $$('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.classList.add('active');
        }
      });
    });
  }

  // ---------- Code Viewer Modal ----------
  function initCodeModal() {
    const codeBtns = $$('.open-code');
    const codeModal = document.getElementById('codeModal');
    const closeCodeBtn = codeModal ? codeModal.querySelector('.code-container') : null;
    const codeDisplay = document.getElementById('code-display');
    const codeTitle = document.getElementById('code-title');

    codeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!codeModal) return;

        const codeId = btn.getAttribute('data-code');
        const fileName = btn.getAttribute('data-title');
        const hiddenCodeBlock = document.getElementById(codeId);

        if (!hiddenCodeBlock) return;

        const rawCode = hiddenCodeBlock.innerText;
        if (codeDisplay && codeTitle) {
          codeDisplay.innerText = rawCode;
          codeTitle.innerText = fileName;
        }

        codeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (codeModal) {
      codeModal.addEventListener('click', (e) => {
        if (e.target === codeModal) {
          codeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && codeModal && codeModal.classList.contains('active')) {
        codeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------- Design Lightbox ----------
  function initDesignLightbox() {
    const designCards = $$('.design-card:not(.live-site-card)');
    const lightbox = document.getElementById('designLightbox');
    const lightboxImg = document.getElementById('lightbox-image');

    designCards.forEach(card => {
      card.addEventListener('click', () => {
        if (!lightbox || !lightboxImg) return;

        const fullImageSrc = card.getAttribute('data-full-image');
        lightboxImg.src = fullImageSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-scroll-container')) {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
          lightboxImg.src = '';
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
      }
    });
  }

  // ---------- Contact Form ----------
  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    const nameInput = $('#name');
    const emailInput = $('#email');
    const subjectInput = $('#subject');
    const messageInput = $('#message');
    const submitBtn = $('.btn-submit');
    const successMsg = $('#formSuccess');

    function showError(input, errorId, message) {
      const error = $(errorId);
      if (error) error.textContent = message;
      input.style.borderColor = '#EF4444';
    }

    function clearError(input, errorId) {
      const error = $(errorId);
      if (error) error.textContent = '';
      input.style.borderColor = '';
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, '#nameError', 'Please enter your name');
        valid = false;
      } else {
        clearError(nameInput, '#nameError');
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        showError(emailInput, '#emailError', 'Please enter a valid email');
        valid = false;
      } else {
        clearError(emailInput, '#emailError');
      }

      if (!subjectInput.value.trim()) {
        showError(subjectInput, '#subjectError', 'Please enter a subject');
        valid = false;
      } else {
        clearError(subjectInput, '#subjectError');
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, '#messageError', 'Please enter your message');
        valid = false;
      } else {
        clearError(messageInput, '#messageError');
      }

      if (!valid) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        form.reset();
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }, 1500);
    });

    // Clear errors on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.style.borderColor = '';
          const errorEl = input.parentElement.querySelector('.form-error');
          if (errorEl) errorEl.textContent = '';
        });
      }
    });
  }

  // ---------- Back to Top ----------
  function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Mobile Header Scroll Effect ----------
  function initMobileHeader() {
    const header = $('#mobileHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // ---------- Init Everything ----------
  function init() {
    initCursor();
    initTheme();
    initMobileMenu();
    initNavigation();
    initScrollAnimations();
    initCounters();
    initParallax();
    initProjectTabs();
    initCodeModal();
    initDesignLightbox();
    initContactForm();
    initBackToTop();
    initMobileHeader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
