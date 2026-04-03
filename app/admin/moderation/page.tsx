'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/shared/MainHeader';
import { PageHeader } from '@/components/shared/PageHeader';
import { CheckCircle, XCircle, Eye, X } from 'lucide-react';

export default function AdminModerationPage() {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'Guide pratique : Comment gérer son budget familial',
      author: 'Marie Leclerc',
      category: 'Administratif',
      type: 'pdf',
      submittedAt: '2024-02-25',
      description: 'Un guide complet pour les familles souhaitant mieux gérer leur budget...',
      fullContent: 'Contenu complet du guide : Ce guide vous expliquera comment gérer efficacement le budget de votre famille. Vous découvrirez les meilleures pratiques pour économiser, planifier et atteindre vos objectifs financiers.'
    },
    {
      id: 2,
      title: 'Vidéo : Atelier méditation pour parents',
      author: 'Jean Moreau',
      category: 'Bien-être',
      type: 'video',
      submittedAt: '2024-02-24',
      description: 'Découvrez les techniques de méditation adaptées aux parents occupés...',
      fullContent: 'Contenu complet : Cette vidéo de 15 minutes vous propose des exercices de méditation spécialement conçus pour les parents. Vous apprendrez à gérer le stress et à trouver de la sérénité malgré l\'emploi du temps chargé.'
    },
    {
      id: 3,
      title: 'Article : Nouvelles aides sociales 2026',
      author: 'Sophie Laurent',
      category: 'Administratif',
      type: 'article',
      submittedAt: '2024-02-23',
      description: 'Résumé des nouvelles aides mises en place en 2026...',
      fullContent: 'Contenu complet : Découvrez les nouvelles aides sociales disponibles en 2026. Cet article détaille les critères d\'éligibilité, les démarches à suivre et les montants accordés.'
    }
  ]);

  const [previewData, setPreviewData] = useState<typeof resources[0] | null>(null);
  const [approvedCount, setApprovedCount] = useState(42);
  const [rejectedCount, setRejectedCount] = useState(3);

  const handleApprove = (id: number) => {
    const approved = resources.find(r => r.id === id);
    if (approved) {
      setApprovedCount(approvedCount + 1);
      setResources(resources.filter(r => r.id !== id));
      alert(`✅ Ressource "${approved.title}" approuvée et publiée !`);
    }
  };

  const handleReject = (id: number) => {
    const rejected = resources.find(r => r.id === id);
    if (rejected) {
      setRejectedCount(rejectedCount + 1);
      setResources(resources.filter(r => r.id !== id));
      alert(`❌ Ressource "${rejected.title}" rejetée. Email d'explication envoyé à ${rejected.author}.`);
    }
  };

  const handlePreview = (resource: typeof resources[0]) => {
    setPreviewData(resource);
  };

  const closePreview = () => {
    setPreviewData(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />

      <PageHeader
        title="Espace de Modération"
        description="Validez les ressources en attente de publication"
        showBackButton={true}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

        {/* Info Alert */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl shadow-sm p-4 mb-8">
          <p className="text-blue-800 text-sm">
            <span className="font-semibold">{resources.length} ressource(s)</span> en attente de validation
          </p>
        </div>

        {/* Resources List */}
        {resources.length > 0 ? (
          <div className="space-y-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Resource Card */}
                <div className="p-6 space-y-4">

                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-content">
                          {resource.title}
                        </h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          En attente
                        </span>
                      </div>
                      <p className="text-content-muted text-sm">Par <span className="font-semibold">{resource.author}</span></p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-content-muted border-y border-gray-100 py-4">
                    <div>
                      <span className="font-semibold text-content">Catégorie :</span> {resource.category}
                    </div>
                    <div>
                      <span className="font-semibold text-content">Type :</span> {resource.type}
                    </div>
                    <div>
                      <span className="font-semibold text-content">Soumise le :</span> {new Date(resource.submittedAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-semibold text-content uppercase mb-2">Description</h4>
                    <p className="text-content-muted text-sm leading-relaxed">
                      {resource.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => handlePreview(resource)}
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
            <p className="text-content-muted text-sm">Toutes les ressources en attente de validation ont été traitées !</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-bold text-primary">{approvedCount}</p>
            <p className="text-content-muted text-sm mt-2">Ressources approuvées</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            <p className="text-content-muted text-sm mt-2">Ressources rejetées</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-bold text-yellow-600">{resources.length}</p>
            <p className="text-content-muted text-sm mt-2">En attente</p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-50/50 border-b border-gray-100 p-6 flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold text-content">{previewData.title}</h2>
                <p className="text-content-muted text-sm mt-2">Par {previewData.author}</p>
              </div>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="Fermer"
              >
                <X className="w-5 h-5 text-content-muted" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-semibold text-content">Catégorie :</span>
                  <p className="text-content-muted">{previewData.category}</p>
                </div>
                <div>
                  <span className="font-semibold text-content">Type :</span>
                  <p className="text-content-muted capitalize">{previewData.type}</p>
                </div>
                <div>
                  <span className="font-semibold text-content">Soumise le :</span>
                  <p className="text-content-muted">{new Date(previewData.submittedAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-content mb-2">Description</h3>
                <p className="text-content-muted leading-relaxed">{previewData.description}</p>
              </div>

              {/* Full Content */}
              <div>
                <h3 className="font-semibold text-content mb-2">Aperçu du contenu</h3>
                <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-100">
                  <p className="text-content-muted text-sm leading-relaxed whitespace-pre-line">
                    {previewData.fullContent}
                  </p>
                </div>
              </div>

              {/* Quality Checklist */}
              <div>
                <h3 className="font-semibold text-content mb-3">Vérification qualité</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <span>Contenu approprié et pertinent</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <span>Format et présentation corrects</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span>Aucun contenu offensant ou interdit</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <span>Auteur vérifiable</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <Button
                  onClick={closePreview}
                  variant="outline"
                  className="flex-1 border-gray-200 hover:bg-gray-50 hover:text-primary h-10 rounded-xl font-semibold text-sm"
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    handleReject(previewData.id);
                    closePreview();
                  }}
                  className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 h-10 px-6 rounded-xl font-semibold text-sm transition-colors border border-red-100"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeter
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(previewData.id);
                    closePreview();
                  }}
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
  );
}

