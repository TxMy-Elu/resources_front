# Documentation API — (RE)SOURCES

**Version :** 3.0  
**Base URL :** `http://127.0.0.1:8000`  
**Format :** JSON (`Content-Type: application/json`)  
**Auth :** JWT via header `Authorization: Bearer <token>`

---

## Roles

| Constante Symfony     | Libelle             | Niveau |
|-----------------------|---------------------|--------|
| `ROLE_CONNECTED`      | Utilisateur connecte | 1      |
| `ROLE_MODERATOR`      | Moderateur          | 2      |
| `ROLE_ADMIN`          | Administrateur      | 3      |
| `ROLE_SUPER_ADMIN`    | Super-administrateur| 4      |

> Chaque role herite des permissions du niveau inferieur.

---

## Format des erreurs

```json
{ "error": "Message d'erreur" }
```

---

## Statuts ressource

| Valeur       | Libelle      |
|--------------|--------------|
| `brouillon`  | Brouillon    |
| `en attente` | En attente de validation |
| `publie`     | Publie       |
| `suspendu`   | Suspendu     |

## Visibilite ressource

| Valeur    | Libelle           | Accepte aussi (frontend) |
|-----------|-------------------|--------------------------|
| `publie`  | Public            | `public`                 |
| `partage` | Partage par lien  | `partage`                |
| `private` | Prive             | `private`, `prive`       |

---

## 1. Authentification

### `POST /api/auth/register`
Inscription — acces public.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "Jean Dupont"
}
```

**Reponse `201` :**
```json
{
  "message": "Utilisateur créé avec succès",
  "id": 12,
  "token": "<jwt>"
}
```

**Erreurs :** `400` champs manquants / email deja utilise · `500` erreur JWT

---

### `POST /api/auth/login`
Connexion — acces public.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Reponse `200` :**
```json
{
  "token": "<jwt>",
  "user": {
    "id": 12,
    "email": "user@example.com",
    "name": "Jean Dupont",
    "role": "ROLE_CONNECTED"
  }
}
```

**Erreurs :** `400` champs manquants · `401` identifiants invalides · `403` compte suspendu · `500` erreur JWT

---

### `POST /api/auth/refresh`
Renouvellement du JWT — `ROLE_CONNECTED`.

**Reponse `200` :**
```json
{
  "token": "<jwt>",
  "expiresIn": 3600
}
```

---

### `POST /api/auth/forgot-password`
Demande de reinitialisation — acces public.

**Body :**
```json
{ "email": "user@example.com" }
```

**Reponse `200` (toujours, par securite) :**
```json
{ "message": "Si cet email existe, un lien de réinitialisation a été envoyé" }
```

---

### `POST /api/auth/reset-password`
Reinitialisation du mot de passe — acces public.

**Body :**
```json
{
  "token": "<reset_token>",
  "password": "NewPassword123!",
  "password_confirm": "NewPassword123!"
}
```

**Reponse `200` :**
```json
{ "message": "Mot de passe réinitialisé avec succès" }
```

**Erreurs :** `400` champs manquants / mots de passe differents / token invalide ou expire

---

### `POST /api/logout`
Deconnexion logique (stateless) — `ROLE_CONNECTED`.

**Reponse `200` :**
```json
{ "message": "Déconnexion réussie" }
```

---

### `GET /api/me`
Profil de l'utilisateur connecte + stats — `ROLE_CONNECTED`.

**Reponse `200` :**
```json
{
  "id": 12,
  "email": "user@example.com",
  "firstname": "Jean",
  "lastname": "Dupont",
  "roles": ["ROLE_CONNECTED"],
  "joinDate": "2025-01-15",
  "resourcesCreated": 8,
  "resourcesSaved": 3,
  "avgRating": 4.3
}
```

> `avgRating` est `null` si aucun commentaire n'a ete recu sur les ressources de l'utilisateur.

**Erreurs :** `401` non authentifie

---

## 2. Utilisateurs

### `GET /api/users`
Liste paginee des utilisateurs — `ROLE_ADMIN`.

**Query params :**

| Param    | Type   | Description                          |
|----------|--------|--------------------------------------|
| `page`   | int    | Page (defaut : 1)                    |
| `limit`  | int    | Par page, max 50 (defaut : 50)       |
| `search` | string | Recherche sur email / prenom / nom   |
| `role`   | string | Filtre par role (`ROLE_ADMIN`, etc.) |
| `status` | string | `Actif` ou `Inactif`                 |

**Reponse `200` :**
```json
{
  "data": [
    {
      "id": 12,
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "role": "ROLE_CONNECTED",
      "status": "Actif",
      "joinDate": "2025-01-15",
      "resourceCount": 0,
      "lastLogin": null
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 50,
    "pages": 1
  }
}
```

---

### `GET /api/users/{id}`
Detail d'un utilisateur — self ou `ROLE_ADMIN`.

**Reponse `200` :**
```json
{
  "id": 12,
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "role": "ROLE_CONNECTED",
  "status": "Actif",
  "joinDate": "2025-01-15",
  "resourceCount": 0,
  "bio": "",
  "avatar": "",
  "lastLogin": null
}
```

**Erreurs :** `403` acces refuse · `404` introuvable

---

### `PUT /api/users/{id}`
Modification d'un utilisateur — self ou `ROLE_ADMIN`.

**Body (tous les champs optionnels) :**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "status": "Actif"
}
```

**Reponse `200` :**
```json
{ "message": "Utilisateur mis à jour" }
```

**Erreurs :** `400` email deja utilise · `403` acces refuse · `404` introuvable

---

### `DELETE /api/users/{id}`
Suppression definitive (RGPD) — `ROLE_SUPER_ADMIN`.

Supprime en cascade : tokens de reinitialisation, commentaires, ressources et leurs commentaires.

**Reponse `200` :**
```json
{ "message": "Utilisateur supprimé" }
```

---

## 3. Categories

### `GET /api/categories`
Liste toutes les categories — public.

**Reponse `200` :**
```json
[
  { "id": 1, "name": "Famille", "description": "Ressources liées à la famille" }
]
```

---

### `POST /api/categories`
Creation d'une categorie — `ROLE_ADMIN`.

**Body :**
```json
{ "name": "Famille", "description": "Ressources liées à la famille" }
```

**Reponse `201` :**
```json
{ "message": "Catégorie crée avec succès", "id": 1 }
```

**Erreurs :** `400` nom manquant · `403` acces refuse

---

### `PUT /api/categories/{id}`
Modification d'une categorie — `ROLE_ADMIN`.

**Body :**
```json
{ "name": "Nouveau nom", "description": "Nouvelle description" }
```

**Reponse `200` :**
```json
{ "message": "Catégorie mise à jour" }
```

**Erreurs :** `403` acces refuse · `404` introuvable

---

### `DELETE /api/categories/{id}`
Suppression d'une categorie — `ROLE_SUPER_ADMIN`.

**Reponse `200` :**
```json
{ "message": "Catégorie supprimée" }
```

---

## 4. Ressources

### `GET /api/resources`
Liste les ressources publiees et publiques — public.

**Query params :**

| Param      | Type   | Description                                               |
|------------|--------|-----------------------------------------------------------|
| `category` | string | Filtrer par nom de categorie                              |
| `type`     | string | `article` `video` `podcast` `activite` `jeu`             |
| `sort`     | string | `created_at` (defaut) · `titre` · `date_publication`     |
| `order`    | string | `DESC` (defaut) · `ASC`                                  |

**Reponse `200` :**
```json
[
  {
    "id": 1,
    "titre": "Mieux communiquer en famille",
    "description": "Guide pratique...",
    "type_ressource": "article",
    "statut": "publie",
    "visibilite": "publie",
    "created_at": "2025-01-15 10:30:00",
    "datePublication": "2025-01-16 09:00:00",
    "createur": "Jean Dupont",
    "category": "Famille"
  }
]
```

---

### `GET /api/resources/trending`
Ressources recentes publiees — public.

**Query params :**

| Param    | Type   | Description                      |
|----------|--------|----------------------------------|
| `limit`  | int    | Nombre de resultats, max 10      |
| `period` | string | `week` (defaut) — non filtre actuellement |

**Reponse `200` :**
```json
{
  "data": [
    { "id": 1, "titre": "...", "description": "..." }
  ]
}
```

---

### `GET /api/resources/mine`
Ressources de l'utilisateur connecte — `ROLE_CONNECTED`.

**Reponse `200` :**
```json
[
  {
    "id": 1,
    "titre": "Ma ressource",
    "description": "...",
    "contenu": "...",
    "type_ressource": "article",
    "statut": "en attente",
    "visibilite": "publie",
    "shareToken": null,
    "created_at": "2025-01-15 10:30:00",
    "category": "Famille",
    "categoryId": 1,
    "lien": null,
    "media": null,
    "views": 42
  }
]
```

> `shareToken` est rempli uniquement si `visibilite = partage`.
> `views` = nombre de consultations enregistrees dans `log_action`.

---

### `GET /api/resources/admin`
Toutes les ressources sans filtre — `ROLE_ADMIN`.

**Reponse `200` :** tableau avec les memes champs que `/mine` + `datePublication` + `createur`.

---

### `GET /api/resources/share/{token}`
Acces a une ressource partagee par lien prive — public.

**Reponse `200` :**
```json
{
  "id": 1,
  "titre": "...",
  "description": "...",
  "contenu": "...",
  "type": "article",
  "type_ressource": "article",
  "statut": "en attente",
  "visibilite": "partage",
  "created_at": "2025-01-15 10:30:00",
  "createur": "Jean Dupont",
  "category": "Famille",
  "lien": null,
  "media": null
}
```

**Erreurs :** `404` token invalide / ressource non partagee

---

### `GET /api/resources/{id}`
Detail d'une ressource — public (sauf privee).

> Les ressources privees (`visibilite = private`) necessitent d'etre l'auteur.
> La consultation est loguee dans `log_action` si l'utilisateur est connecte.

**Reponse `200` :**
```json
{
  "id": 1,
  "titre": "...",
  "description": "...",
  "contenu": "...",
  "type": "article",
  "type_ressource": "article",
  "statut": "publie",
  "visibilite": "publie",
  "shareToken": null,
  "created_at": "2025-01-15 10:30:00",
  "dateCreation": "2025-01-15 10:30:00",
  "createur": "Jean Dupont",
  "category": "Famille",
  "categoryId": 1,
  "lien": null,
  "media": null
}
```

**Erreurs :** `403` acces refuse (prive) · `404` introuvable

---

### `POST /api/resources`
Creation d'une ressource — `ROLE_CONNECTED`.

> Toute creation passe en `en attente` quel que soit la visibilite.
> Seul un admin peut forcer un statut different via le champ `statut`.

**Body :**
```json
{
  "titre": "Mieux communiquer en famille",
  "description": "Guide pratique...",
  "contenu": "Contenu complet...",
  "type": "article",
  "visibilite": "public",
  "categoryId": 1,
  "lien": "https://example.com",
  "statut": "publie"
}
```

> `visibilite` accepte : `public` · `partage` · `private` · `prive`
> `statut` : ignore si non-admin
> `lien` : URL externe pour les types article/video/podcast ; pour `visibilite=partage`, le token est genere automatiquement et remplace `lien`

**Reponse `201` :**
```json
{
  "message": "Ressource crée avec succès",
  "id": 42,
  "statut": "en attente",
  "shareToken": null
}
```

> `shareToken` est rempli si `visibilite = partage`.

**Erreurs :** `400` titre manquant · `401` non authentifie

---

### `PUT /api/resources/{id}`
Modification d'une ressource — createur ou `ROLE_ADMIN`.

> Toute modification par un non-admin repasse en `en attente`.
> Un admin peut forcer un statut via le champ `statut`.
> Changer de `partage` vers autre visibilite efface le token (et vice-versa).

**Body (tous les champs optionnels) :**
```json
{
  "titre": "Nouveau titre",
  "description": "...",
  "contenu": "...",
  "type": "video",
  "visibilite": "public",
  "categoryId": 2,
  "lien": "https://example.com",
  "statut": "publie"
}
```

**Reponse `200` :**
```json
{
  "message": "Ressource mise à jour",
  "categoryId": 2,
  "category": "Bien-etre",
  "statut": "en attente",
  "shareToken": null
}
```

**Erreurs :** `403` acces refuse · `404` introuvable

---

### `DELETE /api/resources/{id}`
Suppression definitive — `ROLE_SUPER_ADMIN`.

**Reponse `200` :**
```json
{ "message": "Ressource supprimée" }
```

---

### `GET /api/resources/{id}/comments`
Commentaires d'une ressource — public.

**Query params :**

| Param   | Type | Description               |
|---------|------|---------------------------|
| `page`  | int  | Page (defaut : 1)         |
| `limit` | int  | Par page, max 20 (defaut : 20) |

**Reponse `200` :**
```json
{
  "data": [
    {
      "id": 5,
      "author": "Jean Dupont",
      "content": "Très utile !",
      "rating": 5,
      "createdAt": "2025-02-10 14:22:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "pages": 1
  }
}
```

---

### `POST /api/resources/{id}/comments`
Ajout d'un commentaire — `ROLE_CONNECTED`.

**Body :**
```json
{
  "content": "Très utile !",
  "rating": 5
}
```

> `rating` : entier de 1 a 5 (defaut : 5 si omis)

**Reponse `201` :**
```json
{ "message": "Commentaire créé", "id": 5 }
```

**Erreurs :** `400` contenu manquant · `404` ressource introuvable

---

### `POST /api/resources/{id}/save`
Ajout aux favoris utilisateur — `ROLE_CONNECTED`.

**Body :** vide `{}`

**Reponse `200` :**
```json
{ "message": "Ressource sauvegardée", "saved": true }
```

**Erreurs :** `404` ressource introuvable · `409` deja sauvegardee

---

## 5. Participation

> La participation enregistre la premiere consultation d'une ressource par un utilisateur.
> Elle gere egalement la mise de cote (bookmark).

### `GET /api/resources/{id}/participation`
Participation de l'utilisateur connecte — `ROLE_CONNECTED`.

**Reponse `200` (non participe) :**
```json
{ "participated": false }
```

**Reponse `200` (participe) :**
```json
{
  "participated": true,
  "date_participation": "2025-02-10 14:00:00",
  "mise_cote": false,
  "invite": false
}
```

---

### `POST /api/resources/{id}/participation`
Enregistrer ou mettre a jour la participation — `ROLE_CONNECTED`.

**Body (optionnel) :**
```json
{ "mise_cote": true }
```

**Reponse `201` (premiere participation) :**
```json
{
  "message": "Participation enregistrée",
  "mise_cote": false,
  "date_participation": "2025-02-10 14:00:00"
}
```

**Reponse `200` (mise a jour) :**
```json
{
  "message": "Participation mise à jour",
  "mise_cote": true,
  "date_participation": "2025-02-10 14:00:00"
}
```

---

### `GET /api/users/me/participations`
Toutes les participations de l'utilisateur connecte — `ROLE_CONNECTED`.

**Reponse `200` :**
```json
[
  {
    "ressource_id": 1,
    "titre": "Mieux communiquer en famille",
    "date_participation": "2025-02-10 14:00:00",
    "mise_cote": true
  }
]
```

---

## 6. Progression

> La progression indique si un utilisateur est en cours (`false`) ou a termine (`true`) une ressource.

### `GET /api/resources/{id}/progression`
Progression de l'utilisateur connecte — `ROLE_CONNECTED`.

**Reponse `200` (non commence) :**
```json
{ "started": false, "completed": false }
```

**Reponse `200` (en cours ou termine) :**
```json
{
  "started": true,
  "completed": false,
  "updated_at": "2025-02-10 15:00:00"
}
```

---

### `POST /api/resources/{id}/progression`
Creer ou mettre a jour la progression — `ROLE_CONNECTED`.

**Body :**
```json
{ "statut": true }
```

> `statut` : `false` = en cours · `true` = termine

**Reponse `201` (creation) :**
```json
{ "message": "Progression créée", "completed": true }
```

**Reponse `200` (mise a jour) :**
```json
{ "message": "Progression mise à jour", "completed": true }
```

**Erreurs :** `400` champ `statut` manquant · `404` ressource introuvable

---

### `GET /api/users/me/progressions`
Toutes les progressions de l'utilisateur connecte — `ROLE_CONNECTED`.

**Reponse `200` :**
```json
[
  {
    "ressource_id": 1,
    "titre": "Mieux communiquer en famille",
    "completed": true,
    "updated_at": "2025-02-10 15:00:00"
  }
]
```

---

## 7. Moderation

### `GET /api/moderation/pending`
Ressources en attente de validation — `ROLE_ADMIN`.

**Reponse `200` :**
```json
[
  {
    "id": 5,
    "titre": "Ma ressource",
    "createur": "Jean Dupont",
    "dateCreation": "2025-02-10 14:00:00"
  }
]
```

---

### `POST /api/moderation/validate/{id}`
Valider et publier une ressource — `ROLE_ADMIN`.

> Passe le statut a `publie`, met a jour `date_publication` et `est_verifie = true`.

**Body :** vide

**Reponse `200` :**
```json
{ "message": "Ressource publiée avec succès" }
```

**Erreurs :** `404` introuvable

---

### `POST /api/moderation/suspend/{id}`
Suspendre une ressource — `ROLE_ADMIN`.

> Passe le statut a `suspendu`.

**Body :** vide

**Reponse `200` :**
```json
{ "message": "Ressource suspendue avec succès" }
```

**Erreurs :** `404` introuvable

---

## 8. Recherche

### `GET /api/search`
Recherche dans les ressources publiees — public.

**Query params :**

| Param      | Type   | Description                                          |
|------------|--------|------------------------------------------------------|
| `q`        | string | Recherche dans titre / description / contenu         |
| `category` | string | Filtrer par nom de categorie                         |
| `type`     | string | `article` `video` `podcast` `activite` `jeu`        |
| `sort`     | string | `created_at` (defaut) · `titre` · `date_publication` |

**Reponse `200` :**
```json
{
  "results": [
    {
      "id": 1,
      "titre": "Mieux communiquer en famille",
      "description": "...",
      "type": "article",
      "category": "Famille"
    }
  ],
  "count": 1
}
```

---

## 9. Contact

### `POST /api/contact`
Envoi d'un message de contact — public.

**Body :**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "message": "Bonjour, j'ai une question...",
  "subject": "Question",
  "category": "general"
}
```

**Reponse `201` :**
```json
{
  "message": "Message reçu avec succès",
  "ticketId": "TICKET-abc123"
}
```

**Erreurs :** `400` champs `name`, `email` ou `message` manquants

---

## 10. Administration

### `GET /api/admin/stats`
Statistiques globales de la plateforme — `ROLE_ADMIN`.

**Reponse `200` :**
```json
{
  "users": {
    "total": 150,
    "active": 142,
    "new": 12
  },
  "resources": {
    "total": 320,
    "published": 280,
    "pending": 8,
    "suspended": 5
  },
  "activities": {
    "thisMonth": 1240,
    "thisWeek": 310
  }
}
```

> `users.new` = inscrits depuis le 1er du mois courant.
> `activities.*` = nombre d'entrees dans `log_action` sur la periode.

---

### `GET /api/admin/logs/connexion`
Logs de connexion pagines — `ROLE_ADMIN`.

**Query params :** `page`, `limit` (max 100), `statut`, `userId`

**Reponse `200` :**
```json
{
  "data": [
    {
      "id": 1,
      "statut": "success",
      "ip_address": "127.0.0.1",
      "date_connexion": "2025-02-10 14:00:00",
      "user": { "id": 12, "email": "jean@example.com", "name": "Jean Dupont" }
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 320, "pages": 7 }
}
```

Valeurs `statut` : `success` · `failure` · `logout` · `suspended`

---

### `GET /api/admin/logs/actions`
Logs d'action utilisateur pagines — `ROLE_ADMIN`.

**Query params :** `page`, `limit` (max 100), `action`, `userId`

**Reponse `200` :**
```json
{
  "data": [
    {
      "id": 1,
      "action": "resource_view",
      "details": "Consultation ressource #5...",
      "ip_address": "127.0.0.1",
      "date_action": "2025-02-10 14:05:00",
      "user": { "id": 12, "email": "jean@example.com", "name": "Jean Dupont" },
      "ressource": { "id": 5, "titre": "Mieux communiquer en famille" }
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 1500, "pages": 30 }
}
```

Actions possibles :

| Action                    | Declencheur                          |
|---------------------------|--------------------------------------|
| `register`                | Inscription                          |
| `password_reset_request`  | Demande de reinitialisation          |
| `password_reset`          | Mot de passe reinitialise            |
| `resource_view`           | Consultation d'une ressource         |
| `resource_create`         | Creation d'une ressource             |
| `resource_update`         | Modification d'une ressource         |
| `resource_delete`         | Suppression d'une ressource          |
| `resource_save`           | Ajout aux favoris                    |
| `resource_unsave`         | Retrait des favoris                  |
| `comment_add`             | Ajout d'un commentaire               |
| `resource_participate`    | Premiere participation               |
| `resource_progress`       | Mise a jour de progression           |
| `user_update`             | Modification de profil               |
| `user_delete`             | Suppression de compte                |
| `contact`                 | Message de contact envoye            |
| `moderate_validate`       | Ressource validee par un admin       |
| `moderate_suspend`        | Ressource suspendue par un admin     |
| `user_promote`            | Role utilisateur modifie             |
| `user_suspend`            | Compte utilisateur suspendu          |
| `user_activate`           | Compte utilisateur reactivee         |

---

### `GET /api/admin/logs/messages`
Logs d'action sur les commentaires — `ROLE_ADMIN`.

**Query params :** `page`, `limit` (max 100), `action`

**Reponse `200` :**
```json
{
  "data": [
    {
      "id": 1,
      "action": "message_send",
      "details": "Commentaire #5 ajouté...",
      "ip_address": "127.0.0.1",
      "date_action": "2025-02-10 14:10:00",
      "user": { "id": 12, "email": "jean@example.com", "name": "Jean Dupont" },
      "comment_id": 5
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 80, "pages": 2 }
}
```

---

### `GET /api/admin/logs/systeme`
Logs techniques — `ROLE_SUPER_ADMIN`.

**Query params :** `page`, `limit` (max 100), `niveau`

**Reponse `200` :**
```json
{
  "data": [
    {
      "id": 1,
      "niveau": "error",
      "message": "Erreur JWT à la connexion",
      "contexte": "AuthController::login",
      "date_log": "2025-02-10 14:00:00"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 12, "pages": 1 }
}
```

Niveaux : `info` · `warning` · `error` · `critical`

---

### `PUT /api/admin/users/{id}/promote`
Modifier le role d'un utilisateur — `ROLE_SUPER_ADMIN`.

**Body :**
```json
{ "role": "ROLE_ADMIN" }
```

Roles autorises : `ROLE_CONNECTED` · `ROLE_MODERATOR` · `ROLE_ADMIN` · `ROLE_SUPER_ADMIN`

**Reponse `200` :**
```json
{ "message": "Rôle mis à jour avec succès" }
```

**Erreurs :** `400` role invalide · `404` utilisateur introuvable

---

### `PUT /api/admin/users/{id}/status`
Activer ou suspendre un compte — `ROLE_ADMIN`.

**Body :**
```json
{ "avaible": false }
```

> `true` = compte actif · `false` = compte suspendu

**Reponse `200` :**
```json
{ "message": "Compte suspendu avec succès", "avaible": false }
```

**Erreurs :** `400` champ `avaible` manquant · `404` utilisateur introuvable

---

## 11. Documentation OpenAPI

| Route           | Description                   |
|-----------------|-------------------------------|
| `GET /api/doc`  | Interface Swagger UI          |
| `GET /api/doc.json` | Schema JSON OpenAPI       |

---

## Recapitulatif des routes

| Methode | Route                                  | Auth          |
|---------|----------------------------------------|---------------|
| POST    | /api/auth/register                     | public        |
| POST    | /api/auth/login                        | public        |
| POST    | /api/auth/refresh                      | JWT           |
| POST    | /api/auth/forgot-password              | public        |
| POST    | /api/auth/reset-password               | public        |
| POST    | /api/logout                            | JWT           |
| GET     | /api/me                                | JWT           |
| GET     | /api/users                             | ADMIN         |
| GET     | /api/users/{id}                        | self / ADMIN  |
| PUT     | /api/users/{id}                        | self / ADMIN  |
| DELETE  | /api/users/{id}                        | SUPER_ADMIN   |
| GET     | /api/categories                        | public        |
| POST    | /api/categories                        | ADMIN         |
| PUT     | /api/categories/{id}                   | ADMIN         |
| DELETE  | /api/categories/{id}                   | SUPER_ADMIN   |
| GET     | /api/resources                         | public        |
| GET     | /api/resources/trending                | public        |
| GET     | /api/resources/mine                    | CONNECTED     |
| GET     | /api/resources/admin                   | ADMIN         |
| GET     | /api/resources/share/{token}           | public        |
| GET     | /api/resources/{id}                    | public*       |
| POST    | /api/resources                         | CONNECTED     |
| PUT     | /api/resources/{id}                    | createur / ADMIN |
| DELETE  | /api/resources/{id}                    | SUPER_ADMIN   |
| GET     | /api/resources/{id}/comments           | public        |
| POST    | /api/resources/{id}/comments           | CONNECTED     |
| POST    | /api/resources/{id}/save               | CONNECTED     |
| GET     | /api/resources/{id}/participation      | CONNECTED     |
| POST    | /api/resources/{id}/participation      | CONNECTED     |
| GET     | /api/users/me/participations           | CONNECTED     |
| GET     | /api/resources/{id}/progression        | CONNECTED     |
| POST    | /api/resources/{id}/progression        | CONNECTED     |
| GET     | /api/users/me/progressions             | CONNECTED     |
| GET     | /api/moderation/pending                | ADMIN         |
| POST    | /api/moderation/validate/{id}          | ADMIN         |
| POST    | /api/moderation/suspend/{id}           | ADMIN         |
| GET     | /api/search                            | public        |
| POST    | /api/contact                           | public        |
| GET     | /api/admin/stats                       | ADMIN         |
| GET     | /api/admin/logs/connexion              | ADMIN         |
| GET     | /api/admin/logs/actions                | ADMIN         |
| GET     | /api/admin/logs/messages               | ADMIN         |
| GET     | /api/admin/logs/systeme                | SUPER_ADMIN   |
| PUT     | /api/admin/users/{id}/promote          | SUPER_ADMIN   |
| PUT     | /api/admin/users/{id}/status           | ADMIN         |

> \* Les ressources privees (`visibilite = private`) necessitent d'etre l'auteur authentifie.
