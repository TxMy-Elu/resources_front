'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import Link from 'next/link';

export default function CreerRessourcePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    visibility: 'public',
    file: null as File | null,
    url: '',
    duration: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, files } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] : value
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (formData.description.trim().length < 20) newErrors.description = 'La description doit contenir au moins 20 caractères';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.type) newErrors.type = 'Le type de ressource est requis';

    if (formData.type === 'link' && !formData.url) {
      newErrors.url = 'L\'URL est requise pour ce type';
    }
    if (formData.type === 'file' && !formData.file) {
      newErrors.file = 'Le fichier est requis pour ce type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage(
        formData.visibility === 'public'
          ? 'Ressource créée ! Elle sera visible après validation par un modérateur.'
          : `Ressource créée avec la visibilité "${formData.visibility}" !`
      );
      setFormData({
        title: '',
        description: '',
        category: '',
        type: '',
        visibility: 'public',
        file: null,
        url: '',
        duration: ''
      });
      setIsSubmitting(false);

      // Reset success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1000);
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

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-100 rounded-2xl shadow-sm p-4">
                <p className="text-green-800 text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold text-gray-600">
                  Titre de la ressource *
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Guide pratique sur..."
                  className="h-11 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 font-medium text-content"
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold text-gray-600">
                  Description détaillée *
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre ressource en détail (minimum 20 caractères)..."
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary/20 bg-gray-50/50 font-medium text-content px-4 py-3 resize-none outline-none"
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-semibold text-gray-600">
                    Catégorie *
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="h-11 border border-gray-200 rounded-xl bg-gray-50/50 flex items-center px-4 text-content-muted font-medium text-sm cursor-pointer hover:bg-gray-100/60 transition-colors w-full outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Administratif">Administratif</option>
                    <option value="Bien-être">Bien-être</option>
                    <option value="Santé">Santé</option>
                    <option value="Travail">Travail</option>
                    <option value="Famille">Famille</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
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
                    className="h-11 border border-gray-200 rounded-xl bg-gray-50/50 flex items-center px-4 text-content-muted font-medium text-sm cursor-pointer hover:bg-gray-100/60 transition-colors w-full outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="article">Article</option>
                    <option value="video">Vidéo</option>
                    <option value="pdf">PDF</option>
                    <option value="audio">Podcast/Audio</option>
                    <option value="link">Lien web</option>
                    <option value="event">Événement</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
                </div>
              </div>

              {/* Conditional Fields */}
              {formData.type === 'file' && (
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-xs font-semibold text-gray-600">
                    Télécharger le fichier *
                  </Label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    className="h-11 border border-gray-200 rounded-xl bg-gray-50/50 font-medium text-content px-4 py-2 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-700"
                  />
                  {errors.file && <p className="text-red-500 text-xs">{errors.file}</p>}
                </div>
              )}

              {formData.type === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-xs font-semibold text-gray-600">
                    URL *
                  </Label>
                  <Input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/20 bg-gray-50/50 font-medium text-content"
                  />
                  {errors.url && <p className="text-red-500 text-xs">{errors.url}</p>}
                </div>
              )}

              {(formData.type === 'video' || formData.type === 'audio') && (
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-xs font-semibold text-gray-600">
                    Durée (optionnel)
                  </Label>
                  <Input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Ex: 15:30 ou 2h 30min"
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/20 bg-gray-50/50 font-medium text-content"
                  />
                </div>
              )}

              {/* Visibility */}
              <div className="space-y-3 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <Label className="text-xs font-semibold text-gray-600 block">Niveau de visibilité *</Label>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="public"
                      name="visibility"
                      value="public"
                      checked={formData.visibility === 'public'}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="public" className="text-xs font-semibold text-content cursor-pointer">
                        Publique
                      </Label>
                      <p className="text-xs text-content-muted">En attente de validation d&apos;un modérateur avant publication</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="shared"
                      name="visibility"
                      value="shared"
                      checked={formData.visibility === 'shared'}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="shared" className="text-xs font-semibold text-content cursor-pointer">
                        Partagée
                      </Label>
                      <p className="text-xs text-content-muted">Visible uniquement par les utilisateurs invités</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="private"
                      name="visibility"
                      value="private"
                      checked={formData.visibility === 'private'}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="private" className="text-xs font-semibold text-content cursor-pointer">
                        Privée
                      </Label>
                      <p className="text-xs text-content-muted">Visible uniquement par vous</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3 p-4 bg-blue-50/70 rounded-2xl border border-blue-100 shadow-sm">
                <Checkbox id="consent" className="mt-1" />
                <Label htmlFor="consent" className="text-xs text-blue-800 leading-relaxed cursor-pointer">
                  Je certifie que cette ressource est originale ou que j&apos;ai les droits nécessaires pour la partager. Elle respectera les conditions d&apos;utilisation et ne contient pas de contenu dangereux ou offensant.
                </Label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-8 h-11 rounded-xl text-base transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Création en cours...' : 'Créer la ressource'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-white text-content border-gray-200 hover:bg-gray-50 font-semibold px-8 h-11 rounded-xl text-base transition-all shadow-sm"
                >
                  <Link href="/catalogue" className="w-full h-full flex items-center justify-center">
                    Annuler
                  </Link>
                </Button>
              </div>
            </form>

            {/* Help */}
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

