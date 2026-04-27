'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '@/lib/api';

export default function MotDePasseOubliePage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email.trim()) {
      setMessage('Veuillez entrer votre email.');
      return;
    }
    setLoading(true);
    try {
      const response = await forgotPassword({ email });
      setMessage(response.message || `Si un compte existe pour ${email}, un email de réinitialisation a été envoyé.`);
      setStep('success');
      setTimeout(() => {
        router.push('/connexion');
      }, 2000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Envoi impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Mot de Passe Oublié" description="Réinitialisez votre mot de passe" showBackButton={false} />

      <main className="grow">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            {message && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                {message}
              </div>
            )}

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
                  {loading ? 'Envoi en cours...' : 'Envoyer l\'email'}
                </Button>

                <div className="text-center">
                  <Link href="/connexion" className="text-sm text-primary hover:underline font-semibold">
                    Revenir à la connexion
                  </Link>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl">✅</div>
                <h2 className="text-2xl font-bold text-content">Email envoyé</h2>
                <p className="text-content-muted">Consultez votre boîte mail pour poursuivre la réinitialisation.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

