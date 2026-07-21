// Phase 8 — Injection des contenus éditables du Guide de l'étudiant.
// Source : data/guide.json (édité par le CMS, jamais le HTML directement).
// Même filet de sécurité que js/gala-data.js : si le JSON est absent, invalide
// ou que le fetch échoue, la page garde son contenu HTML par défaut.
// Sécurité : jamais innerHTML — uniquement textContent + createElement.
//
// Périmètre choisi (« l'essentiel ») : titres, sous-titres, descriptions
// simples, légendes de carrousels, marchés de la semaine et bloc contact.
// Les 3 paragraphes qui contiennent un lien ou de la mise en forme (cartes
// Administration, Musées, Sainte-Waudru) restent volontairement dans le HTML
// pour ne pas perdre leur lien / gras / italique.
(function () {
    'use strict';

    function lire(data, chemin) {
        return chemin.split('.').reduce(function (obj, cle) {
            return (obj && typeof obj === 'object') ? obj[cle] : undefined;
        }, data);
    }

    // [data-edit] : remplace le texte. [data-edit-lines] : retours à la ligne → <br>.
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

    // Reconstruit la liste des marchés (conteneur [data-edit-marches]).
    // Reproduit la structure d'origine : <span.timeline-time>jour</span>
    // <strong>nom</strong> — detail.
    function injecterMarches(data) {
        var conteneur = document.querySelector('[data-edit-marches]');
        var liste = data.marches && data.marches.liste;
        if (!conteneur || !Array.isArray(liste) || liste.length === 0) { return; }
        conteneur.textContent = '';
        liste.forEach(function (item) {
            if (!item || !item.nom) { return; }
            var ligne = document.createElement('div');
            ligne.className = 'timeline-item';
            var jour = document.createElement('span');
            jour.className = 'timeline-time';
            jour.textContent = item.jour || '';
            var nom = document.createElement('strong');
            nom.textContent = item.nom;
            ligne.appendChild(jour);
            ligne.appendChild(document.createTextNode(' '));
            ligne.appendChild(nom);
            if (item.detail && item.detail.trim() !== '') {
                ligne.appendChild(document.createTextNode(' — ' + item.detail));
            }
            conteneur.appendChild(ligne);
        });
    }

    fetch('data/guide.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('guide.json introuvable'); }
            return reponse.json();
        })
        .then(function (data) {
            injecterTextes(data);
            injecterMarches(data);
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
