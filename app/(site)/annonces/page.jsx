import d from '../../../data/annonces.json';
import { Lignes, metadonnees } from '../../../lib/contenu';

export const metadata = metadonnees({
    titre: 'Infos importantes (HUE / UE) - UECE UMONS',
    titrePartage: 'Infos HUE / UE - démarches des étudiants internationaux',
    description: "Titre de séjour, inscription à la commune, démarches administratives : l'essentiel pour les étudiants internationaux de l'UMONS, expliqué simplement.",
    chemin: '/annonces',
});

function Annonce({ a }) {
    const pub = (a.public || 'Tous').trim();
    return (
        <article className="annonce-card">
            <div className="annonce-meta">
                <span className={'badge-annonce badge-' + pub.toLowerCase()}>{pub}</span>
                {a.deadline && <span className="annonce-deadline"><i className="fas fa-hourglass-half"></i>{a.deadline}</span>}
            </div>
            <h2 className="h4">{a.titre}</h2>
            {a.description && <p className="mb-2">{a.description}</p>}
            <p className="annonce-source mb-0">
                Source : {a.sourceUrl && a.sourceLabel
                    ? <a href={a.sourceUrl} target="_blank" rel="noopener">{a.sourceLabel}</a>
                    : a.sourceLabel}
                {a.datePublication && ' · Publié le ' + a.datePublication}
                {a.sourceNote && a.sourceNote.trim() !== '' && <> — <em>{a.sourceNote}</em></>}
            </p>
        </article>
    );
}

export default function Annonces() {
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

                {/* Avertissement (déplacé en haut de page à la demande de Roy) */}
                <p className="text-soft small mb-4 avertissement"><i className="fas fa-info-circle me-1"></i><span>{d.disclaimer}</span></p>

                {/* Légende des badges */}
                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                    <span className="text-soft small">Public concerné :</span>
                    <span><span className="badge-annonce badge-hue">HUE</span> <span className="small text-soft">hors Union européenne</span></span>
                    <span><span className="badge-annonce badge-ue">UE</span> <span className="small text-soft">Union européenne (non belge)</span></span>
                    <span><span className="badge-annonce badge-tous">Tous</span> <span className="small text-soft">tous les étudiants internationaux</span></span>
                </div>

                {/* Annonces : éditables via l'administration (data/annonces.json) */}
                <div>
                    {d.annonces.filter((a) => a && a.titre).map((a, i) => <Annonce key={i} a={a} />)}
                </div>

                {/* Bloc contact / aide */}
                <div className="frame-double p-4 mt-4" style={{ background: 'var(--surface)' }}>
                    <p className="eyebrow mb-2">{d.aide.eyebrow}</p>
                    <h2 className="h3 mb-2">{d.aide.titre}</h2>
                    <p className="mb-3">{d.aide.texte}</p>
                    <a href="mailto:UECE.UMONS@umons.ac.be" className="btn btn-gold"><i className="fas fa-envelope me-2"></i>UECE.UMONS@umons.ac.be</a>
                </div>
            </main>
        </>
    );
}
