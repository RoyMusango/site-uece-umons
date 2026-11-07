import Script from 'next/script';

// Vérification d'une carte de membre : le QR de la carte ouvre
// /verifier#<numero>-<jeton>. Toute la logique (empreinte SHA-256 comparée à
// public/adhesions.json, mode contrôle caméra) est dans public/js/verifier.js,
// reprise telle quelle de l'ancienne page statique.
export default function Verifier() {
    return (
        <>
            <header>
              <div className="sigle">UECE</div>
              <div className="sous-sigle">Vérification d'une carte de membre</div>
            </header>

            <div className="bloc hors-ligne" id="horsLigne" role="status"></div>

            <section className="bloc carte etat-doute" id="resultat" aria-live="polite">
              <div className="pastille">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v6" /><path d="M12 16.5v.01" /></svg>
              </div>
              <p className="verdict" id="verdict">Lecture en cours…</p>
              <p className="explication" id="explication">Un instant.</p>
              <dl className="details" id="details" hidden></dl>
            </section>

            <section className="bloc controle">
              <div className="controle-tete">
                <span className="controle-titre">Mode contrôle</span>
                <button type="button" className="b-vide" id="bModeControle" aria-pressed="false">Activer</button>
              </div>
              <p className="compteur" id="compteur">
                Pour une soirée : la caméra enchaîne les cartes, la liste reste disponible sans
                réseau, et une carte déjà passée est signalée.
              </p>
              <div className="boutons" id="boutonsControle" hidden>
                <button type="button" className="b-or" id="bScanner">Scanner les cartes</button>
                <button type="button" className="b-discret" id="bReinit">Nouvelle soirée</button>
              </div>
              <div className="camera" id="camera">
                <video id="video" playsInline muted></video>
                <div className="mire" aria-hidden="true"></div>
              </div>
              <p className="camera-aide" id="cameraAide" hidden></p>
            </section>

            <section className="bloc consigne">
              <strong>À l'entrée, trois vérifications :</strong>
              <ol>
                <li>Le bandeau ci-dessus est <strong>vert</strong>.</li>
                <li>Le numéro affiché est bien celui <strong>imprimé sur la carte</strong>.</li>
                <li>La <strong>photo de la carte</strong> est bien celle de la personne devant vous.</li>
              </ol>
            </section>

            <section className="bloc manuel">
              <label htmlFor="saisie">QR illisible ? Saisir le numéro et le jeton de la carte</label>
              <div className="rangee">
                <input id="saisie" placeholder="UECE-2026-0001-H7QM4X" autoComplete="off" spellCheck="false" />
                <button type="button" className="b-or" id="bValider">Vérifier</button>
              </div>
            </section>

            <footer>
              Liste mise à jour le <span id="maj">—</span>.<br />
              Un doute ? <a href="mailto:UECE.UMONS@umons.ac.be">UECE.UMONS@umons.ac.be</a>
            </footer>

            <Script src="/js/verifier.js" strategy="afterInteractive" />
        </>
    );
}
