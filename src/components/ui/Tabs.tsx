import React from 'react';
import { cn } from '../../lib/utils';

interface TabsProps {
  tabs: { id: string; label: string; count?: number; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("border-b border-surface-border flex space-x-1 overflow-x-auto no-scrollbar", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              isActive
                ? "border-brand-navy text-brand-navy font-semibold"
                : "border-transparent text-ink-secondary hover:text-ink-primary hover:border-slate-300"
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-bold",
                isActive ? "bg-brand-navy/10 text-brand-navy" : "bg-slate-100 text-slate-600"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
