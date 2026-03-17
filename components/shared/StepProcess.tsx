import React from 'react';
import { cn } from '@/lib/utils';

interface StepProps {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export const StepProcess = ({ steps }: { steps: Omit<StepProps, 'isLast'>[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
      {/* Decorative connecting line for desktop */}
      <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-border-standard/50 z-0" />
      
      {steps.map((step, index) => (
        <div key={index} className="relative z-10 flex flex-col items-center text-center group">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-primary/20 shadow-sm flex items-center justify-center text-primary font-bold text-lg mb-6 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
            {step.number}
          </div>
          <h3 className="text-lg font-bold text-content mb-2">{step.title}</h3>
          <p className="text-sm font-medium text-content-muted leading-relaxed max-w-xs">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
};
