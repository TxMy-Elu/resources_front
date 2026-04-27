'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getResourceComments, addResourceComment, type ResourceComment } from '@/lib/api';
import { Send, Star, Loader } from 'lucide-react';

interface CommentsProps {
  resourceId: number;
  isAuthenticated: boolean;
}

export function ResourceComments({ resourceId, isAuthenticated }: CommentsProps) {
  const [comments, setComments] = useState<ResourceComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Formulaire
  const [commentForm, setCommentForm] = useState({
    content: '',
    rating: 5
  });

  // Charger les commentaires
  useEffect(() => {
    loadComments();
  }, [resourceId, page]);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getResourceComments({
        id: resourceId,
        page,
        limit: 10
      });

      if (response.data) {
        setComments(response.data);
      }

      if (response.pagination) {
        setTotalPages(response.pagination.pages || 1);
      }
    } catch (err) {
      console.error('Erreur chargement commentaires:', err);
      setError('Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentForm.content.trim()) {
      setError('Veuillez écrire un commentaire');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await addResourceComment(resourceId, {
        content: commentForm.content,
        rating: commentForm.rating
      });

      // Réinitialiser le formulaire
      setCommentForm({ content: '', rating: 5 });

      // Recharger
      await loadComments();
    } catch (err) {
      console.error('Erreur ajout commentaire:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, onUpdate, disabled = false }: { rating: number; onUpdate: (r: number) => void; disabled?: boolean }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onUpdate(star)}
          disabled={disabled}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Section Ajout Commentaire */}
      {isAuthenticated ? (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ajouter un commentaire</h3>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="space-y-4">
            {/* Rating */}
            <div>
              <Label htmlFor="rating" className="text-sm font-semibold text-gray-700 mb-2 block">
                Note (1-5 étoiles)
              </Label>
              <StarRating rating={commentForm.rating} onUpdate={(r) => setCommentForm({ ...commentForm, rating: r })} />
            </div>

            {/* Contenu */}
            <div>
              <Label htmlFor="content" className="text-sm font-semibold text-gray-700 mb-2 block">
                Votre commentaire *
              </Label>
              <Textarea
                id="content"
                placeholder="Partagez votre avis sur cette ressource..."
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                disabled={submitting}
                className="h-24 rounded-xl border-gray-200 bg-white text-sm resize-none focus-visible:ring-1 focus-visible:ring-primary/20"
              />
              <p className="text-xs text-gray-500 mt-1">{commentForm.content.length}/500 caractères</p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting || !commentForm.content.trim()}
              className="w-full bg-primary hover:bg-primary-700 text-white h-10 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Publication...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publier le commentaire
                </>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
          <p className="text-sm text-blue-800">
            📝 <strong>Connectez-vous</strong> pour ajouter un commentaire et partager votre avis.
          </p>
        </div>
      )}

      {/* Section Affichage Commentaires */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Avis et commentaires ({comments.length})
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{comment.author}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>

                {/* Contenu */}
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="rounded-lg border-gray-200 hover:bg-gray-50"
                >
                  Précédent
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      variant={page === i + 1 ? 'default' : 'outline'}
                      className={`h-8 w-8 rounded-lg ${page === i + 1 ? 'bg-primary text-white' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  className="rounded-lg border-gray-200 hover:bg-gray-50"
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 text-center">
            <p className="text-gray-600">
              Aucun commentaire pour le moment. 💭
              <br />
              Soyez le premier à partager votre avis !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

