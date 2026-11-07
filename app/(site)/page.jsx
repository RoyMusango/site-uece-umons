import Link from 'next/link';
import d from '../../data/accueil.json';
import { lien, metadonnees } from '../../lib/contenu';

export const metadata = metadonnees({
    titre: 'Accueil - UECE UMONS',
    titrePartage: 'UECE UMONS - Étudiants et chercheurs étrangers',
    description: "L'Union des Étudiants et Chercheurs Étrangers de l'UMONS : accueillir, intégrer et représenter les étudiants internationaux à Mons.",
    chemin: '/',
});

// Liens des entrées du panneau « Découvrir l'UECE » (les textes viennent du CMS).
const LIENS_DECOUVRIR = ['/association', '/association#bureau-actuel', '/association#bureaux', '/faq'];

export default function Accueil() {
    const affiches = (d.affiches || []).filter((a) => a && a.image);
    return (
        <>
            <header className="hero-section">
                <div className="container">
                    <p className="eyebrow">{d.hero.eyebrow}</p>
                    <h1 className="display-4 fw-bold">{d.hero.titre}</h1>
                    <hr className="divider-gold" />
                    <p className="hero-sub mb-4">{d.hero.sousTitre}</p>

                    {/* Porte d'entrée du site : panneau déroulant vers l'association
                        (demande de Roy, 17/07/2026). L'accès Gala reste assuré par la
                        carte « Prochain événement » juste en dessous et par la nav. */}
                    <div className="hero-cta mb-5">
                        <div className="dropdown dropdown-hero">
                            <button className="btn btn-gold btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">{d.decouvrir.bouton}</button>
                            <ul className="dropdown-menu menu-panel">
                                {d.decouvrir.entrees.slice(0, LIENS_DECOUVRIR.length).map((entree, i) => (
                                    <li key={i}><Link className="dropdown-item" href={LIENS_DECOUVRIR[i]}><span className="panel-titre">{entree.titre}</span><small>{entree.description}</small></Link></li>
                                ))}
                                <li className="panel-action"><Link href="/association" className="btn btn-gold btn-sm"><span>{d.decouvrir.boutonAction}</span> <i className="fas fa-arrow-right ms-1"></i></Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Affiches en carrousel, gérées par le CMS (data/accueil.json → affiches) :
                        une affiche à la fois, fondu enchaîné toutes les 6 s, pause au survol,
                        pas de défilement auto en reduced-motion. Image ENTIÈRE sur fond flouté. */}
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-6 col-lg-5 text-center mb-3 poster-col">
                            <div id="carrouselAffiches" className="carousel slide carousel-fade carrousel-affiches" data-carrousel-auto="">
                                <div className="carousel-inner">
                                    {affiches.map((a, i) => (
                                        <div key={i} className={'carousel-item' + (i === 0 ? ' active' : '')}>
                                            <div className="affiche-cadre affiche-scene" data-tilt="">
                                                {/* fond décoratif : la même affiche, floutée (peut être recadrée) */}
                                                <img className="affiche-fond" src={lien(a.image)} alt="" aria-hidden="true" loading={i === 0 ? undefined : 'lazy'} />
                                                <img className="affiche-img" src={lien(a.image)} alt={a.alt || ''}
                                                    fetchPriority={i === 0 ? 'high' : undefined} loading={i === 0 ? undefined : 'lazy'} />
                                            </div>
                                            {a.legende && <p className="mt-2 mb-0 caption-light"><small>{a.legende}</small></p>}
                                        </div>
                                    ))}
                                </div>
                                <div className="carousel-indicators">
                                    {affiches.map((a, i) => (
                                        <button key={i} type="button" data-bs-target="#carrouselAffiches" data-bs-slide-to={i}
                                            className={i === 0 ? 'active' : undefined} aria-current={i === 0 ? 'true' : undefined}
                                            aria-label={a.legende || 'Diapositive ' + (i + 1)}></button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-5 bg-light">
                <div className="container">
                    <div className="separator-mains" aria-hidden="true">
                        <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                    </div>
                    <div className="row g-4">
                        {/* Box de gauche : Bienvenue */}
                        <div className="col-lg-7">
                            <div className="card card-lift shadow-sm h-100" data-reveal="">
                                <div className="card-body p-5">
                                    <h2 className="card-title mb-4 text-navy">
                                        <i className="fas fa-hands-helping me-2 text-gold"></i>
                                        <span>{d.bienvenue.titre}</span>
                                    </h2>
                                    <div className="card-text">
                                        <p className="lead">{d.bienvenue.lead}</p>
                                        <p>{d.bienvenue.paragraphe1}</p>
                                        <p>{d.bienvenue.paragraphe2}</p>
                                    </div>
                                    <div className="mt-4 pt-3 border-top">
                                        <p className="text-soft small mb-0">
                                            <i className="fas fa-check-circle me-1 text-gold"></i>
                                            <span>{d.bienvenue.note}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Box de droite : Prochain événement */}
                        <div className="col-lg-5">
                            <div className="card card-dark card-lift shadow-sm h-100" data-reveal="0.15" data-glow="">
                                <div className="card-body p-5 d-flex flex-column">
                                    <div className="mb-4">
                                        <h3 className="h4 card-title mb-3">
                                            <i className="fas fa-calendar-star me-2 text-gold"></i>
                                            <span>{d.prochainEvenement.titre}</span>
                                        </h3>
                                        <div className="card-highlight p-3 text-center mb-3">
                                            <h4 className="h5 mb-1 fw-bold">{d.prochainEvenement.nom}</h4>
                                            <p className="small mb-0">{d.prochainEvenement.date}</p>
                                        </div>
                                        <p className="mb-4">{d.prochainEvenement.description}</p>
                                    </div>

                                    <div className="mt-auto">
                                        <Link href="/gala" className="btn btn-gold btn-lg w-100">
                                            <i className="fas fa-arrow-right me-2"></i>
                                            <span>{d.prochainEvenement.bouton}</span>
                                        </Link>
                                        <p className="text-center mt-3 small" style={{ opacity: 0.8 }}>
                                            <i className="fas fa-info-circle me-1"></i>
                                            <span>{d.prochainEvenement.note}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
