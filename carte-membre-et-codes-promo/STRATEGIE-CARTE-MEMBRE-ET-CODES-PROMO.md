# Carte de membre UECE, vérification par QR & codes promo — stratégie

> Rédigé le 18/09/2026, révisé le 24/09/2026. Document de référence pour le comité.
> Il couvre trois choses liées : **la carte de membre**, **la vérification d'une
> adhésion par QR code**, et **les codes promo personnels à usage unique**.
> Dépendance : les codes promo supposent la **migration vers Stripe**
> (`docs/DOCUMENTATION TECHNIQUE - ANNEXE 8 - MIGRATION STRIPE.md`). PayPal, le
> système actuellement en production, ne sait pas faire de codes promo.
> La carte et la vérification par QR, elles, ne dépendent de rien : elles
> fonctionnent dès aujourd'hui.

---

## 0. En un coup d'œil

**Une carte de membre ne peut pas certifier un paiement.** Elle est imprimée en
octobre ; la cotisation peut être remboursée, contestée, ou le membre exclu en
février. C'est pourquoi la carte ne porte **aucune mention du type « cotisation en
règle »** : elle porte seulement sa **date de validité**, comme une carte bancaire.

La question « cette personne est-elle vraiment membre, à jour de sa cotisation,
aujourd'hui ? » a une seule bonne réponse : **on scanne le QR au dos**. Une page du
site répond en une seconde, à partir d'une liste que le comité tient à jour. Une
carte retirée de la liste devient invalide à la seconde où le fichier est republié,
sans qu'on ait à récupérer le carton.

**Pour les codes promo** — un membre a par exemple −20 % sur le billet du Gala, et
ce code doit servir **une seule fois**, pour **un seul billet**, **au nom du
titulaire** — le dispositif tient en quatre verrous :

| # | Verrou | Qui l'applique | Ce qu'il empêche |
|---|--------|----------------|------------------|
| 1 | `max_redemptions = 1` sur le code promo | Stripe, automatiquement | Qu'un code serve deux fois, même partagé sur WhatsApp |
| 2 | Quantité figée à 1 sur le lien de paiement | Stripe (réglage du lien) | Qu'un seul passage en caisse paie 3 billets remisés |
| 3 | Le nom saisi est comparé au registre | Make, après paiement | Qu'un membre achète un billet remisé au nom d'un tiers |
| 4 | QR de la carte + photo, à l'entrée | Le comité, le soir J | Qu'un billet remisé circule au nom de quelqu'un d'autre |

---

## 1. Ce que contient ce dossier

```
carte-membre-et-codes-promo/
├── STRATEGIE-CARTE-MEMBRE-ET-CODES-PROMO.md   ← ce document
├── carte-membre-uece-exemple.pdf              ← l'exemple de carte (recto + verso)
├── carte-membre-uece-BAT-imprimeur.pdf        ← la même, fonds perdus + traits de coupe
├── modele-carte-membre.html                   ← le gabarit : à ouvrir dans Chrome
├── membres-exemple.csv                        ← la structure exacte du registre
├── verification/
│   ├── verifier.html                          ← la page que le QR ouvre  ⟶ à déposer sur le site
│   ├── adhesions.json                          ← la liste publiée        ⟶ à déposer sur le site
│   ├── js/jsQR.min.js                          ← lecteur de QR du mode contrôle ⟶ à déposer dans js/
│   └── fonts/                                  ← polices (au cas où la page est testée hors site)
├── outils/
│   ├── generer-verification.py                ← jetons + adhesions.json
│   ├── generer-cartes.py                      ← CSV → toutes les cartes en PDF
│   ├── generer-codes-stripe.py                ← CSV → un code promo Stripe par membre
│   └── verifier-nom.py                        ← la règle de comparaison des noms (+ ses tests)
└── ressources/                                ← logo, motif filaire, polices, bibliothèque QR
```

Mode d'emploi des outils : **annexe A**.

---

## 2. La carte de membre

### 2.1 Format et fabrication

- **Format ISO CR80** : 85,6 × 54 mm, coins arrondis 3,18 mm — le format d'une carte
  bancaire. Elle entre dans tous les portefeuilles et tous les imprimeurs le connaissent.
- **Recto / verso**, fond marine, filets or.
- Le gabarit est **un simple fichier HTML** : on l'ouvre dans Chrome, on remplit les
  champs, on imprime en PDF. Pas de logiciel à acheter, pas de compétence graphique.
  Même logique de passation que le reste du site.
- Le PDF de production (`…BAT-imprimeur.pdf`) fait 91,6 × 60 mm : 3 mm de **fond perdu**
  et les **traits de coupe**, ce que tout imprimeur demande.

### 2.2 La typographie

Deux familles, les mêmes que le site, libres (licence SIL Open Font) et **hébergées
dans le dossier** : la carte se fabrique sans connexion internet.

- **Cormorant Garamond** (600/700) pour le nom, le sigle et l'année. Un Garamond à fort
  contraste — la famille de caractères qu'emploient les maisons d'hôtellerie et de mode
  de haut de gamme. Capitales très espacées (0,2 em sur « U E C E »), exactement le
  traitement de l'affiche « Kings & Queens ».
- **Outfit** (300/500) pour les mentions techniques : faculté, numéro, code.

Le nom du membre est le seul élément en or clair et le seul à cette taille : c'est lui,
le sujet de la carte.

> **Variante possible.** Pour un registre plus « Dior / Vogue » (didone, contraste
> extrême) : remplacer Cormorant Garamond par **Bodoni Moda** — déposer les `.woff2`
> dans `ressources/polices/` et changer les quatre lignes `@font-face` en tête de
> `modele-carte-membre.html`. Rien d'autre à toucher. Non retenu par défaut : le site
> entier est en Cormorant, et une carte qui ne ressemble pas au site perd sa fonction
> d'appartenance.

### 2.3 Ce qui figure sur la carte — et ce qui n'y figure pas

**Recto — l'identité, rien d'autre :**
logo · sigle et nom complet de l'association · mention « Carte de membre » · année
académique · **photo** (18,4 × 23,6 mm, cadre double filet or) · **NOM** en capitales ·
**prénom(s)** · qualité (membre adhérent / membre du bureau) · **faculté** ·
numéro de membre · **date de fin de validité**.

**Verso — la vérification, rien d'autre :**
le **QR code** (23 mm, modules marine sur fond clair) · le titulaire · le numéro de
membre · éventuellement le **code avantage personnel**, sur une seule ligne · la
mention « Carte personnelle et incessible » · le contact. Aucune consigne d'usage :
un QR se scanne sans mode d'emploi.

**Ce qui a été volontairement retiré :**

| Retiré | Pourquoi |
|---|---|
| « Cotisation en règle jusqu'au… » | Une carte imprimée ne peut pas certifier un paiement futur. Remplacé par « Valable jusqu'au », qui est une date d'expiration, et par le QR, qui dit le statut réel. |
| Le mode d'emploi du code promo en trois étapes | Ce n'est pas le rôle d'une carte de membre. Ça part dans le mail qui accompagne la carte. |
| La liste des conditions d'utilisation | Idem : dans le mail et sur la page du Gala, pas gravé sur un objet qu'on garde deux ans. |
| La ligne de signature du Président | Personne ne signe 200 cartes à la main, et une signature imprimée ne prouve rien. Le QR, si. |

**Ce qui n'y figure pas non plus, volontairement :** ni date de naissance, ni adresse,
ni matricule UMONS, ni numéro national. Une carte perdue ne doit rien apprendre
d'exploitable sur son titulaire.

**Le code avantage est facultatif.** Si le comité préfère une carte purement
identitaire, on laisse la colonne `code` vide (ou on lance le générateur avec
`--sans-code`) : la ligne disparaît du verso et le code part uniquement par mail.

### 2.4 Impression : trois niveaux de budget

| Solution | Coût indicatif | Quand la choisir |
|---|---|---|
| **Carte numérique** : le PDF envoyé par mail, gardé dans le téléphone | 0 € | Dès maintenant, pour tout le monde |
| **Papier 300 g + pelliculage mat**, coins arrondis | ~0,30–0,80 €/carte | Pour une distribution large à la rentrée |
| **PVC type carte bancaire** | ~1,50–3 €/carte, dégressif | Pour le bureau, les membres d'honneur |

Le QR fonctionne dans les trois cas — y compris scanné **depuis un écran de téléphone**.

---

## 3. La vérification par QR code

### 3.1 Le principe, en trois phrases

1. Le QR du verso contient `https://uece-umons.netlify.app/verifier.html#UECE-2026-0001-H7QM4X` :
   le **numéro de membre** et un **jeton** tiré au hasard, propre à cette carte.
2. La page `verifier.html` calcule l'**empreinte** (SHA-256) de ce couple et regarde si
   elle figure dans `adhesions.json`, la liste publiée par le comité.
3. Elle affiche **vert** (membre en règle, avec la date d'échéance), **rouge** (carte
   inconnue, annulée, ou adhésion expirée) ou **orange** (code illisible, liste
   injoignable).

À l'entrée, l'agent fait trois choses, écrites sur la page elle-même : le bandeau est
vert, le numéro affiché est bien celui imprimé sur la carte, la photo est bien celle de
la personne devant lui.

### 3.2 Pourquoi des empreintes et pas une liste de membres

Le site est 100 % statique : tout fichier qu'il sert est **public**. Publier la liste
des adhérents serait inacceptable. `adhesions.json` ne contient donc **aucun nom, aucun
numéro, aucun email** — seulement des empreintes de 16 caractères et une date :

```json
{ "genere_le": "2026-09-24",
  "annee": "2025 — 2026",
  "empreintes": { "2d26baf6981509b2": { "e": "2026-09-30", "q": "Membre adhérent" } } }
```

Conséquences concrètes :

- **on ne peut pas lire la liste des adhérents** dans le fichier, ni même deviner leurs
  numéros ;
- **on ne peut pas fabriquer une carte valide** : il faudrait trouver un couple
  numéro + jeton dont l'empreinte est dans le fichier, ce qui revient à casser SHA-256 ;
- **révoquer une carte est immédiat** : on retire la ligne du registre (ou on passe la
  cotisation à « en attente »), on relance le générateur, on republie. La carte devient
  rouge, sans avoir à la récupérer.

### 3.3 Ce que ça garantit — et ce que ça ne garantit pas

**Garanti :** la carte présentée correspond à une adhésion réellement enregistrée et non
expirée, l'information est à jour à la dernière publication près, et le fichier public
ne divulgue rien.

**Non garanti :** qu'une carte photocopiée ne circule pas. Un QR se duplique — c'est vrai
de tous les QR, billets d'avion compris. La parade est **la photo sur la carte**, que
l'agent compare au visage. C'est pour ça que la photo est au recto, grande, et encadrée.

### 3.4 Le mode contrôle (soirée d'événement)

En haut de la page, un bouton **« Mode contrôle »**. Activé, il transforme la page en
poste de contrôle pour la soirée :

- **La caméra enchaîne les cartes.** Bouton « Scanner les cartes » : la caméra reste
  allumée, on présente une carte, le verdict s'affiche, on présente la suivante. Plus
  d'aller-retour entre l'appareil photo et le navigateur. Le téléphone vibre à chaque
  lecture — une vibration pour « en règle », trois brèves pour « déjà scanné », une
  longue pour « non valide » — pour que l'agent n'ait pas à fixer l'écran.
- **Une carte déjà passée est signalée.** Chaque validation est mémorisée dans le
  téléphone. Si la même carte repasse (photo transmise à un ami, capture d'écran), le
  bandeau devient orange : *« Déjà scanné — premier passage à 21h04 »*. C'est ce qui
  empêche une carte dupliquée de servir deux fois.
- **Ça marche sans réseau.** À la première ouverture, la page garde une copie locale de
  la liste. Si le réseau tombe dans la salle, la vérification continue, avec un bandeau
  *« vérification faite sur la copie locale (24/09) »* pour que l'agent sache qu'elle
  peut dater.
- **« Nouvelle soirée »** remet le compteur à zéro avant l'événement suivant.

Hors mode contrôle — un membre qui scanne sa propre carte — rien n'est mémorisé et
aucun « déjà scanné » n'apparaît : le mode contrôle est réservé à la porte.

**Trois limites à connaître :**

1. **La mémoire est propre à chaque téléphone.** Deux agents à deux portes ne voient pas
   les scans l'un de l'autre. Pour que le « déjà scanné » serve à quelque chose, il faut
   **un seul point de contrôle**, ou accepter la limite.
2. **La caméra exige HTTPS** (c'est le cas sur Netlify) et l'autorisation du navigateur.
   Si elle est refusée, la page le dit et propose la saisie manuelle.
3. **La copie hors ligne suppose que la page ait été ouverte une fois avec du réseau.**
   À faire en arrivant sur place, avant l'affluence.

### 3.5 Mise en service (une seule fois)

1. Lancer `outils/generer-verification.py` (voir annexe A) : il attribue les jetons et
   écrit `verification/adhesions.json`.
2. Copier **`verifier.html`** et **`adhesions.json`** à la racine du site (à côté de
   `index.html`), et **`js/jsQR.min.js`** dans le dossier `js/`. Puis publier. La page
   utilisera automatiquement les polices déjà présentes dans `fonts/`.
   Le lecteur de QR (130 Ko) n'est chargé **que** si on active le mode contrôle : la
   vérification ordinaire reste légère.
3. Scanner une carte pour vérifier que le bandeau passe au vert.

**Ensuite, à chaque changement** (nouvelle adhésion, cotisation encaissée, carte perdue,
membre radié) : relancer le générateur, remplacer `adhesions.json` sur le site, publier.
C'est un fichier de quelques kilo-octets : la republication prend une minute.

> La page est en `noindex` : elle ne remontera pas dans Google. Elle n'a pas besoin
> d'être dans le menu du site — on y arrive par le QR, ou par le lien direct.

---

## 4. La base des adhérents

### 4.1 Pourquoi un Google Sheet

- **Le comité change tous les deux ans.** Un tableur partagé se transmet en changeant un
  propriétaire de fichier. Une base de données, non.
- **Make lit et écrit nativement dans Google Sheets** — c'est déjà l'outil du flux
  billetterie. Zéro intégration à développer.
- **Le site reste 100 % statique** : aucune donnée personnelle ne transite par le dépôt
  Git ni par Netlify.
- **C'est auditable** : l'historique des versions montre qui a changé quoi.

En échange : accès **restreints nominativement** au bureau (jamais « toute personne
disposant du lien ») et **sauvegarde annuelle** exportée en `.csv`, conservée hors ligne.

> `membres-exemple.csv` est la **structure exacte** attendue : à importer tel quel dans
> Google Sheets pour créer le registre.

### 4.2 Structure du registre

| Colonne | Contenu | Qui la remplit |
|---|---|---|
| `numero` | `UECE-2026-0001` | Le comité, à l'adhésion |
| `nom` | Patronyme | Le membre (formulaire) |
| `prenoms` | Prénom(s) | Le membre |
| `email` | Adresse de contact | Le membre |
| `faculte` | Faculté UMONS | Le membre |
| `qualite` | `Membre adhérent` / `Membre du bureau` | Le comité |
| `annee` | `2025 — 2026` | Le comité |
| `echeance` | `2026-09-30` — **format ISO**, la carte l'écrit en toutes lettres | Le comité |
| `statut_cotisation` | `payée` / `en attente` | Le trésorier |
| `date_adhesion` | `2025-10-02` | Le comité |
| `photo` | Chemin ou lien vers la photo | Le comité |
| `jeton_verif` | `H7QM4X` — le secret du QR | **`generer-verification.py`** |
| `code` | `UECE26-K7Q4M` — le code promo lisible | **`generer-codes-stripe.py`** |
| `code_stripe_id` | `promo_1Qxxxx…` — l'identifiant technique | **`generer-codes-stripe.py`** |
| `statut_code` | `actif` / `utilisé` / `annulé` / `à créer` | **Make**, après paiement |
| `date_utilisation` | Date du passage en caisse | **Make** |
| `commande_stripe` | Référence de la commande | **Make** |
| `consentement_rgpd` | `oui` / `non` | Le membre (case du formulaire) |

Deux colonnes qu'on oublie souvent et sans lesquelles rien ne marche :

- **`jeton_verif`** : c'est lui qui rend chaque QR unique. Il ne doit jamais être
  modifié après impression d'une carte — sinon la carte devient invalide (ce qui est
  d'ailleurs la bonne façon de révoquer une carte perdue : changer le jeton).
- **`code_stripe_id`** : quand Stripe prévient Make qu'un paiement a eu lieu, il
  transmet **l'identifiant technique** du code promo (`promo_1Qxxxx…`), pas le code
  lisible. Sans cette colonne, Make ne peut pas retrouver le membre.

### 4.3 Numérotation, jetons et codes

**Numéro de membre** : `UECE-<année de fin>-<rang sur 4 chiffres>` → `UECE-2026-0001`.
Lisible, triable, jamais réattribué.

**Jeton de vérification** : 6 caractères. **Code promo** : `UECE26-XXXXX`, 5 caractères.
Les deux sont tirés dans un alphabet **sans caractères ambigus** (ni `O`/`0`, ni
`I`/`1`/`L`, ni `5`/`S`, ni `8`/`B`) — parce qu'ils peuvent devoir être retapés à la main
depuis une carte imprimée.

Trois raisons de **ne pas** mettre le prénom dans le code promo (contrairement à ce que
proposait l'Annexe 8) : un code contenant un prénom est **devinable** (`UECE26-MARIE`
invite à essayer `UECE26-PAUL`) ; une carte peut être photographiée et republiée ; et le
lien code ↔ membre existe déjà dans le registre.

### 4.4 Le cycle de vie d'un membre

```
   Formulaire d'adhésion (Google Form)
              │
              ▼
   Ligne créée dans le registre, statut_cotisation = "en attente"
              │  le trésorier encaisse la cotisation
              ▼
   statut_cotisation = "payée"
              │  outils/generer-verification.py   → jeton + adhesions.json republié
              │  outils/generer-codes-stripe.py   → code promo personnel
              ▼
   outils/generer-cartes.py  → carte PDF, envoyée par mail (et/ou imprimée)
              │  le membre achète son billet du Gala
              ▼
   Make : statut_code = "utilisé", date + référence de commande
              │  fin de l'année académique
              ▼
   Code promo expiré (expires_at) et carte périmée : renouvellement
```

**Règle d'or : aucun code, aucun jeton, aucune carte avant que la cotisation soit
encaissée.** Les trois scripts refusent d'eux-mêmes les lignes dont
`statut_cotisation` n'est pas `payée`.

---

## 5. Les codes promo à usage unique — les quatre verrous

### 5.1 Verrou 1 — `max_redemptions = 1` (Stripe)

La réduction se déclare en deux temps : **un seul coupon** porte le montant
(« Réduction membre UECE 2025-2026, −20 %, utilisation ponctuelle ») et **un code
promotionnel par membre** pointe vers ce coupon, avec `max_redemptions = 1`.

Dès qu'une commande aboutit, **Stripe désactive le code lui-même**. Il peut être
photographié, partagé, publié : il ne servira pas une deuxième fois. On ajoute
`expires_at` au 30 septembre, pour que les codes meurent d'eux-mêmes si personne ne fait
le ménage — le comité suivant part d'une base propre.

C'est le verrou le plus important, et il ne demande **aucune maintenance**.

### 5.2 Verrou 2 — quantité figée à 1

Attention au piège : une remise en pourcentage s'applique à **la totalité de la
commande**. Si le lien de paiement autorise le client à régler la quantité, un membre
peut acheter 3 billets et obtenir −20 % sur les trois en une seule utilisation du code.

Sur le lien de paiement Stripe, il faut donc **laisser désactivée l'option
« Permettre au client d'ajuster la quantité »**. Un code = une commande = un billet.
Un membre accompagné achète simplement un second billet au tarif normal.

### 5.3 Verrou 3 — le nom du participant est vérifié

Stripe ne sait pas refuser un paiement parce que le nom saisi ne correspond pas à un
tableur. La vérification est donc **postérieure au paiement**, dans Make, sur
l'événement `checkout.session.completed`.

**La règle de comparaison** (implémentée et testée dans `outils/verifier-nom.py`) :
on met les deux noms à plat — minuscules, accents retirés, traits d'union, apostrophes
et virgules remplacés par des espaces, espaces multiples tassés — puis on exige
**tous les mots du nom de famille** et **au moins un prénom** du titulaire.

| Le membre s'appelle | L'acheteur a tapé | Verdict | Ce qui se passe |
|---|---|---|---|
| Roy Ebwelle | `roy ebwelle` | identique | Billet envoyé |
| Roy Ebwelle | `ROY EBWELLE` | identique | Billet envoyé |
| Roy Ebwelle | `Ebwelle Roy` | identique | Billet envoyé |
| Léa Haddad | `lea haddad` | identique | Billet envoyé |
| Roy Ebwelle | `Roy Junior Ebwelle` | équivalent | Billet envoyé |
| Chiamaka Grace Okonkwo | `Chiamaka Okonkwo` | équivalent | Billet envoyé |
| Pieter van der Berg | `pieter van der berg` | identique | Billet envoyé |
| Roy Ebwelle | `Ebwele Roy` | **proche** | Retenu : un humain tranche |
| Roy Ebwelle | `Jean Dupont` | **différent** | Retenu + alerte au comité |

La casse, les accents, l'ordre, les traits d'union, un prénom en plus ou en moins : tout
cela passe sans intervention humaine. Une **faute de frappe** (distance de 1 ou 2
caractères selon la longueur du mot) ne passe pas toute seule mais ne déclenche pas
d'alarme non plus : elle part en vérification manuelle.

**Et le nom imprimé sur le billet n'est jamais celui que l'acheteur a tapé.** C'est celui
du **registre**, recapitalisé proprement :

| Registre | Billet |
|---|---|
| `ebwelle` / `roy` | **Roy Ebwelle** |
| `EBWELLE` / `ROY` | **Roy Ebwelle** |
| `dupont-martin` / `jean-luc` | **Jean-Luc Dupont-Martin** |
| `van der berg` / `pieter` | **Pieter van der Berg** |
| `d'angelo` / `maria` | **Maria D'Angelo** |

C'est le registre qui fait foi, pas la saisie : le billet est toujours propre, même si
l'acheteur a tapé en minuscules à une heure du matin.

**Mise en place recommandée en deux temps :**

- **Version 1 — surveillance (à faire en premier).** Make ne compare pas : il journalise
  chaque usage de code dans un onglet `Journal` et envoie un récapitulatif au comité. Le
  billet part toujours. Le comité lit quelques lignes par semaine. Simple, robuste,
  suffisant pour une première édition.
- **Version 2 — comparaison automatique.** On applique la règle ci-dessus. Les verdicts
  *identique* et *équivalent* passent tout seuls ; *proche* et *différent* retiennent le
  billet et alertent le comité, qui valide ou rembourse en un clic depuis Stripe.
  À activer une fois la version 1 rodée.

`verifier-nom.py` sert exactement à ça : trancher un cas litigieux en une commande, et
montrer au comité ce qui est accepté ou refusé. Sa batterie de 32 tests doit passer à
100 % après toute modification de la règle.

### 5.4 Verrou 4 — le contrôle à l'entrée

Billet nominatif + QR de la carte + photo. Pour les billets remisés, les deux noms
doivent coïncider. C'est le contrôle qui rend les trois autres crédibles, et il ne coûte
rien.

### 5.5 Ce que le dispositif garantit — et ce qu'il ne garantit pas

**Garanti :** un code ne peut pas servir deux fois ; il ne peut pas remiser plusieurs
billets à la fois ; toute utilisation est tracée, datée et rattachée à un membre ; un
code volé ne coûte au maximum qu'**une** réduction, immédiatement visible.

**Non garanti, et c'est assumé :** un membre peut acheter **son** billet remisé et ne pas
venir (c'est déjà vrai de n'importe quel billet) ; Stripe n'empêchera jamais *a priori*
un mauvais nom — il n'y a pas de solution bloquante sans serveur, et le projet a fait le
choix du 100 % statique. Le compromis est un **contrôle a posteriori avec remboursement
possible en un clic**.

---

## 6. Mise en place, pas à pas

### 6.1 Ce que seul Roy peut faire (Stripe)

Prérequis : étapes A à C de l'Annexe 8 (compte Stripe activé, produits et liens de
paiement créés, webhook vers Make). Puis, **en mode test d'abord** :

1. **Trancher le montant de la remise** avec le comité (−20 % ? −5 € ?) — rien ne se crée
   tant que ce n'est pas décidé.
2. Stripe → **Produits → Coupons → Créer un coupon** : « Réduction membre UECE
   2025-2026 », pourcentage ou montant fixe, durée « **une fois** ». Noter
   **l'identifiant du coupon**.
3. Sur chaque lien de paiement : cocher **« Autoriser les codes promotionnels »** et
   vérifier que **l'ajustement de quantité est désactivé** (verrou 2).
4. Vérifier que le **champ personnalisé « Nom complet du participant »** est présent et
   obligatoire : c'est lui que compare le verrou 3.

### 6.2 Le scénario Make

| # | Module | Réglage |
|---|---|---|
| 1 | Webhook Stripe | Événement `checkout.session.completed` |
| 2 | Routeur | Branche A : **sans** code promo → billet, comme aujourd'hui. Branche B : **avec** code promo |
| 3 | Google Sheets — « Rechercher des lignes » | `code_stripe_id` = l'identifiant reçu |
| 4 | Filtre (version 2 seulement) | Comparaison des noms, règle §5.3 |
| 5a | Gmail | Le billet avec QR code, **au nom tel qu'il figure au registre** |
| 5b | Google Sheets — « Mettre à jour une ligne » | `statut_code = utilisé`, date, référence |
| 5c | Gmail (branche « divergence ») | Alerte au comité + mail d'attente à l'acheteur |

**Champs utiles dans le message reçu de Stripe** — à confirmer sur le tout premier
webhook de test ; c'est le réflexe à avoir : on regarde la vraie donnée reçue avant de
câbler :

- email de l'acheteur : `customer_details.email`
- nom saisi pour le participant : le champ personnalisé, dans `custom_fields`
- code promo utilisé : `discounts[0].promotion_code` → **l'identifiant `promo_…`**
- montant réellement payé : `amount_total`, **en centimes**

### 6.3 Émettre les cartes

```bash
python outils/generer-verification.py membres.csv --annee "2025 — 2026"
python outils/generer-codes-stripe.py  membres.csv --coupon <identifiant> --reel
python outils/generer-cartes.py        membres.csv --sortie cartes
```

Dans cet ordre : sans jeton, pas de QR ; sans code, pas de ligne « code avantage ».
Détails en annexe A.

---

## 7. Cas particuliers

| Situation | Conduite à tenir |
|---|---|
| **Carte perdue ou volée** | Vider `jeton_verif` **et** relancer `generer-verification.py` (nouveau jeton), republier `adhesions.json`, rééditer la carte. L'ancienne passe au rouge immédiatement. Désactiver aussi le code promo dans Stripe s'il n'a pas servi. |
| **Cotisation non renouvelée** | Passer `statut_cotisation` à `en attente` et republier : la carte passe au rouge sans autre démarche. |
| **Le membre a perdu son code promo** | Il est dans le registre : le lui renvoyer par mail. Inutile d'en créer un autre. |
| **Le nom du billet ne correspond pas** | Verrou 3 : le comité valide ou rembourse. Garder une trace de la décision dans le `Journal`. |
| **Le membre veut faire profiter un ami** | Non : un code, un billet, un nom. L'ami achète au tarif normal. |
| **Billet remboursé après usage du code** | Stripe ne « rend » pas l'utilisation. Créer un nouveau code et annuler l'ancien. |
| **Adhésion en cours d'année** | Même circuit ; `echeance` reste le 30 septembre. |
| **Pas de réseau à l'entrée** | Couvert par le mode contrôle : ouvrir la page une fois avec du réseau en arrivant sur place, la liste est ensuite gardée en local. |
| **Stripe pas en ligne au moment du Gala** | Repli manuel : le membre écrit au comité, qui lui envoie un lien de paiement individuel au tarif remisé. Dépannage seulement : ça ne passe pas à l'échelle. |

---

## 8. Données personnelles (RGPD)

- **Base légale** : l'adhésion (exécution du contrat d'association) pour l'identité et la
  faculté ; **le consentement explicite** pour la photo — d'où la colonne
  `consentement_rgpd`, recueillie par une case à cocher non pré-cochée.
- **Minimisation** : rien au-delà de ce qui sert à la carte, à la vérification et aux
  codes. Pas de date de naissance, pas d'adresse, pas de matricule, pas de nationalité.
- **Le fichier publié ne contient aucune donnée personnelle** — que des empreintes (§3.2).
  C'est le point qui rend ce dispositif acceptable sur un site statique.
- **Durée de conservation** : registre conservé **l'année académique + 1 an**, puis
  anonymisé ou supprimé. **Photos supprimées** dès l'émission de la carte si le membre le
  demande, et au plus tard à la fin de l'année académique.
- **Accès** : Google Sheet partagé **nominativement** avec les seuls membres du bureau qui
  en ont besoin. Le dossier des photos suit la même règle.
- **Droits des membres** : une ligne dans le formulaire d'adhésion — « Vous pouvez à tout
  moment consulter, corriger ou faire supprimer vos données en écrivant à
  UECE.UMONS@umons.ac.be. »
- **Jamais dans Git** : ni le registre, ni les photos, ni les cartes générées. Le
  `.gitignore` du dossier les exclut déjà ; le mieux reste de travailler hors du dépôt.
- **Pas de photo publiée** : la carte est un document privé, envoyé au membre.

---

## 9. Coûts

| Poste | Coût |
|---|---|
| Vérification par QR (page + fichier) | **0 €** — deux fichiers statiques sur Netlify |
| Codes promo Stripe | **0 €** — inclus, quel que soit le nombre |
| Commission Stripe | Sur le montant réellement payé (voir Annexe 6) |
| Google Sheets, Google Forms, Make | 0 € / offre actuelle |
| Cartes numériques (PDF) | 0 € |
| Cartes papier ou PVC | Voir §2.4 |

**La seule dépense possible, c'est l'impression physique.**

---

## 10. À trancher par le comité

1. **Le montant de la remise membre** : −20 % ? −5 € ? (bloquant : rien ne se crée avant)
2. **Le prix de la cotisation**, et ce qu'elle finance (la carte physique ?).
3. **La remise vaut-elle pour tous les événements payants** ou uniquement le Gala ?
4. **Carte numérique seule, ou impression physique** — et pour qui ?
5. **Le code avantage est-il imprimé sur la carte**, ou envoyé uniquement par mail ?
6. **Qui détient le registre** et qui a le droit d'y écrire — c'est aussi qui republie
   `adhesions.json`.
7. **Version 1 ou version 2** du verrou 3 pour la première édition (recommandation : V1).

---

## Annexe A — Mode d'emploi des outils

### A.1 Fabriquer une carte à la main (aucune ligne de commande)

1. Ouvrir `modele-carte-membre.html` dans **Google Chrome**.
2. Remplir les champs du panneau du bas : la carte se met à jour en direct, QR compris.
   Le **jeton de vérification** est ce qui rend le QR unique — le reprendre du registre.
3. **« Imprimer / PDF »** → destination **« Enregistrer au format PDF »**, marges
   **« Aucune »**, **« Graphiques d'arrière-plan » coché** (sans cette case, le fond
   marine ne s'imprime pas).
4. Pour l'imprimeur : cliquer d'abord **« Fonds perdus + traits de coupe »**.

**« Copier le lien de cette carte »** donne une adresse contenant toutes les valeurs
saisies : pratique pour rouvrir la même carte plus tard ou l'envoyer à quelqu'un du
comité.

### A.2 Attribuer les jetons et publier la liste

```bash
python outils/generer-verification.py membres.csv --annee "2025 — 2026"
```

Attribue un jeton à chaque membre en règle qui n'en a pas (le registre est réécrit, une
copie `.sauvegarde` est gardée) et produit `verification/adhesions.json`.
**À relancer et republier à chaque changement d'adhésion.**

### A.3 Fabriquer toutes les cartes d'un coup

```bash
python outils/generer-cartes.py membres.csv --sortie cartes
```

| Option | Effet |
|---|---|
| `--sortie <dossier>` | Où écrire les PDF (par défaut : `cartes/`) |
| `--bat` | Version imprimeur : 91,6 × 60 mm, fonds perdus, traits de coupe |
| `--seulement UECE-2026-0001` | Ne régénérer qu'une carte |
| `--sans-code` | Ne pas imprimer le code avantage au verso |
| `--base <url>` | Adresse de la page de vérification visée par les QR |
| `--tous` | Générer aussi les membres dont la cotisation n'est pas encaissée |

Un PDF recto/verso par membre, plus un PDF unique pour l'imprimeur. Le script saute de
lui-même les lignes sans jeton ou sans cotisation payée, et dit lesquelles. Il demande
seulement **Python et Google Chrome**.

### A.4 Créer les codes promo

```bash
$env:STRIPE_SECRET_KEY = "sk_test_..."     # jamais dans un fichier, jamais dans Git
python outils/generer-codes-stripe.py membres.csv --coupon <identifiant>          # essai à blanc
python outils/generer-codes-stripe.py membres.csv --coupon <identifiant> --reel   # pour de vrai
```

Deux garde-fous : **essai à blanc par défaut**, et **confirmation écrite** exigée si la
clé est une clé de production. Le script ne touche jamais aux membres qui ont déjà un
code, ni à ceux dont la cotisation n'est pas encaissée.

### A.5 Trancher un litige sur un nom

```bash
python outils/verifier-nom.py "Ebwelle" "Roy" "roy ebwelle"
python outils/verifier-nom.py --tests
```

La première commande donne le verdict, le nom à imprimer sur le billet et la conduite à
tenir. La seconde vérifie que la règle se comporte comme décrit au §5.3.

---

## Annexe B — Aide-mémoire Stripe

| Notion Stripe | Rôle ici |
|---|---|
| **Coupon** | Porte le montant de la remise. **Un seul** pour toute l'association. |
| **Code promotionnel** | Le texte que tape le membre. **Un par membre**, `max_redemptions = 1`. |
| `expires_at` | Fin de validité — calée sur la fin de l'année académique. |
| `metadata` | Numéro de membre, titulaire, email : permet de retrouver le propriétaire d'un code depuis le tableau de bord. |
| **Lien de paiement** | La page de paiement. Codes promo autorisés, quantité **non** ajustable. |
| **Champ personnalisé** | « Nom complet du participant ». |
| `checkout.session.completed` | L'événement qui déclenche Make après un paiement réussi. |

---

*Questions ouvertes : §10. Dépendance principale (codes promo seulement) : Annexe 8.*
