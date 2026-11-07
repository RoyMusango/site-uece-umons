import Link from 'next/link';
import Recherche from './Recherche';

// Barre de navigation commune à toutes les pages (autrefois copiée dans
// chacun des fichiers HTML). Menus déroulants Bootstrap (survol desktop
// géré en CSS, clic partout).
export default function Navigation() {
    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">
                    <img src="/images/logo-nav.png" width="44" height="44" alt="Logo UECE" />
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Ouvrir le menu de navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">L&apos;Association</a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" href="/association">C&apos;est quoi l&apos;UECE&nbsp;?</Link></li>
                                <li><Link className="dropdown-item" href="/association#bureaux">Historique des bureaux</Link></li>
                            </ul>
                        </li>

                        <li className="nav-item"><Link className="nav-link" href="/gala">Gala 2026</Link></li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Infos</a>
                            <ul className="dropdown-menu menu-panel">
                                <li><Link className="dropdown-item" href="/gala"><span className="panel-titre">Gala 2026 · Billetterie</span><small>Réservez votre place</small></Link></li>
                                <li><Link className="dropdown-item" href="/evenements"><span className="panel-titre">Événements</span><small>Soirées jeux, réseautage et rendez-vous</small></Link></li>
                                <li><Link className="dropdown-item" href="/annonces"><span className="panel-titre">Infos HUE&nbsp;/&nbsp;UE</span><small>Les démarches essentielles</small></Link></li>
                                <li><Link className="dropdown-item" href="/guide"><span className="panel-titre">Guide de l&apos;étudiant</span><small>Vivre à Mons au quotidien</small></Link></li>
                                <li><Link className="dropdown-item" href="/faq"><span className="panel-titre">FAQ</span><small>Les réponses à vos questions</small></Link></li>
                            </ul>
                        </li>

                    </ul>

                    <div className="d-flex align-items-center">
                        <Recherche />
                    </div>
                </div>
            </div>
        </nav>
    );
}
