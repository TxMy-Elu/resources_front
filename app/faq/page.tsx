'use client';

import React, { useState } from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  const faqItems = [
    { id: 1, cat: 'Général', q: 'Qu\'est-ce que (RE)SOURCES ?', a: '(RE)SOURCES est une plateforme collaborative de partage de ressources relationnelles pour les familles, couples et individus.' },
    { id: 2, cat: 'Général', q: 'Comment s\'inscrire ?', a: 'Cliquez sur "S\'inscrire", remplissez le formulaire avec vos données et vérifiez votre email. C\'est gratuit !' },
    { id: 3, cat: 'Ressources', q: 'Comment créer une ressource ?', a: 'Une fois connecté, cliquez sur "Créer une ressource". Vous pouvez ajouter du contenu, le catégoriser et choisir sa visibilité.' },
    { id: 4, cat: 'Ressources', q: 'Mes ressources publiques seront-elles validées ?', a: 'Oui, les ressources publiques sont soumises à modération par nos experts avant publication.' },
    { id: 5, cat: 'Accessibilité', q: 'Le site est-il accessible ?', a: 'Oui, nous respectons les normes RGAA. Consultez notre déclaration d\'accessibilité.' },
    { id: 6, cat: 'Données', q: 'Mes données sont-elles sécurisées ?', a: 'Absolument. Nous utilisons le chiffrement AES-256 et respectons le RGPD.' }
  ];

  const filtered = faqItems.filter(item =>
    item.q.toLowerCase().includes(search.toLowerCase()) ||
    item.a.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = { 'Général': [], 'Ressources': [], 'Accessibilité': [], 'Données': [] } as Record<string, typeof faqItems>;
  filtered.forEach(item => { grouped[item.cat]?.push(item); });

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Foire Aux Questions" description="Trouvez les réponses à vos questions" showBackButton={false} />
      <div className="max-w-3xl mx-auto px-4 py-8 flex-grow w-full">
        <div className="mb-8">
          <Input placeholder="Rechercher une question..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-11 text-base" />
        </div>
        {Object.entries(grouped).map(([cat, items]) => items.length > 0 && (
          <div key={cat} className="mb-8">
            <h2 className="text-xl font-bold text-content mb-4">{cat}</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-lg border border-border-standard/60 overflow-hidden">
                  <button onClick={() => setOpenId(openId === item.id ? null : item.id)} className="w-full flex items-center justify-between p-4 hover:bg-surface-muted/50 transition">
                    <span className="font-semibold text-content text-sm text-left">{item.q}</span>
                    <ChevronDown className={`w-5 h-5 text-primary transition-transform ${openId === item.id ? 'rotate-180' : ''}`} />
                  </button>
                  {openId === item.id && (
                    <div className="border-t border-border-standard/20 p-4 bg-surface-muted/30">
                      <p className="text-content-muted text-sm">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-content-muted">Aucune question trouvée</p>
          </div>
        )}
      </div>
      <MainFooter />
    </div>
  );
}

