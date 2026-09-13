// --- Three.js Background Animation ---
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
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
        particlesGeometry.attributes.position.array[i3 + 1] += Math.sin(elapsedTime + x) * 0.001;
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


// --- GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);

// Hero Section
const tl = gsap.timeline();

tl.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power4.out", delay: 0.2 })
  .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .from(".hero-description", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .from(".hero-badge", { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.4");

// Generic Animate on Scroll
const sections = gsap.utils.toArray('section:not(#home)');
sections.forEach(section => {
    gsap.from(section.querySelectorAll('.animate-on-scroll'), {
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });
});

// Timeline Progress Bar Animation
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
            toggleActions: "play none none reverse"
        },
        scale: 0,
        boxShadow: "0 0 0px rgba(0,0,0,0)",
        duration: 0.5,
        ease: "back.out(2)"
    });
});

// Homelab Architecture Animation
const homelabTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#homelab-graphic",
        start: "top 75%",
        toggleActions: "play none none reverse"
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
