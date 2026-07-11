/* ==========================================================================
   reveals.js — Révélations au scroll, tous paliers (IntersectionObserver)

   Actif uniquement si motion-gate.js a posé html.motion-on. Les états cachés
   des [data-reveal] vivent sous cette classe dans style.css : sans JS, en
   reduced-motion ou en saveData, tout le contenu est visible d'emblée.
   ========================================================================== */
(function () {
    'use strict';

    if (!document.documentElement.classList.contains('motion-on')) { return; }

    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) { return; }

    /* Décalage optionnel entre voisins : data-reveal="0.15" → delay 150 ms */
    els.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-reveal'));
        if (d) { el.style.transitionDelay = d + 's'; }
    });

    /* Les éléments déjà dans le viewport sont révélés dans le même tick que
       la pose de motion-on : aucun flash, aucun LCP retardé. */
    var vh = window.innerHeight;
    var pending = els.filter(function (el) {
        if (el.getBoundingClientRect().top < vh) {
            el.classList.add('is-in');
            return false;
        }
        return true;
    });

    if (!pending.length) { return; }

    if (!('IntersectionObserver' in window)) {
        pending.forEach(function (el) { el.classList.add('is-in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    pending.forEach(function (el) { io.observe(el); });
})();
