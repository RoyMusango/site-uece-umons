// Phase 8 — Injection des contenus éditables de la page « Infos importantes ».
// Source : data/annonces.json (édité par le CMS, jamais le HTML directement).
// Même filet de sécurité que js/gala-data.js : si le JSON est absent, invalide
// ou que le fetch échoue (ouverture en fichier local), la page garde son
// contenu HTML par défaut.
// Sécurité : jamais innerHTML — uniquement textContent + createElement.
(function () {
    'use strict';

    function lire(data, chemin) {
        return chemin.split('.').reduce(function (obj, cle) {
            return (obj && typeof obj === 'object') ? obj[cle] : undefined;
        }, data);
    }

    // [data-edit] : remplace le texte. [data-edit-lines] : chaque retour à la
    // ligne du JSON devient un <br> (utile pour le sous-titre en deux lignes).
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

    // Reconstruit les cartes d'annonces dans le conteneur [data-edit-annonces].
    // Les cartes reconstruites n'ont PAS d'attribut data-reveal : reveals.js a
    // déjà tourné au chargement, elles doivent donc rester visibles d'emblée.
    function injecterAnnonces(data) {
        var conteneur = document.querySelector('[data-edit-annonces]');
        if (!conteneur || !Array.isArray(data.annonces) || data.annonces.length === 0) { return; }
        conteneur.textContent = '';
        data.annonces.forEach(function (item) {
            if (!item || !item.titre) { return; }

            var article = document.createElement('article');
            article.className = 'annonce-card';

            var meta = document.createElement('div');
            meta.className = 'annonce-meta';

            var badge = document.createElement('span');
            var pub = (item.public || 'Tous').trim();
            badge.className = 'badge-annonce badge-' + pub.toLowerCase();
            badge.textContent = pub;
            meta.appendChild(badge);

            if (item.deadline) {
                var deadline = document.createElement('span');
                deadline.className = 'annonce-deadline';
                var icone = document.createElement('i');
                icone.className = 'fas fa-hourglass-half';
                deadline.appendChild(icone);
                deadline.appendChild(document.createTextNode(item.deadline));
                meta.appendChild(deadline);
            }
            article.appendChild(meta);

            var titre = document.createElement('h2');
            titre.className = 'h4';
            titre.textContent = item.titre;
            article.appendChild(titre);

            if (item.description) {
                var desc = document.createElement('p');
                desc.className = 'mb-2';
                desc.textContent = item.description;
                article.appendChild(desc);
            }

            // Ligne « Source : <lien> · Publié le <date> [ — <note> ] »
            var source = document.createElement('p');
            source.className = 'annonce-source mb-0';
            source.appendChild(document.createTextNode('Source : '));
            if (item.sourceUrl && item.sourceLabel) {
                var lien = document.createElement('a');
                lien.setAttribute('href', item.sourceUrl);
                lien.setAttribute('target', '_blank');
                lien.setAttribute('rel', 'noopener');
                lien.textContent = item.sourceLabel;
                source.appendChild(lien);
            } else if (item.sourceLabel) {
                source.appendChild(document.createTextNode(item.sourceLabel));
            }
            if (item.datePublication) {
                source.appendChild(document.createTextNode(' · Publié le ' + item.datePublication));
            }
            if (item.sourceNote && item.sourceNote.trim() !== '') {
                source.appendChild(document.createTextNode(' — '));
                var note = document.createElement('em');
                note.textContent = item.sourceNote;
                source.appendChild(note);
            }
            article.appendChild(source);

            conteneur.appendChild(article);
        });
    }

    fetch('data/annonces.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('annonces.json introuvable'); }
            return reponse.json();
        })
        .then(function (data) {
            injecterTextes(data);
            injecterAnnonces(data);
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
