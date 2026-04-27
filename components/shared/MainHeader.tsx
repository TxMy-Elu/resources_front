'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export const MainHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isModerator, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const activeClass = 'text-primary border-b-2 border-primary pb-1';
  const inactiveClass = 'text-content hover:text-primary';

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/catalogue', label: 'Ressources' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Mon espace' }] : []),
  ];

  const displayName = user?.name || user?.email || 'Invité';
  const displayRole = user?.role || 'Visiteur';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'IN';

  const handleLogout = () => {
    logout();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-standard/30 bg-white/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary-900 leading-none tracking-tighter uppercase italic">Liberté • Égalité • Fraternité</span>
              <div className="h-0.5 w-12 bg-primary-600 my-0.5" />
              <span className="text-sm font-extrabold text-primary tracking-tight">RÉPUBLIQUE FRANÇAISE</span>
            </div>
            <div className="h-10 w-px bg-border-standard mx-2 hidden sm:block" />
            <div className="flex flex-col justify-center">
              <span className="text-lg font-extrabold text-content leading-tight">
                (RE)SOURCES
              </span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] leading-none">
                Relationnelles
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-bold transition-all',
                  isActive(link.href) ? activeClass : inactiveClass
                )}
              >
                {link.label}
              </Link>
            ))}
            {isModerator && !isAdmin && (
              <Link
                href="/admin/moderation"
                className={cn(
                  'text-sm font-bold transition-all px-3 py-1 rounded-full',
                  isActive('/admin/moderation')
                    ? 'text-white bg-orange-600'
                    : 'text-orange-600 bg-orange-100 hover:bg-orange-200'
                )}
              >
                Modération
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  'text-sm font-bold transition-all px-3 py-1 rounded-full',
                  isActive('/admin')
                    ? 'text-white bg-primary'
                    : 'text-primary bg-primary/10 hover:bg-primary/20'
                )}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Profile & Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-content">{displayName}</span>
                  <span className="text-[10px] text-content-subtle font-bold bg-surface-sunken px-2 py-0.5 rounded-md uppercase tracking-wide">{displayRole}</span>
                </div>
                <Link href="/profile" className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-primary-800 font-extrabold text-sm border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
                  {initials}
                </Link>
                <Button
                  variant="outline"
                  className="hidden md:inline-flex rounded-xl border-gray-200"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/inscription"
                  className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/20"
                >
                  S&apos;inscrire
                </Link>
                <Link
                  href="/connexion"
                  className="rounded-xl bg-primary px-3 py-2 text-sm font-bold text-white hover:bg-primary-700"
                >
                  Se connecter
                </Link>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border-standard/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block text-sm font-bold px-3 py-2 rounded transition-colors',
                  isActive(link.href)
                    ? 'text-white bg-primary'
                    : 'text-content hover:text-primary hover:bg-surface-muted'
                )}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border-standard/20 mt-2 pt-2">
              <Link
                href="/inscription"
                className={cn(
                  'block text-sm font-bold px-3 py-2 rounded transition-colors',
                  isActive('/inscription')
                    ? 'text-white bg-primary'
                    : 'text-primary hover:text-primary-700 bg-primary/10 hover:bg-primary/20'
                )}
                onClick={() => setMenuOpen(false)}
              >
                S&apos;inscrire
              </Link>
              <Link
                href="/connexion"
                className={cn(
                  'block text-sm font-bold px-3 py-2 rounded transition-colors',
                  isActive('/connexion')
                    ? 'text-white bg-primary'
                    : 'text-primary hover:text-primary-700 bg-primary/10 hover:bg-primary/20'
                )}
                onClick={() => setMenuOpen(false)}
              >
                Se connecter
              </Link>
            </div>

            <div className="border-t border-border-standard/20 mt-2 pt-2 space-y-1">
              {isAuthenticated && (
                <button
                  type="button"
                  className="block w-full rounded px-3 py-2 text-left text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                >
                  Déconnexion
                </button>
              )}
              {isModerator && !isAdmin && (
                <Link
                  href="/admin/moderation"
                  className={cn(
                    'block text-sm font-bold px-3 py-2 rounded transition-colors',
                    isActive('/admin/moderation')
                      ? 'text-white bg-orange-600'
                      : 'text-orange-600 bg-orange-100 hover:bg-orange-200'
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Modération
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    'block text-sm font-bold px-3 py-2 rounded transition-colors',
                    isActive('/admin')
                      ? 'text-white bg-primary'
                      : 'text-primary bg-primary/10 hover:bg-primary/20'
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
