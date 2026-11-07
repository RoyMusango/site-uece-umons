import './verifier/verifier.css';

export const metadata = {
    title: "Vérification d'adhésion - UECE UMONS",
    robots: { index: false, follow: false },
};

// Layout racine à part : la page de vérification des cartes de membre est
// autonome (lue au téléphone à l'entrée d'un événement), sans navbar ni
// Bootstrap — elle a son propre style (verifier/verifier.css).
export default function LayoutVerifier({ children }) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    );
}
