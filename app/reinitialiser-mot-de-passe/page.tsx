'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { resetPassword, ResetPasswordPayload } from '@/lib/api';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [fields, setFields] = useState({ password: '', passwordConfirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) setError('Lien invalide — le token est manquant.');
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fields.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (fields.password !== fields.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload: ResetPasswordPayload = { token, password: fields.password, passwordConfirm: fields.passwordConfirm };
      await resetPassword(payload);
      setSuccess(true);
      setTimeout(() => router.push('/connexion'), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md w-full">
        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-content mb-2">Mot de passe modifié !</h1>
        <p className="text-content-muted text-sm mb-6">
          Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
        </p>
        <Link href="/connexion" className="text-primary font-semibold text-sm hover:underline">
          Se connecter maintenant →
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md w-full">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-7 h-7 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-content mb-2">Lien invalide</h1>
        <p className="text-content-muted text-sm mb-6">
          Ce lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.
        </p>
        <Link href="/connexion" className="text-primary font-semibold text-sm hover:underline">
          Retour à la connexion →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content mb-1">Nouveau mot de passe</h1>
        <p className="text-content-muted text-sm">Choisissez un mot de passe sécurisé (minimum 8 caractères).</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-semibold text-gray-600">
            Nouveau mot de passe *
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              placeholder="8 caractères minimum"
              className="h-11 rounded-xl border-gray-200 bg-gray-50/50 pr-10 focus-visible:ring-1 focus-visible:ring-primary/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="passwordConfirm" className="text-xs font-semibold text-gray-600">
            Confirmer le mot de passe *
          </Label>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              id="passwordConfirm"
              name="passwordConfirm"
              value={fields.passwordConfirm}
              onChange={handleChange}
              placeholder="Répétez le mot de passe"
              className="h-11 rounded-xl border-gray-200 bg-gray-50/50 pr-10 focus-visible:ring-1 focus-visible:ring-primary/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fields.passwordConfirm && fields.password !== fields.passwordConfirm && (
            <p className="text-red-500 text-xs">Les mots de passe ne correspondent pas</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold h-11 rounded-xl text-base disabled:opacity-50"
        >
          {submitting ? 'Modification en cours...' : 'Réinitialiser mon mot de passe'}
        </Button>
      </form>

      <p className="text-center text-xs text-content-muted mt-6">
        <Link href="/connexion" className="text-primary font-semibold hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <main className="grow flex items-center justify-center px-4 py-12">
        <Suspense fallback={
          <div className="text-content-muted text-sm animate-pulse">Chargement...</div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <MainFooter />
    </div>
  );
}
