import Navigation from './Navigation';
import PiedDePage from './PiedDePage';
import Comportements from './Comportements';
import { SITE_URL } from '../lib/contenu';

// Métadonnées partagées par toutes les pages du site.
export const metadataCommune = {
    metadataBase: new URL(SITE_URL),
    title: 'UECE UMONS',
    icons: {
        icon: [
            { url: '/images/favicon-32.png', sizes: '32x32', type: 'image/png' },
            { url: '/images/favicon-192.png', sizes: '192x192', type: 'image/png' },
        ],
        apple: '/images/apple-touch-icon.png',
    },
};

// Squelette HTML commun : <head> (polices, Bootstrap, Font Awesome, design
// system), navigation, pied de page et comportements (animations, carrousels).
// Chaque groupe de pages (site, gala, standard) l'utilise comme layout racine
// avec sa propre classe de <body>.
export default function Gabarit({ classeBody, conteneurPied, children }) {
    return (
        <html lang="fr">
            <head>
                <link rel="preload" href="/fonts/Outfit-400-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
                <link rel="preload" href="/fonts/CormorantGaramond-700-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
                {/* style.css en dernier : ses surcharges du design system gagnent sur Bootstrap */}
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body className={classeBody}>
                <Navigation />
                {children}
                <PiedDePage conteneur={conteneurPied} />
                <Comportements />
            </body>
        </html>
    );
}
