// Phase 6 — Injection des contenus éditables de la page FAQ.
// Source : data/faq.json (édité par le CMS). Même filet de sécurité que
// js/gala-data.js : si le JSON manque ou ne charge pas, la page garde son
// contenu HTML par défaut. Injection par textContent uniquement.
(function () {
    'use strict';

    function lire(data, chemin) {
        return chemin.split('.').reduce(function (obj, cle) {
            return (obj && typeof obj === 'object') ? obj[cle] : undefined;
        }, data);
    }

    function injecterTextes(data) {
        document.querySelectorAll('[data-edit]').forEach(function (el) {
            var val = lire(data, el.getAttribute('data-edit'));
            if (typeof val === 'string' && val.trim() !== '') {
                el.textContent = val;
            }
        });
    }

    function injecterQuestions(data) {
        var section = document.querySelector('[data-edit-faq]');
        if (!section || !Array.isArray(data.questions) || data.questions.length === 0) { return; }
        section.querySelectorAll('details').forEach(function (d) { d.remove(); });
        data.questions.forEach(function (item) {
            if (!item || !item.question || !item.reponse) { return; }
            var details = document.createElement('details');
            var summary = document.createElement('summary');
            summary.textContent = item.question;
            var reponse = document.createElement('p');
            reponse.textContent = item.reponse;
            details.appendChild(summary);
            details.appendChild(reponse);
            section.appendChild(details);
        });
    }

    fetch('data/faq.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('faq.json introuvable'); }
            return reponse.json();
        })
        .then(function (data) {
            injecterTextes(data);
            injecterQuestions(data);
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
