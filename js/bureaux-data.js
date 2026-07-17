// Phase 6 — Injection de l'historique des bureaux (page association.html).
// Source : data/bureaux.json (édité par le CMS). Même filet de sécurité que
// js/gala-data.js : si le JSON manque ou ne charge pas, la page garde son
// contenu HTML par défaut. Injection par textContent uniquement.
(function () {
    'use strict';

    function injecterIntro(data) {
        var el = document.querySelector('[data-edit-intro-bureaux]');
        if (el && typeof data.intro === 'string' && data.intro.trim() !== '') {
            el.textContent = data.intro;
        }
    }

    // Reconstruit la grille des bureaux : une carte par mandat,
    // avec la liste rôle → nom de ses membres.
    function injecterBureaux(data) {
        var grille = document.querySelector('[data-edit-bureaux]');
        if (!grille || !Array.isArray(data.bureaux) || data.bureaux.length === 0) { return; }
        grille.textContent = '';
        data.bureaux.forEach(function (bureau) {
            if (!bureau || !bureau.periode) { return; }

            var colonne = document.createElement('div');
            colonne.className = 'col-md-6';

            var carte = document.createElement('article');
            carte.className = 'card card-lift h-100';
            var corps = document.createElement('div');
            corps.className = 'card-body p-4';

            var titre = document.createElement('h3');
            titre.className = 'h4 mb-1';
            titre.textContent = bureau.periode;
            corps.appendChild(titre);

            if (bureau.nom) {
                var sousTitre = document.createElement('p');
                sousTitre.className = 'eyebrow mb-3';
                sousTitre.textContent = bureau.nom;
                corps.appendChild(sousTitre);
            }

            var liste = document.createElement('ul');
            liste.className = 'list-unstyled mb-0';
            (Array.isArray(bureau.membres) ? bureau.membres : []).forEach(function (membre) {
                if (!membre || !membre.nom) { return; }
                var ligne = document.createElement('li');
                ligne.className = 'bureau-membre';
                var role = document.createElement('span');
                role.className = 'bureau-role';
                role.textContent = membre.role || '';
                var nom = document.createElement('span');
                nom.className = 'bureau-nom';
                nom.textContent = membre.nom;
                ligne.appendChild(role);
                ligne.appendChild(nom);
                liste.appendChild(ligne);
            });
            corps.appendChild(liste);

            carte.appendChild(corps);
            colonne.appendChild(carte);
            grille.appendChild(colonne);
        });
    }

    fetch('data/bureaux.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('bureaux.json introuvable'); }
            return reponse.json();
        })
        .then(function (data) {
            injecterIntro(data);
            injecterBureaux(data);
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
