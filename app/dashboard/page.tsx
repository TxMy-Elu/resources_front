'use client';

import React, { useEffect, useState } from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { Heart, Eye, Edit2, Trash2 } from 'lucide-react';
import { getResources, ApiResource } from '@/lib/api';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function DashboardPage() {
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        setResources(data.slice(0, 3)); // Limiter à 3 ressources pour l'affichage
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Le rendu utilise directement les ressources de l'API
  const totalViews = resources.reduce((sum, r) => sum + (r.views || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <main className="grow flex items-center justify-center">
          <p className="text-content-muted text-lg">Chargement...</p>
        </main>
        <MainFooter />
      </div>
    );
  }

  return (
    <RoleGuard required="authenticated">
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Mon Tableau de Bord" description="Gérez vos ressources et favoris" showBackButton={false} />

      <main className="grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-primary">3</p>
                <p className="text-content-muted text-sm mt-2">Ressources créées</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-primary">2</p>
                <p className="text-content-muted text-sm mt-2">Ressources enregistrées</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-primary">546</p>
                <p className="text-content-muted text-sm mt-2">Vues totales</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-primary">102</p>
                <p className="text-content-muted text-sm mt-2">Sauvegarde totales</p>
              </div>
            </div>

            {/* Mes Ressources */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-content">Mes Ressources</h2>
                <Link href="/ressource/creer" className="text-primary font-semibold hover:underline">
                  + Créer une ressource
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Titre</th>
                      <th className="px-6 py-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">Vues</th>
                      <th className="px-6 py-4 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">Enregistrées</th>
                      <th className="px-6 py-4 text-right font-semibold text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {resources.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-content">{r.titre}</p>
                            <p className="text-xs text-content-muted">{r.category} • {r.type_ressource}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            r.statut === 'publie' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {r.statut === 'publie' ? 'Publié' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="w-4 h-4 text-primary" />
                            {r.views || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            0
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/ressource/${r.id}/editer`} className="p-2 hover:bg-gray-100 rounded-lg text-primary transition-colors" title="Éditer">
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors" title="Supprimer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ressources Enregistrées */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-content">Ressources Créées Récemment</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.slice(0, 2).map(r => (
                  <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-content">{r.titre}</h3>
                        <p className="text-xs text-content-muted mt-1">Par {r.createur}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{r.category}</span>
                      <span className="text-xs text-content-muted">{new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <MainFooter />
    </div>
    </RoleGuard>
  );
}

