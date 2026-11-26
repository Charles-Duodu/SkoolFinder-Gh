'use client';

import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDemo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-200 bg-white text-ink-primary';
        let Icon = Info;
        let iconColor = 'text-blue-500';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-300 bg-emerald-50/95 text-emerald-950 shadow-emerald-500/10';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-600';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-300 bg-rose-50/95 text-rose-950 shadow-rose-500/10';
          Icon = AlertCircle;
          iconColor = 'text-rose-600';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-300 bg-amber-50/95 text-amber-950 shadow-amber-500/10';
          Icon = AlertTriangle;
          iconColor = 'text-amber-600';
        } else {
          borderClass = 'border-blue-200 bg-blue-50/95 text-blue-950 shadow-blue-500/10';
          Icon = Info;
          iconColor = 'text-blue-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 flex items-start gap-3 animate-in slide-in-from-bottom-3 ${borderClass}`}
            role="alert"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>
              <p className="text-[11px] leading-relaxed mt-0.5 opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
