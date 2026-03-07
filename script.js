// ===== DENTRAVO V3 — CINEMATIC ENGINE =====

(function() {
    'use strict';

    // ===== SCROLL REVEAL =====
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObs.observe(el));

    // ===== NAV SCROLL =====
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        nav?.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ===== MOBILE NAV =====
    document.querySelector('.nav-toggle')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('open');
    });

    // ===== STAR FIELD =====
    const starsEl = document.querySelector('.stars');
    if (starsEl) {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 120; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                left:${Math.random()*100}%;
                top:${Math.random()*100}%;
                width:${Math.random()*2+1}px;
                height:${Math.random()*2+1}px;
                opacity:${Math.random()*0.5+0.2};
                animation-delay:${Math.random()*5}s;
                animation-duration:${Math.random()*3+2}s;
            `;
            frag.appendChild(star);
        }
        starsEl.appendChild(frag);
    }

    // ===== PARALLAX SHAPES =====
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const s = window.scrollY;
                document.querySelectorAll('.hero-shape').forEach((el, i) => {
                    const speed = 0.08 + i * 0.04;
                    el.style.transform = `translateY(${s * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ===== ANIMATED COUNTERS =====
    function animateCounter(el) {
        const raw = el.getAttribute('data-count');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        if (raw === null) return;
        const target = parseFloat(raw);
        if (isNaN(target)) { el.textContent = raw; return; }

        const duration = 2200;
        const start = performance.now();

        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4); // quartic ease-out
            const current = Math.round(target * eased);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const counterEls = document.querySelectorAll('[data-count]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCounter(e.target);
                counterObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObs.observe(el));

    // ===== TILT EFFECT ON DEVICE =====
    const device = document.querySelector('.device-frame');
    if (device && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const rect = device.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / window.innerWidth;
            const dy = (e.clientY - cy) / window.innerHeight;
            device.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg)`;
        });
    }

    // ===== SMOOTH ANCHOR SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile nav if open
                document.querySelector('.nav-links')?.classList.remove('open');
            }
        });
    });

})();
