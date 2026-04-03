'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', category: 'général', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert('Remplir tous les champs');
      return;
    }
    alert(`✅ Message envoyé à support@ressources.fr\n\nNous vous répondrons dans les 48h.`);
    setSent(true);
    setTimeout(() => {
      setForm({ name: '', email: '', category: 'général', message: '' });
      setSent(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Nous contacter" description="Envoyez-nous vos questions, commentaires ou signalements" showBackButton={false} />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-12 w-full">
          {!sent ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Infos de Contact */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-border-standard/60 shadow-sm space-y-4">
                  <h2 className="text-xl font-bold text-content mb-6">Nous joindre</h2>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary mt-1" />
                    </div>
                    <div>
                      <p className="font-semibold text-content text-sm">Email</p>
                      <p className="text-content-muted text-sm">support@ressources.fr</p>
                      <p className="text-xs text-content-muted mt-1">Réponse en 48h</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary mt-1" />
                    </div>
                    <div>
                      <p className="font-semibold text-content text-sm">Téléphone</p>
                      <p className="text-content-muted text-sm">+33 1 23 45 67 89</p>
                      <p className="text-xs text-content-muted mt-1">Lun-Ven 9h-18h</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                    </div>
                    <div>
                      <p className="font-semibold text-content text-sm">Adresse</p>
                      <p className="text-content-muted text-sm">123 Rue de la République</p>
                      <p className="text-content-muted text-sm">75001 Paris</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 space-y-3">
                  <h3 className="font-bold text-blue-900">💡 Saviez-vous ?</h3>
                  <p className="text-sm text-blue-800">Vous pouvez aussi consulter notre FAQ pour les questions les plus courantes.</p>
                  <a href="/faq" className="text-blue-600 font-semibold text-sm hover:underline inline-block">Voir la FAQ →</a>
                </div>
              </div>

              {/* Formulaire */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-2xl border border-border-standard/60 shadow-sm">
                  <h2 className="text-2xl font-bold text-content mb-2">Envoyez-nous un message</h2>
                  <p className="text-content-muted text-sm mb-8">Remplissez le formulaire ci-dessous et nous vous répondrons au plus vite.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold">Nom *</Label>
                        <Input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Votre nom"
                          className="h-11 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold">Email *</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="votre@email.com"
                          className="h-11 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Catégorie *</Label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full h-11 border border-border-standard rounded-lg px-4 text-sm"
                      >
                        <option value="général">Demande générale</option>
                        <option value="accessibilité">Problème d'accessibilité</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="signalement">Signalement</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Message *</Label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Décrivez votre demande en détail..."
                        rows={6}
                        className="w-full border border-border-standard rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-white hover:bg-primary-700 h-11 rounded-lg font-semibold text-base transition-all shadow-sm"
                    >
                      Envoyer le message
                    </Button>

                    <p className="text-xs text-content-muted text-center">
                      Nous respectons votre vie privée. Vos données ne seront jamais partagées.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-white p-12 rounded-2xl border border-border-standard/60 shadow-sm text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-content">Message envoyé !</h2>
                <p className="text-content-muted text-lg">Merci de nous avoir contactés.</p>
                <p className="text-sm text-content-muted">Nous vous répondrons dans les 48 heures à l'adresse email que vous avez fournie.</p>
                <Button
                  onClick={() => setForm({ name: '', email: '', category: 'général', message: '' })}
                  className="w-full mt-6 bg-primary text-white h-11 rounded-lg font-semibold"
                >
                  Envoyer un autre message
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

