import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true" 
      />
      <div 
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-floating border border-surface-border overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200",
          maxWidths[maxWidth]
        )}
      >
        {(title || description) && (
          <div className="px-6 py-4 border-b border-surface-border flex items-start justify-between bg-slate-50/50">
            <div>
              {title && <h2 className="text-lg font-bold text-ink-primary">{title}</h2>}
              {description && <p className="text-xs text-ink-secondary mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-ink-secondary hover:text-ink-primary p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
