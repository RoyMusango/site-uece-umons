'use client';

/* ==========================================================================
   RECHERCHE DU SITE — la barre « Rechercher… » de la navbar.

   Principe : l'index n'est PAS un fichier à maintenir. Il se construit dans
   le navigateur à partir des fichiers data/*.json — ceux-là mêmes que le CMS
   édite. Quand le comité modifie un contenu, la recherche suit toute seule.

   Les fichiers ne sont chargés qu'au premier focus du champ (import()
   dynamique) : la navigation n'est jamais ralentie par la recherche.
   ========================================================================== */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/* Quel fichier de contenu décrit quelle page. */
const SOURCES = [
    { charger: () => import('../data/accueil.json'),    page: '/',            rubrique: 'Accueil' },
    { charger: () => import('../data/gala.json'),       page: '/gala',        rubrique: 'Gala 2026' },
    { charger: () => import('../data/evenements.json'), page: '/evenements',  rubrique: 'Événements' },
    { charger: () => import('../data/annonces.json'),   page: '/annonces',    rubrique: 'Infos HUE / UE' },
    { charger: () => import('../data/guide.json'),      page: '/guide',       rubrique: "Guide de l'étudiant" },
    { charger: () => import('../data/faq.json'),        page: '/faq',         rubrique: 'FAQ' },
    { charger: () => import('../data/bureaux.json'),    page: '/association', rubrique: "L'Association" },
];

/* Les pages elles-mêmes, pour qu'une recherche « gala » tombe d'abord sur
   la billetterie même si aucun paragraphe ne contient le mot. */
const PAGES = [
    { page: '/gala',        rubrique: 'Gala 2026',           titre: 'Gala de Prestige UECE 2026',
      texte: 'billetterie billets réserver soirée dîner spectacle tombola dj dress code' },
    { page: '/evenements',  rubrique: 'Événements',          titre: 'Nos événements',
      texte: 'agenda soirées rencontres activités sorties' },
    { page: '/annonces',    rubrique: 'Infos HUE / UE',      titre: 'Démarches administratives',
      texte: 'titre de séjour commune inscription visa carte étudiant hue ue annexe' },
    { page: '/guide',       rubrique: "Guide de l'étudiant", titre: "Guide de l'étudiant à Mons",
      texte: 'logement kot transport bus médecin banque mutuelle courses sortir' },
    { page: '/faq',         rubrique: 'FAQ',                 titre: 'Questions fréquentes',
      texte: 'aide questions réponses contact écrire mail remboursement' },
    { page: '/association', rubrique: "L'Association",       titre: "C'est quoi l'UECE ?",
      texte: 'association missions bureau comité adhésion cotisation membre carte de membre historique statuts contact' },
    { page: '/',            rubrique: 'Accueil',             titre: 'UECE UMONS',
      texte: 'accueil association étudiants chercheurs étrangers umons mons' },
];

/* Clés dont la valeur sert de titre à un résultat. */
const CLES_TITRE = ['titre', 'question', 'nom', 'heure', 'role'];
/* Clés purement techniques : jamais indexées. */
const CLES_IGNOREES = /^(photo|image|images|src|href|lien|url|alt|icone|couleur|id|slug|fichier|srcset)$/i;

/* Minuscules, sans accents, sans ponctuation : « Séjour » = « sejour ». */
function normaliser(texte) {
    return (texte || '').toString()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function textesDe(valeur, sortie) {
    if (typeof valeur === 'string') {
        if (valeur.length > 1 && !/^https?:|\.(jpg|jpeg|png|webp|avif|svg)$/i.test(valeur)) sortie.push(valeur);
    } else if (Array.isArray(valeur)) {
        valeur.forEach((v) => textesDe(v, sortie));
    } else if (valeur && typeof valeur === 'object') {
        Object.keys(valeur).forEach((cle) => { if (!CLES_IGNOREES.test(cle)) textesDe(valeur[cle], sortie); });
    }
    return sortie;
}

function titreDe(objet) {
    for (const cle of CLES_TITRE) {
        const v = objet[cle];
        if (typeof v === 'string' && v.trim()) return v.trim();
    }
    return null;
}

/* Une fiche par bloc porteur de sens (un objet qui a un titre, une
   question, un nom…), pas une fiche par phrase. */
function explorer(valeur, source, fiches, titreParent) {
    if (Array.isArray(valeur)) {
        valeur.forEach((v) => explorer(v, source, fiches, titreParent));
        return;
    }
    if (!valeur || typeof valeur !== 'object') return;

    const titre = titreDe(valeur) || titreParent;
    const morceaux = [];
    Object.keys(valeur).forEach((cle) => {
        if (CLES_IGNOREES.test(cle)) return;
        const v = valeur[cle];
        if (typeof v === 'string' || typeof v === 'number') {
            textesDe(v, morceaux);
        } else if (Array.isArray(v) && v.every((e) => typeof e !== 'object' || e === null)) {
            /* liste de textes simples : légendes, puces, conditions */
            textesDe(v, morceaux);
        }
    });

    if (titre && morceaux.length) {
        fiches.push({ page: source.page, rubrique: source.rubrique, titre, texte: morceaux.join(' · ') });
    }
    Object.keys(valeur).forEach((cle) => {
        if (CLES_IGNOREES.test(cle)) return;
        const v = valeur[cle];
        if (v && typeof v === 'object') explorer(v, source, fiches, titre);
    });
}

let index = null;
let chargement = null;

function construireIndex() {
    if (index) return Promise.resolve(index);
    if (chargement) return chargement;
    chargement = Promise.all(SOURCES.map((source) =>
        source.charger()
            .then((mod) => {
                const fiches = [];
                explorer(mod.default || mod, source, fiches, null);
                return fiches;
            })
            .catch(() => [])
    )).then((paquets) => {
        let fiches = PAGES.map((p) => ({ ...p, estPage: true }));
        paquets.forEach((lot) => { fiches = fiches.concat(lot); });
        /* dédoublonnage : un même titre peut apparaître plusieurs fois */
        const vues = {};
        index = fiches.filter((f) => {
            const clef = f.page + '|' + normaliser(f.titre);
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

/* Tous les mots doivent être présents (titre ou texte). */
function chercher(requete) {
    const mots = normaliser(requete).split(' ').filter(Boolean);
    if (!mots.length) return [];
    const trouves = [];
    index.forEach((fiche) => {
        let score = 0;
        for (const mot of mots) {
            const dansTitre = fiche.cleTitre.includes(mot);
            const dansTexte = fiche.cleTexte.includes(mot);
            if (!dansTitre && !dansTexte) return;
            if (dansTitre) score += 10;
            if (new RegExp('(^| )' + mot).test(fiche.cleTitre)) score += 6;   /* début de mot */
            if (dansTexte) score += 2;
        }
        if (fiche.estPage) score += 4;               /* une page entière prime sur un paragraphe */
        if (fiche.cleTitre === normaliser(requete)) score += 20;
        trouves.push({ fiche, score });
    });
    return trouves.sort((a, b) => b.score - a.score).slice(0, 6).map((t) => t.fiche);
}

/* Équivalents accentués, pour surligner « séjour » quand on tape « sejour ». */
const EQUIVALENTS = { a: '[aàâäá]', c: '[cç]', e: '[eéèêë]', i: '[iîïí]', o: '[oôöó]', u: '[uùûü]', y: '[yÿ]', n: '[nñ]' };

function motRegex(mot) {
    /* `mot` sort de normaliser() : uniquement [a-z0-9], rien à échapper. */
    return new RegExp(mot.split('').map((l) => EQUIVALENTS[l] || l).join(''), 'i');
}

/* Extrait centré sur le premier mot trouvé, pour montrer le contexte. */
function extrait(fiche, requete) {
    if (fiche.estPage) return '';
    const texte = fiche.texte || '';
    const trouve = motRegex(normaliser(requete).split(' ')[0]).exec(texte);
    const position = trouve ? trouve.index : -1;
    const depart = position > 40 ? position - 40 : 0;
    const bout = texte.slice(depart, depart + 120).trim();
    return (depart > 0 ? '… ' : '') + bout + (texte.length > depart + 120 ? '…' : '');
}

function Surligne({ texte, requete }) {
    for (const mot of normaliser(requete).split(' ').filter(Boolean)) {
        const trouve = motRegex(mot).exec(texte);
        if (!trouve) continue;
        return (
            <>
                {texte.slice(0, trouve.index)}
                <mark>{trouve[0]}</mark>
                {texte.slice(trouve.index + trouve[0].length)}
            </>
        );
    }
    return texte;
}

export default function Recherche() {
    const router = useRouter();
    const enveloppe = useRef(null);
    const champ = useRef(null);
    const minuteur = useRef(null);
    const [valeur, setValeur] = useState('');
    const [etat, setEtat] = useState({ ouvert: false, requete: '', resultats: [], erreur: false });
    const [choisi, setChoisi] = useState(-1);

    function fermer() {
        setEtat((e) => ({ ...e, ouvert: false }));
        setChoisi(-1);
    }

    function lancer(requete) {
        if (requete.trim().length < 2) { fermer(); return; }
        construireIndex()
            .then(() => setEtat({ ouvert: true, requete: requete.trim(), resultats: chercher(requete), erreur: false }))
            .catch(() => setEtat({ ouvert: true, requete: requete.trim(), resultats: [], erreur: true }));
        setChoisi(-1);
    }

    /* Clic ou focus ailleurs : on referme. */
    useEffect(() => {
        function dehors(e) {
            if (enveloppe.current && !enveloppe.current.contains(e.target)) fermer();
        }
        document.addEventListener('click', dehors);
        document.addEventListener('focusin', dehors);
        return () => {
            document.removeEventListener('click', dehors);
            document.removeEventListener('focusin', dehors);
            clearTimeout(minuteur.current);
        };
    }, []);

    /* Le résultat choisi au clavier reste visible dans la liste. */
    useEffect(() => {
        if (choisi < 0) return;
        document.getElementById('recherche-resultat-' + choisi)?.scrollIntoView({ block: 'nearest' });
    }, [choisi]);

    function aller(page) {
        fermer();
        setValeur('');
        router.push(page);
    }

    const { ouvert, requete, resultats, erreur } = etat;

    return (
        <div className="recherche" ref={enveloppe}>
            <form
                className="d-flex"
                role="search"
                onSubmit={(e) => {
                    e.preventDefault();   /* Entrée ne doit jamais recharger la page */
                    if (resultats.length) aller(resultats[Math.max(choisi, 0)].page);
                }}
            >
                <input
                    ref={champ}
                    className="form-control search-box"
                    type="search"
                    placeholder="Rechercher..."
                    role="combobox"
                    aria-expanded={ouvert ? 'true' : 'false'}
                    aria-controls="recherche-panneau"
                    aria-autocomplete="list"
                    aria-label="Rechercher sur le site"
                    aria-activedescendant={choisi >= 0 ? 'recherche-resultat-' + choisi : undefined}
                    autoComplete="off"
                    value={valeur}
                    onChange={(e) => {
                        const v = e.target.value;
                        setValeur(v);
                        clearTimeout(minuteur.current);
                        minuteur.current = setTimeout(() => lancer(v), 120);
                    }}
                    onFocus={() => {
                        /* index préparé dès le focus : la 1re frappe répond aussitôt */
                        construireIndex();
                        if (valeur.trim().length >= 2) lancer(valeur);
                    }}
                    onKeyDown={(e) => {
                        if (!ouvert || !resultats.length) return;
                        if (e.key === 'ArrowDown') {
                            e.preventDefault(); setChoisi((c) => (c + 1) % resultats.length);
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault(); setChoisi((c) => (c <= 0 ? resultats.length : c) - 1);
                        } else if (e.key === 'Escape') {
                            fermer(); champ.current.blur();
                        }
                    }}
                />
            </form>
            <div className="recherche-panneau" id="recherche-panneau" hidden={!ouvert}>
                {erreur && <p className="recherche-vide">Recherche momentanément indisponible.</p>}
                {!erreur && !resultats.length && <p className="recherche-vide">Aucun résultat pour « {requete} ».</p>}
                {!erreur && resultats.length > 0 && (
                    <ul className="recherche-liste" role="listbox">
                        {resultats.map((fiche, rang) => {
                            const bout = extrait(fiche, requete);
                            return (
                                <li key={fiche.page + fiche.titre}>
                                    <Link
                                        href={fiche.page}
                                        id={'recherche-resultat-' + rang}
                                        role="option"
                                        aria-selected={rang === choisi ? 'true' : 'false'}
                                        className={rang === choisi ? 'est-choisi' : undefined}
                                        onClick={() => { fermer(); setValeur(''); }}
                                    >
                                        <span className="recherche-rubrique">{fiche.rubrique}</span>
                                        <span className="recherche-titre"><Surligne texte={fiche.titre} requete={requete} /></span>
                                        {bout && <small>{bout}</small>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
