# ANNEXE 7 — Banque d'images à collecter

> Liste établie le 17/07/2026 pour habiller les sections « qualitatives » du
> site (chantier prévu APRÈS la migration Stripe). Roy collecte, Claude Code
> convertit (WebP + tailles adaptées) et intègre.

---

## 0. Règles pour toutes les images (à lire avant de chercher)

**Format technique**
- Paysage, ratio 3:2 ou 16:9, **minimum 1 200 px de large** (idéal 1 600 px).
- Portraits des membres : **carré**, minimum 800 × 800 px, cadrage buste.
- JPEG ou PNG suffisent — la conversion WebP et les différentes tailles sont
  faites à l'intégration. Déposer les originaux dans `images/`.

**Droits d'utilisation — dans cet ordre de préférence**
1. **Vos propres photos UECE** (soirées, accueils, galas passés) : toujours le
   mieux — authentique et zéro problème de droits.
2. **Wikimedia Commons** (commons.wikimedia.org) : parfait pour les monuments
   montois (Doudou, Beffroi, Grand-Place…). Licence Creative Commons → noter
   l'auteur et la licence, on créditera en bas de page.
3. **Banques gratuites** (Unsplash, Pexels) : pour les images d'ambiance
   génériques (marché, réunion…).
4. **JAMAIS** une image prise sur Google Images ou un site de presse sans
   vérifier sa licence.

**Personnes reconnaissables** : pour les photos d'étudiants (soirées UECE,
portraits des membres), demander un accord écrit simple (message ou mail
« ok pour que ma photo apparaisse sur le site UECE ») — droit à l'image.

**Ducasse** : l'image mentionnée par Roy n'est pas encore dans le dossier
`images/` du dépôt (vérifié le 17/07/2026) — à déposer ou renvoyer.

## 1. Avis sur le « carrousel partout » (demandé par Roy)

Le carrousel est superbe **en vitrine** (une grande section par page, comme la
mission sur association.html), mais **pas recommandé pour les grilles de
cartes** (culture, lieux clés…), pour trois raisons mesurées par l'industrie :
1. les visiteurs ne regardent quasiment que la première diapositive ;
2. chaque carrousel ajoute du JS, des images chargées d'avance et du risque de
   décalage de mise en page (notre budget CLS < 0,1) ;
3. plusieurs carrousels sur une page se cannibalisent l'attention.

**Recommandation** : maximum UN carrousel par page (vitrine), et pour les
cartes → **une image fixe en bandeau au-dessus de chaque carte** (élégant,
rapide, et chaque sujet reste visible en permanence). C'est le plan suivi
ci-dessous ; les images demandées servent les deux options si on change d'avis.

## 2. Liste de courses, section par section

### association.html — carrousel de la mission (déjà en place, images provisoires)
| Diapositive | Contexte d'image à chercher |
|---|---|
| Accueillir | Accueil de nouveaux étudiants : journée d'accueil, stand d'association, étudiant avec valise à la gare, poignée de main chaleureuse — idéalement une vraie photo d'accueil UECE |
| Intégrer | Soirée interculturelle : repas partagé multiculturel, groupe d'étudiants qui rient/dansent, jeux — idéalement une vraie soirée UECE |
| Représenter | Cadre officiel : prise de parole au micro, table de réunion, remise de prix, poignée de main institutionnelle (avec l'UMONS si possible) |

### association.html — membres des bureaux
- Un **portrait carré par membre** (actuel et anciens si retrouvables) :
  buste, fond neutre, lumière douce, **même style pour tout le monde**
  (cohérence visuelle). Souriants — c'est une page d'accueil, pas un trombinoscope administratif.

### guide.html — cartes « Culture » (4 images)
| Carte | Contexte d'image |
|---|---|
| Le Doudou | Combat du Lumeçon sur la Grand-Place (saint Georges, le dragon, la foule) OU procession du Car d'Or — Wikimedia Commons en a d'excellentes |
| Le Beffroi | Le beffroi baroque vu du jardin du beffroi, ciel dégagé |
| Grand-Place & Sainte-Waudru | L'Hôtel de Ville gothique de jour (bonus : le singe du Grand-Garde) OU la collégiale Sainte-Waudru en extérieur |
| Musées & art | Façade du BAM OU la maison Van Gogh à Cuesmes |

### guide.html — cartes « Lieux clés » (3 images) + campus
| Carte | Contexte d'image |
|---|---|
| Administration | Façade de l'Hôtel de Ville de Mons (Grand-Place) |
| **Campus UMONS** | Campus de la Plaine de Nimy : esplanade/bâtiments avec des étudiants qui marchent ; en complément, un bâtiment du centre-ville (Place du Parc) — demande explicite de Roy |
| Se déplacer, respirer | Le Grand Large (lac : aviron, jogging, coucher de soleil) OU la gare de Mons |

### guide.html — encadré « Marchés »
- Étal de marché coloré (fruits/légumes), ambiance de matinée — idéalement un
  vrai marché montois (boulevard Dolez ou gare), sinon image générique libre.

### index.html — accueil (plus tard, moins prioritaire)
- Les deux carrés actuels (affiches) pourront devenir de vraies photos :
  1) une **rencontre/activité UECE** (groupe multiculturel en action),
  2) un **événement festif** (photo d'un gala précédent).

### annonces.html et faq.html
- annonces.html : optionnel, une seule image d'en-tête sobre (documents,
  passeport, guichet) si on veut réchauffer la page. Pas urgent.
- faq.html : **pas d'image** — page de lecture rapide, la surcharger nuirait.

## 3. Ordre de priorité suggéré

1. Portraits du **bureau actuel** (personne d'autre ne peut les fournir).
2. Les 3 images du **carrousel mission** (remplacer les provisoires).
3. Les 4 images **Culture** + campus (faciles via Wikimedia).
4. Le reste (marchés, accueil, annonces).
