import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  className?: string;
}

export const TestimonialCard = ({ quote, author, role, className }: TestimonialProps) => {
  return (
    <Card className={cn(
      "p-8 bg-surface-muted/30 border border-border-standard/30 shadow-sm rounded-2xl relative",
      className
    )}>
      {/* Quote Icon watermark */}
      <div className="absolute top-6 left-6 text-6xl text-primary/5 font-serif leading-none select-none">
        &quot;
      </div>
      
      <div className="relative z-10">
        <p className="text-content-muted font-medium text-base leading-relaxed mb-6 italic">
          &quot;{quote}&quot;
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-primary-700 font-bold text-sm border border-white shadow-sm">
            {author.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-content">{author}</span>
            <span className="text-[10px] font-medium text-content-subtle uppercase tracking-widest">{role}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
