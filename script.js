// ===== DENTRAVO V4 — PRESTIGE ENGINE =====
(function() {
    'use strict';

    // Scroll reveal
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s').forEach(el => obs.observe(el));

    // Nav scroll
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        nav?.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Mobile nav
    document.querySelector('.nav-toggle')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('open');
    });

    // Star field
    const starsEl = document.querySelector('.stars');
    if (starsEl) {
        const f = document.createDocumentFragment();
        for (let i = 0; i < 100; i++) {
            const s = document.createElement('div');
            s.className = 'star';
            s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;opacity:${Math.random()*.4+.15};animation-delay:${Math.random()*5}s;animation-duration:${Math.random()*3+2}s`;
            f.appendChild(s);
        }
        starsEl.appendChild(f);
    }

    // Floating particles
    const particlesEl = document.querySelector('.particles');
    if (particlesEl) {
        const colors = ['#818CF8','#38BDF8','#34D399','#FBBF24','#A78BFA'];
        const f = document.createDocumentFragment();
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const c = colors[Math.floor(Math.random()*colors.length)];
            const size = Math.random()*4+2;
            p.style.cssText = `left:${Math.random()*100}%;bottom:${-Math.random()*20}%;width:${size}px;height:${size}px;background:${c};opacity:${Math.random()*.4+.1};animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*10}s`;
            f.appendChild(p);
        }
        particlesEl.appendChild(f);
    }

    // Parallax shapes
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const s = window.scrollY;
                document.querySelectorAll('.hero-shape').forEach((el, i) => {
                    el.style.transform = `translateY(${s * (0.06 + i * 0.03)}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Animated counters
    function animateCounter(el) {
        const raw = el.getAttribute('data-count');
        const pre = el.getAttribute('data-prefix') || '';
        const suf = el.getAttribute('data-suffix') || '';
        const target = parseFloat(raw);
        if (isNaN(target)) { el.textContent = raw; return; }
        const dur = 2200;
        const start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            el.textContent = pre + Math.round(target * eased).toLocaleString() + suf;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    const cObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const t = document.querySelector(id);
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); document.querySelector('.nav-links')?.classList.remove('open'); }
        });
    });

})();
