// Helper functions to transform API responses to frontend format
import { ApiResource, ApiCategory } from './api';

export interface FormattedResource {
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

export function transformApiResourceToFrontend(apiResource: ApiResource): FormattedResource {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const createdDate = new Date(apiResource.created_at);

  // Map API status values to frontend format
  const statusMap: Record<string, 'published' | 'pending' | 'suspended'> = {
    'publie': 'published',
    'en attente': 'pending',
    'suspendu': 'suspended',
    'published': 'published',
    'pending': 'pending',
    'suspended': 'suspended'
  };

  const visibilityMap: Record<string, 'public' | 'private' | 'shared'> = {
    'publie': 'public',
    'private': 'private',
    'partage': 'shared',
    'public': 'public',
    'shared': 'shared'
  };

  return {
    id: apiResource.id,
    type: (apiResource.type_ressource?.toLowerCase() || 'article') as any,
    title: apiResource.titre,
    description: apiResource.description,
    imageUrl: apiResource.imageUrl || getDefaultImageForType(apiResource.type_ressource),
    category: apiResource.category || 'Général',
    author: apiResource.createur,
    createdAt: apiResource.created_at,
    views: apiResource.views || 0,
    rating: apiResource.rating || 0,
    reviews: apiResource.reviews || 0,
    isNew: createdDate > thirtyDaysAgo,
    tags: apiResource.tags || [],
    status: statusMap[apiResource.statut?.toLowerCase()] || 'pending',
    visibility: visibilityMap[apiResource.visibilite?.toLowerCase()] || 'private'
  };
}

function getDefaultImageForType(type?: string): string {
  const imageMap: Record<string, string> = {
    'video': 'https://images.unsplash.com/photo-1536640712247-c45474762ef4?auto=format&fit=crop&q=80&w=800',
    'pdf': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    'article': 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&q=80&w=800',
    'audio': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800',
    'event': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
    'link': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'
  };

  return imageMap[type?.toLowerCase() || ''] || 'https://images.unsplash.com/photo-1536640712247-c45474762ef4?auto=format&fit=crop&q=80&w=800';
}

