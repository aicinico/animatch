# Animatch

[![CI](https://github.com/aicinico/animatch/actions/workflows/ci.yml/badge.svg)](https://github.com/aicinico/animatch/actions/workflows/ci.yml)
· [Rapport des tests de bout en bout](https://aicinico.github.io/animatch/)

> Nom provisoire · Projet d'apprentissage · **En cours de développement**

Animatch est une application « à la Tinder » pour l'adoption de chats et de
chiens : l'adoptant fait défiler les animaux des refuges proches de chez lui,
swipe à droite ceux qui l'intéressent, et le refuge accepte ou refuse la
candidature. Une candidature acceptée ouvre une conversation pour organiser
une rencontre.

## Pourquoi ce projet

- **Apprendre** le développement web de bout en bout, en partant de zéro.
- **Montrer une démarche QA** : stratégie de tests ciblée sur les zones
  critiques (règles métier, droits d'accès, cycle de vie), tests de bout en
  bout Playwright, tests d'API, tests de charge.
- **Présenter une démo** à des refuges pour recueillir leurs retours.

## Pile technique (prévue)

| Couche | Outils |
|---|---|
| Interface | React, TypeScript, Vite (application web installable) |
| API | Symfony, API Platform (PHP), FrankenPHP |
| Base de données | PostgreSQL + PostGIS |
| Tests | PHPUnit, Vitest, Playwright, Bruno, Artillery |
| Qualité | PHPStan, PHP-CS-Fixer, ESLint, Prettier |
| Environnement | Dev Container, GitHub Codespaces, GitHub Actions |

## Documentation

- [Cadrage métier](docs/cadrage.md) : acteurs, règles de candidature, cycle
  de vie d'un animal…
- [Architecture technique](docs/architecture.md) : choix techniques, modèle de
  données, stratégie de tests, découpage en étapes.

## Avancement

Le projet avance par étapes, chacune livrée en petites pull requests
(voir [le découpage](docs/architecture.md#13-découpage-en-étapes)).

- [x] Étape 0 — Socle
- [ ] Étapes 1 à 10 — Fonctionnalités

## Installation

Le projet se développe dans un **Dev Container** (voir `.devcontainer/`) :
rien d'autre à installer que le navigateur.

**Avec GitHub Codespaces (recommandé)**

1. Sur la page GitHub du dépôt : bouton **Code** → onglet **Codespaces** →
   **Create codespace on main**.
2. Attendre la construction de l'environnement (quelques minutes la première
   fois).

**En local (solution de secours)**

Prérequis : Docker et VS Code avec l'extension Dev Containers. Cloner le
dépôt, l'ouvrir dans VS Code, puis lancer la commande
**Dev Containers: Reopen in Container**.

## Lancer l'API

```bash
make start-api
```

| Adresse | Contenu |
|---|---|
| `https://localhost/api` | Documentation interactive de l'API |
| `https://localhost/health` | État de l'API et de la base de données |
| `http://localhost:8025` | Mailpit : e-mails envoyés en développement |

Dans Codespaces, ouvrir ces adresses depuis l'onglet **Ports**. Le port 443
doit être passé en protocole **HTTPS** (clic droit → Change Port Protocol).

Pour arrêter : `make stop-api`.

## Lancer les tests

Une seule commande démarre l'API si besoin, puis lance tous les tests :

```bash
make test-all
```

| Commande | Effet |
|---|---|
| `make test-all` | Tous les tests : API, puis bout en bout |
| `make test-api` | Tests de l'API (PHPUnit) |
| `make test-e2e` | Tests de bout en bout (Playwright : API, Chrome, Safari, iPhone) |

L'interface est démarrée automatiquement par Playwright. Si elle tourne déjà
(`npm run dev` dans `web/`), Playwright l'utilise.

Les résultats de la dernière version sont aussi publiés dans le
[rapport Playwright](https://aicinico.github.io/animatch/).

## Explorer l'API avec Bruno

La collection [Bruno](https://www.usebruno.com/) est dans `bruno/`, au format
YAML. L'extension Bruno de VS Code est installée avec le Dev Container.

1. Démarrer l'API (voir ci-dessus).
2. Dans VS Code, ouvrir l'extension Bruno, puis **+** → ouvrir une collection
   → dossier `bruno/`.
3. Sélectionner l'environnement **local**.
4. Lancer une requête, par exemple **Health**.

## Lancer l'interface

```bash
cd web
npm run dev
```

L'interface est disponible sur `http://localhost:5173`. Dans Codespaces,
l'ouvrir depuis l'onglet **Ports**. La page se met à jour automatiquement à
chaque modification du code.

Pour arrêter : `Ctrl+C` dans le terminal.

## Qualité du code

Chaque pull request est vérifiée par l'intégration continue (GitHub Actions) :
mise en forme, analyse statique et tests. Elle ne peut être fusionnée que si
tout est vert.

| Code | Mise en forme | Analyse statique |
|---|---|---|
| TypeScript (`web/`, `e2e/`) | `npm run format`, automatique à l'enregistrement dans VS Code | ESLint, compilation TypeScript |
| PHP (`api/`) | `docker compose exec php vendor/bin/php-cs-fixer fix` | `docker compose exec php vendor/bin/phpstan analyse` |

## Méthode de travail

Ce projet est développé avec l'assistance de
[Claude Code](https://claude.com/claude-code). Chaque modification est
expliquée, débattue puis validée avant d'être appliquée (voir
[CLAUDE.md](CLAUDE.md)).
