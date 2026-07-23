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

    // Vrai si la valeur représente un texte non vide.
    function rempli(v) { return typeof v === 'string' && v.trim() !== ''; }

    // Affiche / flyer de l'événement : image ENTIÈRE (jamais recadrée) dans le
    // cadre double filet or. Optionnelle.
    function creerAffiche(evt) {
        if (!rempli(evt.affiche)) { return null; }
        var bloc = document.createElement('div');
        bloc.className = 'evt-affiche';
        var cadre = document.createElement('div');
        cadre.className = 'affiche-cadre';
        var img = document.createElement('img');
        img.className = 'affiche-img';
        img.src = evt.affiche;
        img.alt = rempli(evt.afficheAlt) ? evt.afficheAlt : ('Affiche : ' + (evt.titre || ''));
        img.setAttribute('loading', 'lazy');
        cadre.appendChild(img);
        bloc.appendChild(cadre);
        return bloc;
    }

    // Tarifs d'un événement payant : une pastille « Nom — Prix » par formule.
    function creerTarifs(evt) {
        if (!Array.isArray(evt.tarifs) || evt.tarifs.length === 0) { return null; }
        var liste = document.createElement('ul');
        liste.className = 'evt-tarifs';
        evt.tarifs.forEach(function (t) {
            if (!t || (!rempli(t.nom) && !rempli(t.prix))) { return; }
            var item = document.createElement('li');
            item.className = 'evt-tarif';
            if (rempli(t.nom)) {
                var nom = document.createElement('span');
                nom.className = 'evt-tarif-nom';
                nom.textContent = t.nom;
                item.appendChild(nom);
            }
            if (rempli(t.prix)) {
                var prix = document.createElement('span');
                prix.className = 'evt-tarif-prix';
                prix.textContent = t.prix;
                item.appendChild(prix);
            }
            liste.appendChild(item);
        });
        return liste.childNodes.length > 0 ? liste : null;
    }

    // Boutons de réservation par formule : un bouton par tarif qui possède un
    // lien de paiement (Stripe Payment Link). Reste vide tant qu'aucun lien
    // n'est renseigné dans le CMS (capacité dormante d'ici la bascule Stripe).
    function creerReservations(evt) {
        if (!Array.isArray(evt.tarifs)) { return null; }
        var bloc = document.createElement('div');
        bloc.className = 'evt-reservations';
        evt.tarifs.forEach(function (t) {
            if (!t || !rempli(t.lien)) { return; }
            var a = document.createElement('a');
            a.className = 'btn btn-gold btn-sm';
            a.href = t.lien;
            var libelle = 'Réserver';
            if (rempli(t.nom)) { libelle += ' — ' + t.nom; }
            if (rempli(t.prix)) { libelle += ' · ' + t.prix; }
            a.textContent = libelle;
            bloc.appendChild(a);
        });
        return bloc.childNodes.length > 0 ? bloc : null;
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
            if (rempli(evt.jour)) {
                var quand = document.createElement('small');
                quand.className = 'evt-quand';
                quand.textContent = evt.jour;
                summary.appendChild(quand);
            }
            details.appendChild(summary);

            var corps = document.createElement('div');
            corps.className = 'evt-corps';

            // Affiche / flyer (en tête du détail, s'il y en a une).
            var affiche = creerAffiche(evt);
            if (affiche) { corps.appendChild(affiche); }

            var meta = document.createElement('p');
            meta.className = 'evt-meta';
            if (rempli(evt.jour)) { meta.appendChild(creerMeta('fa-calendar-alt', evt.jour)); }
            if (rempli(evt.heure)) { meta.appendChild(creerMeta('fa-clock', evt.heure)); }
            if (rempli(evt.lieu)) { meta.appendChild(creerMeta('fa-map-marker-alt', evt.lieu)); }
            if (meta.childNodes.length > 0) { corps.appendChild(meta); }

            if (rempli(evt.description)) {
                var texte = document.createElement('p');
                texte.textContent = evt.description;
                corps.appendChild(texte);
            }

            // Un ou plusieurs liens de paiement par formule sont-ils renseignés ?
            var liensFormule = evt.payant && Array.isArray(evt.tarifs)
                && evt.tarifs.some(function (t) { return t && rempli(t.lien); });

            // Événement payant : tarifs (pastilles) + boutons de réservation par
            // formule s'ils existent. Sinon : mention « gratuit ».
            if (evt.payant) {
                var tarifs = creerTarifs(evt);
                if (tarifs) { corps.appendChild(tarifs); }
                var reservations = creerReservations(evt);
                if (reservations) { corps.appendChild(reservations); }
            } else {
                var gratuit = document.createElement('p');
                gratuit.className = 'evt-gratuit';
                gratuit.textContent = 'Entrée gratuite';
                corps.appendChild(gratuit);
            }

            // Bouton unique de repli : seulement si aucun lien de paiement par
            // formule n'est renseigné (ex. le Gala pointe vers gala.html tant que
            // ses liens Stripe n'existent pas). Sert aussi aux liens externes.
            if (rempli(evt.lienUrl) && !liensFormule) {
                var lien = document.createElement('a');
                lien.className = 'btn btn-gold btn-sm';
                lien.href = evt.lienUrl;
                lien.textContent = rempli(evt.lienTexte)
                    ? evt.lienTexte
                    : (evt.payant ? 'Réserver ma place' : 'Plus d’informations');
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
