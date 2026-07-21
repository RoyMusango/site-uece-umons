// Phase 8-9 — Injection des contenus éditables de la page d'accueil.
// Source : data/accueil.json (édité par le CMS, jamais le HTML directement).
// Même filet de sécurité que js/gala-data.js et js/faq-data.js : si le JSON
// est absent, invalide ou que le fetch échoue (ouverture en fichier local),
// la page garde exactement son contenu HTML par défaut.
// Sécurité : injection par textContent/createElement uniquement — jamais innerHTML.
(function () {
    'use strict';

    // Résout un chemin pointé dans l'objet JSON (gère aussi les index de tableau).
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

    // Reconstruit ENTIÈREMENT le carrousel d'accueil (diapositives + puces) à
    // partir de data.affiches : le comité peut ajouter, modifier, réordonner ou
    // supprimer des diapos et leur image/légende depuis le CMS.
    // Chaque diapo réutilise les mêmes classes que le HTML d'origine
    // (affiche-cadre/affiche-scene/affiche-fond/affiche-img) → même mise en
    // scène (image entière sur fond flouté, ratio commun).
    function injecterAffiches(data) {
        var carrousel = document.getElementById('carrouselAffiches');
        if (!carrousel || !Array.isArray(data.affiches) || data.affiches.length === 0) { return; }
        var inner = carrousel.querySelector('.carousel-inner');
        var indicateurs = carrousel.querySelector('.carousel-indicators');
        if (!inner) { return; }

        inner.textContent = '';
        if (indicateurs) { indicateurs.textContent = ''; }

        data.affiches.forEach(function (item, i) {
            if (!item || !item.image || String(item.image).trim() === '') { return; }
            var actif = (i === 0);

            var slide = document.createElement('div');
            slide.className = 'carousel-item' + (actif ? ' active' : '');

            var cadre = document.createElement('div');
            cadre.className = 'affiche-cadre affiche-scene';
            cadre.setAttribute('data-tilt', '');

            // Fond décoratif : la même image, floutée/assombrie par le CSS.
            var fond = document.createElement('img');
            fond.className = 'affiche-fond';
            fond.src = item.image;
            fond.setAttribute('alt', '');
            fond.setAttribute('aria-hidden', 'true');
            if (!actif) { fond.setAttribute('loading', 'lazy'); }

            // Image de contenu : entière (object-fit: contain via .affiche-img).
            var img = document.createElement('img');
            img.className = 'affiche-img';
            img.src = item.image;
            img.alt = (typeof item.alt === 'string') ? item.alt : '';
            if (actif) { img.setAttribute('fetchpriority', 'high'); } else { img.setAttribute('loading', 'lazy'); }

            cadre.appendChild(fond);
            cadre.appendChild(img);
            slide.appendChild(cadre);

            if (item.legende && String(item.legende).trim() !== '') {
                var p = document.createElement('p');
                p.className = 'mt-2 mb-0 caption-light';
                var small = document.createElement('small');
                small.textContent = item.legende;
                p.appendChild(small);
                slide.appendChild(p);
            }
            inner.appendChild(slide);

            if (indicateurs) {
                var bouton = document.createElement('button');
                bouton.type = 'button';
                bouton.setAttribute('data-bs-target', '#carrouselAffiches');
                bouton.setAttribute('data-bs-slide-to', String(i));
                if (actif) {
                    bouton.className = 'active';
                    bouton.setAttribute('aria-current', 'true');
                }
                bouton.setAttribute('aria-label', (item.legende && String(item.legende).trim() !== '')
                    ? item.legende
                    : ('Diapositive ' + (i + 1)));
                indicateurs.appendChild(bouton);
            }
        });

        reinitialiserCarrousel(carrousel);
    }

    // L'instance Bootstrap créée au chargement (js/carrousels.js) pointe sur les
    // anciennes diapos : on la remplace après reconstruction. Respecte
    // prefers-reduced-motion (pas d'auto-défilement), comme carrousels.js.
    function reinitialiserCarrousel(el) {
        if (typeof bootstrap === 'undefined' || !bootstrap.Carousel) { return; }
        var instance = bootstrap.Carousel.getInstance(el);
        if (instance) { try { instance.dispose(); } catch (e) { /* ignore */ } }
        var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (mouvementReduit) {
            bootstrap.Carousel.getOrCreateInstance(el, { ride: false, interval: false });
        } else {
            bootstrap.Carousel.getOrCreateInstance(el, { ride: 'carousel', interval: 6000, pause: 'hover' });
        }
    }

    fetch('data/accueil.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('accueil.json introuvable'); }
            return reponse.json();
        })
        .then(function (data) {
            injecterTextes(data);
            injecterAffiches(data);
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
