/* ==========================================================================
   RECHERCHE DU SITE — js/recherche.js
   --------------------------------------------------------------------------
   La barre « Rechercher… » de la navbar.

   Principe : l'index n'est PAS un fichier à maintenir. Il se construit dans
   le navigateur à partir des fichiers data/*.json — ceux-là mêmes que le CMS
   édite. Quand le comité modifie un contenu, la recherche suit toute seule,
   sans qu'on ait quoi que ce soit à régénérer.

   L'index est fabriqué à la première frappe (pas au chargement de la page) :
   la navigation n'est jamais ralentie par la recherche.
   ========================================================================== */
(function () {
    'use strict';

    /* Quel fichier de contenu décrit quelle page. */
    var SOURCES = [
        { fichier: 'data/accueil.json',    page: 'index.html',       rubrique: 'Accueil' },
        { fichier: 'data/gala.json',       page: 'gala.html',        rubrique: 'Gala 2026' },
        { fichier: 'data/evenements.json', page: 'evenements.html',  rubrique: 'Événements' },
        { fichier: 'data/annonces.json',   page: 'annonces.html',    rubrique: 'Infos HUE / UE' },
        { fichier: 'data/guide.json',      page: 'guide.html',       rubrique: "Guide de l'étudiant" },
        { fichier: 'data/faq.json',        page: 'faq.html',         rubrique: 'FAQ' },
        { fichier: 'data/bureaux.json',    page: 'association.html', rubrique: "L'Association" }
    ];

    /* Les pages elles-mêmes, pour qu'une recherche « gala » tombe d'abord sur
       la billetterie même si aucun paragraphe ne contient le mot. */
    var PAGES = [
        { page: 'gala.html',        rubrique: 'Gala 2026',           titre: 'Gala de Prestige UECE 2026',
          texte: 'billetterie billets réserver soirée dîner spectacle tombola dj dress code' },
        { page: 'evenements.html',  rubrique: 'Événements',          titre: 'Nos événements',
          texte: 'agenda soirées rencontres activités sorties' },
        { page: 'annonces.html',    rubrique: 'Infos HUE / UE',      titre: 'Démarches administratives',
          texte: 'titre de séjour commune inscription visa carte étudiant hue ue annexe' },
        { page: 'guide.html',       rubrique: "Guide de l'étudiant", titre: "Guide de l'étudiant à Mons",
          texte: 'logement kot transport bus médecin banque mutuelle courses sortir' },
        { page: 'faq.html',         rubrique: 'FAQ',                 titre: 'Questions fréquentes',
          texte: 'aide questions réponses contact écrire mail remboursement' },
        { page: 'association.html', rubrique: "L'Association",       titre: "C'est quoi l'UECE ?",
          texte: 'association missions bureau comité adhésion cotisation membre carte de membre historique statuts contact' },
        { page: 'index.html',       rubrique: 'Accueil',             titre: 'UECE UMONS',
          texte: 'accueil association étudiants chercheurs étrangers umons mons' }
    ];

    /* Clés dont la valeur sert de titre à un résultat. */
    var CLES_TITRE = ['titre', 'question', 'nom', 'heure', 'role'];
    /* Clés purement techniques : jamais indexées. */
    var CLES_IGNOREES = /^(photo|image|images|src|href|lien|url|alt|icone|couleur|id|slug|fichier|srcset)$/i;

    var index = null, chargement = null;
    var champ, formulaire, panneau, resultats = [], choisi = -1;

    /* ---------------------------------------------------------------------
       Normalisation : minuscules, sans accents, sans ponctuation.
       « Séjour » et « sejour » doivent donner le même résultat.
       --------------------------------------------------------------------- */
    function normaliser(texte) {
        return (texte || '')
            .toString()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    /* ---------------------------------------------------------------------
       Construction de l'index à partir d'un objet JSON.
       On crée une fiche par bloc porteur de sens (un bloc = un objet qui a un
       titre, une question, un nom…), pas une fiche par phrase.
       --------------------------------------------------------------------- */
    function textesDe(valeur, sortie) {
        if (typeof valeur === 'string') {
            if (valeur.length > 1 && !/^https?:|\.(jpg|jpeg|png|webp|avif|svg)$/i.test(valeur)) {
                sortie.push(valeur);
            }
        } else if (Array.isArray(valeur)) {
            valeur.forEach(function (v) { textesDe(v, sortie); });
        } else if (valeur && typeof valeur === 'object') {
            Object.keys(valeur).forEach(function (cle) {
                if (!CLES_IGNOREES.test(cle)) textesDe(valeur[cle], sortie);
            });
        }
        return sortie;
    }

    function titreDe(objet) {
        for (var i = 0; i < CLES_TITRE.length; i++) {
            var v = objet[CLES_TITRE[i]];
            if (typeof v === 'string' && v.trim()) return v.trim();
        }
        return null;
    }

    function explorer(valeur, source, fiches, titreParent) {
        if (Array.isArray(valeur)) {
            valeur.forEach(function (v) { explorer(v, source, fiches, titreParent); });
            return;
        }
        if (!valeur || typeof valeur !== 'object') return;

        var titre = titreDe(valeur) || titreParent;
        var morceaux = [];
        Object.keys(valeur).forEach(function (cle) {
            if (CLES_IGNOREES.test(cle)) return;
            var v = valeur[cle];
            if (typeof v === 'string' || typeof v === 'number') {
                textesDe(v, morceaux);
            } else if (Array.isArray(v) && v.every(function (e) { return typeof e !== 'object' || e === null; })) {
                /* liste de textes simples : légendes de galerie, puces, conditions.
                   Sans ça, « La braderie du Doudou » resterait introuvable. */
                textesDe(v, morceaux);
            }
        });

        if (titre && morceaux.length) {
            fiches.push({
                page: source.page,
                rubrique: source.rubrique,
                titre: titre,
                texte: morceaux.join(' · ')
            });
        }

        /* on descend dans les sous-objets et les listes */
        Object.keys(valeur).forEach(function (cle) {
            if (CLES_IGNOREES.test(cle)) return;
            var v = valeur[cle];
            if (v && typeof v === 'object') explorer(v, source, fiches, titre);
        });
    }

    function construireIndex() {
        if (index) return Promise.resolve(index);
        if (chargement) return chargement;

        chargement = Promise.all(SOURCES.map(function (source) {
            return fetch(source.fichier)
                .then(function (r) { return r.ok ? r.json() : null; })
                .then(function (donnees) {
                    if (!donnees) return [];
                    var fiches = [];
                    explorer(donnees, source, fiches, null);
                    return fiches;
                })
                .catch(function () { return []; });
        })).then(function (paquets) {
            var fiches = PAGES.map(function (p) {
                return { page: p.page, rubrique: p.rubrique, titre: p.titre, texte: p.texte, estPage: true };
            });
            paquets.forEach(function (lot) { fiches = fiches.concat(lot); });

            /* dédoublonnage : un même titre peut apparaître plusieurs fois */
            var vues = {};
            index = fiches.filter(function (f) {
                var clef = f.page + '|' + normaliser(f.titre);
                if (vues[clef]) return false;
                vues[clef] = true;
                f.cleTitre = normaliser(f.titre);
                f.cleTexte = normaliser(f.texte);
                return true;
            });
            return index;
        });
        return chargement;
    }

    /* ---------------------------------------------------------------------
       Recherche : tous les mots doivent être présents (titre ou texte).
       --------------------------------------------------------------------- */
    function chercher(requete) {
        var mots = normaliser(requete).split(' ').filter(Boolean);
        if (!mots.length) return [];

        var trouves = [];
        index.forEach(function (fiche) {
            var score = 0, complet = true;

            for (var i = 0; i < mots.length; i++) {
                var mot = mots[i];
                var dansTitre = fiche.cleTitre.indexOf(mot) !== -1;
                var dansTexte = fiche.cleTexte.indexOf(mot) !== -1;
                if (!dansTitre && !dansTexte) { complet = false; break; }

                if (dansTitre) score += 10;
                if (new RegExp('(^| )' + mot).test(fiche.cleTitre)) score += 6;   /* début de mot */
                if (dansTexte) score += 2;
            }
            if (!complet) return;

            if (fiche.estPage) score += 4;               /* une page entière prime sur un paragraphe */
            if (fiche.cleTitre === normaliser(requete)) score += 20;
            trouves.push({ fiche: fiche, score: score });
        });

        return trouves.sort(function (a, b) { return b.score - a.score; })
                      .slice(0, 6)
                      .map(function (t) { return t.fiche; });
    }

    /* Extrait centré sur le premier mot trouvé, pour montrer le contexte. */
    function extrait(fiche, requete) {
        var texte = fiche.texte || '';
        if (fiche.estPage) return '';
        var mot = normaliser(requete).split(' ')[0];
        var trouve = motRegex(mot).exec(texte);
        var position = trouve ? trouve.index : -1;
        var depart = position > 40 ? position - 40 : 0;
        var bout = texte.slice(depart, depart + 120).trim();
        return (depart > 0 ? '… ' : '') + bout + (texte.length > depart + 120 ? '…' : '');
    }

    /* ---------------------------------------------------------------------
       Affichage
       --------------------------------------------------------------------- */
    function fermer() {
        panneau.hidden = true;
        champ.setAttribute('aria-expanded', 'false');
        champ.removeAttribute('aria-activedescendant');
        choisi = -1;
    }

    /* Équivalents accentués, pour surligner « séjour » quand on tape « sejour ». */
    var EQUIVALENTS = {
        a: '[aàâäá]', c: '[cç]', e: '[eéèêë]', i: '[iîïí]',
        o: '[oôöó]', u: '[uùûü]', y: '[yÿ]', n: '[nñ]'
    };

    function motRegex(mot) {
        /* `mot` sort de normaliser() : il ne contient que [a-z0-9],
           donc aucun caractère spécial à échapper. */
        var motif = mot.split('').map(function (lettre) {
            return EQUIVALENTS[lettre] || lettre;
        }).join('');
        return new RegExp(motif, 'i');
    }

    function surligner(element, texte, requete) {
        var mots = normaliser(requete).split(' ').filter(Boolean);
        for (var i = 0; i < mots.length; i++) {
            var trouve = motRegex(mots[i]).exec(texte);
            if (!trouve) continue;
            element.appendChild(document.createTextNode(texte.slice(0, trouve.index)));
            var marque = document.createElement('mark');
            marque.textContent = trouve[0];
            element.appendChild(marque);
            element.appendChild(document.createTextNode(texte.slice(trouve.index + trouve[0].length)));
            return;
        }
        element.textContent = texte;
    }

    function afficher(fiches, requete) {
        panneau.innerHTML = '';
        resultats = fiches;

        if (!fiches.length) {
            var vide = document.createElement('p');
            vide.className = 'recherche-vide';
            vide.textContent = 'Aucun résultat pour « ' + requete +' ».';
            panneau.appendChild(vide);
        } else {
            var liste = document.createElement('ul');
            liste.className = 'recherche-liste';
            liste.setAttribute('role', 'listbox');

            fiches.forEach(function (fiche, rang) {
                var item = document.createElement('li');
                var lien = document.createElement('a');
                lien.href = fiche.page;
                lien.id = 'recherche-resultat-' + rang;
                lien.setAttribute('role', 'option');
                lien.setAttribute('aria-selected', 'false');

                var rubrique = document.createElement('span');
                rubrique.className = 'recherche-rubrique';
                rubrique.textContent = fiche.rubrique;

                var titre = document.createElement('span');
                titre.className = 'recherche-titre';
                surligner(titre, fiche.titre, requete);

                lien.appendChild(rubrique);
                lien.appendChild(titre);

                var bout = extrait(fiche, requete);
                if (bout) {
                    var petit = document.createElement('small');
                    petit.textContent = bout;
                    lien.appendChild(petit);
                }
                item.appendChild(lien);
                liste.appendChild(item);
            });
            panneau.appendChild(liste);
        }

        panneau.hidden = false;
        champ.setAttribute('aria-expanded', 'true');
        choisi = -1;
    }

    function surligneChoix() {
        var liens = panneau.querySelectorAll('a[role="option"]');
        liens.forEach(function (lien, rang) {
            var actif = rang === choisi;
            lien.classList.toggle('est-choisi', actif);
            lien.setAttribute('aria-selected', actif ? 'true' : 'false');
        });
        if (choisi >= 0 && liens[choisi]) {
            champ.setAttribute('aria-activedescendant', liens[choisi].id);
            liens[choisi].scrollIntoView({ block: 'nearest' });
        } else {
            champ.removeAttribute('aria-activedescendant');
        }
    }

    function lancer(requete) {
        if (requete.trim().length < 2) { fermer(); return; }

        /* Ouvert par double-clic (file://) : le navigateur interdit de lire les
           fichiers data/*.json. La recherche — comme tout le contenu géré par le
           CMS — a besoin du site servi par un serveur. On le dit au lieu de
           renvoyer « aucun résultat », qui ferait croire à un contenu manquant. */
        if (location.protocol === 'file:') {
            panneau.innerHTML = '<p class="recherche-vide">La recherche n’est pas disponible ' +
                'quand la page est ouverte directement depuis un dossier. Passez par ' +
                'l’adresse du site en ligne, ou par http://localhost:8000.</p>';
            panneau.hidden = false;
            return;
        }
        construireIndex().then(function () {
            afficher(chercher(requete), requete.trim());
        }).catch(function () {
            panneau.innerHTML = '<p class="recherche-vide">Recherche momentanément indisponible.</p>';
            panneau.hidden = false;
        });
    }

    /* ---------------------------------------------------------------------
       Mise en place
       --------------------------------------------------------------------- */
    function demarrer() {
        champ = document.querySelector('.search-box');
        if (!champ) return;
        formulaire = champ.closest('form');

        var enveloppe = document.createElement('div');
        enveloppe.className = 'recherche';
        formulaire.parentNode.insertBefore(enveloppe, formulaire);
        enveloppe.appendChild(formulaire);

        panneau = document.createElement('div');
        panneau.className = 'recherche-panneau';
        panneau.id = 'recherche-panneau';
        panneau.hidden = true;
        enveloppe.appendChild(panneau);

        champ.setAttribute('role', 'combobox');
        champ.setAttribute('aria-expanded', 'false');
        champ.setAttribute('aria-controls', 'recherche-panneau');
        champ.setAttribute('aria-autocomplete', 'list');
        champ.setAttribute('aria-label', 'Rechercher sur le site');
        champ.setAttribute('autocomplete', 'off');

        /* Entrée ne doit jamais recharger la page. */
        formulaire.addEventListener('submit', function (e) {
            e.preventDefault();
            if (resultats.length) window.location.href = resultats[Math.max(choisi, 0)].page;
        });

        var minuteur = null;
        champ.addEventListener('input', function () {
            var valeur = champ.value;
            clearTimeout(minuteur);
            minuteur = setTimeout(function () { lancer(valeur); }, 120);
        });

        /* On prépare l'index dès que le champ reçoit le focus : la première
           frappe répond alors instantanément. */
        champ.addEventListener('focus', function () {
            construireIndex();
            if (champ.value.trim().length >= 2) lancer(champ.value);
        });

        champ.addEventListener('keydown', function (e) {
            if (panneau.hidden || !resultats.length) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault(); choisi = (choisi + 1) % resultats.length; surligneChoix();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault(); choisi = (choisi <= 0 ? resultats.length : choisi) - 1; surligneChoix();
            } else if (e.key === 'Escape') {
                fermer(); champ.blur();
            }
        });

        document.addEventListener('click', function (e) {
            if (!enveloppe.contains(e.target)) fermer();
        });
        document.addEventListener('focusin', function (e) {
            if (!enveloppe.contains(e.target)) fermer();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', demarrer);
    } else {
        demarrer();
    }
})();
