# Site UECE UMONS — vitrine + billetterie du Gala

Site officiel de l'UECE (Union des Étudiants et Chercheurs Étrangers, UMONS).
En ligne : **https://uece-umons.netlify.app**

> Ce README est le **document de passation** : il explique comment faire vivre
> le site sans être développeur. Lisez-le en entier lors d'un changement de comité.

---

## 1. Comment le site fonctionne (en 30 secondes)

- Le site est **100 % statique** : des fichiers HTML/CSS/JS, sans serveur ni base
  de données. C'est voulu : rien à mettre à jour, quasi rien à pirater, gratuit.
- Le code vit sur **GitHub** (`RoyMusango/site-uece-umons`). À chaque modification
  envoyée sur la branche `main`, **Netlify republie le site automatiquement**
  en ~1 minute. Personne ne « met en ligne » à la main.
- Les paiements passent par **PayPal** ; après chaque achat, **Make.com** envoie
  automatiquement le billet par mail (avec QR code).
- Les contenus qui changent chaque année (date, lieu, programme, FAQ…) sont dans
  **`data/gala.json`** et s'éditent via une **interface d'administration** simple
  (voir §2) — sans toucher au code.

```
index.html      Accueil                    js/         Scripts (animations, injection contenus)
gala.html       Vente des tickets ⚠️       data/       Contenus éditables (gala.json)
annonces.html   Infos HUE / UE             admin/      Interface d'administration (CMS)
guide.html      Guide de l'étudiant        images/     Images (WebP + repli JPEG)
standard.html   Modèle + styleguide        fonts/      Polices auto-hébergées
style.css       Design system              docs/       Annexes techniques d'origine
```

## 2. Modifier les contenus du Gala (usage courant, sans coder)

1. Aller sur **https://uece-umons.netlify.app/admin/**
2. Se connecter avec son email (invitation envoyée via DecapBridge, voir §3).
3. Ouvrir « Page Gala » → modifier les champs (date, lieu, programme, FAQ…).
4. Cliquer **Publier**. Le site se met à jour tout seul en ~1 minute.

Ce que l'administration permet de changer :
- **Page Gala** : en-tête, texte d'intro, programme de la soirée, encadré
  « En bref » (date, heure, lieu, dress code), les 3 blocs d'informations,
  les textes des billets, la FAQ du gala.
- **Page FAQ** : toutes les questions/réponses générales.
- **Page Association** : conditions d'adhésion, bureau actuel et historique
  des bureaux (périodes, rôles, noms, photos, mini-bios).
- **Page Événements** : la liste des rendez-vous (titre, jour, heure, lieu,
  description, bouton optionnel).

**Ce qu'elle ne permet PAS de changer — c'est volontaire :**
- **Les prix des billets** → voir §5, procédure spéciale.
- Le billet PDF et le mail automatique → voir §6.

## 3. Mise en service de l'administration (à faire UNE fois)

L'interface d'administration utilise **Decap CMS + DecapBridge** (gratuit jusqu'à
10 collaborateurs — largement assez).
⚠️ Ne PAS utiliser Netlify Identity / Git Gateway : ces services sont dépréciés.

1. Créer un compte sur **https://decapbridge.com** (avec l'email du comité).
2. « Add site » → connecter le dépôt GitHub `RoyMusango/site-uece-umons`
   (DecapBridge demande un accès au dépôt).
3. DecapBridge affiche alors un bloc de configuration `backend:` → **copier ce
   bloc dans `admin/config.yml`** à la place du bloc `backend:` existant
   (les lignes `identity_url` / `gateway_url` contiennent l'identifiant du site).
4. Envoyer la modification sur GitHub (ou demander à un membre qui sait le faire).
5. Dans DecapBridge → « Manage collaborators » → inviter les membres du comité
   par email. Ils reçoivent un lien pour définir leur mot de passe.

À chaque passation : inviter les nouveaux membres, **révoquer les anciens**.

## 4. Les comptes à transmettre lors d'une passation

| Service | Sert à | Compte |
|---|---|---|
| GitHub | Héberge le code | propriétaire du dépôt `site-uece-umons` |
| Netlify | Publie le site | lié au dépôt GitHub |
| PayPal Business | Encaisse les paiements | compte de l'association |
| Make.com | Envoie les billets par mail | scénario webhook PayPal → Gmail |
| Gmail | Adresse d'envoi des billets | ⚠️ connexion à ré-autoriser dans Make périodiquement |
| DecapBridge | Connexions à l'administration | compte du comité |

## 5. Changer les prix des billets (procédure développeur)

Les prix sont **volontairement absents** de l'administration : le prix affiché et
le prix réellement débité par PayPal sont écrits à deux endroits différents du
code, et un écart entre les deux ferait payer un mauvais montant. Un changement
de prix = une modification de code + un test de paiement complet.

Dans **`gala.html`**, mettre à jour de façon cohérente :
1. L'affichage : `15.00 €` (carte Standard), `25.00 €` (carte VIP),
   le total par défaut (`displayAmount`) et le bandeau mobile
   (`Standard 15 € · VIP 25 €`).
2. Le code de paiement (zone gelée, bas du fichier) :
   `let currentPrice = 15;` et, dans `selectTicket`, `currentPrice = 15;`
   (standard) et `currentPrice = 25;` (VIP).
3. Puis **test Sandbox obligatoire** (§7) avant toute mise en ligne.

## 6. Changer la date ou le lieu : 3 endroits, pas 1

1. **Le site** : via l'administration (§2) — encadré « En bref ».
2. **Le billet PDF** : la date et l'adresse sont aussi écrites dans le code du
   billet téléchargeable (`gala.html`, fonction `telechargerFacture`, lignes
   « Samedi 15 mai 2026 — 19h00 », « Salle des Congrès », « Grand-Place 22 »).
   Modification de code → test Sandbox (§7).
3. **Le mail automatique** : le texte du mail envoyé après achat se change dans
   le scénario Make.com (module Gmail).

## 7. Test de paiement Sandbox (obligatoire si `gala.html` a été modifié)

Après TOUTE modification de `gala.html`, avant de mettre en ligne :
1. Remplacer temporairement le `client-id` PayPal par celui du compte **Sandbox**.
2. Faire un achat fictif complet sur le site.
3. Vérifier : la bulle « 1 » apparaît sur le scénario Make → le mail avec QR code
   arrive → le billet PDF se télécharge.
4. Remettre le `client-id` de production.

Pièges connus (vécus) :
- Interrupteur du scénario Make sur « Immediately as data arrives » **obligatoire**
  — cause n°1 des mails jamais envoyés.
- Purger la file du webhook Make après des tests ratés (les vieux paquets se
  rejouent via « Run once »).
- La connexion Gmail dans Make expire : à ré-autoriser périodiquement
  (prochaine échéance notée : avant le 25/09/2026).

## 8. Limites à surveiller (gratuité oblige)

- **Make.com (plan gratuit) : 1 000 opérations/mois.** Chaque vente en consomme
  plusieurs. Au-delà, le scénario **se met en pause** : les gens paieraient sans
  recevoir leur billet. → Pendant les mois de vente du Gala, passer au plan
  payant (~9 €/mois, 10 000 opérations), puis revenir au gratuit.
- **Netlify (plan gratuit)** : très large pour un site statique ; le trafic
  n'est pas un souci.
- Les **zones gelées** de `gala.html` (fonctions et identifiants du paiement)
  sont listées dans `CLAUDE.md` §5 : ne jamais les modifier sans test Sandbox.

Détails chiffrés (comparatif des frais PayPal/Stripe/Bancontact, plan en cas de
dépassement des quotas, données à collecter auprès des anciens bureaux) :
**`docs/DOCUMENTATION TECHNIQUE - ANNEXE 6 - PAIEMENTS, QUOTAS ET DONNEES A COLLECTER.md`**

## 9. Historique de la refonte

Refonte « Prestige » menée en 2026 par phases (design system, animations,
conversion, performance, contenus éditables) — détails dans `CLAUDE.md` et
`CONTEXTE_REPRISE.md`.
