'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import Link from 'next/link';
import { createResource, getCategories, ApiCategory } from '@/lib/api';

const TYPES = [
  { value: 'article',  label: 'Article'  },
  { value: 'video',    label: 'Vidéo'    },
  { value: 'podcast',  label: 'Podcast'  },
  { value: 'activite', label: 'Activité' },
  { value: 'jeu',      label: 'Jeu'      },
  { value: 'lien',     label: 'Lien web' },
];

export default function CreerRessourcePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    contenu: '',
    categoryId: '',
    type: '',
    visibilite: 'public',
    lien: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.titre.trim()) newErrors.titre = 'Le titre est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (formData.description.trim().length < 20) newErrors.description = 'La description doit contenir au moins 20 caractères';
    if (!formData.contenu.trim()) newErrors.contenu = 'Le contenu est requis';
    if (!formData.categoryId) newErrors.categoryId = 'La catégorie est requise';
    if (!formData.type) newErrors.type = 'Le type de ressource est requis';
    if (formData.type === 'lien' && !formData.lien) newErrors.lien = "L'URL est requise pour ce type";
    if (!formData.consent) newErrors.consent = 'Vous devez accepter les conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      await createResource({
        titre: formData.titre,
        description: formData.description,
        contenu: formData.contenu,
        type: formData.type,
        visibilite: formData.visibilite,
        categoryId: Number(formData.categoryId),
        statut: 'en attente',
        lien: formData.lien || undefined,
      });

      setSuccessMessage('Ressource soumise avec succès ! Elle sera visible après validation par un administrateur.');
      setFormData({
        titre: '',
        description: '',
        contenu: '',
        categoryId: '',
        type: '',
        visibilite: 'public',
        lien: '',
        consent: false,
      });

      setTimeout(() => router.push('/catalogue'), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col selection:bg-secondary/30 selection:text-primary-900">
      <MainHeader />

      <main className="grow">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-content mb-1">Créer une Ressource</h1>
              <p className="text-content-muted text-sm">Partagez votre savoir-faire avec notre communauté d&apos;entraide</p>
            </div>

            {successMessage && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                <p className="text-green-800 text-sm font-medium">{successMessage}</p>
                <p className="text-green-700 text-xs mt-1">Redirection vers le catalogue...</p>
              </div>
            )}

            {apiError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <p className="text-red-800 text-sm font-medium">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="titre" className="text-xs font-semibold text-gray-600">
                  Titre de la ressource *
                </Label>
                <Input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Ex: Guide pratique sur..."
                  className="h-11 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 font-medium text-content"
                />
                {errors.titre && <p className="text-red-500 text-xs">{errors.titre}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold text-gray-600">
                  Description courte *
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Résumé visible dans les listes (minimum 20 caractères)..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary/20 bg-gray-50/50 font-medium text-content px-4 py-3 resize-none outline-none text-sm"
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>

              {/* Contenu */}
              <div className="space-y-2">
                <Label htmlFor="contenu" className="text-xs font-semibold text-gray-600">
                  Contenu complet *
                </Label>
                <textarea
                  id="contenu"
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  placeholder="Contenu détaillé de la ressource..."
                  rows={6}
                  className="w-full border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary/20 bg-gray-50/50 font-medium text-content px-4 py-3 resize-none outline-none text-sm"
                />
                {errors.contenu && <p className="text-red-500 text-xs">{errors.contenu}</p>}
              </div>

              {/* Catégorie & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="text-xs font-semibold text-gray-600">
                    Catégorie *
                  </Label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="h-11 border border-gray-200 rounded-xl bg-gray-50/50 px-4 text-content-muted font-medium text-sm w-full outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-semibold text-gray-600">
                    Type de ressource *
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="h-11 border border-gray-200 rounded-xl bg-gray-50/50 px-4 text-content-muted font-medium text-sm w-full outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner un type</option>
                    {TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
                </div>
              </div>

              {/* Lien (si type lien) */}
              {formData.type === 'lien' && (
                <div className="space-y-2">
                  <Label htmlFor="lien" className="text-xs font-semibold text-gray-600">
                    URL *
                  </Label>
                  <Input
                    type="url"
                    id="lien"
                    name="lien"
                    value={formData.lien}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/20 bg-gray-50/50 font-medium text-content"
                  />
                  {errors.lien && <p className="text-red-500 text-xs">{errors.lien}</p>}
                </div>
              )}

              {/* Visibilité */}
              <div className="space-y-3 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <Label className="text-xs font-semibold text-gray-600 block">Niveau de visibilité *</Label>
                <div className="space-y-3">
                  {[
                    { value: 'public',  label: 'Publique',  desc: 'Visible à tous après validation par un administrateur' },
                    { value: 'partage', label: 'Partagée',  desc: 'Accessible uniquement via un lien privé' },
                    { value: 'private', label: 'Privée',    desc: 'Visible uniquement par vous' },
                  ].map(opt => (
                    <div key={opt.value} className="flex items-start gap-3">
                      <input
                        type="radio"
                        id={opt.value}
                        name="visibilite"
                        value={opt.value}
                        checked={formData.visibilite === opt.value}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <div>
                        <Label htmlFor={opt.value} className="text-xs font-semibold text-content cursor-pointer">
                          {opt.label}
                        </Label>
                        <p className="text-xs text-content-muted">{opt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statut info */}
              <div className="flex items-center gap-3 p-4 bg-yellow-50/70 rounded-2xl border border-yellow-100">
                <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-800 leading-relaxed">
                  Toute ressource soumise sera placée <strong>en attente de validation</strong> et devra être approuvée par un administrateur avant d&apos;être publiée.
                </p>
              </div>

              {/* Consentement */}
              <div className="flex items-start gap-3 p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, consent: !!checked }))
                  }
                  className="mt-1"
                />
                <Label htmlFor="consent" className="text-xs text-blue-800 leading-relaxed cursor-pointer">
                  Je certifie que cette ressource est originale ou que j&apos;ai les droits nécessaires pour la partager. Elle respecte les conditions d&apos;utilisation et ne contient pas de contenu dangereux ou offensant.
                </Label>
              </div>
              {errors.consent && <p className="text-red-500 text-xs -mt-4">{errors.consent}</p>}

              {/* Boutons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !!successMessage}
                  className="flex-1 bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-8 h-11 rounded-xl text-base transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Soumettre la ressource'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-white text-content border-gray-200 hover:bg-gray-50 font-semibold px-8 h-11 rounded-xl text-base transition-all shadow-sm"
                  asChild
                >
                  <Link href="/catalogue">Annuler</Link>
                </Button>
              </div>
            </form>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-content-muted text-xs">
                Questions ? <Link href="/faq" className="text-primary font-semibold hover:underline">Consultez notre aide</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
