'use client';

import React, { useEffect, useState } from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { Eye, Edit2, Link2, Check, Heart, Tag, Download, ExternalLink } from 'lucide-react';
import { getMyResources, getFavorites, ApiResource, FavoriteResource, getMediaUrl } from '@/lib/api';
import { downloadFromSupabase, isSupabaseUrl } from '@/lib/supabase';
import { RoleGuard } from '@/components/shared/RoleGuard';

const STATUT_LABELS: Record<string, { label: string; classes: string }> = {
  'publie':      { label: 'Publié',       classes: 'bg-green-100 text-green-700'  },
  'en attente':  { label: 'En attente',   classes: 'bg-yellow-100 text-yellow-700' },
  'brouillon':   { label: 'Brouillon',    classes: 'bg-gray-100 text-gray-600'     },
  'suspendu':    { label: 'Suspendu',     classes: 'bg-red-100 text-red-700'       },
};

export default function DashboardPage() {
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [favorites, setFavorites] = useState<FavoriteResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getMyResources(), getFavorites()])
      .then(([res, favs]) => { setResources(res); setFavorites(favs); })
      .finally(() => setLoading(false));
  }, []);

  const copyShareLink = async (resource: ApiResource) => {
    if (!resource.shareToken) return;
    const url = `${window.location.origin}/ressource/partage/${resource.shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(resource.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalViews = resources.reduce((sum, r) => sum + (r.views || 0), 0);
  const published  = resources.filter(r => r.statut === 'publie').length;
  const pending    = resources.filter(r => r.statut === 'en attente').length;
  const shared     = resources.filter(r => r.visibilite === 'partage').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <main className="grow flex items-center justify-center">
          <p className="text-content-muted animate-pulse">Chargement...</p>
        </main>
        <MainFooter />
      </div>
    );
  }

  return (
    <RoleGuard required="authenticated">
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <PageHeader title="Mon Tableau de Bord" description="Gérez vos ressources" showBackButton={false} />

        <main className="grow">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-10">

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-3xl font-bold text-primary">{resources.length}</p>
                  <p className="text-content-muted text-sm mt-2">Ressources créées</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-3xl font-bold text-green-600">{published}</p>
                  <p className="text-content-muted text-sm mt-2">Publiées</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-3xl font-bold text-yellow-600">{pending}</p>
                  <p className="text-content-muted text-sm mt-2">En attente</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-3xl font-bold text-blue-600">{shared}</p>
                  <p className="text-content-muted text-sm mt-2">Par lien privé</p>
                </div>
              </div>

              {/* Mes Ressources */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-content">Mes Ressources</h2>
                  <Link href="/ressource/creer" className="text-primary font-semibold hover:underline text-sm">
                    + Créer une ressource
                  </Link>
                </div>

                {resources.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <p className="text-content-muted text-sm mb-4">Vous n&apos;avez pas encore créé de ressource.</p>
                    <Link href="/ressource/creer" className="text-primary font-semibold hover:underline text-sm">
                      Créer ma première ressource →
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Titre</th>
                          <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Visibilité</th>
                          <th className="px-6 py-4 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">Vues</th>
                          <th className="px-6 py-4 text-right font-semibold text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {resources.map(r => {
                          const statutInfo = STATUT_LABELS[r.statut] ?? { label: r.statut, classes: 'bg-gray-100 text-gray-600' };
                          const isShared = r.visibilite === 'partage';
                          return (
                            <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-semibold text-content">{r.titre}</p>
                                  <p className="text-xs text-content-muted">{r.category} • {r.type_ressource}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${statutInfo.classes}`}>
                                  {statutInfo.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  isShared ? 'bg-blue-100 text-blue-700' :
                                  r.visibilite === 'publie' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {isShared ? 'Partagée' : r.visibilite === 'publie' ? 'Publique' : 'Privée'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-1 text-content-muted">
                                  <Eye className="w-4 h-4" />
                                  {r.views ?? 0}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  {isShared && r.shareToken && (
                                    <button
                                      onClick={() => copyShareLink(r)}
                                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                                      title="Copier le lien de partage"
                                    >
                                      {copiedId === r.id
                                        ? <Check className="w-4 h-4 text-green-600" />
                                        : <Link2 className="w-4 h-4" />
                                      }
                                    </button>
                                  )}
                                  <Link
                                    href={`/ressource/${r.id}`}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-content-muted transition-colors"
                                    title="Voir"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  <Link
                                    href={`/ressource/${r.id}/editer`}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-primary transition-colors"
                                    title="Éditer"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Info partagée */}
                {shared > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
                    <Link2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800">
                      Les ressources <strong>partagées</strong> sont accessibles uniquement via leur lien privé.
                      Copiez le lien avec l&apos;icône <Link2 className="w-3 h-3 inline" /> et partagez-le aux personnes concernées.
                    </p>
                  </div>
                )}
              </div>

              {/* Mes Favoris */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h2 className="text-2xl font-bold text-content">Mes Favoris</h2>
                  <span className="ml-auto text-sm text-content-muted">
                    {favorites.length} ressource{favorites.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {favorites.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <Heart className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-content-muted text-sm">Aucune ressource en favori pour l&apos;instant.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                    {favorites.map(r => (
                      <div key={r.id} className="flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Link href={`/ressource/${r.id}`} className="font-semibold text-content hover:text-primary transition-colors truncate">
                              {r.titre}
                            </Link>
                            {r.category && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold shrink-0">
                                <Tag className="w-2.5 h-2.5" />{r.category}
                              </span>
                            )}
                            {r.type && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs capitalize shrink-0">
                                {r.type}
                              </span>
                            )}
                          </div>
                          {r.description && (
                            <p className="text-xs text-content-muted line-clamp-2">{r.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {r.media && (
                            <button
                              onClick={async () => {
                                const url = getMediaUrl(r.media!);
                                const name = r.media!.split('/').pop() ?? r.media!;
                                if (isSupabaseUrl(url)) await downloadFromSupabase(url, name);
                                else window.open(url, '_blank');
                              }}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Télécharger"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {r.lien && (
                            <a
                              href={r.lien}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              title="Ouvrir le lien"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <Link
                            href={`/ressource/${r.id}`}
                            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            title="Voir la ressource"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>

        <MainFooter />
      </div>
    </RoleGuard>
  );
}
