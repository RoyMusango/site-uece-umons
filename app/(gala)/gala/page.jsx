import d from '../../../data/gala.json';
import { Lignes, metadonnees } from '../../../lib/contenu';
import Billetterie from './Billetterie';

export const metadata = metadonnees({
    titre: 'Gala 2026 - UECE UMONS',
    titrePartage: 'Gala de Prestige UECE 2026 - Billetterie',
    description: 'Dîner gastronomique, spectacles culturels et DJ le samedi 15 mai 2026 à Mons. Réservez votre place : billet Standard 15 €, VIP 25 €.',
    chemin: '/gala',
});

export default function Gala() {
    return (
        <>
            <div className="header-gala text-center" data-glow="">
                <div className="container">
                    <p className="eyebrow">{d.hero.eyebrow}</p>
                    <h1 className="display-4 fw-bold">{d.hero.titre}</h1>
                    <hr className="divider-gold" />
                    <p className="lead">{d.hero.sousTitre}</p>
                </div>
            </div>

            {/* Section Communication Marketing */}
            <main className="container py-5">
                <div className="row row-gala-intro">
                    {/* Colonne pour le texte */}
                    <div className="col-lg-8 col-md-7">
                        <div className="soiree-exception-container shadow-sm" data-reveal="">
                            <div className="soiree-exception-content">
                                <h2 className="mb-4">{d.intro.titre}</h2>
                                <p className="lead">{d.intro.accroche}</p>
                                <p>{d.intro.paragraphe}</p>
                                <p>{d.intro.annonceProgramme}</p>
                                <div className="timeline mt-3">
                                    {d.programme.filter((p) => p && p.titre).map((p, i) => (
                                        <div key={i} className="timeline-item"><span className="timeline-time">{p.heure || ''}</span> <strong>{p.titre}</strong>{p.detail && ' ' + p.detail}</div>
                                    ))}
                                </div>
                                <p className="text-soft small mt-3 mb-0"><i className="fas fa-camera me-1 text-gold"></i><span>{d.intro.note}</span></p>
                            </div>
                        </div>
                    </div>
            
                    {/* Colonne pour la box "En bref" */}
                    <div className="col-lg-4 col-md-5">
                        <div className="p-4 bg-light rounded shadow-sm border info-box-compact" data-reveal="0.15">
                            <h3 className="h4 mb-4 pb-2 border-bottom text-center">En bref</h3>
                    
                            {/* Date */}
                            <div className="info-item">
                                <i className="fas fa-calendar-alt"></i>
                                <div className="info-content">
                                    <div className="info-label">Date</div>
                                    <div className="info-desc">{d.enBref.date}</div>
                                </div>
                            </div>
                    
                            {/* Heure */}
                            <div className="info-item">
                                <i className="fas fa-clock"></i>
                                <div className="info-content">
                                    <div className="info-label">Heure</div>
                                    <div className="info-desc">{d.enBref.heure}</div>
                                </div>
                            </div>
                    
                            {/* Lieu */}
                            <div className="info-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <div className="info-content">
                                    <div className="info-label">Lieu</div>
                                    <div className="info-desc"><Lignes texte={d.enBref.lieu} /></div>
                                </div>
                            </div>
                    
                            {/* Dress code */}
                            <div className="info-item">
                                <i className="fas fa-tshirt"></i>
                                <div className="info-content">
                                    <div className="info-label">Dress code</div>
                                    <div className="info-desc"><span>{d.enBref.dressCode}</span><br /><small className="text-muted">{d.enBref.dressCodeDetail}</small></div>
                                </div>
                            </div>
                    
                            {/* Note en bas */}
                            <div className="info-note-container">
                                <div className="info-note">
                                    <i className="fas fa-info-circle"></i>
                                    <span>{d.enBref.notePortes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Récapitulatif clair */}
                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card p-4 card-accent" data-reveal="">
                            <h3 className="h4">Informations importantes</h3>
                            <div className="row mt-3">
                                <div className="col-md-4 mb-3">
                                    <div className="text-center p-3">
                                        <i className="fas fa-ticket-alt fa-2x mb-2 text-gold"></i>
                                        <h4 className="h5">{d.infos.bloc1.titre}</h4>
                                        <p><Lignes texte={d.infos.bloc1.texte} /></p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="text-center p-3">
                                        <i className="fas fa-utensils fa-2x mb-2 text-gold"></i>
                                        <h4 className="h5">{d.infos.bloc2.titre}</h4>
                                        <p><Lignes texte={d.infos.bloc2.texte} /></p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="text-center p-3">
                                        <i className="fas fa-car fa-2x mb-2 text-gold"></i>
                                        <h4 className="h5">{d.infos.bloc3.titre}</h4>
                                        <p><Lignes texte={d.infos.bloc3.texte} /></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Billetterie — pas de reveal ici : zone critique PayPal,
                     elle reste visible en toutes circonstances */}
                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>
                <Billetterie billets={d.billets} />

                {/* FAQ — réponses d'exemple À VALIDER par le comité avant diffusion */}
                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>
                <section className="faq mb-4" data-reveal="">
                    <h2 className="h3 text-center mb-4">Questions fréquentes</h2>
                    {d.faq.filter((q) => q && q.question && q.reponse).map((q, i) => (
                        <details key={i}>
                            <summary>{q.question}</summary>
                            <p>{q.reponse}</p>
                        </details>
                    ))}
                </section>
            </main>

            {/* Récap prix + CTA sticky (mobile uniquement, masqué quand la
                 billetterie est à l'écran — voir Billetterie.jsx) */}
            <div className="cta-sticky" id="ctaSticky">
                <div className="cta-sticky-prix">
                    <strong>Gala 2026</strong>
                    <span>Standard 15&nbsp;€ · VIP 25&nbsp;€</span>
                </div>
                <a href="#participantForm" className="btn btn-gold">Réserver</a>
            </div>
        </>
    );
}
