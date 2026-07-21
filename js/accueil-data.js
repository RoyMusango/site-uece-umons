// Phase 8 — Injection des contenus éditables de la page d'accueil.
// Source : data/accueil.json (édité par le CMS, jamais le HTML directement).
// Même filet de sécurité que js/gala-data.js et js/faq-data.js : si le JSON
// est absent, invalide ou que le fetch échoue (ouverture en fichier local),
// la page garde exactement son contenu HTML par défaut.
// Sécurité : injection par textContent uniquement — jamais innerHTML.
(function () {
    'use strict';

    // Résout un chemin pointé dans l'objet JSON. Gère aussi les index de
    // tableau ("decouvrir.entrees.0.titre") car un tableau accepte une clé
    // numérique sous forme de chaîne.
    function lire(data, chemin) {
        return chemin.split('.').reduce(function (obj, cle) {
            return (obj && typeof obj === 'object') ? obj[cle] : undefined;
        }, data);
    }

    // [data-edit] : remplace le texte de l'élément par la valeur du JSON.
    function injecterTextes(data) {
        document.querySelectorAll('[data-edit]').forEach(function (el) {
            var val = lire(data, el.getAttribute('data-edit'));
            if (typeof val === 'string' && val.trim() !== '') {
                el.textContent = val;
            }
        });
    }

    fetch('data/accueil.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('accueil.json introuvable'); }
            return reponse.json();
        })
        .then(function (data) {
            injecterTextes(data);
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
