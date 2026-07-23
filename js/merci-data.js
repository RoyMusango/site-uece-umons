// Phase 12 — Injection des contenus éditables de la page de remerciement.
// Source : data/merci.json (édité par le CMS, jamais le HTML directement).
// Même filet de sécurité que les autres pages : si le JSON est absent ou que
// le fetch échoue, la page garde son contenu HTML par défaut.
// Sécurité : injection par textContent uniquement — jamais innerHTML.
(function () {
    'use strict';

    function lire(data, chemin) {
        return chemin.split('.').reduce(function (obj, cle) {
            return (obj && typeof obj === 'object') ? obj[cle] : undefined;
        }, data);
    }

    fetch('data/merci.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('merci.json introuvable'); }
            return reponse.json();
        })
        .then(function (data) {
            document.querySelectorAll('[data-edit]').forEach(function (el) {
                var val = lire(data, el.getAttribute('data-edit'));
                if (typeof val === 'string' && val.trim() !== '') {
                    el.textContent = val;
                }
            });
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
