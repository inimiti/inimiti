/* =========================
   LENIS GLOBAL (TOUTES PAGES)
========================= */

const lenis = new Lenis({
    smoothWheel: true,
    smoothTouch: false
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


/* =========================
   PARALLAX GLOBAL (OPTIONNEL)
========================= */

const bgElements = document.querySelectorAll(
    ".page-qui-sommes-nous, .composer-container, .page-realisations, .page-contact"
);

if (bgElements.length) {
    lenis.on("scroll", ({ scroll }) => {
        bgElements.forEach(el => {
            el.style.transform = `translateY(${scroll * -0.05}px)`;
        });
    });
}


/* =========================
   PAGE DIRECTEURS ARTISTIQUES — SCROLL BACKGROUNDS
========================= */

const daMembers = document.querySelectorAll('.da-member');
const daBackgrounds = document.querySelectorAll('.da-bg-item');

if (daMembers.length > 0 && daBackgrounds.length > 0) {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px', // Trigger when element is in the middle 60% of screen (+/- 30% from center)
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = entry.target.getAttribute('data-index');
                if (index !== null) {
                    daBackgrounds.forEach(bg => bg.classList.remove('active'));
                    if (daBackgrounds[index]) {
                        daBackgrounds[index].classList.add('active');
                    }
                }
            }
        });
    }, observerOptions);

    daMembers.forEach(member => {
        observer.observe(member);
    });
}


/* =========================
   PAGE PROGRAMMES — CAROUSEL HORIZONTAL
========================= */

if (document.body.classList.contains("programmes")) {
    const slides = document.querySelectorAll(".program-slide");
    const nextButtons = document.querySelectorAll(".btn-next");

    let currentIndex = 0;
    let isTransitioning = false; // Prevent rapid clicking and manage transition state

    // Fonction pour changer de slide (suivant)
    function goToNextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        // 1. Fade out current slide
        slides[currentIndex].classList.remove("active");

        // 2. Wait for fade out to complete (1s = 1000ms)
        setTimeout(() => {
            // 3. Reset scroll
            if (typeof lenis !== 'undefined') lenis.scrollTo(0, { immediate: true });
            else window.scrollTo(0, 0);

            // 4. Update index and fade in new slide
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add("active");

            isTransitioning = false;
        }, 750); // Wait 1s matches CSS transition
    }

    // Fonction pour changer de slide (précédent)
    function goToPrevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        // 1. Fade out current slide
        slides[currentIndex].classList.remove("active");

        // 2. Wait for fade out to complete (1s = 1000ms)
        setTimeout(() => {
            // 3. Reset scroll
            if (typeof lenis !== 'undefined') lenis.scrollTo(0, { immediate: true });
            else window.scrollTo(0, 0);

            // 4. Update index and fade in new slide
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            slides[currentIndex].classList.add("active");

            isTransitioning = false;
        }, 750);
    }

    // Ajoute l'écouteur d'événement sur chaque bouton "programme suivant"
    nextButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            goToNextSlide();
        });
    });

    // Ajoute l'écouteur pour "programme précédent"
    const prevButtons = document.querySelectorAll(".btn-prev");
    prevButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            goToPrevSlide();
        });
    });
}


/* =========================
   PAGE COMPOSEZ VOTRE EVENEMENT
========================= */

if (document.body.classList.contains("composer-page")) {
    // State to track selections
    const currentSelection = {
        formation: "...",
        duree: "...",
        repertoire: "..."
    };

    const summaryEl = document.getElementById('dynamic-text-bottom');
    const topText = document.getElementById('dynamic-text-top');
    const nameInput = document.getElementById('input-client-name');

    // Update bottom summary
    function updateSummaryDisplay() {
        if (summaryEl) {
            summaryEl.textContent = `FORMATION : ${currentSelection.formation}   DUREE : ${currentSelection.duree}   REPERTOIRE : ${currentSelection.repertoire}`;
        }
    }

    // Handle button selections
    const groups = ['formation', 'duree', 'repertoire'];

    groups.forEach(section => {
        const groupEl = document.getElementById('group-' + section);
        if (!groupEl) return;

        const buttons = groupEl.querySelectorAll('.config-btn');
        const svgGroup = document.getElementById('svg-' + section);

        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // 1. Manage active class
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 2. Update SVG Color
                const color = btn.getAttribute('data-color');
                if (svgGroup && color) {
                    const paths = svgGroup.getElementsByTagName('path');
                    for (let path of paths) {
                        path.style.fill = color;
                    }
                }

                // 3. Update Text State
                const selectedText = btn.textContent.trim();
                currentSelection[section] = selectedText;
                updateSummaryDisplay();
            });
        });
    });


    // Handle Name Input
    if (nameInput && topText) {
        nameInput.addEventListener('input', (e) => {
            const val = e.target.value;
            topText.textContent = val ? "évènement sur-mesure de " + val : "évènement sur-mesure de ...";
        });
    }

    // Initialize display
    updateSummaryDisplay();
}

/* =========================
   PAGE REALISATIONS
========================= */
if (document.body.classList.contains("realisations")) {
    const carousels = document.querySelectorAll('.project-carousel');

    carousels.forEach(slider => {
        // Variables pour le lissage (Smoothness variables)
        let targetScroll = slider.scrollLeft;
        let currentScroll = slider.scrollLeft;
        const lerpFactor = 0.08;

        // Prevent Lenis from handling scroll on this element
        slider.setAttribute('data-lenis-prevent', 'true');

        // Mouse Wheel Interaction
        slider.addEventListener('wheel', (e) => {
            e.preventDefault(); // Empêche le scroll vertical NATIF de la page
            e.stopPropagation(); // Empêche la propagation aux parents (et potentiellement Lenis)

            // Map vertical scroll (deltaY) to horizontal movement
            // Multiplier par un facteur pour ajuster la vitesse (ex: 1.5 ou 2)
            // On ajoute au targetScroll pour avancer
            const delta = e.deltaY || e.deltaX;
            targetScroll += delta * 1.5;
        }, { passive: false }); // passive: false nécessaire pour e.preventDefault()


        // Animation Loop for Smoothness (LERP)
        function animate() {
            // 1. Constrain target to scroll bounds
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            // Allow rubberbanding effect slightly or hard clamp? Let's hard clamp for now to avoid issues.
            let clampedTarget = Math.max(0, Math.min(targetScroll, maxScroll));

            // 2. Interpolate
            // Formula: current = current + (target - current) * factor
            currentScroll += (clampedTarget - currentScroll) * lerpFactor;

            // 3. Apply
            slider.scrollLeft = currentScroll;

            // 4. Loop
            requestAnimationFrame(animate);
        }

        // Start the loop for this slider
        animate();
    });
}
