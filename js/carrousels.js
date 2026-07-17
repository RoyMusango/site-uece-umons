// Phase 6 — Initialisation de tous les carrousels automatiques du site
// (attribut data-carrousel-auto : mission sur association.html, affiches
// du hero sur index.html…).
// Défilement automatique toutes les 6 s, en pause au survol, et JAMAIS de
// défilement automatique si l'utilisateur préfère réduire les animations
// (il garde alors les puces et le glissement au doigt).
(function () {
    'use strict';
    if (typeof bootstrap === 'undefined' || !bootstrap.Carousel) { return; }

    var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-carrousel-auto]').forEach(function (el) {
        if (mouvementReduit) {
            bootstrap.Carousel.getOrCreateInstance(el, { ride: false, interval: false });
        } else {
            bootstrap.Carousel.getOrCreateInstance(el, { ride: 'carousel', interval: 6000, pause: 'hover' });
        }
    });
})();
