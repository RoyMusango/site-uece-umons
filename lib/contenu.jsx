// Outils partagés par les pages : adresses, textes du CMS, métadonnées.
import { Fragment } from 'react';

// Adresse publique du site (canonical, partage). À définir sur Vercel :
// NEXT_PUBLIC_SITE_URL=https://… — sinon l'ancienne adresse Netlify.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://uece-umons.netlify.app').replace(/\/$/, '');

export function rempli(v) {
    return typeof v === 'string' && v.trim() !== '';
}

// Les fichiers data/*.json (édités par le CMS) contiennent des chemins
// relatifs hérités du site statique : « images/x.jpg », « gala.html ».
// On les convertit en adresses du site Next.js : « /images/x.jpg », « /gala ».
export function lien(href) {
    if (!rempli(href)) return href;
    if (/^(https?:|mailto:|tel:|#|\/)/.test(href)) return href;
    const [chemin, ancre] = href.split('#');
    const page = chemin.replace(/\.html$/, '').replace(/^index$/, '');
    return '/' + page + (ancre ? '#' + ancre : '');
}

// Texte multi-lignes du CMS : chaque retour à la ligne devient un <br>.
export function Lignes({ texte }) {
    if (!rempli(texte)) return null;
    return texte.split('\n').map((ligne, i) => (
        <Fragment key={i}>{i > 0 && <br />}{ligne}</Fragment>
    ));
}

// Métadonnées communes (titre, description, partage sur les réseaux).
export function metadonnees({ titre, description, chemin, titrePartage, robots }) {
    return {
        title: titre,
        description,
        robots,
        alternates: chemin ? { canonical: chemin } : undefined,
        openGraph: description ? {
            type: 'website',
            siteName: 'UECE UMONS',
            locale: 'fr_BE',
            url: chemin,
            title: titrePartage || titre,
            description,
            images: [{
                url: '/images/partage-uece.jpg',
                width: 1200,
                height: 630,
                alt: "Logo de l'UECE, Union des Étudiants et Chercheurs Étrangers de l'UMONS",
            }],
        } : undefined,
        twitter: description ? { card: 'summary_large_image' } : undefined,
    };
}
