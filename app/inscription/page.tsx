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
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api';

export default function InscriptionPage() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!formData.acceptTerms || !formData.acceptRGPD) {
      setErrorMessage('Vous devez accepter les conditions et la politique RGPD.');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        role: formData.role,
      });

      setSubmitted(true);
      setTimeout(() => {
        router.push('/connexion');
      }, 1500);
    } catch (error) {
      let message = 'Inscription impossible.';

      if (error instanceof Error) {
        const errorMsg = error.message;
        if (errorMsg.includes('JWT Token not found')) {
          message = 'API protection error - vérifiez la configuration backend.';
        } else if (errorMsg.includes('Email')) {
          message = errorMsg;
        } else if (errorMsg.includes('password') || errorMsg.includes('Password')) {
          message = 'Le mot de passe ne respecte pas les critères (min. 8 caractères, 1 majuscule, 1 chiffre).';
        } else {
          message = errorMsg;
        }
      }

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Créer un Compte" description="Rejoignez notre communauté (RE)SOURCES" showBackButton={false} />

      <main className="grow">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">

            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl">✅</div>
                <h2 className="text-2xl font-bold text-content">Inscription Réussie !</h2>
                <p className="text-content-muted">Votre compte a ete cree via l&apos;API.</p>
                <p className="text-sm text-content-muted">Redirection en cours...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Prénom *</Label>
                    <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jean" className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Nom *</Label>
                    <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Dupont" className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600">Email *</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jean@example.com" className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20" />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600">Rôle</Label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full h-10 border border-gray-200 rounded-xl bg-gray-50/50 px-3 text-sm mt-1.5 outline-none focus:ring-1 focus:ring-primary/20">
                    <option value="parent">Parent</option>
                    <option value="educateur">Éducateur</option>
                    <option value="professionnel">Professionnel</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600">Mot de passe *</Label>
                  <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20" />
                  <p className="text-xs text-content-muted mt-1">Min. 8 caractères, 1 majuscule, 1 chiffre</p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600">Confirmer le mot de passe *</Label>
                  <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="h-10 text-sm mt-1.5 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20" />
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
                    />
                    <label htmlFor="acceptTerms" className="text-xs text-content-muted cursor-pointer leading-relaxed">
                      J&apos;accepte les <Link href="/conditions" className="text-primary hover:underline">conditions d&apos;utilisation</Link>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acceptRGPD"
                      checked={formData.acceptRGPD}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptRGPD: checked as boolean }))}
                    />
                    <label htmlFor="acceptRGPD" className="text-xs text-content-muted cursor-pointer leading-relaxed">
                      J&apos;accepte la <Link href="/politique-confidentialite" className="text-primary hover:underline">politique de confidentialité</Link> et le traitement de mes données (RGPD)
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary-700 h-11 rounded-xl font-semibold text-base mt-6 disabled:opacity-50"
                >
                  {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-content-muted">Déjà inscrit ? <Link href="/connexion" className="text-primary font-semibold hover:underline">Se connecter</Link></p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

