# Task Management

Ce projet est une API de gestion des utilisateurs et des tâches construite avec AdonisJS. Elle permet l'authentification par OTP, la gestion des utilisateurs, des tâches, des rôles et des permissions.

## 🚀 Fonctionnalités principales
- Authentification via OTP
- CRUD pour la gestion des utilisateurs
- Assignation et gestion des tâches
- Filtrage des tâches en retard
- Gestion des rôles et des permissions
- Gestion des groupes et des tags de tâches
- Middleware de sécurité pour l'accès administrateur

## 📦 Installation

1. Cloner le projet
    ```bash
    git clone https://github.com/ton-utilisateur/ton-projet.git
    cd ton-projet
    ```

2. Installer les dépendances
    ```bash
    npm install
    ```

3. Configurer les variables d'environnement
    ```bash
    cp .env.example .env
    # Modifier .env avec votre configuration (DB, mail, etc.)
    ```

4. Lancer les migrations
    ```bash
    node ace migration:run
    ```

5. Démarrer l'application
    ```bash
    node ace serve --watch
    ```

## 🔐 Authentification
### Envoi d'un OTP pour se connecter
`POST /auth/login` — Envoie un OTP à l'adresse e-mail de l'utilisateur.

### Validation de l'OTP
`POST /auth/confirmLogin` — Valide l'OTP.

### Utilisateur authentifié
`GET /auth/me` — Récupère les informations de l'utilisateur actuellement connecté.

## 👥 Utilisateurs

### Liste des utilisateurs
`GET /auth/admin/users` — Récupère la liste des utilisateurs (admin uniquement).

### Ajouter un utilisateur
`POST /auth/admin/users` — Crée un utilisateur (admin uniquement).

### Modifier un utilisateur
`PUT /auth/admin/users/:id` — Modifie un utilisateur.

### Supprimer un utilisateur
`DELETE /auth/admin/users/:id` — Supprime un utilisateur.

### Activer/Désactiver un utilisateur
`PUT /auth/admin/change_status_user/:userId` — Active ou désactive un utilisateur.

## 📌 Tâches

### Ajouter une tâche
`POST /auth/planification/tasks/add_task` — Crée une nouvelle tâche.

### Liste des tâches
`GET /auth/planification/tasks/list_tasks` — Liste toutes les tâches.

### Modifier une tâche
`PUT /auth/planification/tasks/update_task/:id` — Met à jour une tâche spécifique.

### Supprimer une tâche
`DELETE /auth/planification/tasks/delete_task/:id` — Supprime une tâche spécifique.

### Filtrer les tâches en retard
`GET /auth/planification/tasks/getTasksInLate` — Récupère les tâches en retard.

## 🛠️ Technologies utilisées
- **AdonisJS 5**
- **Node.js**
- **TypeScript**
- **SQLite** (ou PostgreSQL/MySQL)
- **REST API**

## 👤 Auteur
- **Nom :** Adiaratou Oumy Fall
- **GitHub :** [Oumyf](https://github.com/Oumyf)
