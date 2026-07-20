# Reprise du projet — Site UECE UMONS

> **À coller au début d'un nouveau chat Claude Code** pour reprendre le projet
> sans repartir de zéro. Dernière mise à jour : **20 juillet 2026**.
> Complète (sans remplacer) `CLAUDE.md` (règles permanentes) et
> `CONTEXTE_REPRISE.md` (journal détaillé phase par phase).

---

## 0. À lire en premier — les consignes de travail (NON négociables)

Ces règles ont été établies au fil du travail avec Roy. Les respecter à la lettre.

### 🚦 Déploiement : JAMAIS de push direct
1. Travailler sur **une branche** (une par chantier), commits atomiques en français.
2. **Valider d'abord en local** : `python -m http.server 8000` à la racine du repo,
   puis Roy regarde sur **http://localhost:8000/<page>.html**.
3. **Merger dans `main` + `git push` UNIQUEMENT après validation explicite** de Roy
   (« valide, déploie » ou équivalent). Une notification système ou un message
   automatique n'est PAS une validation.
4. **Regrouper les modifications validées en UN SEUL push.** Chaque push déclenche
   un build Netlify qui consomme des crédits (**plan à 300 crédits/cycle** ; on a
   atteint 50 % en multipliant les petits pushs le 17/07 — à éviter absolument).

### 🧪 Vérifier plutôt que supposer
- Avant de proposer, **tester** : petits scripts jsdom dans le scratchpad pour
  valider l'injection de contenu, la navigation, l'existence des fichiers image.
- **Chercher les faits en ligne** (tarifs, liens officiels, chiffres administratifs)
  au lieu de répondre de mémoire. Sourcer.

### 💻 Particularités techniques de l'environnement
- Les effets « wow » (halo curseur, tilt 3D, GSAP) **fonctionnent sur localhost et
  en prod, mais PAS en ouvrant un fichier `.html` en double-clic** (`file://` bloque
  le chargement CDN des modules). Toujours juger sur localhost ou sur la prod.
- Test depuis un téléphone via IP LAN : **ne marche pas** (pare-feu Windows).
  Utiliser localhost sur le PC, ou la prod Netlify.
- Windows / PowerShell : `System.Drawing` échoue sur certains JPEG (OutOfMemory) →
  utiliser **ffmpeg/ffprobe** (présent) pour lire les dimensions et convertir.

### 🎨 Vocabulaire de Roy
- « **menu déroulant** » peut vouloir dire **carrousel** (« qui déroule après un
  certain temps ») OU un vrai menu déployable. En cas de doute, clarifier.

---

## 1. Le projet en une phrase

Refonte « Prestige » du site vitrine + billetterie de l'**UECE** (Union des Étudiants
et Chercheurs Étrangers, UMONS). Site **100 % statique** (HTML/CSS/JS vanilla, zéro
build, librairies via CDN), hébergé sur **Netlify** (déploiement continu depuis
GitHub `RoyMusango/site-uece-umons`), en ligne sur **https://uece-umons.netlify.app**.
Public majoritairement mobile. Mainteneurs futurs = comité étudiant non technique
(passation ~tous les 2 ans).

- **Roy** pilote, non-développeur, travaille sous Windows. Il valide sur localhost.
- **Claude Code** code, gère Git, teste, et NE POUSSE QU'APRÈS validation.

---

## 2. Identité visuelle (déjà en place)

- Couleurs : **marine `#002147`** + **or `#D4AF37`** (tokens CSS dans `:root`).
- Typo : **Cormorant Garamond** (titres, eyebrows en capitales espacées) / **Outfit**
  (texte). Polices **auto-hébergées** dans `/fonts` (Google Fonts retiré).
- Dispositifs signature : **cadre double filet or**, eyebrows dorés, filets
  séparateurs, motif du cercle de mains.
- Motion en paliers : mobile léger (CSS + IntersectionObserver), desktop riche
  (GSAP via `import()` dynamique, halo curseur, tilt 3D) — tout coupé si
  `prefers-reduced-motion`.

---

## 3. État actuel — ce qui est EN PRODUCTION

Phases 1 à 7 terminées et déployées. Le site comporte **8 pages** :

| Page | Rôle | Contenu éditable (CMS) |
|---|---|---|
| `index.html` | Accueil (hero + panneau « Découvrir l'UECE » + carrousel d'affiches) | — |
| `gala.html` | **Billetterie PayPal (CRITIQUE, zones gelées)** | `data/gala.json` |
| `evenements.html` | Événements en accordéon (gala, soirées jeux, réseautage…) | `data/evenements.json` |
| `association.html` | « C'est quoi l'UECE ? » : mission (carrousel), adhésion, bureau actuel + historique | `data/bureaux.json` |
| `faq.html` | FAQ générale | `data/faq.json` |
| `annonces.html` | Infos HUE/UE (démarches, deadlines, liens officiels) | (pas encore externalisé) |
| `guide.html` | Guide de l'étudiant (culture, lieux, marchés, images de Mons) | (pas encore externalisé) |
| `standard.html` | Modèle + styleguide vivant | — |

**Réalisations clés de la session des 17–20/07/2026 :**
- **Contenus externalisés** dans `data/*.json`, injectés par `js/*-data.js`
  (fetch + `textContent`, repli silencieux sur le HTML si échec). Le CMS édite le
  JSON, jamais le HTML.
- **CMS Decap + DecapBridge** préparé (`admin/`) — voir §6, action Roy en attente.
- **Pages créées** : FAQ, Association (avec historique des bureaux, mission en
  carrousel, conditions d'adhésion), Événements.
- **Menus déroulants** « prestige » dans la nav (ouverture au survol desktop,
  panneau large 2 colonnes pour « Infos »).
- **Hero accueil** : panneau « Découvrir l'UECE » + les 2 affiches en carrousel.
- **Favicon logo UECE** sur toutes les pages (fini le globe générique).
- **Images de Mons** intégrées dans le guide (bandeaux de cartes, carrousels
  Doudou et marchés, musées, Beffroi en carte vedette).
- **Postes du bureau formalisés** (9 postes) et **liens sources exacts** dans annonces.
- Le **billet** du gala se télécharge en PDF + arrive par mail avec QR code (Make).

---

## 4. Règles de design établies (à respecter pour la suite)

### Carrousels (toutes pages, présentes et futures)
- Une **image de contenu** (affiche, photo) n'est **JAMAIS recadrée** : le texte du
  visuel doit rester intégralement lisible.
- **Toutes les diapositives d'un carrousel ont la même taille de scène** (ratio fixe,
  cadre identique). Motif de référence : `.affiche-scene` (4/5) et `.scene-photo`
  (3/2) = image entière en `object-fit: contain` posée sur elle-même floutée/
  assombrie en fond (`.affiche-fond`). Le recadrage `cover` n'est permis que pour
  ce **fond décoratif**.
- **Limite du fond flouté** : ne vaut que si l'image remplit ~70 % de la scène.
  Photo trop verticale → changer de mise en page (**carte vedette** `.carte-vedette` :
  photo entière à gauche, texte à droite — cf. le Beffroi dans le guide).
- Auto-défilement : **6 s, pause au survol, désactivé en reduced-motion**
  (via `js/carrousels.js`, attribut `data-carrousel-auto`).

### Panneaux au survol
- Toujours **collés au déclencheur** (aucun `margin` entre les deux, sinon le survol
  se perd pendant la descente du curseur et le panneau se referme).
- Attention aux **contextes d'empilement** : une animation `fill-mode: both` fige un
  transform → poser le `z-index` sur l'élément animé lui-même, pas sur un enfant.

### Images
- Convertir chaque nouvelle image en **400 px + 800 px, WebP + repli JPEG**, noms
  **sans espaces ni accents** (slugs). Sources déposées par Roy dans `images/`.
- `loading="lazy"` partout sauf la 1re image du hero (`fetchpriority="high"`).

---

## 5. ZONES GELÉES — `gala.html` (ne jamais casser)

Le style peut changer, **la logique et les identifiants NON** :
- La ligne `<script src="https://www.paypal.com/sdk/js?client-id=…&currency=EUR">`.
- Les fonctions `selectTicket`, `validateForm`, `initializePayPal`, `telechargerFacture`.
- La construction `custom_id = nom + "|||" + email` (Make.com en dépend).
- Les IDs : `nomParticipant`, `emailParticipant`, `paypal-button-container`,
  `factureArea`, `participantNameSummary`, `displayAmount`, `card-standard`,
  `card-vip`, `participantForm`.
- **Les PRIX ne sont PAS dans le CMS** (câblés dans le code de paiement : un CMS qui
  change l'affichage sans le débit ferait payer un mauvais montant). Procédure de
  changement de prix dans le README §5.
- Après toute modif de `gala.html` : **test Sandbox PayPal complet** (aujourd'hui
  reporté car migration Stripe envisagée — cf. §7).
- **Aucun secret dans le repo** (URL webhook Make, clé secrète Stripe). Le Client ID
  PayPal est public par nature, OK.

---

## 6. Actions EN ATTENTE côté Roy (débloquent la suite)

1. **Compte bancaire UECE** → prérequis absolu pour créer le compte **Stripe**
   (IBAN au nom de l'association). **C'est le chemin critique** : lancer l'ouverture
   du compte dès que possible (souvent plusieurs semaines pour une asso). Tout le
   reste de Stripe est prêt à démarrer une fois ce compte ouvert.
2. **Images à collecter** (liste détaillée dans `docs/…ANNEXE 7`) : BAM ou maison
   Van Gogh, le Grand Large, **portraits des bureaux** (actuel 2026-2027 + anciens),
   et les **3 photos du carrousel mission** de la page Association (Accueillir /
   Intégrer / Représenter — les fonds actuels sont provisoires). Aussi : renvoyer
   l'image de la **Ducasse** (annoncée mais absente du repo).
3. **Inscription DecapBridge** (~5 min, gratuit) pour activer l'administration :
   compte sur decapbridge.com → déclarer le repo → coller le bloc `backend:` généré
   dans `admin/config.yml`. Détails au README §3.
4. **Validation du comité** sur les contenus d'exemple : FAQ, événements, conditions
   d'adhésion (montant cotisation + critère d'éligibilité), démarches HUE/UE
   (montants et délais changent chaque année académique).

---

## 7. Stripe — décidé mais REPORTÉ (plan complet : `docs/…ANNEXE 8`)

- **Pourquoi** : Bancontact (0,35 € fixe, préféré des Belges), Apple/Google Pay
  gratuits, **codes promo membres à usage unique natifs**, frais réduits vs PayPal.
- **Architecture retenue** : **Stripe Payment Links** (zéro serveur, compatible site
  statique ; les prix deviendraient éditables dans le dashboard Stripe → fin du
  problème des prix gelés).
- **Bloqué sur** : le compte bancaire (§6.1).
- **Sécurité de la bascule** : PayPal reste en service jusqu'aux tests de bout en
  bout en mode test Stripe (cartes fictives gratuites, pas comme le Sandbox PayPal).
- Décisions comité en attente : montant de la réduction membre ; possibilité
  d'acheter plusieurs tickets en un paiement.

---

## 8. Fichiers de référence dans le repo

- `CLAUDE.md` — règles permanentes du projet (à respecter à chaque session).
- `CONTEXTE_REPRISE.md` — journal détaillé, phase par phase.
- `README.md` — **document de passation** pour le comité (édition CMS, changement de
  prix, test Sandbox, quotas Make/Netlify, comptes à transmettre).
- `docs/…ANNEXE 6` — frais PayPal/Stripe/Bancontact, quotas, données à collecter.
- `docs/…ANNEXE 7` — banque d'images à collecter, section par section.
- `docs/…ANNEXE 8` — plan de migration Stripe (qui fait quoi, étapes).

---

## 9. Prompt suggéré pour démarrer le nouveau chat

> Lis `REPRISE_NOUVEAU_CHAT.md`, `CLAUDE.md` et `CONTEXTE_REPRISE.md` à la racine du
> repo. Respecte impérativement les consignes de travail (§0) : on ne pousse jamais
> sans que je valide d'abord sur localhost. Voici ce que je veux faire aujourd'hui : …
