// API Configuration and Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const JWT_STORAGE_KEY = 'jwt_token';
const LEGACY_JWT_STORAGE_KEY = 'auth_token';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(JWT_STORAGE_KEY) || localStorage.getItem(LEGACY_JWT_STORAGE_KEY);
    }
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') {
      return this.token;
    }

    return localStorage.getItem(JWT_STORAGE_KEY) || localStorage.getItem(LEGACY_JWT_STORAGE_KEY);
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getStoredToken();
    this.token = token;

    if (includeAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(JWT_STORAGE_KEY, token);
      localStorage.removeItem(LEGACY_JWT_STORAGE_KEY);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(JWT_STORAGE_KEY);
      localStorage.removeItem(LEGACY_JWT_STORAGE_KEY);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config: { includeAuth?: boolean } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const includeAuth = config.includeAuth ?? true;
    const token = this.getStoredToken();
    this.token = token;

    try {
      // Debug logging
      console.log(`[API] ${options.method || 'GET'} ${url}`);
      if (!includeAuth) {
        console.log('[API] Requete publique sans Authorization');
      } else if (token) {
        console.log(`[API] Token présent: ${token.substring(0, 20)}...`);
      } else {
        console.warn(`[API] Aucun token trouvé - requête non authentifiée`);
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(includeAuth),
          ...options.headers,
        },
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      // Si la réponse n'est pas OK et n'est pas JSON, c'est probablement une page d'erreur HTML
      if (!response.ok && !isJson) {
        console.error(`[API] HTTP ${response.status}: Réponse non-JSON reçue (${contentType})`);

        if (response.status === 401) {
          console.error(`[API] Authentification requise - Token manquant ou invalide`);
          // Nettoyer le token expiré
          this.clearToken();
          throw new Error(`Authentification requise - Veuillez vous connecter`);
        }

        if (response.status === 403) {
          throw new Error(`Accès refusé - Vous n'avez pas les droits nécessaires`);
        }

        if (response.status === 500) {
          console.error(`[API] Erreur serveur 500`);
          throw new Error(`Erreur serveur - Veuillez réessayer ultérieurement`);
        }

        const text = await response.text();
        console.error(`[API] Response text:`, text.substring(0, 500));
        throw new Error(`Erreur serveur ${response.status}: ${response.statusText}`);
      }

      if (!isJson) {
        console.error(`[API] Invalid content-type: ${contentType}`);
        throw new Error(`Format invalide - JSON attendu, reçu: ${contentType}`);
      }

      const data = await response.json();

      if (!response.ok) {
        console.error(`[API] HTTP ${response.status}:`, data);
        if (response.status === 401) {
          this.clearToken();
        }

        // Extract error message with fallback
        let errorMessage = '';
        if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        } else if (data.message) {
          errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
        } else if (data.errors && typeof data.errors === 'object') {
          // Handle validation errors like {"errors": {"email": ["Email already used"]}}
          const errorEntries = Object.entries(data.errors);
          if (errorEntries.length > 0) {
            const [, messages] = errorEntries[0];
            if (Array.isArray(messages) && messages.length > 0) {
              errorMessage = messages[0];
            } else if (typeof messages === 'string') {
              errorMessage = messages;
            }
          }
        }

        // Fallback error message based on status code
        if (!errorMessage) {
          const statusMessages: Record<number, string> = {
            400: 'Requête invalide - Veuillez vérifier vos données',
            401: 'Authentification requise',
            403: 'Accès refusé',
            404: 'Ressource non trouvée',
            409: 'Conflit - Cette ressource existe déjà',
            422: 'Données invalides - Veuillez vérifier vos données',
            429: 'Trop de requêtes - Veuillez réessayer plus tard',
            500: 'Erreur serveur - Veuillez réessayer ultérieurement',
          };
          errorMessage = statusMessages[response.status] || `Erreur ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      console.log(`[API] Success (${response.status}):`, data);
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      // Re-throw without adding extra context if it's already an API error
      if (error instanceof Error) {
        // Don't wrap if it's already from our error handling
        throw error;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, config?: { includeAuth?: boolean }): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, config);
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    config?: { includeAuth?: boolean }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }, config);
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    config?: { includeAuth?: boolean }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }, config);
  }

  async delete<T>(endpoint: string, config?: { includeAuth?: boolean }): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, config);
  }
}

export const api = new ApiClient(API_BASE_URL);

function extractArrayData<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    if (Array.isArray(response[0])) {
      return response[0] as T[];
    }
    return response as T[];
  }

  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    Array.isArray((response as PaginatedResponse<T>).data)
  ) {
    return (response as PaginatedResponse<T>).data;
  }

  return [];
}

// ============ Resources API ============

export type ResourceType = 'article' | 'video' | 'podcast' | 'activite' | 'jeu';
export type ResourceStatus = 'brouillon' | 'en attente' | 'publie' | 'suspendu';
export type ResourceVisibility = 'private' | 'partage' | 'publie';

export interface ApiResource {
  id: number;
  titre: string;
  description: string;
  contenu?: string;
  type_ressource: string;
  statut: string;
  visibilite: string;
  created_at: string;
  datePublication?: string;
  createur: string;
  category?: string;
  views?: number;
  rating?: number;
  reviews?: number;
  tags?: string[];
  imageUrl?: string;
  commentCount?: number;
}

export async function getResources(params?: {
  category?: number | string;
  type?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}): Promise<ApiResource[]> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category.toString());
  if (params?.type) queryParams.append('type', params.type);
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.order) queryParams.append('order', params.order);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = query ? `/resources?${query}` : '/resources';

  try {
    const response = await api.get<unknown>(endpoint);
    const resources = extractArrayData<ApiResource>(response);
    if (resources.length > 0) {
      return resources;
    }
    console.warn('Unexpected API response format:', response);
    return [];
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return [];
  }
}

export async function getResourceById(id: string | number): Promise<ApiResource | null> {
  try {
    return await api.get<ApiResource>(`/resources/${id}`);
  } catch (error) {
    console.error(`Failed to fetch resource ${id}:`, error);
    return null;
  }
}

export interface CreateResourcePayload {
  titre: string;
  description: string;
  contenu: string;
  type: string;
  visibilite: string;
  categoryId: number;
}

export async function createResource(
  payload: CreateResourcePayload
): Promise<{ id: number; message: string; statut: string }> {
  return api.post('/resources', payload);
}

export async function updateResource(
  id: number,
  payload: Partial<CreateResourcePayload>
): Promise<{ message: string }> {
  return api.put(`/resources/${id}`, payload);
}

export async function deleteResource(id: number): Promise<{ message: string }> {
  return api.delete(`/resources/${id}`);
}

export interface ResourceComment {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
}

export type ResourceCommentsResponse = PaginatedResponse<ResourceComment>;

export async function getResourceComments(params: {
  id: number;
  page?: number;
  limit?: number;
}): Promise<ResourceCommentsResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = query
    ? `/resources/${params.id}/comments?${query}`
    : `/resources/${params.id}/comments`;

  return api.get<ResourceCommentsResponse>(endpoint);
}

export async function addResourceComment(
  id: number,
  payload: { content: string; rating: number }
): Promise<{ id: number; message: string }> {
  return api.post(`/resources/${id}/comments`, payload);
}

export async function saveResource(
  id: number
): Promise<{ message: string; saved: boolean }> {
  return api.post(`/resources/${id}/save`, {});
}

// ============ Categories API ============

export interface ApiCategory {
  id: number;
  name: string;
  description: string;
}

export async function getCategories(): Promise<ApiCategory[]> {
  try {
    const response = await api.get<unknown>('/categories');
    return extractArrayData<ApiCategory>(response);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function createCategory(
  name: string,
  description: string
): Promise<{ id: number; message: string }> {
  return api.post('/categories', { name, description });
}

export async function updateCategory(
  id: number,
  name: string,
  description: string
): Promise<{ message: string }> {
  return api.put(`/categories/${id}`, { name, description });
}

export async function deleteCategory(id: number): Promise<{ message: string }> {
  return api.delete(`/categories/${id}`);
}

// ============ Moderation API ============

export interface PendingResource {
  id: number;
  titre: string;
  createur: string;
  dateCreation: string;
}

export async function getPendingResources(): Promise<PendingResource[]> {
  try {
    return await api.get<PendingResource[]>('/moderation/pending');
  } catch (error) {
    console.error('Failed to fetch pending resources:', error);
    return [];
  }
}

export async function validateResource(id: number): Promise<{ message: string }> {
  return api.post(`/moderation/validate/${id}`, {});
}

export async function suspendResource(id: number): Promise<{ message: string }> {
  return api.post(`/moderation/suspend/${id}`, {});
}

// ============ Authentication ============

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  id: number;
  token?: string;
  user?: AuthUser;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface CurrentUserResponse {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  role?: string;
  roles?: string[];
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', payload, {
      includeAuth: false,
    });
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', payload, {
      includeAuth: false,
    });
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

export async function refreshToken(refreshTokenValue: string): Promise<RefreshTokenResponse> {
  const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken: refreshTokenValue,
  });

  if (response.token) {
    api.setToken(response.token);
  }

  return response;
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  return api.post<ForgotPasswordResponse>('/auth/forgot-password', payload, {
    includeAuth: false,
  });
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  return api.post<ResetPasswordResponse>('/auth/reset-password', payload, {
    includeAuth: false,
  });
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  return api.get<CurrentUserResponse>('/me');
}

export async function logout(): Promise<void> {
  try {
    await api.post<{ message: string }>('/logout', {});
  } catch (error) {
    console.warn('Logout request failed, clearing local session anyway:', error);
  } finally {
    api.clearToken();
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(localStorage.getItem(JWT_STORAGE_KEY) || localStorage.getItem(LEGACY_JWT_STORAGE_KEY));
}

// ============ Users API ============

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: 'Citoyen' | 'Modérateur' | 'Administrateur' | 'Super-administrateur';
  status: 'Actif' | 'Inactif';
  joinDate: string;
  resourceCount: number;
  lastLogin?: string | null;
  bio?: string;
  avatar?: string;
}

export type UsersListResponse = PaginatedResponse<ApiUser>;

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: 'Actif' | 'Inactif';
}): Promise<UsersListResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    const endpoint = query ? `/users?${query}` : '/users';

    return await api.get<UsersListResponse>(endpoint);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return { data: [], pagination: { total: 0, page: 1, limit: 50, pages: 0 } };
  }
}

export async function createUser(user: Omit<ApiUser, 'id' | 'joinDate' | 'resourceCount'>): Promise<{ id: number; message: string }> {
  return api.post('/users', user);
}

export async function getUserById(id: number): Promise<ApiUser> {
  return api.get<ApiUser>(`/users/${id}`);
}

export async function updateUser(id: number, user: Partial<ApiUser>): Promise<{ message: string }> {
  return api.put(`/users/${id}`, user);
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  return api.delete(`/users/${id}`);
}

// ============ Search API ============

export interface SearchResult {
  id: number;
  titre: string;
  description: string;
  type: string;
  category: string;
  score?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  count: number;
  query?: string;
}

export async function searchResources(params?: {
  q?: string;
  category?: string | number;
  type?: string;
  sort?: 'relevance' | 'date' | 'rating';
}): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();

  if (params?.q) searchParams.append('q', params.q);
  if (params?.category) searchParams.append('category', params.category.toString());
  if (params?.type) searchParams.append('type', params.type);
  if (params?.sort) searchParams.append('sort', params.sort);

  const query = searchParams.toString();
  const endpoint = query ? `/search?${query}` : '/search';
  return api.get<SearchResponse>(endpoint);
}

export async function getTrendingResources(limit = 10): Promise<ApiResource[]> {
  const response = await api.get<unknown>(`/resources/trending?limit=${limit}`);
  return extractArrayData<ApiResource>(response);
}

// ============ Contact API ============

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  subject: string;
  category: string;
}

export interface ContactResponse {
  message: string;
  ticketId: string;
}

export async function sendContactMessage(
  payload: ContactPayload
): Promise<ContactResponse> {
  return api.post<ContactResponse>('/contact', payload, {
    includeAuth: false,
  });
}

// ============ Admin API ============

export interface AdminStatsResponse {
  users: {
    total: number;
    new: number;
    active: number;
  };
  resources: {
    total: number;
    published: number;
    pending: number;
    suspended: number;
  };
  activities: {
    thisMonth: number;
    thisWeek: number;
  };
}

export async function getAdminStats(): Promise<AdminStatsResponse> {
  return api.get<AdminStatsResponse>('/admin/stats');
}
