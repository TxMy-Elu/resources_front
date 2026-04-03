'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  actions?: React.ReactNode;
  compact?: boolean;
}

export const PageHeader = ({
  title,
  description,
  breadcrumbs,
  showBackButton = true,
  actions,
  compact = false
}: PageHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Breadcrumbs par défaut selon la page
  const defaultBreadcrumbs: Record<string, BreadcrumbItem[]> = {
    '/catalogue': [
      { label: 'Accueil', href: '/' },
      { label: 'Catalogue', href: '/catalogue' }
    ],
    '/faq': [
      { label: 'Accueil', href: '/' },
      { label: 'FAQ', href: '/faq' }
    ],
    '/contact': [
      { label: 'Accueil', href: '/' },
      { label: 'Contact', href: '/contact' }
    ],
    '/admin': [
      { label: 'Admin', href: '/admin' }
    ],
    '/admin/utilisateurs': [
      { label: 'Admin', href: '/admin' },
      { label: 'Utilisateurs', href: '/admin/utilisateurs' }
    ],
    '/admin/ressources': [
      { label: 'Admin', href: '/admin' },
      { label: 'Ressources', href: '/admin/ressources' }
    ],
    '/admin/moderation': [
      { label: 'Admin', href: '/admin' },
      { label: 'Modération', href: '/admin/moderation' }
    ]
  };

  // Utiliser les breadcrumbs fournis ou les breadcrumbs par défaut
  const activeBreadcrumbs = breadcrumbs || defaultBreadcrumbs[pathname] || [];

  if (compact) {
    // Version ultra-compact pour pages comme détail ressource
    return (
      <div className="bg-white border-b border-border-standard/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 py-2">
            {showBackButton && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="flex-shrink-0 h-8 w-8"
                title="Retour"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <p className="text-xs text-content-muted truncate flex-1">
              {title}
            </p>
            {actions && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Version standard pour les pages admin
  return (
    <div className="bg-white border-b border-border-standard/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb - optionnel */}
        {activeBreadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 py-2 text-xs overflow-x-auto">
            {activeBreadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                <Link
                  href={item.href}
                  className="text-content-muted/70 hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
                {index < activeBreadcrumbs.length - 1 && (
                  <span className="text-content-muted/50">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Header avec titre et actions */}
        <div className="flex items-center justify-between gap-3 py-3">

          {/* Gauche: Bouton retour + Titre */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {showBackButton && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="flex-shrink-0 h-8 w-8"
                title="Retour"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}

            <div className="min-w-0">
              <h1 className="text-base font-bold text-content truncate">
                {title}
              </h1>
              {description && (
                <p className="text-content-muted text-xs hidden sm:block truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Droite: Actions */}
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

