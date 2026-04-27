'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CommentsButton } from './CommentsButton';

export type ResourceType = 'video' | 'pdf' | 'article' | 'audio' | 'event';

export interface ResourceCardProps {
  type: ResourceType;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  duration?: string;
  author?: string;
  isNew?: boolean;
  fileSize?: string;
  onAction?: () => void;
  className?: string;
  resourceId?: number;
  isAuthenticated?: boolean;
}

const typeConfig: Record<ResourceType, { icon: React.ReactNode; label: string; actionLabel: string }> = {
  video: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    label: "Vidéo",
    actionLabel: "Regarder"
  },
  pdf: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
    label: "Document PDF",
    actionLabel: "Télécharger"
  },
  article: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
    label: "Article",
    actionLabel: "Lire la suite"
  },
  audio: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    label: "Audio",
    actionLabel: "Écouter"
  },
  event: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    label: "Événement",
    actionLabel: "S'inscrire"
  }
};

export const ResourceCard = ({
  type,
  title,
  description,
  imageUrl,
  category,
  duration,
  author,
  isNew,
  onAction,
  className,
  resourceId,
  isAuthenticated = false
}: ResourceCardProps) => {
  const config = typeConfig[type];

  // Fallback to article type if config not found
  const safeConfig = config || typeConfig['article'];

  return (
    <Card className={cn(
      "group flex flex-col h-full overflow-hidden transition-all duration-300",
      "bg-white border border-border-standard/30 shadow-sm",
      "hover:border-primary/20 hover:shadow-md hover:-translate-y-1 rounded-2xl",
      className
    )}>
      {/* Image Section */}
      <div className="relative w-full aspect-video bg-surface-muted m-0 p-0 overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 w-full h-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-content-subtle opacity-50">
               {safeConfig.icon}
             </div>
           )}
        </div>
        
        {/* Overlays */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <Badge className="bg-white/95 text-content border-none font-semibold text-[10px] uppercase tracking-wider px-2.5 py-0.5 shadow-sm rounded-md">
            {category}
          </Badge>
          {isNew && (
            <Badge className="bg-primary text-white border-none font-semibold text-[10px] uppercase tracking-wider px-2.5 py-0.5 shadow-sm rounded-md">
              Nouveau
            </Badge>
          )}
        </div>
      </div>

       <div className="flex flex-col flex-grow p-5">
         <div className="flex items-center gap-2 mb-3 text-content-subtle">
           <div className="w-4 h-4 opacity-70">
             {safeConfig.icon}
           </div>
           <span className="text-[11px] font-medium tracking-wide">
             {safeConfig.label}
           </span>
          {duration && (
            <>
              <span className="w-1 h-1 rounded-full bg-border-standard" />
              <span className="text-[11px] font-medium tracking-wide">
                {duration}
              </span>
            </>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-content leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-content-muted text-sm leading-relaxed line-clamp-2 mb-6">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-standard/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-surface-sunken flex items-center justify-center text-[9px] font-bold text-content-muted">
              {author?.substring(0, 2).toUpperCase() || 'RF'}
            </div>
            <span className="text-xs font-medium text-content-subtle truncate max-w-[120px]">
              {author || "Ministère"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {resourceId !== undefined && (
              <div onClick={(e) => e.preventDefault()}>
                <CommentsButton
                  resourceId={resourceId}
                  resourceTitle={title}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            )}
            <Button
              variant="ghost"
              onClick={onAction}
              className="text-primary hover:text-primary-700 hover:bg-primary/5 font-semibold text-xs px-3 h-8 rounded-lg transition-colors"
            >
              {safeConfig.actionLabel} →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
