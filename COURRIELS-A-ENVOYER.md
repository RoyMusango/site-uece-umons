# Courriels à envoyer

Deux courriers prêts à copier-coller. Remplacez ce qui est entre crochets,
relisez, envoyez depuis l'adresse du comité (UECE.UMONS@umons.ac.be) et non
depuis une adresse personnelle.

**Ordre conseillé :** envoyez les deux le même jour. Ils ne se gênent pas, et
les réponses peuvent mettre deux à trois semaines à arriver.

---

## 1. À l'UMONS — référencement du site et hébergement

**À qui l'envoyer.** Par ordre de pertinence :
1. le service qui gère les cercles et la vie étudiante (celui qui vous a
   reconnus comme cercle — c'est votre interlocuteur naturel) ;
2. le service communication de l'UMONS, qui tient les pages du site
   universitaire ;
3. le service d'accueil des étudiants internationaux, qui a le plus à gagner
   à connaître nos pages.

Si vous ne savez pas à qui écrire, envoyez-le au premier et demandez en fin de
message d'être orienté vers la bonne personne — c'est fait dans le texte.

**Objet :** `UECE — site d'information pour les étudiants internationaux : demande de référencement`

---

Madame, Monsieur,

Je me permets de vous écrire au nom de l'**UECE (Union des Étudiants et
Chercheurs Étrangers)**, cercle étudiant reconnu par l'UMONS.

Nous venons de refondre notre site, qui s'adresse en priorité aux étudiants et
chercheurs internationaux de l'université : **https://uece-umons.netlify.app**

Au-delà de la présentation du cercle et de nos événements, il regroupe
l'information administrative que ces étudiants cherchent chaque année, expliquée
simplement et en français accessible :

- les démarches de titre de séjour et la distinction entre les procédures
  hors Union européenne et Union européenne ;
- la déclaration d'arrivée à la commune de Mons et l'annexe correspondante ;
- un guide pratique de la vie à Mons : logement, transports, mutuelle, santé,
  banque.

Ce sont exactement les questions qui reviennent aux services de l'université à
chaque rentrée. Notre site ne les remplace pas — il renvoie systématiquement
vers les sources officielles — mais il peut absorber une partie de ces demandes
et faire gagner du temps à tout le monde.

**Deux demandes, si vous le jugez opportun :**

1. **Un lien vers notre site depuis les pages de l'UMONS** — par exemple depuis
   la liste des cercles étudiants, ou depuis les pages d'accueil des étudiants
   internationaux. C'est ce qui permettrait aux étudiants de nous trouver au
   moment où ils en ont besoin, et non par hasard.

2. **Une question sur l'hébergement.** Notre site est aujourd'hui hébergé chez
   un prestataire externe gratuit. C'est un site entièrement statique — de
   simples pages, sans base de données ni application — donc très léger à
   héberger. **L'UMONS dispose-t-elle d'une solution d'hébergement pour les
   cercles reconnus**, ou de la possibilité de nous attribuer une adresse du
   type `uece.umons.ac.be` ? Une adresse universitaire donnerait au site une
   crédibilité que nous n'aurons jamais avec une adresse commerciale, et
   garantirait sa continuité au-delà des changements de comité.

Je reste évidemment disponible pour vous présenter le site, répondre à vos
questions, ou adapter son contenu si certains éléments vous semblaient devoir
être corrigés ou précisés.

Si je ne m'adresse pas au bon service, auriez-vous l'amabilité de m'orienter
vers la personne compétente ?

Je vous remercie de votre attention et vous prie d'agréer, Madame, Monsieur,
l'expression de mes salutations distinguées.

[Prénom Nom]
Président de l'UECE — Union des Étudiants et Chercheurs Étrangers
UECE.UMONS@umons.ac.be
[numéro de téléphone, facultatif]

---

## 2. Au Cercle Magellan — hébergement web

**À qui l'envoyer.** Le Cercle Magellan est le cercle informatique de la Faculté
Polytechnique. Utilisez le formulaire « Contactez-nous » de leur site, ou
l'adresse de contact qui y figure. Ils tiennent un local (Local 500, Cité
Houzeau) : proposer de passer sur place est souvent plus efficace qu'un long
échange de courriels.

**Objet :** `UECE — hébergement d'un site statique : quelques questions`

---

Bonjour,

Nous sommes l'**UECE (Union des Étudiants et Chercheurs Étrangers)**, cercle
étudiant reconnu par l'UMONS. Nous avons vu sur votre site que vous proposez de
l'hébergement web aux étudiants, et nous aimerions savoir si notre projet
pourrait entrer dans ce cadre.

**Ce que nous avons.** Un site vitrine et une billetterie pour notre Gala
annuel : **https://uece-umons.netlify.app**
Techniquement, c'est aussi simple que possible :

- **100 % statique** : HTML, CSS et JavaScript écrits à la main, aucun
  framework, aucune étape de compilation ;
- **pas de base de données, pas de code côté serveur** ;
- **poids total** : environ 20 Mo, dont l'essentiel en images ;
- **trafic** : très faible le reste de l'année, avec un pic au moment de la
  vente des billets du Gala (quelques centaines de visites par jour) ;
- le code est sur **GitHub**, et l'hébergeur actuel (Netlify) redéploie
  automatiquement à chaque modification.

**Nos questions.** Nous préférons les poser franchement plutôt que de découvrir
un blocage après la migration :

1. **Pouvez-vous héberger un site statique de ce type**, et à quelles
   conditions ?
2. **Le HTTPS est-il assuré** (certificat valide, renouvelé automatiquement) ?
   C'est pour nous un point bloquant : une de nos pages vérifie les cartes de
   membre et utilise une fonction du navigateur qui **ne fonctionne qu'en
   HTTPS**. Une page de paiement est également concernée.
3. **Comment se fait la mise en ligne** ? Idéalement un déploiement depuis notre
   dépôt GitHub (webhook, script, ou accès SSH/rsync). Un dépôt manuel par FTP
   reste envisageable, mais nous ferait perdre l'automatisation actuelle.
4. **Quelle adresse** pourrions-nous avoir ? Et serait-il possible d'y faire
   pointer plus tard un nom de domaine à nous (par exemple `uece-umons.be`) ?
5. **Quelle continuité** ? Nos comités changent tous les deux ans, les vôtres
   aussi. Comment gérez-vous les sauvegardes, et que se passe-t-il si plus
   personne de votre côté ne s'occupe du serveur pendant un temps ?
6. Y a-t-il des **limites** à connaître : espace disque, bande passante,
   nombre de sites hébergés ?

Nous ne sommes pas pressés et notre hébergement actuel fonctionne : nous
explorons simplement une solution locale, gratuite et tenue par des étudiants,
ce qui a du sens pour un cercle. Si vous préférez en discuter de vive voix,
nous pouvons passer au Local 500 quand cela vous arrange.

Merci d'avance pour votre réponse, et bravo pour ce que vous mettez à
disposition des étudiants.

Bien à vous,

[Prénom Nom]
Président de l'UECE — Union des Étudiants et Chercheurs Étrangers
UECE.UMONS@umons.ac.be

---

## Ce qu'il faudra décider à la réception des réponses

**Si l'UMONS propose une adresse `uece.umons.ac.be`** : c'est la meilleure
option, sans hésitation. Crédibilité, pérennité, et un excellent signal pour
Google. Il faudra alors créer une nouvelle propriété Search Console (Annexe 9,
§B.3) et rediriger l'ancienne adresse.

**Si Magellan propose un hébergement** : à examiner sur les points 2 et 3
ci-dessus. **Sans HTTPS, ce n'est pas envisageable** — la vérification des
cartes de membre cesserait de fonctionner. Sans déploiement automatique depuis
GitHub, c'est faisable mais chaque mise à jour redevient une manipulation
manuelle, ce qui complique la passation.

**Si les deux échouent** : Netlify reste parfaitement adapté. Ce n'est pas un
pis-aller — c'est ce que nous utilisons aujourd'hui et le site est rapide et
fiable. Dans ce cas, le seul vrai gain disponible reste le **nom de domaine
propre** (~15 €/an), qui rend l'adresse indépendante de l'hébergeur.

Dans tous les cas : **ne changez rien avant le Gala.** Une migration
d'hébergement pendant la vente des billets est le genre de risque qu'on ne
prend pas.
