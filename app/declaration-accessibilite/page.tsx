'use client';

import React from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export default function DeclarationAccessibilitePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Déclaration d'Accessibilité" description="Notre engagement pour l'accessibilité numérique" showBackButton={false} />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white p-8 rounded-2xl border border-border-standard/60 shadow-sm space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">Engagement envers l'accessibilité</h2>
              <p className="text-content-muted">
                (RE)SOURCES RELATIONNELLES s'engage à rendre ses contenus numériques accessibles aux personnes en situation de handicap, conformément à la <a href="https://www.legifrance.gouv.fr/loistraitement/TEXTEF000009768475/LEGITEXT000009768475/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Loi Handicap et Accessibilité (Loi Handicap 2005)</a> et au <a href="https://www.legifrance.gouv.fr/loistraitement/TEXTEF000010977119/LEGITEXT000010977119/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Référentiel Général d'Amélioration de l'Accessibilité (RGAA)</a>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">État de conformité</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-900 font-semibold mb-2">⚠️ Partiellement conforme</p>
                <p className="text-yellow-800 text-sm">
                  La plateforme est actuellement en cours de mise en conformité avec les normes RGAA 4.1. Certaines fonctionnalités peuvent ne pas être entièrement accessibles.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">Mesures d'accessibilité implémentées</h2>
              <ul className="list-disc list-inside space-y-2 text-content-muted">
                <li>Contrastes suffisants pour les textes (ratio WCAG AA)</li>
                <li>Polices lisibles et de taille ajustable</li>
                <li>Navigation complète au clavier (tabulation)</li>
                <li>Balises alt sur toutes les images</li>
                <li>Structure HTML sémantique</li>
                <li>Compatibilité avec lecteurs d'écran</li>
                <li>Support des navigateurs Chrome, Firefox, Edge, Safari</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">Limitations connues</h2>
              <ul className="list-disc list-inside space-y-2 text-content-muted">
                <li>Certains contenus vidéo ne disposent pas de sous-titres</li>
                <li>Quelques formulaires dynamiques nécessitent des améliorations</li>
                <li>Certains graphiques manquent de descriptions textuelles</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">Feedback et signalement</h2>
              <p className="text-content-muted">
                Si vous rencontrez une barrière d'accessibilité, veuillez nous le signaler :
              </p>
              <div className="space-y-2 text-content-muted">
                <p><strong>Email :</strong> accessibility@ressources.fr</p>
                <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                <p><strong>Formulaire de contact :</strong></p>
              </div>
              <Button className="bg-primary text-white hover:bg-primary-700">
                Signaler un problème d'accessibilité
              </Button>
            </section>
            {/* Recours */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">9. Procédure de recours</h2>
              <p className="text-content-muted">
                Si après avoir contacté l'équipe (RE)SOURCES vous estimez que votre demande n'a pas été satisfaite, vous pouvez saisir :
              </p>
              <ul className="list-disc list-inside space-y-2 text-content-muted">
                <li>Le <a href="https://www.defenseurdesdroits.fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Défenseur des droits</a> (https://www.defenseurdesdroits.fr)</li>
                <li>L'<a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">autorité chargée du contrôle de l'accessibilité (CNIL)</a></li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">Feuille de route</h2>
              <p className="text-content-muted">
                Nous nous engageons à améliorer continuellement l'accessibilité. Les améliorations prévues incluent :
              </p>
              <ul className="list-disc list-inside space-y-2 text-content-muted">
                <li>Q2 2026 : Audit complet RGAA 4.1</li>
                <li>Q3 2026 : Ajout des sous-titres vidéo</li>
                <li>Q4 2026 : Conformité RGAA AA complète</li>
              </ul>
            </section>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm text-blue-800">
              <p><strong>Dernière mise à jour :</strong> 31 mars 2026</p>
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}

