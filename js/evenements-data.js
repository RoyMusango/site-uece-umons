// Phase 6 — Injection des événements (evenements.html).
// Source : data/evenements.json (édité par le CMS). Même filet de sécurité
// que js/gala-data.js : si le JSON manque ou ne charge pas, la page garde
// son contenu HTML par défaut. Injection par textContent uniquement.
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

    // Une ligne d'information (icône + texte) du détail d'un événement.
    function creerMeta(icone, texte) {
        var ligne = document.createElement('span');
        var ico = document.createElement('i');
        ico.className = 'fas ' + icone + ' me-1 text-gold';
        ico.setAttribute('aria-hidden', 'true');
        ligne.appendChild(ico);
        ligne.appendChild(document.createTextNode(texte));
        return ligne;
    }

    function injecterEvenements(data) {
        var section = document.querySelector('[data-edit-evenements]');
        if (!section || !Array.isArray(data.evenements) || data.evenements.length === 0) { return; }
        section.querySelectorAll('details').forEach(function (d) { d.remove(); });

        data.evenements.forEach(function (evt, index) {
            if (!evt || !evt.titre) { return; }
            var details = document.createElement('details');
            if (index === 0) { details.open = true; }

            var summary = document.createElement('summary');
            var titre = document.createElement('span');
            titre.className = 'evt-titre';
            titre.textContent = evt.titre;
            summary.appendChild(titre);
            if (evt.jour && evt.jour.trim() !== '') {
                var quand = document.createElement('small');
                quand.className = 'evt-quand';
                quand.textContent = evt.jour;
                summary.appendChild(quand);
            }
            details.appendChild(summary);

            var corps = document.createElement('div');
            corps.className = 'evt-corps';

            var meta = document.createElement('p');
            meta.className = 'evt-meta';
            if (evt.jour && evt.jour.trim() !== '') { meta.appendChild(creerMeta('fa-calendar-alt', evt.jour)); }
            if (evt.heure && evt.heure.trim() !== '') { meta.appendChild(creerMeta('fa-clock', evt.heure)); }
            if (evt.lieu && evt.lieu.trim() !== '') { meta.appendChild(creerMeta('fa-map-marker-alt', evt.lieu)); }
            if (meta.childNodes.length > 0) { corps.appendChild(meta); }

            if (evt.description && evt.description.trim() !== '') {
                var texte = document.createElement('p');
                texte.textContent = evt.description;
                corps.appendChild(texte);
            }

            if (evt.lienUrl && evt.lienUrl.trim() !== '') {
                var lien = document.createElement('a');
                lien.className = 'btn btn-gold btn-sm';
                lien.href = evt.lienUrl;
                lien.textContent = evt.lienTexte && evt.lienTexte.trim() !== ''
                    ? evt.lienTexte
                    : 'Plus d’informations';
                corps.appendChild(lien);
            }

            details.appendChild(corps);
            section.appendChild(details);
        });
    }

    fetch('data/evenements.json', { cache: 'no-cache' })
        .then(function (reponse) {
            if (!reponse.ok) { throw new Error('evenements.json introuvable'); }
            return reponse.json();
        })
        .then(function (data) {
            injecterTextes(data);
            injecterEvenements(data);
        })
        .catch(function () {
            // Contenu HTML par défaut conservé — rien à faire.
        });
})();
