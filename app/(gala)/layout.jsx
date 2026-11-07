import Gabarit, { metadataCommune } from '../../components/Gabarit';

export const metadata = metadataCommune;

// Layout racine à part pour la billetterie : on y arrive toujours par un
// chargement complet de page (jamais une navigation partielle), ce qui
// garantit au SDK PayPal un environnement neuf, comme sur l'ancien site.
export default function LayoutGala({ children }) {
    return <Gabarit classeBody="has-hero page-gala" conteneurPied="container text-center pb-3">{children}</Gabarit>;
}
