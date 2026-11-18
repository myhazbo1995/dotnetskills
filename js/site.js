(function () {
    'use strict';

    var THEME_KEY = 'theme';
    var MOBILE_NAV_BREAKPOINT = 860;
    var root = document.documentElement;


    // Footer year ---------------------------------------------------------
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Theme toggle --------------------------------------------------------
    var themeToggle = document.querySelector('.theme-toggle');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function currentTheme() {
        var explicit = root.getAttribute('data-theme');
        if (explicit) return explicit;
        return systemDark.matches ? 'dark' : 'light';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var next = currentTheme() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage blocked: theme lasts this visit only */ }
        });
    }

    // Mobile navigation ---------------------------------------------------
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.getElementById('nav-links');

    function setNavOpen(open) {
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        navLinks.classList.toggle('is-open', open);
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            setNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
        });
        navLinks.addEventListener('click', function (e) {
            if (e.target.closest('a')) setNavOpen(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
                setNavOpen(false);
                navToggle.focus();
            }
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > MOBILE_NAV_BREAKPOINT) setNavOpen(false);
        });
    }

    // Header border + active nav link (scroll-spy) ------------------------
    var header = document.querySelector('.site-header');
    var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links > a[href^="#"]'));
    var spyTargets = navAnchors
        .map(function (a) { return { link: a, section: document.getElementById(a.getAttribute('href').slice(1)) }; })
        .filter(function (t) { return t.section; });
    var SPY_OFFSET_RATIO = 0.35; // a section is "current" once its top passes 35% of the viewport

    function updateOnScroll() {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);

        var line = window.innerHeight * SPY_OFFSET_RATIO;
        var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        var current = null;
        spyTargets.forEach(function (t) {
            if (t.section.getBoundingClientRect().top <= line) current = t;
        });
        if (atBottom && spyTargets.length) current = spyTargets[spyTargets.length - 1];

        spyTargets.forEach(function (t) { t.link.classList.toggle('is-active', t === current); });
    }

    window.addEventListener('scroll', updateOnScroll, { passive: true });
    window.addEventListener('resize', updateOnScroll);
    updateOnScroll();

    // Reveal on scroll ----------------------------------------------------
    var revealEls = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
})();
