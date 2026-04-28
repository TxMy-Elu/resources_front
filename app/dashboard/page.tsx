'use client';

import React, { useEffect, useState } from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { Eye, Edit2, Link2, Check } from 'lucide-react';
import { getMyResources, ApiResource } from '@/lib/api';
import { RoleGuard } from '@/components/shared/RoleGuard';

const STATUT_LABELS: Record<string, { label: string; classes: string }> = {
  'publie':      { label: 'Publié',       classes: 'bg-green-100 text-green-700'  },
  'en attente':  { label: 'En attente',   classes: 'bg-yellow-100 text-yellow-700' },
  'brouillon':   { label: 'Brouillon',    classes: 'bg-gray-100 text-gray-600'     },
  'suspendu':    { label: 'Suspendu',     classes: 'bg-red-100 text-red-700'       },
};

export default function DashboardPage() {
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    getMyResources()
      .then(setResources)
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

            </div>
          </div>
        </main>

        <MainFooter />
      </div>
    </RoleGuard>
  );
}
