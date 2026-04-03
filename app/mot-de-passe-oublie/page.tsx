'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';

export default function MotDePasseOubliePage() {
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('❌ Veuillez entrer votre email');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      alert(`✅ Un code de vérification a été envoyé à ${email}`);
      setLoading(false);
      setStep('code');
    }, 1000);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('❌ Veuillez entrer le code de vérification');
      return;
    }
    if (code !== '123456') {
      alert('❌ Code incorrect. Utilisez 123456 pour le test');
      return;
    }
    setStep('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      alert('❌ Veuillez remplir tous les champs');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('❌ Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      alert('✅ Mot de passe réinitialisé avec succès !');
      setLoading(false);
      setStep('success');
      setTimeout(() => {
        window.location.href = '/connexion';
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Mot de Passe Oublié" description="Réinitialisez votre mot de passe" showBackButton={false} />

      <main className="grow">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">

            {/* Step 1 : Email */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Adresse email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="h-11 text-sm mt-2 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                  <p className="text-xs text-content-muted mt-2">Entrez l&apos;email associé à votre compte</p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary-700 h-11 rounded-xl font-semibold text-base disabled:opacity-50"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer un code'}
                </Button>

                <div className="text-center">
                  <Link href="/connexion" className="text-sm text-primary hover:underline font-semibold">
                    Revenir à la connexion
                  </Link>
                </div>
              </form>
            )}

            {/* Step 2 : Code */}
            {step === 'code' && (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Code de vérification</Label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000000"
                    className="h-11 text-sm mt-2 text-center tracking-widest rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                  <p className="text-xs text-content-muted mt-2">Un code a été envoyé à {email}</p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary-700 h-11 rounded-xl font-semibold text-base"
                >
                  Vérifier le code
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-sm text-primary hover:underline font-semibold"
                  >
                    Modifier l&apos;email
                  </button>
                </div>

                <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-xs text-green-800">
                  <p className="font-semibold">Code de test : 123456</p>
                </div>
              </form>
            )}

            {/* Step 3 : Reset Password */}
            {step === 'reset' && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Nouveau mot de passe</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 text-sm mt-2 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                  <p className="text-xs text-content-muted mt-1">Min. 8 caractères, 1 majuscule, 1 chiffre</p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600">Confirmer le mot de passe</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 text-sm mt-2 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary-700 h-11 rounded-xl font-semibold text-base disabled:opacity-50"
                >
                  {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
                </Button>
              </form>
            )}

            {/* Step 4 : Success */}
            {step === 'success' && (
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl">✅</div>
                <h2 className="text-2xl font-bold text-content">Mot de passe réinitialisé !</h2>
                <p className="text-content-muted">Vous allez être redirigé vers la page de connexion.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

