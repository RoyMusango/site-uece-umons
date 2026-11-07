import Link from 'next/link';
import d from '../../../data/merci.json';
import { metadonnees } from '../../../lib/contenu';

export const metadata = metadonnees({
    titre: 'Merci pour votre réservation - UECE UMONS',
    description: 'Votre paiement est confirmé. Votre billet avec QR code arrive par e-mail.',
    chemin: '/merci',
    robots: { index: false, follow: true },
});

export default function Merci() {
    return (
        <>
            <header className="page-header" data-glow="">
                <div className="container">
                    <p className="eyebrow">{d.entete.eyebrow}</p>
                    <h1>{d.entete.titre}</h1>
                    <hr className="divider-gold" />
                    <p className="lead">{d.entete.lead}</p>
                </div>
            </header>

            <main className="container pb-5">
                <div className="frame-double p-4 p-lg-5 mx-auto" style={{ background: 'var(--surface)', maxWidth: '720px' }} data-reveal="">
                    <div className="text-center mb-3">
                        <i className="fas fa-envelope-open-text fa-2x text-gold" aria-hidden="true"></i>
                    </div>
                    <h2 className="h3 text-center mb-3">{d.corps.titre}</h2>
                    <p>{d.corps.message}</p>
                    <p className="text-soft"><i className="fas fa-lightbulb me-1 text-gold" aria-hidden="true"></i><span>{d.corps.astuce}</span></p>
                    <p className="mb-4">{d.corps.contact}</p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <a href="mailto:UECE.UMONS@umons.ac.be" className="btn btn-gold"><i className="fas fa-envelope me-2"></i>UECE.UMONS@umons.ac.be</a>
                        <Link href="/evenements" className="btn btn-outline-gold"><i className="fas fa-calendar-alt me-2"></i>Nos événements</Link>
                        <Link href="/" className="btn btn-outline-gold"><i className="fas fa-house me-2"></i>Accueil</Link>
                    </div>
                </div>
            </main>
        </>
    );
}
