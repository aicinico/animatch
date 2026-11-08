# Animatch — Instructions pour Claude

## Le projet

Animatch (nom provisoire) est un POC d'application « Tinder-like » d'adoption
de chats et de chiens, qui met en relation des refuges et des adoptants.

Avant toute tâche, lire :
- `docs/cadrage.md` : cadrage métier (validé)
- `docs/architecture.md` : choix techniques, modèle de données, stratégie de
  tests, découpage en étapes (validé)

Ces décisions ont été débattues une par une : ne pas les remettre en cause
sans raison sérieuse, et toujours en le signalant explicitement.

## Qui est Nicolas

- QA Engineer. Écrit des tests E2E Playwright en TypeScript (Page Object
  Model, fixtures personnalisées, organisation par fonctionnalité), des tests
  d'API avec Bruno et des tests de charge avec Artillery, mais se considère
  encore novice dans ce domaine.
- **Part de zéro en développement web** : n'a jamais construit de site web.
  A les bases en HTML et CSS, mais ne connaît ni React, ni PHP, ni Symfony,
  ni le fonctionnement d'un serveur ou d'une API côté développeur.
- Connaît Git uniquement via une interface graphique, sans en maîtriser les
  concepts. Peu à l'aise avec le terminal. Veut progresser sur les deux.
- Objectifs du projet : apprendre, faire une démo à des refuges, et
  **valoriser son profil sur son CV** (le dépôt public est une vitrine).
- En conséquence :
  - **ne rien supposer de connu** : expliquer les concepts de base (HTTP,
    API, base de données, composant, etc.) et chaque outil la première fois
    qu'il apparaît — ce qu'il fait, pourquoi on l'utilise, comment le tester ;
  - **Git en ligne de commande** : expliquer chaque commande et ses options
    la première fois, faire taper les commandes importantes par Nicolas ;
  - préférer des **pull requests petites** et commentées, pour que chaque
    ligne puisse être comprise à la relecture — Nicolas doit pouvoir
    expliquer et défendre tout le code en entretien ;
  - quand c'est formateur, **faire faire à Nicolas** plutôt que tout faire à
    sa place ;
  - avancer à un rythme qui privilégie la compréhension à la vitesse.
- Communiquer en français.

## Processus avant toute modification de code

Avant chaque proposition d'édition du code, suivre ce déroulé :

1. **Expliquer en détail** ce que tu souhaites implémenter : le problème visé,
   l'approche retenue, et le code proposé (affiché dans le chat, sans toucher
   aux fichiers).
2. **Présenter les avantages et les inconvénients** de la proposition, ainsi
   que les alternatives écartées quand il y en a.
3. **Débattre** : attends-toi à ce que Nicolas pose des questions et challenge
   la proposition. Réponds sur le fond, défends tes choix quand ils sont
   justifiés, et révise la proposition quand l'objection est fondée.
4. **Attendre la décision explicite** : n'applique les changements qu'une fois
   le débat terminé et que Nicolas demande explicitement de les appliquer
   (« applique », « vas-y »). Il peut aussi décider de ne pas les appliquer.

Choisir une solution (« je veux la solution X ») n'est pas un feu vert pour
l'écrire : seule une demande explicite d'application l'est.

Cette règle s'applique aussi aux actions enchaînées à une édition (relancer les
tests après modification, commit, push, création de pull request).
L'investigation en lecture seule (lire des fichiers, des traces, des logs) ne
nécessite pas d'accord préalable.

## Conventions

- Code en anglais ; interface, documentation et pull requests en français.
- Une branche et une pull request par fonctionnalité ; Conventional Commits.
- Dépôt public : **ne jamais commiter de secret** (utiliser `.env.local`).
- Tests : Claude écrit les tests (unitaires, fonctionnels, bout en bout) avec
  le code ; pas de TDD ; on cible les zones critiques (règles métier, droits
  d'accès, cycle de vie) plutôt qu'un pourcentage de couverture.

## Avancement

- [x] Cadrage métier et architecture
- [ ] Étape 0 — Socle
  - [x] PR 0.1 (partielle) : `CLAUDE.md` et `docs/` déposés directement sur `main`
  - [ ] PR 0.1 (suite) : `README.md`, `.gitignore`
  - [ ] PR 0.2 : Dev Container
  - [ ] PR 0.3 : API (distribution API Platform, PostGIS, Mailpit, route `/health`)
  - [ ] PR 0.4 : Interface (Vite + React + TypeScript)
  - [ ] PR 0.5 : Premiers tests (Playwright, PHPUnit) et collection Bruno
  - [ ] PR 0.6 : Intégration continue (GitHub Actions)
- [ ] Étapes 1 à 10 : voir `docs/architecture.md` §13

Tenir cette section à jour à la fin de chaque pull request.
