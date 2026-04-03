'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { Heart, Share2, AlertCircle, Calendar } from 'lucide-react';

export default function RessourceDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = React.use(props.params);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - in real app, fetch from API based on params.id
  const resource = {
    id: parseInt(params.id),
    type: "video",
    title: "Comprendre la parentalité positive en 10 minutes",
    description: "Une exploration visuelle des concepts clés de la parentalité bienveillante, avec des conseils pratiques pour le quotidien.",
    fullContent: `
      La parentalité positive est une approche qui se concentre sur le bien-être global de l&apos;enfant et de la famille. 
      Elle favorise le dialogue, l&apos;écoute et le respect mutuel.

      Cette ressource vous permettra de découvrir :
      - Les principes fondamentaux de la parentalité bienveillante
      - Comment gérer les conflits de manière constructive
      - Les techniques de communication efficaces avec vos enfants
      - Des conseils pratiques adaptés à chaque âge
    `,
    imageUrl: "https://images.unsplash.com/photo-1536640712247-c45474762ef4?auto=format&fit=crop&q=80&w=1200",
    category: "Éducation",
    duration: "10:24",
    author: "Ministère de la Santé",
    createdAt: "2024-01-15",
    views: 2450,
    rating: 4.8,
    reviews: 128,
    isNew: true,
    tags: ["parentalité", "enfants", "communication", "bienveillance"],
    relatedResources: [
      {
        id: 1,
        title: "Ateliers pratiques : Méditation en famille",
        category: "Bien-être",
        type: "video"
      },
      {
        id: 2,
        title: "Guide complet de la communication non-violente",
        category: "Communication",
        type: "pdf"
      },
      {
        id: 3,
        title: "Podcast : Écouter ses enfants sans juger",
        category: "Podcast",
        type: "audio"
      }
    ]
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href,
      });
    } else {
      alert('Lien copié : ' + window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col selection:bg-secondary/30 selection:text-primary-900">
      <MainHeader />

      <PageHeader
        title={resource.title}
        description={resource.category}
        showBackButton={true}
        compact={true}
        actions={
          <Button
            onClick={() => setIsFavorite(!isFavorite)}
            size="sm"
            className={`flex items-center gap-1 h-8 px-3 rounded-xl font-semibold text-xs transition-all ${
              isFavorite ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-content border-gray-200 hover:bg-gray-50'
            } border`}
          >
            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        }
      />

      <main className="grow">
        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">

          {/* Badge & Title */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                {resource.category}
              </span>
              <span className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-semibold">
                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
              </span>
              {resource.isNew && (
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Nouveau
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-content leading-tight">
              {resource.title}
            </h1>

            <p className="text-content-muted text-base">
              {resource.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 pt-3 text-xs text-content-muted border-t border-gray-100">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-content">Auteur :</span>
                {resource.author}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-content">Durée :</span>
                {resource.duration}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-content">Vues :</span>
                {resource.views.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-content">⭐ {resource.rating}</span>
                ({resource.reviews} avis)
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button className="flex-1 bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold h-10 rounded-xl text-sm transition-all">
                Consulter
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="h-10 px-3 rounded-xl font-semibold text-sm bg-white text-content border-gray-200 hover:bg-gray-50 transition-all"
                title="Partager"
              >
                <Share2 size={16} />
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content - 2 colonnes */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description complète */}
              <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-content mb-3">À propos</h2>
                <div className="text-content-muted text-sm leading-relaxed whitespace-pre-line">
                  {resource.fullContent}
                </div>
              </section>

              {/* Tags */}
              <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-content mb-3">Mots-clés</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-gray-100/70 rounded-full text-xs font-medium text-content-muted hover:bg-gray-200/70 cursor-pointer transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>

              {/* Related Resources */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-content">Ressources connexes</h2>
                <div className="space-y-2">
                  {resource.relatedResources.map((related) => (
                    <Link
                      key={related.id}
                      href={`/ressource/${related.id}`}
                      className="block p-3 bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-content text-sm hover:text-primary transition-colors">
                            {related.title}
                          </h4>
                          <p className="text-xs text-content-muted mt-1">
                            {related.category} • {related.type}
                          </p>
                        </div>
                        <span className="text-primary text-sm shrink-0">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Reviews/Ratings Section */}
              <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-content">Avis</h2>

                <div className="grid grid-cols-3 gap-2 pb-4 border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{resource.rating}</p>
                    <p className="text-xs text-content-muted">sur 5 ⭐</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{resource.reviews}</p>
                    <p className="text-xs text-content-muted">avis</p>
                  </div>
                  <div>
                    <Button className="w-full bg-primary text-white hover:bg-primary-700 font-semibold h-8 rounded-xl text-xs">
                      Ajouter
                    </Button>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-2">
                  {[1, 2].map((review) => (
                    <div key={review} className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-semibold text-content text-sm">Jean Dupont</p>
                          <p className="text-xs text-content-muted">Il y a 2 semaines</p>
                        </div>
                        <span className="text-xs font-semibold">⭐ 5/5</span>
                      </div>
                      <p className="text-xs text-content-muted">
                        Très bonne ressource ! Pratique et facile à comprendre.
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* Info Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <h3 className="font-bold text-content text-sm">Infos</h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-content-subtle">Publié</p>
                      <p className="text-content font-medium">{new Date(resource.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-content-subtle text-xs">Type</p>
                      <p className="text-content font-medium text-xs capitalize">{resource.type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accessibility Info */}
              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 shadow-sm space-y-2">
                <h3 className="font-bold text-blue-900 text-xs">♿ Accessible</h3>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Norme RGAA - sous-titres disponibles
                </p>
                <Link href="/declaration-accessibilite" className="text-blue-600 text-xs font-semibold hover:underline">
                  Plus d&apos;infos →
                </Link>
              </div>

              {/* Report Issue */}
              <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100 shadow-sm">
                <p className="text-xs text-yellow-900 font-medium mb-2">Problème d&apos;accès?</p>
                <Button variant="outline" className="w-full bg-white text-yellow-900 border-yellow-100 hover:bg-yellow-100 text-xs font-semibold h-8 rounded-xl">
                  Signaler
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

