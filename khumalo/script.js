// --- Mobile Hamburger Menu Toggle ---
const hamburger = document.getElementById('hamburger');
const navContent = document.getElementById('nav-content');

hamburger.addEventListener('click', () => {
    navContent.classList.toggle('active');
});

// --- Gallery Dropdown Toggle ---
const galleryBtn = document.getElementById('gallery-btn');
const galleryMenu = document.getElementById('gallery-menu');

galleryBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevents page jump if it acts as a link
    galleryMenu.classList.toggle('active');
});

// Close dropdown if clicking outside of it
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        galleryMenu.classList.remove('active');
    }
});

// --- Gallery Logic (Filter, Dynamic Text, and Scroll) ---
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const dynamicLink = document.getElementById('dynamic-gallery-link');
    const galleryTrack = document.getElementById('gallery-track');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    // Dictionary for dynamic link texts
    const linkTexts = {
        'construction': 'Learn more about construction',
        'decorative-art': 'Learn more about decorative art',
        'tiling': 'Learn more about tiling'
    };

    // 1. Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedFilter = btn.getAttribute('data-filter');

            // Show/Hide relevant images
            galleryItems.forEach(item => {
                if (item.getAttribute('data-category') === selectedFilter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Update Dynamic Link text
            dynamicLink.innerHTML = `
                ${linkTexts[selectedFilter]} 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            `;

            // Reset scroll position to start
            galleryTrack.scrollLeft = 0;
            updateScrollButtons();
        });
    });

    // 2. Scroll Button Actions
    const scrollAmount = 824; // Width of image (800) + gap (24)

    scrollLeftBtn.addEventListener('click', () => {
        galleryTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
        galleryTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // 3. Scroll Boundary Logic (Hiding buttons at edges)
    function updateScrollButtons() {
        // Hide Left Button if at the very beginning
        if (galleryTrack.scrollLeft <= 1) {
            scrollLeftBtn.style.display = 'none';
        } else {
            scrollLeftBtn.style.display = 'flex';
        }

        // Hide Right Button if at the very end 
        // (Using Math.ceil to account for fractional pixel scrolling values)
        if (Math.ceil(galleryTrack.scrollLeft + galleryTrack.clientWidth) >= galleryTrack.scrollWidth) {
            scrollRightBtn.style.display = 'none';
        } else {
            scrollRightBtn.style.display = 'flex';
        }
    }

    // Attach boundary logic to native scroll event and window resize
    galleryTrack.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    // Initialize button states on load
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

    // 1. Update View Function
    function updateFormStep(step) {
        // Update Active Step Container
        formSteps.forEach(stepEl => {
            if (parseInt(stepEl.getAttribute('data-step')) === step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });

        // Update Step Nodes (1, 2, 3, 4)
        stepNodes.forEach(node => {
            const nodeStep = parseInt(node.getAttribute('data-step-node'));
            if (nodeStep === step) {
                node.classList.add('active');
                node.classList.remove('completed');
                node.textContent = nodeStep;
            } else if (nodeStep < step) {
                node.classList.remove('active');
                node.classList.add('completed');
                node.textContent = '✓'; // Completed checkmark from wireframe
            } else {
                node.classList.remove('active');
                node.classList.remove('completed');
                node.textContent = nodeStep;
            }
        });
    }

    // 2. Next Button Click
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateFormStep(currentStep);
            }
        });
    });

    // 3. Back Button Click
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateFormStep(currentStep);
            }
        });
    });

    // 4. Toggle Option Button Selection (Grid Items)
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Unselect sibling options in the same grid
            const parentGrid = btn.closest('.option-grid');
            parentGrid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            
            // Select clicked option
            btn.classList.add('selected');
        });
    });
});