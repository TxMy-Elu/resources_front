'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/shared/MainHeader';
import { PageHeader } from '@/components/shared/PageHeader';
import { CheckCircle, XCircle, Eye, X, ExternalLink, FileText, MessageSquare, Trash2 } from 'lucide-react';
import { getPendingResources, validateResource, suspendResource, PendingResource, getMediaUrl, getModerationComments, deleteModerationComment, ModerationComment } from '@/lib/api';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function AdminModerationPage() {
  const [resources, setResources] = useState<PendingResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<PendingResource | null>(null);

  // Commentaires
  const [activeTab, setActiveTab] = useState<'ressources' | 'commentaires'>('ressources');
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentTotal, setCommentTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const pending = await getPendingResources();
        setResources(pending);
      } catch (error) {
        console.error('Error fetching pending resources:', error);
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

  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await getModerationComments();
      setComments(res.data);
      setCommentTotal(res.pagination.total);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('Supprimer ce commentaire définitivement ?')) return;
    try {
      await deleteModerationComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
      setCommentTotal(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Erreur lors de la suppression.');
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

          {/* Onglets */}
          <div className="flex gap-2 mb-6 border-b border-gray-100">
            <button
              onClick={() => setActiveTab('ressources')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors ${
                activeTab === 'ressources'
                  ? 'bg-white border border-b-white border-gray-100 text-primary -mb-px'
                  : 'text-content-muted hover:text-content'
              }`}
            >
              <FileText className="w-4 h-4" />
              Ressources
              {!loading && resources.length > 0 && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{resources.length}</span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('commentaires'); if (comments.length === 0) loadComments(); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors ${
                activeTab === 'commentaires'
                  ? 'bg-white border border-b-white border-gray-100 text-primary -mb-px'
                  : 'text-content-muted hover:text-content'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Commentaires
              {commentTotal > 0 && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{commentTotal}</span>
              )}
            </button>
          </div>

          {/* ── Onglet Ressources ── */}
          {activeTab === 'ressources' && (<>
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

          {/* Compteur */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center max-w-xs mx-auto">
              <p className="text-3xl font-bold text-yellow-600">
                {loading ? '…' : resources.length}
              </p>
              <p className="text-content-muted text-sm mt-2">Ressource{resources.length !== 1 ? 's' : ''} en attente</p>
            </div>
          </div>
          </>)}

          {/* ── Onglet Commentaires ── */}
          {activeTab === 'commentaires' && (
            <div className="space-y-4">
              {commentsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
                </div>
              ) : comments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-content mb-2">Aucun commentaire</h3>
                  <p className="text-content-muted text-sm">Il n&apos;y a aucun commentaire à modérer.</p>
                </div>
              ) : (
                <>
                  <p className="text-content-muted text-sm font-medium">{commentTotal} commentaire{commentTotal !== 1 ? 's' : ''} au total</p>
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start">
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-content">
                            {comment.author?.name ?? 'Utilisateur supprimé'}
                          </span>
                          {comment.rating !== null && (
                            <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full px-2 py-0.5 font-semibold">
                              ★ {comment.rating}/5
                            </span>
                          )}
                          <span className="text-xs text-content-muted ml-auto">
                            {new Date(comment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-content leading-relaxed">{comment.content}</p>
                        {comment.resource && (
                          <p className="text-xs text-content-muted">
                            Sur : <span className="font-medium text-primary">{comment.resource.titre}</span>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors shrink-0"
                        title="Supprimer ce commentaire"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {previewData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-3xl flex flex-col max-h-[92vh]">

              {/* Header */}
              <div className="sticky top-0 bg-gray-50/80 border-b border-gray-100 px-6 py-4 flex justify-between items-start gap-4 shrink-0 rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-bold text-content">{previewData.titre}</h2>
                  <p className="text-content-muted text-sm mt-0.5">
                    Par <span className="font-semibold">{previewData.createur}</span>
                    {' · '}
                    {new Date(previewData.dateCreation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => setPreviewData(null)} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors shrink-0">
                  <X className="w-5 h-5 text-content-muted" />
                </button>
              </div>

              {/* Body — scrollable */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-100">
                    En attente
                  </span>
                  {previewData.type && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                      {previewData.type}
                    </span>
                  )}
                  {previewData.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                      {previewData.category}
                    </span>
                  )}
                  {previewData.visibilite && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                      {{ private: 'Privé', partage: 'Partagé', public: 'Public' }[previewData.visibilite] ?? previewData.visibilite}
                    </span>
                  )}
                </div>

                {/* Lien externe */}
                {previewData.lien && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Lien</p>
                    <a
                      href={previewData.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {previewData.lien}
                    </a>
                  </div>
                )}

                {/* Description */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</p>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                    {previewData.description || <span className="text-gray-400 italic">Aucune description</span>}
                  </div>
                </div>

                {/* Contenu complet */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contenu</p>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                    {previewData.contenu || <span className="text-gray-400 italic">Aucun contenu</span>}
                  </div>
                </div>

                {/* Média */}
                {previewData.media && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Média joint</p>
                    <a
                      href={getMediaUrl(previewData.media)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors w-full"
                    >
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm text-blue-700 font-medium truncate">{previewData.media}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-auto" />
                    </a>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-4 flex gap-3 shrink-0 bg-gray-50/30 rounded-b-2xl">
                <Button
                  onClick={() => setPreviewData(null)}
                  variant="outline"
                  className="h-10 rounded-xl border-gray-200 hover:bg-gray-50 px-4"
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => { handleReject(previewData.id); setPreviewData(null); }}
                  className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 h-10 px-5 rounded-xl font-semibold text-sm transition-colors border border-red-100 ml-auto"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeter
                </Button>
                <Button
                  onClick={() => { handleApprove(previewData.id); setPreviewData(null); }}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white h-10 px-5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approuver
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
