'use client';

import React from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { Button } from '@/components/ui/button';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    {
      label: 'Utilisateurs',
      value: '1 245',
      change: '+12%',
      icon: <Users className="w-6 h-6" />,
      href: '/admin/utilisateurs'
    },
    {
      label: 'Ressources Publiées',
      value: '1 250',
      change: '+5%',
      icon: <FileText className="w-6 h-6" />,
      href: '/admin/ressources'
    },
    {
      label: 'En Attente de Modération',
      value: '3',
      change: 'URGENT',
      icon: <AlertCircle className="w-6 h-6" />,
      href: '/admin/moderation'
    },
    {
      label: 'Validées ce Mois',
      value: '42',
      change: '+8%',
      icon: <CheckCircle className="w-6 h-6" />,
      href: '/admin/ressources'
    }
  ];

  const recentActivities = [
    {
      type: 'user',
      title: 'Nouvel utilisateur inscrit',
      description: 'Sophie Laurent s\'est inscrite',
      time: 'Il y a 2 heures'
    },
    {
      type: 'resource',
      title: 'Ressource en attente',
      description: '"Guide pratique : Budget familial" attend une validation',
      time: 'Il y a 4 heures'
    },
    {
      type: 'approval',
      title: 'Ressource approuvée',
      description: '"Méditation pour parents" a été publiée',
      time: 'Il y a 1 jour'
    },
    {
      type: 'report',
      title: 'Signalement d\'accessibilité',
      description: 'Un utilisateur a signalé un problème d\'accessibilité',
      time: 'Il y a 2 jours'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-content mb-2">Tableau de Bord Administrateur</h1>
            <p className="text-content-muted text-sm">Vue d'ensemble de la plateforme (RE)SOURCES</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <Link key={idx} href={stat.href}>
                <div className="bg-white p-6 rounded-xl border border-border-standard/60 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      {stat.icon}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.change === 'URGENT' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-content-muted text-xs font-semibold mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-content">{stat.value}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-border-standard/60 shadow-sm">
                <div className="p-6 border-b border-border-standard/30">
                  <h2 className="text-xl font-bold text-content">Activités Récentes</h2>
                </div>

                <div className="divide-y divide-border-standard/20">
                  {recentActivities.map((activity, idx) => (
                    <div key={idx} className="p-4 hover:bg-surface-muted/20 transition-colors">
                      <div className="flex gap-4">
                        <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                          activity.type === 'user' ? 'bg-blue-500' :
                          activity.type === 'resource' ? 'bg-yellow-500' :
                          activity.type === 'approval' ? 'bg-green-500' :
                          'bg-red-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-content text-sm">{activity.title}</p>
                          <p className="text-content-muted text-xs mt-1">{activity.description}</p>
                          <p className="text-content-subtle text-xs mt-2">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 text-center border-t border-border-standard/30">
                  <a href="#" className="text-primary text-sm font-semibold hover:underline">Voir toutes les activités →</a>
                </div>
              </div>
            </div>

            {/* Quick Actions & Info */}
            <div className="space-y-6">

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl border border-border-standard/60 shadow-sm space-y-3">
                <h3 className="font-bold text-content mb-4">Actions Rapides</h3>

                <Link href="/admin/utilisateurs" className="block">
                  <Button className="w-full bg-primary text-white hover:bg-primary-700 h-10 rounded-lg font-semibold text-sm justify-start">
                    → Gérer les utilisateurs
                  </Button>
                </Link>

                <Link href="/admin/ressources" className="block">
                  <Button className="w-full bg-primary text-white hover:bg-primary-700 h-10 rounded-lg font-semibold text-sm justify-start">
                    → Gérer les ressources
                  </Button>
                </Link>

                <Link href="/admin/moderation" className="block">
                  <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 h-10 rounded-lg font-semibold text-sm justify-start">
                    → Modération (3 en attente)
                  </Button>
                </Link>
              </div>

              {/* System Status */}
              <div className="bg-white p-6 rounded-xl border border-border-standard/60 shadow-sm space-y-3">
                <h3 className="font-bold text-content mb-4">État du Système</h3>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-content-muted">API</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold text-green-600">En ligne</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-content-muted">Base de données</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold text-green-600">En ligne</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-content-muted">Stockage</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold text-green-600">En ligne</span>
                  </span>
                </div>

                <div className="pt-3 border-t border-border-standard/30 mt-3">
                  <p className="text-xs text-green-600 font-semibold">✓ Tous les systèmes fonctionnent normalement</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 space-y-3">
                <h4 className="font-bold text-blue-900 text-sm">💡 Rappel</h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Visitez la documentation de modération pour comprendre nos critères d'approbation.
                </p>
                <a href="/docs" className="text-blue-600 text-xs font-semibold hover:underline inline-block">
                  Voir la documentation →
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

