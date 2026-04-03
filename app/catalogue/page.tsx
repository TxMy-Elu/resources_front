'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResourceCard, ResourceCardProps } from '@/components/shared/ResourceCard';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const mockResources: ResourceCardProps[] = [
    {
      type: "video",
      title: "Comprendre la parentalité positive en 10 minutes",
      description: "Une exploration visuelle des concepts clés de la parentalité bienveillante, avec des conseils pratiques pour le quotidien.",
      imageUrl: "https://images.unsplash.com/photo-1536640712247-c45474762ef4?auto=format&fit=crop&q=80&w=800",
      category: "Éducation",
      duration: "10:24",
      author: "Ministère de la Santé",
      isNew: true
    },
    {
      type: "pdf",
      title: "Guide complet des aides aux familles 2026",
      description: "Toutes les prestations familiales détaillées : conditions d'éligibilité, montants et démarches administratives simplifiées.",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
      category: "Administratif",
      fileSize: "4.2 MB",
      author: "CAF",
      isNew: false
    },
    {
      type: "article",
      title: "Gérer le temps d'écran des enfants : conseils d'experts",
      description: "Comment instaurer un dialogue sain autour du numérique sans créer de conflit au sein du foyer familial.",
      imageUrl: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&q=80&w=800",
      category: "Bien-être",
      author: "Observatoire du Numérique",
      isNew: false
    },
    {
      type: "event",
      title: "Conférence : La communication non-violente",
      description: "Participez à notre événement annuel avec Marshall Rosenberg (invité d'honneur) sur le dialogue au sein du couple.",
      imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
      category: "Événement",
      duration: "14 Mai 2026",
      author: "Assoc. Relat.",
      isNew: true
    },
    {
      type: "audio",
      title: "Podcast : Écouter ses enfants sans juger",
      description: "Épisode 12 : Les techniques d'écoute active pour renforcer le lien de confiance avec ses adolescents.",
      imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800",
      category: "Podcast",
      duration: "35 min",
      author: "Radio Famille",
      isNew: false
    },
    {
      type: "pdf",
      title: "Fiche pratique : Les premiers gestes de secours",
      description: "Une fiche synthétique à imprimer et à garder dans sa pharmacie pour réagir vite en cas d'accident domestique.",
      imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800",
      category: "Santé",
      fileSize: "850 KB",
      author: "Protection Civile",
      isNew: false
    },
    {
      type: "article",
      title: "Couple et travail : trouver l'équilibre",
      description: "Comment préserver son couple quand les deux partenaires ont des carrières exigeantes. Conseils de psychologues spécialisés.",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      category: "Travail",
      author: "Institut Couple Sain",
      isNew: false
    },
    {
      type: "video",
      title: "Ateliers pratiques : Méditation en famille",
      description: "Découvrez comment initier vos enfants à la méditation de pleine conscience pour développer la sérénité familiale.",
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
      category: "Bien-être",
      duration: "28:15",
      author: "Zen Academy",
      isNew: true
    }
  ];

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
        actions={
          <Button className="bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-4 h-8 rounded-xl text-xs transition-all flex items-center gap-2">
            <Plus className="w-3 h-3" />
            Créer
          </Button>
        }
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
                  <option value="Éducation">Éducation</option>
                  <option value="Administratif">Administratif</option>
                  <option value="Bien-être">Bien-être</option>
                  <option value="Événement">Événement</option>
                  <option value="Santé">Santé</option>
                  <option value="Travail">Travail</option>
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
            <Button className="bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-6 h-11 rounded-xl text-sm transition-all">
              <Link href="/ressource/creer" className="w-full h-full flex items-center justify-center">
                + Créer une ressource
              </Link>
            </Button>
          </div>

          {/* Resources Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <Link key={index} href={`/ressource/${index}`}>
                  <ResourceCard
                    {...resource}
                    onAction={() => window.location.href = `/ressource/${index}`}
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

