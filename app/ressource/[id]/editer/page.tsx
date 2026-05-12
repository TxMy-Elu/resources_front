'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { getResourceById, updateResource } from '@/lib/api';
import { useCategories } from '@/lib/hooks/useCategories';
import { RoleGuard } from '@/components/shared/RoleGuard';

const TYPES = [
  { value: 'article',  label: 'Article'  },
  { value: 'video',    label: 'Vidéo'    },
  { value: 'podcast',  label: 'Podcast'  },
  { value: 'activite', label: 'Activité' },
  { value: 'jeu',      label: 'Jeu'      },
  { value: 'lien',     label: 'Lien web' },
];

export default function EditRessourcePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    contenu: '',
    categoryId: '',
    type: '',
    visibilite: 'public',
    lien: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const resource = await getResourceById(id);

        if (!resource) {
          setNotFound(true);
          return;
        }
        setFormData({
          titre:       resource.titre,
          description: resource.description,
          contenu:     resource.contenu ?? '',
          categoryId:  resource.categoryId?.toString() ?? '',
          type:        resource.type_ressource,
          visibilite:  resource.visibilite,
          lien:        resource.lien ?? '',
        });
      } catch {
        setApiError('Impossible de charger la ressource.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre.trim() || !formData.description.trim()) {
      setApiError('Le titre et la description sont requis.');
      return;
    }

    setSaving(true);
    setApiError('');

    try {
      await updateResource(Number(id), {
        titre:       formData.titre,
        description: formData.description,
        contenu:     formData.contenu,
        type:        formData.type,
        visibilite:  formData.visibilite,
        categoryId:  Number(formData.categoryId),
        statut:      'en attente',
        lien:        formData.lien || undefined,
      });

      setSuccessMessage('Ressource mise à jour. Elle doit être re-validée par un administrateur avant publication.');
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour.';
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <PageHeader title="Éditer une Ressource" description="Chargement..." showBackButton={true} />
        <main className="grow flex items-center justify-center">
          <div className="text-content-muted text-sm animate-pulse">Chargement de la ressource...</div>
        </main>
        <MainFooter />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <PageHeader title="Éditer une Ressource" description="" showBackButton={true} />
        <main className="grow flex flex-col items-center justify-center gap-4">
          <p className="text-content font-semibold">Ressource introuvable.</p>
          <Link href="/dashboard" className="text-primary text-sm font-semibold hover:underline">
            Retour au tableau de bord
          </Link>
        </main>
        <MainFooter />
      </div>
    );
  }

  return (
    <RoleGuard required="authenticated">
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Éditer une Ressource" description="Modifiez votre ressource" showBackButton={true} />

      <main className="grow">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">

            {successMessage && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                <p className="text-green-800 text-sm font-medium">{successMessage}</p>
                <p className="text-green-700 text-xs mt-1">Redirection...</p>
              </div>
            )}

            {apiError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <p className="text-red-800 text-sm font-medium">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <Label htmlFor="titre" className="text-xs font-semibold text-gray-600">Titre *</Label>
                <Input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Titre de la ressource..."
                  className="h-11 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold text-gray-600">Description courte *</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Résumé visible dans les listes..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl bg-gray-50/50 px-4 py-3 resize-none outline-none focus:ring-1 focus:ring-primary/20 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenu" className="text-xs font-semibold text-gray-600">Contenu complet</Label>
                <textarea
                  id="contenu"
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  placeholder="Contenu détaillé..."
                  rows={6}
                  className="w-full border border-gray-200 rounded-xl bg-gray-50/50 px-4 py-3 resize-none outline-none focus:ring-1 focus:ring-primary/20 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="text-xs font-semibold text-gray-600">Catégorie *</Label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50/50 px-4 text-sm outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-semibold text-gray-600">Type *</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50/50 px-4 text-sm outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner...</option>
                    {TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.type === 'lien' && (
                <div className="space-y-2">
                  <Label htmlFor="lien" className="text-xs font-semibold text-gray-600">URL *</Label>
                  <Input
                    type="url"
                    id="lien"
                    name="lien"
                    value={formData.lien}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/20 bg-gray-50/50"
                  />
                </div>
              )}

              <div className="space-y-3 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <Label className="text-xs font-semibold text-gray-600 block">Niveau de visibilité</Label>
                <div className="space-y-2">
                  {[
                    { value: 'public',  label: 'Publique',  desc: 'Visible à tous après re-validation' },
                    { value: 'partage', label: 'Partagée',  desc: 'Accessible uniquement via un lien privé' },
                    { value: 'private', label: 'Privée',    desc: 'Visible uniquement par vous' },
                  ].map(opt => (
                    <div key={opt.value} className="flex items-start gap-3">
                      <input
                        type="radio"
                        id={`vis-${opt.value}`}
                        name="visibilite"
                        value={opt.value}
                        checked={formData.visibilite === opt.value}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <div>
                        <Label htmlFor={`vis-${opt.value}`} className="text-xs font-semibold cursor-pointer">{opt.label}</Label>
                        <p className="text-xs text-content-muted">{opt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info re-validation */}
              <div className="flex items-center gap-3 p-4 bg-yellow-50/70 rounded-2xl border border-yellow-100">
                <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-800 leading-relaxed">
                  Toute modification repassera la ressource <strong>en attente de validation</strong> administrateur.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving || !!successMessage}
                  className="flex-1 bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-8 h-11 rounded-xl text-base disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-white text-content border-gray-200 hover:bg-gray-50 font-semibold px-8 h-11 rounded-xl text-base"
                  asChild
                >
                  <Link href="/dashboard">Annuler</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
    </RoleGuard>
  );
}
