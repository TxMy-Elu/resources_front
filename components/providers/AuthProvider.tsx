'use client';

import { AuthProvider as AppAuthProvider } from '@/lib/auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AppAuthProvider>{children}</AppAuthProvider>;
}
