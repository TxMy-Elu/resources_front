'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-12">

        {/* Error Visual */}
        <div className="space-y-4">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-3xl font-bold text-content">Oups ! Une erreur est survenue</h1>
          <p className="text-content-muted">
            Quelque chose s'est mal passé. Veuillez réessayer.
          </p>
        </div>

        {/* Error Details */}
        {error.message && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 font-mono">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={reset}
            className="w-full bg-primary text-white hover:bg-primary-700 h-11 rounded-lg font-semibold"
          >
            Réessayer
          </Button>

          <Link href="/" className="w-full">
            <Button
              variant="outline"
              className="w-full bg-white text-content border-border-standard hover:bg-surface-muted h-11 rounded-lg font-semibold"
            >
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <p className="text-sm text-blue-800">
            Si le problème persiste, <Link href="/contact" className="font-semibold underline">contactez-nous</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

