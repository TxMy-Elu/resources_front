'use client';

import React from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Users, FileText, CheckCircle, Settings,
  BarChart3, Shield, Bell, LogOut
} from 'lucide-react';

export default function AdminLayoutPage() {
  const adminSections = [
    {
      title: 'Dashboard',
      description: 'Vue d\'ensemble de la plateforme',
      icon: <BarChart3 className="w-8 h-8" />,
      href: '/admin',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Utilisateurs',
      description: 'Gérer les comptes et les droits',
      icon: <Users className="w-8 h-8" />,
      href: '/admin/utilisateurs',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Ressources',
      description: 'Administrer le catalogue complet',
      icon: <FileText className="w-8 h-8" />,
      href: '/admin/ressources',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Modération',
      description: 'Valider les ressources en attente',
      icon: <CheckCircle className="w-8 h-8" />,
      href: '/admin/moderation',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const additionalSettings = [
    {
      title: 'Paramètres',
      description: 'Configuration générale de la plateforme',
      icon: <Settings className="w-6 h-6" />,
      href: '#'
    },
    {
      title: 'Sécurité',
      description: 'Gestion des accès et des permissions',
      icon: <Shield className="w-6 h-6" />,
      href: '#'
    },
    {
      title: 'Notifications',
      description: 'Historique des alertes et notifications',
      icon: <Bell className="w-6 h-6" />,
      href: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="mb-12">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-content">Espace Administrateur</h1>
                <p className="text-content-muted text-lg mt-2">Bienvenue dans le back-office de (RE)SOURCES</p>
              </div>
              <Button className="bg-red-600 text-white hover:bg-red-700 shadow-sm font-semibold px-6 h-11 rounded-xl text-sm transition-all flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {adminSections.map((section, idx) => (
              <Link key={idx} href={section.href}>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full">
                  <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center mb-4`}>
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-bold text-content mb-2">{section.title}</h3>
                  <p className="text-content-muted text-sm">{section.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-primary text-sm font-semibold">Accéder →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Additional Settings */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-content mb-6">Paramètres Avancés</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {additionalSettings.map((setting, idx) => (
                <a key={idx} href={setting.href} className="block">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 rounded-xl text-primary">
                        {setting.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-content mb-1">{setting.title}</h4>
                        <p className="text-content-muted text-xs">{setting.description}</p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Documentation */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-100 shadow-sm">
              <h3 className="text-lg font-bold text-blue-900 mb-3">📚 Documentation</h3>
              <p className="text-blue-800 text-sm mb-4">
                Consultez la documentation complète pour comprendre les règles de modération et les meilleures pratiques.
              </p>
              <a href="/docs" className="text-blue-600 font-semibold text-sm hover:underline inline-block">
                Voir la documentation →
              </a>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-100 shadow-sm">
              <h3 className="text-lg font-bold text-purple-900 mb-3">🆘 Support</h3>
              <p className="text-purple-800 text-sm mb-4">
                Besoin d&apos;aide ? Contactez l&apos;équipe support ou consultez la FAQ interne.
              </p>
              <a href="/admin/support" className="text-purple-600 font-semibold text-sm hover:underline inline-block">
                Contacter le support →
              </a>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-yellow-50 border border-yellow-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-yellow-900 mb-2">⚠️ Important</h3>
            <p className="text-yellow-800 text-sm">
              Vous êtes connecté en tant qu&apos;administrateur. Tous vos actions sont enregistrées pour la traçabilité et la sécurité.
            </p>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <div className="text-content-muted text-xs">
                <p>Version 1.0 | © 2026 (RE)SOURCES</p>
              </div>
              <div className="flex gap-4">
                <Link href="/" className="text-primary text-sm font-semibold hover:underline">
                  Voir le site public
                </Link>
                <a href="/conditions" className="text-primary text-sm font-semibold hover:underline">
                  Conditions d&apos;utilisation
                </a>
                <a href="/contact" className="text-primary text-sm font-semibold hover:underline">
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

