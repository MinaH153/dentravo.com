// ===== DENTRAVO V8 — ELEVATED =====
(function() {
    'use strict';

    // Theme (inline script in <head> handles initial apply)
    var html = document.documentElement;
    function updateToggleUI() {
        var isDark = html.getAttribute('data-theme') === 'dark';
        document.querySelectorAll('.theme-toggle').forEach(function(btn) {
            var moon = btn.querySelector('.theme-icon-moon');
            var sun = btn.querySelector('.theme-icon-sun');
            var label = btn.querySelector('.theme-label');
            if (moon) moon.style.display = isDark ? 'none' : 'block';
            if (sun) sun.style.display = isDark ? 'block' : 'none';
            if (label) label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        });
    }
    updateToggleUI();

    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.theme-toggle');
        if (!btn) return;
        var isDark = html.getAttribute('data-theme') === 'dark';
        if (isDark) {
            html.removeAttribute('data-theme');
            localStorage.setItem('dentravo-theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('dentravo-theme', 'dark');
        }
        updateToggleUI();
    });

    // Scroll reveal (unobserve after visible for perf)
    var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(function(el) { obs.observe(el); });

    // Single scroll handler (nav + back-to-top)
    var nav = document.querySelector('.nav');
    var topBtn = document.querySelector('.back-to-top');
    var lastScrollY = 0;
    var ticking = false;
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(function() {
                if (nav) nav.classList.toggle('scrolled', lastScrollY > 60);
                if (topBtn) topBtn.classList.toggle('show', lastScrollY > 400);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mobile nav (hamburger to X)
    var toggle = document.querySelector('.nav-toggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            toggle.classList.toggle('active');
            document.querySelector('.nav-links').classList.toggle('open');
        });
    }

    // Animated counters
    function animateCounter(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var pre = el.getAttribute('data-prefix') || '';
        var suf = el.getAttribute('data-suffix') || '';
        if (isNaN(target)) { el.textContent = el.getAttribute('data-count'); return; }
        var start = performance.now();
        function tick(now) {
            var p = Math.min((now - start) / 2200, 1);
            el.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 4))).toLocaleString() + suf;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    var cObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function(el) { cObs.observe(el); });

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var id = a.getAttribute('href');
            if (id === '#') return;
            var t = document.querySelector(id);
            if (t) {
                e.preventDefault();
                t.scrollIntoView({ behavior: 'smooth', block: 'start' });
                var navLinks = document.querySelector('.nav-links');
                if (navLinks) navLinks.classList.remove('open');
            }
        });
    });

    // Back to top click
    if (topBtn) {
        topBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

})();
