import Link from 'next/link';
import d from '../../../data/guide.json';
import { Lignes, metadonnees, rempli } from '../../../lib/contenu';

export const metadata = metadonnees({
    titre: "Guide de l'étudiant - UECE UMONS",
    titrePartage: "Guide de l'étudiant à Mons",
    description: "Se loger, se déplacer, se soigner, sortir : le guide pratique de la vie étudiante à Mons, par l'UECE.",
    chemin: '/guide',
});

export default function Guide() {
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

                {/* Contenus rédigés par l'UECE, éditables via l'administration
                    (data/guide.json) — détails pratiques à faire valider par le comité. */}

                {/* Culture */}
                <section className="mb-5">
                    <p className="eyebrow text-center mb-1">{d.culture.eyebrow}</p>
                    <h2 className="text-center mb-4">{d.culture.titre}</h2>

                    {/* Carte vedette : le Beffroi, photo portrait ENTIÈRE à gauche
                         (taille naturelle, ni recadrage ni flou — retour Roy 17/07),
                         texte à droite façon éditorial */}
                    <div className="card card-lift carte-vedette mb-4" data-reveal="">
                        <div className="row g-0 align-items-center">
                            <div className="col-md-4 col-lg-3">
                                <picture>
                                    <source type="image/webp" srcSet="/images/beffroi-400.webp 360w" />
                                    <img src="/images/beffroi-400.jpg" className="img-vedette" alt="Le beffroi baroque de Mons, vu en entier depuis son jardin" />
                                </picture>
                            </div>
                            <div className="col-md-8 col-lg-9">
                                <div className="card-body p-4 p-lg-5">
                                    <p className="eyebrow mb-2">{d.culture.beffroi.eyebrow}</p>
                                    <h3 className="h4"><i className="fas fa-landmark me-2 text-gold"></i><span>{d.culture.beffroi.titre}</span></h3>
                                    <p className="mb-0">{d.culture.beffroi.texte}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6 col-lg-4">
                            <div className="card card-lift h-100" data-reveal="">
                                <picture>
                                    <source type="image/webp" srcSet="/images/doudou-lumecon-400.webp 400w, /images/doudou-lumecon-800.webp 738w" sizes="(max-width: 767px) 92vw, 420px" />
                                    <img src="/images/doudou-lumecon-800.jpg" srcSet="/images/doudou-lumecon-400.jpg 400w, /images/doudou-lumecon-800.jpg 738w" sizes="(max-width: 767px) 92vw, 420px" className="carte-bandeau" alt="" loading="lazy" />
                                </picture>
                                <div className="card-body p-4">
                                    <h3 className="h4"><i className="fas fa-dragon me-2 text-gold"></i><span>{d.culture.doudou.titre}</span></h3>
                                    <p className="mb-0">{d.culture.doudou.texte}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="card card-lift h-100" data-reveal="">
                                <picture>
                                    <source type="image/webp" srcSet="/images/sainte-waudru-400.webp 400w, /images/sainte-waudru-800.webp 800w" sizes="(max-width: 767px) 92vw, 420px" />
                                    <img src="/images/sainte-waudru-800.jpg" srcSet="/images/sainte-waudru-400.jpg 400w, /images/sainte-waudru-800.jpg 800w" sizes="(max-width: 767px) 92vw, 420px" className="carte-bandeau" alt="" loading="lazy" />
                                </picture>
                                <div className="card-body p-4">
                                    <h3 className="h4"><i className="fas fa-church me-2 text-gold"></i><span>{d.culture.sainteWaudru.titre}</span></h3>
                                    <p className="mb-0">La Grand-Place et son Hôtel de Ville gothique (n'oubliez pas de caresser <em>de la main gauche</em> la tête du petit singe du Grand-Garde, ça porte bonheur), puis la majestueuse collégiale Sainte-Waudru, écrin du Car d'Or.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="card card-lift h-100" data-reveal="0.1">
                                {/* Mini-carrousel des musées (décoratif) : images
                                     entières en bandeau-scène, fondu auto */}
                                <div id="carrouselMusees" className="carousel slide carousel-fade" data-carrousel-auto="" aria-hidden="true">
                                    <div className="carousel-inner">
                                        <div className="carousel-item active">
                                            <div className="carte-bandeau-scene">
                                                <img className="affiche-fond" src="/images/musee-memorial-400.webp" alt="" loading="lazy" />
                                                <picture>
                                                    <source type="image/webp" srcSet="/images/musee-memorial-400.webp 400w, /images/musee-memorial-800.webp 515w" sizes="(max-width: 767px) 92vw, 420px" />
                                                    <img src="/images/musee-memorial-800.jpg" srcSet="/images/musee-memorial-400.jpg 400w, /images/musee-memorial-800.jpg 515w" sizes="(max-width: 767px) 92vw, 420px" className="bandeau-img" alt="" loading="lazy" />
                                                </picture>
                                            </div>
                                        </div>
                                        <div className="carousel-item">
                                            <div className="carte-bandeau-scene">
                                                <img className="affiche-fond" src="/images/musee-doudou-400.webp" alt="" loading="lazy" />
                                                <picture>
                                                    <source type="image/webp" srcSet="/images/musee-doudou-400.webp 400w, /images/musee-doudou-800.webp 800w" sizes="(max-width: 767px) 92vw, 420px" />
                                                    <img src="/images/musee-doudou-800.jpg" srcSet="/images/musee-doudou-400.jpg 400w, /images/musee-doudou-800.jpg 800w" sizes="(max-width: 767px) 92vw, 420px" className="bandeau-img" alt="" loading="lazy" />
                                                </picture>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-4">
                                    <h3 className="h4"><i className="fas fa-palette me-2 text-gold"></i><span>{d.culture.musees.titre}</span></h3>
                                    <p className="mb-0">Le BAM (Beaux-Arts), la maison Van Gogh à Cuesmes, et les musées du Pôle muséal&nbsp;: Silex's, Artothèque, Mons Memorial Museum, musée du Doudou et Beffroi. <strong>Bon plan&nbsp;:</strong> ces cinq derniers sont <strong>gratuits pour les étudiants</strong>, et tous les musées communaux sont <strong>gratuits pour tout le monde le premier dimanche du mois</strong>.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carrousel Doudou : scène commune paysage, images ENTIÈRES
                         sur fond flouté (règle CLAUDE.md §4.4) */}
                    <p className="eyebrow text-center mb-1 mt-5">{d.culture.galerieEyebrow}</p>
                    <h3 className="text-center mb-4">{d.culture.galerieTitre}</h3>
                    <div id="carrouselDoudou" className="carousel slide carousel-fade carrousel-affiches" data-carrousel-auto="" data-reveal="">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="affiche-cadre scene-photo">
                                    <img className="affiche-fond" src="/images/doudou-braderie-1-400.webp" alt="" aria-hidden="true" loading="lazy" />
                                    <picture>
                                        <source type="image/webp" srcSet="/images/doudou-braderie-1-400.webp 400w, /images/doudou-braderie-1-800.webp 673w" sizes="(max-width: 991px) 92vw, 820px" />
                                        <img src="/images/doudou-braderie-1-800.jpg" srcSet="/images/doudou-braderie-1-400.jpg 400w, /images/doudou-braderie-1-800.jpg 673w" sizes="(max-width: 991px) 92vw, 820px" loading="lazy" className="affiche-img" alt="La braderie du Doudou dans les rues de Mons" />
                                    </picture>
                                </div>
                                <p className="mt-2 mb-0 text-center text-soft"><small>{d.culture.galerieLegendes[0]}</small></p>
                            </div>
                            <div className="carousel-item">
                                <div className="affiche-cadre scene-photo">
                                    <img className="affiche-fond" src="/images/doudou-sound-party-1-400.webp" alt="" aria-hidden="true" loading="lazy" />
                                    <picture>
                                        <source type="image/webp" srcSet="/images/doudou-sound-party-1-400.webp 400w, /images/doudou-sound-party-1-800.webp 673w" sizes="(max-width: 991px) 92vw, 820px" />
                                        <img src="/images/doudou-sound-party-1-800.jpg" srcSet="/images/doudou-sound-party-1-400.jpg 400w, /images/doudou-sound-party-1-800.jpg 673w" sizes="(max-width: 991px) 92vw, 820px" loading="lazy" className="affiche-img" alt="La foule à la Doudou Sound Party" />
                                    </picture>
                                </div>
                                <p className="mt-2 mb-0 text-center text-soft"><small>{d.culture.galerieLegendes[1]}</small></p>
                            </div>
                            <div className="carousel-item">
                                <div className="affiche-cadre scene-photo">
                                    <img className="affiche-fond" src="/images/doudou-fanfares-400.webp" alt="" aria-hidden="true" loading="lazy" />
                                    <picture>
                                        <source type="image/webp" srcSet="/images/doudou-fanfares-400.webp 400w, /images/doudou-fanfares-800.webp 673w" sizes="(max-width: 991px) 92vw, 820px" />
                                        <img src="/images/doudou-fanfares-800.jpg" srcSet="/images/doudou-fanfares-400.jpg 400w, /images/doudou-fanfares-800.jpg 673w" sizes="(max-width: 991px) 92vw, 820px" loading="lazy" className="affiche-img" alt="Le festival des fanfares pendant la Ducasse" />
                                    </picture>
                                </div>
                                <p className="mt-2 mb-0 text-center text-soft"><small>{d.culture.galerieLegendes[2]}</small></p>
                            </div>
                            <div className="carousel-item">
                                <div className="affiche-cadre scene-photo">
                                    <img className="affiche-fond" src="/images/doudou-braderie-2-400.webp" alt="" aria-hidden="true" loading="lazy" />
                                    <picture>
                                        <source type="image/webp" srcSet="/images/doudou-braderie-2-400.webp 400w, /images/doudou-braderie-2-800.webp 673w" sizes="(max-width: 991px) 92vw, 820px" />
                                        <img src="/images/doudou-braderie-2-800.jpg" srcSet="/images/doudou-braderie-2-400.jpg 400w, /images/doudou-braderie-2-800.jpg 673w" sizes="(max-width: 991px) 92vw, 820px" loading="lazy" className="affiche-img" alt="Ambiance de la braderie du Doudou" />
                                    </picture>
                                </div>
                                <p className="mt-2 mb-0 text-center text-soft"><small>{d.culture.galerieLegendes[3]}</small></p>
                            </div>
                            <div className="carousel-item">
                                <div className="affiche-cadre scene-photo">
                                    <img className="affiche-fond" src="/images/doudou-sound-party-2-400.webp" alt="" aria-hidden="true" loading="lazy" />
                                    <picture>
                                        <source type="image/webp" srcSet="/images/doudou-sound-party-2-400.webp 400w, /images/doudou-sound-party-2-800.webp 673w" sizes="(max-width: 991px) 92vw, 820px" />
                                        <img src="/images/doudou-sound-party-2-800.jpg" srcSet="/images/doudou-sound-party-2-400.jpg 400w, /images/doudou-sound-party-2-800.jpg 673w" sizes="(max-width: 991px) 92vw, 820px" loading="lazy" className="affiche-img" alt="Scène de la Doudou Sound Party" />
                                    </picture>
                                </div>
                                <p className="mt-2 mb-0 text-center text-soft"><small>{d.culture.galerieLegendes[4]}</small></p>
                            </div>
                        </div>
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carrouselDoudou" data-bs-slide-to="0" className="active" aria-current="true" aria-label="La braderie du Doudou"></button>
                            <button type="button" data-bs-target="#carrouselDoudou" data-bs-slide-to="1" aria-label="Doudou Sound Party"></button>
                            <button type="button" data-bs-target="#carrouselDoudou" data-bs-slide-to="2" aria-label="Le festival des fanfares"></button>
                            <button type="button" data-bs-target="#carrouselDoudou" data-bs-slide-to="3" aria-label="La braderie du Doudou, suite"></button>
                            <button type="button" data-bs-target="#carrouselDoudou" data-bs-slide-to="4" aria-label="Doudou Sound Party, suite"></button>
                        </div>
                    </div>
                </section>

                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>

                {/* Lieux clés */}
                <section className="mb-5">
                    <p className="eyebrow text-center mb-1">{d.lieux.eyebrow}</p>
                    <h2 className="text-center mb-4">{d.lieux.titre}</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card card-lift h-100" data-reveal="">
                                {/* Pas de photo ici tant que nous n'avons pas celle du BON batiment :
                                     l'Hotel de Ville, qui figurait avant, n'accueille aucune demarche
                                     pour les etudiants etrangers. A remplacer par une photo du service
                                     Population des qu'elle sera disponible. */}
                                <div className="carte-adresse" aria-hidden="true">
                                    <span className="carte-adresse__label">Service Population</span>
                                    <span className="carte-adresse__rue">Rue Buisseret 2</span>
                                    <span className="carte-adresse__ville">7000 Mons</span>
                                </div>
                                <div className="card-body p-4">
                                    <h3 className="h4"><i className="fas fa-city me-2 text-gold"></i><span>{d.lieux.administration.titre}</span></h3>
                                    <p className="mb-0">Déclaration d'arrivée, inscription au registre, titre de séjour&nbsp;: tout se fait au <strong>service Population</strong>, <strong>rue Buisseret 2, 7000 Mons</strong>, et non à l'Hôtel de Ville de la Grand-Place, qui n'accueille aucune de ces démarches. Consultez la page <Link href="/annonces">Infos importantes</Link> pour les délais et les documents à emporter.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card card-lift h-100" data-reveal="0.1">
                                <picture>
                                    <source type="image/webp" srcSet="/images/campus-nimy-400.webp 400w, /images/campus-nimy-800.webp 800w" sizes="(max-width: 767px) 92vw, 420px" />
                                    <img src="/images/campus-nimy-800.jpg" srcSet="/images/campus-nimy-400.jpg 400w, /images/campus-nimy-800.jpg 800w" sizes="(max-width: 767px) 92vw, 420px" className="carte-bandeau" alt="" loading="lazy" />
                                </picture>
                                <div className="card-body p-4">
                                    <h3 className="h4"><i className="fas fa-graduation-cap me-2 text-gold"></i><span>{d.lieux.campus.titre}</span></h3>
                                    <p className="mb-0">{d.lieux.campus.texte}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card card-lift h-100" data-reveal="0.2">
                                <picture>
                                    <source type="image/webp" srcSet="/images/gare-mons-400.webp 400w, /images/gare-mons-800.webp 800w" sizes="(max-width: 767px) 92vw, 420px" />
                                    <img src="/images/gare-mons-800.jpg" srcSet="/images/gare-mons-400.jpg 400w, /images/gare-mons-800.jpg 800w" sizes="(max-width: 767px) 92vw, 420px" className="carte-bandeau" alt="" loading="lazy" />
                                </picture>
                                <div className="card-body p-4">
                                    <h3 className="h4"><i className="fas fa-water me-2 text-gold"></i><span>{d.lieux.deplacer.titre}</span></h3>
                                    <p className="mb-0">{d.lieux.deplacer.texte}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>

                {/* Marchés */}
                <section className="mb-5">
                    <p className="eyebrow text-center mb-1">{d.marches.eyebrow}</p>
                    <h2 className="text-center mb-4">{d.marches.titre}</h2>

                    <div id="carrouselMarches" className="carousel slide carousel-fade carrousel-affiches mb-4" data-carrousel-auto="" data-reveal="">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="affiche-cadre scene-photo">
                                    <img className="affiche-fond" src="/images/marche-dolez-400.webp" alt="" aria-hidden="true" loading="lazy" />
                                    <picture>
                                        <source type="image/webp" srcSet="/images/marche-dolez-400.webp 400w, /images/marche-dolez-800.webp 800w" sizes="(max-width: 991px) 92vw, 820px" />
                                        <img src="/images/marche-dolez-800.jpg" srcSet="/images/marche-dolez-400.jpg 400w, /images/marche-dolez-800.jpg 800w" sizes="(max-width: 991px) 92vw, 820px" loading="lazy" className="affiche-img" alt="Étals du marché du boulevard Dolez" />
                                    </picture>
                                </div>
                                <p className="mt-2 mb-0 text-center text-soft"><small>{d.marches.legendes[0]}</small></p>
                            </div>
                            <div className="carousel-item">
                                <div className="affiche-cadre scene-photo">
                                    <img className="affiche-fond" src="/images/marche-fleurs-400.webp" alt="" aria-hidden="true" loading="lazy" />
                                    <picture>
                                        <source type="image/webp" srcSet="/images/marche-fleurs-400.webp 400w, /images/marche-fleurs-800.webp 800w" sizes="(max-width: 991px) 92vw, 820px" />
                                        <img src="/images/marche-fleurs-800.jpg" srcSet="/images/marche-fleurs-400.jpg 400w, /images/marche-fleurs-800.jpg 800w" sizes="(max-width: 991px) 92vw, 820px" loading="lazy" className="affiche-img" alt="Le marché aux fleurs de Mons" />
                                    </picture>
                                </div>
                                <p className="mt-2 mb-0 text-center text-soft"><small>{d.marches.legendes[1]}</small></p>
                            </div>
                            <div className="carousel-item">
                                <div className="affiche-cadre scene-photo">
                                    <img className="affiche-fond" src="/images/marche-noel-400.webp" alt="" aria-hidden="true" loading="lazy" />
                                    <picture>
                                        <source type="image/webp" srcSet="/images/marche-noel-400.webp 400w, /images/marche-noel-800.webp 800w" sizes="(max-width: 991px) 92vw, 820px" />
                                        <img src="/images/marche-noel-800.jpg" srcSet="/images/marche-noel-400.jpg 400w, /images/marche-noel-800.jpg 800w" sizes="(max-width: 991px) 92vw, 820px" loading="lazy" className="affiche-img" alt="Chalets du marché de Noël sur la Grand-Place de Mons" />
                                    </picture>
                                </div>
                                <p className="mt-2 mb-0 text-center text-soft"><small>{d.marches.legendes[2]}</small></p>
                            </div>
                        </div>
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carrouselMarches" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Le marché du boulevard Dolez"></button>
                            <button type="button" data-bs-target="#carrouselMarches" data-bs-slide-to="1" aria-label="Le marché aux fleurs"></button>
                            <button type="button" data-bs-target="#carrouselMarches" data-bs-slide-to="2" aria-label="Le marché de Noël"></button>
                        </div>
                    </div>

                    <div className="frame-double p-4 mx-auto" style={{ background: "var(--surface)", maxWidth: "760px" }} data-reveal="">
                        <div className="timeline">
                            {d.marches.liste.filter((m) => m && m.nom).map((m, i) => (
                                <div key={i} className="timeline-item"><span className="timeline-time">{m.jour || ''}</span> <strong>{m.nom}</strong>{rempli(m.detail) && ' — ' + m.detail}</div>
                            ))}
                        </div>
                        <p className="text-soft small mb-0 mt-2"><i className="fas fa-info-circle me-1"></i><span>{d.marches.note}</span></p>
                    </div>
                </section>

                <div className="separator-mains" aria-hidden="true">
                    <img src="/images/motif-mains.svg" alt="" width="44" height="44" />
                </div>

                {/* Contact */}
                <div className="frame-double p-4 mx-auto" style={{ background: "var(--surface)", maxWidth: "760px" }} data-reveal="">
                    <p className="eyebrow mb-2">{d.contact.eyebrow}</p>
                    <h2 className="h3 mb-2">{d.contact.titre}</h2>
                    <p className="mb-3">{d.contact.texte}</p>
                    <a href="mailto:UECE.UMONS@umons.ac.be" className="btn btn-gold"><i className="fas fa-envelope me-2"></i>UECE.UMONS@umons.ac.be</a>
                </div>
            </main>
        </>
    );
}
