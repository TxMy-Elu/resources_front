# (RE)SOURCES - Frontend Next.js

Application Next.js pour la plateforme (RE)SOURCES Relationnels - Accès simplifié aux ressources relationnelles pour les familles et les couples.

## 🚀 Démarrage rapide

### Installation
```bash
pnpm install
```

### Configuration
Créer `.env.local` à la racine:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Démarrage du développement
```bash
pnpm dev
```

Accès: http://localhost:3000

## 📋 Documentation

### Pour les développeurs
- **[QUICK_START.md](./QUICK_START.md)** - Démarrage en 5 minutes ⭐
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Guide complet d'intégration API
- **[TESTING.md](./TESTING.md)** - Guide de test et débogage

### Pour la maintenance
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Vue d'ensemble complète
- **[FINAL_CHECKLIST.md](./FINAL_CHECKLIST.md)** - Checklist de la version 1.0
- **[COMMIT_MESSAGES.md](./COMMIT_MESSAGES.md)** - Messages de commit conventionnels

### Documentation backend
- **[api.md](./api.md)** - Documentation complète de l'API Symfony

## 🎯 Pages implémentées

### Public
- ✅ **Accueil** (`/`) - Présentation générale
- ✅ **Catalogue** (`/catalogue`) - Liste des ressources avec filtres
- ✅ **FAQ** (`/faq`) - Questions fréquemment posées
- ✅ **Contact** (`/contact`) - Formulaire de contact
- ⏳ **Détail ressource** (`/ressource/[id]`) - À développer
- ⏳ **Créer ressource** (`/ressource/creer`) - À développer

### Authentification
- ⏳ **Connexion** (`/connexion`) - À développer
- ⏳ **Inscription** (`/inscription`) - À développer
- ⏳ **Profil** (`/profile`) - À développer

### Administration
- ✅ **Gestion ressources** (`/admin/ressources`) - CRUD complet
- ✅ **Modération** (`/admin/moderation`) - Validation des ressources
- ⏳ **Gestion utilisateurs** (`/admin/utilisateurs`) - À développer
- ⏳ **Gestion catégories** (`/admin/categories`) - À développer

## 🔌 API intégrée

### Endpoints utilisés
| Endpoint | Méthode | Statut |
|----------|---------|--------|
| `/api/resources` | GET | ✅ |
| `/api/resources/{id}` | GET | ⏳ |
| `/api/resources` | POST | ✅ |
| `/api/resources/{id}` | PUT | ✅ |
| `/api/resources/{id}` | DELETE | ✅ |
| `/api/categories` | GET | ✅ |
| `/api/categories` | POST | ⏳ |
| `/api/moderation/pending` | GET | ✅ |
| `/api/moderation/validate/{id}` | POST | ✅ |
| `/api/moderation/suspend/{id}` | POST | ✅ |

## 🛠️ Architecture

```
Components (React)
    ↓
Custom Hooks (/lib/hooks.ts)
    ↓
API Client (/lib/api.ts)
    ↓
JWT Token Management
    ↓
HTTP Requests to Backend
```

## 📦 Technologies

- **Next.js 16.1.5** - Framework React avec SSR/SSG
- **React 19.2.3** - UI Library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Shadcn/ui** - UI Components
- **Fetch API** - HTTP requests

## 🔐 Authentification

- JWT Token management
- localStorage storage
- Automatic Authorization headers
- AuthContext pour state global
- useAuth() hook pour accéder aux données user

## 📝 Utilisation de l'API

### Avec un hook (recommandé)
```tsx
'use client';
import { useResources } from '@/lib/hooks';

export default function Page() {
  const { resources, loading, error } = useResources();
  
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;
  
  return <div>{resources.map(r => <p>{r.titre}</p>)}</div>;
}
```

### Avec le client API
```tsx
'use client';
import { getResources } from '@/lib/api';

useEffect(() => {
  getResources().then(setData);
}, []);
```

## 🧪 Testing

### Prérequis
- Backend Symfony en cours d'exécution sur `http://localhost:8080`
- Next.js en cours d'exécution sur `http://localhost:3000`

### Vérifier l'intégration
1. Accéder à http://localhost:3000/catalogue
2. Vérifier que les ressources s'affichent
3. Aller à http://localhost:3000/admin/ressources
4. Tester CRUD (créer, éditer, supprimer)
5. Aller à http://localhost:3000/admin/moderation
6. Tester validation/rejet

Voir [TESTING.md](./TESTING.md) pour le débogage détaillé.

## 📚 Composants principaux

### Partagés (`/components/shared`)
- `MainHeader` - Navbar principale
- `MainFooter` - Footer
- `PageHeader` - En-tête de page
- `ResourceCard` - Carte de ressource
- `AdminTable` - Tableau admin

### UI (`/components/ui`)
- Composants shadcn/ui
- Button, Input, Select, Dialog, etc.

## 🗂️ Structure du projet

```
resources_front/
├── app/                      # Pages Next.js
│   ├── catalogue/            # Listing des ressources
│   ├── admin/                # Pages admin
│   │   ├── ressources/       # Gestion ressources
│   │   ├── moderation/       # Modération
│   │   └── utilisateurs/     # Gestion users
│   ├── connexion/            # Login
│   ├── inscription/          # Register
│   └── page.tsx              # Accueil
├── components/               # Composants React
│   ├── shared/               # Composants partagés
│   └── ui/                   # Composants UI
├── lib/                      # Utilitaires
│   ├── api.ts               # Client API
│   ├── hooks.ts             # Custom hooks
│   ├── auth-context.tsx     # Auth context
│   └── transformers.ts      # Data mappers
├── public/                   # Assets statiques
└── [docs].md                # Documentation
```

## 🚀 Build pour la production

```bash
pnpm build
pnpm start
```

## 📖 Fichiers de documentation

| Fichier | Description |
|---------|-------------|
| `QUICK_START.md` | Démarrage en 5 min |
| `API_INTEGRATION.md` | Guide d'intégration API |
| `TESTING.md` | Guide de test |
| `INTEGRATION_SUMMARY.md` | Vue d'ensemble |
| `FINAL_CHECKLIST.md` | Checklist v1.0 |
| `api.md` | API Symfony |

## ✨ Dernières mises à jour

### Version 1.0.0 (2026-04-14)
- ✅ Intégration complète de l'API
- ✅ Catalogue avec données réelles
- ✅ Gestion des ressources (admin)
- ✅ Modération des ressources
- ✅ Authentification JWT
- ✅ 6 fichiers de documentation

## 🐛 Troubleshooting

### L'API ne répond pas?
```bash
# Vérifier que Symfony tourne
curl http://localhost:8080/api/resources
```

### Erreur CORS?
```bash
# Vérifier la config CORS du backend
# Dans le backend Symfony, ajouter les headers
```

### Token JWT expiré?
```javascript
// Dans les DevTools console
localStorage.removeItem('auth_token');
location.reload();
```

## 📞 Support

- Voir [TESTING.md](./TESTING.md) pour le débogage détaillé
- Vérifier les DevTools (F12) pour les erreurs
- Vérifier Network tab pour les requêtes HTTP

## 📄 Licence

MIT - Voir LICENSE.md

## 👥 Contributeurs

- Frontend: GitHub Copilot (Intégration API)
- Backend: Équipe Symfony

---

**Status**: ✅ Production Ready (v1.0.0)
**Dernière mise à jour**: 2026-04-14
**API version**: 1.0.0
**Node version requise**: 18+
