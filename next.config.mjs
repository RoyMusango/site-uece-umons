// Anciennes adresses du site statique (…/gala.html) : elles circulent dans
// des liens partagés, des moteurs de recherche et sur les QR des cartes de
// membre imprimées (…/verifier.html#numero-jeton — le #… est conservé par
// le navigateur). Redirection permanente vers les nouvelles adresses.
const ANCIENNES_PAGES = [
    'annonces', 'association', 'evenements', 'faq', 'gala', 'guide',
    'mentions-legales', 'merci', 'standard', 'verifier',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: '/index.html', destination: '/', permanent: true },
            ...ANCIENNES_PAGES.map((page) => ({
                source: `/${page}.html`,
                destination: `/${page}`,
                permanent: true,
            })),
        ];
    },
    // Interface d'administration Decap CMS : fichiers statiques de public/admin/.
    async rewrites() {
        return [{ source: '/admin', destination: '/admin/index.html' }];
    },
};

export default nextConfig;
