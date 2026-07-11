# Phase 2 — Plan de tâches atomiques (hero, motion, arrière-plans)

> Compagnon de `CONTEXTE_REPRISE.md`. Chaque tâche = une action, un responsable, un
> critère « ✓ Fait quand ». À exécuter dans l'ordre — l'ordre est une décision, pas un hasard.

## Comment utiliser ce guide

1. **Une tâche = un commit.** On ne passe à la suivante que si le « ✓ Fait quand » est vrai.
2. **Jamais deux blocs en parallèle.** Si un critère échoue → on corrige avant d'avancer.
3. Les encadrés « Prompt → Claude Code » sont prêts à coller dans le CLI. Adapte librement
   le ton, jamais les contraintes.
4. Pourquoi cet ordre : **l'infrastructure avant le spectacle** (le gate des paliers est la
   fondation de tout), **le hero avant la généralisation** (on valide la direction sur une
   zone avant de la propager), **gala.html en dernier** (page la plus risquée : on y arrive
   avec des patterns déjà éprouvés ailleurs).

---

## BLOC 0 — Préparation *(Roy, ~15 min)*

**T0.1 — Vérifier l'état de départ** *(Roy)*
S'assurer que la Phase 1 est bien mergée sur `main` et que `uece-umons.netlify.app`
l'affiche sans régression.
✓ Fait quand : la prod reflète la Phase 1, aucun bug visuel connu.

**T0.2 — Basculer sur la branche de travail** *(Roy ou Claude Code)*
Créer/checkout `phase-2-hero-motion` depuis `main`.
✓ Fait quand : `git branch` montre la branche active.

**T0.3 — Mesure de référence** *(Roy)*
Lighthouse (mobile + desktop, navigation privée) sur `index.html` et `gala.html` en prod.
Noter les 4 scores + LCP + CLS dans un coin de `CONTEXTE_REPRISE.md`.
✓ Fait quand : les chiffres « avant » sont notés. C'est la ligne de base du bloc 7.

---

## BLOC 1 — Infrastructure motion *(Claude Code — fondation, AVANT tout visuel)*

**T1.1 — Le « gate » palier 2**
Un petit script (ex. `js/motion-gate.js`) qui vérifie : largeur ≥ 1024 px, `pointer: fine`,
pas de `prefers-reduced-motion`, pas de `saveData`, `deviceMemory ≥ 4` (si dispo). Si tout
est vert : `import()` dynamique de GSAP + ScrollTrigger (ESM via CDN jsdelivr `+esm` —
faire vérifier l'URL exacte par Claude Code) et ajout d'une classe `motion-on` sur `<html>`.
✓ Fait quand : sur desktop, `motion-on` apparaît et GSAP se charge (visible dans l'onglet
Network) ; sur mobile / reduced-motion, **rien** n'est téléchargé.

**T1.2 — Reveals palier 1 (mobile inclus)**
`IntersectionObserver` vanilla (~1 KB) : les éléments `.reveal` reçoivent `.is-visible`
en entrant dans le viewport ; le CSS fait un fade + translate léger.
✓ Fait quand : ça marche mobile **et** desktop, et **JS coupé = tout le contenu visible**
(voir la règle anti-FOUC ci-dessous).

**T1.3 — Kill-switch reduced-motion**
Media query CSS globale `@media (prefers-reduced-motion: reduce)` qui neutralise
transitions et animations. (Le gate JS l'exclut déjà côté palier 2.)
✓ Fait quand : reduced-motion activé dans l'OS → zéro mouvement sur tout le site.

> ⚠️ **RÈGLE ANTI-FOUC / PALIER 0 (critique)** : les états « avant animation »
> (opacity 0, translate…) ne doivent JAMAIS être dans le CSS de base. Ils ne s'appliquent
> que sous `.motion-on` (ou une classe posée par JS avant le premier paint). Sinon :
> contenu invisible sans JS = violation du palier 0, et risque LCP/CLS.

**Prompt → Claude Code (bloc 1) :**
> Lis CLAUDE.md et CONTEXTE_REPRISE.md. Branche `phase-2-hero-motion`. Avant tout visuel,
> pose l'infrastructure : (1) un script « gate » qui ne charge GSAP+ScrollTrigger en
> import() dynamique QUE si desktop ≥1024px, pointer:fine, pas de reduced-motion, pas de
> saveData, deviceMemory ≥4, et pose une classe `motion-on` sur <html> ; (2) un système de
> reveals IntersectionObserver ~1KB pour tous les paliers ; (3) le kill-switch CSS
> reduced-motion. Contrainte absolue : sans JS, tout le contenu reste visible — aucun état
> opacity:0 dans le CSS de base, uniquement sous `.motion-on`. Montre-moi le plan de
> fichiers avant d'écrire.

---

## BLOC 2 — Hero de l'accueil *(le morceau « wow »)*

**T2.1 — Deux directions visuelles, décrites AVANT de coder** *(Claude Code)*
C'est le prompt §9 de `CONTEXTE_REPRISE.md`. Exiger pour chaque direction : les couches
(fond → motif → halos → grain → contenu), les dégradés (valeurs), le comportement curseur,
et ce que voit le mobile.
✓ Fait quand : tu as 2 propositions écrites, précises, comparables.

**T2.2 — Choisir / fusionner** *(Roy)*
Critère de choix : « ambiance de scène » pleine largeur, **une** idée signature forte
(pas dix effets moyens), et une version mobile statique qui reste belle.
✓ Fait quand : direction arrêtée, notée en une phrase dans CONTEXTE_REPRISE.md.

**T2.3 — Fond du hero full-bleed** *(Claude Code)*
Implémentation 100 % CSS/SVG : radial-gradients marine profonds, halos or, motif « cercle
de mains » en très basse opacité, grain léger (SVG `feTurbulence` en data-URI dans un
pseudo-élément, opacité 2–4 %). `overflow:hidden` sur la section, couches décoratives en
`pointer-events:none`. Aucune image lourde, aucune vidéo.
Note : le logo n'existe qu'en PNG (`logo_test.png`). Pour le motif : soit une version SVG
simplifiée redessinée, soit provisoirement le PNG en très basse opacité + léger blur.
✓ Fait quand : rendu validé desktop, version mobile statique élégante, Lighthouse mobile
non dégradé vs T0.3.

**T2.4 — Séquence d'entrée orchestrée** *(Claude Code, palier 2)*
Timeline GSAP : eyebrow → titre → sous-titre → CTA, décalages 80–120 ms, easing doux.
Le H1 doit être peint immédiatement (animer **après** le premier paint, pas le retarder).
✓ Fait quand : joue une fois au chargement desktop ; rien sur mobile ; rien en
reduced-motion ; LCP intact.

**T2.5 — Navbar transparente → marine au scroll** *(Claude Code)*
Toggle d'une classe au scroll (seuil ~40 px), transition CSS sur fond/ombre. Lisibilité
des liens garantie dans les deux états. Burger mobile intact.
✓ Fait quand : transition fluide sur toutes les pages, aucun saut de layout.

---

## BLOC 3 — Arrière-plans de l'accueil *(Claude Code)*

**T3.1 — Zone bleue : de la profondeur**
Dégradé multi-stops, halo or diffus, filets, motif basse opacité — fini le flat.
✓ Fait quand : contraste texte ≥ AA conservé, rendu validé par Roy.

**T3.2 — Derrière les deux images carrées (activités / événements)**
Les images doivent « flotter » sur un décor : halo/cadre décalé, couche or en
`mix-blend-mode`, ombre travaillée. Dimensions des conteneurs inchangées.
✓ Fait quand : rendu validé, **CLS = 0** (aucun décalage de mise en page).

**T3.3 — Survols enrichis des cartes (Bienvenue / Prochain événement)**
Élévation, filet or qui « s'allume », micro-translate. `transform`/`opacity` uniquement,
aucun effet hover sur tactile.
✓ Fait quand : fluide (60 fps), rien ne bouge au survol sur mobile.

**Prompt → Claude Code (bloc 3) :**
> Toujours sur `phase-2-hero-motion`. Traite les arrière-plans de index.html comme du
> design : (1) zone bleue avec profondeur (dégradés multi-stops, halo or, filets, motif
> mains en très basse opacité) ; (2) décor derrière les deux images carrées — elles doivent
> flotter, sans changer leurs dimensions (CLS=0) ; (3) survols des deux cartes enrichis,
> transform/opacity uniquement. Tout en CSS léger, pas d'images. Contraste AA conservé.
> Montre-moi un avant/après par zone.

---

## BLOC 4 — Interactivité curseur *(Claude Code, palier 2 uniquement)*

**T4.1 — Parallax multi-couches du hero**
2 à 4 couches, amplitudes différentes, lissage (lerp) via `requestAnimationFrame`,
couches en `pointer-events:none`.
✓ Fait quand : fluide, aucun lien/bouton bloqué, inertie agréable (pas de jitter).

**T4.2 — Halo qui suit le curseur sur les sections sombres**
`radial-gradient` positionné via variables CSS (`--mx`, `--my`) mises à jour en JS,
throttlé par rAF.
✓ Fait quand : 60 fps, inexistant sur mobile et en reduced-motion.

**T4.3 — (option) Hover « magnétique » léger sur les CTA**
Subtil. **Interdit sur ou autour du bouton PayPal.**
✓ Fait quand : l'effet se remarque à peine mais se sent.

---

## BLOC 5 — Reveals généralisés *(Claude Code)*

**T5.1 — index.html** : classe `.reveal` sur toutes les sections, ordre logique, stagger
léger. Palier 1 partout, enrichissement ScrollTrigger seulement sous `motion-on`.
✓ Fait quand : mobile léger et fluide, desktop plus riche, rien de caché sans JS.

**T5.2 — standard.html** : même habillage, version sobre.
✓ Fait quand : cohérence visuelle entre les pages.

---

## BLOC 6 — Page Gala *(en dernier, car c'est la page de vente)*

> Avant de commencer : relire **§6 de CONTEXTE_REPRISE.md (zones gelées)**. Claude Code ne
> touche ni au `<script>` PayPal, ni aux fonctions, ni aux IDs listés. Style uniquement.

**T6.1 — Hero événement** *(Claude Code)*
Bandeau full-bleed : eyebrow or, titre Cormorant, cadre double filet, fond CSS travaillé
(même famille que le hero accueil, en plus sobre).
✓ Fait quand : rendu pro, LCP de la page intact.

**T6.2 — Cartes billets au cadre double filet or** *(Claude Code)*
Restyler `#card-standard` / `#card-vip` (états normal / hover / `.active`) **sans toucher
aux IDs ni à `selectTicket`**.
✓ Fait quand : la sélection fonctionne exactement comme avant, le prix total se met à jour.

**T6.3 — Séparateurs et fonds de sections** *(Claude Code)*
Filets or, fonds subtils sur « Informations importantes ». **Zone formulaire + bouton
PayPal : aucune animation, aucun décor par-dessus** (au plus un reveal discret bien
au-dessus). Le paiement s'affiche immédiatement.
✓ Fait quand : la billetterie est visuellement soignée mais fonctionnellement identique.

**T6.4 — TEST SANDBOX COMPLET** *(Roy — non négociable)*
Paiement fictif avec le compte acheteur Sandbox → bulle « 1 » sur le webhook Make →
mail reçu avec QR code.
✓ Fait quand : les 3 étapes passent. Sinon : `git revert` immédiat, on diagnostique.

**Prompt → Claude Code (bloc 6) :**
> On attaque gala.html — page de vente, risque maximal. Relis la section « zones gelées »
> de CONTEXTE_REPRISE.md : le script PayPal, les fonctions selectTicket/validateForm/
> initializePayPal/telechargerFacture, le custom_id `nom|||email` et tous les IDs listés
> sont INTOUCHABLES. Style uniquement : hero événement (double filet, eyebrow, fond CSS
> sobre), cartes billets en cadre double filet or avec états actifs raffinés, séparateurs
> et fonds de sections. Aucune animation dans la zone formulaire/PayPal. Avant de commiter,
> montre-moi `git diff` sur gala.html pour vérifier que le bloc <script> est identique.

---

## BLOC 7 — Validation finale et mise en ligne *(Roy, sauf T7.3)*

**T7.1 — Audit perf** : Lighthouse mobile ≥ 90, LCP < 2,5 s, CLS < 0,1 sur index + gala.
Comparer à T0.3.
✓ Fait quand : budget tenu sur les deux pages.

**T7.2 — Tests manuels** : mobile réel, reduced-motion ON, tablette, desktop. Règle d'or :
le mobile perd du décor, **jamais** du contenu ni une étape du tunnel.
✓ Fait quand : aucun contenu manquant nulle part.

**T7.3 — Diff de contrôle sur gala.html** *(Claude Code)* : `git diff main -- gala.html`
et confirmation écrite qu'aucune ligne des zones gelées n'a bougé.
✓ Fait quand : confirmation obtenue.

**T7.4 — Merge + déploiement** : merge `phase-2-hero-motion` → `main`, push, vérifier le
déploiement Netlify, re-test rapide en prod (le paiement est encore en Sandbox : un
dernier achat fictif en prod valide toute la chaîne).
✓ Fait quand : la prod affiche la Phase 2, chaîne de paiement OK.

**T7.5 — Mettre à jour CONTEXTE_REPRISE.md** : cocher Phase 2 en §7, noter la direction
visuelle retenue et les nouveaux scores perf. C'est ce qui rendra la prochaine
conversation aussi économe que celle-ci.
✓ Fait quand : le fichier est prêt à être collé dans une conversation neuve.

---

## Pièges connus (à garder sous la main)

- **GSAP sans bundler** : import ESM via CDN (`+esm` de jsdelivr). Faire vérifier l'URL
  exacte et la version par Claude Code au moment de T1.1, ne pas la deviner.
- **LCP et hero animé** : le titre doit être peint tout de suite ; l'animation le rejoue,
  elle ne le retient pas. Jamais de `opacity:0` en CSS de base (règle anti-FOUC, bloc 1).
- **Le « wow » se dépense en un seul endroit** : une signature forte (le hero) et de la
  discipline partout ailleurs vieillissent mieux que dix effets dispersés — c'est aussi ce
  qui distingue un rendu senior d'un rendu généré.
- **Grain et motifs** : toujours en CSS/SVG (feTurbulence, gradients), jamais en PNG lourd.
- **Curseur** : toute couche décorative = `pointer-events:none`. Un seul écouteur
  `mousemove` global throttlé par rAF, pas un par effet.
