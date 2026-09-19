// --- Three.js 3D Cosmic Space Background ---
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    canvasContainer.appendChild(renderer.domElement);

    // Star circular texture generator for authentic glowing celestial orbs
    function createStarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(224, 242, 254, 0.9)');
        gradient.addColorStop(0.55, 'rgba(96, 165, 250, 0.35)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }
    const starTexture = createStarTexture();

    // 1. Deep Field Galaxy Stars
    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const starPalette = [
        new THREE.Color('#ffffff'), // Pure White Star
        new THREE.Color('#93c5fd'), // Light Blue Star
        new THREE.Color('#60a5fa'), // Deep Sky Blue Star
        new THREE.Color('#c084fc'), // Soft Nebula Violet Star
        new THREE.Color('#38bdf8'), // Electric Cyan Star
    ];

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starPositions[i3] = (Math.random() - 0.5) * 30;
        starPositions[i3 + 1] = (Math.random() - 0.5) * 30;
        starPositions[i3 + 2] = (Math.random() - 0.5) * 22;

        const color = starPalette[Math.floor(Math.random() * starPalette.length)];
        starColors[i3] = color.r;
        starColors[i3 + 1] = color.g;
        starColors[i3 + 2] = color.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 0.08,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const starMesh = new THREE.Points(starGeo, starMaterial);
    scene.add(starMesh);

    // 2. Cosmic Wave & Nebula Dust Flow
    const waveCount = 650;
    const waveGeo = new THREE.BufferGeometry();
    const wavePositions = new Float32Array(waveCount * 3);
    const initialWaveX = new Float32Array(waveCount);
    const initialWaveY = new Float32Array(waveCount);
    const initialWaveZ = new Float32Array(waveCount);
    const waveColors = new Float32Array(waveCount * 3);

    for (let i = 0; i < waveCount; i++) {
        const i3 = i * 3;
        const x = (Math.random() - 0.5) * 16;
        const y = (Math.random() - 0.5) * 14;
        const z = (Math.random() - 0.5) * 10;
        
        wavePositions[i3] = x;
        wavePositions[i3 + 1] = y;
        wavePositions[i3 + 2] = z;

        initialWaveX[i] = x;
        initialWaveY[i] = y;
        initialWaveZ[i] = z;

        const color = Math.random() > 0.45 ? new THREE.Color('#38bdf8') : new THREE.Color('#a855f7');
        waveColors[i3] = color.r;
        waveColors[i3 + 1] = color.g;
        waveColors[i3 + 2] = color.b;
    }

    waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    waveGeo.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

    const waveMaterial = new THREE.PointsMaterial({
        size: 0.09,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const waveMesh = new THREE.Points(waveGeo, waveMaterial);
    scene.add(waveMesh);

    camera.position.z = 4;

    // Mouse & Parallax Interaction
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

    // Scroll parallax tracking
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.0008;
        targetY = mouseY * 0.0008;

        // Gentle constant celestial rotation
        starMesh.rotation.y += 0.0004;
        starMesh.rotation.x += 0.0002;

        waveMesh.rotation.y += 0.0007;
        waveMesh.rotation.x += 0.0003;

        // Smooth mouse reaction
        starMesh.rotation.y += 0.03 * (targetX - starMesh.rotation.y);
        starMesh.rotation.x += 0.03 * (targetY - starMesh.rotation.x);
        waveMesh.rotation.y += 0.04 * (targetX * 1.4 - waveMesh.rotation.y);
        waveMesh.rotation.x += 0.04 * (targetY * 1.4 - waveMesh.rotation.x);

        // Smooth scroll parallax on camera
        const targetCamY = -scrollY * 0.0009;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;

        // Mathematical harmonic cosmic wave without position drift
        const wavePosArr = waveMesh.geometry.attributes.position.array;
        for (let i = 0; i < waveCount; i++) {
            const i3 = i * 3;
            wavePosArr[i3 + 1] = initialWaveY[i] + Math.sin(elapsedTime * 0.9 + initialWaveX[i] * 0.7) * 0.25;
            wavePosArr[i3] = initialWaveX[i] + Math.cos(elapsedTime * 0.7 + initialWaveZ[i] * 0.7) * 0.15;
        }
        waveMesh.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
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

// --- Custom Fluid Cursor with Lerp Follower ---
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
if (cursorDot && cursorRing) {
    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: mousePos.x, y: mousePos.y };

    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        cursorDot.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px)`;
    });

    function updateCursorRing() {
        ringPos.x += (mousePos.x - ringPos.x) * 0.18;
        ringPos.y += (mousePos.y - ringPos.y) * 0.18;
        cursorRing.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
        requestAnimationFrame(updateCursorRing);
    }
    updateCursorRing();

    // Hover state expansion
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
            tl.from(".hero-badge", { scale: 0.85, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" })
              .from(".hero-title", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
              .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
              .from(".hero-description", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
              .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
        }
    }

    // Splash Screen Transition with Digital Counter
    const splashScreen = document.getElementById('splash-screen');
    const splashText = document.getElementById('splash-text');
    const splashCounter = document.getElementById('splash-counter');
    const splashBar = document.getElementById('splash-bar');

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
        .to(splashText, { scale: 0.85, opacity: 0, duration: 0.35, ease: "power2.inOut" })
        .to(splashScreen, { opacity: 0, duration: 0.35, ease: "power2.out" }, "-=0.15")
        .add(() => {
            animateHero();
        }, "-=0.1");
    }

    if (splashScreen) {
        // If arriving with a hash, dismiss immediately and jump to anchor
        if (window.location.hash) {
            splashScreen.style.display = 'none';
            splashDismissed = true;
            animateHero();
            setTimeout(() => scrollToTarget(window.location.hash), 150);
        } else {
            // Animate numeric progress loader from 0% to 100%
            let progressObj = { value: 0 };
            const countTween = gsap.to(progressObj, {
                value: 100,
                duration: 0.9,
                ease: "power2.out",
                onUpdate: () => {
                    const val = Math.round(progressObj.value);
                    if (splashCounter) splashCounter.textContent = `${val}%`;
                    if (splashBar) splashBar.style.width = `${val}%`;
                },
                onComplete: () => {
                    setTimeout(() => {
                        dismissSplash();
                    }, 150);
                }
            });

            function handleImmediateDismiss() {
                countTween.kill();
                dismissSplash();
            }

            // User can skip or scroll through immediately
            window.addEventListener('wheel', (e) => {
                if (e.deltaY > 5) handleImmediateDismiss();
            }, { passive: true });

            window.addEventListener('touchmove', handleImmediateDismiss, { passive: true });

            window.addEventListener('keydown', (e) => {
                if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
                    handleImmediateDismiss();
                }
            });

            window.addEventListener('scroll', () => {
                if (window.scrollY > 10) handleImmediateDismiss();
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
}
