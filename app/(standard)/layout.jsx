import Gabarit, { metadataCommune } from '../../components/Gabarit';

export const metadata = metadataCommune;

// Page interne (styleguide) : sans en-tête sombre, navbar marine d'emblée.
export default function LayoutStandard({ children }) {
    return <Gabarit conteneurPied="container pb-3 text-center">{children}</Gabarit>;
}
