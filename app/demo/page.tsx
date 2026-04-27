'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResourceCard, ResourceCardProps } from '@/components/shared/ResourceCard';
import { StatusAlert } from '@/components/shared/StatusAlert';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { ProfilePreview } from '@/components/shared/ProfilePreview';
import { StatsCard } from '@/components/shared/StatsCard';
import { StepProcess } from '@/components/shared/StepProcess';
import { TestimonialCard } from '@/components/shared/TestimonialCard';
import { FilterBar } from '@/components/shared/FilterBar';
import { AdminTable } from '@/components/shared/AdminTable';
import { Users, FileText, Calendar } from 'lucide-react';
import { getResources, ApiResource } from '@/lib/api';

export default function DemoPage() {
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResources();
        setResources(data.slice(0, 8)); // Limiter à 8 pour la démo
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mockResources: ResourceCardProps[] = resources.map(r => {
    // Map type from API format to component format
    const typeMap: Record<string, 'video' | 'pdf' | 'article' | 'audio' | 'event'> = {
      'video': 'video',
      'pdf': 'pdf',
      'article': 'article',
      'audio': 'audio',
      'event': 'event',
      'default': 'article'
    };

    const resourceType = typeMap[r.type_ressource?.toLowerCase() || ''] || 'article';

    return {
      type: resourceType,
      title: r.titre,
      description: r.description,
      imageUrl: r.imageUrl || 'https://images.unsplash.com/photo-1536640712247-c45474762ef4?auto=format&fit=crop&q=80&w=800',
      category: r.category || 'Général',
      author: r.createur,
      isNew: new Date(r.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    };
  });

  // Badge component
  function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: string, className?: string }) {
    const variants: Record<string, string> = {
      default: "bg-primary text-white",
      outline: "border border-primary text-primary bg-transparent",
      secondary: "bg-secondary text-content"
    };
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
        {children}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <main className="grow flex items-center justify-center">
          <p className="text-content-muted text-lg">Chargement des ressources...</p>
        </main>
        <MainFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col selection:bg-secondary/30 selection:text-primary-900">
      <MainHeader />

      <main className="grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white border-b border-gray-100 py-24 sm:py-32">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-semibold px-3 py-1 mb-6 rounded-full text-xs">
                Design System v4.0
              </Badge>
              <h1 className="text-5xl font-bold text-content tracking-tight sm:text-7xl mb-8 leading-[1.1]">
                {"Un accès "} <span className="text-primary">simplifié</span> {" aux ressources"}
              </h1>
              <p className="text-lg text-content-muted leading-relaxed font-medium mb-10 max-w-2xl">
                Une plateforme modernisée pour accompagner les familles. Explorez nos guides, vidéos et outils interactifs conformes aux standards de l&apos;État.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-8 h-12 rounded-xl text-base transition-all">
                  Toutes les ressources
                </Button>
                <Button variant="outline" className="bg-white text-content border-gray-200 hover:bg-gray-50 font-semibold px-8 h-12 rounded-xl text-base transition-all shadow-sm">
                  Consulter l&apos;agenda
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
          
          {/* Key Figures / Stats Section */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-content tracking-tight">L&apos;impact de la plateforme</h2>
                <p className="text-content-subtle font-medium text-sm">Chiffres clés de l&apos;année en cours</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                value="54 230" 
                label="Familles accompagnées" 
                trend="+12%"
                icon={<Users className="w-6 h-6" />}
              />
              <StatsCard 
                value="1 250" 
                label="Ressources validées" 
                icon={<FileText className="w-6 h-6" />}
              />
              <StatsCard 
                value="340" 
                label="Événements organisés" 
                trend="+5%"
                icon={<Calendar className="w-6 h-6" />}
              />
              <StatsCard 
                value="98%" 
                label="Taux de satisfaction" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.8 2H22v10.2"/><path d="m22 2-10 10"/><path d="M12 22A10 10 0 1 1 22 12"/></svg>
                }
              />
            </div>
          </section>

          {/* How it works Section */}
          <section className="space-y-12 bg-gray-50/70 p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-content tracking-tight">Comment ça marche ?</h2>
              <p className="text-content-subtle font-medium text-sm">Un parcours simple et intuitif pour trouver l&apos;aide dont vous avez besoin.</p>
            </div>
            <StepProcess 
              steps={[
                { number: "1", title: "Je recherche", description: "Utilisez notre moteur de recherche thématique pour cibler votre besoin (éducation, santé...)." },
                { number: "2", title: "Je consulte", description: "Accédez à des centaines de guides, vidéos et podcasts validés par des professionnels." },
                { number: "3", title: "J'applique", description: "Mettez en pratique les conseils et participez à nos ateliers en ligne ou en présentiel." }
              ]} 
            />
          </section>

          {/* Profile Section Preview */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-content tracking-tight">Mon Tableau de Bord</h2>
                <p className="text-content-subtle font-medium text-sm">Suivi de vos activités</p>
              </div>
            </div>
            <ProfilePreview />
          </section>

          {/* Resources Grid Section */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-content tracking-tight">Catalogue des Ressources</h2>
                <p className="text-content-subtle font-medium text-sm">Recherchez et filtrez parmi plus de 1000 contenus.</p>
              </div>
            </div>
            
            <FilterBar />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {mockResources.map((res, index) => (
                <ResourceCard 
                  key={index}
                  {...res}
                  onAction={() => alert(`Action sur : ${res.title}`)}
                />
              ))}
            </div>
          </section>

          {/* Admin Back-Office Preview */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-content tracking-tight">Espace Modérateur (Back-Office)</h2>
                <p className="text-content-subtle font-medium text-sm">Vue administrateur pour la gestion du catalogue.</p>
              </div>
            </div>
            <AdminTable />
          </section>

          {/* Testimonials Section */}
          <section className="space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl font-bold text-content tracking-tight">Ils utilisent (RE)SOURCES</h2>
              <p className="text-content-subtle font-medium text-sm">Découvrez les retours des familles qui ont fait appel à notre plateforme.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TestimonialCard 
                quote="Les vidéos sur la communication bienveillante m'ont beaucoup aidée avec mes ados. C'est clair et très facile à appliquer au quotidien."
                author="Sophie Martin"
                role="Mère de 2 enfants"
              />
              <TestimonialCard 
                quote="J'ai enfin pu comprendre à quelles aides j'avais droit grâce aux guides PDF. Le moteur de recherche est vraiment très bien fait."
                author="Thomas Dubois"
                role="Père au foyer"
              />
              <TestimonialCard 
                quote="Les ateliers en ligne organisés par les associations sont d'une grande qualité. On se sent moins seul face aux difficultés."
                author="Leila Kassam"
                role="Parent solo"
              />
            </div>
          </section>

          {/* Forms & Status Alerts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
            {/* Status Section */}
            <div className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-content tracking-tight">Notifications</h2>
                <p className="text-content-subtle font-medium text-sm">Alertes et informations</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <StatusAlert 
                  type="info"
                  title="Maintenance Indisponibilité"
                  message="La plateforme sera indisponible pour maintenance technique ce dimanche de 2h à 4h du matin."
                />
                <StatusAlert 
                  type="success"
                  title="Inscription Validée"
                  message="Votre demande d'accès au portail 'Partenaire' a été validée avec succès."
                />
                <StatusAlert 
                  type="warning"
                  title="Sécurité du Compte"
                  message="Nous avons détecté une connexion inhabituelle sur votre compte."
                />
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-content tracking-tight">Trouver une Ressource</h2>
                <p className="text-content-subtle font-medium text-sm">Moteur de recherche avancé</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="search-input" className="text-xs font-semibold text-gray-600">Rechercher par mot-clé</Label>
                  <Input
                    type="text" 
                    id="search-input" 
                    placeholder="Ex: Éducation, Parentalité, Santé..." 
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/20 bg-gray-50/50 font-medium text-content placeholder:text-content-subtle px-4"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-2">
                    <Label className="text-xs font-semibold text-gray-600">Thématique</Label>
                    <div className="h-11 border border-gray-200 rounded-xl bg-gray-50/50 flex items-center px-4 text-content-muted font-medium text-sm cursor-pointer hover:bg-gray-100/60 transition-colors">
                      Toutes les thématiques
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <Label className="text-xs font-semibold text-gray-600">Type de média</Label>
                    <div className="h-11 border border-gray-200 rounded-xl bg-gray-50/50 flex items-center px-4 text-content-muted font-medium text-sm cursor-pointer hover:bg-gray-100/60 transition-colors">
                      Tous les formats
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-primary text-white h-12 rounded-xl font-semibold text-base shadow-sm hover:bg-primary-700 transition-all mt-2">
                  Lancer la recherche
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: string, className?: string }) {
  const variants: Record<string, string> = {
    default: "bg-primary text-white",
    outline: "border border-primary text-primary bg-transparent",
    secondary: "bg-secondary text-content"
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
