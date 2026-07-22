# Registre des champs éditables dans le CMS — Site UECE UMONS

> **But de ce fichier** : lister **tous** les contenus rendus modifiables via le CMS
> (Decap), page par page. Quand on ajoute un nouveau champ éditable, on le note ici ;
> quand on cherche « est-ce que ça se modifie sans toucher au code ? », on regarde ici.
>
> **Comment lire** : chaque page a un tableau. Une ligne = un champ éditable.
> - **Chemin JSON** = où la valeur est stockée dans le fichier `data/*.json`.
> - **Widget** = le type de champ dans l'interface du CMS (texte, liste, image…).
> - Un ✅ en tête de section = la page est branchée au CMS. Un 🔲 = pas encore.
>
> Mécanique commune à toutes les pages branchées : le contenu vit dans `data/<page>.json`,
> un script `js/<page>-data.js` l'injecte dans le HTML au chargement (`fetch` + `textContent`).
> Si le JSON est absent ou illisible, le site **retombe silencieusement** sur le texte
> écrit en dur dans le HTML (rien ne casse). **Le CMS édite le JSON, jamais le HTML.**
>
> Dernière mise à jour : **20 juillet 2026**.

---

## Vue d'ensemble

| Page | Fichier de données | Collection CMS | État |
|---|---|---|---|
| `index.html` | `data/accueil.json` | « Page d'accueil » | ✅ branchée |
| `gala.html` | `data/gala.json` | « Page Gala » | ✅ branchée |
| `faq.html` | `data/faq.json` | « Page FAQ » | ✅ branchée |
| `evenements.html` | `data/evenements.json` | « Page Événements » | ✅ branchée |
| `annonces.html` | `data/annonces.json` | « Page Infos (HUE / UE) » | ✅ branchée |
| `guide.html` | `data/guide.json` | « Page Guide de l'étudiant » | ✅ branchée |
| `association.html` | `data/bureaux.json` | « Page Association » | ✅ branchée |
| **Pied de page** (les 8 pages) | `data/global.json` | « Général (pied de page) » | ✅ branché |
| `standard.html` | — | — | ⛔ styleguide (mais son pied de page est éditable) |

**Règles gelées (jamais dans le CMS)** — rappel :
- Les **prix des billets** du gala (câblés dans le code de paiement — zone gelée).
  Procédure de changement : `README` §5.
- Tout **secret** (URL webhook Make, clé secrète Stripe).

---

## ✅ Page d'accueil — `data/accueil.json`

Collection CMS : **« Page d'accueil »**. Injection : `js/accueil-data.js`.
Toutes les valeurs sont injectées par `textContent` (marqueurs `data-edit`).
Là où un titre porte une icône, seul le texte est enveloppé d'un `<span data-edit>`
pour ne pas effacer l'icône.

| Champ (label CMS) | Chemin JSON | Widget | Notes |
|---|---|---|---|
| En-tête — Sur-titre | `hero.eyebrow` | string | |
| En-tête — Titre principal | `hero.titre` | string | |
| En-tête — Sous-titre | `hero.sousTitre` | string | |
| Découvrir — Texte du bouton | `decouvrir.bouton` | string | |
| Découvrir — Entrées (liste) | `decouvrir.entrees[]` | list | **exactement 4** ; par entrée : `titre`, `description`. Les liens sont fixes (dans le HTML), seuls les textes s'éditent. |
| Découvrir — Bouton « Plus d'informations » | `decouvrir.boutonAction` | string | |
| Carrousel d'accueil (liste) | `affiches[]` | list | **ajout / suppression / réordre libres** ; par diapo : `image` (upload CMS), `alt`, `legende`. Reconstruit entièrement (diapos + puces + ré-init Bootstrap). |
| Bienvenue — Titre | `bienvenue.titre` | string | |
| Bienvenue — Accroche (gras) | `bienvenue.lead` | text | |
| Bienvenue — Paragraphe 1 | `bienvenue.paragraphe1` | text | |
| Bienvenue — Paragraphe 2 | `bienvenue.paragraphe2` | text | |
| Bienvenue — Mention bas de carte | `bienvenue.note` | string | |
| Prochain événement — Titre carte | `prochainEvenement.titre` | string | |
| Prochain événement — Nom | `prochainEvenement.nom` | string | |
| Prochain événement — Date | `prochainEvenement.date` | string | |
| Prochain événement — Description | `prochainEvenement.description` | text | |
| Prochain événement — Texte du bouton | `prochainEvenement.bouton` | string | lien vers `gala.html` (fixe) |
| Prochain événement — Mention sous bouton | `prochainEvenement.note` | string | |

**Non éditable ici (volontairement)** : la structure de navigation (liens du panneau
« Découvrir » et de la nav) et le pied de page (voir « Pied de page global »).
Les images **du carrousel** sont, elles, éditables (upload direct dans le CMS).

---

## ✅ Page Gala — `data/gala.json`

Collection CMS : **« Page Gala »**. Injection : `js/gala-data.js`.

| Champ (label CMS) | Chemin JSON | Widget | Notes |
|---|---|---|---|
| Sur-titre | `hero.eyebrow` | string | |
| Titre principal | `hero.titre` | string | |
| Sous-titre | `hero.sousTitre` | string | |
| Titre d'introduction | `intro.titre` | string | |
| Phrase d'accroche | `intro.accroche` | text | |
| Paragraphe de présentation | `intro.paragraphe` | text | |
| Phrase d'annonce du programme | `intro.annonceProgramme` | string | |
| Note sous le programme | `intro.note` | string | |
| Programme (liste) | `programme[]` | list | chaque entrée : `heure`, `titre`, `detail` |
| En bref — Date | `enBref.date` | string | ⚠️ répercuter aussi sur billet PDF + mail Make (README) |
| En bref — Heures | `enBref.heure` | string | |
| En bref — Lieu | `enBref.lieu` | text | |
| En bref — Dress code | `enBref.dressCode` | string | |
| En bref — Dress code précision | `enBref.dressCodeDetail` | string | |
| En bref — Note portes | `enBref.notePortes` | string | |
| Infos bloc 1 (billet) | `infos.bloc1.titre`, `.texte` | object | |
| Infos bloc 2 (couverts) | `infos.bloc2.titre`, `.texte` | object | |
| Infos bloc 3 (voiture) | `infos.bloc3.titre`, `.texte` | object | |
| Billet Standard — nom | `billets.standardNom` | string | **prix NON éditable** |
| Billet Standard — description | `billets.standardDescription` | string | |
| Billet VIP — nom | `billets.vipNom` | string | **prix NON éditable** |
| Billet VIP — description | `billets.vipDescription` | string | |
| FAQ gala (liste) | `faq[]` | list | chaque entrée : `question`, `reponse` |

---

## ✅ Page FAQ — `data/faq.json`

Collection CMS : **« Page FAQ »**. Injection : `js/faq-data.js`.

| Champ (label CMS) | Chemin JSON | Widget | Notes |
|---|---|---|---|
| En-tête — Sur-titre | `entete.eyebrow` | string | |
| En-tête — Titre | `entete.titre` | string | |
| En-tête — Sous-titre | `entete.sousTitre` | text | |
| Questions (liste) | `questions[]` | list | chaque entrée : `question`, `reponse` ; l'ordre d'affichage = l'ordre de la liste |

---

## ✅ Page Événements — `data/evenements.json`

Collection CMS : **« Page Événements »**. Injection : `js/evenements-data.js`.

| Champ (label CMS) | Chemin JSON | Widget | Notes |
|---|---|---|---|
| En-tête — Sur-titre | `entete.eyebrow` | string | |
| En-tête — Titre | `entete.titre` | string | |
| En-tête — Sous-titre | `entete.sousTitre` | text | |
| Événements (liste) | `evenements[]` | list | le 1ᵉʳ de la liste s'affiche déplié |
| — Titre | `evenements[].titre` | string | |
| — Jour | `evenements[].jour` | string | |
| — Heure | `evenements[].heure` | string | optionnel |
| — Lieu | `evenements[].lieu` | string | optionnel |
| — Affiche / flyer | `evenements[].affiche` | image | optionnel ; image entière jamais recadrée |
| — Texte alt de l'affiche | `evenements[].afficheAlt` | string | optionnel (accessibilité) |
| — Description | `evenements[].description` | text | |
| — Événement payant ? | `evenements[].payant` | boolean | `true` → affiche les tarifs ; `false` → « Entrée gratuite » |
| — Tarifs (liste) | `evenements[].tarifs[]` | list | si payant ; par formule : `nom`, `prix` (affichage seul pour l'instant) |
| — Lien du bouton | `evenements[].lienUrl` | string | optionnel ; futur : page de réservation par événement |
| — Texte du bouton | `evenements[].lienTexte` | string | optionnel |

**Étape suivante (à faire)** : page de paiement **générique par événement** (lira
`tarifs` + titre de l'événement, se branchera sur PayPal). Touche au flux de
paiement → chantier séparé avec plan + test de bout en bout. Tant qu'elle n'existe
pas, `tarifs` est **affiché uniquement** et le bouton de réservation du Gala pointe
vers `gala.html`.

---

## ✅ Page Infos (HUE / UE) — `data/annonces.json`

Collection CMS : **« Page Infos (HUE / UE) »**. Injection : `js/annonces-data.js`.
Les cartes d'annonces sont **entièrement reconstruites** depuis le JSON (conteneur
`data-edit-annonces`) — donc pour ajouter/retirer/réordonner une annonce, il suffit
d'éditer la liste dans le CMS. ⚠️ **Contenu à revalider chaque rentrée** (montants,
délais). Le reste de la page (en-tête, aide, avertissement) passe par `data-edit`.

| Champ (label CMS) | Chemin JSON | Widget | Notes |
|---|---|---|---|
| En-tête — Sur-titre | `entete.eyebrow` | string | |
| En-tête — Titre | `entete.titre` | string | |
| En-tête — Sous-titre | `entete.lead` | text | retour à la ligne → `<br>` |
| Annonces (liste) | `annonces[]` | list | ordre d'affichage = ordre de la liste |
| — Public concerné | `annonces[].public` | select | `HUE` / `UE` / `Tous` → couleur du badge |
| — Délai / échéance | `annonces[].deadline` | string | |
| — Titre | `annonces[].titre` | string | |
| — Description | `annonces[].description` | text | texte simple (pas de gras) |
| — Libellé de la source | `annonces[].sourceLabel` | string | |
| — Lien de la source | `annonces[].sourceUrl` | string | `https://…` |
| — Date de publication | `annonces[].datePublication` | string | affichée après « Publié le » |
| — Note sur la source | `annonces[].sourceNote` | string | optionnelle, affichée en italique |
| Aide — Sur-titre | `aide.eyebrow` | string | |
| Aide — Titre | `aide.titre` | string | |
| Aide — Texte | `aide.texte` | text | |
| Avertissement du bas | `disclaimer` | text | |

**Non éditable ici (volontairement)** : la légende des badges (HUE/UE/Tous en haut
de page — structure fixe) et le bouton e-mail de l'encart d'aide (contact global).

**Note de mise en page (21/07/2026)** : l'avertissement (`disclaimer`) a été déplacé
**en haut de la page**, juste avant la légende des publics (demande de Roy). Il reste
éditable au même endroit dans le CMS.

---

## ✅ Page Guide de l'étudiant — `data/guide.json`

Collection CMS : **« Page Guide de l'étudiant »**. Injection : `js/guide-data.js`.
Périmètre « l'essentiel » : textes simples, titres, légendes de carrousels, marchés
de la semaine et bloc contact. La liste des marchés est **reconstruite** depuis le
JSON (conteneur `data-edit-marches`).

| Champ (label CMS) | Chemin JSON | Widget | Notes |
|---|---|---|---|
| En-tête — Sur-titre | `entete.eyebrow` | string | |
| En-tête — Titre | `entete.titre` | string | |
| En-tête — Sous-titre | `entete.lead` | text | retour à la ligne → `<br>` |
| Culture — Sur-titre / Titre | `culture.eyebrow`, `culture.titre` | string | |
| Culture — Beffroi | `culture.beffroi.eyebrow/titre/texte` | object | carte vedette |
| Culture — Doudou | `culture.doudou.titre/texte` | object | |
| Culture — Sainte-Waudru (titre) | `culture.sainteWaudru.titre` | string | **texte du paragraphe en dur** (italique) |
| Culture — Musées (titre) | `culture.musees.titre` | string | **texte du paragraphe en dur** (gras) |
| Culture — Galerie sur-titre / titre | `culture.galerieEyebrow`, `culture.galerieTitre` | string | |
| Culture — Légendes galerie Doudou | `culture.galerieLegendes[]` | list | **exactement 5** |
| Lieux — Sur-titre / Titre | `lieux.eyebrow`, `lieux.titre` | string | |
| Lieux — Administration (titre) | `lieux.administration.titre` | string | **texte du paragraphe en dur** (lien vers Infos) |
| Lieux — Campus | `lieux.campus.titre/texte` | object | |
| Lieux — Se déplacer | `lieux.deplacer.titre/texte` | object | |
| Marchés — Sur-titre / Titre | `marches.eyebrow`, `marches.titre` | string | |
| Marchés — Légendes carrousel | `marches.legendes[]` | list | **exactement 3** |
| Marchés — Liste de la semaine | `marches.liste[]` | list | par marché : `jour`, `nom`, `detail` |
| Marchés — Note | `marches.note` | text | |
| Contact — Sur-titre / Titre / Texte | `contact.eyebrow/titre/texte` | object | |

**Non éditable ici (volontairement)** : les **3 paragraphes riches** (cartes
Administration = lien, Musées = gras, Sainte-Waudru = italique) — seuls leurs
**titres** sont éditables ; changer ces textes demande de toucher au HTML. Les images
et le bouton e-mail de contact restent hors CMS.

---

## ✅ Page Association — `data/bureaux.json`

Collection CMS : **« Page Association »**. Injection : `js/bureaux-data.js`.
Page **entièrement** éditable. Les textes simples passent par `data-edit` /
`data-edit-lines` ; les blocs à répétition (conditions, membres, bureaux) sont
reconstruits par des injecteurs dédiés.

| Champ (label CMS) | Chemin JSON | Widget | Notes |
|---|---|---|---|
| En-tête — Sur-titre | `entete.eyebrow` | string | |
| En-tête — Titre | `entete.titre` | string | |
| En-tête — Sous-titre | `entete.lead` | text | retour à la ligne → `<br>` |
| Mission — Sur-titre | `mission.eyebrow` | string | |
| Mission — Titre | `mission.titre` | string | |
| Mission — 3 cartes (liste) | `mission.cartes[]` | list | **exactement 3** ; par carte : `titre`, `texte`. Images et icônes fixes. |
| Texte d'introduction (historique) | `intro` | text | |
| Adhésion — Sur-titre | `adhesion.eyebrow` | string | |
| Adhésion — Titre | `adhesion.titre` | string | |
| Adhésion — Conditions (liste) | `adhesion.conditions[]` | list | une condition par ligne, coche dorée |
| Adhésion — Phrase de contact | `adhesion.contact` | text | |
| Bureau actuel — Sur-titre | `bureauActuel.eyebrow` | string | |
| Bureau actuel — Titre | `bureauActuel.titre` | string | |
| Bureau actuel — Période | `bureauActuel.periode` | string | affichée après « Mandat » |
| Bureau actuel — Membres (liste) | `bureauActuel.membres[]` | list | par membre : `role`, `nom`, `photo`, `description` |
| Historique — Sur-titre | `histoire.eyebrow` | string | |
| Historique — Titre | `histoire.titre` | string | |
| Historique — Note du bas | `histoire.note` | text | |
| Bureaux précédents (liste) | `bureaux[]` | list | par bureau : `periode`, `nom`, `membres[]` |

**Non éditable ici (volontairement)** : le bouton e-mail de l'encart membre (contact
global) et les images du carrousel de mission (remplaçables via `images/`).

---

## ✅ Pied de page global — `data/global.json`

Collection CMS : **« Général (pied de page) »**. Injection : `js/global-data.js`,
chargé sur les **8 pages**. Marqueur **dédié `data-global`** (et `data-global-href`
pour les liens réseaux) — volontairement différent du `data-edit` des pages, pour
qu'une modif du pied de page et une modif de page ne se télescopent jamais (la page
Guide a aussi un bloc `contact`). Une seule saisie se répercute sur tout le site.

| Champ (label CMS) | Chemin JSON | Widget | Notes |
|---|---|---|---|
| Contact — Titre de colonne | `contact.titre` | string | |
| Contact — Adresse | `contact.adresse` | string | |
| Contact — E-mail | `contact.email` | string | |
| Contact — Téléphone | `contact.telephone` | string | |
| Réseaux — Titre de colonne | `reseaux.titre` | string | |
| Réseaux — Lien Facebook | `reseaux.facebook` | string | injecté dans le `href` |
| Réseaux — Lien Instagram | `reseaux.instagram` | string | injecté dans le `href` |
| Réseaux — Lien TikTok | `reseaux.tiktok` | string | injecté dans le `href` |
| Informations — Titre de colonne | `informations.titre` | string | |
| Copyright | `copyright` | string | ligne du bas |

**Non éditable ici (volontairement)** : les 3 liens de la colonne « Informations »
(Mentions légales, Politique de confidentialité, Statuts) — ils pointent vers des
pages `standard.html` pas encore créées ; à activer quand ces pages existeront.

---

## 🎉 État : tout le contenu est branché

Toutes les pages de contenu **et** le pied de page global sont éditables via le CMS.
Prochaine étape hors « contenu » : inscription **DecapBridge** pour activer la
connexion des éditeurs (voir `REPRISE_NOUVEAU_CHAT.md` §6).

---

## Convention pour ajouter une page au CMS (mémo)

1. Créer `data/<page>.json` avec les contenus actuels de la page.
2. Poser des marqueurs (`data-edit="…"`) OU des `id` sur les éléments à remplir dans le HTML.
3. Écrire `js/<page>-data.js` : `fetch` du JSON → remplissage via `textContent`,
   `try/catch` silencieux (repli sur le HTML en dur).
4. Ajouter la balise `<script>` du script d'injection dans la page.
5. Ajouter la **collection** correspondante dans `admin/config.yml`.
6. **Mettre à jour ce registre** (nouvelle section + ligne dans la vue d'ensemble).
7. Vérifier (jsdom dans le scratchpad) que l'injection fonctionne et que le repli tient.
