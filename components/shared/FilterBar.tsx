'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';

export const FilterBar = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl border border-border-standard/50 shadow-sm w-full">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-subtle" />
        <Input 
          placeholder="Rechercher une ressource (ex: Parentalité, École...)" 
          className="pl-10 h-11 border-none bg-surface-muted/50 focus-visible:ring-1 focus-visible:ring-primary/20 text-sm font-medium"
        />
      </div>
      
      <div className="flex gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px] h-11 border-none bg-surface-muted/50 font-medium">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            <SelectItem value="video">Vidéos</SelectItem>
            <SelectItem value="pdf">Guides PDF</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="recent">
          <SelectTrigger className="w-[160px] h-11 border-none bg-surface-muted/50 font-medium hidden sm:flex">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="popular">Plus populaires</SelectItem>
            <SelectItem value="az">De A à Z</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 border-none bg-surface-muted/50 text-content-muted hover:text-primary">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        
        <Button className="h-11 px-6 bg-primary text-white font-semibold rounded-xl shadow-sm hover:bg-primary-700">
          Filtrer
        </Button>
      </div>
    </div>
  );
};
