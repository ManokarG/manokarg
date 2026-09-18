// --- Three.js Background Animation ---
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    canvasContainer.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 900;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x8b5cf6, // Purple-ish
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
        
        // Wave effect
        const positions = particlesMesh.geometry.attributes.position.array;
        for(let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            const x = particlesGeometry.attributes.position.array[i3];
            positions[i3 + 1] += Math.sin(elapsedTime + x) * 0.001;
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- GSAP Animations & Navigation ---
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    let splashDismissed = false;
    let heroAnimated = false;

    // Smooth scroll helper with fixed navbar offset
    function scrollToTarget(selector) {
        const target = document.querySelector(selector);
        if (!target) return;
        const navHeight = 75;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Hero entrance animation
    function animateHero() {
        if (heroAnimated) return;
        heroAnimated = true;

        if (document.querySelector(".hero-title")) {
            const tl = gsap.timeline();
            tl.from(".hero-badge", { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" })
              .from(".hero-title", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
              .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
              .from(".hero-description", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
              .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
        }
    }

    // Splash Screen Transition
    const splashScreen = document.getElementById('splash-screen');
    const splashText = document.getElementById('splash-text');

    function dismissSplash(targetHash) {
        if (splashDismissed) {
            if (targetHash) scrollToTarget(targetHash);
            return;
        }
        splashDismissed = true;
        sessionStorage.setItem('splashDismissed', 'true');

        if (!splashScreen) {
            animateHero();
            if (targetHash) scrollToTarget(targetHash);
            return;
        }

        gsap.timeline({
            onComplete: () => {
                splashScreen.style.display = 'none';
                ScrollTrigger.refresh();
                if (targetHash) {
                    scrollToTarget(targetHash);
                }
            }
        })
        .to(splashText, { scale: 0.85, opacity: 0, duration: 0.35, ease: "power2.inOut" })
        .to(splashScreen, { opacity: 0, duration: 0.35, ease: "power2.out" }, "-=0.15")
        .add(() => {
            animateHero();
        }, "-=0.1");
    }

    if (splashScreen) {
        // If already dismissed in this session or arriving with a hash, dismiss immediately
        if (sessionStorage.getItem('splashDismissed') === 'true' || window.location.hash) {
            splashScreen.style.display = 'none';
            splashDismissed = true;
            animateHero();
            if (window.location.hash) {
                setTimeout(() => scrollToTarget(window.location.hash), 100);
            }
        } else {
            // Auto dismiss after 2.5s if user remains idle
            let dismissTimer = setTimeout(() => {
                dismissSplash();
            }, 2500);

            function handleTrigger() {
                clearTimeout(dismissTimer);
                dismissSplash();
            }

            // Listen for user scroll gestures or clicks
            window.addEventListener('wheel', (e) => {
                if (e.deltaY > 5) handleTrigger();
            }, { passive: true });

            window.addEventListener('touchmove', handleTrigger, { passive: true });

            window.addEventListener('keydown', (e) => {
                if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
                    handleTrigger();
                }
            });

            window.addEventListener('scroll', () => {
                if (window.scrollY > 10) handleTrigger();
            }, { passive: true });

            splashScreen.addEventListener('click', handleTrigger);
        }
    } else {
        animateHero();
    }

    // Anchor Navigation Handling
    function setupNavigation() {
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const hash = this.getAttribute('href');
                if (!hash || hash === '#') return;

                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    e.preventDefault();

                    if (!splashDismissed) {
                        dismissSplash(hash);
                    } else {
                        scrollToTarget(hash);
                    }

                    history.pushState(null, '', hash);

                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });

        // Active link highlighting on scroll
        const navSections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-link[href^="#"]');

        function updateActiveNav() {
            const scrollPos = window.pageYOffset;
            navSections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 120;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navItems.forEach(item => {
                        if (item.getAttribute('href') === `#${sectionId}`) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav, { passive: true });
        updateActiveNav();
    }
    setupNavigation();

    // Generic Animate on Scroll (Play once so content NEVER disappears on scroll)
    const sections = gsap.utils.toArray('section');
    sections.forEach(section => {
        const animatedElements = section.querySelectorAll('.animate-on-scroll');
        if (animatedElements.length > 0) {
            gsap.from(animatedElements, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                },
                y: 35,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    });

    // Timeline Progress Bar Animation
    if (document.querySelector(".timeline-container")) {
        gsap.to(".timeline-progress", {
            scrollTrigger: {
                trigger: ".timeline-container",
                start: "top center",
                end: "bottom center",
                scrub: 1
            },
            height: "100%",
            ease: "none"
        });

        // Timeline Nodes pop-in
        gsap.utils.toArray('.timeline-node').forEach(node => {
            gsap.from(node, {
                scrollTrigger: {
                    trigger: node,
                    start: "top center+=100",
                    toggleActions: "play none none none",
                    once: true
                },
                scale: 0,
                boxShadow: "0 0 0px rgba(0,0,0,0)",
                duration: 0.5,
                ease: "back.out(2)"
            });
        });
    }

    // Homelab Architecture Animation
    if (document.querySelector("#homelab-graphic")) {
        const homelabTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#homelab-graphic",
                start: "top 75%",
                toggleActions: "play none none none",
                once: true
            }
        });

        homelabTl.from(".hl-node", {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.5)"
        })
        .from(".hl-icon", {
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(2)"
        }, "-=0.4")
        .from(".hl-connection", {
            strokeDashoffset: 100,
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
        }, "-=0.2")
        .from(".hl-text", {
            opacity: 0,
            x: -10,
            duration: 0.4,
            stagger: 0.1
        }, "-=0.4");
    }
}
