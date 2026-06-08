document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       0. MOBILE HAMBURGER MENU
       ========================================================= */
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    /* =========================================================
       1. HERO TYPING ANIMATION
       ========================================================= */
    const typewriterElement = document.getElementById('typewriter');
    
    // The phrases you want to type
    const words = ["TUTOR.GUIDE.INSPIRE", "LEARN.GROW.SUCCEED"];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove a character
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add a character
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        // Base typing speed
        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2; // Deletes faster than it types
        }

        // If word is completely typed out
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2500; // Pause for 2.5 seconds
            isDeleting = true;
        } 
        // If word is completely deleted
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex++; // Move to the next word
            
            // Loop back to the start
            if (wordIndex === words.length) {
                wordIndex = 0; 
            }
            typeSpeed = 500; // Pause before typing the new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start the animation 1 second after the page loads
    if(typewriterElement) {
        setTimeout(type, 1000);
    }


    /* =========================================================
       2. GALLERY CAROUSEL (Dynamic Version)
       ========================================================= */
    const track = document.querySelector('.carousel-track');
    const slides = track ? Array.from(track.children) : [];
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-nav');

    // Only run this if the gallery actually exists on the page
    if (track && slides.length > 0) {
        // Checks if we are on a phone (1 slide) or desktop (3 slides)
        const visibleSlides = window.innerWidth <= 1000 ? 1 : 3; 
        // The maximum number of clicks we can make before hitting the end
        const maxIndex = slides.length - visibleSlides; 

        // 1. Auto-generate the correct number of dots
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('current-slide'); // Highlight the first one
            dotsNav.appendChild(dot);
        }
        const dots = Array.from(dotsNav.children);

        let currentIndex = 0;

        // 2. The Sliding Engine
        const updateCarousel = (index) => {
            // Gets width of one card + the 32px gap
            const slideWidth = slides[0].getBoundingClientRect().width + 32; 
            
            // Move track
            track.style.transform = 'translateX(-' + (slideWidth * index) + 'px)';
            
            // Update dots
            dots.forEach(dot => dot.classList.remove('current-slide'));
            dots[index].classList.add('current-slide');
        };

        // 3. Right Arrow
        nextButton.addEventListener('click', () => {
            if (currentIndex >= maxIndex) {
                currentIndex = 0; // Loop to start
            } else {
                currentIndex++;
            }
            updateCarousel(currentIndex);
        });

        // 4. Left Arrow
        prevButton.addEventListener('click', () => {
            if (currentIndex <= 0) {
                currentIndex = maxIndex; // Jump to end
            } else {
                currentIndex--;
            }
            updateCarousel(currentIndex);
        });

        // 5. Clickable Dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel(currentIndex);
            });
        });

        // 6. Mobile Swipe Detection (Updates dots when dragging with finger)
        const trackWrapper = document.querySelector('.carousel-track-wrapper');
        
        trackWrapper.addEventListener('scroll', () => {
            // Only run this math if we are on a mobile screen
            if (window.innerWidth <= 1000) {
                const scrollPosition = trackWrapper.scrollLeft;
                // Get the width of one mobile card + the 16px gap we set in CSS
                const slideWidth = slides[0].getBoundingClientRect().width + 16; 
                
                // Math.round figures out which slide is closest to the center
                const newIndex = Math.round(scrollPosition / slideWidth);

                // Update the dots
                dots.forEach(dot => dot.classList.remove('current-slide'));
                if (dots[newIndex]) {
                    dots[newIndex].classList.add('current-slide');
                }
                
                // Keep the global index updated so the arrows don't get confused
                currentIndex = newIndex; 
            }
        });
    }
});

/* =========================================================
       3. ASYNC FEEDBACK SWAPPER
       ========================================================= */
    
    // The master database of 8 reviews
    const allReviews = [
        { text: `"The tutors here don't just teach subjects. They teach you how to think, how to push through when things get hard."`, name: "Name Surname", role: "Current student" },
        { text: `"My daughter went from struggling to confident. The one-on-one attention made all the difference."`, name: "Name Surname", role: "Parent" },
        { text: `"I was failing math, but my tutor broke it down so simply. I just got an A on my finals!"`, name: "Name Surname", role: "Grade 11 student" },
        { text: `"An incredible investment in our son's future. The mentors actually care about his overall wellbeing."`, name: "Name Surname", role: "Parent" },
        { text: `"The online platform is so easy to use. I can get help exactly when I need it before a big test."`, name: "Name Surname", role: "Grade 12 student" },
        { text: `"I never thought I'd actually look forward to extra lessons, but the environment is so supportive."`, name: "Name Surname", role: "Current student" },
        { text: `"The tutors communicate constantly with us. We always know exactly where our child stands."`, name: "Name Surname", role: "Parents" },
        { text: `"They didn't just help me pass; they helped me get accepted into my dream university."`, name: "Name Surname", role: "Alumni" }
    ];

    const slots = [
        document.getElementById('slot-1'),
        document.getElementById('slot-2'),
        document.getElementById('slot-3'),
        document.getElementById('slot-4')
    ];

    if (slots[0]) {
        // Keeps track of which reviews are currently on screen (0-3) and which are waiting in the pool (4-7)
        let activeIndices = [0, 1, 2, 3];
        let poolIndices = [4, 5, 6, 7];

        // Staggered timers (in milliseconds) so they NEVER fade out at the exact same time
        // 8s, 11s, 9.5s, 13s
        const intervals = [8000, 11000, 9500, 13000];

        slots.forEach((slot, i) => {
            setInterval(() => {
                const cardInner = slot.querySelector('.card-inner');
                
                // 1. Trigger the CSS fade-out
                cardInner.classList.add('fade-out');

                // 2. Wait 500ms for it to become invisible, THEN swap the text
                setTimeout(() => {
                    // Grab a random review from the waiting pool
                    const randomPoolIndex = Math.floor(Math.random() * poolIndices.length);
                    const newReviewIndex = poolIndices[randomPoolIndex];

                    // Swap the IDs so the old review goes back into the waiting pool
                    const oldReviewIndex = activeIndices[i];
                    activeIndices[i] = newReviewIndex;
                    poolIndices[randomPoolIndex] = oldReviewIndex;

                    const reviewData = allReviews[newReviewIndex];

                    // Inject the new text into the HTML
                    slot.querySelector('.quote').innerText = reviewData.text;
                    slot.querySelector('.author-name').innerText = reviewData.name;
                    slot.querySelector('.author-role').innerText = reviewData.role;

                    // 3. Remove the class to trigger the CSS fade-in
                    cardInner.classList.remove('fade-out');
                }, 500); 

            }, intervals[i]);
        });
}
    
/* =========================================================
   4. UNIVERSAL MODAL ENGINE (Unified & Bug-Free)
   ========================================================= */
const registerModal = document.getElementById("registerModal");
const openRegisterBtns = document.querySelectorAll(".open-register-btn");
const engageButtons = document.querySelectorAll("[data-target]");
const allCloseBtns = document.querySelectorAll(".close-modal");

// 1. OPEN REGISTRATION MODAL
openRegisterBtns.forEach(button => {
    button.addEventListener("click", function(e) {
        e.preventDefault(); 
        registerModal.style.display = "block";
        document.body.style.overflow = "hidden"; // Locks background scroll
    });
});

// 2. OPEN "LEARN MORE" ENGAGE MODALS
engageButtons.forEach(button => {
    button.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("data-target"); 
        const targetModal = document.getElementById(targetId);
        if (targetModal) {
            targetModal.classList.add("active"); // Triggers your CSS animations
            targetModal.style.display = "flex"; 
            document.body.style.overflow = "hidden"; // Locks background scroll
        }
    });
});

// 3. UNIVERSAL CLOSE BUTTONS (The X)
allCloseBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        const parentModal = this.closest(".modal-overlay, .engage-modal");
        if (parentModal) {
            parentModal.classList.remove("active");
            parentModal.style.display = "none";
            document.body.style.overflow = ""; // Unlocks background scroll! (Fixes the freeze)
        }
    });
});

// 4. UNIVERSAL BACKGROUND CLICK
window.addEventListener("click", function(event) {
    if (event.target.classList.contains("modal-overlay") || event.target.classList.contains("engage-modal")) {
        event.target.classList.remove("active");
        event.target.style.display = "none";
        document.body.style.overflow = ""; // Unlocks background scroll! (Fixes the freeze)
    }
});