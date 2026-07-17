# ANNEXE 6 — Paiements, quotas et données à collecter

> Synthèse des recherches menées le **17 juillet 2026** (tarifs vérifiés en ligne
> à cette date — à revérifier avant toute décision, les prix évoluent).
> À transmettre aux membres du comité et aux comités suivants.
> Complète le README (procédures) et l'Annexe 4 (disponibilité des fonds).

---

## 1. Comparatif des frais de paiement (vérifié le 17/07/2026)

Stripe n'a **aucun abonnement** : on ne paie qu'à la transaction, comme PayPal.

| Moyen de paiement | Frais | Exemple : ticket à 30 € |
|---|---|---|
| PayPal (solution actuelle) | 2,9 % + 0,35 € | ≈ 1,22 € |
| Stripe — carte européenne | 1,5 % + 0,25 € | ≈ 0,70 € |
| Stripe — carte hors Europe | 3,25 % + 0,25 € | ≈ 1,23 € |
| **Stripe — Bancontact** | **0,35 € fixe (0 %)** | **0,35 €** |

Points clés :
- **Bancontact chez Stripe coûte 0,35 € quel que soit le montant.** C'est le
  moyen de paiement préféré des Belges (plus de 80 % des e-commerces belges le
  proposent). Sur ~300 tickets à 30 €, passer de PayPal à Stripe+Bancontact
  représente environ **200 à 260 € de frais économisés par gala**.
- Les frais sont toujours à la charge du vendeur (nous), chez PayPal comme chez Stripe.

## 2. Ce que le site gère AUJOURD'HUI (intégration PayPal actuelle)

- **Carte de crédit/débit : oui, en principe.** Les boutons PayPal affichent un
  bouton « Carte de débit ou crédit » qui permet de payer **sans compte PayPal**.
  Mais c'est PayPal qui décide de l'afficher selon le contexte (pays, navigateur,
  historique) — ce n'est pas garanti pour 100 % des visiteurs.
- **Bancontact : NON, pas activé.** PayPal peut le proposer (paramètre
  `enable-funding=bancontact` + code supplémentaire), mais cela oblige à
  modifier la ligne de script et la logique de paiement — c'est-à-dire la
  **zone gelée** (CLAUDE.md §5) — avec re-test Sandbox complet obligatoire.
- **Apple Pay / Google Pay : non.** Possible chez PayPal via leur intégration
  « avancée », nettement plus complexe à maintenir.

## 3. Pourquoi Stripe est le chantier qui résout 4 besoins d'un coup

Si l'on doit un jour rouvrir la zone de paiement, Stripe apporte simultanément :
1. **Bancontact** (0,35 € fixe) ;
2. **Apple Pay + Google Pay** : inclus et automatiques dans la page de paiement
   Stripe, sans surcoût (tarif carte normal), le site étant déjà en HTTPS ;
3. **Codes promo individuels à usage unique** : gérés nativement par Stripe
   (Checkout / Payment Links) → c'est la brique qui manque pour l'avantage
   « membre = réduction sur UN ticket de gala », impossible à faire proprement
   sur un site 100 % statique sans service externe ;
4. **Des frais réduits** (§1).

Conditions avant de se lancer :
- collecter les données du §5 auprès des anciens bureaux ;
- recréer l'équivalent du flux Make (webhook Stripe → mail avec QR code) et le
  tester de bout en bout AVANT de couper PayPal ;
- décision du comité sur la base des chiffres.

## 4. Quotas des outils gratuits : les limites et le plan

### Make.com (envoi automatique des billets) — LE point critique
- Plan gratuit : **1 000 opérations/mois** ; chaque vente en consomme 2 à 4
  (webhook + traitement + mail). Capacité réelle : **≈ 250 à 400 tickets/mois**,
  tests et erreurs compris.
- **Si le quota est dépassé, Make met le scénario EN PAUSE** : les paiements
  continuent d'être encaissés par PayPal, mais **plus aucun billet n'est envoyé**.
  C'est le pire scénario possible un soir d'ouverture des ventes.
- **Plan** :
  1. estimer le pic de ventes avec les données du §5 ;
  2. **passer au plan payant (~9–10 €/mois, 10 000 opérations) pendant les mois
     de vente**, puis revenir au gratuit — une assurance à ~20 € par gala ;
  3. activer les alertes de consommation dans Make ;
  4. rappel annuel dans le calendrier du comité.

### Netlify (hébergement du site)
- Aucun souci de charge : site statique servi par un CDN, des milliers de
  visiteurs simultanés ne posent aucun problème. Le trafic n'est PAS le goulot
  d'étranglement — les goulots sont Make et PayPal.

### Netlify Forms (futur formulaire de questions)
- Plan gratuit : **100 soumissions/mois**. Le 101ᵉ message n'est PAS perdu :
  Netlify prévient par mail à 50/75/90/100 % du quota, puis bascule vers un
  palier payant (risque = facture surprise ou suspension, pas perte silencieuse).
- Gestion intelligente :
  1. **la FAQ d'abord** : chaque question qui trouve sa réponse sur le site est
     un mail en moins ;
  2. **anti-spam obligatoire** (honeypot + filtre Akismet intégré) : les robots
     comptent dans le quota et peuvent le manger à eux seuls ;
  3. surveiller les premiers mois ; si le volume réel approche la limite,
     alternatives gratuites plus généreuses (ex. Web3Forms, 250/mois) —
     bascule en quelques lignes.

## 5. Données à collecter auprès des anciens bureaux (avant le chantier Stripe)

Checklist à faire remplir par les anciens comités :

- [ ] **Pic de tickets achetés le même jour** (le chiffre le plus important)
- [ ] **Pic sur la même semaine**
- [ ] **Pic sur le même mois**
- [ ] **Total de tickets vendus par gala** (+ répartition Standard / VIP)
- [ ] **Forme de la courbe de vente** : pic à l'ouverture ou dans les derniers jours ?
- [ ] **Durée de la fenêtre de vente** (2 semaines ? 2 mois ?)
- [ ] **Problèmes de paiement rencontrés** : combien de personnes bloquées faute
      de compte PayPal ou de carte de crédit ? (l'argument chiffré pour Bancontact)
- [ ] **Nombre de membres par an** (pour dimensionner les codes promo)
- [ ] **Volume de questions reçues** (mails, Instagram, WhatsApp) — dimensionne
      la FAQ et valide les 100 messages/mois du formulaire
- [ ] **Remboursements / annulations** : combien par édition, gérés comment ?

## 6. Sources (consultées le 17/07/2026)

- Tarifs Stripe : https://stripe.com/pricing
- Tarifs Stripe des moyens de paiement locaux (Bancontact 0,35 €) :
  https://stripe.com/pricing/local-payment-methods
- Frais PayPal marchands Belgique : https://www.paypal.com/be/business/paypal-business-fees
- PayPal — intégration Bancontact (JS SDK) :
  https://developer.paypal.com/docs/checkout/apm/bancontact/js-sdk/
- Netlify Forms — usage et facturation :
  https://docs.netlify.com/manage/forms/usage-and-billing/
- Make — limites du plan gratuit :
  https://community.make.com/t/free-plan-reached-operation-limit-need-help-to-finish-automation-test/86092
- DecapBridge (CMS, gratuit jusqu'à 10 collaborateurs) : https://decapbridge.com
