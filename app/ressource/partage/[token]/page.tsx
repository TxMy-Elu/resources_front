'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { getResourceByShareToken, ApiResource } from '@/lib/api';
import Link from 'next/link';
import { FileText, Calendar, User } from 'lucide-react';

export default function SharedResourcePage() {
  const { token } = useParams<{ token: string }>();
  const [resource, setResource] = useState<ApiResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getResourceByShareToken(token);
      if (!data) {
        setNotFound(true);
      } else {
        setResource(data);
      }
      setLoading(false);
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-content-muted text-sm animate-pulse">Chargement...</div>
        </main>
        <MainFooter />
      </div>
    );
  }

  if (notFound || !resource) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <main className="flex-grow flex flex-col items-center justify-center gap-4 px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md w-full">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h1 className="text-xl font-bold text-content mb-2">Lien invalide ou expiré</h1>
            <p className="text-content-muted text-sm mb-6">
              Ce lien de partage n&apos;existe pas ou a été désactivé par son auteur.
            </p>
            <Link href="/catalogue" className="text-primary text-sm font-semibold hover:underline">
              Voir le catalogue public →
            </Link>
          </div>
        </main>
        <MainFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Badge partagé */}
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Ressource partagée par lien privé
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="mb-6">
                {resource.category && (
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
                    {resource.category}
                  </span>
                )}
                <h1 className="text-3xl font-bold text-content mb-3">{resource.titre}</h1>
                <p className="text-content-muted leading-relaxed">{resource.description}</p>
              </div>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-4 text-sm text-content-muted py-4 border-y border-gray-100 mb-6">
                {resource.createur && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{resource.createur}</span>
                  </div>
                )}
                {resource.created_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(resource.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {resource.type_ressource && (
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium capitalize">
                    {resource.type_ressource}
                  </span>
                )}
              </div>

              {/* Contenu */}
              {resource.contenu && (
                <div className="prose prose-sm max-w-none text-content leading-relaxed whitespace-pre-line">
                  {resource.contenu}
                </div>
              )}

              {/* Lien externe */}
              {resource.lien && (
                <div className="mt-6 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-content mb-2">Lien associé</p>
                  <a
                    href={resource.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:underline break-all"
                  >
                    {resource.lien}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
