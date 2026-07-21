// Phase 6 — Injection des contenus de la page association.html :
// conditions d'adhésion, bureau actuel (photos + mini-bios) et historique
// des bureaux. Source : data/bureaux.json (édité par le CMS).
// Même filet de sécurité que js/gala-data.js : si le JSON manque ou ne
// charge pas, la page garde son contenu HTML par défaut.
// Injection par textContent uniquement — jamais innerHTML.
(function () {
    'use strict';

    // Résout un chemin pointé ("mission.cartes.0.titre"), gère les index de tableau.
    function lire(data, chemin) {
        return chemin.split('.').reduce(function (obj, cle) {
            return (obj && typeof obj === 'object') ? obj[cle] : undefined;
        }, data);
    }

    // [data-edit] : remplace le texte. [data-edit-lines] : retours à la ligne → <br>.
    // Utilisé pour l'en-tête de page, la mission, les titres de sections et les
    // libellés fixes. Les blocs reconstruits (conditions, bureaux…) ont leurs
    // propres injecteurs ci-dessous.
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

    function injecterIntro(data) {
        var el = document.querySelector('[data-edit-intro-bureaux]');
        if (el && typeof data.intro === 'string' && data.intro.trim() !== '') {
            el.textContent = data.intro;
        }
    }

    function injecterConditions(data) {
        var liste = document.querySelector('[data-edit-conditions]');
        var conditions = data.adhesion && data.adhesion.conditions;
        if (!liste || !Array.isArray(conditions) || conditions.length === 0) { return; }
        liste.textContent = '';
        conditions.forEach(function (texte) {
            if (typeof texte !== 'string' || texte.trim() === '') { return; }
            var ligne = document.createElement('li');
            ligne.textContent = texte;
            liste.appendChild(ligne);
        });
    }

    // "Prénom Nom" → "PN" pour l'avatar sans photo.
    function initiales(nom) {
        return nom.trim().split(/\s+/).slice(0, 2).map(function (mot) {
            return mot.charAt(0).toUpperCase();
        }).join('');
    }

    function creerAvatar(membre, classeTaille) {
        if (membre.photo && String(membre.photo).trim() !== '') {
            var img = document.createElement('img');
            img.className = 'membre-avatar ' + classeTaille;
            img.src = membre.photo;
            img.alt = 'Portrait de ' + membre.nom;
            img.loading = 'lazy';
            return img;
        }
        var rond = document.createElement('div');
        rond.className = 'membre-avatar membre-avatar-initiales ' + classeTaille;
        rond.setAttribute('aria-hidden', 'true');
        rond.textContent = initiales(membre.nom);
        return rond;
    }

    // Bureau actuel : une carte par membre (photo, nom, rôle, mini-bio).
    function injecterBureauActuel(data) {
        var grille = document.querySelector('[data-edit-bureau-actuel]');
        var bureau = data.bureauActuel;
        if (!grille || !bureau || !Array.isArray(bureau.membres) || bureau.membres.length === 0) { return; }

        var periode = document.querySelector('[data-edit-periode-actuel]');
        if (periode && typeof bureau.periode === 'string' && bureau.periode.trim() !== '') {
            periode.textContent = 'Mandat ' + bureau.periode;
        }

        grille.textContent = '';
        bureau.membres.forEach(function (membre) {
            if (!membre || !membre.nom) { return; }
            var colonne = document.createElement('div');
            colonne.className = 'col-6 col-lg-3';

            var carte = document.createElement('div');
            carte.className = 'card card-lift membre-carte h-100 text-center p-4';
            carte.appendChild(creerAvatar(membre, 'membre-avatar-grand'));

            var nom = document.createElement('h3');
            nom.className = 'h6 mb-1 mt-3';
            nom.textContent = membre.nom;
            carte.appendChild(nom);

            var role = document.createElement('p');
            role.className = 'membre-role mb-2';
            role.textContent = membre.role || '';
            carte.appendChild(role);

            if (membre.description && membre.description.trim() !== '') {
                var bio = document.createElement('p');
                bio.className = 'small text-soft mb-0';
                bio.textContent = membre.description;
                carte.appendChild(bio);
            }

            colonne.appendChild(carte);
            grille.appendChild(colonne);
        });
    }

    // Historique : une carte par mandat, membres en lignes (avatar + infos).
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

            if (bureau.nom && bureau.nom.trim() !== '') {
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
                ligne.appendChild(creerAvatar(membre, 'membre-avatar-petit'));

                var infos = document.createElement('div');
                var nom = document.createElement('div');
                nom.className = 'bureau-nom';
                nom.textContent = membre.nom;
                infos.appendChild(nom);
                var role = document.createElement('div');
                role.className = 'bureau-role';
                role.textContent = membre.role || '';
                infos.appendChild(role);
                if (membre.description && membre.description.trim() !== '') {
                    var bio = document.createElement('div');
                    bio.className = 'small text-soft';
                    bio.textContent = membre.description;
                    infos.appendChild(bio);
                }
                ligne.appendChild(infos);
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
            injecterTextes(data);
            injecterIntro(data);
            injecterConditions(data);
            injecterBureauActuel(data);
            injecterBureaux(data);
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
