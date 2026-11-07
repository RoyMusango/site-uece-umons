import Link from 'next/link';
import d from '../../../data/faq.json';
import { metadonnees } from '../../../lib/contenu';

export const metadata = metadonnees({
    titre: 'FAQ - UECE UMONS',
    titrePartage: 'Questions fréquentes - UECE UMONS',
    description: "Les réponses aux questions les plus posées sur l'UECE, le Gala et la vie étudiante à Mons.",
    chemin: '/faq',
});

export default function Faq() {
    return (
        <>
            <header className="page-header" data-glow="">
                <div className="container">
                    <p className="eyebrow">{d.entete.eyebrow}</p>
                    <h1>{d.entete.titre}</h1>
                    <hr className="divider-gold" />
                    <p className="lead">{d.entete.sousTitre}</p>
                </div>
            </header>

            <main className="container pb-5">

                {/* Réponses éditables via l'administration (data/faq.json) */}
                <section className="faq mb-5 mx-auto" style={{ maxWidth: '860px' }} data-reveal="">
                    <h2 className="h3 text-center mb-4 mt-4">Questions fréquentes</h2>
                    {d.questions.filter((q) => q && q.question && q.reponse).map((q, i) => (
                        <details key={i}>
                            <summary>{q.question}</summary>
                            <p>{q.reponse}</p>
                        </details>
                    ))}
                </section>

                {/* Liens utiles (statiques : pas dans le CMS) */}
                <div className="text-center mb-5" data-reveal="">
                    <p className="eyebrow mb-3">Pour aller plus loin</p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <Link href="/gala" className="btn btn-gold"><i className="fas fa-ticket-alt me-2"></i>Gala 2026</Link>
                        <Link href="/annonces" className="btn btn-outline-gold">Infos HUE&nbsp;/&nbsp;UE</Link>
                        <Link href="/guide" className="btn btn-outline-gold">Guide de l&apos;étudiant</Link>
                        <Link href="/association" className="btn btn-outline-gold">C&apos;est quoi l&apos;UECE&nbsp;?</Link>
                    </div>
                </div>

                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>

                {/* Contact */}
                <div className="frame-double p-4 mx-auto" style={{ background: 'var(--surface)', maxWidth: '760px' }} data-reveal="">
                    <p className="eyebrow mb-2">Votre question n&apos;est pas ici&nbsp;?</p>
                    <h2 className="h3 mb-2">Posez-la nous directement</h2>
                    <p className="mb-3">Nous lisons tous les messages et les questions récurrentes rejoignent cette page.</p>
                    <a href="mailto:UECE.UMONS@umons.ac.be" className="btn btn-gold"><i className="fas fa-envelope me-2"></i>UECE.UMONS@umons.ac.be</a>
                </div>
            </main>
        </>
    );
}
