import Link from 'next/link';
import { metadonnees } from '../../../lib/contenu';

// Page interne : styleguide vivant du design system (CLAUDE.md §7).
// Volontairement absente du menu et des moteurs de recherche. Sert aussi
// de modèle pour créer une nouvelle page.
export const metadata = metadonnees({
    titre: 'UECE UMONS',
    robots: { index: false, follow: false },
});

export default function Standard() {
    return (
        <>
            <main className="container py-5 text-center">
                <p className="eyebrow">UECE UMONS</p>
                <h1>Page en construction</h1>
                <hr className="divider-gold" />
                <p className="lead">Le contenu de cette page sera bientôt disponible.</p>
                <div className="mt-4" style={{ minHeight: "3rem" }}>
                    <i className="fas fa-tools fa-3x text-gold"></i>
                </div>
                <div className="mt-4" style={{ minHeight: "3rem" }}>
                    <Link href="/" className="btn btn-primary">Retour à l'accueil</Link>
                </div>
            </main>

            {/* ================================================================
                 STYLEGUIDE VIVANT — démo des composants du design system
                 (critère de validation de la Phase 1, cf. CLAUDE.md §7)
                 ================================================================ */}
            <section className="container styleguide-section pb-5">
                <p className="eyebrow">Styleguide</p>
                <h2 className="mb-4">Design system « Prestige diplomatique »</h2>

                {/* Couleurs */}
                <h3 className="mt-4 mb-3">Couleurs</h3>
                <div className="swatch-grid mb-4" data-reveal="">
                    <div className="swatch" style={{ background: "var(--navy-950)", color: "var(--paper)" }}><span className="swatch-label">navy-950</span></div>
                    <div className="swatch" style={{ background: "var(--navy-900)", color: "var(--paper)" }}><span className="swatch-label">navy-900</span></div>
                    <div className="swatch" style={{ background: "var(--navy-800)", color: "var(--paper)" }}><span className="swatch-label">navy-800</span></div>
                    <div className="swatch" style={{ background: "var(--navy-700)", color: "var(--paper)" }}><span className="swatch-label">navy-700</span></div>
                    <div className="swatch" style={{ background: "var(--gold-300)" }}><span className="swatch-label">gold-300</span></div>
                    <div className="swatch" style={{ background: "var(--gold-400)" }}><span className="swatch-label">gold-400</span></div>
                    <div className="swatch" style={{ background: "var(--gold-500)" }}><span className="swatch-label">gold-500</span></div>
                    <div className="swatch" style={{ background: "var(--gold-700)", color: "var(--paper)" }}><span className="swatch-label">gold-700</span></div>
                    <div className="swatch" style={{ background: "var(--paper)" }}><span className="swatch-label">paper</span></div>
                    <div className="swatch" style={{ background: "var(--ink)", color: "var(--paper)" }}><span className="swatch-label">ink</span></div>
                    <div className="swatch" style={{ background: "var(--muted)", color: "var(--paper)" }}><span className="swatch-label">muted</span></div>
                    <div className="swatch" style={{ background: "var(--bordeaux)", color: "#fff" }}><span className="swatch-label">bordeaux</span></div>
                </div>

                {/* Typographie */}
                <h3 className="mt-5 mb-3">Typographie</h3>
                <p className="eyebrow">Eyebrow — capitales espacées</p>
                <h1>Titre H1 — Cormorant Garamond</h1>
                <h2>Titre H2 — Cormorant Garamond</h2>
                <h3>Titre H3 — Cormorant Garamond</h3>
                <h4>Titre H4 — Cormorant Garamond</h4>
                <p className="lead">Paragraphe lead — Outfit 300, taille fluide.</p>
                <p>Paragraphe courant — Outfit 400. <a href="#">Un lien dans le texte</a>. <span className="text-soft">Texte atténué (muted)</span>.</p>

                {/* Boutons */}
                <h3 className="mt-5 mb-3">Boutons</h3>
                <div className="d-flex flex-wrap gap-3 align-items-center mb-4" data-reveal="">
                    <a href="#" className="btn btn-gold">Bouton or (CTA)</a>
                    <a href="#" className="btn btn-primary">Bouton marine</a>
                    <a href="#" className="btn-connexion">Se Connecter</a>
                </div>
                <div className="p-4 rounded mb-4" style={{ background: "var(--navy-900)" }} data-reveal="">
                    <a href="#" className="btn btn-outline-gold">Bouton filet or (fond sombre)</a>
                </div>

                {/* Cartes */}
                <h3 className="mt-5 mb-3">Cartes</h3>
                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card card-lift h-100" data-reveal="">
                            <div className="card-body">
                                <h4>Carte simple</h4>
                                <p className="mb-0">Fond surface, filet or discret, élévation douce au survol.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="frame-double p-4 h-100" style={{ background: "var(--surface)" }} data-reveal="0.1">
                            <p className="eyebrow mb-2">Cadre double filet</p>
                            <h4>Carte importante</h4>
                            <p className="mb-0">Le dispositif de l'affiche, pour les billets et « En bref ».</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-dark h-100" data-reveal="0.2">
                            <div className="card-body">
                                <h4>Carte sombre</h4>
                                <p className="mb-0">Marine dégradé, texte papier, accents or.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Motif signature */}
                <h3 className="mt-5 mb-3">Motif signature</h3>
                <div className="p-5 rounded mb-4 text-center" style={{ background: "var(--navy-950)" }}>
                    <img src="/images/motif-mains.svg" alt="Cercle de mains du logo, filaire or" width="240" height="240" />
                    <p className="mt-3 mb-0" style={{ color: "var(--paper)", opacity: ".75" }}><small>Les mains du logo, vectorisées et passées en filaire or (§4.3) — fond de hero en rotation lente (Phase 2) et séparateur de section.</small></p>
                </div>

                {/* Badges annonces */}
                <h3 className="mt-5 mb-3">Badges de public (annonces)</h3>
                <div className="d-flex flex-wrap gap-2 mb-4" data-reveal="">
                    <span className="badge-annonce badge-hue">HUE</span>
                    <span className="badge-annonce badge-ue">UE</span>
                    <span className="badge-annonce badge-tous">Tous</span>
                </div>

                {/* Formulaire */}
                <h3 className="mt-5 mb-3">Formulaire</h3>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="sg-nom">Nom complet</label>
                            <input type="text" className="form-control" id="sg-nom" placeholder="Nom et Prénom" />
                        </div>
                        <div className="alert alert-info">
                            <small><i className="fas fa-info-circle me-1"></i> Message d'information contextuel.</small>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
