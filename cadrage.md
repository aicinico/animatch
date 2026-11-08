# Animatch — Document de cadrage métier

> Nom provisoire : **Animatch**
> Dernière mise à jour : 8 novembre 2026
> Statut : cadrage métier du POC, validé
> Voir aussi : [architecture.md](architecture.md) pour les choix techniques

---

## 1. Vision

Animatch met en relation des **refuges** et des **particuliers souhaitant adopter un chat ou un chien**, afin de faciliter les adoptions et d'améliorer la visibilité des refuges.

L'application reprend la mécanique de Tinder :

- l'adoptant fait défiler les animaux proposés par les refuges situés dans sa zone ;
- il swipe à droite (intéressé) ou à gauche (pas intéressé) ;
- un swipe à droite crée une **candidature**, que le refuge accepte ou refuse ;
- une candidature acceptée devient un **match** : une conversation s'ouvre entre l'adoptant et le refuge pour organiser une rencontre avec l'animal.

## 2. Objectifs du POC

1. **Apprendre** à développer une application avec Claude.
2. **Faire une démonstration** à des refuges proches de chez nous, pour recueillir leur intérêt et leurs retours.

Conséquences :

- La démo doit montrer **les deux côtés** : l'interface adoptant et l'interface refuge. Le refuge est la cible à convaincre.
- Il faut des **données de démonstration réalistes** : refuges fictifs, fiches d'animaux avec photos **libres de droits**, adoptants fictifs.
- Pas d'infrastructure de production exigée, mais une **conception saine** pour permettre de passer à un vrai pilote sans tout refaire.

## 3. Acteurs

| Acteur | Description |
|---|---|
| **Adoptant** | Particulier souhaitant adopter un chat et/ou un chien. |
| **Refuge** | Refuge ou association de protection animale publiant des animaux à l'adoption. **Un seul compte partagé par refuge.** |
| **Administrateur** | Gestionnaire de la plateforme (Nicolas). Valide les refuges et modère les contenus. |

**Exclus du POC** : les éleveurs et les particuliers qui donnent un animal. La conception parle d'**« annonceurs »** plutôt que de « refuges » en dur, pour pouvoir les intégrer plus tard (sous réserve d'une étude du cadre légal, notamment la loi du 30 novembre 2021 contre la maltraitance animale).

## 4. Espèces

- Le POC couvre les **chats** et les **chiens**.
- La conception manipule des **« animaux »** dotés d'une **espèce**, pour pouvoir en ajouter d'autres plus tard.

## 5. Refuges

### 5.1 Inscription et validation

- Le refuge **s'inscrit seul**.
- Son compte reste **« en attente de validation »** tant que l'administrateur ne l'a pas validé dans l'espace admin.
- Tant qu'il n'est pas validé, le refuge **ne peut pas publier d'animaux**.
- Les informations fournies à l'inscription (n° SIRET ou RNA, par exemple) aident l'administrateur à vérifier qu'il s'agit d'une vraie structure.
- L'administrateur peut aussi **refuser** l'inscription, avec un **motif** envoyé par e-mail (par exemple « numéro SIRET invalide »). Le refuge peut corriger ses informations et **redemander une validation**.
- L'adresse du refuge est convertie en coordonnées GPS (géocodage) pour le calcul des distances.

### 5.2 Localisation

- La géolocalisation porte sur **le refuge**, pas sur chaque animal.
- Si un animal vit en **famille d'accueil**, le refuge peut l'indiquer en **texte libre** dans la fiche (par exemple « en famille d'accueil vers Lyon 7e »). Ce texte n'entre pas dans le calcul de distance.
- L'adresse précise d'une famille d'accueil n'est jamais exposée.

## 6. Profil adoptant

### 6.1 Champs obligatoires (socle)

| Champ | Remarque |
|---|---|
| Prénom | |
| Confirmation d'être majeur | Simple case à cocher. Pas de date de naissance, pour limiter les données personnelles collectées. |
| Localisation | Point de départ du rayon de recherche. L'adoptant choisit **à tout moment** entre sa **position GPS** et une **adresse, ville ou code postal** saisi. |
| Espèce recherchée | Chat, chien ou les deux. |
| Type de logement | Appartement ou maison. |
| Extérieur | Aucun, balcon, jardin… |
| Présence d'enfants | |
| Animaux déjà présents | **Choix multiple** : aucun, chat(s), chien(s), autres animaux. Nécessaire pour les règles « refuser les foyers avec chats / avec chiens ». |
| Temps d'absence quotidien | Par **tranches** : moins de 4 h, 4 à 6 h, 6 à 8 h, plus de 8 h. **Obligatoire seulement si l'adoptant cherche un chien** (« chien » ou « les deux »). Facultatif sinon. |

### 6.2 Champs facultatifs

- Expérience avec les chats et/ou les chiens
- Photo de profil
- Texte de présentation
- *(liste à compléter)*

### 6.3 Indice de complétude

- Un **indice de complétude** du profil est calculé et affiché, comme sur Tinder.
- Un message incite l'adoptant à compléter son profil au maximum pour **augmenter ses chances de match**.
- Le refuge voit cet indice sur les candidatures.

## 7. Fiche animal

### 7.1 Champs communs

- Nom
- Photos : **de 1 à 6** (maximum paramétrable)
- Espèce
- Date de naissance, éventuellement approximative. L'âge affiché est calculé et reste juste avec le temps.
- Sexe
- Race ou apparence
- Description
- Stérilisé (oui / non)
- Vacciné (oui / non)
- Identifié (puce / tatouage)
- Ententes : avec les chats, avec les chiens, avec les enfants
- Besoins particuliers (santé, intérieur uniquement…)
- Frais d'adoption
- Mention de famille d'accueil (texte libre, facultatif)
- Statut : disponible, réservé, adopté (voir §11)

### 7.2 Champs propres aux chiens

- Gabarit : petit, moyen, grand
- Niveau d'énergie et besoins d'exercice
- Niveau d'éducation : propreté, rappel, marche en laisse
- Capacité à rester seul
- **Catégorie** (1re ou 2e catégorie, le cas échéant)

### 7.3 Chiens catégorisés

- Ils sont **acceptés** sur la plateforme.
- Leur fiche affiche une **mention visible** rappelant les obligations légales du détenteur (permis de détention, assurance…).
- Le respect de la loi lors de l'adoption reste de la responsabilité du refuge.

## 8. Découverte et swipe (adoptant)

- L'adoptant voit les animaux des refuges situés dans un **rayon qu'il règle lui-même**, autour de sa position GPS ou de l'adresse qu'il a saisie (§6.1).
- Les animaux proposés sont **filtrés selon l'espèce recherchée** (chat, chien, les deux).
- Un animal **réservé** ou **adopté** n'apparaît **pas** dans les swipes.
- **Swipe à droite** : crée une candidature (voir §9).
- **Swipe à gauche** : l'animal est écarté. Il ne **réapparaît** qu'une fois que l'adoptant a vu **tous les autres animaux disponibles** de sa zone.
- Un **like retiré** et une **rétractation après match** équivalent à un swipe à gauche (voir §9.6).

## 9. Candidatures et match

### 9.1 Principe

Le modèle retenu est celui du **match mutuel** : le like de l'adoptant crée une candidature, qui ne devient un match que si le refuge l'accepte.

### 9.2 Traitement d'une candidature

Quand un adoptant like un animal :

1. **Règles de tri automatique de l'animal** : si le profil ne respecte pas une règle, la candidature est **automatiquement refusée**, sans action du refuge.
2. **Acceptation automatique** : si le profil passe les règles et que le refuge a activé l'option, la candidature est **automatiquement acceptée** (match immédiat).
3. Sinon, la candidature apparaît dans l'interface du refuge, qui l'accepte ou la refuse manuellement.

### 9.3 Règles de tri automatique

- Elles sont définies **par animal** (et non au niveau du refuge).
- Elles portent **uniquement sur les champs obligatoires** du profil adoptant.
- Ce sont des **critères prédéfinis** que le refuge active ou non sur la fiche de l'animal, et non un moteur de règles libre :

| Critère | Valeurs |
|---|---|
| Extérieur exigé | Aucune exigence / balcon minimum / jardin |
| Types de logement acceptés | Appartement, maison |
| Refuser les foyers avec enfants | Oui / non |
| Refuser les foyers avec chats | Oui / non |
| Refuser les foyers avec chiens | Oui / non |
| Temps d'absence maximum (chiens) | Une des tranches du §6.1 |

### 9.4 Option d'acceptation automatique

- Les refuges qui ne veulent pas trier les candidats peuvent activer cette option.
- Les règles de tri de l'animal s'appliquent avant elle.

### 9.5 Interface de tri côté refuge

- Pas de swipe côté refuge.
- **Un onglet par animal** publié.
- Les candidats apparaissent sous forme de **grille d'icônes avec leur photo**, comme la page « Ils vous ont liké » de Tinder Gold.
- Le refuge ouvre le profil détaillé d'un candidat (avec l'indice de complétude), puis l'**accepte** ou le **refuse**.

### 9.6 Retrait et rétractation de l'adoptant

| Situation | Effet |
|---|---|
| **Retrait d'un like** (candidature en attente) | La candidature est annulée et disparaît de l'interface du refuge. Équivaut à un swipe à gauche : l'animal peut réapparaître selon la règle du §8. |
| **Rétractation après un match** | La conversation passe en **lecture seule** et le **refuge est notifié**. Équivaut à un swipe à gauche : l'animal peut réapparaître selon la règle du §8. Si l'adoptant était **désigné pour une réservation**, celle-ci est **maintenue** : seul le refuge peut la lever (voir §11.2). |

## 10. Espaces de l'adoptant après le swipe

### 10.1 Page « Mes likes »

Elle liste les animaux likés dont la candidature n'a pas (encore) abouti à un match. Chaque ligne affiche un statut :

| Statut | Signification |
|---|---|
| **En attente** | Le refuge n'a pas encore répondu. |
| **Non retenue** | Le refuge a refusé, manuellement ou par une règle automatique. |
| **Réservé** | L'animal a été réservé pour un autre adoptant. La candidature reste en attente en arrière-plan et la ligne revient à « En attente » si la réservation est levée. |
| **Adopté** | L'animal a trouvé sa famille. |

- Un refus se traduit **uniquement par le statut** affiché sur la ligne, sans notification e-mail ou push.
- Les candidatures non retenues restent **indéfiniment** dans « Mes likes ». L'adoptant peut les **masquer**.
- L'adoptant peut **retirer un like** en attente (voir §9.6).

### 10.2 Page « Conversations »

- Quand une candidature est acceptée, l'animal **quitte « Mes likes »** et apparaît dans « Conversations ».
- Si l'animal est réservé pour lui, l'adoptant voit la mention **« Réservé pour vous »**.
- L'adoptant peut **se rétracter** après un match (voir §9.6).
- Voir §12 pour la messagerie.

## 11. Cycle de vie d'un animal

### 11.1 Statuts et transitions

```
       Disponible ──────────── réservation ───────────► Réservé
            ▲  │                                          │  │
            │  │                                          │  │
            │  └──── adoption directe ──┐   ┌── adoption ─┘  │
            │                           ▼   ▼                │
            │                           Adopté               │
            │              (définitif, retiré de la          │
            │                     plateforme)                │
            └──────────── levée de la réservation ───────────┘
```

| De | Vers | Déclencheur |
|---|---|---|
| Disponible | Réservé | Réservation (§11.2) |
| Réservé | Disponible | Levée de la réservation (§11.3) |
| Réservé | Adopté | Adoption (§11.4) |
| Disponible | Adopté | Adoption directe, sans réservation (§11.4) |

- **Toutes les transitions sont faites manuellement par le refuge.**
- Le statut **Adopté est définitif**. Si l'animal revient au refuge après son adoption, le refuge crée une **nouvelle fiche**.

| Statut | Visible dans les swipes | Visible pour les adoptants ayant déjà liké ou matché |
|---|---|---|
| **Disponible** | Oui | Oui |
| **Réservé** | Non | Oui, avec la mention « Réservé » (ou « Réservé pour vous » pour l'adoptant désigné) |
| **Adopté** | Non | Statut « Adopté » dans « Mes likes ». Voir §11.4 pour les conversations. |

### 11.2 Réservation

Au moment de réserver, le refuge désigne le bénéficiaire :

- **un adoptant parmi ses matchs** pour cet animal ;
- ou **« adoptant hors Animatch »**, si la personne vient d'ailleurs (salon, bouche-à-oreille…).

Effets de la réservation :

- l'animal **disparaît des swipes** ;
- la conversation avec l'**adoptant désigné** reste **ouverte** ;
- les conversations avec les **autres adoptants matchés** passent en **lecture seule**, ainsi que **toutes** les conversations en cas de réservation « hors Animatch » ;
- les **candidatures en attente** restent **en attente** ;
- l'adoptant désigné reçoit une **notification** (« … est réservé pour vous »).

> **Hypothèse de fonctionnement** : le refuge contacte l'adoptant **par téléphone** avant de réserver. La notification confirme cet échange. L'application n'a rien à gérer côté téléphone.

**Rétractation de l'adoptant désigné** : la réservation est **maintenue**. Seul le refuge peut la lever, manuellement, pour éviter qu'une erreur de manipulation de l'adoptant ne la fasse tomber. Le refuge est prévenu par la notification de rétractation (§13).

### 11.3 Levée de la réservation

Le refuge peut remettre l'animal en **Disponible**, si la rencontre ne s'est pas bien passée par exemple :

- l'animal **réapparaît dans les swipes** ;
- les conversations passées en lecture seule du fait de la réservation **se rouvrent** ;
- les candidatures en attente restent en attente ;
- les adoptants qui avaient liké ou matché l'animal reçoivent une **notification** (« … est de nouveau disponible »).

### 11.4 Adoption

L'adoption peut se faire **depuis le statut Réservé** ou **directement depuis Disponible** (adoption conclue sans réservation préalable, au refuge par exemple). Dans ce second cas, le refuge **désigne l'adoptant** comme pour une réservation : un adoptant parmi ses matchs, ou « adoptant hors Animatch ».

Quand le refuge passe l'animal en **Adopté** :

- il est **retiré de la plateforme** (plus de fiche consultable, plus de swipe) ;
- la conversation avec l'**adoptant qui a adopté** reste **ouverte**. Elle continue d'afficher le nom et la photo de l'animal, et l'adoptant reçoit un **message de félicitations** ;
- les **autres adoptants** qui l'avaient liké ou matché reçoivent une **notification** (« … a trouvé sa famille ») ;
- leurs conversations passent en **lecture seule**.

## 12. Messagerie

- Une conversation lie **un adoptant, un refuge et un animal**.
- Elle s'ouvre **uniquement après un match**.
- Contenu : **texte et photos**.
- Fonctionnement **en différé** pour le POC : le message est enregistré et le destinataire le voit à l'ouverture de la conversation, ou grâce à la notification. Il n'apparaît pas instantanément à l'écran.
  - L'architecture doit permettre de passer au **temps réel** plus tard sans tout refaire.
- Côté refuge, les messages sont signés au nom du refuge (compte partagé).
- Le **rendez-vous** pour rencontrer l'animal s'organise **dans la conversation**, sans outil dédié.

### Passage en lecture seule

| Cas | Conversation concernée | Réversible ? |
|---|---|---|
| Animal réservé pour un autre adoptant ou « hors Animatch » | Celles des adoptants non désignés | Oui, à la levée de la réservation |
| Animal adopté | Celles des adoptants autres que l'adoptant qui a adopté | Non |
| Rétractation de l'adoptant après un match | Celle de l'adoptant qui se rétracte | Non |

## 13. Notifications

Canaux : **e-mail et push**.

| Événement | Destinataire |
|---|---|
| Nouvelle candidature | Refuge |
| Match (candidature acceptée) | Adoptant |
| Nouveau message | Adoptant ou refuge |
| Adoptant rétracté après un match | Refuge |
| Animal réservé (« … est réservé pour vous ») | Adoptant désigné |
| Animal de nouveau disponible (réservation levée) | Adoptants qui l'avaient liké ou matché |
| Félicitations pour l'adoption | Adoptant qui a adopté |
| Animal adopté (« … a trouvé sa famille ») | Autres adoptants qui l'avaient liké ou matché |
| Refuge validé par l'administrateur | Refuge |
| Refuge refusé par l'administrateur (avec motif) | Refuge |

Un refus de candidature **ne déclenche pas** de notification (statut uniquement, voir §10.1).

## 14. Administration

Un espace admin simple permet de :

- **valider les inscriptions des refuges** ;
- **supprimer un contenu** (fiche animal, photo, message, compte…).

Les **signalements** par les utilisateurs ne sont pas pris en charge dans le POC.

## 15. Plateformes

- **Mobile et ordinateur.**
- L'expérience adoptant est pensée d'abord pour le mobile (swipe).
- L'interface refuge (tri des candidatures, gestion des fiches) sera probablement très utilisée sur ordinateur.
- Les choix techniques (web, natif, application web installable…) restent à faire. Le push sur mobile est une contrainte à prendre en compte.

## 16. Hors périmètre du POC

- Éleveurs et particuliers qui donnent un animal
- Signalements des utilisateurs
- Outil de prise de rendez-vous
- Messagerie en temps réel (« en train d'écrire », « lu »…)
- Plusieurs comptes utilisateurs par refuge
- Géolocalisation par animal
- Modèle économique et fonctionnalités payantes
- Connexion avec Google ou Apple
- Suppression de son compte par l'utilisateur (reportée, voir §18)
- Conformité RGPD complète. La conception doit tout de même rester saine : données personnelles et position GPS manipulées.

## 17. Risques identifiés

| Risque | Commentaire |
|---|---|
| **Problème de la poule et de l'œuf** | Sans animaux, pas d'adoptants, et sans adoptants, pas d'intérêt pour les refuges. Risque principal du projet, d'ordre métier et non technique. |
| **Aucun refuge testeur identifié** | Démarcher tôt un ou deux refuges locaux, même pour recueillir leur avis sur les maquettes, permettrait de valider les hypothèses (charge de tri, champs utiles…). |
| **Charge de tri pour les refuges** | Atténuée par les règles automatiques et l'option d'acceptation automatique. À confirmer auprès de vrais refuges. |
| **Distance trompeuse** | Pour les associations dont les animaux sont en familles d'accueil dispersées, la distance calculée depuis le refuge peut être éloignée de la réalité. |

## 18. Questions ouvertes

### Reportées

1. **Nom définitif** de l'application (« Pattoumatch » et « Swipattes » ont été envisagés) et vérification de disponibilité (INPI, noms de domaine, stores).
2. **Champs facultatifs du profil adoptant** : liste à compléter.
3. **Informations demandées au refuge à l'inscription** (nom, adresse, SIRET/RNA, contact, description, logo…) : à préciser.
4. **Modèle économique** : hors POC, à garder en tête.
5. **Suppression de compte** par l'utilisateur : utile pour le RGPD, pas indispensable pour une démo. À décider avant tout pilote réel.
