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

export default function ConnexionPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      alert('❌ Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      alert(`✅ Bienvenue ${formData.email} !\n\nRedirection vers le catalogue...`);
      setLoggedIn(true);
      setTimeout(() => {
        window.location.href = '/catalogue';
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Se Connecter" description="Accédez à votre compte (RE)SOURCES" showBackButton={false} />

      <main className="flex-grow">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-2xl border border-border-standard/60 shadow-sm space-y-6">

            {loggedIn ? (
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl">✅</div>
                <h2 className="text-2xl font-bold text-content">Connecté !</h2>
                <p className="text-content-muted">Redirection en cours...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="h-11 text-sm mt-2"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Mot de passe</Label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-11 text-sm mt-2"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
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
                  className="w-full bg-primary text-white hover:bg-primary-700 h-11 rounded-lg font-semibold text-base mt-6 disabled:opacity-50"
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-content-muted">Pas encore inscrit ? <Link href="/inscription" className="text-primary font-semibold hover:underline">S'inscrire</Link></p>
                </div>
              </form>
            )}

            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-xs text-green-800">
              <p className="font-semibold mb-1">Données de test</p>
              <p>Email : test@example.com</p>
              <p>Mot de passe : password123</p>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

