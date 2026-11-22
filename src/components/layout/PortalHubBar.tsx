import React from 'react';
import { LayoutDashboard, FileText, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export type PortalHubMode = 'overview' | 'register' | 'dashboard';

interface PortalHubBarProps {
  portalTitle: string;
  portalSubtitle?: string;
  portalBadge?: string;
  portalIcon: React.ReactNode;
  activeMode: PortalHubMode;
  onModeChange: (mode: PortalHubMode) => void;
  registerLabel?: string;
  dashboardLabel?: string;
  hideRegister?: boolean;
}

export const PortalHubBar: React.FC<PortalHubBarProps> = ({
  portalTitle,
  portalSubtitle = 'Greater Accra Private Education Ecosystem',
  portalBadge = 'Greater Accra',
  portalIcon,
  activeMode,
  onModeChange,
  registerLabel = 'Registration & Onboarding',
  dashboardLabel = 'Live Operations Dashboard',
  hideRegister = false
}) => {
  return (
    <div className="bg-[#0B1E36] text-white border-b border-white/15 sticky top-16 z-30 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Portal Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-xs">
              {portalIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-tight text-white uppercase">
                  {portalTitle}
                </h1>
                {portalBadge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {portalBadge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                {portalSubtitle}
              </p>
            </div>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-semibold self-stretch md:self-auto overflow-x-auto no-scrollbar">
            
            <button
              type="button"
              onClick={() => onModeChange('overview')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeMode === 'overview'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Overview & Guide</span>
            </button>

            {!hideRegister && (
              <button
                type="button"
                onClick={() => onModeChange('register')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeMode === 'register'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{registerLabel}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onModeChange('dashboard')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeMode === 'dashboard'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{dashboardLabel}</span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
