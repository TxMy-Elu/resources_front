'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/shared/MainHeader';
import { PageHeader } from '@/components/shared/PageHeader';
import { CheckCircle, XCircle, Eye, X } from 'lucide-react';
import { getPendingResources, validateResource, suspendResource, getAdminStats, PendingResource } from '@/lib/api';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function AdminModerationPage() {
  const [resources, setResources] = useState<PendingResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<PendingResource | null>(null);
  const [publishedCount, setPublishedCount] = useState<number | null>(null);
  const [suspendedCount, setSuspendedCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pending, stats] = await Promise.all([
          getPendingResources(),
          getAdminStats(),
        ]);
        setResources(pending);
        setPublishedCount(stats.resources.published);
        setSuspendedCount(stats.resources.suspended);
      } catch (error) {
        console.error('Error fetching moderation data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await validateResource(id);
      const approved = resources.find(r => r.id === id);
      if (approved) {
        setResources(prev => prev.filter(r => r.id !== id));
        setPublishedCount(prev => (prev !== null ? prev + 1 : null));
        alert(`Ressource "${approved.titre}" approuvée et publiée.`);
      }
    } catch (error) {
      console.error('Error approving resource:', error);
      alert('Erreur lors de l\'approbation.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await suspendResource(id);
      const rejected = resources.find(r => r.id === id);
      if (rejected) {
        setResources(prev => prev.filter(r => r.id !== id));
        setSuspendedCount(prev => (prev !== null ? prev + 1 : null));
        alert(`Ressource "${rejected.titre}" rejetée.`);
      }
    } catch (error) {
      console.error('Error rejecting resource:', error);
      alert('Erreur lors du rejet.');
    }
  };

  return (
    <RoleGuard required="moderateur">
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />

        <PageHeader
          title="Espace de Modération"
          description="Validez les ressources en attente de publication"
          showBackButton={true}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl shadow-sm p-4 mb-8">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">{loading ? '…' : resources.length} ressource(s)</span> en attente de validation
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse h-40" />
              ))}
            </div>
          ) : resources.length > 0 ? (
            <div className="space-y-6">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 space-y-4">

                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-content">{resource.titre}</h3>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            En attente
                          </span>
                        </div>
                        <p className="text-content-muted text-sm">
                          Par <span className="font-semibold">{resource.createur}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-content-muted border-y border-gray-100 py-4">
                      <div>
                        <span className="font-semibold text-content">Soumise le :</span>{' '}
                        {new Date(resource.dateCreation).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => setPreviewData(resource)}
                        variant="outline"
                        className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 hover:text-primary h-10 rounded-xl font-semibold text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Aperçu
                      </Button>
                      <Button
                        onClick={() => handleReject(resource.id)}
                        className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 h-10 px-4 rounded-xl font-semibold text-sm transition-colors border border-red-100"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeter
                      </Button>
                      <Button
                        onClick={() => handleApprove(resource.id)}
                        className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 h-10 px-4 rounded-xl font-semibold text-sm transition-colors border border-green-100 ml-auto"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approuver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-content mb-2">Aucune ressource en attente</h3>
              <p className="text-content-muted text-sm">Toutes les ressources ont été traitées.</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-3xl font-bold text-primary">
                {loading || publishedCount === null ? '…' : publishedCount.toLocaleString('fr-FR')}
              </p>
              <p className="text-content-muted text-sm mt-2">Ressources publiées</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-3xl font-bold text-red-600">
                {loading || suspendedCount === null ? '…' : suspendedCount.toLocaleString('fr-FR')}
              </p>
              <p className="text-content-muted text-sm mt-2">Ressources suspendues</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {loading ? '…' : resources.length}
              </p>
              <p className="text-content-muted text-sm mt-2">En attente</p>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-50/50 border-b border-gray-100 p-6 flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-content">{previewData.titre}</h2>
                  <p className="text-content-muted text-sm mt-2">Par {previewData.createur}</p>
                </div>
                <button
                  onClick={() => setPreviewData(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  title="Fermer"
                >
                  <X className="w-5 h-5 text-content-muted" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-content">Soumise le :</span>
                    <p className="text-content-muted">
                      {new Date(previewData.dateCreation).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-content mb-3">Vérification qualité</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Contenu approprié et pertinent</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Format et présentation corrects</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Aucun contenu offensant ou interdit</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Auteur vérifiable</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <Button
                    onClick={() => setPreviewData(null)}
                    variant="outline"
                    className="flex-1 border-gray-200 hover:bg-gray-50 hover:text-primary h-10 rounded-xl font-semibold text-sm"
                  >
                    Fermer
                  </Button>
                  <Button
                    onClick={() => { handleReject(previewData.id); setPreviewData(null); }}
                    className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 h-10 px-6 rounded-xl font-semibold text-sm transition-colors border border-red-100"
                  >
                    <XCircle className="w-4 h-4" />
                    Rejeter
                  </Button>
                  <Button
                    onClick={() => { handleApprove(previewData.id); setPreviewData(null); }}
                    className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 h-10 px-6 rounded-xl font-semibold text-sm transition-colors border border-green-100"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approuver
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
