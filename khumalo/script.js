// --- Mobile Hamburger Menu Toggle ---
const hamburger = document.getElementById('hamburger');
const navContent = document.getElementById('nav-content');

hamburger.addEventListener('click', () => {
    navContent.classList.toggle('active');
});

// --- Services Dropdown Toggle ---
const servicesBtn = document.getElementById('services-btn');
const servicesMenu = document.getElementById('services-menu');

servicesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    servicesMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        servicesMenu.classList.remove('active');
    }
});

// --- Service Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const serviceModal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.getElementById('modal-close');

    const serviceDetails = {
        'waterproofing': {
            title: 'Waterproofing',
            description: 'Protect your property and preserve its longevity with professional waterproofing solutions. Our services not only shield your home from the damaging effects of water but also enhance its structural integrity. Imagine a future free from the worries of leaks, mold, and dampness. By investing in waterproofing, you\'re not just safeguarding your space; you\'re creating a comfortable, healthy environment for you and your loved ones. Take the first step toward peace of mind and durability—protect your investment today.'
        },
        'plastering': {
            title: 'Plastering',
            description: 'Plastering transforms spaces, creating smooth canvases for creativity and shelter, showcasing skill and dedication in every layer applied.'
        },
        'stone-masonry': {
            title: 'Stone Masonry',
            description: 'Stone masonry combines artistry and structural integrity through the careful selection and arrangement of natural stone to create durable, appealing structures. Skilled masons use traditional techniques for perfect fitting, ensuring strength and stability. This craft enhances aesthetics while providing excellent insulation and longevity, making it suitable for residential and commercial projects. Whether a grand façade or a patio, stone masonry adds a timeless quality to construction.'
        },
        'renovation': {
            title: 'Renovation',
            description: 'Renovation is a process of renewal that starts with a vision. Updating old buildings brings a new viewpoint, with every decision showcasing personal style and transforming a structure into a home. While it can be tough, it builds resilience, adaptability, and creativity, encouraging teamwork. The value of renovation comes from the lessons learned, highlighting the need for patience and discovering hidden potential. It proves that change is achievable and that we can create inspiring spaces with effort. Embrace renovation as an opportunity to shape both spaces and the future.'
        },
        'painting': {
            title: 'Painting',
            description: 'Painting is an expressive art form that transforms blank canvases into vibrant visual narratives. By blending colors, textures, and techniques, painters convey emotions and tell stories that resonate with viewers. Whether it\'s a serene landscape, an abstract composition, or a detailed portrait, each stroke of the brush reveals the artist\'s unique perspective. Painting not only enhances environments but also invites reflection, inspiration, and a deeper appreciation for creativity. Embrace the world of painting to explore the limitless possibilities of artistic expression.'
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

    // Expose so other components (e.g. the gallery footer link) can open the same modal
    window.openServiceModal = openServiceModal;

    // Open modal on Learn More click (cards)
    document.querySelectorAll('.btn-learn-more').forEach(btn => {
        btn.addEventListener('click', () => {
            openServiceModal(btn.getAttribute('data-service'));
        });
    });

    // Open modal from Services dropdown nav links
    document.querySelectorAll('.service-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            servicesMenu.classList.remove('active');
            openServiceModal(link.getAttribute('data-service'));
        });
    });

    // Close modal
    function closeModal() {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    serviceModal.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
            closeModal();
        }
    });
});

// --- Gallery Logic (Filter, Dynamic Text, and Scroll) ---
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const dynamicLink = document.getElementById('dynamic-gallery-link');
    const galleryTrack = document.getElementById('gallery-track');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

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

            dynamicLink.innerHTML = `
                ${linkTexts[selectedFilter]}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            `;
            dynamicLink.setAttribute('data-service', selectedFilter);
            dynamicLink.setAttribute('href', '#' + selectedFilter);

            galleryTrack.scrollLeft = 0;
            updateScrollButtons();
        });
    });

    // Open the corresponding service modal, replicating the service cards' "Learn more" behavior
    dynamicLink.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceKey = dynamicLink.getAttribute('data-service') || 'waterproofing';
        if (typeof window.openServiceModal === 'function') {
            window.openServiceModal(serviceKey);
        }
    });

    const scrollAmount = 824;

    scrollLeftBtn.addEventListener('click', () => {
        galleryTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
        galleryTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    function updateScrollButtons() {
        if (galleryTrack.scrollLeft <= 1) {
            scrollLeftBtn.style.display = 'none';
        } else {
            scrollLeftBtn.style.display = 'flex';
        }

        if (Math.ceil(galleryTrack.scrollLeft + galleryTrack.clientWidth) >= galleryTrack.scrollWidth) {
            scrollRightBtn.style.display = 'none';
        } else {
            scrollRightBtn.style.display = 'flex';
        }
    }

    galleryTrack.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    updateScrollButtons();
});

// --- Multi-Step Form Logic ---
document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const totalSteps = 4;

    const formSteps = document.querySelectorAll('.form-step');
    const stepNodes = document.querySelectorAll('.step-node');
    const nextBtns = document.querySelectorAll('.btn-next');
    const backBtns = document.querySelectorAll('.btn-back');
    const optionBtns = document.querySelectorAll('.option-btn');

    function updateFormStep(step) {
        formSteps.forEach(stepEl => {
            if (parseInt(stepEl.getAttribute('data-step')) === step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });

        stepNodes.forEach(node => {
            const nodeStep = parseInt(node.getAttribute('data-step-node'));
            if (nodeStep === step) {
                node.classList.add('active');
                node.classList.remove('completed');
                node.textContent = nodeStep;
            } else if (nodeStep < step) {
                node.classList.remove('active');
                node.classList.add('completed');
                node.textContent = '✓';
            } else {
                node.classList.remove('active');
                node.classList.remove('completed');
                node.textContent = nodeStep;
            }
        });
    }

    // --- Step 1 validation ---
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const step1Error = document.getElementById('step1-error');

    function validateStep1() {
        const name = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        fullnameInput.classList.toggle('input-error', !name);
        emailInput.classList.toggle('input-error', !emailOk);

        if (!name && !email) {
            step1Error.textContent = 'Please enter your name and email address so we can reach you.';
        } else if (!name) {
            step1Error.textContent = 'Please enter your full name.';
        } else if (!emailOk) {
            step1Error.textContent = 'Please enter a valid email address.';
        } else {
            step1Error.hidden = true;
            return true;
        }
        step1Error.hidden = false;
        return false;
    }

    [fullnameInput, emailInput].forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
            step1Error.hidden = true;
        });
    });

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep === 1 && !validateStep1()) {
                return;
            }
            if (currentStep < totalSteps) {
                currentStep++;
                updateFormStep(currentStep);
            }
        });
    });

    // --- Submit -> success state ---
    const briefForm = document.getElementById('brief-form');
    const formSuccess = document.getElementById('form-success');
    const stepProgress = document.querySelector('.step-progress');
    const successDoneBtn = document.getElementById('success-done-btn');

    briefForm.addEventListener('submit', (e) => {
        e.preventDefault();
        briefForm.hidden = true;
        stepProgress.hidden = true;
        formSuccess.hidden = false;
    });

    function resetBriefForm() {
        briefForm.reset();
        document.querySelectorAll('.option-btn.selected').forEach(b => b.classList.remove('selected'));
        currentStep = 1;
        updateFormStep(currentStep);
        formSuccess.hidden = true;
        briefForm.hidden = false;
        stepProgress.hidden = false;
    }

    successDoneBtn.addEventListener('click', () => {
        resetBriefForm();
        const quoteModal = document.getElementById('quote-modal');
        if (quoteModal && quoteModal.classList.contains('active')) {
            // Delegate closing (and returning the form to Contact) to the quote modal's close button
            document.getElementById('quote-modal-close').click();
        }
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateFormStep(currentStep);
            }
        });
    });

    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parentGrid = btn.closest('.option-grid');
            parentGrid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
});

// --- Quote Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const quoteModal = document.getElementById('quote-modal');
    const quoteModalClose = document.getElementById('quote-modal-close');
    const quoteFormSlot = document.getElementById('quote-form-slot');
    const formCard = document.querySelector('.contact-form-card');
    const formCardHome = formCard.parentElement; // the Contact section

    function openQuoteModal() {
        // Move the actual multi-stage form into the modal so it is the exact
        // same form (same elements, listeners, and step state) as in Contact.
        quoteFormSlot.appendChild(formCard);
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeQuoteModal() {
        quoteModal.classList.remove('active');
        document.body.style.overflow = '';
        // Return the form to its original place in the Contact section
        formCardHome.appendChild(formCard);
    }

    // Wire up every "Quote" button (navbar, hero, about)
    document.querySelectorAll('button.btn, button.btn-text').forEach(btn => {
        if (btn.textContent.trim() === 'Quote') {
            btn.addEventListener('click', () => {
                navContent.classList.remove('active'); // close mobile menu if open
                openQuoteModal();
            });
        }
    });

    quoteModalClose.addEventListener('click', closeQuoteModal);

    quoteModal.addEventListener('click', (e) => {
        if (e.target === quoteModal) {
            closeQuoteModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quoteModal.classList.contains('active')) {
            closeQuoteModal();
        }
    });

    // The form's "Cancel" button also closes the modal when the form is inside it
    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (quoteModal.classList.contains('active')) {
                closeQuoteModal();
            }
        });
    }
});
// --- Sticky Header Scroll Effect ---
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');

    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});

// --- Contact Buttons Scroll to Contact Section ---
document.addEventListener('DOMContentLoaded', () => {
    const contactSection = document.getElementById('contact');

    document.querySelectorAll('button.btn').forEach(btn => {
        if (btn.textContent.trim() === 'Contact') {
            btn.addEventListener('click', () => {
                navContent.classList.remove('active');
                contactSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });

    // "Work" button in About scrolls to the gallery
    document.querySelectorAll('button.btn').forEach(btn => {
        if (btn.textContent.trim() === 'Work') {
            btn.addEventListener('click', () => {
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
            });
        }
    });

    // Mobile nav: close the menu after tapping an anchor link
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            navContent.classList.remove('active');
        });
    });
});

// --- Scroll-Reveal Animations ---
document.addEventListener('DOMContentLoaded', () => {
    const revealTargets = [
        '.hero-content',
        '.about-content',
        '.about-image',
        '.services-header',
        '.service-card',
        '.gallery-header',
        '.gallery-filters',
        '.gallery-wrapper',
        '.gallery-footer',
        '.contact-info',
        '.contact-form-card',
        '.footer-main'
    ];

    const elements = document.querySelectorAll(revealTargets.join(', '));
    elements.forEach(el => el.classList.add('reveal'));

    // Gentle stagger for the service cards grid
    document.querySelectorAll('.service-card').forEach((card, i) => {
        card.style.transitionDelay = `${(i % 3) * 90}ms`;
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(el => observer.observe(el));
    } else {
        elements.forEach(el => el.classList.add('revealed'));
    }
});

// --- Gallery Lightbox ---
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

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

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
    lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
});
