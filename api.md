# Documentation API - Resources

Version: 2.0
Base URL: `http://127.0.0.1:8000`

Cette documentation décrit les endpoints actuellement exposes par l'API Symfony.

## Authentification

- Authentification JWT via header:
  - `Authorization: Bearer <token>`
- Endpoints publics:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- Endpoint de deconnexion:
  - `POST /api/logout` (stateless, pas d'invalidation serveur)

## Format des erreurs

La plupart des erreurs retournent un JSON simple:

```json
{
  "error": "Message d'erreur"
}
```

## 1) Auth

### POST `/api/auth/register`
Cree un utilisateur (acces public).

- Body JSON requis:

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "Jean Dupont"
}
```

- Succes `201`:

```json
{
  "message": "Utilisateur créé avec succès",
  "id": 12,
  "token": "<jwt>"
}
```

- Erreurs:
  - `400` champs manquants / email deja utilise
  - `500` erreur de configuration JWT

### POST `/api/auth/login`
Connexion utilisateur (acces public).

- Body JSON:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

- Succes `200`:

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

- Erreurs:
  - `400` email/mot de passe manquant
  - `401` identifiants invalides
  - `500` erreur de configuration JWT

### POST `/api/auth/refresh`
Genere un nouveau JWT pour l'utilisateur authentifie.

- Header requis: `Authorization: Bearer <token>`
- Body: aucun
- Succes `200`:

```json
{
  "token": "<jwt>",
  "expiresIn": 3600
}
```

### POST `/api/auth/forgot-password`
Demande de reinitialisation de mot de passe.

- Body JSON:

```json
{
  "email": "user@example.com"
}
```

- Reponse `200` (toujours pour des raisons de securite):

```json
{
  "message": "Si cet email existe, un lien de réinitialisation a été envoyé"
}
```

### POST `/api/auth/reset-password`
Reinitialisation avec token.

- Body JSON:

```json
{
  "token": "reset_token",
  "password": "NewPassword123!",
  "password_confirm": "NewPassword123!"
}
```

- Succes `200`:

```json
{
  "message": "Mot de passe réinitialisé avec succès"
}
```

### POST `/api/logout`
Deconnexion logique.

- Succes `200`:

```json
{
  "message": "Déconnexion réussie"
}
```

### GET `/api/me`
Retourne le profil du user connecte.

- Header requis: `Authorization: Bearer <token>`

## 2) Utilisateurs

Base path: `/api/users`

- `GET /api/users` (ROLE_ADMIN)
  - Query params: `page`, `limit`, `search`, `role`, `status`
- `GET /api/users/{id}` (self ou ROLE_ADMIN)
- `PUT /api/users/{id}` (self ou ROLE_ADMIN)
- `DELETE /api/users/{id}` (ROLE_SUPER_ADMIN)

### Promotion role
- `PUT /api/admin/users/{id}/promote` (ROLE_SUPER_ADMIN)

Body:

```json
{
  "role": "ROLE_ADMIN"
}
```

Roles autorises: `ROLE_CONNECTED`, `ROLE_MODERATOR`, `ROLE_ADMIN`, `ROLE_SUPER_ADMIN`

## 3) Categories

Base path: `/api/categories`

- `GET /api/categories` (public)
- `POST /api/categories` (ROLE_ADMIN)
- `PUT /api/categories/{id}` (ROLE_ADMIN)
- `DELETE /api/categories/{id}` (ROLE_SUPER_ADMIN)

## 4) Ressources

Base path: `/api/resources`

- `GET /api/resources` (public)
  - Filtres: `category`, `type`, `sort`, `order`
- `GET /api/resources/{id}`
- `POST /api/resources` (ROLE_CONNECTED)
- `PUT /api/resources/{id}` (createur ou ROLE_SUPER_ADMIN)
- `DELETE /api/resources/{id}` (ROLE_SUPER_ADMIN)

### Commentaires
- `GET /api/resources/{id}/comments`
- `POST /api/resources/{id}/comments` (ROLE_CONNECTED)

Body minimal:

```json
{
  "content": "Mon commentaire",
  "rating": 5
}
```

### Favoris
- `POST /api/resources/{id}/save` (ROLE_CONNECTED)

## 5) Moderation

Base path: `/api/moderation`

- `GET /api/moderation/pending` (ROLE_ADMIN)
- `POST /api/moderation/validate/{id}` (ROLE_ADMIN)
- `POST /api/moderation/suspend/{id}` (ROLE_ADMIN)

## 6) Recherche

- `GET /api/search`
  - Query: `q`, `category`, `type`, `sort`
- `GET /api/resources/trending`
  - Query: `limit`, `period`

## 7) Contact

- `POST /api/contact` (public)

Body:

```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "message": "Bonjour"
}
```

## 8) Admin

- `GET /api/admin/stats` (ROLE_ADMIN)

## 9) Documentation OpenAPI

- `GET /api/doc`
- `GET /api/doc.json`

## Exemples rapides (curl)

### Register

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!","name":"Jean Dupont"}'
```

### Login

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

### Me

```bash
curl -X GET http://127.0.0.1:8000/api/me \
  -H "Authorization: Bearer <token>"
```

## Notes d'implementation

- L'inscription publique cree un compte en role standard (`ROLE_CONNECTED`).
- Si JWT est mal configure (cles/passphrase), `register/login/refresh` peuvent retourner `500` avec:

```json
{
  "error": "Erreur de configuration JWT"
}
```
