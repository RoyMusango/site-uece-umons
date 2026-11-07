/* ==========================================================================
   Comment ca marche, en une phrase :
   le QR contient "<numero>-<jeton>" ; la page en calcule l'empreinte SHA-256
   et regarde si cette empreinte figure dans la liste servie par
   /api/adhesions (lue en direct dans le registre Supabase).

   Pourquoi des empreintes et pas la liste des membres :
   la liste est publique (et gardee hors ligne). En ne publiant que des
   empreintes, on ne divulgue ni les noms, ni les numeros, ni le nombre exact
   d'adherents, et on ne peut pas fabriquer une fausse carte sans connaitre
   un couple numero + jeton valide, qui lui n'est imprime que sur la carte.
   ========================================================================== */

var FICHIER    = '/api/adhesions';
var SCRIPT_QR  = 'js/jsQR.min.js';
var CLE_LISTE  = 'uece.adhesions';     /* copie hors ligne de la liste        */
var CLE_SCANS  = 'uece.scans';         /* journal des cartes deja passees     */
var CLE_MODE   = 'uece.controle';      /* mode controle actif ou non          */

var base = null, horsLigne = false, modeControle = false;
var flux = null, dernierCode = null, dernierInstant = 0;

var el = function(id){ return document.getElementById(id); };
var elResultat = el('resultat'), elVerdict = el('verdict'),
    elExplication = el('explication'), elDetails = el('details');

var ICONES = {
  ok:    '<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.6 2.6L16 9.6"/>',
  ko:    '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/>',
  doute: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 16.5v.01"/>'
};
var VIBRATIONS = { ok: [45], doute: [40, 90, 40], ko: [220] };

/* -------------------------------------------------------------------------
   Petits utilitaires
   ------------------------------------------------------------------------- */
function lireStock(cle, defaut){
  try { var v = localStorage.getItem(cle); return v ? JSON.parse(v) : defaut; }
  catch (e) { return defaut; }
}
function ecrireStock(cle, valeur){
  try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) {}
}
function joliJour(iso){
  if (!iso) return '—';
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? m[3] + '/' + m[2] + '/' + m[1] : iso;
}
function joliHeure(horodatage){
  var d = new Date(horodatage);
  return ('0' + d.getHours()).slice(-2) + 'h' + ('0' + d.getMinutes()).slice(-2);
}

function afficher(etat, verdict, explication, details){
  elResultat.className = 'bloc carte etat-' + etat;
  elResultat.querySelector('.pastille svg').innerHTML = ICONES[etat];
  elVerdict.textContent = verdict;
  elExplication.textContent = explication;

  elDetails.innerHTML = '';
  if (details && details.length){
    details.forEach(function(paire){
      var bloc = document.createElement('div');
      bloc.innerHTML = '<dt class="etiquette"></dt><dd class="donnee"></dd>';
      bloc.querySelector('dt').textContent = paire[0];
      bloc.querySelector('dd').textContent = paire[1];
      elDetails.appendChild(bloc);
    });
    elDetails.hidden = false;
  } else {
    elDetails.hidden = true;
  }
  if (navigator.vibrate && VIBRATIONS[etat]) { try { navigator.vibrate(VIBRATIONS[etat]); } catch (e) {} }
}

/* SHA-256 tronque a 16 caracteres hexadecimaux. */
function empreinte(texte){
  if (!(window.crypto && window.crypto.subtle)){
    return Promise.reject(new Error('crypto indisponible'));
  }
  var octets = new TextEncoder().encode(texte);
  return window.crypto.subtle.digest('SHA-256', octets).then(function(tampon){
    return Array.prototype.map.call(new Uint8Array(tampon), function(o){
      return ('0' + o.toString(16)).slice(-2);
    }).join('').slice(0, 16);
  });
}

/* "UECE-2026-0001-H7QM4X" -> { numero, jeton, complet } */
function decouper(brut){
  var propre = (brut || '').trim().replace(/^.*#/, '').toUpperCase();
  var separateur = propre.lastIndexOf('-');
  if (separateur < 1) return null;
  var numero = propre.slice(0, separateur), jeton = propre.slice(separateur + 1);
  if (!numero || !jeton) return null;
  return { numero: numero, jeton: jeton, complet: propre };
}

/* -------------------------------------------------------------------------
   La liste des adhesions : reseau d'abord, copie locale en secours
   ------------------------------------------------------------------------- */
function majBandeauHorsLigne(){
  var bandeau = el('horsLigne');
  if (horsLigne && base){
    bandeau.textContent = 'Réseau indisponible : vérification faite sur la copie locale ' +
                          'de la liste (' + joliJour(base.genere_le) + ').';
    bandeau.classList.add('visible');
  } else {
    bandeau.classList.remove('visible');
  }
}

function chargerBase(){
  if (base && !horsLigne) return Promise.resolve(base);
  return fetch(FICHIER, { cache: 'no-store' })
    .then(function(r){ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function(j){
      base = j; horsLigne = false;
      ecrireStock(CLE_LISTE, j);                 /* on garde une copie pour ce soir */
      majBandeauHorsLigne();
      return j;
    })
    .catch(function(){
      var copie = lireStock(CLE_LISTE, null);
      if (!copie) throw new Error('liste');
      base = copie; horsLigne = true;
      majBandeauHorsLigne();
      return copie;
    });
}

/* -------------------------------------------------------------------------
   Mode controle : journal des cartes deja passees
   ------------------------------------------------------------------------- */
function majCompteur(){
  var journal = lireStock(CLE_SCANS, {});
  var total = Object.keys(journal).length;
  el('compteur').innerHTML = modeControle
    ? 'Contrôle en cours : <strong>' + total + '</strong> carte' + (total > 1 ? 's' : '') +
      ' validée' + (total > 1 ? 's' : '') + ' ce soir. Une carte déjà passée sera signalée.'
    : 'Pour une soirée : la caméra enchaîne les cartes, la liste reste disponible sans ' +
      'réseau, et une carte déjà passée est signalée.';
}

function basculerMode(actif){
  modeControle = actif;
  ecrireStock(CLE_MODE, actif);
  el('bModeControle').setAttribute('aria-pressed', actif ? 'true' : 'false');
  el('bModeControle').textContent = actif ? 'Désactiver' : 'Activer';
  el('boutonsControle').hidden = !actif;
  if (!actif) arreterCamera();
  majCompteur();
}

/* -------------------------------------------------------------------------
   La verification elle-meme
   ------------------------------------------------------------------------- */
function verifier(brut){
  var carte = decouper(brut);
  if (!carte){
    afficher('doute', 'Code non reconnu',
      'Vérifiez la saisie : le format attendu est UECE-2026-0001-H7QM4X.');
    return;
  }
  el('saisie').value = carte.complet;
  afficher('doute', 'Vérification…', 'Consultation de la liste des adhésions.');

  chargerBase().then(function(donnees){
    el('maj').textContent = joliJour(donnees.genere_le);
    return empreinte(carte.complet).then(function(clef){
      var fiche = donnees.empreintes && donnees.empreintes[clef];

      if (!fiche){
        afficher('ko', 'Carte non valide',
          'Cette carte ne figure pas dans la liste des adhésions en cours. ' +
          'Elle a pu être remplacée, annulée, ou la cotisation n’est pas à jour.',
          [['Numéro lu', carte.numero]]);
        return;
      }

      var aujourdhui = new Date().toISOString().slice(0, 10);
      if (fiche.e && fiche.e < aujourdhui){
        afficher('ko', 'Adhésion expirée',
          'Cette carte était valable jusqu’au ' + joliJour(fiche.e) +
          '. La cotisation doit être renouvelée.',
          [['Numéro', carte.numero], ['Expirée le', joliJour(fiche.e)]]);
        return;
      }

      /* --- carte valide : le mode controle regarde si elle est deja passee --- */
      if (modeControle){
        var journal = lireStock(CLE_SCANS, {});
        if (journal[clef]){
          afficher('doute', 'Déjà scanné',
            'Cette carte est valide, mais elle a déjà été présentée à ' +
            joliHeure(journal[clef]) + '. Vérifiez la photo avant de laisser entrer.',
            [['Numéro', carte.numero], ['Premier passage', joliHeure(journal[clef])]]);
          return;
        }
        journal[clef] = Date.now();
        ecrireStock(CLE_SCANS, journal);
        majCompteur();
      }

      var lignes = [['Numéro', carte.numero], ['Valable jusqu’au', joliJour(fiche.e)]];
      if (fiche.a || donnees.annee) lignes.push(['Année', fiche.a || donnees.annee]);
      if (fiche.q) lignes.push(['Qualité', fiche.q]);
      afficher('ok', 'Membre en règle',
        'Cotisation à jour. Comparez le numéro et la photo avec la carte présentée.',
        lignes);
    });
  }).catch(function(err){
    if (String(err.message).indexOf('crypto') !== -1){
      afficher('doute', 'Vérification impossible ici',
        'Ouvrez cette page en HTTPS (adresse commençant par https://) : ' +
        'le navigateur refuse de calculer l’empreinte autrement.');
    } else {
      afficher('doute', 'Liste indisponible',
        'Impossible de charger la liste des adhésions, et aucune copie locale n’est ' +
        'disponible. Connectez-vous une fois au réseau, puis réessayez.');
    }
  });
}

/* -------------------------------------------------------------------------
   La camera
   ------------------------------------------------------------------------- */
function chargerScriptQR(){
  if (window.jsQR) return Promise.resolve();
  return new Promise(function(resoudre, rejeter){
    var s = document.createElement('script');
    s.src = SCRIPT_QR;
    s.onload = resoudre;
    s.onerror = function(){ rejeter(new Error('script')); };
    document.head.appendChild(s);
  });
}

function aide(texte){
  var p = el('cameraAide');
  p.textContent = texte || '';
  p.hidden = !texte;
}

function demarrerCamera(){
  if (flux) { arreterCamera(); return; }
  aide('Démarrage de la caméra…');

  chargerScriptQR().then(function(){
    return navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }
    });
  }).then(function(media){
    flux = media;
    var video = el('video');
    video.srcObject = media;
    video.setAttribute('playsinline', '');
    /* On n'attend PAS la promesse de play() : sur iOS elle peut ne jamais se
       resoudre. La boucle patiente d'elle-meme jusqu'a la premiere image. */
    var lance = video.play();
    if (lance && lance.catch) lance.catch(function(){});

    el('camera').classList.add('visible');
    el('bScanner').textContent = 'Arrêter le scan';
    aide('Présentez le QR du dos de la carte dans le cadre.');
    boucle();
  }).catch(function(err){
    arreterCamera();
    if (err && err.message === 'script'){
      aide('Le lecteur de QR n’a pas pu être chargé. Connectez-vous une fois au ' +
           'réseau depuis cette page, puis réessayez.');
    } else if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      aide('Ce navigateur ne donne pas accès à la caméra. Utilisez l’appareil photo ' +
           'du téléphone pour scanner, ou saisissez le numéro à la main.');
    } else {
      aide('Accès à la caméra refusé. Autorisez-le dans les réglages du navigateur, ' +
           'ou saisissez le numéro à la main.');
    }
  });
}

function arreterCamera(){
  if (flux){ flux.getTracks().forEach(function(p){ p.stop(); }); flux = null; }
  el('camera').classList.remove('visible');
  el('bScanner').textContent = 'Scanner les cartes';
  dernierCode = null;
}

var toile = null, pinceau = null;
function boucle(){
  if (!flux) return;
  var video = el('video');
  var maintenant = Date.now();

  /* On n'analyse que ~7 images par seconde : inutile d'epuiser la batterie. */
  if (video.readyState === video.HAVE_ENOUGH_DATA && maintenant - dernierInstant > 140){
    dernierInstant = maintenant;
    if (!toile){ toile = document.createElement('canvas'); pinceau = toile.getContext('2d', { willReadFrequently: true }); }

    var largeur = 480;
    var echelle = largeur / video.videoWidth;
    toile.width = largeur;
    toile.height = Math.round(video.videoHeight * echelle);
    pinceau.drawImage(video, 0, 0, toile.width, toile.height);

    try {
      var image = pinceau.getImageData(0, 0, toile.width, toile.height);
      var trouve = window.jsQR(image.data, toile.width, toile.height,
                               { inversionAttempts: 'dontInvert' });
      if (trouve && trouve.data && trouve.data !== dernierCode){
        dernierCode = trouve.data;
        verifier(trouve.data);
        /* meme carte re-cadree : on ignore pendant 3 s pour ne pas clignoter */
        setTimeout(function(){ dernierCode = null; }, 3000);
      }
    } catch (e) { /* image pas encore prete */ }
  }
  requestAnimationFrame(boucle);
}

/* -------------------------------------------------------------------------
   Entree par QR (fragment de l'adresse) ou a la main
   ------------------------------------------------------------------------- */
function depuisAdresse(){
  var fragment = decodeURIComponent((location.hash || '').replace(/^#/, '')).trim();
  if (fragment){
    verifier(fragment);
  } else {
    afficher('doute', 'Scannez une carte',
      'Scannez le QR au dos d’une carte de membre, ou saisissez son numéro ci-dessous.');
    chargerBase().then(function(d){ el('maj').textContent = joliJour(d.genere_le); })
                 .catch(function(){});
  }
}

el('bValider').addEventListener('click', function(){ verifier(el('saisie').value); });
el('saisie').addEventListener('keydown', function(e){ if (e.key === 'Enter') verifier(this.value); });
el('bModeControle').addEventListener('click', function(){ basculerMode(!modeControle); });
el('bScanner').addEventListener('click', demarrerCamera);
el('bReinit').addEventListener('click', function(){
  if (!confirm('Effacer la liste des cartes déjà scannées ce soir ?')) return;
  ecrireStock(CLE_SCANS, {});
  majCompteur();
});
window.addEventListener('hashchange', depuisAdresse);
document.addEventListener('visibilitychange', function(){
  if (document.hidden) arreterCamera();       /* economie de batterie */
});

basculerMode(lireStock(CLE_MODE, false) === true);
depuisAdresse();

/* Le lecteur de QR est mis en cache des l'ouverture : s'il faut scanner plus
   tard alors que le reseau est tombe, il sera deja la. */
if (modeControle){
  var pre = document.createElement('link');
  pre.rel = 'prefetch'; pre.href = SCRIPT_QR;
  document.head.appendChild(pre);
}
