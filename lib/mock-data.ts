// Mock data for the application
// Replace with API calls in production

export interface Resource {
  id: number;
  type: 'video' | 'pdf' | 'article' | 'audio' | 'event' | 'link';
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  duration?: string;
  fileSize?: string;
  author: string;
  createdAt: string;
  views: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  tags: string[];
  status: 'published' | 'pending' | 'suspended';
  visibility: 'public' | 'private' | 'shared';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Citoyen' | 'Modérateur' | 'Administrateur' | 'Super-administrateur';
  status: 'Actif' | 'Inactif';
  joinDate: string;
  resourceCount: number;
  lastLogin?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  resourceCount: number;
}

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 1,
    type: 'video',
    title: 'Comprendre la parentalité positive en 10 minutes',
    description: 'Une exploration visuelle des concepts clés de la parentalité bienveillante, avec des conseils pratiques pour le quotidien.',
    imageUrl: 'https://images.unsplash.com/photo-1536640712247-c45474762ef4?auto=format&fit=crop&q=80&w=800',
    category: 'Éducation',
    duration: '10:24',
    author: 'Ministère de la Santé',
    createdAt: '2024-01-15',
    views: 2450,
    rating: 4.8,
    reviews: 128,
    isNew: true,
    tags: ['parentalité', 'enfants', 'communication', 'bienveillance'],
    status: 'published',
    visibility: 'public'
  },
  {
    id: 2,
    type: 'pdf',
    title: 'Guide complet des aides aux familles 2026',
    description: 'Toutes les prestations familiales détaillées : conditions d\'éligibilité, montants et démarches administratives simplifiées.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    category: 'Administratif',
    fileSize: '4.2 MB',
    author: 'CAF',
    createdAt: '2024-01-10',
    views: 1230,
    rating: 4.6,
    reviews: 95,
    isNew: false,
    tags: ['aides', 'administratif', 'famille', 'allocations'],
    status: 'published',
    visibility: 'public'
  },
  {
    id: 3,
    type: 'article',
    title: 'Gérer le temps d\'écran des enfants : conseils d\'experts',
    description: 'Comment instaurer un dialogue sain autour du numérique sans créer de conflit au sein du foyer familial.',
    imageUrl: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&q=80&w=800',
    category: 'Bien-être',
    author: 'Observatoire du Numérique',
    createdAt: '2024-02-20',
    views: 0,
    rating: 0,
    reviews: 0,
    isNew: false,
    tags: ['numérique', 'enfants', 'bien-être', 'écrans'],
    status: 'pending',
    visibility: 'public'
  },
  {
    id: 4,
    type: 'event',
    title: 'Conférence : La communication non-violente',
    description: 'Participez à notre événement annuel avec Marshall Rosenberg (invité d\'honneur) sur le dialogue au sein du couple.',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
    category: 'Événement',
    duration: '14 Mai 2026',
    author: 'Assoc. Relat.',
    createdAt: '2024-02-01',
    views: 890,
    rating: 4.9,
    reviews: 52,
    isNew: true,
    tags: ['événement', 'communication', 'couple', 'dialogue'],
    status: 'published',
    visibility: 'public'
  },
  {
    id: 5,
    type: 'audio',
    title: 'Podcast : Écouter ses enfants sans juger',
    description: 'Épisode 12 : Les techniques d\'écoute active pour renforcer le lien de confiance avec ses adolescents.',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800',
    category: 'Podcast',
    duration: '35 min',
    author: 'Radio Famille',
    createdAt: '2024-01-25',
    views: 1500,
    rating: 4.7,
    reviews: 78,
    isNew: false,
    tags: ['podcast', 'écoute', 'adolescents', 'relation'],
    status: 'published',
    visibility: 'public'
  },
  {
    id: 6,
    type: 'pdf',
    title: 'Fiche pratique : Les premiers gestes de secours',
    description: 'Une fiche synthétique à imprimer et à garder dans sa pharmacie pour réagir vite en cas d\'accident domestique.',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800',
    category: 'Santé',
    fileSize: '850 KB',
    author: 'Protection Civile',
    createdAt: '2024-02-10',
    views: 3200,
    rating: 4.9,
    reviews: 156,
    isNew: false,
    tags: ['secours', 'santé', 'urgence', 'pratique'],
    status: 'published',
    visibility: 'public'
  },
  {
    id: 7,
    type: 'article',
    title: 'Couple et travail : trouver l\'équilibre',
    description: 'Comment préserver son couple quand les deux partenaires ont des carrières exigeantes. Conseils de psychologues spécialisés.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    category: 'Travail',
    author: 'Institut Couple Sain',
    createdAt: '2024-02-05',
    views: 1100,
    rating: 4.5,
    reviews: 68,
    isNew: false,
    tags: ['couple', 'travail', 'équilibre', 'vie professionnelle'],
    status: 'published',
    visibility: 'public'
  },
  {
    id: 8,
    type: 'video',
    title: 'Ateliers pratiques : Méditation en famille',
    description: 'Découvrez comment initier vos enfants à la méditation de pleine conscience pour développer la sérénité familiale.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    category: 'Bien-être',
    duration: '28:15',
    author: 'Zen Academy',
    createdAt: '2024-02-15',
    views: 890,
    rating: 4.8,
    reviews: 102,
    isNew: true,
    tags: ['méditation', 'bien-être', 'famille', 'pleine conscience'],
    status: 'published',
    visibility: 'public'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    role: 'Citoyen',
    status: 'Actif',
    joinDate: '2024-01-15',
    resourceCount: 3,
    lastLogin: '2024-02-28'
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    email: 'thomas.dubois@email.com',
    role: 'Modérateur',
    status: 'Actif',
    joinDate: '2023-11-20',
    resourceCount: 0,
    lastLogin: '2024-02-27'
  },
  {
    id: 3,
    name: 'Admin Central',
    email: 'admin@ressources.fr',
    role: 'Administrateur',
    status: 'Actif',
    joinDate: '2023-06-01',
    resourceCount: 0,
    lastLogin: '2024-02-28'
  },
  {
    id: 4,
    name: 'Leila Kassam',
    email: 'leila.k@email.com',
    role: 'Citoyen',
    status: 'Inactif',
    joinDate: '2024-02-10',
    resourceCount: 1,
    lastLogin: '2024-02-20'
  },
  {
    id: 5,
    name: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    role: 'Modérateur',
    status: 'Actif',
    joinDate: '2024-01-05',
    resourceCount: 0,
    lastLogin: '2024-02-28'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Éducation',
    description: 'Ressources sur l\'éducation, la scolarité et l\'apprentissage',
    resourceCount: 145
  },
  {
    id: 2,
    name: 'Administratif',
    description: 'Guides administratifs et aide aux démarches',
    resourceCount: 203
  },
  {
    id: 3,
    name: 'Bien-être',
    description: 'Ressources pour le bien-être physique et mental',
    resourceCount: 178
  },
  {
    id: 4,
    name: 'Santé',
    description: 'Informations et conseils de santé',
    resourceCount: 256
  },
  {
    id: 5,
    name: 'Travail',
    description: 'Ressources professionnelles et d\'emploi',
    resourceCount: 89
  },
  {
    id: 6,
    name: 'Famille',
    description: 'Ressources pour la vie familiale',
    resourceCount: 312
  }
];

// FAQ data
export const MOCK_FAQ = [
  {
    id: 1,
    category: 'Compte et Inscription',
    question: 'Comment créer un compte ?',
    answer: 'Cliquez sur "S\'inscrire" en haut de la page, remplissez le formulaire avec vos données et acceptez les conditions d\'utilisation. Un email de confirmation vous sera envoyé pour valider votre compte.'
  },
  {
    id: 2,
    category: 'Compte et Inscription',
    question: 'Comment réinitialiser mon mot de passe ?',
    answer: 'Sur la page de connexion, cliquez sur "Mot de passe oublié". Entrez votre adresse email et vous recevrez un lien de réinitialisation.'
  },
  {
    id: 3,
    category: 'Ressources',
    question: 'Comment chercher une ressource ?',
    answer: 'Utilisez la barre de recherche ou accédez au catalogue complet. Vous pouvez filtrer par catégorie, type de média et autres critères.'
  },
  {
    id: 4,
    category: 'Ressources',
    question: 'Puis-je créer et partager mes propres ressources ?',
    answer: 'Oui ! Une fois connecté(e), allez sur "Créer une ressource". Vous pouvez choisir entre une visibilité privée, partagée ou publique.'
  }
];

