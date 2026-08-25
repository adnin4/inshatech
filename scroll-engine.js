/**
 * IINSHA AI LAB â€” Scroll Animation Engine v2 (Stable)
 * 
 * CRITICAL FIX: Never hide content with opacity: 0.
 * All animations use ONLY transforms (translateY, translateX, scale).
 * Content is ALWAYS visible. Animations are decorative enhancements only.
 */

(function() {
    'use strict';

    function initScrollEngine() {
        // SAFETY FIRST: Force all reveal elements to be visible immediately
        document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale, .stagger-children > *').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.visibility = 'visible';
        });

        // Check if GSAP is available
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('[IINSHA] GSAP/ScrollTrigger not loaded â€” content visible, animations skipped.');
            return;
        }

        // Check reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // === NAVBAR SHRINK ON SCROLL ===
        const navbar = document.querySelector('.iinsha-navbar');
        if (navbar) {
            ScrollTrigger.create({
                start: 'top -80',
                onUpdate: (self) => {
                    if (self.direction === 1 && window.scrollY > 80) {
                        navbar.classList.add('navbar-scrolled');
                    } else if (window.scrollY <= 80) {
                        navbar.classList.remove('navbar-scrolled');
                    }
                }
            });
        }

        // === REVEAL UP â€” gentle slide up, NO opacity change ===
        gsap.utils.toArray('.reveal-up').forEach(el => {
            gsap.fromTo(el,
                { y: 20 },
                {
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // === REVEAL FADE â€” no animation, already visible ===
        // (intentionally empty â€” content is shown by CSS)

        // === REVEAL LEFT ===
        gsap.utils.toArray('.reveal-left').forEach(el => {
            gsap.fromTo(el,
                { x: -30 },
                {
                    x: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // === REVEAL RIGHT ===
        gsap.utils.toArray('.reveal-right').forEach(el => {
            gsap.fromTo(el,
                { x: 30 },
                {
                    x: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // === REVEAL SCALE ===
        gsap.utils.toArray('.reveal-scale').forEach(el => {
            gsap.fromTo(el,
                { scale: 0.95 },
                {
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // === STAGGER CHILDREN â€” subtle slide, NO opacity ===
        gsap.utils.toArray('.stagger-children').forEach(parent => {
            const children = parent.children;
            gsap.fromTo(children,
                { y: 15 },
                {
                    y: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: parent,
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // === SECTION PARALLAX ===
        gsap.utils.toArray('.parallax-bg').forEach(el => {
            gsap.to(el, {
                y: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });

        // === HERO ENTRANCE â€” page load animation ===
        const heroTimeline = gsap.timeline({ delay: 0.2 });
        
        const heroEyebrow = document.querySelector('.hero-eyebrow');
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle-text');
        const heroActions = document.querySelector('.hero-actions');
        const heroStatus = document.querySelector('.hero-status');

        // Hero elements are already visible â€” just add a subtle entrance
        if (heroEyebrow) heroTimeline.from(heroEyebrow, { y: 15, duration: 0.4, ease: 'power2.out' });
        if (heroTitle) heroTimeline.from(heroTitle, { y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.2');
        if (heroSubtitle) heroTimeline.from(heroSubtitle, { y: 15, duration: 0.4, ease: 'power2.out' }, '-=0.2');
        if (heroActions) heroTimeline.from(heroActions, { y: 15, duration: 0.4, ease: 'power2.out' }, '-=0.2');
        if (heroStatus) heroTimeline.from(heroStatus, { y: 10, duration: 0.3, ease: 'power2.out' }, '-=0.1');

        // === ARCHITECTURE NODE CONNECTIONS ===
        gsap.utils.toArray('.arch-connection-line').forEach(line => {
            gsap.from(line, {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: line,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // === COUNTER ANIMATION ===
        gsap.utils.toArray('[data-counter]').forEach(el => {
            const target = parseInt(el.getAttribute('data-counter'), 10);
            if (isNaN(target)) return;
            
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to({ val: 0 }, {
                        val: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: function() {
                            el.textContent = Math.round(this.targets()[0].val);
                        }
                    });
                }
            });
        });

        // === MAGNETIC CTA BUTTONS ===
        document.querySelectorAll('.magnetic-cta').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.15,
                    y: y * 0.15,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });

        // === SMOOTH SCROLL FOR ANCHOR LINKS ===
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: target, offsetY: 80 },
                        ease: 'power3.inOut'
                    });
                }
            });
        });

        // Final refresh to catch any late-loading elements
        setTimeout(() => ScrollTrigger.refresh(), 300);
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollEngine);
    } else {
        initScrollEngine();
    }

    window.initScrollEngine = initScrollEngine;
})();

