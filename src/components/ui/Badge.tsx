import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'navy' | 'gold' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    navy: 'bg-brand-navy/10 text-brand-navy border-brand-navy/20 font-medium',
    gold: 'bg-amber-50 text-amber-900 border-amber-200 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-800 border-amber-300 font-medium',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
    outline: 'border border-surface-border text-ink-secondary',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
