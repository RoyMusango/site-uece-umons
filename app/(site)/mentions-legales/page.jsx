import Link from 'next/link';
import global from '../../../data/global.json';
import { metadonnees } from '../../../lib/contenu';

export const metadata = metadonnees({
    titre: 'Mentions légales et confidentialité - UECE UMONS',
    description: "Éditeur du site, hébergement, données personnelles et cookies : les informations légales de l'UECE UMONS.",
    chemin: '/mentions-legales',
});

export default function MentionsLegales() {
    return (
        <>
            <header className="page-header" data-glow="">
                <div className="container">
                    <p className="eyebrow">Informations légales</p>
                    <h1>Mentions légales &amp; confidentialité</h1>
                    <hr className="divider-gold" />
                    <p className="lead">Qui édite ce site, ce qu'il fait de vos informations, et ce qu'il n'en fait pas.</p>
                </div>
            </header>

            <main className="container pb-5">
                <div className="mx-auto prose-legale" style={{ maxWidth: "760px" }}>

                    {/* ====================== ÉDITEUR ============================== */}
                    <section className="frame-double p-4 p-lg-5 mb-4" style={{ background: "var(--surface)" }} data-reveal="">
                        <h2 className="h3 mb-3">Éditeur du site</h2>
                        <p>
                            Ce site est édité par l'<strong>UECE</strong> (Union des Étudiants et Chercheurs
                            Étrangers), <strong>cercle étudiant reconnu par l'Université de
                            Mons (UMONS)</strong>. L'UECE n'est pas constituée en société ou en ASBL&nbsp;:
                            elle ne dispose donc pas de numéro d'entreprise.
                        </p>
                        <p>
                            <strong>Responsable de la publication</strong>&nbsp;: le président de l'UECE
                            en mandat. Son nom figure sur la page
                            <Link href="/association#bureau-actuel">C'est quoi l'UECE&nbsp;?</Link>,
                            mise à jour à chaque changement de bureau.
                        </p>
                        <p className="mb-0">
                            <i className="fas fa-map-marker-alt me-2 text-gold" aria-hidden="true"></i>
                            <span>{global.contact.adresse}</span>, Belgique<br />
                            <i className="fas fa-envelope me-2 text-gold" aria-hidden="true"></i>
                            <a href={'mailto:' + global.contact.email}>{global.contact.email}</a>
                        </p>
                    </section>

                    {/* ====================== HÉBERGEMENT ========================== */}
                    <section className="frame-double p-4 p-lg-5 mb-4" style={{ background: "var(--surface)" }} data-reveal="">
                        <h2 className="h3 mb-3">Hébergement</h2>
                        <p className="mb-0">
                            Le site est hébergé par <strong>Netlify, Inc.</strong> (San Francisco,
                            Californie, États-Unis), <a href="https://www.netlify.com" rel="noopener">netlify.com</a>.
                            Il s'agit d'un site entièrement statique&nbsp;: aucune base de données ni
                            serveur applicatif ne fonctionne derrière ces pages.
                        </p>
                    </section>

                    {/* ====================== PROPRIÉTÉ INTELLECTUELLE ============== */}
                    <section className="frame-double p-4 p-lg-5 mb-4" style={{ background: "var(--surface)" }} data-reveal="">
                        <h2 className="h3 mb-3">Propriété intellectuelle</h2>
                        <p>
                            Le logo de l'UECE, les textes et les photographies publiés sur ce site sont
                            la propriété de l'UECE ou de leurs auteurs respectifs. Toute reproduction à
                            des fins commerciales est soumise à autorisation écrite préalable.
                        </p>
                        <p className="mb-0">
                            Les photographies d'événements sont prises lors d'activités de
                            l'association. Si vous apparaissez sur l'une d'elles et souhaitez son
                            retrait, écrivez-nous&nbsp;: elle sera retirée sans que vous ayez à vous
                            justifier.
                        </p>
                    </section>

                    {/* ====================== DONNÉES PERSONNELLES ================== */}
                    <section className="frame-double p-4 p-lg-5 mb-4" style={{ background: "var(--surface)" }} data-reveal="">
                        <h2 className="h3 mb-3">Données personnelles</h2>
                        <p>
                            L'UECE est responsable du traitement des données collectées via ce site.
                            Pour toute question, une seule adresse&nbsp;:
                            <a href="mailto:UECE.UMONS@umons.ac.be">UECE.UMONS@umons.ac.be</a>.
                        </p>

                        <h3 className="h5 mt-4">Ce que nous collectons, et pourquoi</h3>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">Situation</th>
                                        <th scope="col">Données</th>
                                        <th scope="col">Pourquoi</th>
                                        <th scope="col">Conservation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Achat d'un billet</strong></td>
                                        <td>Nom du participant, adresse e-mail, montant payé</td>
                                        <td>Établir le billet, vous l'envoyer, tenir la liste d'entrée</td>
                                        <td>L'année de l'événement, puis suppression</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Adhésion à l'association</strong></td>
                                        <td>Nom, prénom(s), e-mail, faculté, photographie d'identité</td>
                                        <td>Établir la carte de membre et vérifier la validité d'une adhésion</td>
                                        <td>L'année académique + 1 an</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Simple visite du site</strong></td>
                                        <td>Aucune</td>
                                        <td>Sans objet</td>
                                        <td>Sans objet</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-soft">
                            La <strong>photographie</strong> de la carte de membre ne sert qu'à la carte
                            elle-même. Elle repose sur votre consentement, recueilli au moment de
                            l'adhésion, et n'est jamais publiée sur le site ni sur les réseaux sociaux.
                        </p>

                        <h3 className="h5 mt-4">Qui d'autre y a accès</h3>
                        <ul>
                            <li><strong>Le prestataire de paiement</strong> (PayPal, et prochainement
                                Stripe) encaisse le paiement et nous transmet le nom et l'e-mail de
                                l'acheteur. Il applique sa propre politique de confidentialité.</li>
                            <li><strong>Notre outil d'envoi d'e-mails</strong> traite votre nom et votre
                                adresse le temps de vous expédier votre billet.</li>
                            <li><strong>Personne d'autre.</strong> Vos données ne sont ni vendues, ni
                                louées, ni transmises à des tiers à des fins commerciales.</li>
                        </ul>
                        <p className="mb-0">
                            En interne, seuls les membres du bureau qui en ont besoin (présidence,
                            trésorerie, billetterie) ont accès au registre des adhérents.
                        </p>
                    </section>

                    {/* ====================== VOS DROITS ============================ */}
                    <section className="frame-double p-4 p-lg-5 mb-4" style={{ background: "var(--surface)" }} data-reveal="">
                        <h2 className="h3 mb-3">Vos droits</h2>
                        <p>
                            Vous pouvez à tout moment demander à <strong>consulter</strong>,
                            <strong>corriger</strong>, <strong>récupérer</strong> ou
                            <strong>faire supprimer</strong> vos données, et retirer un consentement
                            donné, notamment pour votre photographie. Une seule adresse&nbsp;:
                            <a href="mailto:UECE.UMONS@umons.ac.be">UECE.UMONS@umons.ac.be</a>.
                            Nous répondons dans un délai d'un mois.
                        </p>
                        <p className="mb-0">
                            Si notre réponse ne vous satisfait pas, vous pouvez saisir l'Autorité de
                            protection des données (Rue de la Presse 35, 1000 Bruxelles,
                            <a href="https://www.autoriteprotectiondonnees.be" rel="noopener">autoriteprotectiondonnees.be</a>).
                        </p>
                    </section>

                    {/* ====================== COOKIES =============================== */}
                    <section className="frame-double p-4 p-lg-5 mb-4" style={{ background: "var(--surface)" }} data-reveal="">
                        <h2 className="h3 mb-3">Cookies et traceurs</h2>
                        <p>
                            <strong>Ce site ne dépose aucun cookie publicitaire et n'utilise aucun outil
                            de mesure d'audience</strong>, ni Google Analytics, ni pixel de réseau
                            social. C'est un choix, et c'est pourquoi vous ne voyez pas de bandeau
                            «&nbsp;accepter les cookies&nbsp;» en arrivant.
                        </p>
                        <p>Trois exceptions, toutes techniques&nbsp;:</p>
                        <ul>
                            <li>Sur la <Link href="/gala">page du Gala</Link>, le module de paiement
                                <strong>PayPal</strong> dépose ses propres cookies, nécessaires au bon
                                déroulement de la transaction.</li>
                            <li>La page de <strong>vérification d'une carte de membre</strong> enregistre
                                certaines informations dans la mémoire locale de votre navigateur (liste
                                des adhésions, cartes déjà contrôlées lors d'une soirée). Ces
                                informations ne quittent jamais votre appareil.</li>
                            <li>Les feuilles de style et les icônes proviennent de deux réseaux de
                                diffusion publics (jsDelivr et Cloudflare), qui peuvent enregistrer votre
                                adresse IP comme le fait tout serveur web. Les polices de caractères,
                                elles, sont hébergées sur notre propre site.</li>
                        </ul>
                        <p className="mb-0 text-soft">
                            Les liens vers Facebook, Instagram et TikTok sont de simples liens&nbsp;:
                            aucun contenu de ces plateformes n'est chargé dans nos pages.
                        </p>
                    </section>

                    {/* ====================== LIENS & MISE À JOUR =================== */}
                    <section className="frame-double p-4 p-lg-5" style={{ background: "var(--surface)" }} data-reveal="">
                        <h2 className="h3 mb-3">Liens externes et mise à jour</h2>
                        <p>
                            Ce site renvoie vers des sites publics (UMONS, Ville de Mons, Office des
                            étrangers…). Leur contenu n'engage que leurs éditeurs&nbsp;; nous les citons
                            parce qu'ils font autorité sur les démarches décrites.
                        </p>
                        <p className="mb-0 text-soft">
                            Dernière mise à jour&nbsp;: 25 septembre 2026.
                            Une question sur cette page&nbsp;?
                            <a href="mailto:UECE.UMONS@umons.ac.be">Écrivez-nous</a>.
                        </p>
                    </section>

                </div>
            </main>
        </>
    );
}
