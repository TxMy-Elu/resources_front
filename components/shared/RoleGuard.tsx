'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MainHeader } from './MainHeader';

export type RequiredRole = 'authenticated' | 'moderateur' | 'admin' | 'super-admin';

interface RoleGuardProps {
  children: React.ReactNode;
  required: RequiredRole;
  redirectTo?: string;
}

export function RoleGuard({ children, required, redirectTo }: RoleGuardProps) {
  const { isAuthenticated, isAdmin, isModerator, isSuperAdmin, loading } = useAuth();
  const router = useRouter();

  const hasAccess = () => {
    if (!isAuthenticated) return false;
    switch (required) {
      case 'authenticated': return true;
      case 'moderateur':   return isModerator;
      case 'admin':        return isAdmin;
      case 'super-admin':  return isSuperAdmin;
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!hasAccess()) {
      router.replace(redirectTo ?? (!isAuthenticated ? '/connexion' : '/'));
    }
  }, [loading, isAuthenticated, isAdmin, isModerator, isSuperAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        <MainHeader />
        <main className="grow flex items-center justify-center">
          <p className="text-content-muted text-lg animate-pulse">Chargement…</p>
        </main>
      </div>
    );
  }

  if (!hasAccess()) return null;

  return <>{children}</>;
}
