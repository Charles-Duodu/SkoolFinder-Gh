import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  icon,
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary: "bg-brand-navy hover:bg-brand-navy-light text-white focus:ring-brand-navy shadow-sm",
    secondary: "bg-surface-muted hover:bg-slate-200 text-ink-primary focus:ring-slate-400",
    outline: "border border-surface-border hover:bg-surface-muted text-ink-primary focus:ring-brand-navy",
    ghost: "text-ink-primary hover:bg-surface-muted focus:ring-slate-300",
    gold: "bg-brand-gold hover:bg-brand-gold-dark text-brand-navy-dark font-semibold focus:ring-brand-gold shadow-sm",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
