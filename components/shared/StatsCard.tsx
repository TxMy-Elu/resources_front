import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}

export const StatsCard = ({ value, label, icon, trend, className }: StatsCardProps) => {
  return (
    <Card className={cn(
      "p-6 flex flex-col justify-center bg-white border border-border-standard/30 shadow-sm hover:shadow-md transition-shadow rounded-2xl",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary-600">
          {icon || <div className="w-4 h-4 bg-primary/40 rounded-full" />}
        </div>
        {trend && (
          <span className="text-xs font-bold text-success-700 bg-success-subtle px-2 py-1 rounded-md">
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h4 className="text-3xl font-bold text-content tracking-tight">{value}</h4>
        <p className="text-sm font-medium text-content-subtle">{label}</p>
      </div>
    </Card>
  );
};
