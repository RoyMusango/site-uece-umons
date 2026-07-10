# CLAUDE.md — Site UECE UMONS (refonte "Prestige")

> Ce fichier pilote Claude Code sur ce projet. Le lire intégralement avant toute modification.
> Objectif : professionnaliser le site existant (rendu premium type "site à 10 000 €")
> SANS casser la billetterie PayPal, le flux Make.com, ni la simplicité de passation.

---

## 1. Contexte

Site vitrine + billetterie du Gala de l'UECE (Union des Étudiants et Chercheurs Étrangers, UMONS).
- **Public** : étudiants (consultation majoritairement mobile), partenaires, université.
- **Job n°1 du site** : vendre les tickets du Gala (gala.html). Tout le reste est secondaire.
- **Hébergement** : Netlify. **CMS prévu** : Decap. **Emails** : Make.com (webhook PayPal → Gmail).
- **Mainteneurs futurs** : membres du comité NON techniques (passation tous les ~2 ans).

## 2. Contraintes non négociables

1. **Site 100 % statique, zéro build step.** Pas de React/Vue/bundler/npm. HTML + CSS + JS vanilla.
   Librairies uniquement via CDN. (Critère sécurité + passation défini dans la doc du projet.)
2. **Compatibilité mobile impeccable** (viewport 360 px minimum, pouce, 4G).
3. **Accessibilité** : contrastes AA, focus visibles, `prefers-reduced-motion` respecté partout.
4. **Le flux de paiement ne doit JAMAIS être régressé.** Voir §5 "Zones gelées".
5. **Aucun secret dans le repo** : l'URL du webhook Make ne doit jamais apparaître dans le code
   ni dans les commits. (Le Client ID PayPal, lui, est public par nature — OK côté front.)

## 3. Arborescence cible

```
/
├── index.html          # Accueil
├── gala.html           # Page de vente (CRITIQUE)
├── annonces.html       # Infos capitales pour étudiants internationaux (HUE / UE)
├── standard.html       # Template pour nouvelles pages + styleguide vivant
├── style.css           # Design system + styles (source de vérité CSS)
├── js/
│   ├── motion.js       # GSAP : reveals, nav, hero (créé en Phase 2)
│   └── gala-data.js    # Injection des données éditables (créé en Phase 5)
├── data/
│   └── gala.json       # Contenus éditables par le CMS : prix, date, lieu… (Phase 5)
├── images/             # AVIF/WebP + fallback
├── admin/              # Decap CMS (index.html + config.yml) — Phase 5
└── CLAUDE.md
```

## 4. Direction artistique — "Prestige diplomatique"

L'identité est déjà fixée par le logo (cercle de mains multiculturelles, marine + or) et
l'affiche "Kings & Queens" (sérif à fort contraste, capitales espacées, cadre double filet).
On la suit exactement — on l'exécute mieux.

### 4.1 Tokens couleur (CSS custom properties, dans `:root`)
```css
--navy-950:#050F1E;  --navy-900:#001730;  --navy-800:#002147; /* brand */
--navy-700:#0E3160;
--gold-300:#EBD48B;  --gold-400:#DFC15F;  --gold-500:#D4AF37; /* brand */
--gold-700:#8C6D1F;
--paper:#F7F2E8;     --ink:#131A26;       --muted:#5D6678;
--line-gold:rgba(212,175,55,.30);
```
Règles : sections sombres = texte `--paper` (jamais gris moyen sur marine) ; or réservé aux
accents, filets, eyebrows et CTA — jamais en texte courant. Bordeaux `#800040` (bouton
connexion) : conserver mais harmoniser (hover, focus).

### 4.2 Typographie (2 familles max, Google Fonts, preload + `font-display:swap`)
- **Display** : `Cormorant Garamond` 600/700 — titres, et capitales espacées
  (`letter-spacing:.18em`) pour les eyebrows, comme sur l'affiche.
- **Texte/UI** : `Outfit` 300–600.
- Échelle fluide : `--fs-h1: clamp(2.4rem, 6vw, 4.2rem)` etc. Interlignage titres ≤ 1.15.

### 4.3 Élément signature
Le **cercle de mains** du logo, redessiné en SVG filaire fin (traits or 1 px, fond
transparent) : rotation très lente en fond de hero (`animation` CSS, désactivée si
reduced-motion), et déclinable en séparateur de section. Le **cadre double filet** de
l'affiche devient le dispositif de cadrage des cartes importantes (billets, "En bref").

### 4.4 Motion (Phase 2)
- GSAP 3 + ScrollTrigger **via CDN** (gratuits, tous plugins inclus).
- Reveals : fade + translateY(12px), 0.7 s, `power3.out`, stagger 80 ms, une seule fois.
- Hero : séquence d'entrée orchestrée (eyebrow → titre → sous-titre → CTA).
- Navbar : transparente sur le hero → fond marine + ombre après 40 px de scroll.
- Micro-interactions : soulignement or animé sur liens, élévation douce des cartes.
- Kill-switch global : `@media (prefers-reduced-motion: reduce)` + `gsap.globalTimeline.timeScale(0)`.

## 5. ZONES GELÉES — interdiction de modifier le comportement

Dans `gala.html`, le style peut changer, **la logique et les identifiants non** :
- La ligne `<script src="https://www.paypal.com/sdk/js?client-id=…&currency=EUR">`
  (seul le client-id est remplaçable, par un humain).
- Les fonctions `selectTicket`, `validateForm`, `initializePayPal`, `telechargerFacture`.
- La construction `custom_id = nom + "|||" + email` (Make.com en dépend).
- Les IDs : `nomParticipant`, `emailParticipant`, `paypal-button-container`, `factureArea`,
  `participantNameSummary`, `displayAmount`, `card-standard`, `card-vip`, `participantForm`.
- Après TOUTE modification de gala.html : test complet en Sandbox PayPal
  (paiement fictif → bulle "1" sur Make → mail reçu avec QR code).

## 6. Budget performance (à vérifier à chaque phase)

- JS custom ≤ 60 KB ; JS total hors SDK PayPal ≤ 200 KB.
- LCP < 2,5 s en 4G simulée ; CLS < 0,1 ; Lighthouse mobile ≥ 90.
- Images : AVIF/WebP + `srcset` + `loading="lazy"` (sauf hero) ; poids page accueil < 1 Mo.
- Pas de vidéo de fond, pas d'embed Spline, pas de WebGL sans validation explicite (§8).

## 7. Backlog par phases

### Phase 1 — Fondations du design system  ✅ critère : styleguide validé
- Réécrire `style.css` : tokens §4, reset léger, typo fluide, boutons, cartes, nav, footer.
- Appliquer à `index.html`, `standard.html`, `gala.html` (structure inchangée, habillage).
- `standard.html` sert de styleguide vivant (section démo des composants).

### Phase 2 — Hero & motion  ✅ critère : reduced-motion OK, 60 fps mobile milieu de gamme
- Créer `js/motion.js` (GSAP CDN). Hero accueil redessiné avec le motif signature.
- Reveals sur toutes les sections, navbar dynamique, micro-interactions.

### Phase 3 — gala.html, passe conversion  ✅ critère : parcours d'achat Sandbox intact
- Restructurer la narration : hero événement → programme (timeline) → billets → confiance
  (paiement sécurisé, contact) → FAQ. Cartes billets comparatives, cadre double filet.
- Mobile : récap prix + CTA sticky en bas d'écran. Ne pas toucher aux zones gelées.

### Phase 4 — Performance, accessibilité, QA
- Conversion images (AVIF/WebP), preload fonts, audit Lighthouse, contrastes,
  navigation clavier, test 360 px réel.

### Phase 5 — Contenu éditable & déploiement pérenne
- Externaliser les contenus variables dans `data/gala.json` ; `js/gala-data.js` les injecte
  (fetch + textContent). Le CMS édite le JSON, pas le HTML.
- Decap CMS : backend à décider — **DecapBridge** (drop-in, invitations email) ou backend
  GitHub direct. ⚠️ Netlify Identity + Git Gateway sont dépréciés : ne pas suivre
  l'Annexe 3 telle quelle.
- Déploiement : repo GitHub + déploiement continu Netlify (remplace le drag-and-drop).
- Mettre à jour le README (procédure de passation incluse).

## 8. Extensions optionnelles (uniquement sur demande explicite)
- Accent 3D hero : UN modèle .glb compressé Draco, Three.js via CDN en module, chargement
  lazy après LCP, poster statique en fallback, désactivé sous 768 px et en reduced-motion.
- Particules or : canvas maison ≤ 6 KB, ≤ 60 particules, pause si onglet caché.

## 9. Conventions de travail
- Git : une branche par phase (`phase-1-design-system`…), commits atomiques en français
  (`feat(css): tokens couleur et typo fluide`). Jamais de commit direct sur `main`.
- Checklist avant merge : mobile 360 px ✓ clavier ✓ reduced-motion ✓ Lighthouse ✓
  et, si gala.html touché, paiement Sandbox de bout en bout ✓.

## 10. Prompts de lancement (Claude Code)
- Phase 1 : « Lis CLAUDE.md puis exécute la Phase 1 uniquement. Propose d'abord un plan des
  changements CSS fichier par fichier, attends ma validation, puis implémente. »
- Phase 2 : « Exécute la Phase 2 en respectant §4.4 et le budget §6. Montre-moi le hero
  avant d'animer le reste. »
- Phase 3 : « Exécute la Phase 3. Rappelle-toi : §5 zones gelées. Termine par la checklist §9. »
