'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResourceCard, ResourceCardProps } from '@/components/shared/ResourceCard';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getResources, getCategories, ApiResource, ApiCategory } from '@/lib/api';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apiResources, apiCategories] = await Promise.all([
          getResources(),
          getCategories(),
        ]);
        setResources(apiResources);
        setCategories(apiCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Transform API resources to ResourceCardProps
  const mockResources: ResourceCardProps[] = resources.map(r => {
    // Map type from API format to component format
    const typeMap: Record<string, 'video' | 'pdf' | 'article' | 'audio' | 'event'> = {
      'video': 'video',
      'pdf': 'pdf',
      'article': 'article',
      'audio': 'audio',
      'event': 'event',
      // Fallback for any unexpected types
      'default': 'article'
    };

    const resourceType = typeMap[r.type_ressource?.toLowerCase() || ''] || 'article';

    return {
      type: resourceType,
      title: r.titre,
      description: r.description,
      imageUrl: r.imageUrl || 'https://images.unsplash.com/photo-1536640712247-c45474762ef4?auto=format&fit=crop&q=80&w=800',
      category: r.category || 'Général',
      author: r.createur,
      isNew: new Date(r.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      resourceId: r.id
    };
  });

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col selection:bg-secondary/30 selection:text-primary-900">
      <MainHeader />

      <PageHeader
        title="Catalogue des Ressources"
        description="Explorez plus de 1000 ressources sélectionnées et validées par des experts"
        showBackButton={false}
      />

      <main className="grow">

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Filters */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 mb-8">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="search-input" className="text-xs font-semibold text-gray-600">Rechercher par mot-clé</Label>
              <Input
                type="text"
                id="search-input"
                placeholder="Ex: Éducation, Parentalité, Santé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/20 bg-gray-50/50 font-medium text-content placeholder:text-content-subtle px-4"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-2">
                <Label className="text-xs font-semibold text-gray-600">Catégorie</Label>
              <select
                   value={selectedCategory}
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   className="h-11 border border-gray-200 rounded-xl bg-gray-50/50 flex items-center px-4 text-content-muted font-medium text-sm cursor-pointer hover:bg-gray-100/60 transition-colors outline-none focus:ring-1 focus:ring-primary/20"
                 >
                   <option value="all">Toutes les catégories</option>
                   {categories.map(cat => (
                     <option key={cat.id} value={cat.name}>{cat.name}</option>
                   ))}
                 </select>
              </div>
              <div className="grid w-full items-center gap-2">
                <Label className="text-xs font-semibold text-gray-600">Type de média</Label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-11 border border-gray-200 rounded-xl bg-gray-50/50 flex items-center px-4 text-content-muted font-medium text-sm cursor-pointer hover:bg-gray-100/60 transition-colors outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="all">Tous les formats</option>
                  <option value="video">Vidéo</option>
                  <option value="pdf">PDF</option>
                  <option value="article">Article</option>
                  <option value="audio">Audio/Podcast</option>
                  <option value="event">Événement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count & Create Button */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-content-muted font-medium">
              {filteredResources.length} ressource{filteredResources.length !== 1 ? 's' : ''} trouvée{filteredResources.length !== 1 ? 's' : ''}
            </p>
            <Button className="bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-6 h-11 rounded-xl text-sm transition-all" asChild>
              <Link href="/ressource/creer">+ Créer une ressource</Link>
            </Button>
          </div>

           {/* Resources Grid */}
           {loading ? (
             <div className="text-center py-16">
               <p className="text-content-muted text-lg font-medium">Chargement des ressources...</p>
             </div>
           ) : filteredResources.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredResources.map((resource, index) => (
                 <Link key={index} href={`/ressource/${resources[index]?.id || index}`}>
                   <ResourceCard
                     {...resource}
                     onAction={() => window.location.href = `/ressource/${resources[index]?.id || index}`}
                   />
                 </Link>
               ))}
             </div>
           ) : (
            <div className="text-center py-16">
              <p className="text-content-muted text-lg font-medium">Aucune ressource ne correspond à votre recherche.</p>
              <p className="text-content-subtle text-sm mt-2">Essayez d&apos;ajuster vos filtres.</p>
            </div>
          )}
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

