# Animatch — Architecture technique

> Dernière mise à jour : 8 novembre 2026
> Statut : choix techniques du POC, validés
> Voir aussi : [cadrage.md](cadrage.md) pour le cadrage métier

---

## 1. Principes directeurs

1. **Apprendre en profondeur** le développement web, avec des outils directement utiles au métier de QA (même pile technique que l'entreprise : Symfony, API Platform, React, JWT).
2. **Vitrine pour le CV** : le dépôt public doit être soigné (README, historique Git propre, stratégie de tests visible).
3. **100 % gratuit.**
4. **Rien d'installé sur le Mac** (ordinateur professionnel) : tout tourne dans un Dev Container, sur GitHub Codespaces.
5. **Portabilité** : aucune dépendance forte à un hébergeur. On doit pouvoir changer de fournisseur par configuration.
6. **Simplicité pour le POC**, mais une **conception saine**, pour passer à un pilote réel sans tout refaire.

## 2. Pile technique

| Couche | Choix |
|---|---|
| Forme de l'application | **Application web responsive et installable (PWA)**, pour mobile et ordinateur. Pas de publication sur les stores pour le POC. |
| Interface | **React + TypeScript**, construite avec **Vite** |
| API | **Symfony** (dernière version LTS, à vérifier à l'installation) + **API Platform** (version compatible), en PHP |
| Serveur PHP | **FrankenPHP** (fourni par la distribution API Platform), HTTPS local automatique |
| Base de données | **PostgreSQL + PostGIS** (recherche par distance) |
| E-mails en développement | **Mailpit** (intercepte tous les e-mails, aucun envoi réel) |
| Tests | **PHPUnit** (API), **Vitest + Testing Library** (interface), **Playwright** (bout en bout et API), **Artillery** (charge) |
| Intégration continue | **GitHub Actions** (gratuit et illimité pour un dépôt public) |

### Pourquoi ces choix

- **PWA plutôt qu'application native** : une seule base de code, une démo accessible par un simple lien, et des tests Playwright possibles partout. La limite : sur iPhone, les notifications push ne fonctionnent que si l'application est ajoutée à l'écran d'accueil (iOS 16.4 ou plus récent). Les e-mails compensent.
- **Symfony + API Platform plutôt que Python ou Node.js** : c'est la pile de l'entreprise, donc une montée en compétence directement utile au travail (lecture du code des développeurs, tests d'API et de charge mieux ciblés). Python est gardé pour un second projet.
- **Serveur sur mesure plutôt qu'une plateforme « backend-as-a-service »** (Supabase) : pour apprendre le fonctionnement complet d'un serveur web.
- **Vite plutôt que Next.js** : une application derrière une connexion n'a pas besoin de générer ses pages côté serveur. Next.js, proposé par défaut par la distribution API Platform, sera remplacé.

## 3. Architecture générale

```
 Navigateur (mobile / ordinateur)
        │
        ▼
 Interface React + TypeScript (PWA, service worker)
        │  HTTPS, API REST (JSON), jeton JWT
        ▼
 API Symfony + API Platform (FrankenPHP)
        │
        ├──► PostgreSQL + PostGIS (données, recherche par distance)
        ├──► Stockage des photos (Flysystem : disque local ou S3)
        ├──► Messenger (traitements en arrière-plan)
        │       ├──► Mailer  → Mailpit (dev) / Brevo ou Resend (pilote)
        │       └──► Web Push → navigateurs abonnés
        └──► Géoplateforme IGN (géocodage des adresses, gratuit, sans clé)
```

## 4. Organisation du dépôt

**Un seul dépôt (monorepo)**, **public** sur le compte GitHub personnel.

```
animatch/
├── .devcontainer/        Configuration du Dev Container (Codespaces / local)
├── .github/workflows/    Intégration continue (GitHub Actions)
├── api/                  API Symfony + API Platform (PHP)
├── web/                  Interface React + TypeScript (PWA)
├── e2e/                  Tests Playwright : parcours dans l'interface et tests d'API
├── load/                 Scénarios Artillery
├── bruno/                Collection Bruno : exploration et documentation de l'API
├── docs/                 cadrage.md, architecture.md…
├── compose.yaml          Services : PHP, PostgreSQL + PostGIS, Mailpit
├── Makefile              Raccourcis pour les commandes courantes
├── CLAUDE.md             Instructions de projet pour Claude
└── README.md             Installation et lancement
```

## 5. Conventions

### 5.1 Langues

| Élément | Langue |
|---|---|
| Code (classes, variables, tables, routes d'API) | **Anglais** |
| Interface utilisateur | **Français** |
| Documentation, messages de pull request | **Français** |
| Messages de commit | Préfixe Conventional Commits en anglais, description libre |

### 5.2 Git

- **Une branche et une pull request par fonctionnalité.** Fusion uniquement si l'intégration continue est verte.
- **Conventional Commits** : `feat: …`, `fix: …`, `test: …`, `docs: …`, `chore: …`, `refactor: …`.

### 5.3 Secrets

Le dépôt est **public** : **aucun secret ne doit jamais être commité** (mots de passe, clés JWT, clés d'API).
- Les valeurs locales vont dans `.env.local`, ignoré par Git.
- En production : variables d'environnement de l'hébergeur ou gestionnaire de secrets de Symfony.
- L'analyse des secrets de GitHub est activée sur le dépôt.

### 5.4 Méthode de travail avec Claude

Chaque modification suit la règle décrite dans le `CLAUDE.md` à la racine du dépôt : explication détaillée, avantages et inconvénients, débat, puis application seulement après un feu vert explicite (« applique », « vas-y »). Ce fichier décrit aussi le profil de Nicolas et la façon d'adapter les explications (il part de zéro en développement web).

## 6. Environnement de développement

- **Dev Container** décrit dans `.devcontainer/` : c'est le poste de travail du développeur, sous forme de conteneur. Il contient Docker, Node.js, la GitHub CLI, Claude Code et les navigateurs Playwright (installés automatiquement à la création, une fois `package.json` en place).
- **PHP n'est pas installé dans le Dev Container** : il tourne dans le conteneur `php` de l'application (FrankenPHP), lancé par Docker Compose depuis le Dev Container. Les commandes PHP passent par `docker compose exec php …`. Ainsi, une seule image PHP sert au développement, à l'intégration continue et à l'hébergement.
- **Environnement principal : GitHub Codespaces.** Quota gratuit : 120 heures-cœur par mois (environ 60 h sur une machine à 2 cœurs) et 15 Go de stockage. Le plafond de dépense reste à 0 € : pas de facture possible. L'environnement s'arrête automatiquement après 30 minutes d'inactivité.
- **Solution de secours** : le même Dev Container, lancé en local avec Docker et VS Code.
- **Éditeur** : VS Code, avec l'extension **Intelephense** pour PHP.
- **Base de départ** : la **distribution officielle d'API Platform**, qui fournit déjà l'environnement Docker (FrankenPHP, PostgreSQL, HTTPS). On y ajoute PostGIS et Mailpit, et on remplace l'interface Next.js par Vite + React.
- **Tests sur iPhone** : via les adresses HTTPS publiques que Codespaces attribue à chaque port.

## 7. Authentification

| Sujet | Décision |
|---|---|
| Méthode | **JWT** (comme dans l'entreprise) : **LexikJWTAuthenticationBundle** |
| Durée de vie | Jeton d'accès **court** (environ 15 min) + jeton de rafraîchissement **long** (environ 30 jours) : **gesdinet/jwt-refresh-token-bundle** |
| Rotation | Chaque utilisation d'un jeton de rafraîchissement l'invalide et en délivre un nouveau |
| Stockage côté navigateur | Jeton d'accès **en mémoire**, jeton de rafraîchissement dans le **`localStorage`** |
| Identifiants | E-mail + mot de passe |
| Rôles | `ROLE_ADOPTER`, `ROLE_SHELTER`, `ROLE_ADMIN`. **Un seul rôle par compte.** Une même personne a deux comptes distincts si besoin. |
| Vérification de l'e-mail | Oui (lien de confirmation) |
| Mot de passe oublié | Oui (lien de réinitialisation par e-mail) |
| Connexion Google / Apple | Hors POC |
| Suppression de compte | Reportée |

**Pourquoi pas des cookies de session ?** Avec un hébergement gratuit, l'interface et l'API seront sur deux domaines différents. Le cookie de l'API deviendrait alors un cookie tiers, que **Safari bloque par défaut**.

**Évolution prévue** : le jour où un nom de domaine est acheté (`app.animatch.fr` / `api.animatch.fr`), on stockera le jeton de rafraîchissement dans un cookie `HttpOnly`, l'option la plus sûre.

**À savoir** : une PWA installée sur iPhone a son propre stockage, séparé de Safari. L'utilisateur doit se reconnecter une fois après l'installation.

## 8. Interface (web/)

| Besoin | Outil |
|---|---|
| Build et serveur de développement | **Vite** |
| Navigation entre pages | **React Router** |
| Appels à l'API, cache, états de chargement | **TanStack Query** |
| Client d'API typé | **openapi-typescript + openapi-fetch** (types générés depuis la description OpenAPI d'API Platform) |
| Formulaires et validation | **React Hook Form + Zod** |
| Style | **Tailwind CSS** |
| Composants (accessibles) | **shadcn/ui** (code des composants copié dans le projet) |
| Animation du swipe | **Motion** |
| PWA (manifeste, service worker, push) | **vite-plugin-pwa** |
| Tests unitaires | **Vitest + Testing Library** |
| Qualité | **ESLint + Prettier** |

**Les types partagés** : les types TypeScript de l'API sont générés automatiquement. Si l'API change, la compilation de l'interface et des tests Playwright signale immédiatement ce qui casse.

## 9. API (api/)

| Besoin | Outil |
|---|---|
| Exposition de l'API REST | **API Platform** |
| Accès aux données | **Doctrine ORM** + migrations |
| Types géographiques | Extension Doctrine pour **PostGIS** |
| Droits d'accès | Composant **Security**, **Voters** |
| Transitions de statut (animal, candidature) | Composant **Workflow** |
| Traitements en arrière-plan | **Messenger** |
| E-mails | **Mailer** |
| Notifications multi-canaux | **Notifier** + bibliothèque **Web Push** |
| Envoi des photos | **VichUploaderBundle** |
| Redimensionnement des photos | **LiipImagineBundle** |
| Abstraction du stockage | **Flysystem** |
| Espace admin | **EasyAdmin** |
| Jeux de données (tests et démo) | **Foundry** + **DoctrineFixturesBundle** |
| Qualité | **PHPStan**, **PHP-CS-Fixer** |

### 9.1 Géolocalisation

- **Refuge** : son adresse est géocodée (convertie en coordonnées) via la **Géoplateforme de l'IGN**, gratuite et sans clé, avec autocomplétion à la saisie.
- **Adoptant** : il choisit à tout moment entre sa **position GPS** (API de géolocalisation du navigateur, avec son autorisation) et une **adresse, ville ou code postal** saisi, géocodé avec le même service.
- **Recherche** : une requête PostGIS sélectionne les refuges situés dans le rayon de l'adoptant.

### 9.2 Photos

- **De 1 à 6 photos par animal**. Le maximum est un paramètre de configuration.
- Elles sont **redimensionnées et converties en WebP à l'envoi**, et l'original n'est pas conservé :
  - miniature (environ 300 px, environ 20 Ko) pour la grille des candidats et « Mes likes » ;
  - carte (environ 1080 px, environ 150 Ko) pour le swipe et la fiche détaillée.
- Ordre de grandeur : environ 1 Mo par animal avec 6 photos.
- Stockage via Flysystem : **disque local** en développement et pour les démos, **service compatible S3** pour un éventuel pilote.

### 9.3 Traitements en arrière-plan

- Les notifications (e-mail, push) sont envoyées **en arrière-plan** via Messenger, avec un processus « worker » dédié.
- Si l'hébergement d'un pilote ne permet pas de worker, on **bascule en envoi direct par simple configuration**, sans changer le code.

## 10. Modèle de données

### 10.1 Lexique

| Français | Code |
|---|---|
| Compte utilisateur | `User` |
| Profil adoptant | `AdopterProfile` |
| Annonceur (refuge) | `Advertiser`, de type `SHELTER` (seul type du POC) |
| Animal | `Animal` |
| Photo d'animal | `AnimalPhoto` |
| Critères de tri automatique | `ScreeningCriteria` (intégré à `Animal`) |
| Swipe | `Swipe` |
| Candidature | `Application` |
| Conversation | `Conversation` |
| Message | `Message` |
| Abonnement push | `PushSubscription` |

### 10.2 Relations

```
User ─┬─ 1:1 ─ AdopterProfile ─┬─ 1:N ─ Swipe ───── N:1 ─┐
      │                        └─ 1:N ─ Application ─ N:1 ┤
      │                                    │              │
      │                                  1:0..1           ▼
      │                               Conversation      Animal ─ 1:N ─ AnimalPhoto
      │                                    │              ▲
      │                                  1:N              │
      │                                 Message           │
      │                                                   │
      ├─ 1:1 ─ Advertiser ─────────── 1:N ────────────────┘
      └─ 1:N ─ PushSubscription
```

Un `User` a soit un `AdopterProfile`, soit un `Advertiser`, soit aucun des deux (administrateur).

### 10.3 Entités

**`User`**
- e-mail (unique), mot de passe (haché), rôle, e-mail vérifié (oui/non), date de création.

**`AdopterProfile`**
- *Obligatoires* : prénom, confirmation d'être majeur, espèce recherchée (`CAT` / `DOG` / `BOTH`), type de logement, extérieur, présence d'enfants, animaux déjà présents (choix multiple : aucun, chats, chiens, autres), temps d'absence quotidien par tranche (obligatoire si l'espèce recherchée inclut le chien).
- *Localisation* : source (`GPS` / `ADDRESS`), point géographique, libellé (ville), rayon de recherche en km.
- *Facultatifs* : expérience, photo, texte de présentation (liste à compléter).
- *Calculé* : indice de complétude (non stocké).

**`Advertiser`**
- type (`SHELTER`), nom, identifiant légal (SIRET / RNA), adresse, point géographique, coordonnées de contact, description, logo.
- statut de validation : `PENDING` / `VALIDATED` / `REJECTED`, avec motif de refus.
- option d'**acceptation automatique** (oui/non).

**`Animal`**
- *Une seule table pour toutes les espèces*. Les champs propres aux chiens sont vides pour les chats. La validation vérifie leur présence selon l'espèce.
- *Communs* : nom, espèce, date de naissance (éventuellement approximative), sexe, race ou apparence, description, stérilisé, vacciné, identifié, ententes (chats, chiens, enfants), besoins particuliers, frais d'adoption, mention de famille d'accueil.
- *Chiens* : gabarit, niveau d'énergie, niveau d'éducation, capacité à rester seul, catégorie (aucune / 1re / 2e).
- *Statut* : `AVAILABLE` / `RESERVED` / `ADOPTED`. Une réservation ou une adoption renvoie vers la candidature de l'adoptant désigné, ou porte la mention « hors Animatch ».
- *Critères de tri automatique* (`ScreeningCriteria`) : extérieur exigé, types de logement acceptés, refus des foyers avec enfants / chats / chiens, temps d'absence maximum.
- Un animal adopté est **masqué, jamais supprimé** : les conversations doivent toujours afficher son nom et sa photo.

**`AnimalPhoto`**
- animal, position (ordre d'affichage), chemins de la miniature et de la version carte.

**`Swipe`**
- adoptant, animal, sens (`LIKE` / `DISLIKE`), date.
- Les swipes à gauche servent à la règle de réapparition : un animal écarté ne revient qu'une fois tous les autres animaux disponibles de la zone vus.
- Un like retiré devient un `DISLIKE`.

**`Application`** (candidature)
- adoptant, animal, date.
- statut : `PENDING` / `REJECTED` / `ACCEPTED` / `WITHDRAWN` (like retiré) / `RETRACTED` (rétractation après un match).
- origine du refus : automatique ou manuelle.
- masquée par l'adoptant (oui/non).

**`Conversation`**
- liée à une candidature `ACCEPTED`.

**`Message`**
- conversation, auteur (adoptant ou annonceur), texte et/ou photo, date d'envoi, date de lecture (sert au badge de messages non lus, non affichée à l'autre personne).

**`PushSubscription`**
- utilisateur, adresse d'envoi (endpoint) et clés fournies par le navigateur.

Plus les tables techniques des bundles : jetons de rafraîchissement, demandes de réinitialisation de mot de passe, file de messages de Messenger.

### 10.4 Données déduites plutôt que stockées

Pour éviter que deux informations se contredisent, ces données sont **calculées** et jamais stockées :

| Donnée | Déduite de |
|---|---|
| Statut « Réservé » / « Adopté » dans « Mes likes » | Statut de l'animal |
| Conversation en lecture seule | Statut de la candidature, statut de l'animal et adoptant désigné (règles du §12 du cadrage) |
| Indice de complétude | Champs remplis du profil |
| Âge de l'animal | Date de naissance |

## 11. Stratégie de tests

### 11.1 Niveaux

| Niveau | Outil | Cible |
|---|---|---|
| Analyse statique | PHPStan, ESLint, compilation TypeScript | Erreurs de type, code douteux |
| Unitaire (API) | PHPUnit | Logique métier pure : critères de tri, transitions de statut, indice de complétude, règle de réapparition |
| Fonctionnel (API) | PHPUnit + outils de test d'API Platform, **vraie base PostgreSQL + PostGIS** | Routes de bout en bout côté serveur, **droits d'accès en priorité**, recherche par distance, codes d'erreur |
| Unitaire (interface) | Vitest + Testing Library | Composants, validation des formulaires, carte de swipe |
| Bout en bout | Playwright, **Chromium + WebKit + émulation iPhone** | Parcours critiques avec toute la pile, e-mails vérifiés via Mailpit |
| Exploration manuelle de l'API | Bruno (collection versionnée dans `bruno/`) | Essayer et documenter chaque route. Exécution dans l'intégration continue envisageable plus tard. |
| Charge | Artillery (lancé à la main, hors intégration continue) | Recherche par distance, envoi de photos |

### 11.2 Principes

- **On cible les zones critiques**, sans seuil de couverture global : règles métier, droits d'accès, cycle de vie.
- **Pas de TDD** : les tests sont écrits avec le code, pas avant.
- **Claude écrit les tests**, y compris ceux de bout en bout. Nicolas en écrit quand il le souhaite, avec l'aide de Claude.
- **Conventions Playwright** (celles de Nicolas) : **Page Object Model**, **fixtures personnalisées**, **organisation par fonctionnalité**.
- **Isolation des tests d'API** : chaque test s'exécute dans une transaction annulée à la fin (DAMA DoctrineTestBundle).
- **Jeux de données** : les fabriques Foundry servent à la fois aux tests et à la démo.

### 11.3 Intégration continue

À chaque pull request :
1. analyse statique et formatage (PHP et TypeScript) ;
2. tests unitaires et fonctionnels de l'API ;
3. tests unitaires et build de l'interface ;
4. tests Playwright de bout en bout, avec toute la pile lancée dans Docker.

La fusion dans la branche principale n'est possible que si tout est vert. Des filtres par dossier évitent de tout relancer pour une modification limitée à la documentation.

### 11.4 Vitrine

- **Badges** d'intégration continue dans le `README.md`.
- **Rapport Playwright publié automatiquement sur GitHub Pages** (gratuit) à chaque fusion sur la branche principale : un recruteur peut consulter les résultats des tests de bout en bout.
- **Rapports Artillery** commentés dans la documentation.

## 12. Hébergement

Le déploiement se fait **en deux temps** :

1. **Démos** : **depuis Codespaces**, grâce à son adresse HTTPS publique. Aucun hébergement à configurer, photos sur disque, e-mails dans Mailpit. Il faut lancer le Codespace avant la démo.
2. **Pilote réel** (si un refuge veut l'essayer en autonomie) : choix d'un **hébergement gratuit à ce moment-là**, selon les offres en vigueur. Pistes identifiées en novembre 2026, à revérifier :
   - API (image Docker) : Render (offre gratuite, mise en veille après 15 min d'inactivité, réveil en 30 à 60 s) ;
   - PostgreSQL + PostGIS : Supabase ou Neon ;
   - photos : stockage compatible S3 (Supabase Storage, par exemple) ;
   - interface : Vercel, Netlify ou Cloudflare Pages ;
   - e-mails : Brevo ou Resend.

La **portabilité** est assurée par trois choix : API livrée en image Docker, PostgreSQL standard, stockage via Flysystem.

## 13. Découpage en étapes

On commence par un **squelette qui marche** (la chaîne complète sur une fonctionnalité minuscule), puis on ajoute les fonctionnalités **une par une, de bout en bout**. Chaque étape comprend plusieurs pull requests.

| # | Étape | Contenu |
|---|---|---|
| **0** | Socle | Dépôt GitHub, Dev Container et Codespaces, projet API Platform, interface Vite + React, PostgreSQL + PostGIS et Mailpit, `CLAUDE.md`, intégration continue minimale, une page qui interroge l'API, un premier test Playwright |
| **1** | Comptes | Inscription, connexion JWT, rôles, vérification de l'e-mail, mot de passe oublié |
| **2** | Refuges et admin | Inscription d'un refuge, géocodage, espace admin (validation, refus avec motif) |
| **3** | Fiches animaux | Création et modification, photos (envoi et redimensionnement), critères de tri. Premières données de démonstration. |
| **4** | Profil adoptant | Champs, indice de complétude, localisation GPS ou adresse, rayon |
| **5** | Découverte et swipe | Recherche par distance, pile de cartes, swipe animé, règle de réapparition |
| **6** | Candidatures et match | Critères automatiques, acceptation automatique, grille côté refuge, « Mes likes », retrait d'un like |
| **7** | Messagerie | Conversations, messages texte et photo, lecture seule déduite, rétractation, badge non lu |
| **8** | Cycle de vie | Réservation, levée, adoption, adoption directe, avec leurs effets |
| **9** | Notifications | E-mails, push, installation de la PWA, traitements en arrière-plan |
| **10** | Préparation de la démo | Données réalistes avec photos libres de droits, finitions, scénarios Artillery, démo depuis Codespaces |

- **Après l'étape 6**, le cœur de l'application (swipe et match) fonctionne : c'est le bon moment pour **montrer l'application à un premier refuge** et recueillir ses retours.
- L'ordre des étapes 7, 8 et 9 reste ajustable.
- Pas de maquettes préalables : les écrans sont conçus directement dans le code, étape par étape.

## 14. Questions ouvertes techniques

1. **Versions exactes** de Symfony (LTS), API Platform et PHP : à fixer à l'étape 0.
2. **Hébergement du pilote** : à choisir le moment venu (voir §12).
3. **Service d'envoi d'e-mails** du pilote : Brevo ou Resend.
4. **Nom de domaine** : il permettrait de passer le jeton de rafraîchissement en cookie `HttpOnly` (environ 10 € par an, donc exclu pour l'instant).
5. **Hébergement permanent pour la vitrine du CV** : un recruteur voudra un lien de démo toujours accessible, ce que Codespaces ne permet pas. Faut-il avancer l'hébergement gratuit permanent sans attendre un pilote réel ? À discuter vers l'étape 6.
