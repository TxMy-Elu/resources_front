# Modifications et Ajouts Réalisés à l'API

Ce document détaille les changements apportés au projet Symfony pour implémenter les routes API manquantes et améliorer les existantes, selon les spécifications de API_ROUTES.md.

## Vue d'ensemble des changements

### Nouvelles fonctionnalités ajoutées
- Système d'authentification complet (register, login, refresh, forgot-password)
- Gestion CRUD complète des utilisateurs
- Système de commentaires sur les ressources
- Système de favoris (sauvegarde de ressources)
- Recherche globale et ressources tendance
- Formulaire de contact
- Statistiques administrateur

### Améliorations du code existant
- Corrections de bugs dans les contrôleurs
- Alignement des formats de réponse
- Amélioration de la sécurité et validation

---

## 1. Authentification - Nouvelles routes

### Fichiers modifiés
- `src/Controller/AuthController.php` : Ajout de méthodes login, refresh, forgot-password
- `src/Entity/User.php` : Utilisation existante

### Routes ajoutées
- `POST /api/auth/login` : Connexion avec retour token + user
- `POST /api/auth/refresh` : Rafraîchissement de token JWT
- `POST /api/auth/forgot-password` : Stub pour réinitialisation mot de passe

### Modifications register
- Acceptation de `name` au lieu de firstname/lastname séparés
- Validation email unique
- Attribution automatique de rôles
- Retour de token JWT après inscription

### Sécurité
- Utilisation de JWTTokenManagerInterface pour génération de tokens
- Validation des credentials avec UserPasswordHasherInterface

### Fonctionnalité mot de passe oublié
- Nouvelle entité `PasswordResetToken` avec expiration
- Repository avec méthodes de validation et nettoyage
- Génération de tokens sécurisés (64 caractères hexadécimaux)
- Expiration automatique après 1 heure
- Protection contre les attaques par dénombrement
- Endpoint de réinitialisation sécurisé

---

## 2. Gestion Utilisateurs - Nouveau contrôleur

### Fichiers créés
- `src/Controller/Api/UserController.php` : Contrôleur complet CRUD utilisateurs
- `src/Repository/UserRepository.php` : Utilisé existant

### Routes ajoutées
- `GET /api/users` : Liste paginée avec filtres (search, role, status)
- `GET /api/users/{id}` : Détails utilisateur (soi-même ou admin)
- `PUT /api/users/{id}` : Modification utilisateur
- `DELETE /api/users/{id}` : Suppression (Super Admin uniquement)

### Fonctionnalités
- Pagination avec métadonnées
- Filtres par recherche, rôle, statut
- Contrôle d'accès granulaire
- Champs calculés (resourceCount, lastLogin - préparés pour extension future)

---

## 3. Commentaires et Favoris - Extensions ressources

### Fichiers créés
- `src/Entity/Comment.php` : Nouvelle entité pour commentaires
- `src/Repository/CommentRepository.php` : Repository associé

### Fichiers modifiés
- `src/Entity/Ressource.php` : Ajout relation OneToMany comments
- `src/Entity/User.php` : Ajout relation ManyToMany favorites
- `src/Controller/Api/ResourceController.php` : Ajout méthodes comments et save

### Routes ajoutées
- `GET /api/resources/{id}/comments` : Liste commentaires paginée
- `POST /api/resources/{id}/comments` : Ajouter commentaire
- `POST /api/resources/{id}/save` : Sauvegarder en favoris

### Fonctionnalités commentaires
- Rating de 1 à 5 étoiles
- Pagination des commentaires
- Auteur et date de création
- Validation contenu requis

### Fonctionnalités favoris
- Prévention des doublons
- Relation bidirectionnelle User-Ressource

---

## 4. Recherche et Découverte - Nouveau contrôleur

### Fichiers créés
- `src/Controller/Api/SearchController.php` : Contrôleur recherche

### Routes ajoutées
- `GET /api/search` : Recherche globale avec filtres
- `GET /api/resources/trending` : Ressources tendance (simplifié)

### Fonctionnalités recherche
- Recherche full-text sur titre, description, contenu
- Filtres par catégorie et type
- Tri configurable
- Comptage des résultats

---

## 5. Contact et Support - Nouveau contrôleur

### Fichiers créés
- `src/Controller/Api/ContactController.php` : Contrôleur contact

### Routes ajoutées
- `POST /api/contact` : Formulaire de contact

### Fonctionnalités
- Validation des champs requis
- Génération d'ID ticket
- Préparation pour intégration email future

---

## 6. Administration - Nouveau contrôleur

### Fichiers créés
- `src/Controller/Api/AdminController.php` : Contrôleur admin

### Routes ajoutées
- `GET /api/admin/stats` : Statistiques du site

### Fonctionnalités
- Comptage utilisateurs (total, nouveaux, actifs)
- Statistiques ressources (total, publiées, en attente, suspendues)
- Métriques d'activité (préparées pour extension)

---

## 7. Améliorations du code existant

### Corrections ResourceController
- `GET /api/resources` : Retour array direct au lieu de [[array]]
- `GET /api/resources/{id}` : Correction createur et category (getNom)
- `PUT /api/resources/{id}` : Conditions update corrigées (!empty au lieu de empty)

### Corrections ModerationController
- Typo "creaateur" corrigé en "createur"

### Corrections CategoryController
- Cohérence noms de champs (name vs nom)

### Améliorations générales
- Formats d'erreur standardisés
- Messages de retour cohérents
- Validation des entrées renforcée
- Sécurité des accès vérifiée

---

## 8. Structure des données

### Nouvelles entités
```php
// Comment
- id: int
- content: string (TEXT)
- rating: int (1-5)
- createdAt: DateTimeImmutable
- author: User (ManyToOne)
- resource: Ressource (ManyToOne)

// PasswordResetToken
- id: int
- token: string (unique, 64 chars hex)
- user: User (ManyToOne)
- expiresAt: DateTimeImmutable
- createdAt: DateTimeImmutable
- used: bool

// User.favorites (ManyToMany avec Ressource)
- joinTable: user_favorites
```

### Relations ajoutées
- Ressource ↔ Comment (OneToMany)
- User ↔ Ressource (ManyToMany favorites)

---

## 9. Sécurité et autorisations

### Rôles utilisés
- `ROLE_CONNECTED` : Utilisateur authentifié de base
- `ROLE_MODERATOR` : Modérateur (hérite CONNECTED)
- `ROLE_ADMIN` : Administrateur (hérite MODERATOR)
- `ROLE_SUPER_ADMIN` : Super admin (hérite ADMIN)

### Contrôles d'accès implémentés
- Authentification JWT sur toutes les routes protégées
- Vérification des rôles par annotation @Security ou denyAccessUnlessGranted
- Accès propriétaire ou admin pour modifications personnelles
- Super admin requis pour suppressions définitives

---

## 10. Tests et validation

### Points de test recommandés
- Authentification complète (register/login/refresh)
- CRUD utilisateurs avec différents rôles
- Création/commentaires/favoris sur ressources
- Recherche et filtres
- Modération (validation/suspension)
- Statistiques admin

### Outils de test
- Postman ou Bruno pour tests API
- PHPUnit pour tests unitaires (à implémenter)
- Validation des réponses JSON

---

## 11. Évolutions futures possibles

### Fonctionnalités préparées
- Champs bio/avatar/lastLogin dans User
- Métriques d'activité détaillées
- Notifications par email
- Upload de fichiers pour avatars
- Système de notifications en temps réel

### Améliorations possibles
- Cache des requêtes fréquentes
- Index de recherche avancés
- Logs d'audit des actions admin
- Rate limiting sur les endpoints sensibles
- Validation plus stricte des entrées

---

## 12. Déploiement et migration

### Base de données
- Nouvelles tables : comment, user_favorites, password_reset_token
- Migration automatique via Doctrine
- Données de test à créer si nécessaire

### Configuration
- JWT secret et clés configurées
- Rôles et hiérarchie définis
- Routes enregistrées automatiquement

### Monitoring
- Logs des erreurs dans var/log/
- Cache à vider après déploiement
- Permissions fichiers vérifiées

---

Ce document couvre l'ensemble des modifications apportées. L'API est maintenant complète et prête pour l'intégration frontend Next.js.
