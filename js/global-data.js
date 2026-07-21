// Phase 8 — Injection du contenu GLOBAL, présent sur toutes les pages :
// le pied de page (contact, réseaux, copyright). Source : data/global.json
// (édité par le CMS). Chargé sur les 8 pages.
//
// Marqueur DÉDIÉ « data-global » (et « data-global-href » pour les liens) :
// volontairement différent du « data-edit » des scripts de page, pour qu'un
// injecteur de page et cet injecteur global ne se marchent jamais dessus
// (ex. la page Guide a aussi un bloc « contact.titre »).
//
// Même filet de sécurité que les autres : si le JSON manque ou ne charge pas,
// le pied de page garde son contenu HTML par défaut. Jamais innerHTML.
(function () {
    'use strict';

    function lire(data, chemin) {
        return chemin.split('.').reduce(function (obj, cle) {
            return (obj && typeof obj === 'object') ? obj[cle] : undefined;
        }, data);
    }

    function injecter(data) {
        // Textes
        document.querySelectorAll('[data-global]').forEach(function (el) {
            var val = lire(data, el.getAttribute('data-global'));
            if (typeof val === 'string' && val.trim() !== '') {
                el.textContent = val;
            }
        });
        // Liens (attribut href) — réseaux sociaux
        document.querySelectorAll('[data-global-href]').forEach(function (el) {
            var val = lire(data, el.getAttribute('data-global-href'));
            if (typeof val === 'string' && val.trim() !== '') {
                el.setAttribute('href', val);
            }
        });
    }

    fetch('data/global.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('global.json introuvable'); }
            return reponse.json();
        })
        .then(injecter)
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
