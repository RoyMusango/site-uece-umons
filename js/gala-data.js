// Phase 5 — Injection des contenus éditables de la page Gala.
// Source : data/gala.json (édité par le CMS, jamais le HTML directement).
// Filet de sécurité : le HTML conserve son contenu par défaut ; si le JSON
// est absent, invalide ou que le fetch échoue (ouverture en fichier local),
// la page reste exactement telle quelle.
// Sécurité : injection par textContent uniquement — jamais innerHTML.
// ⚠️ Les PRIX ne passent pas par ce fichier : ils sont câblés dans le code
// de paiement gelé de gala.html (voir README, « Changer les prix »).
(function () {
    'use strict';

    // Résout un chemin pointé ("enBref.lieu") dans l'objet JSON.
    function lire(data, chemin) {
        return chemin.split('.').reduce(function (obj, cle) {
            return (obj && typeof obj === 'object') ? obj[cle] : undefined;
        }, data);
    }

    // [data-edit] : remplace le texte de l'élément.
    // [data-edit-lines] : idem, mais chaque retour à la ligne du JSON
    // devient un <br> (adresses, listes courtes).
    function injecterTextes(data) {
        document.querySelectorAll('[data-edit]').forEach(function (el) {
            var val = lire(data, el.getAttribute('data-edit'));
            if (typeof val === 'string' && val.trim() !== '') {
                el.textContent = val;
            }
        });
        document.querySelectorAll('[data-edit-lines]').forEach(function (el) {
            var val = lire(data, el.getAttribute('data-edit-lines'));
            if (typeof val !== 'string' || val.trim() === '') { return; }
            el.textContent = '';
            val.split('\n').forEach(function (ligne, i) {
                if (i > 0) { el.appendChild(document.createElement('br')); }
                el.appendChild(document.createTextNode(ligne));
            });
        });
    }

    // Reconstruit la timeline du programme (conteneur [data-edit-programme]).
    function injecterProgramme(data) {
        var conteneur = document.querySelector('[data-edit-programme]');
        if (!conteneur || !Array.isArray(data.programme) || data.programme.length === 0) { return; }
        conteneur.textContent = '';
        data.programme.forEach(function (item) {
            if (!item || !item.titre) { return; }
            var ligne = document.createElement('div');
            ligne.className = 'timeline-item';
            var heure = document.createElement('span');
            heure.className = 'timeline-time';
            heure.textContent = item.heure || '';
            var titre = document.createElement('strong');
            titre.textContent = item.titre;
            ligne.appendChild(heure);
            ligne.appendChild(document.createTextNode(' '));
            ligne.appendChild(titre);
            if (item.detail) {
                ligne.appendChild(document.createTextNode(' ' + item.detail));
            }
            conteneur.appendChild(ligne);
        });
    }

    // Reconstruit les questions/réponses de la FAQ (section [data-edit-faq]).
    function injecterFaq(data) {
        var section = document.querySelector('[data-edit-faq]');
        if (!section || !Array.isArray(data.faq) || data.faq.length === 0) { return; }
        section.querySelectorAll('details').forEach(function (d) { d.remove(); });
        data.faq.forEach(function (item) {
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

    fetch('data/gala.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('gala.json introuvable'); }
            return reponse.json();
        })
        .then(function (data) {
            injecterTextes(data);
            injecterProgramme(data);
            injecterFaq(data);
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
