// Authentication context and hooks
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  isAuthenticated as checkAuth,
  type AuthUser,
} from '@/lib/api';

interface User extends AuthUser {}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const ADMIN_ROLES = ['Administrateur', 'Super-administrateur', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'];
const MODERATOR_ROLES = ['Modérateur', 'Administrateur', 'Super-administrateur', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_MODERATOR'];
const SUPER_ADMIN_ROLES = ['Super-administrateur', 'ROLE_SUPER_ADMIN'];

function checkRole(user: User | null, allowed: string[]): boolean {
  if (!user) return false;
  return [user.role, ...(user.roles ?? [])].filter(Boolean).some(r => allowed.includes(r));
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const checkAuthentication = async () => {
      try {
        if (checkAuth()) {
          try {
            const currentUser = await getCurrentUser();
            const normalizedUser = {
              id: currentUser.id,
              email: currentUser.email,
              name: currentUser.name || `${currentUser.firstname || ''} ${currentUser.lastname || ''}`.trim(),
              role: currentUser.role || currentUser.roles?.[0] || 'Citoyen',
              firstname: currentUser.firstname,
              lastname: currentUser.lastname,
              roles: currentUser.roles,
            };

            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          } catch (apiError) {
            console.warn('Falling back to cached user after /me failure:', apiError);
            const userData = localStorage.getItem('user');
            if (userData) {
              setUser(JSON.parse(userData));
            }
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiLogin({ email, password });

      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err; // re-throw so callers can display the exact error message
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    void apiLogout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: checkRole(user, ADMIN_ROLES),
        isModerator: checkRole(user, MODERATOR_ROLES),
        isSuperAdmin: checkRole(user, SUPER_ADMIN_ROLES),
        loading,
        login,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

