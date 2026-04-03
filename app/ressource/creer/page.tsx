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
    const { name, value, type, files } = e.target as any;
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

      <main className="flex-grow">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-2xl border border-border-standard/60 shadow-sm space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-content mb-1">Créer une Ressource</h1>
              <p className="text-content-muted text-sm">Partagez votre savoir-faire avec notre communauté d'entraide</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold text-content">
                  Titre de la ressource *
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Guide pratique sur..."
                  className="h-11 border-border-standard rounded-lg focus:ring-2 focus:ring-primary/20 bg-surface-muted/50 font-medium text-content"
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold text-content">
                  Description détaillée *
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre ressource en détail (minimum 20 caractères)..."
                  rows={5}
                  className="w-full border border-border-standard rounded-lg focus:ring-2 focus:ring-primary/20 bg-surface-muted/50 font-medium text-content px-4 py-3 resize-none"
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-semibold text-content">
                    Catégorie *
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="h-11 border border-border-standard rounded-lg bg-surface-muted/50 flex items-center px-4 text-content-muted font-medium text-sm cursor-pointer hover:bg-surface-muted transition-colors w-full"
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
                  <Label htmlFor="type" className="text-xs font-semibold text-content">
                    Type de ressource *
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="h-11 border border-border-standard rounded-lg bg-surface-muted/50 flex items-center px-4 text-content-muted font-medium text-sm cursor-pointer hover:bg-surface-muted transition-colors w-full"
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
                  <Label htmlFor="file" className="text-xs font-semibold text-content">
                    Télécharger le fichier *
                  </Label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    className="h-11 border border-border-standard rounded-lg bg-surface-muted/50 font-medium text-content px-4 py-2 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-700"
                  />
                  {errors.file && <p className="text-red-500 text-xs">{errors.file}</p>}
                </div>
              )}

              {formData.type === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-xs font-semibold text-content">
                    URL *
                  </Label>
                  <Input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="h-11 border-border-standard rounded-lg focus:ring-2 focus:ring-primary/20 bg-surface-muted/50 font-medium text-content"
                  />
                  {errors.url && <p className="text-red-500 text-xs">{errors.url}</p>}
                </div>
              )}

              {(formData.type === 'video' || formData.type === 'audio') && (
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-xs font-semibold text-content">
                    Durée (optionnel)
                  </Label>
                  <Input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Ex: 15:30 ou 2h 30min"
                    className="h-11 border-border-standard rounded-lg focus:ring-2 focus:ring-primary/20 bg-surface-muted/50 font-medium text-content"
                  />
                </div>
              )}

              {/* Visibility */}
              <div className="space-y-3 p-4 bg-surface-muted/30 rounded-lg border border-border-standard/30">
                <Label className="text-xs font-semibold text-content block">Niveau de visibilité *</Label>
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
                      <p className="text-xs text-content-muted">En attente de validation d'un modérateur avant publication</p>
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
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Checkbox id="consent" className="mt-1" />
                <Label htmlFor="consent" className="text-xs text-blue-800 leading-relaxed cursor-pointer">
                  Je certifie que cette ressource est originale ou que j'ai les droits nécessaires pour la partager. Elle respectera les conditions d'utilisation et ne contient pas de contenu dangereux ou offensant.
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
                  className="flex-1 bg-white text-content border-border-standard hover:bg-surface-muted font-semibold px-8 h-11 rounded-xl text-base transition-all shadow-sm"
                >
                  <Link href="/catalogue" className="w-full h-full flex items-center justify-center">
                    Annuler
                  </Link>
                </Button>
              </div>
            </form>

            {/* Help */}
            <div className="text-center pt-4 border-t border-border-standard/30">
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

