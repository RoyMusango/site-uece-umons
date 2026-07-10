/* ==========================================================================
   motion.js — Navbar dynamique (Phase 2, §4.4)
   Règles de sûreté :
   - sans JS : la classe .js n'est pas posée, la navbar reste marine opaque
     et tout le contenu est visible ;
   - l'entrée du hero et la rotation du motif sont en CSS pur (style.css),
     neutralisées par prefers-reduced-motion ;
   - GSAP + ScrollTrigger seront chargés ici APRÈS l'événement load
     (Phase 2b, reveals au scroll) pour ne jamais concurrencer le LCP.
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
})();
