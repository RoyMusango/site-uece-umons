import Gabarit, { metadataCommune } from '../../components/Gabarit';

export const metadata = metadataCommune;

// Pages du site à en-tête sombre (navbar transparente sur l'en-tête).
export default function LayoutSite({ children }) {
    return <Gabarit classeBody="has-hero">{children}</Gabarit>;
}
