# Animatch

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
| Environnement | Dev Container, GitHub Codespaces, GitHub Actions |

## Documentation

- [Cadrage métier](docs/cadrage.md) : acteurs, règles de candidature, cycle
  de vie d'un animal…
- [Architecture technique](docs/architecture.md) : choix techniques, modèle de
  données, stratégie de tests, découpage en étapes.

## Avancement

Le projet avance par étapes, chacune livrée en petites pull requests
(voir [le découpage](docs/architecture.md#13-découpage-en-étapes)).

- [ ] Étape 0 — Socle (en cours)
- [ ] Étapes 1 à 10 — Fonctionnalités

## Installation

À venir avec le Dev Container (étape 0).

## Méthode de travail

Ce projet est développé avec l'assistance de
[Claude Code](https://claude.com/claude-code). Chaque modification est
expliquée, débattue puis validée avant d'être appliquée (voir
[CLAUDE.md](CLAUDE.md)).
