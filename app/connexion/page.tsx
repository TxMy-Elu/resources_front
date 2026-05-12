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
import { useAuth } from '@/lib/auth-context';

export default function ConnexionPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      setLoggedIn(true);
      router.push('/catalogue');
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col" suppressHydrationWarning>
      <MainHeader />
      <PageHeader title="Se Connecter" description="Accédez à votre compte (RE)SOURCES" showBackButton={false} />

      <main className="grow">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">

            {loggedIn ? (
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl">✅</div>
                <h2 className="text-2xl font-bold text-content">Connecté !</h2>
                <p className="text-content-muted">Redirection en cours...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="h-11 text-sm mt-2 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600">Mot de passe</Label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-11 text-sm mt-2 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))}
                    />
                    <label htmlFor="rememberMe" className="text-xs text-content-muted cursor-pointer">
                      Se souvenir de moi
                    </label>
                  </div>
                  <Link href="/mot-de-passe-oublie" className="text-xs text-primary hover:underline font-semibold">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary-700 h-11 rounded-xl font-semibold text-base mt-6 disabled:opacity-50"
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-content-muted">Pas encore inscrit ? <Link href="/inscription" className="text-primary font-semibold hover:underline">S&apos;inscrire</Link></p>
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

