========================================================================
DOCUMENTATION TECHNIQUE - SITE WEB UECE UMONS
========================================================================

DATE DE CRÉATION : Février 2026
TECHNOLOGIES : HTML5, CSS (Bootstrap 5), JavaScript
AUTEUR : RoyE

------------------------------------------------------------------------
1. DESCRIPTION DES FICHIERS
------------------------------------------------------------------------

Le site est composé de 3 fichiers principaux qui fonctionnent ensemble. 
Ils doivent toujours rester dans le même dossier pour que les liens fonctionnent.

1. UECE.html (PAGE D'ACCUEIL)
   - C'est la vitrine du site.
   - Contient : Le menu de navigation complet, la photo de couverture (Hero), 
     la présentation rapide et le pied de page (Footer).
   - À modifier pour : Changer les photos de l'année ou le message de bienvenue ou toute autre information introductive jugée nécessaire.

2. gala.html (PAGE INFORMATIVE + BILLETTERIE & PAIEMENT)
   - C'est la page technique la plus importante.
   - Contient : Les informations sur le gala, le storytelling et le marketing, 
     le formulaire d'inscription, le bouton de paiement PayPal et le générateur 
     de factures PDF.
   - À modifier pour : Changer la date, le prix des tickets, le lieu du Gala, bref les infos sur le gala, et surtout le compte bancaire destinataire (voir les sections suivantes).

3. standard.html (MODÈLE / TEMPLATE)
   - C'est une page "vide" qui contient déjà le menu (en haut) et le footer (en bas).
   - Usage : NE PAS MODIFIER ce fichier directement pour le publier.
   - Servez-vous en pour créer de nouvelles pages à chaque fois qu'il faudra le faire (voir section "Ajouter une page").

------------------------------------------------------------------------
2. CONFIGURATION DE PAYPAL (IMPORTANT)
------------------------------------------------------------------------

---- Les étapes pour créer un compte remplissant les critères ---
1. Ouvrez un compte "Professionnel" (Business) :

Ne choisissez pas "Compte Particulier". Le compte particulier affichera obligatoirement le "Prénom Nom" du titulaire. 

2. Type d'entreprise :

Lorsqu'on vous demande le type d'entreprise, sélectionnez "Particulier", "Personne physique"

3. Nom légal vs Nom commercial :

Nom légal : Ce sera le nom du trésorier. C'est cette personne qui devra fournir sa carte d'identité pour vérifier le compte.

Nom commercial (celui que les clients voient) : C'est ici que vous écrirez "UECE UMONS".

---- Elements à modifier dans le code pour les paiements ----

Pour le test j'ai utilisé un ID personnel mais par la suite l'UECE devra utiliser un compte PayPal dédié au cercle.

POUR PASSER EN RÉEL (RECEVOIR DE L'ARGENT) :
1. Ouvrez le fichier 'gala.html' avec un éditeur de texte (Notepad, VS Code).
2. Descendez tout en bas du fichier.
3. Repérez la ligne qui ressemble à ceci :
   <script src="https://www.paypal.com/sdk/js?client-id=VOTRE_CLIENT_ID_ICI&currency=EUR"></script>
4. Remplacez "VOTRE_CLIENT_ID_ICI" par le "Live Client ID" fourni par PayPal.
   (À trouver sur https://developer.paypal.com > Dashboard > Apps & Credentials > Live).

ATTENTION : Une fois cette modification faite, tout paiement par carte sera réel.

Remarque : 
1. Il peut y avoir des soucis de paiement (paiement impossible) si PayPal voit une différence entre les noms de propriétaire de comptes.
Pour y remédier j'ai pensé à effectuer en 2 étapes :

Si PayPal refuse catégoriquement de lier le compte de l'UECE parce que vous n'êtes pas en "Compte Business - Société", la solution de contournement (grise, mais fonctionnelle) est :

Lier le compte bancaire personnel du trésorier au compte PayPal. Les noms matchent, aucun blocage.

Le trésorier devra virer l'argent de PayPal vers son compte perso.

Faire immédiatement un virement de son compte perso vers le compte de l'UECE avec en communication "Recettes Gala PayPal" par exemple, ou la communication adéquate.
Le but étant de garder une transparence comptable totale pour ne pas être accusé de détournement de fonds.
Toutes les factures devront être vérifiées.

2. Les plafonds : Sans numéro d'entreprise vérifié, PayPal applique des limites de réception annuelles (d'après mes recherches c'est souvent autour de 2 500 € avant blocage temporaire pour vérification).

Conseil : Vérifiez votre compte (email + carte bancaire liée + identité) avant de lancer la billetterie pour lever les limites initiales.
------------------------------------------------------------------------
3. COMMENT AJOUTER UNE NOUVELLE PAGE ?
------------------------------------------------------------------------

Si vous voulez créer une page "Historique" ou "Mentions Légales" :

1. Faites une copie du fichier 'standard.html'.
2. Renommez la copie (ex: 'historique.html').
3. Ouvrez ce nouveau fichier.
4. Remplacez le texte "Page en construction" par votre propre texte.
5. Ouvrez 'UECE.html' (et les autres pages) pour mettre à jour le lien dans le menu :
   Cherchez <a href="standard.html">Historique</a>
   Remplacez par <a href="historique.html">Historique</a>

------------------------------------------------------------------------
4. PERSONNALISATION GRAPHIQUE (CHARTE UECE)
------------------------------------------------------------------------

Les couleurs sont définies au début de chaque fichier dans la section <style>.

--uece-blue: #002147; (Bleu Roi)
--uece-gold: #D4AF37; (Doré)

Si vous changez ces codes couleurs, l'ensemble du site changera d'apparence.

------------------------------------------------------------------------
5. IMAGES
------------------------------------------------------------------------

Les images actuelles sont des images test.
Pour mettre vos propres photos :
1. Créez un dossier nommé 'images' à côté des fichiers HTML.
2. Mettez vos photos dedans (ex: logo.png, gala.jpg).
3. Dans le code HTML, changez les sources :
   <img src="https://via.placeholder.com..." ...>
   devient
   <img src="images/logo.png" ...>
4. Utiliser TinyPNG pour réduire la taille s'il faut, ou autre (voir avec Google ou une IA)

NOTE IMPORTANTE : Les deux images carrées de la page d'accueil (UECE.html) sont 
conçues pour avoir un ratio 1:1 (carré). Même si vos images sources sont rectangulaires,
elles seront automatiquement recadrées en carré grâce au CSS. Pour un rendu optimal,
utilisez des images carrées (ex: 400x400 pixels) ou avec un sujet centré.

------------------------------------------------------------------------
6. MISE EN LIGNE (HÉBERGEMENT)
------------------------------------------------------------------------

Pour que l'adresse soit www.uece.umons.ac.be :
1. Contactez le service informatique (Centre de Calcul) de l'UMONS.
2. Ils vous demanderont de leur fournir ces fichiers HTML.
3. Assurez-vous d'avoir configuré le Client ID PayPal en mode "Live" avant l'envoi.

NOTES TECHNIQUES POUR L'HÉBERGEUR UMONS :
- Le site est actuellement statique (HTML/CSS/JS)
- Pour l'envoi d'emails automatiques (billets du Gala), un backend PHP sera nécessaire
- Les fichiers peuvent être placés sur un serveur Apache/Nginx standard
- Configuration SSL recommandée pour les paiements PayPal

6.1. Statut Actuel du Site
Le site est actuellement **STATIQUE** :
- Aucune base de données requise
- Aucun langage serveur (PHP) nécessaire
- Les fichiers HTML/CSS/JS sont servis directement

6.2. Pour l'envoi d'emails (billets du Gala)
Actuellement, les billets sont uniquement téléchargés localement en PDF.
Pour un envoi automatique par email, un backend PHP sera nécessaire.
Contactez le service informatique UMONS pour :
1. Activer le support PHP sur le serveur
2. Configurer l'envoi d'emails (SMTP)
3. Créer les scripts PHP nécessaires

6.3. Pour un espace membre (future évolution)
Il faudra :
1. Une base de données (MySQL/PostgreSQL)
2. Un langage serveur (PHP recommandé pour UMONS)
3. Un système d'authentification sécurisé

------------------------------------------------------------------------
7. FONCTIONNALITÉS IMPLÉMENTÉES
------------------------------------------------------------------------

7.1. Paiement PayPal
- Intégration du SDK PayPal pour les paiements sécurisés
- Deux types de tickets : Standard (15€) et VIP (25€)
- Génération automatique de PDF après paiement
- Validation des champs obligatoires avant paiement

7.2. Design Responsive
- Compatible mobile, tablette et desktop
- Utilisation de Bootstrap 5 pour la grille responsive
- Menus adaptatifs (hamburger menu sur mobile)

7.3. Navigation
- Menu fixe en haut de page avec logo cliquable partout (40px de hauteur)
- Dropdowns pour les sous-menus
- Barre de recherche intégrée
- Liens vers les réseaux sociaux dans le footer

7.4. Pages Spécialisées
- Page d'accueil avec design épuré et images carrées
- Page Gala avec storytelling marketing et billetterie
- Template standard pour créer de nouvelles pages

7.5. Uniformisation Graphique
- Logo de taille uniforme (40px) sur toutes les pages
- Logo cliquable sur toutes les pages
- Palette de couleurs UECE (bleu #002147, or #D4AF37)
- Typographie cohérente (Segoe UI)

------------------------------------------------------------------------
8. PROCHAINES ÉTAPES RECOMMANDÉES
------------------------------------------------------------------------

8.1. Système de Connexion (Espace Membre)
- Implémenter une authentification sécurisée
- Créer un espace personnel pour les membres
- Gérer les cotisations en ligne
- Téléchargement de documents administratifs

8.2. Rubrique "Nos Cercles Membres"
- Créer une page dédiée présentant tous les cercles
- IMPORTANT : Ajouter l'Union Sportive de Mons (USM)
- Inclure logos, descriptions et contacts de chaque cercle
- Système de filtrage par type de cercle

8.3. Backend pour le Gala
- Base de données pour stocker les inscriptions
- Envoi automatique des billets par email (PHP requis)
- Dashboard administrateur pour gérer les participants
- Génération de QR codes pour l'entrée

8.4. Autres Améliorations
- Galerie photo des événements passés
- Calendrier des événements
- Formulaire de contact avec envoi d'email
- Blog/Actualités de l'association
- Multilinguisme (FR/EN)

------------------------------------------------------------------------
9. PISTES DE DÉPANNAGE RAPIDE
------------------------------------------------------------------------

PROBLÈME : Le logo ne renvoie pas à l'accueil
SOLUTION : Vérifier que le lien dans la navbar est bien <a href="UECE.html">

PROBLÈME : Les images ne sont pas carrées sur l'accueil
SOLUTION : Vérifier que les images ont bien les classes "ratio ratio-1x1" et "object-fit-cover"

PROBLÈME : Le bouton PayPal ne s'affiche pas
SOLUTION : Vérifier le Client ID PayPal et la connexion internet

PROBLÈME : La box "En bref" est trop large
SOLUTION : Vérifier la propriété CSS "max-width: 310px" dans gala.html

PROBLÈME : Espace vide sous le texte dans gala.html
SOLUTION : Supprimer les propriétés "height: 100%" et utiliser "min-height: auto"

------------------------------------------------------------------------
10. CONTACT ET SUPPORT
------------------------------------------------------------------------

Pour toute question technique :
- Contacter RoyE si le README est opaque à certains endroits
- Service informatique UMONS (notamment pour l'hébergeur, le nom de domaine, éventuellement le backend, à voir ce qui sera fait)
- Conserver cette documentation pour les futurs bureaux

NOTES POUR L'ÉQUIPE SUIVANTE :
- Toutes les modifications importantes doivent être documentées ici
- Tester systématiquement sur mobile et desktop
- Sauvegarder les versions antérieures avant modifications
- Consulter quelqu'un de qualifié pour les problèmes techniques complexes
- Contre-expertiser l'IA si vous l'utilisez et bien lire les documentations.

========================================================================
FIN DE LA DOCUMENTATION
========================================================================