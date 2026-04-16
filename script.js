document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Grab the elements we need to interact with
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a'); // All the individual links

    // 2. Listen for a click on the hamburger icon
    mobileMenu.addEventListener('click', () => {
        // Toggle the 'active' class on the menu (shows/hides it)
        navLinks.classList.toggle('active');
        // Toggle the 'active' class on the hamburger (turns it into an 'X')
        mobileMenu.classList.toggle('active');
    });

    // 3. Pro UX Detail: Close the menu when a user actually clicks a link!
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

});

// --- HERO ICON SMART ANIMATION ---
    const iconContainer = document.getElementById('hero-icons-animated');
    const pills = document.querySelectorAll('.hero-icon-pill');

    function playHeroAnimation() {
        const initialDelay = 700; // Wait 700ms before starting
        const readTime = 2000;    // How long each icon stays open (2 seconds)
        const restTime = 3000;    // How long to stay in "original state" before looping again

        setTimeout(() => {
            // 1. Show Education
            iconContainer.classList.add('focus-mode');
            pills[0].classList.add('expanded');
            
            setTimeout(() => {
                // 2. Hide Edu, Show Life Skills
                pills[0].classList.remove('expanded');
                pills[1].classList.add('expanded');
                
                setTimeout(() => {
                    // 3. Hide Life Skills, Show Golf
                    pills[1].classList.remove('expanded');
                    pills[2].classList.add('expanded');
                    
                    setTimeout(() => {
                        // 4. Return to Original State (All 3 icons, no text)
                        pills[2].classList.remove('expanded');
                        iconContainer.classList.remove('focus-mode');
                        
                        // Restart the loop after resting
                        setTimeout(playHeroAnimation, restTime);
                        
                    }, readTime);
                }, readTime);
            }, readTime);
        }, initialDelay);
    }

    // Kick off the animation!
    playHeroAnimation();

    // --- PROGRAMMES "SMART ANIMATE" MODALS ---
    const cards = document.querySelectorAll('.pillar-card');
    const modals = document.querySelectorAll('.programme-modal');

    // 1. Open Modal when a card is clicked
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target'); // Gets "modal-edu", etc.
            const targetModal = document.getElementById(targetId);
            
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevents background from scrolling
            }
        });
    });

    // 2. Close Modal when clicking anywhere on the dark grey background
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            // Check if the user clicked the dark background, NOT the green text box
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restores background scrolling
            }
        });
    });

    // --- GALLERY PAGE: FILTER & LIGHTBOX ---
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // 1. Category Filtering
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                masonryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. Open Full-Screen Lightbox
    if (masonryItems.length > 0) {
        masonryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').getAttribute('src');
                lightboxImg.setAttribute('src', imgSrc);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            });
        });
    }

    // 3. Close Lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close if user clicks the dark background outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- STAFF CONTACT REVEAL ---
    const staffMembers = document.querySelectorAll('.staff-member');

    staffMembers.forEach(member => {
        // Find the icons and the hidden text box for this specific person
        const icons = member.querySelectorAll('.icon-btn');
        const revealBox = member.querySelector('.social-reveal');

        icons.forEach(icon => {
            icon.addEventListener('click', () => {
                const info = icon.getAttribute('data-info'); // Grabs the email or phone number

                // If the user clicks the icon that is already open, close it
                if (revealBox.innerHTML === info && revealBox.classList.contains('active')) {
                    revealBox.classList.remove('active');
                    
                    // Wait for the slide animation to finish before clearing the text
                    setTimeout(() => { revealBox.innerHTML = ''; }, 300);
                } else {
                    // Otherwise, swap the text and slide it open
                    revealBox.innerHTML = info;
                    revealBox.classList.add('active');
                }
            });
        });
    });