# ANNEXE 9 — Liens retirés & référencement Google

> Rédigée le 25/09/2026, après le nettoyage « P0 ».
> Deux parties indépendantes :
> **A.** ce qui a été retiré du site, pourquoi, et comment le remettre —
> à lire par les nouveaux membres de l'équipe technique ;
> **B.** ce qu'il faut faire pour que le site apparaisse dans Google.

---

# A. Liens retirés le 25/09/2026

## A.1 Pourquoi

`standard.html` est le **styleguide vivant** du design system (CLAUDE.md §7) :
il sert à vérifier qu'un bouton, une carte ou un titre reste cohérent quand on
touche au CSS. Il commence par « Page en construction » — c'est normal, ce n'est
pas une page pour les visiteurs.

Le problème : **8 liens par page** y menaient. Un visiteur sur trois clics
tombait dessus. La page est conservée (elle est utile), mais elle est désormais
en `noindex, nofollow` et plus aucun lien public n'y mène.

## A.2 Ce qui a été retiré, et ce qu'il faut pour le remettre

| Lien retiré | Où il était | Ce qu'il faut créer avant de le remettre |
|---|---|---|
| **« Nos cercles membres »** | Barre de navigation principale | Une page listant les cercles étudiants partenaires : nom, logo, lien, une phrase. Contenu à collecter auprès des cercles. |
| **« Logement »** | Menu déroulant *Infos* | Rien à créer si on considère que le **Guide de l'étudiant** couvre déjà le sujet. Sinon, une page dédiée (kots, agences, aides de l'UMONS, pièges). |
| **Menu « Espace Membre »** (Mes cotisations, Documents administratifs) | Barre de navigation | Un vrai espace connecté. **Attention** : cela suppose des comptes, donc un serveur ou un service tiers — ce qui sort de la contrainte « 100 % statique » du projet (CLAUDE.md §2.1). À discuter avant de s'y engager. La carte de membre avec QR (dossier `carte-membre-et-codes-promo/`) répond déjà à une partie du besoin, sans compte. |
| **Bouton « Se Connecter »** | Barre de navigation, à droite | Idem : dépend d'un système de comptes. |
| **« Mentions Légales »**, **« Politique de confidentialité »**, **« Statuts de l'association »** | Pied de page | ✅ **Fait** : la page `mentions-legales.html` existe et couvre les deux premiers. Les **statuts** restent à ajouter le jour où le PDF existe (un lien vers le fichier suffira). |

## A.3 Ce qui a été ajouté à la place

- Un lien direct **« Gala 2026 »** dans la barre de navigation, là où était
  « Nos cercles membres ». La billetterie est le travail n°1 du site
  (CLAUDE.md §1) : elle ne méritait pas d'être uniquement dans un sous-menu.
- Dans le pied de page, trois destinations réelles à la place des trois liens
  morts : **Questions fréquentes**, **Guide de l'étudiant**, **Nos événements**,
  plus **Mentions légales**.

## A.4 Deux choses encore visibles et à corriger

1. **Le bureau affiche « À compléter »** pour les 9 postes, sans photo
   (`data/bureaux.json`). Décidé : à faire plus tard.
2. ~~Le pied de page affiche un téléphone factice~~ — ✅ **retiré le 30/09/2026**
   (du pied de page des 10 pages, de `data/global.json` et du formulaire du CMS).
   **Pour remettre un vrai numéro un jour**, trois petites choses :
   a) rajouter `"telephone": "+32 …"` dans `contact` de `data/global.json` ;
   b) rajouter dans `admin/config.yml`, sous les champs de contact :
      `- { label: "Téléphone", name: telephone, widget: string }` ;
   c) rajouter dans le pied de page de chaque HTML, après la ligne de l'e-mail :
      `<br><i class="fas fa-phone me-2"></i> <span data-global="contact.telephone">+32 …</span>`.

---

# B. Apparaître dans Google

## B.1 Comment ça marche, en deux phrases

Google ne « reçoit » pas un site : il le découvre, le parcourt, puis décide de
l'afficher. Deux étapes bien distinctes : **être indexé** (figurer dans le
catalogue de Google — c'est technique, rapide, et ça se contrôle) puis
**être bien classé** (apparaître haut sur une recherche — ça dépend du contenu
et de la réputation, c'est long).

## B.2 Ce qui est déjà en place (fait le 25/09/2026)

| Élément | À quoi ça sert |
|---|---|
| `robots.txt` | Autorise l'indexation et indique où trouver le plan du site. Exclut `verifier.html`, `standard.html` et `admin/`, qui n'ont rien à faire dans Google. |
| `sitemap.xml` | La liste des 8 pages publiques, avec leur importance relative. C'est ce qu'on donne à Google pour qu'il n'ait rien à deviner. |
| `<meta name="description">` | Le texte affiché sous le titre dans les résultats. Sans lui, Google compose un extrait au hasard. |
| `<link rel="canonical">` | Évite que la même page compte double (avec ou sans `/`, avec des paramètres…). |
| Balises **Open Graph** + `images/partage-uece.jpg` | L'aperçu quand un lien est partagé sur WhatsApp, Instagram, Facebook. Sans effet direct sur Google, mais décisif pour les clics. |
| Titres de pages distincts | Chaque page a son propre `<title>`. |

**Rien de tout cela n'a d'effet tant que le site n'est pas déployé.** Ces
fichiers doivent être en ligne.

## B.3 Google Search Console — la procédure, pas à pas

> Search Console est l'outil gratuit de Google qui sert à deux choses : **lui
> signaler** qu'un site existe, et **voir** ensuite ce qu'il en fait (pages
> indexées, erreurs, mots-clés qui amènent des visiteurs).
> Comptez 20 à 30 minutes. À faire **une seule fois**, mais seulement **après**
> que le site corrigé soit en ligne.

### Avant de commencer

- Un compte Google (celui du comité de préférence, pas un compte personnel :
  il devra se transmettre à la passation).
- Le site déployé. Vérifiez d'abord que
  <https://uece-umons.netlify.app/sitemap.xml> s'affiche bien dans un
  navigateur. Si c'est une page d'erreur, le déploiement n'est pas passé —
  inutile d'aller plus loin.

### Étape 1 — Créer la propriété

1. Aller sur <https://search.google.com/search-console> et se connecter.
2. Google propose deux types de propriété. Choisir la colonne de **droite**,
   **« Préfixe de l'URL »** (celle de gauche, « Domaine », demande un accès aux
   réglages DNS que nous n'avons pas tant qu'il n'y a pas de domaine propre).
3. Saisir exactement : `https://uece-umons.netlify.app` — avec le `https://`,
   sans barre oblique à la fin.
4. Cliquer sur **Continuer**.

### Étape 2 — Prouver que le site est bien le nôtre

Google propose plusieurs méthodes. Prendre **« Balise HTML »** (dans la liste
« Autres méthodes de validation »).

1. Google affiche une ligne qui ressemble à ceci :
   `<meta name="google-site-verification" content="AbCd123...xyz" />`
2. **Copier cette ligne entière** et me l'envoyer. Je la place dans les pages
   du site et je vous préviens quand c'est en ligne (5 minutes).
   *Ne cliquez pas encore sur « Valider ».*
3. Une fois que je vous ai confirmé la mise en ligne, revenir sur cette page
   Search Console et cliquer sur **Valider**.
4. Si Google répond « Échec de la validation », attendre 5 minutes et
   réessayer : le temps que le déploiement se propage.

> **Pourquoi cette balise ?** Elle prouve que vous avez la main sur le site.
> Sans elle, n'importe qui pourrait réclamer les statistiques du site de
> quelqu'un d'autre. Elle ne fait rien d'autre, elle est invisible, et elle
> peut rester en place indéfiniment.

### Étape 3 — Donner le plan du site

1. Dans le menu de gauche : **Sitemaps**.
2. Dans le champ « Ajouter un sitemap », taper simplement : `sitemap.xml`
   (le début de l'adresse est déjà rempli par Google).
3. **Envoyer**. Le statut doit passer à « Réussite » en quelques minutes à
   quelques heures. S'il reste sur « Impossible de récupérer », vérifier que
   l'adresse s'ouvre bien dans un navigateur (voir « Avant de commencer »).

### Étape 4 — Demander l'indexation des deux pages qui comptent

1. Tout en haut de l'écran, la barre **« Inspecter une URL »**.
2. Y coller `https://uece-umons.netlify.app/` puis Entrée.
3. Google répondra probablement *« L'URL n'est pas sur Google »* — c'est normal
   à ce stade. Cliquer sur **« Demander une indexation »**.
4. Recommencer avec `https://uece-umons.netlify.app/gala.html`.

> Ne le faites que pour ces deux pages. Le reste sera trouvé tout seul grâce au
> sitemap, et Google limite le nombre de demandes par jour.

### Étape 5 — Revenir voir, plus tard

- **Après 3 à 7 jours** : menu **Pages**. Il indique combien de pages sont
  indexées et, le cas échéant, pourquoi certaines ne le sont pas.
- **Après 2 à 4 semaines** : menu **Performances**. Vous y verrez les
  recherches qui amènent des visiteurs. C'est là que se décide quel contenu
  écrire ensuite : si beaucoup de gens arrivent par « titre de séjour Mons »,
  c'est un signal.

### Ce qui est normal, et qu'il ne faut pas interpréter comme une panne

| Ce que vous voyez | Ce que ça veut dire |
|---|---|
| « L'URL n'est pas sur Google » juste après la demande | Google a pris note. Il passe quand il veut, souvent sous 48 h. |
| Des pages « Détectée, actuellement non indexée » | Google connaît la page mais n'a pas encore décidé. Patienter. |
| `verifier.html` et `standard.html` absents | Voulu : `robots.txt` les exclut. |
| Zéro donnée dans « Performances » la première semaine | Normal, l'outil n'a pas encore d'historique. |

### Ce qu'il faudra refaire plus tard

- **Si un nom de domaine propre est acheté** (`uece-umons.be`) : il faudra
  créer une **nouvelle propriété** pour ce domaine et rediriger l'ancien. Ce
  n'est pas compliqué, mais mieux vaut le savoir avant de s'attacher aux
  statistiques du `.netlify.app`.
- **À chaque passation** : transmettre les accès Search Console au nouveau
  comité, comme les accès Netlify et Make (README §4).

**Délais réalistes** : première indexation en quelques jours à deux semaines.
Une recherche sur « UECE UMONS » devrait sortir le site rapidement — c'est un
nom de marque, il y a peu de concurrence. Des requêtes génériques comme
« logement étudiant Mons » sont un autre métier : ça se gagne sur des mois.

## B.4 Ce qui ferait vraiment une différence, par ordre d'efficacité

1. **Des liens entrants depuis des sites reconnus.** C'est le levier n°1 pour
   une association, et il est gratuit :
   - demander à l'**UMONS** de référencer le site sur sa page des associations
     étudiantes (un lien depuis `umons.ac.be` vaut des mois de travail) ;
   - mettre l'adresse dans la **bio Instagram, Facebook et TikTok** ;
   - la fédération étudiante, les cercles partenaires, la Ville de Mons pour
     les événements ouverts au public.
2. **Un nom de domaine propre** (par ex. `uece-umons.be`, ~15 €/an). Plus
   crédible qu'un `.netlify.app`, et surtout : le jour où l'on change
   d'hébergeur, l'adresse ne bouge pas. Netlify permet de le brancher en
   quelques minutes. *À décider par le comité.*
3. **Du contenu qui répond à de vraies questions.** Les pages
   *Infos HUE / UE* et *Guide de l'étudiant* visent déjà juste : « titre de
   séjour étudiant », « déclaration d'arrivée commune Mons », « annexe 19 ».
   Chaque question réellement traitée est une porte d'entrée. C'est plus
   rentable que n'importe quelle astuce technique.
4. **Des données structurées** (JSON-LD) : décrire l'association
   (`Organization`) et le Gala (`Event`) dans un format que Google comprend.
   Cela peut faire apparaître l'événement avec sa **date, son lieu et son prix**
   directement dans les résultats. ~1 h de travail, effet visible sur la
   billetterie. **Recommandé — à faire dès que la date du Gala est définitive.**
5. **La vitesse et le mobile** comptent aussi, mais le site est déjà bon sur ce
   plan (polices auto-hébergées, images optimisées, pas de traceur).

## B.5 Ce qu'il ne faut pas faire

- **Payer un « référenceur »** qui promet la première place : sur un site
  d'association, l'essentiel se fait avec les points B.3 et B.4.1.
- **Acheter des liens** : Google sait les repérer et sanctionne.
- **Ajouter Google Analytics sans réfléchir** : cela obligerait à afficher un
  bandeau cookies et à revoir les mentions légales, qui disent aujourd'hui —
  et c'est un argument — que le site ne trace personne. Si une mesure d'audience
  devient nécessaire, préférer un outil sans cookie (Plausible, Netlify
  Analytics) et mettre la page légale à jour.

---

*Prochaine décision attendue : nom de domaine propre (B.4.2) et données
structurées pour le Gala (B.4.4).*
