'use client';

import React, { useState } from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus, X, Check, AlertTriangle } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory, ApiCategory } from '@/lib/api';
import { useCategories } from '@/lib/hooks/useCategories';

export default function AdminCategoriesPage() {
  const { categories, loading, refresh } = useCategories();

  // Création
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // Édition inline
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);

  // Suppression
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const flash = (msg: string, type: 'ok' | 'err') => {
    if (type === 'ok') { setSuccess(msg); setError(null); }
    else { setError(msg); setSuccess(null); }
    setTimeout(() => { setSuccess(null); setError(null); }, 4000);
  };

  // ── Créer ──
  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await createCategory(newName.trim(), newDesc.trim());
      setNewName(''); setNewDesc(''); setShowCreate(false);
      flash('Catégorie créée avec succès.', 'ok');
      await refresh();
    } catch (e: unknown) {
      flash(e instanceof Error ? e.message : 'Erreur lors de la création.', 'err');
    } finally { setCreating(false); }
  };

  // ── Éditer ──
  const startEdit = (cat: ApiCategory) => {
    setEditId(cat.id); setEditName(cat.name); setEditDesc(cat.description ?? '');
  };

  const handleSave = async () => {
    if (!editId || !editName.trim()) return;
    setSaving(true);
    try {
      await updateCategory(editId, editName.trim(), editDesc.trim());
      setEditId(null);
      flash('Catégorie mise à jour.', 'ok');
      await refresh();
    } catch (e: unknown) {
      flash(e instanceof Error ? e.message : 'Erreur lors de la mise à jour.', 'err');
    } finally { setSaving(false); }
  };

  // ── Supprimer ──
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteId);
      setDeleteId(null);
      flash('Catégorie supprimée. Les ressources associées ont été détachées.', 'ok');
      await refresh();
    } catch (e: unknown) {
      flash(e instanceof Error ? e.message : 'Erreur lors de la suppression.', 'err');
    } finally { setDeleting(false); }
  };

  const toDelete = categories.find(c => c.id === deleteId);

  return (
    <RoleGuard required="admin">
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <PageHeader title="Gestion des Catégories" description="Créer, modifier et supprimer les catégories de ressources" />

        <main className="grow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

            {/* Alertes */}
            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                <Check className="w-4 h-4 shrink-0" /> {success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {/* Header + bouton créer */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-content">
                {loading ? '…' : `${categories.length} catégorie${categories.length !== 1 ? 's' : ''}`}
              </h2>
              <Button
                onClick={() => { setShowCreate(true); setEditId(null); }}
                className="bg-primary text-white hover:bg-primary-700 h-9 px-4 rounded-xl font-semibold text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Nouvelle catégorie
              </Button>
            </div>

            {/* Formulaire création */}
            {showCreate && (
              <div className="bg-white rounded-2xl border border-primary/20 shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-content">Nouvelle catégorie</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Nom *</Label>
                    <Input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="Ex : Famille"
                      className="h-9 rounded-xl"
                      onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Description</Label>
                    <Input
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      placeholder="Courte description…"
                      className="h-9 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => { setShowCreate(false); setNewName(''); setNewDesc(''); }}
                    className="h-9 px-4 rounded-xl text-sm"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!newName.trim() || creating}
                    className="bg-primary text-white hover:bg-primary-700 h-9 px-4 rounded-xl text-sm font-semibold"
                  >
                    {creating ? 'Création…' : 'Créer'}
                  </Button>
                </div>
              </div>
            )}

            {/* Liste */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-8 space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}
                </div>
              ) : categories.length === 0 ? (
                <div className="p-12 text-center text-content-muted text-sm">
                  Aucune catégorie. Créez-en une ci-dessus.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Description</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Ressources</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {categories.map(cat => (
                      <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          {editId === cat.id ? (
                            <Input
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="h-8 rounded-lg text-sm w-full max-w-[180px]"
                              onKeyDown={e => e.key === 'Enter' && handleSave()}
                              autoFocus
                            />
                          ) : (
                            <span className="font-semibold text-content">{cat.name}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          {editId === cat.id ? (
                            <Input
                              value={editDesc}
                              onChange={e => setEditDesc(e.target.value)}
                              className="h-8 rounded-lg text-sm w-full"
                              placeholder="Description…"
                            />
                          ) : (
                            <span className="text-content-muted">{cat.description || '—'}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                            (cat as ApiCategory & { count?: number }).count
                              ? 'bg-primary/10 text-primary'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {(cat as ApiCategory & { count?: number }).count ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {editId === cat.id ? (
                              <>
                                <button
                                  onClick={handleSave}
                                  disabled={saving}
                                  className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                  title="Enregistrer"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditId(null)}
                                  className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                                  title="Annuler"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(cat)}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-content-muted transition-colors"
                                  title="Modifier"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteId(cat.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>

        {/* Modal confirmation suppression */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-xl shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-content text-lg">Supprimer la catégorie</h3>
                  <p className="text-content-muted text-sm mt-1">
                    Vous allez supprimer <strong>&quot;{toDelete?.name}&quot;</strong>.
                  </p>
                </div>
              </div>

              {((toDelete as (ApiCategory & { count?: number }))?.count ?? 0) > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
                  ⚠ Cette catégorie est utilisée par{' '}
                  <strong>{(toDelete as ApiCategory & { count?: number }).count} ressource{(toDelete as ApiCategory & { count?: number }).count !== 1 ? 's' : ''}</strong>.
                  Elles seront conservées mais <strong>sans catégorie</strong>.
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  className="h-9 px-4 rounded-xl text-sm"
                  disabled={deleting}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 text-white hover:bg-red-700 h-9 px-4 rounded-xl text-sm font-semibold"
                >
                  {deleting ? 'Suppression…' : 'Supprimer'}
                </Button>
              </div>
            </div>
          </div>
        )}

        <MainFooter />
      </div>
    </RoleGuard>
  );
}
