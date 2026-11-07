import Link from 'next/link';
import d from '../../../data/evenements.json';
import { lien, metadonnees, rempli } from '../../../lib/contenu';

export const metadata = metadonnees({
    titre: 'Événements - UECE UMONS',
    titrePartage: "Les événements de l'UECE",
    description: "Soirées, rencontres et rendez-vous culturels organisés toute l'année pour les étudiants internationaux de Mons.",
    chemin: '/evenements',
});

function Meta({ icone, texte }) {
    return <span><i className={'fas ' + icone + ' me-1 text-gold'} aria-hidden="true"></i>{texte}</span>;
}

// Un événement de data/evenements.json : affiche optionnelle, infos
// pratiques, et soit « Entrée gratuite », soit les tarifs + un bouton de
// réservation par formule (lien de paiement, ex. Stripe) s'il est renseigné.
function Evenement({ evt, ouvert }) {
    const tarifs = (Array.isArray(evt.tarifs) ? evt.tarifs : []).filter((t) => t && (rempli(t.nom) || rempli(t.prix)));
    const liensFormule = (Array.isArray(evt.tarifs) ? evt.tarifs : []).filter((t) => t && rempli(t.lien));
    const aDesMeta = rempli(evt.jour) || rempli(evt.heure) || rempli(evt.lieu);

    return (
        <details open={ouvert}>
            <summary>
                <span className="evt-titre">{evt.titre}</span>
                {rempli(evt.jour) && <small className="evt-quand">{evt.jour}</small>}
            </summary>
            <div className="evt-corps">
                {rempli(evt.affiche) && (
                    <div className="evt-affiche">
                        <div className="affiche-cadre">
                            <img className="affiche-img" src={lien(evt.affiche)} alt={rempli(evt.afficheAlt) ? evt.afficheAlt : 'Affiche : ' + (evt.titre || '')} loading="lazy" />
                        </div>
                    </div>
                )}
                {aDesMeta && (
                    <p className="evt-meta">
                        {rempli(evt.jour) && <Meta icone="fa-calendar-alt" texte={evt.jour} />}
                        {rempli(evt.heure) && <Meta icone="fa-clock" texte={evt.heure} />}
                        {rempli(evt.lieu) && <Meta icone="fa-map-marker-alt" texte={evt.lieu} />}
                    </p>
                )}
                {rempli(evt.description) && <p>{evt.description}</p>}

                {evt.payant ? (
                    <>
                        {tarifs.length > 0 && (
                            <ul className="evt-tarifs">
                                {tarifs.map((t, i) => (
                                    <li key={i} className="evt-tarif">
                                        {rempli(t.nom) && <span className="evt-tarif-nom">{t.nom}</span>}
                                        {rempli(t.prix) && <span className="evt-tarif-prix">{t.prix}</span>}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {liensFormule.length > 0 && (
                            <div className="evt-reservations">
                                {liensFormule.map((t, i) => (
                                    <a key={i} className="btn btn-gold btn-sm" href={t.lien}>
                                        {'Réserver' + (rempli(t.nom) ? ' — ' + t.nom : '') + (rempli(t.prix) ? ' · ' + t.prix : '')}
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="evt-gratuit">Entrée gratuite</p>
                )}

                {rempli(evt.lienUrl) && !(evt.payant && liensFormule.length > 0) && (
                    <Link className="btn btn-gold btn-sm" href={lien(evt.lienUrl)}>
                        {rempli(evt.lienTexte) ? evt.lienTexte : (evt.payant ? 'Réserver ma place' : 'Plus d’informations')}
                    </Link>
                )}
            </div>
        </details>
    );
}

export default function Evenements() {
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

                {/* Événements éditables via l'administration (data/evenements.json) */}
                <section className="faq evenements mb-5 mx-auto mt-4" style={{ maxWidth: '860px' }} data-reveal="">
                    {d.evenements.filter((evt) => evt && evt.titre).map((evt, i) => (
                        <Evenement key={i} evt={evt} ouvert={i === 0} />
                    ))}
                </section>

                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>

                {/* Suivre l'actualité */}
                <div className="frame-double p-4 mx-auto" style={{ background: 'var(--surface)', maxWidth: '760px' }} data-reveal="">
                    <p className="eyebrow mb-2">Ne rien manquer</p>
                    <h2 className="h3 mb-2">Les annonces tombent d&apos;abord sur nos réseaux</h2>
                    <p className="mb-3">Dates, lieux et inscriptions sont annoncés sur Instagram et Facebook : suivez-nous pour être prévenus en premier.</p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <a href="https://www.instagram.com/uece_umons?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="btn btn-gold"><i className="fab fa-instagram me-2"></i>Instagram</a>
                        <a href="https://www.facebook.com/gerantpg" className="btn btn-outline-gold"><i className="fab fa-facebook me-2"></i>Facebook</a>
                    </div>
                </div>
            </main>
        </>
    );
}
