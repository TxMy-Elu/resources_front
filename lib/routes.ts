// 📍 ROUTES DISPONIBLES - (RE)SOURCES Plateforme

/**
 * FRONT-OFFICE ROUTES
 * Accessibles par tous les utilisateurs (authentifiés ou non)
 */

// Page d'accueil
export const ROUTES = {
  // Public Pages
  public: {
    home: '/',
    catalogue: '/catalogue',
    faq: '/faq',
    contact: '/contact',
    declaration_accessibilite: '/declaration-accessibilite',
    conditions: '/conditions',
    politique_confidentialite: '/politique-confidentialite',
  },

  // Authentication Pages
  auth: {
    inscription: '/inscription',
    connexion: '/connexion',
    mot_de_passe_oublie: '/mot-de-passe-oublie',
  },

  // Resource Pages
  resources: {
    catalogue: '/catalogue',
    detail: (id: number) => `/ressource/${id}`,
    creer: '/ressource/creer',
    editer: (id: number) => `/ressource/${id}/editer`,
  },

  // Admin Pages (Back-Office)
  admin: {
    dashboard: '/admin',
    utilisateurs: '/admin/utilisateurs',
    utilisateurs_detail: (id: number) => `/admin/utilisateurs/${id}`,
    ressources: '/admin/ressources',
    ressources_detail: (id: number) => `/admin/ressources/${id}`,
    moderation: '/admin/moderation',
    parametres: '/admin/parametres',
    securite: '/admin/securite',
  }
};

/**
 * NAVIGATION STRUCTURE
 */

// Main Header Navigation
export const HEADER_NAVIGATION = [
  { label: 'Accueil', href: ROUTES.public.home },
  { label: 'Ressources', href: ROUTES.public.catalogue },
  { label: 'FAQ', href: ROUTES.public.faq },
  { label: 'Contact', href: ROUTES.public.contact },
];

// Main Footer Navigation
export const FOOTER_NAVIGATION = {
  resources: [
    { label: 'Catalogue', href: ROUTES.public.catalogue },
    { label: 'Créer une ressource', href: ROUTES.resources.creer },
  ],
  support: [
    { label: 'FAQ', href: ROUTES.public.faq },
    { label: 'Contact', href: ROUTES.public.contact },
    { label: 'Accessibilité', href: ROUTES.public.declaration_accessibilite },
  ],
  legal: [
    { label: 'Conditions', href: ROUTES.public.conditions },
    { label: 'Politique de Confidentialité', href: ROUTES.public.politique_confidentialite },
  ],
  admin: [
    { label: 'Dashboard', href: ROUTES.admin.dashboard },
    { label: 'Utilisateurs', href: ROUTES.admin.utilisateurs },
    { label: 'Ressources', href: ROUTES.admin.ressources },
    { label: 'Modération', href: ROUTES.admin.moderation },
  ]
};

/**
 * PAGE DETAILS & DESCRIPTIONS
 */

export const PAGE_DETAILS = {
  // Front-Office Pages
  home: {
    title: 'Accueil - (RE)SOURCES',
    description: 'Plateforme de partage de ressources relationnelles pour les familles, couples et individus',
    route: ROUTES.public.home,
  },
  catalogue: {
    title: 'Catalogue des Ressources - (RE)SOURCES',
    description: 'Découvrez plus de 1000 ressources validées : vidéos, guides, podcasts et plus',
    route: ROUTES.public.catalogue,
  },
  inscription: {
    title: 'S\'inscrire - (RE)SOURCES',
    description: 'Créez votre compte pour accéder à toutes nos ressources et partager les vôtres',
    route: ROUTES.auth.inscription,
  },
  connexion: {
    title: 'Se Connecter - (RE)SOURCES',
    description: 'Accédez à votre espace personnel et à vos ressources favoris',
    route: ROUTES.auth.connexion,
  },
  creer_ressource: {
    title: 'Créer une Ressource - (RE)SOURCES',
    description: 'Partagez vos connaissances avec notre communauté d\'entraide',
    route: ROUTES.resources.creer,
  },
  detail_ressource: {
    title: 'Détail de la Ressource - (RE)SOURCES',
    description: 'Consultez le contenu complet avec avis et ressources connexes',
    route: (id: number) => ROUTES.resources.detail(id),
  },
  faq: {
    title: 'FAQ - (RE)SOURCES',
    description: 'Trouvez les réponses aux questions les plus fréquemment posées',
    route: ROUTES.public.faq,
  },
  contact: {
    title: 'Contact - (RE)SOURCES',
    description: 'Nous contacter pour toute question ou problème d\'accessibilité',
    route: ROUTES.public.contact,
  },

  // Admin Pages
  admin_dashboard: {
    title: 'Dashboard Admin - (RE)SOURCES',
    description: 'Vue d\'ensemble de la plateforme et accès aux outils d\'administration',
    route: ROUTES.admin.dashboard,
  },
  admin_utilisateurs: {
    title: 'Gestion des Utilisateurs - (RE)SOURCES',
    description: 'Gérer les comptes, les rôles et les permissions des utilisateurs',
    route: ROUTES.admin.utilisateurs,
  },
  admin_ressources: {
    title: 'Gestion du Catalogue - (RE)SOURCES',
    description: 'Administrer les ressources et les catégories de la plateforme',
    route: ROUTES.admin.ressources,
  },
  admin_moderation: {
    title: 'Espace de Modération - (RE)SOURCES',
    description: 'Valider et modérer les ressources soumises par les utilisateurs',
    route: ROUTES.admin.moderation,
  },
};

/**
 * REQUIRED ROLES FOR PAGES
 */

export const ROLE_REQUIREMENTS = {
  // No authentication required
  public: [
    ROUTES.public.home,
    ROUTES.public.catalogue,
    ROUTES.public.faq,
    ROUTES.public.contact,
    ROUTES.auth.inscription,
    ROUTES.auth.connexion,
  ],

  // Authenticated users only
  authenticated: [
    ROUTES.resources.creer,
    '/ressource/[id]',
    '/dashboard', // Not yet created
  ],

  // Moderators and above
  moderator: [
    ROUTES.admin.moderation,
  ],

  // Administrators and above
  admin: [
    ROUTES.admin.dashboard,
    ROUTES.admin.utilisateurs,
    ROUTES.admin.ressources,
  ],

  // Super-administrators only
  super_admin: [
    ROUTES.admin.parametres,
    ROUTES.admin.securite,
  ],
};

/**
 * API ENDPOINTS (Pour connexion backend Symfony)
 * À implémenter avec le Backend
 */

export const API_ENDPOINTS = {
  // Authentication
  login: '/api/auth/login',
  register: '/api/auth/register',
  refresh: '/api/auth/refresh',
  forgot_password: '/api/auth/forgot-password',
  reset_password: '/api/auth/reset-password',
  logout: '/api/logout',
  me: '/api/me',
  verify_email: '/api/auth/verify-email',

  // Resources
  resources_list: '/api/resources',
  resources_detail: (id: number) => `/api/resources/${id}`,
  resources_create: '/api/resources',
  resources_update: (id: number) => `/api/resources/${id}`,
  resources_delete: (id: number) => `/api/resources/${id}`,
  resource_comments: (id: number) => `/api/resources/${id}/comments`,
  resource_save: (id: number) => `/api/resources/${id}/save`,
  trending_resources: '/api/resources/trending',

  // Categories
  categories_list: '/api/categories',
  categories_create: '/api/categories',
  categories_update: (id: number) => `/api/categories/${id}`,
  categories_delete: (id: number) => `/api/categories/${id}`,

  // Users (Admin only)
  users_list: '/api/users',
  users_detail: (id: number) => `/api/users/${id}`,
  users_create: '/api/users',
  users_update: (id: number) => `/api/users/${id}`,
  users_delete: (id: number) => `/api/users/${id}`,

  // Moderation
  pending_resources: '/api/moderation/pending',
  validate_resource: (id: number) => `/api/moderation/validate/${id}`,
  suspend_resource: (id: number) => `/api/moderation/suspend/${id}`,

  // Search / Contact / Admin
  search: '/api/search',
  contact: '/api/contact',
  admin_stats: '/api/admin/stats',
  documentation: '/api/doc',
  documentation_json: '/api/doc.json',

  // Upload
  upload_file: '/api/upload',
};

/**
 * NAVIGATION BREADCRUMBS
 */

export const BREADCRUMBS = {
  home: [
    { label: 'Accueil', href: ROUTES.public.home }
  ],
  catalogue: [
    { label: 'Accueil', href: ROUTES.public.home },
    { label: 'Catalogue', href: ROUTES.public.catalogue }
  ],
  ressource_detail: (id: number) => [
    { label: 'Accueil', href: ROUTES.public.home },
    { label: 'Catalogue', href: ROUTES.public.catalogue },
    { label: 'Ressource', href: ROUTES.resources.detail(id) }
  ],
  admin_dashboard: [
    { label: 'Admin', href: ROUTES.admin.dashboard }
  ],
  admin_utilisateurs: [
    { label: 'Admin', href: ROUTES.admin.dashboard },
    { label: 'Utilisateurs', href: ROUTES.admin.utilisateurs }
  ],
  admin_ressources: [
    { label: 'Admin', href: ROUTES.admin.dashboard },
    { label: 'Ressources', href: ROUTES.admin.ressources }
  ],
  admin_moderation: [
    { label: 'Admin', href: ROUTES.admin.dashboard },
    { label: 'Modération', href: ROUTES.admin.moderation }
  ],
};

/**
 * REDIRECT RULES
 */

export const REDIRECTS = {
  // After login - utilisateur normal
  after_login_user: ROUTES.public.catalogue,

  // After login - moderator
  after_login_moderator: ROUTES.admin.moderation,

  // After login - admin
  after_login_admin: ROUTES.admin.dashboard,

  // After logout
  after_logout: ROUTES.public.home,

  // After registration
  after_registration: ROUTES.auth.connexion,

  // Unauthorized access
  unauthorized: ROUTES.public.home,

  // 404 error
  not_found: ROUTES.public.home,
};

/**
 * EXTERNAL LINKS
 */

export const EXTERNAL_LINKS = {
  github: 'https://github.com',
  documentation: 'https://docs.ressources.fr',
  support_email: 'mailto:support@ressources.fr',
  contact_phone: 'tel:+33123456789',
};

