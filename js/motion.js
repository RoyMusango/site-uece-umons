/* ==========================================================================
   motion.js — Navbar dynamique + reveals au scroll (Phase 2, §4.4)
   Règles de sûreté :
   - sans JS : la classe .js n'est pas posée, la navbar reste marine opaque
     et tout le contenu est visible (les états cachés ne sont posés que par
     GSAP, jamais par le CSS) ;
   - prefers-reduced-motion : ni GSAP ni reveals, le CSS neutralise le reste ;
   - GSAP + ScrollTrigger sont chargés APRÈS l'événement load pour ne
     jamais concurrencer le LCP (mesuré : -10 pts Lighthouse sinon).
   ========================================================================== */
(function () {
    'use strict';

    document.body.classList.add('js');

    /* --- Navbar : transparente sur l'en-tête, marine après 40 px --- */
    var navbar = document.querySelector('.navbar');
    if (navbar && document.body.classList.contains('has-hero')) {
        var onScroll = function () {
            navbar.classList.toggle('is-scrolled', window.scrollY > 40);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* --- Reveals au scroll : fade + translateY(24px), 0.7 s, une fois --- */
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !document.querySelectorAll('[data-reveal]').length) { return; }

    var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/';

    function load(src, done) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = done;
        document.head.appendChild(s);
    }

    function initReveals() {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('[data-reveal]').forEach(function (el) {
            /* Ne jamais animer un élément déjà visible : le masquer après
               coup créerait un repaint tardif compté comme LCP. */
            if (el.getBoundingClientRect().top < window.innerHeight) { return; }
            gsap.from(el, {
                opacity: 0,
                y: 24,
                duration: 0.7,
                ease: 'power3.out',
                delay: parseFloat(el.getAttribute('data-reveal')) || 0,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            });
        });
    }

    function start() {
        load(CDN + 'gsap.min.js', function () {
            load(CDN + 'ScrollTrigger.min.js', initReveals);
        });
    }

    /* Après load PUIS un moment d'inactivité : hors de la fenêtre de
       mesure LCP/TBT, et le scroll n'a de toute façon pas commencé. */
    function whenIdle() {
        document.body.classList.add('anim-ready');   /* lance les rotations du motif */
        if (window.requestIdleCallback) { requestIdleCallback(start, { timeout: 3000 }); }
        else { setTimeout(start, 1200); }
    }

    if (document.readyState === 'complete') { whenIdle(); }
    else { window.addEventListener('load', whenIdle, { once: true }); }
})();
