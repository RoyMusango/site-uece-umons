// Phase 6 — Carrousel de la mission (association.html).
// Défilement automatique toutes les 6 s, en pause au survol, et JAMAIS
// de défilement automatique si l'utilisateur préfère réduire les
// animations (il garde alors les flèches et les puces).
(function () {
    'use strict';
    var el = document.getElementById('carrouselMission');
    if (!el || typeof bootstrap === 'undefined' || !bootstrap.Carousel) { return; }

    var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mouvementReduit) {
        bootstrap.Carousel.getOrCreateInstance(el, { ride: false, interval: false });
    } else {
        bootstrap.Carousel.getOrCreateInstance(el, { ride: 'carousel', interval: 6000, pause: 'hover' });
    }
})();
