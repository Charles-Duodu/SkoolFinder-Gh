import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  error,
  options,
  children,
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-ink-primary mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          "block w-full rounded-lg border border-surface-border bg-white text-sm text-ink-primary py-2 px-3",
          "focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 focus:outline-none transition-smooth",
          error && "border-rose-500",
          className
        )}
        {...props}
      >
        {options ? options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )) : children}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
