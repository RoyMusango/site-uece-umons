/* ==========================================================================
   gala-cta.js — Récap prix + CTA sticky mobile (Phase 3)
   La barre est masquée dès que la zone de réservation est à l'écran :
   elle ne recouvre JAMAIS le formulaire ni les boutons PayPal.
   Sans JS : la barre reste visible (simple lien d'ancre, aucun risque).
   ========================================================================== */
(function () {
    'use strict';

    var bar = document.getElementById('ctaSticky');
    var zone = document.getElementById('participantForm');
    if (!bar || !zone || !('IntersectionObserver' in window)) { return; }

    var io = new IntersectionObserver(function (entries) {
        bar.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { rootMargin: '0px 0px -20% 0px' });

    io.observe(zone);
})();
