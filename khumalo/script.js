/* ==========================================================================
   Khumalo Construction - Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     Preloader
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1800);
  });
  setTimeout(() => preloader.classList.add('hidden'), 2000);

  /* --------------------------------------------------------------------------
     Hero Entrance Animation (triggers after page load)
     -------------------------------------------------------------------------- */
  const heroLayout = document.getElementById('heroLayout');

  function triggerHeroAnimation() {
    if (heroLayout) {
      heroLayout.classList.add('animate');
    }
  }

  /* Fire 3 seconds after window.load for a more dramatic pause */
  window.addEventListener('load', () => {
    setTimeout(triggerHeroAnimation, 3000);
  });
  /* Fallback */
  setTimeout(triggerHeroAnimation, 1000);

  /* --------------------------------------------------------------------------
     Theme Toggle (Dark / Light Mode)
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  /* --------------------------------------------------------------------------
     Navbar Scroll Effect
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  /* --------------------------------------------------------------------------
     Hamburger Menu
     -------------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* --------------------------------------------------------------------------
     Smooth Scroll Navigation
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     Active Nav Link on Scroll
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  /* --------------------------------------------------------------------------
     Scroll-Triggered Fade-In Animations
     -------------------------------------------------------------------------- */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

  animateElements.forEach(el => scrollObserver.observe(el));

  /* --------------------------------------------------------------------------
     Counter Animation (About Stats)
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    let current = 0;
    const increment = target / 60;
    const stepTime = 1500 / 60;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + '+';
    }, stepTime);
  }

  /* --------------------------------------------------------------------------
     Hero Canvas - Particle Animation
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7 ? '#d4a843' : '#ffffff';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function createParticles() {
      const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
      particles = [];
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    createParticles();
    window.addEventListener('resize', createParticles);

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#d4a843';
            ctx.globalAlpha = 0.06 * (1 - dist / 150);
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* --------------------------------------------------------------------------
     Parallax Scrolling Effect (desktop only, before hero animation)
     -------------------------------------------------------------------------- */
  const heroSection = document.getElementById('hero');
  const heroText = document.getElementById('heroText');

  function handleParallax() {
    if (!heroLayout || heroLayout.classList.contains('animate')) return;
    if (window.innerWidth < 768) return;

    const scrollY = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
    if (scrollY < heroHeight) {
      const parallaxOffset = scrollY * 0.4;
      const opacityValue = 1 - (scrollY / heroHeight) * 1.2;
      if (heroText) {
        heroText.style.transform = `translateY(${parallaxOffset}px)`;
        heroText.style.opacity = Math.max(opacityValue, 0);
      }
    }
  }
  window.addEventListener('scroll', handleParallax);

  /* --------------------------------------------------------------------------
     FAQ Accordion
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('active', !isActive);
      question.setAttribute('aria-expanded', !isActive);
    });
  });

  /* --------------------------------------------------------------------------
     Service Modal
     -------------------------------------------------------------------------- */
  const serviceModal = document.getElementById('serviceModal');
  const serviceModalClose = document.getElementById('serviceModalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');

  const serviceDetails = {
    'waterproofing': {
      title: 'Waterproofing',
      description: 'Protect your property and preserve its longevity with professional waterproofing solutions. Our services not only shield your home from the damaging effects of water but also enhance its structural integrity. Imagine a future free from the worries of leaks, mould, and dampness. By investing in waterproofing, you\'re not just safeguarding your space; you\'re creating a comfortable, healthy environment for you and your loved ones.'
    },
    'plastering': {
      title: 'Plastering',
      description: 'Plastering transforms spaces, creating smooth canvases for creativity and shelter, showcasing skill and dedication in every layer applied. Our team delivers flawless finishes for interior and exterior surfaces, from smooth renders to textured decorative plasterwork.'
    },
    'stone-masonry': {
      title: 'Stone Masonry',
      description: 'Stone masonry combines artistry and structural integrity through the careful selection and arrangement of natural stone to create durable, appealing structures. Skilled masons use traditional techniques for perfect fitting, ensuring strength and stability. This craft enhances aesthetics while providing excellent insulation and longevity, making it suitable for residential and commercial projects.'
    },
    'renovation': {
      title: 'Renovation',
      description: 'Renovation is a process of renewal that starts with a vision. Updating old buildings brings a new viewpoint, with every decision showcasing personal style and transforming a structure into a home. While it can be tough, it builds resilience, adaptability, and creativity, encouraging teamwork. The value of renovation comes from the lessons learned, highlighting the need for patience and discovering hidden potential.'
    },
    'painting': {
      title: 'Painting',
      description: 'Painting is an expressive art form that transforms blank canvases into vibrant visual narratives. By blending colours, textures, and techniques, painters convey emotions and tell stories that resonate with viewers. Whether it\'s a serene landscape, an abstract composition, or a detailed exterior, each stroke reveals our commitment to excellence.'
    },
    'decorative-art': {
      title: 'Decorative Art',
      description: 'Decorative art includes artistic expressions that prioritize aesthetics and functionality, spanning ceramics, textiles, glass, metalwork, and furniture. It enhances living spaces and daily life by merging artistry with functionality, reflecting personal taste and societal trends through design principles and materials.'
    }
  };

  function openServiceModal(serviceKey) {
    const details = serviceDetails[serviceKey];
    if (details) {
      modalTitle.textContent = details.title;
      modalDescription.textContent = details.description;
      serviceModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  window.openServiceModal = openServiceModal;

  document.querySelectorAll('.btn-learn-more').forEach(btn => {
    btn.addEventListener('click', () => {
      openServiceModal(btn.getAttribute('data-service'));
    });
  });

  function closeServiceModal() {
    serviceModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  serviceModalClose.addEventListener('click', closeServiceModal);

  serviceModal.addEventListener('click', (e) => {
    if (e.target === serviceModal) closeServiceModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal.classList.contains('active')) closeServiceModal();
  });

  /* --------------------------------------------------------------------------
     Gallery Filters & Horizontal Scroll
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryTrack = document.getElementById('galleryTrack');
  const scrollLeftBtn = document.getElementById('scrollLeft');
  const scrollRightBtn = document.getElementById('scrollRight');
  const dynamicLink = document.getElementById('dynamicGalleryLink');

  const linkTexts = {
    'waterproofing': 'Learn more about waterproofing',
    'plastering': 'Learn more about plastering',
    'stone-masonry': 'Learn more about stone masonry',
    'renovation': 'Learn more about renovation',
    'painting': 'Learn more about painting',
    'decorative-art': 'Learn more about decorative art'
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedFilter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (item.getAttribute('data-category') === selectedFilter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      if (dynamicLink) {
        dynamicLink.innerHTML = `${linkTexts[selectedFilter]} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
        dynamicLink.setAttribute('data-service', selectedFilter);
      }

      if (galleryTrack) galleryTrack.scrollLeft = 0;
      updateScrollButtons();
    });
  });

  if (dynamicLink) {
    dynamicLink.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = dynamicLink.getAttribute('data-service') || 'waterproofing';
      if (typeof window.openServiceModal === 'function') {
        window.openServiceModal(serviceKey);
      }
    });
  }

  const scrollAmount = 424;

  if (scrollLeftBtn && galleryTrack) {
    scrollLeftBtn.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (scrollRightBtn && galleryTrack) {
    scrollRightBtn.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  function updateScrollButtons() {
    if (!galleryTrack || !scrollLeftBtn || !scrollRightBtn) return;
    scrollLeftBtn.style.display = galleryTrack.scrollLeft <= 1 ? 'none' : 'flex';
    scrollRightBtn.style.display = Math.ceil(galleryTrack.scrollLeft + galleryTrack.clientWidth) >= galleryTrack.scrollWidth ? 'none' : 'flex';
  }

  if (galleryTrack) {
    galleryTrack.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    updateScrollButtons();
  }

  /* --------------------------------------------------------------------------
     Gallery Lightbox
     -------------------------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let visibleImages = [];
  let currentIndex = 0;

  function getVisibleImages() {
    return [...document.querySelectorAll('.gallery-item')]
      .filter(item => item.style.display !== 'none')
      .map(item => item.querySelector('img'));
  }

  function showImage(index) {
    currentIndex = (index + visibleImages.length) % visibleImages.length;
    const img = visibleImages[currentIndex];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
  }

  function openLightbox(clickedImg) {
    visibleImages = getVisibleImages();
    const index = visibleImages.indexOf(clickedImg);
    if (index === -1) return;
    showImage(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  /* --------------------------------------------------------------------------
     Contact Form Validation
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const fields = [
        { id: 'firstName', error: 'firstNameError', message: 'Please enter your first name' },
        { id: 'lastName', error: 'lastNameError', message: 'Please enter your last name' },
        { id: 'email', error: 'emailError', message: 'Please enter a valid email address', type: 'email' },
        { id: 'phone', error: 'phoneError', message: 'Please enter your phone number' },
        { id: 'message', error: 'messageError', message: 'Please describe your project' }
      ];

      fields.forEach(field => {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.error);
        const value = input.value.trim();

        input.classList.remove('error');
        error.textContent = '';

        if (!value) {
          input.classList.add('error');
          error.textContent = field.message;
          isValid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          input.classList.add('error');
          error.textContent = 'Please enter a valid email address';
          isValid = false;
        }
      });

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          formSuccess.classList.add('show');
          submitBtn.textContent = 'Send Enquiry';
          submitBtn.disabled = false;
          contactForm.reset();
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }, 1500);
      }
    });

    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        const errorEl = document.getElementById(input.id + 'Error');
        if (errorEl) {
          if (!input.value.trim()) {
            input.classList.add('error');
          } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
            input.classList.add('error');
          } else {
            input.classList.remove('error');
            errorEl.textContent = '';
          }
        }
      });

      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = document.getElementById(input.id + 'Error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     Back to Top Button
     -------------------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', handleBackToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --------------------------------------------------------------------------
     Scroll-Based Parallax Depth for Gallery
     -------------------------------------------------------------------------- */
  function handleDepthParallax() {
    const windowHeight = window.innerHeight;
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const speed = 0.03 * ((index % 3) + 1);
        const yOffset = (rect.top - windowHeight / 2) * speed;
        const img = item.querySelector('img');
        if (img) img.style.transform = `translateY(${yOffset}px) scale(1)`;
      }
    });
  }
  window.addEventListener('scroll', handleDepthParallax);

});
