'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import { ResourceComments } from '@/components/shared/ResourceComments';
import Link from 'next/link';
import { Heart, Share2, Calendar, User, Tag, ExternalLink, AlertCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Resource {
  id: number;
  titre: string;
  description: string;
  contenu: string | null;
  type: string;
  type_ressource: string;
  statut: string;
  visibilite: string;
  created_at: string | null;
  dateCreation: string | null;
  createur: string | null;
  category: string | null;
  categoryId: number | null;
  lien: string | null;
  media: string | null;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token') || localStorage.getItem('auth_token');
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    article: 'Article',
    video: 'Vidéo',
    podcast: 'Podcast',
    activite: 'Activité',
    jeu: 'Jeu',
  };
  return map[type?.toLowerCase()] ?? type ?? 'Ressource';
}

export default function RessourceDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = React.use(props.params);
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}/resources/${params.id}`, { headers });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Erreur ${res.status}`);
        }
        const data: Resource = await res.json();
        setResource(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource?.titre ?? '',
        text: resource?.description ?? '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers');
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated || !resource) return;
    const token = getToken();
    try {
      await fetch(`${API_BASE}/resources/${resource.id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setIsFavorite(true);
    } catch {
      // silently ignore
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <main className="grow flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-content-muted text-sm">Chargement de la ressource…</p>
          </div>
        </main>
        <MainFooter />
      </div>
    );
  }

  // ── Error state ──
  if (error || !resource) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <main className="grow flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-sm">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h1 className="text-xl font-bold text-content">Ressource introuvable</h1>
            <p className="text-content-muted text-sm">{error ?? 'Cette ressource n\'existe pas ou n\'est plus disponible.'}</p>
            <Link href="/catalogue">
              <Button className="bg-primary text-white hover:bg-primary-700 rounded-xl">
                Retour au catalogue
              </Button>
            </Link>
          </div>
        </main>
        <MainFooter />
      </div>
    );
  }

  const type = resource.type_ressource || resource.type || 'article';
  const dateStr = resource.created_at || resource.dateCreation;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col selection:bg-secondary/30 selection:text-primary-900">
      <MainHeader />

      <PageHeader
        title={resource.titre}
        description={resource.category ?? undefined}
        showBackButton={true}
        compact={true}
        actions={
          <Button
            onClick={handleFavorite}
            size="sm"
            className={`flex items-center gap-1 h-8 px-3 rounded-xl font-semibold text-xs transition-all ${
              isFavorite
                ? 'bg-red-50 text-red-600 border-red-100'
                : 'bg-white text-content border-gray-200 hover:bg-gray-50'
            } border`}
            title={isAuthenticated ? (isFavorite ? 'Sauvegardé' : 'Sauvegarder') : 'Connectez-vous pour sauvegarder'}
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </Button>
        }
      />

      <main className="grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">

          {/* Carte principale */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 mb-8">

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {resource.category && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                  <Tag size={10} />
                  {resource.category}
                </span>
              )}
              <span className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-semibold">
                {typeLabel(type)}
              </span>
              {resource.statut === 'publie' && (
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Publié
                </span>
              )}
            </div>

            {/* Titre */}
            <h1 className="text-2xl sm:text-3xl font-bold text-content leading-tight">
              {resource.titre}
            </h1>

            {/* Description */}
            <p className="text-content-muted text-base">
              {resource.description}
            </p>

            {/* Méta */}
            <div className="flex flex-wrap gap-4 pt-3 text-xs text-content-muted border-t border-gray-100">
              {resource.createur && (
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span className="font-semibold text-content">Auteur :</span>
                  {resource.createur}
                </div>
              )}
              {dateStr && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span className="font-semibold text-content">Publié le :</span>
                  {formatDate(dateStr)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              {resource.lien ? (
                <a
                  href={resource.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold h-10 rounded-xl text-sm transition-all flex items-center gap-2 justify-center">
                    <ExternalLink size={15} />
                    Consulter
                  </Button>
                </a>
              ) : resource.media ? (
                <a
                  href={`${API_BASE.replace('/api', '')}/uploads/resources/${resource.media}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold h-10 rounded-xl text-sm transition-all flex items-center gap-2 justify-center">
                    <ExternalLink size={15} />
                    Consulter le média
                  </Button>
                </a>
              ) : (
                <Button
                  disabled
                  className="flex-1 bg-gray-100 text-gray-400 shadow-none font-semibold h-10 rounded-xl text-sm cursor-not-allowed"
                >
                  Aucun lien disponible
                </Button>
              )}

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

          {/* Grille contenu + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">

              {/* À propos — contenu réel de la BDD */}
              {resource.contenu && (
                <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-content mb-3">À propos</h2>
                  <div className="text-content-muted text-sm leading-relaxed whitespace-pre-line">
                    {resource.contenu}
                  </div>
                </section>
              )}

              {/* Commentaires */}
              <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-content mb-4">Commentaires</h2>
                <ResourceComments
                  resourceId={resource.id}
                  isAuthenticated={isAuthenticated}
                />
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* Infos */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <h3 className="font-bold text-content text-sm">Informations</h3>
                <div className="space-y-2 text-xs">

                  {dateStr && (
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-content-subtle">Date de publication</p>
                        <p className="text-content font-medium">{formatDate(dateStr)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <span className="w-4 h-4 text-primary shrink-0 flex items-center justify-center text-xs">📄</span>
                    <div>
                      <p className="text-content-subtle">Type</p>
                      <p className="text-content font-medium capitalize">{typeLabel(type)}</p>
                    </div>
                  </div>

                  {resource.category && (
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <Tag className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-content-subtle">Catégorie</p>
                        <p className="text-content font-medium">{resource.category}</p>
                      </div>
                    </div>
                  )}

                  {resource.createur && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-content-subtle">Auteur</p>
                        <p className="text-content font-medium">{resource.createur}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Accessibilité */}
              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 shadow-sm space-y-2">
                <h3 className="font-bold text-blue-900 text-xs">♿ Accessible</h3>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Norme RGAA — sous-titres disponibles si applicable
                </p>
                <Link href="/declaration-accessibilite" className="text-blue-600 text-xs font-semibold hover:underline">
                  Plus d&apos;infos →
                </Link>
              </div>

              {/* Signaler */}
              <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100 shadow-sm">
                <p className="text-xs text-yellow-900 font-medium mb-2">Problème d&apos;accès ?</p>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full bg-white text-yellow-900 border-yellow-100 hover:bg-yellow-100 text-xs font-semibold h-8 rounded-xl"
                  >
                    Signaler
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
