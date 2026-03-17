'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MainHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-standard/30 bg-white/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary-900 leading-none tracking-tighter uppercase italic">Liberté • Égalité • Fraternité</span>
              <div className="h-0.5 w-12 bg-primary-600 my-0.5" />
              <span className="text-sm font-extrabold text-primary tracking-tight">RÉPUBLIQUE FRANÇAISE</span>
            </div>
            <div className="h-10 w-px bg-border-standard mx-2 hidden sm:block" />
            <div className="flex flex-col justify-center">
              <span className="text-lg font-extrabold text-content leading-tight">
                (RE)SOURCES
              </span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] leading-none">
                Relationnelles
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-bold text-content hover:text-primary transition-colors">Accueil</a>
            <a href="#" className="text-sm font-bold text-content hover:text-primary transition-colors border-b-2 border-secondary/50 pb-1">Ressources</a>
            <a href="#" className="text-sm font-bold text-content hover:text-primary transition-colors">Événements</a>
            <a href="#" className="text-sm font-bold text-content hover:text-primary transition-colors">À propos</a>
          </nav>

          {/* Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-content">Elio Durand</span>
              <span className="text-[10px] text-content-subtle font-bold bg-surface-sunken px-2 py-0.5 rounded-md uppercase tracking-wide">Parent</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-primary-800 font-extrabold text-sm border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
              ED
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
