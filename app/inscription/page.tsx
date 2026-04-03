'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';

export default function InscriptionPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'parent',
    acceptTerms: false,
    acceptRGPD: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      alert('❌ Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('❌ Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.acceptTerms || !formData.acceptRGPD) {
      alert('❌ Vous devez accepter les conditions et la politique RGPD');
      return;
    }

    alert(`✅ Inscription réussie !\n\nUn email de vérification a été envoyé à ${formData.email}\n\nRedirection vers la connexion...`);
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = '/connexion';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Créer un Compte" description="Rejoignez notre communauté (RE)SOURCES" showBackButton={false} />

      <main className="flex-grow">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-2xl border border-border-standard/60 shadow-sm space-y-6">

            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl">✅</div>
                <h2 className="text-2xl font-bold text-content">Inscription Réussie !</h2>
                <p className="text-content-muted">Un email de vérification a été envoyé.</p>
                <p className="text-sm text-content-muted">Redirection en cours...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold">Prénom *</Label>
                    <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jean" className="h-10 text-sm mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Nom *</Label>
                    <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Dupont" className="h-10 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Email *</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jean@example.com" className="h-10 text-sm mt-1" />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Rôle</Label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full h-10 border border-border-standard rounded-lg px-3 text-sm mt-1">
                    <option value="parent">Parent</option>
                    <option value="educateur">Éducateur</option>
                    <option value="professionnel">Professionnel</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Mot de passe *</Label>
                  <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="h-10 text-sm mt-1" />
                  <p className="text-xs text-content-muted mt-1">Min. 8 caractères, 1 majuscule, 1 chiffre</p>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Confirmer le mot de passe *</Label>
                  <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="h-10 text-sm mt-1" />
                </div>

                <div className="space-y-2 pt-4 border-t border-border-standard/30">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked }))}
                    />
                    <label htmlFor="acceptTerms" className="text-xs text-content-muted cursor-pointer leading-relaxed">
                      J'accepte les <Link href="/conditions" className="text-primary hover:underline">conditions d'utilisation</Link>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acceptRGPD"
                      checked={formData.acceptRGPD}
                      onChange={(checked) => setFormData(prev => ({ ...prev, acceptRGPD: checked }))}
                    />
                    <label htmlFor="acceptRGPD" className="text-xs text-content-muted cursor-pointer leading-relaxed">
                      J'accepte la <Link href="/politique-confidentialite" className="text-primary hover:underline">politique de confidentialité</Link> et le traitement de mes données (RGPD)
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-700 h-11 rounded-lg font-semibold text-base mt-6">
                  S'inscrire
                </Button>

                <div className="text-center">
                  <p className="text-sm text-content-muted">Déjà inscrit ? <Link href="/connexion" className="text-primary font-semibold hover:underline">Se connecter</Link></p>
                </div>
              </form>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-xs text-blue-800">
              <p className="font-semibold mb-1">Vérification email</p>
              <p>Un email de vérification sera envoyé après l'inscription. Cliquez sur le lien pour confirmer votre compte.</p>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

