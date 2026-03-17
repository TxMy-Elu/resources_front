import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'danger';

interface StatusAlertProps {
  type: AlertType;
  title: string;
  message: string;
  className?: string;
}

const statusConfig: Record<AlertType, { icon: React.ReactNode; styles: string }> = {
  info: {
    icon: <Info className="h-5 w-5" />,
    styles: "border-info/20 bg-info-subtle/50 text-info [&>svg]:text-info"
  },
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    styles: "border-success/20 bg-success-subtle/50 text-success-700 [&>svg]:text-success"
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    styles: "border-warning/20 bg-warning-subtle/50 text-warning-800 [&>svg]:text-warning-600"
  },
  danger: {
    icon: <XCircle className="h-5 w-5" />,
    styles: "border-danger/20 bg-danger-subtle/50 text-danger-800 [&>svg]:text-danger"
  }
};

export const StatusAlert = ({ type, title, message, className }: StatusAlertProps) => {
  const config = statusConfig[type];

  return (
    <Alert className={cn("rounded-xl border shadow-sm transition-all", config.styles, className)}>
      {config.icon}
      <AlertTitle className="font-semibold text-[15px] mb-1.5">{title}</AlertTitle>
      <AlertDescription className="text-sm opacity-90 font-medium">
        {message}
      </AlertDescription>
    </Alert>
  );
};
