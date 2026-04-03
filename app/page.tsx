'use client';

import Link from "next/link";
import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/shared/MainHeader';
import { MainFooter } from '@/components/shared/MainFooter';
import { StatsCard } from '@/components/shared/StatsCard';
import { StepProcess } from '@/components/shared/StepProcess';
import { TestimonialCard } from '@/components/shared/TestimonialCard';
import { Users, FileText, Calendar, MessageCircle, BookOpen, HelpCircle } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col selection:bg-secondary/30 selection:text-primary-900">
            <MainHeader />

            <main className="grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white border-b border-gray-100 py-24 sm:py-32">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="max-w-3xl">
                            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-semibold px-3 py-1 mb-6 rounded-full text-xs">
                                Bienvenue sur (RE)SOURCES
                            </Badge>
                            <h1 className="text-5xl font-bold text-content tracking-tight sm:text-7xl mb-8 leading-[1.1]">
                                Un accès <span className="text-primary">simplifié</span> aux ressources relationnelles
                            </h1>
                            <p className="text-lg text-content-muted leading-relaxed font-medium mb-10 max-w-2xl">
                                Une plateforme pour les familles, les couples et tous ceux qui cherchent du soutien dans leurs relations. Accédez à des guides, vidéos et outils validés par des experts.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-8 h-12 rounded-xl text-base transition-all">
                                    <Link href="/catalogue" className="w-full h-full flex items-center justify-center">
                                        Découvrir le catalogue
                                    </Link>
                                </Button>
                                <Button variant="outline" className="bg-white text-content border-gray-200 hover:bg-gray-50 font-semibold px-8 h-12 rounded-xl text-base transition-all shadow-sm">
                                    <Link href="/faq" className="w-full h-full flex items-center justify-center">
                                        FAQ et Aide
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Sections */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">

                    {/* Stats Section */}
                    <section className="space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-content tracking-tight">L&apos;impact de la plateforme</h2>
                                <p className="text-content-subtle font-medium text-sm">Chiffres clés de nos actions</p>
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
                                { number: "1", title: "Je m'inscris", description: "Créez votre compte gratuitement en quelques clics et accédez à l'ensemble de nos ressources." },
                                { number: "2", title: "Je consulte", description: "Accédez à des centaines de guides, vidéos et podcasts validés par des professionnels." },
                                { number: "3", title: "Je partage", description: "Proposez vos propres ressources et participez à notre communauté d'entraide." }
                            ]}
                        />
                    </section>

                    {/* CTA Section */}
                    <section className="bg-gradient-to-r from-primary/10 to-secondary/10 p-12 rounded-[2.5rem] border border-primary/20">
                        <div className="text-center space-y-6">
                            <h2 className="text-3xl font-bold text-content">Prêt(e) à commencer ?</h2>
                            <p className="text-content-muted max-w-2xl mx-auto">
                                Rejoignez des milliers de familles qui trouvent le soutien dont elles ont besoin.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button className="bg-primary text-white hover:bg-primary-700 shadow-sm font-semibold px-8 h-12 rounded-xl text-base transition-all">
                                    <Link href="/inscription" className="w-full h-full flex items-center justify-center">
                                        S&apos;inscrire
                                    </Link>
                                </Button>
                                <Button variant="outline" className="bg-white text-content border-gray-200 hover:bg-gray-50 font-semibold px-8 h-12 rounded-xl text-base transition-all shadow-sm">
                                    <Link href="/connexion" className="w-full h-full flex items-center justify-center">
                                        Se connecter
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="space-y-8">
                        <div className="text-center space-y-2 max-w-2xl mx-auto mb-10">
                            <h2 className="text-2xl font-bold text-content tracking-tight">Ils utilisent (RE)SOURCES</h2>
                            <p className="text-content-subtle font-medium text-sm">Découvrez les retours des familles qui ont fait appel à notre plateforme.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <TestimonialCard
                                quote="Les vidéos sur la communication bienveillante m&apos;ont beaucoup aidée avec mes ados. C&apos;est clair et très facile à appliquer au quotidien."
                                author="Sophie Martin"
                                role="Mère de 2 enfants"
                            />
                            <TestimonialCard
                                quote="J&apos;ai enfin pu comprendre à quelles aides j&apos;avais droit grâce aux guides PDF. Le moteur de recherche est vraiment très bien fait."
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

                    {/* Help Section */}
                    <section className="space-y-8 pt-8 border-t border-gray-100">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-content tracking-tight">Besoin d&apos;aide ?</h2>
                            <p className="text-content-subtle font-medium text-sm">Nous sommes là pour vous accompagner</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-center">
                                <HelpCircle className="w-8 h-8 text-primary mx-auto" />
                                <h3 className="font-bold text-content">FAQ</h3>
                                <p className="text-content-muted text-sm">Consultez notre foire aux questions pour trouver des réponses rapides.</p>
                                <Link href="/faq" className="text-primary font-semibold text-sm hover:underline">Voir la FAQ →</Link>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-center">
                                <MessageCircle className="w-8 h-8 text-primary mx-auto" />
                                <h3 className="font-bold text-content">Accessibilité</h3>
                                <p className="text-content-muted text-sm">Signalez un problème d&apos;accessibilité via notre formulaire dédié.</p>
                                <Link href="/accessibilite" className="text-primary font-semibold text-sm hover:underline">Signaler un problème →</Link>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-center">
                                <BookOpen className="w-8 h-8 text-primary mx-auto" />
                                <h3 className="font-bold text-content">Contact</h3>
                                <p className="text-content-muted text-sm">Envoyez-nous vos questions et suggestions directement.</p>
                                <Link href="/contact" className="text-primary font-semibold text-sm hover:underline">Nous contacter →</Link>
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
