import d from '../../../data/bureaux.json';
import { Lignes, lien, metadonnees, rempli } from '../../../lib/contenu';

export const metadata = metadonnees({
    titre: "C'est quoi l'UECE ? - UECE UMONS",
    titrePartage: "C'est quoi l'UECE ?",
    description: "Nos missions, notre bureau et l'historique de l'association des étudiants et chercheurs étrangers de l'UMONS.",
    chemin: '/association',
});

function initiales(nom) {
    return nom.trim().split(/\s+/).slice(0, 2).map((mot) => mot.charAt(0).toUpperCase()).join('');
}

// Photo ronde si renseignée dans le CMS, sinon initiales or sur marine.
function Avatar({ membre, taille }) {
    if (rempli(membre.photo)) {
        return <img className={'membre-avatar ' + taille} src={lien(membre.photo)} alt={'Portrait de ' + membre.nom} loading="lazy" />;
    }
    return <div className={'membre-avatar membre-avatar-initiales ' + taille} aria-hidden="true">{initiales(membre.nom)}</div>;
}

// Les 3 panneaux du carrousel « mission » : visuel + icône (fixes), textes (CMS).
const MISSION = [
    { icone: 'fa-hands-helping', image: 'activites' },
    { icone: 'fa-users', image: 'evenements' },
    { icone: 'fa-bullhorn', image: null },
];

export default function Association() {
    const cartes = d.mission.cartes;
    const membresActuels = (d.bureauActuel.membres || []).filter((m) => m && m.nom);
    return (
        <>
            <header className="page-header" data-glow="">
                <div className="container">
                    <p className="eyebrow">{d.entete.eyebrow}</p>
                    <h1>{d.entete.titre}</h1>
                    <hr className="divider-gold" />
                    <p className="lead"><Lignes texte={d.entete.lead} /></p>
                </div>
            </header>

            <main className="container pb-5">

                {/* Mission : carrousel visuel (défilement auto 6 s, pause au survol,
                    pas de défilement auto en reduced-motion) */}
                <section className="mb-5 mt-4">
                    <p className="eyebrow text-center mb-1">{d.mission.eyebrow}</p>
                    <h2 className="text-center mb-4">{d.mission.titre}</h2>

                    <div id="carrouselMission" className="carousel slide carrousel-mission" data-carrousel-auto="" data-reveal="">
                        <div className="carousel-indicators">
                            {MISSION.map((m, i) => (
                                <button key={i} type="button" data-bs-target="#carrouselMission" data-bs-slide-to={i}
                                    className={i === 0 ? 'active' : undefined} aria-current={i === 0 ? 'true' : undefined}
                                    aria-label={cartes[i]?.titre}></button>
                            ))}
                        </div>
                        <div className="carousel-inner">
                            {MISSION.map((m, i) => (
                                <div key={i} className={'carousel-item' + (i === 0 ? ' active' : '')}>
                                    {m.image ? (
                                        <>
                                            <picture>
                                                <source type="image/webp" srcSet={`/images/${m.image}-400.webp 400w, /images/${m.image}-800.webp 800w`} sizes="(max-width: 767px) 100vw, 1100px" />
                                                <img src={`/images/${m.image}-800.jpg`} srcSet={`/images/${m.image}-400.jpg 400w, /images/${m.image}-800.jpg 800w`} sizes="(max-width: 767px) 100vw, 1100px" className="carrousel-img" alt="" loading={i === 0 ? undefined : 'lazy'} />
                                            </picture>
                                            <div className="carrousel-voile" aria-hidden="true"></div>
                                        </>
                                    ) : (
                                        <div className="carrousel-fond-motif" aria-hidden="true"></div>
                                    )}
                                    <div className="carrousel-texte">
                                        <h3><i className={'fas ' + m.icone + ' me-2 text-gold'}></i><span>{cartes[i]?.titre}</span></h3>
                                        <p>{cartes[i]?.texte}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carrouselMission" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Précédent</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carrouselMission" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Suivant</span>
                        </button>
                    </div>

                    {/* Sans JavaScript, seul le premier panneau du carrousel est
                        visible : on redonne les deux autres textes ici. */}
                    <noscript>
                        <div className="mt-4">
                            {cartes.slice(1).map((c, i) => <p key={i}><strong>{c.titre}.</strong> {c.texte}</p>)}
                        </div>
                    </noscript>
                </section>

                {/* Devenir membre : conditions d'adhésion (data/bureaux.json → adhesion) */}
                <div className="frame-double p-4 mx-auto mb-5" style={{ background: 'var(--surface)', maxWidth: '760px' }} data-reveal="">
                    <p className="eyebrow mb-2">{d.adhesion.eyebrow}</p>
                    <h2 className="h3 mb-3">{d.adhesion.titre}</h2>
                    <ul className="liste-conditions text-start mx-auto mb-3">
                        {d.adhesion.conditions.filter(rempli).map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                    <p className="mb-3">{d.adhesion.contact}</p>
                    <a href="mailto:UECE.UMONS@umons.ac.be" className="btn btn-gold"><i className="fas fa-envelope me-2"></i>UECE.UMONS@umons.ac.be</a>
                </div>

                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>

                {/* Bureau actuel (photos + mini-bios éditables via l'administration) */}
                <section id="bureau-actuel" className="mb-5">
                    <p className="eyebrow text-center mb-1">{d.bureauActuel.eyebrow}</p>
                    <h2 className="text-center mb-1">{d.bureauActuel.titre}</h2>
                    <p className="text-center text-soft mb-4">Mandat {d.bureauActuel.periode}</p>
                    <div className="row g-4 justify-content-center">
                        {membresActuels.map((m, i) => (
                            <div key={i} className="col-6 col-lg-3">
                                <div className="card card-lift membre-carte h-100 text-center p-4">
                                    <Avatar membre={m} taille="membre-avatar-grand" />
                                    <h3 className="h6 mb-1 mt-3">{m.nom}</h3>
                                    <p className="membre-role mb-2">{m.role || ''}</p>
                                    {rempli(m.description) && <p className="small text-soft mb-0">{m.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>

                {/* Historique des bureaux */}
                <section id="bureaux" className="mb-5">
                    <p className="eyebrow text-center mb-1">{d.histoire.eyebrow}</p>
                    <h2 className="text-center mb-3">{d.histoire.titre}</h2>
                    <p className="text-center mx-auto mb-4" style={{ maxWidth: '720px' }}>{d.intro}</p>

                    <div className="row g-4 justify-content-center">
                        {d.bureaux.filter((b) => b && b.periode).map((b, i) => (
                            <div key={i} className="col-md-6">
                                <article className="card card-lift h-100">
                                    <div className="card-body p-4">
                                        <h3 className="h4 mb-1">{b.periode}</h3>
                                        {rempli(b.nom) && <p className="eyebrow mb-3">{b.nom}</p>}
                                        <ul className="list-unstyled mb-0">
                                            {(b.membres || []).filter((m) => m && m.nom).map((m, j) => (
                                                <li key={j} className="bureau-membre">
                                                    <Avatar membre={m} taille="membre-avatar-petit" />
                                                    <div>
                                                        <div className="bureau-nom">{m.nom}</div>
                                                        <div className="bureau-role">{m.role || ''}</div>
                                                        {rempli(m.description) && <div className="small text-soft">{m.description}</div>}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-soft small mt-4 mb-0"><i className="fas fa-envelope me-1 text-gold"></i><span>{d.histoire.note}</span></p>
                </section>
            </main>
        </>
    );
}
