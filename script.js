// --- Three.js Background Animation (Cursor-Responsive 3D Space Stars) ---
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    canvasContainer.appendChild(renderer.domElement);

    // Star Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 950;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const starColorChoices = [
        new THREE.Color(0x60a5fa), // Bright Sky Blue
        new THREE.Color(0x8b5cf6), // Purple Nebula
        new THREE.Color(0x38bdf8), // Cyan Star
        new THREE.Color(0xffffff)  // Pure White Star
    ];

    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 15;
        posArray[i + 1] = (Math.random() - 0.5) * 15;
        posArray[i + 2] = (Math.random() - 0.5) * 15;

        const c = starColorChoices[Math.floor(Math.random() * starColorChoices.length)];
        colorArray[i] = c.r;
        colorArray[i + 1] = c.g;
        colorArray[i + 2] = c.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Interaction (Dynamic cursor-following parallax)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - windowHalfX);
            mouseY = (event.touches[0].clientY - windowHalfY);
        }
    }, { passive: true });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Smoothly lerp towards the cursor position
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
        
        // Dynamic wave oscillation effect
        const positions = particlesMesh.geometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            const x = particlesGeometry.attributes.position.array[i3];
            positions[i3 + 1] += Math.sin(elapsedTime + x) * 0.001;
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- Lenis Momentum Smooth Scrolling (Phenomenon Studio & Nixtio standard) ---
let lenis = null;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
    });

    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
    }

    if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
}

// --- Custom Fluid Cursor Dot ---
const cursorDot = document.getElementById('cursor-dot');
if (cursorDot) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Hover state reactions
    const interactiveEls = document.querySelectorAll('a, button, .spotlight-card, input, [role="button"]');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}


// --- Interactive Spotlight Cards & 3D Tilt ---
document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Subtle 3D perspective tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// --- Magnetic Buttons Effect ---
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// --- GSAP Animations & Navigation ---
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    let splashDismissed = false;
    let heroAnimated = false;

    // Smooth scroll helper with Lenis
    function scrollToTarget(selector) {
        const target = document.querySelector(selector);
        if (!target) return;

        if (lenis) {
            lenis.scrollTo(target, { offset: -75, duration: 1.2 });
        } else {
            const navHeight = 75;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    }

    // Hero entrance animation
    function animateHero() {
        if (heroAnimated) return;
        heroAnimated = true;

        if (document.querySelector(".hero-title")) {
            const tl = gsap.timeline();
            tl.fromTo(".hero-badge", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" })
              .fromTo(".hero-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.3")
              .fromTo(".hero-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.5")
              .fromTo(".hero-description", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4")
              .fromTo(".hero-buttons", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4");
        }
    }

    // Pre-hide hero elements so they don't flash behind the splash during its fade-out
    if (document.getElementById('splash-screen')) {
        gsap.set([".hero-badge", ".hero-title", ".hero-subtitle", ".hero-description", ".hero-buttons"], { opacity: 0 });
    }

    // Splash Screen Transition with Digital Counter & Technical Status
    const splashScreen = document.getElementById('splash-screen');
    const splashText = document.getElementById('splash-text');
    const splashCounter = document.getElementById('splash-counter');
    const splashBar = document.getElementById('splash-bar');
    const splashStatus = document.getElementById('splash-status');

    function dismissSplash(targetHash) {
        if (splashDismissed) {
            if (targetHash) scrollToTarget(targetHash);
            return;
        }
        splashDismissed = true;

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
        .to(splashText, { scale: 0.9, opacity: 0, duration: 0.45, ease: "power2.inOut" })
        .to(splashScreen, { opacity: 0, duration: 0.45, ease: "power2.out" }, "-=0.2")
        .add(() => {
            animateHero();
        }, "-=0.15");
    }

    if (splashScreen) {
        // If arriving with a hash, dismiss immediately and jump to anchor
        if (window.location.hash) {
            splashScreen.style.display = 'none';
            splashDismissed = true;
            animateHero();
            setTimeout(() => scrollToTarget(window.location.hash), 150);
        } else {
            // Cinematic numeric progress loader (2.6s duration so visitor can clearly see the intro screen)
            let progressObj = { value: 0 };
            const countTween = gsap.to(progressObj, {
                value: 100,
                duration: 2.6,
                ease: "power1.inOut",
                onUpdate: () => {
                    const val = Math.round(progressObj.value);
                    if (splashCounter) splashCounter.textContent = `${val}%`;
                    if (splashBar) splashBar.style.width = `${val}%`;

                    if (splashStatus) {
                        if (val < 18) {
                            splashStatus.textContent = "INITIALIZING KERNEL & HYPERVISORS";
                        } else if (val < 42) {
                            splashStatus.textContent = "ORCHESTRATING LOCAL AI & NEURAL DAGs";
                        } else if (val < 68) {
                            splashStatus.textContent = "SYNCING GITOPS INFRASTRUCTURE";
                        } else if (val < 88) {
                            splashStatus.textContent = "ENGAGING ZERO-TRUST EDGE MESH";
                        } else if (val < 100) {
                            splashStatus.textContent = "VERIFYING TELEMETRY & HARDWARE BUS";
                        } else {
                            splashStatus.textContent = "SYSTEM ARCHITECTURE READY • ONLINE";
                            splashStatus.classList.remove('text-gray-500');
                            splashStatus.classList.add('text-emerald-400');
                        }
                    }
                },
                onComplete: () => {
                    // Hold 500ms at 100% so the completed state is clearly visible
                    setTimeout(() => {
                        dismissSplash();
                    }, 500);
                }
            });

            function handleImmediateDismiss() {
                countTween.kill();
                dismissSplash();
            }

            // User can skip or scroll through immediately if desired
            window.addEventListener('wheel', (e) => {
                if (e.deltaY > 25) handleImmediateDismiss();
            }, { passive: true });

            window.addEventListener('touchmove', handleImmediateDismiss, { passive: true });

            window.addEventListener('keydown', (e) => {
                if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
                    handleImmediateDismiss();
                }
            });

            window.addEventListener('scroll', () => {
                if (window.scrollY > 40) handleImmediateDismiss();
            }, { passive: true });

            splashScreen.addEventListener('click', handleImmediateDismiss);
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

    // Homelab System Topology Interactive Filter
    const topoFilterBtns = document.querySelectorAll('.topo-filter-btn');
    const topoContainer = document.getElementById('topology-diagram-container');

    if (topoFilterBtns.length > 0 && topoContainer) {
        topoFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                topoFilterBtns.forEach(b => {
                    b.classList.remove('bg-blue-600', 'text-white', 'border-blue-500');
                    b.classList.add('bg-white/5', 'text-gray-400', 'border-white/10');
                });
                btn.classList.remove('bg-white/5', 'text-gray-400', 'border-white/10');
                btn.classList.add('bg-blue-600', 'text-white', 'border-blue-500');

                const allItems = topoContainer.querySelectorAll('.topo-item');
                
                if (filter === 'all') {
                    topoContainer.classList.remove('topo-filter-active');
                    allItems.forEach(item => item.classList.remove('is-highlighted'));
                } else {
                    topoContainer.classList.add('topo-filter-active');
                    allItems.forEach(item => {
                        const layer = item.getAttribute('data-layer');
                        if (layer && (layer === filter || layer.includes(filter))) {
                            item.classList.add('is-highlighted');
                        } else {
                            item.classList.remove('is-highlighted');
                        }
                    });
                }
            });
        });
    }
}

