'use client';

import React, { useEffect, useState } from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { Button } from '@/components/ui/button';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getAdminStats, getPendingResources, AdminStatsResponse, PendingResource } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [pending, setPending] = useState<PendingResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, pendingData] = await Promise.all([
          getAdminStats(),
          getPendingResources(),
        ]);
        setStats(statsData);
        setPending(pendingData);
      } catch {
        setError('Impossible de charger les données du tableau de bord.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = stats
    ? [
        {
          label: 'Utilisateurs',
          value: stats.users.total.toLocaleString('fr-FR'),
          change: `+${stats.users.new} nouveaux`,
          icon: <Users className="w-6 h-6" />,
          href: '/admin/utilisateurs',
          urgent: false,
        },
        {
          label: 'Ressources Publiées',
          value: stats.resources.published.toLocaleString('fr-FR'),
          change: `${stats.resources.total} au total`,
          icon: <FileText className="w-6 h-6" />,
          href: '/admin/ressources',
          urgent: false,
        },
        {
          label: 'En Attente de Modération',
          value: stats.resources.pending.toLocaleString('fr-FR'),
          change: stats.resources.pending > 0 ? 'URGENT' : 'OK',
          icon: <AlertCircle className="w-6 h-6" />,
          href: '/admin/moderation',
          urgent: stats.resources.pending > 0,
        },
        {
          label: 'Activités ce Mois',
          value: stats.activities.thisMonth.toLocaleString('fr-FR'),
          change: `${stats.activities.thisWeek} cette semaine`,
          icon: <CheckCircle className="w-6 h-6" />,
          href: '/admin/ressources',
          urgent: false,
        },
      ]
    : [];

  return (
    <RoleGuard required="admin">
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />

        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-content mb-2">Tableau de Bord Administrateur</h1>
              <p className="text-content-muted text-sm">Vue d&apos;ensemble de la plateforme (RE)SOURCES</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-36" />
                  ))
                : statCards.map((stat, idx) => (
                    <Link key={idx} href={stat.href}>
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            {stat.icon}
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            stat.urgent
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Ressources en attente */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-content">Ressources en Attente de Modération</h2>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="p-4 animate-pulse">
                          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      ))
                    ) : pending.length === 0 ? (
                      <div className="p-8 text-center text-content-muted text-sm">
                        Aucune ressource en attente de modération.
                      </div>
                    ) : (
                      pending.slice(0, 5).map((resource) => (
                        <div key={resource.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                          <div className="flex gap-4">
                            <div className="w-3 h-3 rounded-full mt-2 flex-shrink-0 bg-yellow-500" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-content text-sm">{resource.titre}</p>
                              <p className="text-content-muted text-xs mt-1">Par {resource.createur}</p>
                              <p className="text-content-subtle text-xs mt-2">
                                {new Date(resource.dateCreation).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 text-center border-t border-gray-100">
                    <Link href="/admin/moderation" className="text-primary text-sm font-semibold hover:underline">
                      Voir toutes les ressources en attente →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Info */}
              <div className="space-y-6">

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <h3 className="font-bold text-content mb-4">Actions Rapides</h3>

                  <Link href="/admin/utilisateurs" className="block">
                    <Button className="w-full bg-primary text-white hover:bg-primary-700 h-10 rounded-xl font-semibold text-sm justify-start">
                      → Gérer les utilisateurs
                    </Button>
                  </Link>

                  <Link href="/admin/ressources" className="block">
                    <Button className="w-full bg-primary text-white hover:bg-primary-700 h-10 rounded-xl font-semibold text-sm justify-start">
                      → Gérer les ressources
                    </Button>
                  </Link>

                  <Link href="/admin/moderation" className="block">
                    <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 h-10 rounded-xl font-semibold text-sm justify-start">
                      → Modération{stats && stats.resources.pending > 0 ? ` (${stats.resources.pending} en attente)` : ''}
                    </Button>
                  </Link>
                </div>

                {/* System Status */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <h3 className="font-bold text-content mb-4">État du Système</h3>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-content-muted">API</span>
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
                      <span className={`text-xs font-semibold ${error ? 'text-red-600' : 'text-green-600'}`}>
                        {error ? 'Erreur' : 'En ligne'}
                      </span>
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 mt-3">
                    {error ? (
                      <p className="text-xs text-red-600 font-semibold">⚠ Problème de connexion à l&apos;API</p>
                    ) : (
                      <p className="text-xs text-green-600 font-semibold">✓ Tous les systèmes fonctionnent normalement</p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 shadow-sm space-y-3">
                  <h4 className="font-bold text-blue-900 text-sm">Rappel</h4>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Visitez la documentation de modération pour comprendre nos critères d&apos;approbation.
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
    </RoleGuard>
  );
}
