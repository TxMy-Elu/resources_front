'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';

export default function EditRessourcePage() {
  const [formData, setFormData] = useState({
    title: 'Guide pratique : Gestion du stress parental',
    description: 'Un guide complet pour les parents qui souhaitent gérer leur stress au quotidien...',
    category: 'Bien-être',
    type: 'article',
    visibility: 'public',
    file: null as File | null,
    url: 'https://example.com',
    duration: '',
    consent: true
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, files } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('✅ Ressource mise à jour avec succès !');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Éditer une Ressource" description="Modifiez votre ressource" showBackButton={true} />

      <main className="grow">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">

            {saved && (
              <div className="bg-green-50 border border-green-100 rounded-2xl shadow-sm p-4">
                <p className="text-green-800 text-sm font-medium">✅ Ressource mise à jour !</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold text-gray-600">Titre *</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Guide pratique sur..."
                  className="h-11 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold text-gray-600">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre ressource..."
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl bg-gray-50/50 px-4 py-3 resize-none outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-semibold text-gray-600">Catégorie *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50/50 px-4 text-sm outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="Éducation">Éducation</option>
                    <option value="Bien-être">Bien-être</option>
                    <option value="Santé">Santé</option>
                    <option value="Travail">Travail</option>
                    <option value="Administratif">Administratif</option>
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
                    <option value="article">Article</option>
                    <option value="video">Vidéo</option>
                    <option value="pdf">PDF</option>
                    <option value="audio">Podcast</option>
                    <option value="link">Lien web</option>
                  </select>
                </div>
              </div>

              {formData.type === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-xs font-semibold text-gray-600">URL *</Label>
                  <Input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="space-y-3 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <Label className="text-xs font-semibold text-gray-600 block">Niveau de visibilité *</Label>
                <div className="space-y-2">
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
                      <Label htmlFor="public" className="text-xs font-semibold cursor-pointer">Publique</Label>
                      <p className="text-xs text-content-muted">Visible à tous après validation</p>
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
                      <Label htmlFor="shared" className="text-xs font-semibold cursor-pointer">Partagée</Label>
                      <p className="text-xs text-content-muted">Par invitation uniquement</p>
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
                      <Label htmlFor="private" className="text-xs font-semibold cursor-pointer">Privée</Label>
                      <p className="text-xs text-content-muted">Visible uniquement par vous</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-8 h-11 rounded-xl text-base"
                >
                  Enregistrer les changements
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-white text-content border-gray-200 hover:bg-gray-50 font-semibold px-8 h-11 rounded-xl text-base"
                >
                  <Link href="/dashboard" className="w-full">Annuler</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

