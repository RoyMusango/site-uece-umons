/* ==========================================================================
   motion-gate.js — Détection des paliers de motion (CONTEXTE_REPRISE §5)

   Palier 0 (sans JS)  : aucune classe posée, tout le contenu est visible —
                         le CSS de base ne cache jamais rien.
   Palier 1+2          : html.motion-on  = JS actif + pas de reduced-motion
                         + pas de saveData → reveals CSS+IO (js/reveals.js).
   Palier 2 (desktop)  : html.motion-rich = motion-on + ≥1024px + pointer:fine
                         + deviceMemory ≥ 4 (si exposé) → GSAP + ScrollTrigger
                         en import() dynamique, spectacle dans motion-desktop.js.

   URLs ESM vérifiées le 11/07/2026 (jsdelivr +esm, HTTP 200).
   ========================================================================== */
(function () {
    'use strict';

    var html = document.documentElement;
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

    /* --- Évaluation des paliers --- */
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = !!(navigator.connection && navigator.connection.saveData);

    if (reduced || saveData) { return; }         /* palier 0 côté motion : rien */

    html.classList.add('motion-on');             /* palier 1+2 : reveals actifs */

    var mem = navigator.deviceMemory;            /* non exposé (Firefox/Safari) = OK */
    var rich = window.matchMedia('(min-width: 1024px)').matches &&
               window.matchMedia('(pointer: fine)').matches &&
               (mem === undefined || mem >= 4);

    if (rich) { html.classList.add('motion-rich'); }

    /* --- Après load + un moment d'inactivité : rotations du motif, puis
           GSAP + ScrollTrigger si palier 2. Jamais avant : le décor ne doit
           pas concurrencer le LCP (mesuré : -10 pts sinon). --- */
    function loadRich() {
        Promise.all([
            import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm'),
            import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm'),
            import('./js/motion-desktop.js')
        ]).then(function (mods) {
            var gsap = mods[0].gsap || mods[0].default;
            var ScrollTrigger = mods[1].ScrollTrigger || mods[1].default;
            mods[2].init(gsap, ScrollTrigger);
        }).catch(function () {
            /* Décor uniquement : en cas d'échec CDN, le site reste complet. */
        });
    }

    function whenIdle() {
        document.body.classList.add('anim-ready');   /* rotations du motif */
        if (!rich) { return; }
        if (window.requestIdleCallback) { requestIdleCallback(loadRich, { timeout: 3000 }); }
        else { setTimeout(loadRich, 1200); }
    }

    if (document.readyState === 'complete') { whenIdle(); }
    else { window.addEventListener('load', whenIdle, { once: true }); }
})();
