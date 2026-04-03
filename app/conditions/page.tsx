'use client';

import React from 'react';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { PageHeader } from '@/components/shared/PageHeader';

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <MainHeader />
      <PageHeader title="Mentions Légales et Conditions Générales d'Utilisation" description="Consultez les conditions d'utilisation de la plateforme" showBackButton={false} />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white p-8 rounded-2xl border border-border-standard/60 shadow-sm space-y-8 text-sm text-content-muted">

            {/* Éditeur */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">1. ÉDITEUR DE LA PLATEFORME</h2>
              <div className="space-y-2 font-medium">
                <p><strong>Dénomination officielle :</strong> Ministère des Affaires Sociales et de la Cohésion Sociale</p>
                <p><strong>Forme juridique :</strong> Établissement public administratif</p>
                <p><strong>SIREN :</strong> 130 001 260</p>
                <p><strong>Siège social :</strong> 14 Avenue Duquesne, 75007 Paris, France</p>
                <p><strong>Directeur de publication :</strong> Marie Leclerc, Directrice générale</p>
                <p><strong>Email de contact :</strong> contact@ressources.fr</p>
                <p><strong>Téléphone :</strong> +33 (0)1 23 45 67 89</p>
              </div>
            </section>

            {/* Hébergement */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">2. HÉBERGEMENT ET INFRASTRUCTURE</h2>
              <div className="space-y-2">
                <p><strong>Hébergeur :</strong> OVH SAS</p>
                <p><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
                <p><strong>Email :</strong> support@ovh.com</p>
                <p><strong>Téléphone :</strong> 0820 823 805</p>
                <p><strong>Infrastructure :</strong> Serveurs situés en France (Strasbourg et Roubaix)</p>
                <p><strong>Certificat SSL :</strong> OVH SSL (chiffrement TLS 1.3)</p>
              </div>
            </section>

            {/* Conditions d'utilisation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">3. CONDITIONS GÉNÉRALES D'UTILISATION</h2>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-content">3.1 Accès à la plateforme</h3>
                <p>La plateforme (RE)SOURCES RELATIONNELLES est accessible gratuitement à toute personne résidant en France. L'accès nécessite une inscription préalable et la création d'un compte utilisateur conforme aux critères d'admission définis par la plateforme.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-content">3.2 Conditions d'inscription</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Être âgé d'au moins 18 ans</li>
                  <li>Être résident de France métropolitaine ou outremers</li>
                  <li>Fournir une adresse email valide et unique</li>
                  <li>Accepter explicitement les CGU et politique de confidentialité</li>
                  <li>Accepter le traitement de vos données personnelles (consentement RGPD)</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-content">3.3 Responsabilités de l'utilisateur</h3>
                <p>En utilisant la plateforme, vous vous engagez à :</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Maintenir la confidentialité de vos identifiants de connexion</li>
                  <li>Vous approprier les contenus que vous créez</li>
                  <li>Ne pas créer de contenu illégal, offensant, diffamatoire ou contraire à l'ordre public</li>
                  <li>Respecter les droits d'auteur et propriété intellectuelle d'autrui</li>
                  <li>Ne pas usurper l'identité d'une tierce personne</li>
                  <li>Ne pas tenter de contourner les mesures de sécurité (piratage, injection SQL/XSS)</li>
                  <li>Respecter les lois en vigueur (Code pénal, Code civil)</li>
                  <li>Ne pas publier de contenus à caractère commercial sans autorisation</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-content">3.4 Modération et suppression de contenu</h3>
                <p>La plateforme se réserve le droit de :</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Modérer les ressources publiques avant publication</li>
                  <li>Supprimer tout contenu non conforme à ces CGU</li>
                  <li>Suspendre ou désactiver un compte en cas de violation grave</li>
                  <li>Signaler aux autorités compétentes les contenus illégaux</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-content">3.5 Propriété intellectuelle</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Vous conservez tous les droits d'auteur sur vos ressources</li>
                  <li>En publiant, vous accordez une licence non-exclusive d'utilisation à la plateforme</li>
                  <li>Les contenus du Ministère sont en licence ouverte Etalab 2.0</li>
                  <li>Les marques (RE)SOURCES sont protégées et non utilisables</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-content">3.6 Limitation de responsabilité</h3>
                <p>La plateforme et ses contenus sont fournis "en l'état", sans garantie. Le Ministère ne peut être tenu responsable de :</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Les dommages directs ou indirects résultant de l'utilisation</li>
                  <li>Les contenus publiés par d'autres utilisateurs</li>
                  <li>Les interruptions de service (maintenance, incidents techniques)</li>
                  <li>Les pertes de données ou accès non autorisés</li>
                  <li>Les incompatibilités logicielles ou matérielles</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-content">3.7 Résiliation et fermeture de compte</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Vous pouvez demander la suppression de votre compte à tout moment</li>
                  <li>La plateforme peut suspendre un compte pour violation des CGU</li>
                  <li>La fermeture entraîne la suppression de vos données personnelles (RGPD Art. 17)</li>
                  <li>Les ressources créées peuvent être conservées dans les archives</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-content">3.8 Modifications des CGU</h3>
                <p>La plateforme peut modifier ces CGU à tout moment. Les modifications seront notifiées par email aux utilisateurs avec un délai de 30 jours avant entrée en vigueur.</p>
              </div>
            </section>

            {/* Droit applicable */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">4. DROIT APPLICABLE ET JURIDICTION</h2>
              <p>Ces CGU sont régies par le droit français. Tout litige sera soumis à la juridiction compétente du tribunal de grande instance de Paris.</p>
              <p>En cas de différend, la résolution sera tentée en premier lieu par voie amiable auprès du responsable du traitement.</p>
            </section>

            {/* Conformité légale */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-content">5. CONFORMITÉ LÉGALE</h2>
              <div className="space-y-2">
                <p><strong><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">RGPD</a> :</strong> Réglement (UE) 2016/679 du 27 avril 2016</p>
                <p><strong><a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNIL</a> :</strong> Commission Nationale de l'Informatique et des Libertés</p>
                <p><strong><a href="https://www.legifrance.gouv.fr/loistraitement/TEXTEF000010977119/LEGITEXT000010977119/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">RGAA</a> :</strong> Référentiel Général d'Amélioration de l'Accessibilité 4.1</p>
                <p><strong><a href="https://www.legifrance.gouv.fr/loistraitement/TEXTEF000009768475/LEGITEXT000009768475/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Loi Handicap</a> :</strong> Loi 2005-102 du 11 février 2005</p>
                <p><strong><a href="https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006052128" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Loi Informatique et Libertés</a> :</strong> Loi 78-17 du 6 janvier 1978 modifiée</p>
              </div>
            </section>

            {/* Dernière mise à jour */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-sm text-blue-800 space-y-2">
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

