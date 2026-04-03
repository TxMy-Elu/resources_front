'use client';

import React from 'react';
import Link from 'next/link';

export const MainFooter = () => {
  return (
    <footer className="w-full bg-[#F9FAFB] border-t border-border-standard/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Info Section */}
          <div className="col-span-1 lg:col-span-1 space-y-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary-900 leading-none tracking-tighter uppercase italic">Liberté • Égalité • Fraternité</span>
              <div className="h-0.5 w-12 bg-primary-600 my-0.5" />
              <span className="text-sm font-extrabold text-primary tracking-tight">RÉPUBLIQUE FRANÇAISE</span>
            </div>
            <p className="text-sm text-content-muted leading-relaxed font-medium">
              Une plateforme gouvernementale dédiée au soutien à la parentalité.
            </p>
          </div>

          {/* Useful Links */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-70">Informations</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/plan-du-site" className="text-sm font-bold text-content hover:text-primary transition-colors">Plan du site</Link>
              <Link href="/declaration-accessibilite" className="text-sm font-bold text-content hover:text-primary transition-colors">Accessibilité</Link>
              <Link href="/conditions" className="text-sm font-bold text-content hover:text-primary transition-colors">Mentions légales</Link>
            </nav>
          </div>

          {/* Quick Access */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-70">Aide & Contact</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/contact" className="text-sm font-bold text-content hover:text-primary transition-colors">Nous contacter</Link>
              <Link href="/faq" className="text-sm font-bold text-content hover:text-primary transition-colors">FAQ</Link>
              <Link href="/politique-confidentialite" className="text-sm font-bold text-content hover:text-primary transition-colors">Confidentialité</Link>
            </nav>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-70">Suivez-nous</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-border-standard/50 hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:bg-blue-50">
                <span className="text-sm font-bold text-blue-600">f</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-border-standard/50 hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:bg-blue-50">
                <span className="text-sm font-bold text-blue-400">𝕏</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-standard/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-content-subtle uppercase tracking-widest leading-none">
            © 2026 (RE)SOURCES RELATIONNELLES
          </p>
          <div className="flex items-center gap-6">
            <a href="https://service-public.fr" target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-primary/60 uppercase tracking-tighter hover:text-primary transition-colors">service-public.fr</a>
            <a href="https://data.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-primary/60 uppercase tracking-tighter hover:text-primary transition-colors">data.gouv.fr</a>
            <a href="https://france.fr" target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-primary/60 uppercase tracking-tighter hover:text-primary transition-colors">france.fr</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
