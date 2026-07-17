# ANNEXE 8 — Migration PayPal → Stripe (plan de bascule)

> Rédigée le 17/07/2026. Décision de Roy : migrer la billetterie vers Stripe
> (Bancontact, Apple/Google Pay, codes promo membres, frais réduits — chiffres
> en Annexe 6). **PayPal reste en service jusqu'à ce que Stripe soit testé de
> bout en bout.** Rien ne se casse pendant la transition.

---

## 1. Architecture retenue : Stripe Payment Links (zéro serveur)

Le site est 100 % statique (contrainte non négociable). Parmi les intégrations
Stripe possibles, **les liens de paiement (Payment Links)** sont la seule qui
ne demande ni serveur, ni clé secrète, ni build — et c'est aussi la plus simple
à transmettre à un comité non technique :

- On crée les produits « Ticket Standard » et « Ticket VIP » **dans le tableau
  de bord Stripe** ; chaque produit reçoit un lien de paiement permanent.
- Sur gala.html, les cartes billets pointent vers ces liens : Stripe affiche
  sa page de paiement (Bancontact, cartes, Apple Pay, Google Pay, selon ce qui
  est activé), collecte l'email + le nom du participant, encaisse, puis
  redirige vers notre page de remerciement.
- Un **webhook Stripe → Make** remplace l'actuel webhook PayPal → Make pour
  envoyer le mail avec QR code.

**Bonus majeurs de cette architecture :**
- **Les prix deviennent modifiables par le comité dans Stripe** (plus besoin
  de toucher au code du site — l'ancien problème des « prix gelés » disparaît).
- **Les codes promo membres à usage unique sont natifs** : un code par membre,
  limité à 1 utilisation (`max_redemptions = 1`), saisi directement sur la
  page de paiement Stripe.
- Le PDF téléchargeable sur la page est remplacé par **le mail QR comme unique
  billet** (c'était déjà lui qui faisait foi à l'entrée). La page de
  remerciement le dira clairement.

## 2. Ce que SEUL Roy peut faire (dans l'ordre)

### A. Créer et activer le compte Stripe (~30 min + délai de vérification)
1. https://stripe.com → créer un compte avec l'email du comité.
2. Renseigner l'association (statut, adresse, IBAN du compte UECE).
   Stripe vérifie l'identité — prévoir quelques jours de délai.
3. Paramètres → Moyens de paiement : activer **Bancontact** (crucial),
   cartes, **Apple Pay** et **Google Pay** (gratuits, un simple interrupteur).

### B. En MODE TEST d'abord (interrupteur « Mode test » en haut du dashboard)
4. Produits → créer « Ticket Gala Standard » (15 €) et « Ticket Gala VIP »
   (25 €), devise EUR, paiement ponctuel.
5. Pour chaque produit → « Créer un lien de paiement » avec :
   - **Champ personnalisé** : « Nom complet du participant » (texte, requis) —
     c'est le nom qui figurera sur le billet ;
   - l'email est collecté automatiquement par Stripe ;
   - cocher **« Autoriser les codes promotionnels »** ;
   - après création, définir la **redirection après paiement** vers
     `https://uece-umons.netlify.app/merci.html` (page que je créerai) ;
   - limiter à 1 la quantité (ou laisser ajustable — à décider : peut-on
     acheter 2 tickets d'un coup ? Aujourd'hui non ; Stripe le permettrait).
6. M'envoyer **les 2 liens de paiement du mode test** → je câble le site.

### C. Côté Make (je fournirai le pas-à-pas exact au moment T)
7. Nouveau scénario : « Webhooks → Custom webhook » → copier l'URL générée.
8. Dans Stripe (mode test) : Développeurs → Webhooks → « Ajouter un
   endpoint » → coller l'URL Make → sélectionner l'événement
   **`checkout.session.completed`**.
9. Le reste du scénario (filtre + mail Gmail avec QR) : on le construira
   ensemble, c'est le même principe que l'actuel. Données disponibles :
   - email de l'acheteur : `customer_details.email`
   - nom du participant : le champ personnalisé (`custom_fields`)
   - formule + montant : ligne d'achat et `amount_total` (en centimes).

### D. Codes promo des membres (après validation du flux)
10. Décider **le montant de la réduction membre** (ex. −5 € ou −20 % : à
    trancher par le comité — rien n'est encodé tant que ce n'est pas décidé).
11. Produits → Coupons → créer UN coupon (la réduction), puis générer **un
    code promotionnel par membre** avec « Limiter à 1 utilisation »
    (ex. UECE-PRENOM-X7K2). Si la liste des membres est longue, je peux
    générer les codes en série via l'API depuis ton ordinateur (la clé
    secrète ne touche jamais le dépôt).

## 3. Ce que je fais (une fois les liens de test reçus)

1. **Branche dédiée** `stripe-migration` — PayPal intact sur `main`.
2. gala.html : les cartes billets deviennent des liens vers Stripe (le design
   ne bouge pas), le formulaire nom/email local et le SDK PayPal sont retirés
   **sur la branche seulement** ; la FAQ et les mentions « paiement sécurisé »
   sont réécrites (Bancontact, Apple/Google Pay).
3. Nouvelle page `merci.html` : confirmation + « votre billet arrive par
   mail, vérifiez vos indésirables et cliquez sur Afficher les images ».
4. Aide à la construction du scénario Make (mapping exact des champs).
5. **Tests de bout en bout en mode test** (cartes de test Stripe : `4242 4242
   4242 4242`, Bancontact simulé — gratuit, illimité, aucun vrai argent) :
   paiement Standard, paiement VIP, paiement avec code promo, code promo
   réutilisé (doit être refusé), mail QR reçu à chaque fois.
6. Bascule : passage des liens en **mode réel**, webhook réel vers Make,
   merge, achat réel de contrôle de 15 € (remboursable depuis Stripe),
   puis désactivation du scénario Make-PayPal.
7. **Retour arrière possible à tout moment** : `main` garde PayPal
   fonctionnel jusqu'au merge final ; en cas de pépin post-bascule, on
   re-merge l'ancien gala.html et on réactive le scénario PayPal.

## 4. Points de vigilance

- **Ne jamais mettre la clé secrète Stripe (sk_…) dans le dépôt** ni dans le
  site. Les liens de paiement et la clé publiable sont publics par nature ; la
  clé secrète ne sert que ponctuellement (génération de codes) et reste chez
  Roy.
- **Deux scénarios Make pendant la transition** (PayPal + Stripe) : attention
  au plafond de 1 000 opérations/mois du plan gratuit (Annexe 6 §4).
- Le mail Make actuel extrait nom/email du `custom_id` PayPal (`|||`) — le
  scénario Stripe a un mapping différent (plus propre) : ne pas copier-coller
  l'ancien module Gmail sans adapter les champs.
- L'événement webhook à écouter est **`checkout.session.completed`**
  uniquement (sinon chaque étape de paiement consomme des opérations Make).
- Vérification de signature du webhook : Make ne la fait pas nativement ;
  l'URL du webhook Make est secrète et le scénario filtrera sur la structure
  de l'événement. Risque acceptable pour une billetterie associative ;
  documenté ici en toute transparence.

## 5. Récapitulatif de qui fait quoi

| Étape | Qui | Quand |
|---|---|---|
| Compte Stripe + Bancontact/wallets | Roy | maintenant |
| Produits + liens de paiement (mode test) | Roy | après validation du compte |
| Câblage du site + merci.html (branche) | Claude Code | dès réception des liens test |
| Scénario Make Stripe | Roy + Claude Code | ensemble |
| Tests mode test complets | Claude Code + Roy | avant toute bascule |
| Décision montant réduction membre | comité | avant génération des codes |
| Bascule en mode réel + achat de contrôle | Roy + Claude Code | à la fin |
