'use client';

import React from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Plan du Site" description="Accédez à toutes les pages de la plateforme" showBackButton={false} />
      <main className="grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-12">

            {/* Front-Office */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content border-b-2 border-primary pb-2">🏠 Front-Office (Citoyen)</h2>

              <div className="space-y-6">
                {/* Accueil */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Accueil & Présentation</h3>
                  <ul className="space-y-1 ml-4">
                    <li><Link href="/" className="text-content hover:text-primary hover:underline">Accueil</Link></li>
                    <li><Link href="/faq" className="text-content hover:text-primary hover:underline">Foire Aux Questions (FAQ)</Link></li>
                    <li><Link href="/contact" className="text-content hover:text-primary hover:underline">Nous contacter</Link></li>
                  </ul>
                </div>

                {/* Ressources */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Ressources</h3>
                  <ul className="space-y-1 ml-4">
                    <li><Link href="/catalogue" className="text-content hover:text-primary hover:underline">Catalogue des ressources</Link></li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Recherche et filtrage</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Tri par catégorie/popularité</li>
                    <li className="mt-2"><Link href="/ressource/1" className="text-content hover:text-primary hover:underline">Détail d&apos;une ressource</Link></li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Avis et commentaires</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Ressources connexes</li>
                    <li className="mt-2"><Link href="/ressource/creer" className="text-content hover:text-primary hover:underline">Créer une ressource</Link></li>
                  </ul>
                </div>

                {/* Authentification */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Authentification</h3>
                  <ul className="space-y-1 ml-4">
                    <li><Link href="/inscription" className="text-content hover:text-primary hover:underline">S&apos;inscrire</Link></li>
                    <li><Link href="/connexion" className="text-content hover:text-primary hover:underline">Se connecter</Link></li>
                    <li><Link href="/mot-de-passe-oublie" className="text-content hover:text-primary hover:underline">Mot de passe oublié</Link></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Admin */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content border-b-2 border-orange-500 pb-2">Back-Office (Admin)</h2>

              <div className="space-y-6">
                {/* Dashboard */}
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">Dashboard Administrateur</h3>
                  <ul className="space-y-1 ml-4">
                    <li><Link href="/admin" className="text-content hover:text-orange-600 hover:underline">Tableau de bord</Link></li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Vue d&apos;ensemble</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Statistiques</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Activités récentes</li>
                  </ul>
                </div>

                {/* Utilisateurs */}
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">Gestion des Utilisateurs</h3>
                  <ul className="space-y-1 ml-4">
                    <li><Link href="/admin/utilisateurs" className="text-content hover:text-orange-600 hover:underline">Liste des utilisateurs</Link></li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Recherche et filtrage</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Ajouter un utilisateur</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Éditer un utilisateur</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Supprimer un compte (RGPD)</li>
                  </ul>
                </div>

                {/* Ressources */}
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">Gestion du Catalogue</h3>
                  <ul className="space-y-1 ml-4">
                    <li><Link href="/admin/ressources" className="text-content hover:text-orange-600 hover:underline">Liste des ressources</Link></li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Recherche et filtrage</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Ajouter une ressource</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Éditer une ressource</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Supprimer une ressource</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Gérer les catégories</li>
                  </ul>
                </div>

                {/* Modération */}
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">Espace de Modération</h3>
                  <ul className="space-y-1 ml-4">
                    <li><Link href="/admin/moderation" className="text-content hover:text-orange-600 hover:underline">Ressources en attente</Link></li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Aperçu du contenu</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Approuver les ressources</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Rejeter les ressources</li>
                    <li className="text-content-muted text-sm">&nbsp;&nbsp;&nbsp;&nbsp;└─ Statistiques de modération</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Informations Légales */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content border-b-2 border-blue-500 pb-2">Informations Légales</h2>

              <div className="space-y-2 ml-4">
                <Link href="/conditions" className="block text-content hover:text-blue-600 hover:underline">Mentions Légales et Conditions Générales</Link>
                <Link href="/politique-confidentialite" className="block text-content hover:text-blue-600 hover:underline">Politique de Confidentialité (RGPD)</Link>
                <Link href="/declaration-accessibilite" className="block text-content hover:text-blue-600 hover:underline">Déclaration d&apos;Accessibilité (RGAA)</Link>
              </div>
            </section>

            {/* Stats */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content border-b-2 border-primary pb-2">Statistiques du Site</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-primary/10 p-4 rounded-2xl text-center border border-primary/10">
                  <p className="text-3xl font-bold text-primary">7</p>
                  <p className="text-sm text-content-muted">Pages principales</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl text-center border border-orange-100">
                  <p className="text-3xl font-bold text-orange-600">5</p>
                  <p className="text-sm text-content-muted">Pages admin</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                  <p className="text-3xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-content-muted">Pages légales</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
                  <p className="text-3xl font-bold text-green-600">15+</p>
                  <p className="text-sm text-content-muted">Total pages</p>
                </div>
              </div>
            </section>

            {/* Accessibilité */}
            <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 shadow-sm space-y-2">
              <h3 className="font-bold text-blue-900">Accès Accessible</h3>
              <p className="text-sm text-blue-800">Ce plan du site est entièrement accessible au clavier et compatible avec les lecteurs d&apos;écran. Toutes les pages respectent les normes RGAA.</p>
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}

