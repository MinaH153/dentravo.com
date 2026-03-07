// ===== DENTRAVO V6 — LIGHT/DARK + CONVENIENCE =====
(function() {
    'use strict';

    // ===== THEME TOGGLE =====
    const html = document.documentElement;
    const saved = localStorage.getItem('dentravo-theme');
    if (saved === 'dark') {
        html.setAttribute('data-theme', 'dark');
    }
    // Update toggle button state
    function updateToggleUI() {
        const isDark = html.getAttribute('data-theme') === 'dark';
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            const moon = btn.querySelector('.theme-icon-moon');
            const sun = btn.querySelector('.theme-icon-sun');
            const label = btn.querySelector('.theme-label');
            if (moon) moon.style.display = isDark ? 'none' : 'block';
            if (sun) sun.style.display = isDark ? 'block' : 'none';
            if (label) label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        });
    }
    // Initialize on load
    updateToggleUI();
    // Listen for clicks
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-toggle');
        if (!btn) return;
        const isDark = html.getAttribute('data-theme') === 'dark';
        if (isDark) {
            html.removeAttribute('data-theme');
            localStorage.setItem('dentravo-theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('dentravo-theme', 'dark');
        }
        updateToggleUI();
    });

    // ===== SCROLL REVEAL =====
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s').forEach(el => obs.observe(el));

    // ===== NAV SCROLL =====
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        nav?.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ===== MOBILE NAV =====
    document.querySelector('.nav-toggle')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('open');
    });

    // ===== ANIMATED COUNTERS =====
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

    // ===== SMOOTH ANCHOR SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const t = document.querySelector(id);
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); document.querySelector('.nav-links')?.classList.remove('open'); }
        });
    });

    // ===== BACK TO TOP =====
    const topBtn = document.querySelector('.back-to-top');
    if (topBtn) {
        window.addEventListener('scroll', () => {
            topBtn.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

})();
