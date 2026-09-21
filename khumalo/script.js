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
    'residential-construction': {
      title: 'Residential Construction',
      description: 'Khumalo Construction delivers full residential builds from the ground up — from foundation and structural work through to final finishes. We work closely with homeowners, architects and engineers to bring approved plans to life, managing every phase of the build with the same care and craftsmanship we bring to our renovation and finishing work. Whether it\'s a new family home or a ground-up extension to an existing property, our team carries out the work to a high standard, in line with industry regulations and safety requirements, so your new build starts on solid ground and stays on track from start to finish.'
    },
    'plastering': {
      title: 'Plastering',
      description: 'Plastering transforms spaces, creating smooth canvases for creativity and shelter, showcasing skill and dedication in every layer applied. Our team delivers flawless finishes for interior and exterior surfaces, from smooth renders to textured decorative plasterwork.'
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
      description: 'Decorative art includes artistic expressions that prioritize aesthetics and functionality, spanning stone masonry, ceramics, textiles, glass, metalwork, and furniture. Our stonework combines artistry and structural integrity through the careful selection and arrangement of natural stone, using traditional techniques for durable, appealing feature walls and finishes with timeless quality. Together, these crafts enhance living spaces and daily life, merging artistry with functionality and reflecting personal taste through considered design and materials.'
    },
    'maintenance': {
      title: 'Maintenance',
      description: 'Keeping a home in top condition takes more than a one-time fix. Our maintenance service covers the ongoing repairs and upkeep that protect your investment for the long term — including professional waterproofing and damp-proofing to shield your property from leaks, mould, and moisture damage. From small patch repairs to scheduled upkeep, we handle the details so you don\'t have to, giving you a future free from the worries of water damage and creating a comfortable, healthy environment for you and your loved ones.'
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
     Terms & Conditions Modal
     -------------------------------------------------------------------------- */
  const termsModal = document.getElementById('termsModal');
  const termsModalClose = document.getElementById('termsModalClose');
  const termsLink = document.getElementById('termsLink');

  function openTermsModal() {
    if (!termsModal) return;
    termsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeTermsModal() {
    if (!termsModal) return;
    termsModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openTermsModal();
    });
  }

  if (termsModalClose) termsModalClose.addEventListener('click', closeTermsModal);

  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) closeTermsModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal && termsModal.classList.contains('active')) closeTermsModal();
  });

  /* --------------------------------------------------------------------------
     Gallery Carousel (center-focus, auto-advancing coverflow) - Dynamic from content.json
     -------------------------------------------------------------------------- */
  const galleryFilters = document.getElementById('galleryFilters');
  const galleryViewport = document.getElementById('galleryViewport');
  const galleryTrack = document.getElementById('galleryTrack');
  const scrollLeftBtn = document.getElementById('scrollLeft');
  const scrollRightBtn = document.getElementById('scrollRight');
  const dynamicLink = document.getElementById('dynamicGalleryLink');

  const AUTOPLAY_DELAY = 4000;
  const DRAG_THRESHOLD = 50;

  let galleryData = null;
  let currentCategory = 'residential-construction';
  let currentSlideIndex = 0;
  let autoplayTimer = null;
  let currentTranslateX = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragMoved = false;

  // Load gallery data from content.json
  async function loadGalleryData() {
    try {
      const response = await fetch('content.json');
      if (!response.ok) throw new Error('Failed to load content.json');
      galleryData = await response.json();
      buildGalleryTrack();
      renderGalleryFilters();
      applyCategoryVisibility();
      renderCarousel();
      startAutoplay();
    } catch (error) {
      console.error('Failed to load gallery data:', error);
      // Fallback: try to use existing DOM elements
      initFallbackGallery();
    }
  }

  function renderGalleryFilters() {
    if (!galleryData || !galleryFilters) return;
    
    const categories = galleryData.gallery.categories;
    galleryFilters.innerHTML = '';
    
    categories.forEach((cat, index) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat.type === 'videos' ? ' video-tab' : '');
      btn.setAttribute('data-filter', cat.id);
      if (index === 0) btn.classList.add('active');
      btn.textContent = cat.name;
      btn.addEventListener('click', () => handleFilterClick(cat.id, btn));
      galleryFilters.appendChild(btn);
    });
    
    // Set initial category
    if (categories.length > 0) {
      currentCategory = categories[0].id;
    }
  }

  function handleFilterClick(categoryId, clickedBtn) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    clickedBtn.classList.add('active');
    
    currentCategory = categoryId;
    currentSlideIndex = 0;
    applyCategoryVisibility();
    renderCarousel();
    restartAutoplay();
    
    // Update dynamic link
    const cat = galleryData.gallery.categories.find(c => c.id === categoryId);
    if (dynamicLink && cat) {
      dynamicLink.innerHTML = `Learn more about ${cat.name.toLowerCase()} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
      dynamicLink.setAttribute('data-service', categoryId);
    }
  }

  function getCategoryItems(category) {
    if (!galleryTrack) return [];
    return [...galleryTrack.querySelectorAll('.gallery-item')].filter(
      item => item.getAttribute('data-category') === category
    );
  }

  // Only the active category's slides may occupy space in the flex row —
  // everything else must be display:none so the offsetWidth-based centering
  // math lines up with what's actually laid out.
  function applyCategoryVisibility() {
    if (!galleryTrack) return;
    galleryTrack.querySelectorAll('.gallery-item').forEach(item => {
      item.style.display = item.getAttribute('data-category') === currentCategory ? '' : 'none';
    });
  }

  function positionTrack(items) {
    if (!galleryViewport || !galleryTrack || !items.length) return;
    const trackStyles = getComputedStyle(galleryTrack);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

    let offset = 0;
    for (let i = 0; i < currentSlideIndex; i++) {
      offset += items[i].offsetWidth + gap;
    }
    offset += items[currentSlideIndex].offsetWidth / 2;

    const viewportCenter = galleryViewport.clientWidth / 2;
    currentTranslateX = viewportCenter - offset;
    galleryTrack.style.transform = `translateX(${currentTranslateX}px)`;
  }

  function renderCarousel() {
    const items = getCategoryItems(currentCategory);
    if (!items.length) return;
    currentSlideIndex = ((currentSlideIndex % items.length) + items.length) % items.length;
    // Clear is-center from every slide (including other, hidden categories) before
    // re-applying it, otherwise a stale center slide from the previous filter lingers.
    galleryTrack.querySelectorAll('.gallery-item.is-center').forEach(el => el.classList.remove('is-center'));
    items.forEach((item, i) => item.classList.toggle('is-center', i === currentSlideIndex));
    positionTrack(items);
  }

  function goToSlide(index) {
    currentSlideIndex = index;
    renderCarousel();
    restartAutoplay();
  }

  function nextSlide() {
    goToSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentSlideIndex - 1);
  }

  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      currentSlideIndex++;
      renderCarousel();
    }, AUTOPLAY_DELAY);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  // Fallback for when content.json fails to load
  function initFallbackGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length === 0) return;
    
    currentCategory = document.querySelector('.filter-btn.active')
      ? document.querySelector('.filter-btn.active').getAttribute('data-filter')
      : 'residential-construction';
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-filter');
        currentSlideIndex = 0;
        applyCategoryVisibility();
        renderCarousel();
        restartAutoplay();
      });
    });
    
    if (scrollLeftBtn) scrollLeftBtn.addEventListener('click', prevSlide);
    if (scrollRightBtn) scrollRightBtn.addEventListener('click', nextSlide);
    setupTrackEvents();
    
    applyCategoryVisibility();
    renderCarousel();
    startAutoplay();
  }

  function buildGalleryTrack() {
    if (!galleryData || !galleryTrack) return;
    
    const categories = galleryData.gallery.categories;
    galleryTrack.innerHTML = '';
    
    categories.forEach(cat => {
      cat.items.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.setAttribute('data-category', cat.id);
        div.setAttribute('data-index', idx);
        
        if (cat.type === 'videos' && item.src) {
          div.innerHTML = `
            <video src="${item.src}" preload="metadata" ${item.poster ? `poster="${item.poster}"` : ''} controls></video>
          `;
        } else if (item.src) {
          div.innerHTML = `
            <img src="${item.src}" alt="${item.alt || ''}" loading="lazy">
          `;
        }
        
        galleryTrack.appendChild(div);
      });
    });
    
    setupTrackEvents();
  }

  function setupTrackEvents() {
    if (!galleryTrack) return;
    
    // Click a slide: center slide opens the lightbox, a side ("peeking") slide brings it to focus
    galleryTrack.addEventListener('click', (e) => {
      if (dragMoved) { dragMoved = false; return; }
      const itemEl = e.target.closest('.gallery-item');
      if (!itemEl) return;

      if (itemEl.classList.contains('is-center')) {
        const media = itemEl.querySelector('img, video');
        if (media) openLightbox(media);
      } else {
        const items = getCategoryItems(currentCategory);
        const idx = items.indexOf(itemEl);
        if (idx !== -1) goToSlide(idx);
      }
    });
    
    // Drag / swipe support for manual navigation
    const dragStart = (clientX) => {
      isDragging = true;
      dragMoved = false;
      dragStartX = clientX;
      stopAutoplay();
      galleryTrack.classList.add('is-dragging');
    };

    const dragMove = (clientX) => {
      if (!isDragging) return;
      const delta = clientX - dragStartX;
      if (Math.abs(delta) > 5) dragMoved = true;
      galleryTrack.style.transform = `translateX(${currentTranslateX + delta}px)`;
    };

    const dragEnd = (clientX) => {
      if (!isDragging) return;
      isDragging = false;
      galleryTrack.classList.remove('is-dragging');
      const delta = clientX - dragStartX;

      if (delta < -DRAG_THRESHOLD) {
        nextSlide();
      } else if (delta > DRAG_THRESHOLD) {
        prevSlide();
      } else {
        renderCarousel();
        restartAutoplay();
      }
    };

    galleryTrack.addEventListener('pointerdown', (e) => dragStart(e.clientX));
    galleryTrack.addEventListener('pointermove', (e) => dragMove(e.clientX));
    window.addEventListener('pointerup', (e) => dragEnd(e.clientX));
    galleryTrack.addEventListener('pointercancel', (e) => dragEnd(e.clientX));
  }

  if (scrollLeftBtn) scrollLeftBtn.addEventListener('click', prevSlide);
  if (scrollRightBtn) scrollRightBtn.addEventListener('click', nextSlide);

  // Pause auto-advance while the visitor is engaging with the gallery
  if (galleryViewport) {
    galleryViewport.addEventListener('mouseenter', stopAutoplay);
    galleryViewport.addEventListener('mouseleave', startAutoplay);
  }

  window.addEventListener('resize', renderCarousel);

  // Initialize gallery
  loadGalleryData();

  /* --------------------------------------------------------------------------
     Gallery Lightbox (supports images and videos)
     -------------------------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let visibleMedia = [];
  let currentIndex = 0;

  function getVisibleMedia() {
    return [...document.querySelectorAll('.gallery-item')]
      .filter(item => item.style.display !== 'none')
      .map(item => item.querySelector('img, video'));
  }

  function showMedia(index) {
    currentIndex = (index + visibleMedia.length) % visibleMedia.length;
    const media = visibleMedia[currentIndex];
    
    if (media.tagName === 'VIDEO') {
      // Replace image with video in lightbox
      if (!lightbox.querySelector('.lightbox-video')) {
        const video = document.createElement('video');
        video.className = 'lightbox-video';
        video.controls = true;
        video.autoplay = true;
        lightboxImage.style.display = 'none';
        lightbox.insertBefore(video, lightboxImage.nextSibling);
      }
      const video = lightbox.querySelector('.lightbox-video');
      video.src = media.src;
      video.poster = media.poster || '';
    } else {
      // Show image
      lightboxImage.style.display = 'block';
      const video = lightbox.querySelector('.lightbox-video');
      if (video) video.remove();
      lightboxImage.src = media.src;
      lightboxImage.alt = media.alt;
    }
  }

  function openLightbox(clickedMedia) {
    visibleMedia = getVisibleMedia();
    const index = visibleMedia.indexOf(clickedMedia);
    if (index === -1) return;
    showMedia(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Pause any playing video
    const video = lightbox.querySelector('.lightbox-video');
    if (video) video.pause();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showMedia(currentIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showMedia(currentIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showMedia(currentIndex - 1);
    if (e.key === 'ArrowRight') showMedia(currentIndex + 1);
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
        { id: 'fullName', error: 'fullNameError', message: 'Please enter your full name' },
        { id: 'email', error: 'emailError', message: 'Please enter a valid email address', type: 'email' },
        { id: 'phone', error: 'phoneError', message: 'Please enter your contact number' },
        { id: 'address', error: 'addressError', message: 'Please enter your address' },
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

      const termsInput = document.getElementById('terms');
      const termsError = document.getElementById('termsError');
      if (termsInput) {
        if (!termsInput.checked) {
          termsError.textContent = 'Please agree to the Terms & Conditions to continue';
          isValid = false;
        } else {
          termsError.textContent = '';
        }
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          formSuccess.classList.add('show');
          submitBtn.textContent = 'Request My Quote';
          submitBtn.disabled = false;
          contactForm.reset();
          const otherText = document.getElementById('projectTypeOtherText');
          if (otherText) otherText.style.display = 'none';
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }, 1500);
      }
    });

    const inputs = contactForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
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

    // Terms checkbox: clear error as soon as it's checked
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', () => {
        const termsError = document.getElementById('termsError');
        if (termsCheckbox.checked && termsError) termsError.textContent = '';
      });
    }

    // "Other" project type: reveal a text input to specify
    const projectTypeOther = document.getElementById('projectTypeOther');
    const projectTypeOtherText = document.getElementById('projectTypeOtherText');
    if (projectTypeOther && projectTypeOtherText) {
      projectTypeOther.addEventListener('change', () => {
        projectTypeOtherText.style.display = projectTypeOther.checked ? 'block' : 'none';
        if (!projectTypeOther.checked) projectTypeOtherText.value = '';
      });
    }
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
