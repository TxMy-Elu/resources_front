'use client';

import React from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Politique de Confidentialité et Protection des Données" description="RGPD - Traitement de vos données personnelles" showBackButton={false} />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white p-8 rounded-2xl border border-border-standard/60 shadow-sm space-y-8 text-sm text-content-muted">

            {/* Responsable */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">1. RESPONSABLE DU TRAITEMENT</h2>
              <div className="space-y-2 font-medium">
                <p><strong>Entité :</strong> Ministère des Affaires Sociales et de la Cohésion Sociale</p>
                <p><strong>Siège :</strong> 14 Avenue Duquesne, 75007 Paris</p>
                <p><strong>Délégué à la Protection des Données (DPD) :</strong></p>
                <p className="ml-4">Email : dpo@ressources.fr</p>
                <p className="ml-4">Téléphone : +33 (0)1 23 45 67 89</p>
                <p><strong>Registre CNIL :</strong> n°2024-RES-001</p>
              </div>
            </section>

            {/* Données collectées */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">2. DONNÉES PERSONNELLES COLLECTÉES (Article 13 RGPD)</h2>

              <h3 className="text-lg font-semibold text-content">2.1 Données d'inscription</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Prénom et nom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Catégorie socioprofessionnelle</li>
                <li>Situation familiale (optionnel)</li>
              </ul>

              <h3 className="text-lg font-semibold text-content mt-4">2.2 Données de navigation</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Adresse IP</li>
                <li>Type de navigateur et système d'exploitation</li>
                <li>Pages consultées et durée de visite</li>
                <li>Date et heure des connexions</li>
                <li>Cookies (cf. section 7)</li>
              </ul>

              <h3 className="text-lg font-semibold text-content mt-4">2.3 Données de contenu</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Ressources créées ou éditées</li>
                <li>Avis et commentaires publiés</li>
                <li>Contenus sauvegardés ou favoris</li>
                <li>Messages de contact envoyés</li>
              </ul>

              <h3 className="text-lg font-semibold text-content mt-4">2.4 Données de paiement (si applicable)</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Numéro de carte (non conservé)</li>
                <li>Historique transactionnel</li>
                <li>Données de facturation</li>
              </ul>
            </section>

            {/* Bases légales */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">3. BASES LÉGALES DU TRAITEMENT (Article 6 RGPD)</h2>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left font-semibold">Données</th>
                    <th className="border border-gray-300 p-2 text-left font-semibold">Base légale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Email, mot de passe</td>
                    <td className="border border-gray-300 p-2">Contrat (création compte)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Nom, prénom, téléphone</td>
                    <td className="border border-gray-300 p-2">Consentement explicite</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Adresse IP, logs</td>
                    <td className="border border-gray-300 p-2">Intérêt légitime (sécurité)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Newsletter</td>
                    <td className="border border-gray-300 p-2">Consentement opt-in</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Destinataires */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">4. DESTINATAIRES DES DONNÉES (Article 15 RGPD)</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Équipe interne :</strong> Support client, modérateurs, administrateurs</li>
                <li><strong>Prestataires :</strong> OVH (hébergement), Brevo (emails)</li>
                <li><strong>Autorités :</strong> Gendarmerie/Police si contenu illégal</li>
                <li><strong>Statistiques :</strong> Données anonymisées à Matomo (analytics)</li>
              </ul>
              <p className="mt-4">Aucun transfert vers pays tiers sans votre consentement préalable.</p>
            </section>

            {/* Durée conservation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">5. DURÉE DE CONSERVATION (Article 5 RGPD)</h2>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left font-semibold">Type de données</th>
                    <th className="border border-gray-300 p-2 text-left font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Compte actif</td>
                    <td className="border border-gray-300 p-2">Durée de l'inscription</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Après suppression</td>
                    <td className="border border-gray-300 p-2">30 jours (archives temporaires)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Logs de connexion</td>
                    <td className="border border-gray-300 p-2">90 jours</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Cookies analytiques</td>
                    <td className="border border-gray-300 p-2">13 mois</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Messages signalés illégaux</td>
                    <td className="border border-gray-300 p-2">3 ans (obligation légale)</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Vos droits */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">6. VOS DROITS RGPD (Articles 15-22)</h2>
              <div className="space-y-3">
                <div className="border-l-4 border-primary pl-4">
                  <p><strong><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj#d1e2833-1-1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Article 15 - Droit d'accès</a> :</strong> Demander une copie de vos données</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p><strong><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj#d1e2845-1-1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Article 16 - Droit de rectification</a> :</strong> Corriger vos données inexactes</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p><strong><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj#d1e2855-1-1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Article 17 - Droit à l'oubli</a> :</strong> Demander la suppression de vos données</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p><strong><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj#d1e2865-1-1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Article 18 - Droit à la limitation</a> :</strong> Limiter le traitement temporairement</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p><strong><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj#d1e2891-1-1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Article 20 - Droit à la portabilité</a> :</strong> Recevoir vos données dans un format courant</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p><strong><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj#d1e2905-1-1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Article 21 - Droit d'opposition</a> :</strong> S'opposer au traitement</p>
                </div>
              </div>
              <p className="mt-4 font-semibold">💻 <strong>Exercer vos droits :</strong></p>
              <p>Envoyez un email à dpo@ressources.fr avec votre demande et un justificatif d'identité.</p>
              <p className="text-sm mt-2">Délai de réponse : 30 jours (extensible à 60 jours pour demandes complexes)</p>
            </section>

            {/* Sécurité */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">7. SÉCURITÉ ET PROTECTION</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Chiffrement :</strong> <a href="https://en.wikipedia.org/wiki/TLS_1.3" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TLS 1.3</a> (HTTPS) pour tous les échanges</li>
                <li><strong>Stockage :</strong> <a href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AES-256</a> pour les données sensibles</li>
                <li><strong>Mots de passe :</strong> <a href="https://en.wikipedia.org/wiki/Bcrypt" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Hachage bcrypt</a> avec salt unique</li>
                <li><strong>Serveurs :</strong> Situés en France (Strasbourg, Roubaix) - <a href="https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006052128" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">loi Informatique et Libertés</a></li>
                <li><strong>Pare-feu :</strong> Protection contre injection SQL et XSS</li>
                <li><strong>Sauvegardes :</strong> Quotidiennes, chiffrées, répliquées</li>
                <li><strong>Audit :</strong> Tests de sécurité mensuels (pentest)</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">8. COOKIES ET TRACEURS</h2>
              <div className="space-y-3">
                <p><strong>Cookies essentiels (consentement implicite) :</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Session utilisateur</li>
                  <li>Authentification</li>
                  <li>Sécurité CSRF</li>
                </ul>
                <p className="mt-3"><strong>Cookies analytiques (consentement opt-in) :</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><a href="https://matomo.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Matomo</a> (analytics) - configuration privacy by design</li>
                  <li>Pas de transmission à tiers</li>
                </ul>
                <p className="mt-3"><strong>Droit de refuser :</strong> Gérez vos préférences dans les paramètres de compte ou votre navigateur</p>
              </div>
            </section>

            {/* Réclamation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">9. DROIT DE RÉCLAMATION</h2>
              <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez :</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Contacter le DPD :</strong> dpo@ressources.fr</li>
                <li><strong>Saisir la <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNIL</a> :</strong> Commission Nationale Informatique et Libertés</li>
                <li className="ml-4">3 Place de Fontenoy, 75007 Paris</li>
                <li className="ml-4">Téléphone : 01 53 73 22 22</li>
                <li className="ml-4"><a href="https://www.cnil.fr/fr/declarer-ou-saisir-la-cnil" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Faire une réclamation en ligne</a></li>
              </ul>
            </section>

            {/* Infos légales */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-2 text-sm text-blue-800">
              <p><strong>Conformité :</strong> <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">RGPD (UE) 2016/679</a> + <a href="https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006052128" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Loi Informatique et Libertés française</a></p>
              <p><strong>Version :</strong> 1.0</p>
              <p><strong>Dernière mise à jour :</strong> 31 mars 2026</p>
              <p><strong>Prochaine révision :</strong> 31 mars 2027</p>
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}

