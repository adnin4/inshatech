/**
 * IINSHA AI LAB — Scroll Animation Engine
 * GSAP ScrollTrigger powered cinematic scroll experience
 * 
 * All sections animate on scroll with purpose:
 * - Text reveals (staggered, from below)
 * - Section fade-in with parallax
 * - Node/card stagger animations
 * - Counter animations for verified data
 * - Smooth section transitions
 */

(function() {
    'use strict';

    function initScrollEngine() {
        // Check if GSAP is available
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('[IINSHA] GSAP/ScrollTrigger not loaded — scroll animations disabled.');
            // Still show all content
            document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        // Check reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
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

        // === REVEAL UP (text, headings, CTAs) ===
        gsap.utils.toArray('.reveal-up').forEach(el => {
            gsap.from(el, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // === REVEAL FADE ===
        gsap.utils.toArray('.reveal-fade').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // === REVEAL LEFT (slide from left) ===
        gsap.utils.toArray('.reveal-left').forEach(el => {
            gsap.from(el, {
                x: -80,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // === REVEAL RIGHT (slide from right) ===
        gsap.utils.toArray('.reveal-right').forEach(el => {
            gsap.from(el, {
                x: 80,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // === REVEAL SCALE ===
        gsap.utils.toArray('.reveal-scale').forEach(el => {
            gsap.from(el, {
                scale: 0.85,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // === STAGGER CHILDREN (cards, grid items) ===
        gsap.utils.toArray('.stagger-children').forEach(parent => {
            const children = parent.children;
            gsap.from(children, {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: parent,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
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

        // === HERO ENTRANCE (page load) ===
        const heroTimeline = gsap.timeline({ delay: 0.3 });
        
        const heroEyebrow = document.querySelector('.hero-eyebrow');
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle-text');
        const heroActions = document.querySelector('.hero-actions');
        const heroStatus = document.querySelector('.hero-status');

        if (heroEyebrow) heroTimeline.from(heroEyebrow, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' });
        if (heroTitle) heroTimeline.from(heroTitle, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
        if (heroSubtitle) heroTimeline.from(heroSubtitle, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
        if (heroActions) heroTimeline.from(heroActions, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
        if (heroStatus) heroTimeline.from(heroStatus, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');

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
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollEngine);
    } else {
        initScrollEngine();
    }

    window.initScrollEngine = initScrollEngine;
})();
