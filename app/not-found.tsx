'use client';

import React from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Search, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />

      <main className="grow flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-8 py-12">

          {/* 404 Visual */}
          <div className="space-y-4">
            <div className="text-9xl font-black text-primary opacity-20">404</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-content">Page non trouvée</h1>
            <p className="text-xl text-content-muted">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été supprimée.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/" className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary-700 h-12 px-8 rounded-xl font-semibold text-base flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Retour à l&apos;accueil
              </Button>
            </Link>

            <Link href="/catalogue" className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto bg-white text-primary border border-primary/20 hover:bg-primary/5 h-12 px-8 rounded-xl font-semibold text-base flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Voir le catalogue
              </Button>
            </Link>

            <Link href="/contact" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto bg-white text-content border-gray-200 hover:bg-gray-50 h-12 px-8 rounded-xl font-semibold text-base flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Nous contacter
              </Button>
            </Link>
          </div>

          {/* Suggestions */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 mt-12">
            <div>
              <h2 className="text-lg font-bold text-content mb-4">Vous cherchiez peut-être :</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/catalogue" className="p-3 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-colors text-sm font-semibold text-content hover:text-primary border border-gray-100">
                  Explorer le catalogue des ressources
                </Link>
                <Link href="/inscription" className="p-3 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-colors text-sm font-semibold text-content hover:text-primary border border-gray-100">
                  S&apos;inscrire sur la plateforme
                </Link>
                <Link href="/faq" className="p-3 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-colors text-sm font-semibold text-content hover:text-primary border border-gray-100">
                  Consulter la FAQ
                </Link>
                <Link href="/plan-du-site" className="p-3 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-colors text-sm font-semibold text-content hover:text-primary border border-gray-100">
                  Voir le plan du site
                </Link>
              </div>
            </div>

            {/* Error Code */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs text-content-muted font-mono">
                Erreur HTTP 404 - Page not found
              </p>
            </div>
          </div>

          {/* Fun Message */}
          <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 shadow-sm space-y-2">
            <h3 className="font-bold text-blue-900">Conseil</h3>
            <p className="text-sm text-blue-800">
              Si vous pensez qu&apos;il y a une erreur, n&apos;hésitez pas à <Link href="/contact" className="font-semibold underline">nous contacter</Link> pour nous la signaler.
            </p>
          </div>

        </div>
      </main>

      <MainFooter />
    </div>
  );
}

