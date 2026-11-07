"use client";

/* ==========================================================================
   Billetterie du Gala — ZONE GELÉE (CLAUDE.md §5).
   Identifiants inchangés : participantForm, nomParticipant, emailParticipant,
   card-standard, card-vip, displayAmount, paypal-button-container,
   factureArea, participantNameSummary. La logique de paiement vit, telle
   quelle, dans public/js/gala-paiement.js (selectTicket, validateForm,
   initializePayPal, telechargerFacture, custom_id = nom + "|||" + email).

   Ordre de chargement : SDK PayPal → gala-paiement.js → initializePayPal().
   ========================================================================== */
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

const SDK_PAYPAL = 'https://www.paypal.com/sdk/js?client-id=AQHDCCWVwCMsqL6aMoYZCbGc8LSnoejwHvSgANZVbC4qbZiw8dx37xFo2DOi0nVVL0MOcs4Cm4vFwUJi&currency=EUR';

export default function Billetterie({ billets }) {
    const [sdkPret, setSdkPret] = useState(false);
    const initialise = useRef(false);

    /* Récap prix + CTA sticky mobile (ex-gala-cta.js) : la barre est masquée
       dès que la zone de réservation est à l'écran, elle ne recouvre JAMAIS
       le formulaire ni les boutons PayPal. */
    useEffect(() => {
        const barre = document.getElementById('ctaSticky');
        const zone = document.getElementById('participantForm');
        if (!barre || !zone || !('IntersectionObserver' in window)) return undefined;
        const io = new IntersectionObserver((entries) => {
            barre.classList.toggle('is-hidden', entries[0].isIntersecting);
        }, { rootMargin: '0px 0px -20% 0px' });
        io.observe(zone);
        return () => io.disconnect();
    }, []);

    return (
        <>
            <div className="card shadow-lg border-0">
                <div className="card-header header-billetterie py-3">
                    <h3 className="mb-0"><i className="fas fa-shopping-cart me-2"></i>Réservez votre place</h3>
                </div>
                <div className="card-body p-4">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card border-0">
                                <div className="card-body">
                                    <h4 className="mb-3">Vos coordonnées</h4>
                                    <form id="participantForm">
                                        <div className="mb-3">
                                            <label className="form-label">Nom complet</label>
                                            <input type="text" className="form-control" id="nomParticipant" placeholder="Nom et Prénom" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" id="emailParticipant" placeholder="email@student.umons.ac.be" required />
                                        </div>
                                        <div className="alert alert-info">
                                            <small><i className="fas fa-info-circle me-1"></i> Votre billet électronique vous sera envoyé à cette adresse après paiement.</small>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h4 className="mb-3">Choisissez votre formule</h4>
                    
                            <div className="ticket-card active" id="card-standard" onClick={() => window.selectTicket('standard')}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{billets.standardNom}</strong><br />
                                        <small className="text-muted">{billets.standardDescription}</small>
                                    </div>
                                    <div className="text-end">
                                        <span className="h4 mb-0 d-block ticket-price-standard">15.00 €</span>
                                        <small className="text-muted">TVA incluse</small>
                                    </div>
                                </div>
                            </div>

                            <div className="ticket-card ticket-vip" id="card-vip" onClick={() => window.selectTicket('vip')}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong className="ticket-price-vip">{billets.vipNom}</strong><br />
                                        <small className="text-muted">{billets.vipDescription}</small>
                                    </div>
                                    <div className="text-end">
                                        <span className="h4 mb-0 d-block ticket-price-vip">25.00 €</span>
                                        <small className="text-muted">TVA incluse</small>
                                    </div>
                                </div>
                            </div>

                            {/* Total et Paiement */}
                            <div className="mt-4 p-4 bg-light rounded border">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Total à payer :</h5>
                                    <h4 id="displayAmount" className="text-navy">15.00 €</h4>
                                </div>
                        
                                <div id="paypal-button-container" className="mt-3"></div>
                        
                                <div className="mt-3 text-center">
                                    <small className="text-muted d-block">
                                        <i className="fas fa-lock me-1"></i>Paiement 100% sécurisé via PayPal
                                    </small>
                                    <small className="text-muted">
                                        Vous pouvez payer par carte bancaire sans compte PayPal
                                    </small>
                                </div>
                            </div>

                            {/* Confirmation après paiement */}
                            <div id="factureArea" className="text-center">
                                <div className="p-4" style={{ backgroundColor: "#d4edda", borderRadius: "10px" }}>
                                    <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                                    <h4 className="text-success mb-3">Paiement Confirmé&nbsp;!</h4>
                                    <p>Merci <span id="participantNameSummary" className="fw-bold"></span>.</p>
                                    <p className="mb-4">Votre réservation pour le Gala 2026 a bien été enregistrée.</p>
                                    <button className="btn btn-primary btn-lg" onClick={() => window.telechargerFacture()}>
                                        <i className="fas fa-download me-2"></i>Télécharger votre billet (PDF)
                                    </button>
                                    <p className="mt-3 text-muted"><small>Conservez ce document, il sera demandé à l'entrée.</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="afterInteractive" />
            <Script src={SDK_PAYPAL} strategy="afterInteractive" onReady={() => setSdkPret(true)} />
            {sdkPret && (
                <Script
                    src="/js/gala-paiement.js"
                    strategy="afterInteractive"
                    onReady={() => {
                        if (initialise.current) return;   /* une seule série de boutons */
                        initialise.current = true;
                        window.initializePayPal();
                    }}
                />
            )}
        </>
    );
}
