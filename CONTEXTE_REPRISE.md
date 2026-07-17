# Contexte de reprise — Site UECE UMONS (refonte "Prestige")

> À coller en début d'une nouvelle conversation pour reprendre le projet sans repartir de zéro.

---

## 1. Le projet en une phrase

Refonte professionnelle du site de l'UECE (Union des Étudiants et Chercheurs Étrangers,
UMONS) : une vitrine + une billetterie de Gala, avec un rendu « site à 12 000 € » sur
desktop et une version mobile rapide et fluide. Objectif : donner l'effet « wow » des sites
primés montrés dans une vidéo de référence, sans jamais fragiliser le tunnel de paiement.

## 2. Qui fait quoi

- **Moi (l'utilisateur)** : Roy, pilote le projet. Je ne suis pas développeur pro mais je
  suis les étapes. Je travaille sur Windows, dossier local
  `C:\Users\Lilie\Documents\GitHub\site-uece-umons`.
- **Claude Code (CLI, modèle Fable 5)** : exécute les modifications de fichiers en local,
  gère Git. C'est lui qui code.
- **Toi (cette conversation, claude.ai)** : rôle de senior design/architecture. Tu cadres,
  tu arbitres, tu revois, tu écris les directives et les prompts que je passe ensuite à
  Claude Code. Tu ne codes pas le site toi-même ici — tu conçois et tu supervises.

## 3. Stack et contraintes (inchangées, non négociables)

- Site **100 % statique** : HTML + CSS + JS vanilla, **zéro build step**, librairies via CDN.
  Pas de React/Vue/bundler. (Raison : sécurité + passation par des non-techniciens.)
- **Bootstrap 5.3 + Font Awesome** conservés (le menu burger et la grille en dépendent) et
  surchargés par le design system maison.
- Hébergement **Netlify** connecté au dépôt GitHub `site-uece-umons` (déploiement continu :
  je push → Netlify redéploie tout seul, plus de glisser-déposer). Site en ligne :
  `uece-umons.netlify.app`.
- **CMS prévu (Phase 5)** : Decap CMS + **DecapBridge** (invitations email, pas de compte
  GitHub pour les éditeurs). ⚠️ NE PAS utiliser Netlify Identity / Git Gateway : dépréciés.
- Contenus variables (prix, date, lieu) iront dans `data/gala.json`, édités par le CMS,
  injectés par un script. Le CMS n'édite jamais le HTML brut.

## 4. Direction artistique validée

- **Identité** : marine (#002147) + or (#D4AF37), dérivée du logo (cercle de mains
  multiculturelles) et de l'affiche « Kings & Queens » (sérif à fort contraste, capitales
  espacées, cadre double filet).
- **Typo** : Cormorant Garamond 600/700 (titres + eyebrows en capitales espacées .18em) /
  Outfit 300–600 (texte et UI). Échelle fluide en `clamp()`.
- **Dispositifs signature** : cadre double filet or pour les cartes importantes ; eyebrows
  or en petites capitales ; filets or comme séparateurs.

## 5. Stratégie technique clé : une base, plusieurs paliers

Pas de site mobile séparé. Un seul HTML, chargement conditionnel du « décor » :
- **Palier 0** (tout, même sans JS) : HTML + CSS, site lisible, billet achetable.
- **Palier 1** (mobile / <1024px / tactile) : transitions CSS + reveals via
  `IntersectionObserver` (~1 KB).
- **Palier 2** (desktop ≥1024px, `pointer:fine`, pas de reduced-motion, pas de saveData,
  deviceMemory ≥4) : GSAP + ScrollTrigger chargés en `import()` dynamique — c'est là que
  vit tout le spectacle.
- **Palier 3** (bonus, sur demande explicite) : accent 3D/canvas.

Règle d'or : le mobile perd du décor, jamais du contenu ni une étape du tunnel d'achat.

## 6. ZONES GELÉES — à ne jamais casser (gala.html)

Le style peut changer, la logique et les identifiants NON :
- La ligne `<script src="https://www.paypal.com/sdk/js?client-id=…&currency=EUR">`.
- Les fonctions `selectTicket`, `validateForm`, `initializePayPal`, `telechargerFacture`.
- La construction `custom_id = nom + "|||" + email` (Make.com en dépend).
- Les IDs : `nomParticipant`, `emailParticipant`, `paypal-button-container`, `factureArea`,
  `participantNameSummary`, `displayAmount`, `card-standard`, `card-vip`, `participantForm`.
- Après TOUTE modif de gala.html : test complet en Sandbox PayPal
  (paiement fictif → bulle "1" sur Make → mail reçu avec QR code).

## 7. Où on en est

- ✅ **Phase 0** : cadrage, décisions d'architecture, fichier `CLAUDE.md` à la racine.
- ✅ **Setup** : repo GitHub `site-uece-umons`, Netlify connecté, Claude Code installé et
  authentifié (Fable 5), branche `phase-1-design-system` créée.
- ✅ **Phase 1** : design system (réécriture de `style.css` avec tokens couleur + typo
  fluide, habillage de index/standard/gala, styleguide vivant dans standard.html,
  correction du lien mort `UECE.html`→`index.html`). Zones gelées intactes.
- ✅ **Phase 2** (12/07/2026, blocs 1→7) : direction retenue = fusion « Salle d'honneur »
  (lumière-curseur dominante) + tilt 3D des affiches. Infrastructure paliers :
  `js/motion-gate.js` (html.motion-on / html.motion-rich, import() GSAP+ScrollTrigger
  jsdelivr `+esm` après load+idle), `js/reveals.js` (IO tous paliers), `js/motion-desktop.js`
  (halo curseur, parallax, tilt, [data-glow], [data-magnet], séparateurs dessinés).
  Grain/2ᵉ anneau/filigranes = desktop ≥992px uniquement (coût mobile mesuré ~15 pts/couche).
  Gala habillé (double filet hero + tickets) ; billet PDF redessiné (DL paysage, logo 300px) ;
  bugs corrigés en zone gelée (assumés, documentés) : recréation boutons PayPal supprimée,
  email validé+trim avant custom_id. Scores localhost : 4 pages a11y 100, perf 87-98,
  JS custom 11 Ko. ⚠ Reste : dernier achat fictif de validation (en prod post-merge, cf. T7.4).
  Pièges passation : interrupteur Make « Immediately as data arrives » = cause n°1 de mails
  absents ; connexion Gmail de Make à ré-autoriser avant le 25/09/2026 ; champ To =
  `{{get(split(1.resource.custom_id; "|||"); 2)}}` ; purger la file du webhook après des
  tests ratés (les vieux paquets se rejouent via Run once).
- ✅ **Phase 3** (12/07/2026, branche `phase-3-gala-conversion`) : programme en timeline
  (horaires indicatifs à confirmer), FAQ 5 questions (réponses d'exemple À VALIDER),
  récap prix + CTA sticky mobile (masqué dès que la réservation est à l'écran,
  js/gala-cta.js). Zones gelées intactes. ⚠ Test Sandbox requis avant merge.
- ✅ **Phase 4** (12/07/2026, branche `phase-4-perf-qa`, empilée sur la 3) : polices
  auto-hébergées dans /fonts (Google Fonts retiré du site — un tiers de moins),
  affiches en WebP + repli JPEG (-35/-40 %). FCP ~2,3 s partout en local, CLS ~0,
  a11y 100 ×4. Mesure locale bruitée (CDN throttlent les runs répétés) : vérité perf
  à lire sur PageSpeed Insights en prod après merge.
- ✅ **Phase 5** (17/07/2026, branche `phase-5-contenus`) : contenus du gala
  externalisés dans `data/gala.json`, injectés par `js/gala-data.js`
  (fetch + textContent uniquement, repli silencieux sur le HTML si échec).
  Marqueurs `data-edit` / `data-edit-lines` / `data-edit-programme` /
  `data-edit-faq` posés dans gala.html (zones gelées intactes — script ajouté
  et attributs seulement). Admin Decap CMS dans `admin/` (backend DecapBridge :
  bloc `backend:` de config.yml à remplacer par celui généré à l'inscription
  decapbridge.com — action humaine restante). **Décision assumée : les PRIX ne
  sont PAS éditables par le CMS** (ils sont câblés dans selectTicket, zone
  gelée ; un CMS qui change l'affichage sans changer le débit ferait payer un
  mauvais montant) → procédure « changement de prix » documentée au README §5.
  Idem date/lieu : éditables côté site, mais aussi écrits en dur dans le billet
  PDF (telechargerFacture) et le mail Make → README §6. README réécrit en
  document de passation complet. ⚠ Reste : inscription DecapBridge + coller le
  bloc backend, et test Sandbox (gala.html modifié — Roy a choisi de le
  reporter, migration Stripe envisagée). Mergée en prod le 17/07/2026.
- ✅ **Phase 6** (17/07/2026, branche `phase-6-faq-historique-menu`) : trois
  chantiers demandés par Roy. (1) `faq.html` : FAQ générale, 9 questions
  d'exemple À VALIDER, éditable via data/faq.json + js/faq-data.js.
  (2) `association.html` « C'est quoi l'UECE ? » : mission (3 cartes), CTA
  devenir membre, section #bureaux = historique des bureaux éditable via
  data/bureaux.json + js/bureaux-data.js (noms « À compléter » — Roy collecte
  auprès des anciens bureaux). (3) Menus déroulants « prestige » : ouverture au
  survol desktop (clic Bootstrap conservé), fondu+glissement, filet or, panneau
  large 2 colonnes .menu-panel pour le menu Infos (titre + description par
  entrée), reduced-motion géré, mobile Bootstrap intact. Nav normalisée sur les
  7 pages (liens morts « Historique »/standard.html remplacés par
  association.html). CMS : collections faq + association ajoutées. Vérifié
  jsdom 15/15 (injections + nav des 7 pages). Annexe 6 créée (comparatif
  PayPal/Stripe/Bancontact, quotas, données à collecter).
- ✅ **Phase 6b** (17/07/2026, sur demande de Roy) : association.html enrichie.
  (1) Mission = carrousel Bootstrap plein cadre (auto 6 s, pause au survol,
  PAS d'auto-défilement en reduced-motion via js/association-carrousel.js ;
  fonds : activites/evenements + 3ᵉ panneau motif-mains sur marine ; noscript
  redonne les textes). (2) Encart membre → conditions d'adhésion listées
  (coches or, PLACEHOLDERS à valider : critère d'éligibilité et montant de la
  cotisation à compléter par le comité) + « écrivez-nous pour plus d'infos ».
  (3) Section « Le bureau actuel » (cartes membres : photo ronde ou initiales
  or/marine, rôle, mini-bio) + historique enrichi pareil. data/bureaux.json
  restructuré (adhesion, bureauActuel, bureaux) ; CMS mis à jour (widget image
  pour les photos → images/uploads). Vérifié jsdom 14/14. **Annexe 7 créée :
  liste de courses d'images par section (mission, portraits, culture, campus
  UMONS, marchés…) + règles de droits ; recommandation actée : max 1 carrousel
  par page, images fixes en bandeau pour les grilles de cartes.** L'image
  Ducasse évoquée par Roy n'est PAS dans images/ (à réclamer).
- ✅ **Phase 6c** (17/07/2026) : (1) hero accueil — les 2 boutons (Gala /
  Infos HUE-UE) remplacés par le panneau déroulant « Découvrir l'UECE »
  (4 entrées vers association/FAQ + bouton « Plus d'informations » ; survol
  desktop + clic partout, data-bs-display=static ; l'accès Gala reste via la
  carte « Prochain événement » et la nav — décision de conversion assumée et
  signalée à Roy). (2) Favicon logo UECE généré (32/192/180 px PNG depuis
  logo-uece.png 499², System.Drawing) et référencé sur les 8 pages.
  (3) Mandats corrigés : bureau actuel = 2026 – 2027, l'historique commence à
  2025 – 2026. Vérifié jsdom 19/19. **Stripe REPORTÉ : pas encore de compte
  bancaire UECE (prérequis IBAN) — conseil donné : lancer l'ouverture du
  compte en parallèle, c'est le chemin critique. Prochain chantier : images
  (Roy collecte, Annexe 7).** Rappel donné : les effets curseur/GSAP ne
  fonctionnent pas en ouvrant les .html en file:// (import() CDN bloqué) —
  tester sur uece-umons.netlify.app.

## 8. ⭐ NOUVELLE DIRECTIVE — ce qui doit changer en Phase 2

**Le problème actuel :** la version « wow » desktop se résume à mon logo SVG qui tourne
lentement entouré de poussière d'or, dans un petit espace confiné. Ce n'est PAS wow. Ça ne
donne pas le rendu d'un senior ni d'un site à 12 000 €. Les sites de la vidéo de référence
ont des animations interactives riches (ex : le curseur qui crée des effets), du design
présent jusque dans les arrière-plans.

**Ce que je veux (Phase 2, palier desktop) :**

1. **Sortir l'animation de sa boîte.** Le décor doit occuper tout le hero et déborder en
   arrière-plan, pas rester dans un petit carré. Pense « ambiance de scène », pas « logo
   animé ».
2. **Traiter les arrière-plans comme du design à part entière.** Notamment : l'arrière-plan
   de la zone bleue de l'accueil, et spécifiquement **derrière les deux images carrées** de
   la page d'accueil (activités / événements). Ces zones sont actuellement plates ; elles
   doivent avoir de la profondeur (dégradés travaillés, halos or, texture subtile, filets,
   motif dérivé du cercle de mains en très basse opacité, grain léger…).
3. **Interactivité au curseur (desktop uniquement).** Effets qui réagissent au mouvement de
   la souris : parallax multi-couches, halo/lueur qui suit le curseur, réactions au survol
   plus riches que le simple soulignement. C'est ce qui crée l'effet « vivant » des sites
   primés.
4. **Séquence d'entrée du hero orchestrée** (eyebrow → titre → sous-titre → CTA), navbar
   transparente→marine au scroll, reveals au scroll sur toutes les sections.

**Garde-fous impératifs (ne pas les sacrifier au wow) :**
- Tout le supplément visuel = **palier 2 desktop uniquement**, chargé en `import()`
  dynamique. Le mobile reste léger et fluide.
- **Respect de `prefers-reduced-motion`** : kill-switch qui désactive tout.
- Budget perf tenu : LCP < 2,5 s en 4G, CLS < 0,1, Lighthouse mobile ≥ 90. Les arrière-plans
  travaillés doivent être en CSS (dégradés, `radial-gradient`, SVG léger, `mix-blend-mode`,
  grain en pseudo-élément) — PAS d'images lourdes ni de vidéo de fond.
- Animations sur `transform`/`opacity` uniquement (composited, 60 fps), jamais sur des
  propriétés qui déclenchent le layout.
- Effets curseur en `pointer-events:none` sur les couches décoratives pour ne rien bloquer.

**Page Gala — traitement spécifique :**
- Elle DOIT recevoir plus d'éléments de design professionnels (elle est un peu nue), MAIS
  c'est notre page de vente : **zéro friction, zéro ralentissement au moment du paiement**.
- Donc : soigner le hero événement, les séparateurs, les cartes billets (cadre double filet),
  les arrière-plans de section — tout en CSS léger. Aucune animation lourde autour du bouton
  PayPal. Le décor ne doit jamais retarder l'affichage ni l'interaction de la billetterie.
- Zones gelées §6 toujours intactes + test Sandbox après coup.

## 9. Prompt à passer à Claude Code pour la suite de la Phase 2

> Lis CLAUDE.md et CONTEXTE_REPRISE.md (section 8 surtout). On est en Phase 2, branche
> `phase-2-hero-motion`. Objectif : un vrai rendu « wow » desktop, pas un logo qui tourne
> dans un coin. Commence par le hero de l'accueil et les arrière-plans de la zone bleue
> (surtout derrière les deux images carrées) : propose-moi 2 directions visuelles décrites
> précisément (couches, dégradés, halos, motif, interactivité curseur) AVANT de coder.
> Respecte strictement les paliers (tout le supplément en palier 2 desktop, import()
> dynamique), `prefers-reduced-motion`, le budget perf, et les zones gelées de gala.html.
> Montre-moi le hero avant d'appliquer le reste.

## 10. Fichiers de référence du projet

- `CLAUDE.md` (racine du repo) : contexte permanent pour Claude Code.
- `CONTEXTE_REPRISE.md` (ce fichier) : état d'avancement + directives ponctuelles.
- `docs/` : les 6 annexes techniques d'origine (PayPal, Make.com, Decap, liquidité…).
- Vidéo de référence pour le « wow » : à re-fournir en lien si besoin.
