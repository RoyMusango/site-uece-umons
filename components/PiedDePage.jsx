import Link from 'next/link';
import global from '../data/global.json';

// Pied de page commun, contenu édité par le CMS (data/global.json).
export default function PiedDePage({ conteneur = 'container' }) {
    const { contact, reseaux, informations, copyright } = global;
    return (
        <footer data-glow="">
            <div className={conteneur}>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <p className="footer-title">{contact.titre}</p>
                        <p>
                            <i className="fas fa-map-marker-alt me-2"></i> <span>{contact.adresse}</span><br />
                            <i className="fas fa-envelope me-2"></i> <span>{contact.email}</span>
                        </p>
                    </div>

                    <div className="col-md-4 mb-4 text-center">
                        <p className="footer-title">{reseaux.titre}</p>
                        <div className="mt-3">
                            <a href={reseaux.facebook} className="social-icon" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                            <a href={reseaux.instagram} className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href={reseaux.tiktok} className="social-icon" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4 text-end">
                        <p className="footer-title">{informations.titre}</p>
                        <ul className="list-unstyled">
                            <li><Link href="/faq">Questions fréquentes</Link></li>
                            <li><Link href="/guide">Guide de l&apos;étudiant</Link></li>
                            <li><Link href="/evenements">Nos événements</Link></li>
                            <li><Link href="/mentions-legales">Mentions légales</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center py-3 border-top border-secondary mt-3">
                    <small>{copyright}</small>
                </div>
            </div>
        </footer>
    );
}
