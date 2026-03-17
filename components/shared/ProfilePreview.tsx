'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const ProfilePreview = () => {
  return (
    <Card className="border border-border-standard/50 shadow-sm bg-white overflow-hidden rounded-2xl">
      <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pt-10 pb-8 px-8 border-b border-border-standard/30">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-surface-muted flex items-center justify-center text-content font-bold text-3xl border-4 border-white shadow-sm">
            ED
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-success border-2 border-white" />
        </div>
        
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 flex-1">
          <CardTitle className="text-2xl font-bold text-content tracking-tight">Elio Durand</CardTitle>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <Badge variant="secondary" className="bg-surface-sunken text-content-muted hover:bg-surface-sunken border-none font-medium px-3 py-1 rounded-md text-[11px]">Parent</Badge>
            <Badge variant="secondary" className="bg-primary/5 text-primary-700 hover:bg-primary/5 border-none font-medium px-3 py-1 rounded-md text-[11px]">Contributeur</Badge>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-3 pt-4 sm:pt-0">
          <Button variant="outline" className="border-border-standard font-medium text-sm h-10 px-6 rounded-lg hover:bg-surface-muted transition-colors">
            Modifier Profil
          </Button>
          <p className="text-xs text-content-subtle font-medium">Membre depuis 2024</p>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border-standard/30 bg-surface-muted/30">
          <div className="p-6 text-center space-y-1">
            <p className="text-3xl font-bold text-content">42</p>
            <p className="text-xs font-medium text-content-subtle">Ressources Vues</p>
          </div>
          <div className="p-6 text-center space-y-1">
            <p className="text-3xl font-bold text-content">05</p>
            <p className="text-xs font-medium text-content-subtle">Événements</p>
          </div>
          <div className="p-6 text-center space-y-1">
            <p className="text-3xl font-bold text-content">12</p>
            <p className="text-xs font-medium text-content-subtle">Contributions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
