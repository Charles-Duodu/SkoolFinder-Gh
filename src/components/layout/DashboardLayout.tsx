'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import {
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { SignOutButton } from './SignOutButton';
import { cn } from '../../lib/utils';

export interface DashboardNavItem {
  id: string;
  label: string;
  path?: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export interface PlanWidgetConfig {
  badge: string;
  planName: string;
  subtext: string;
  buttonText: string;
  onButtonClick?: () => void;
  publicLink?: string;
  publicLinkText?: string;
}

interface DashboardLayoutProps {
  portalName: string;
  portalSubtitle: string;
  portalTag?: string;
  navItems?: DashboardNavItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  sidebarVariant?: 'white' | 'blue';
  groupTitle?: string;
  planWidget?: PlanWidgetConfig;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  portalName,
  portalSubtitle,
  portalTag,
  navItems = [],
  activeTab,
  onTabChange,
  children,
  actionButton,
  sidebarVariant = 'blue',
  groupTitle = 'YOUR WORKSPACE',
  planWidget,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { role } = useDemo();

  const isBlue = sidebarVariant === 'blue';

  // Role-based auto-tag if not specified
  const effectiveTag = portalTag || (
    role === 'school_owner' ? 'SCHOOL OWNERS' :
    role === 'supplier' ? 'SUPPLIERS & VENDORS' :
    role === 'parent' ? 'PARENTS & GUARDIANS' :
    role === 'professional' ? 'PROFESSIONALS' :
    'WORKSPACE'
  );

  // Role-based default plan widget if not provided
  const effectivePlanWidget: PlanWidgetConfig = planWidget || (
    role === 'school_owner' ? {
      badge: 'Institution Active',
      planName: 'Verified School Profile',
      subtext: 'Institutional campus workspace enabled.',
      buttonText: 'Campus settings',
      onButtonClick: () => onTabChange?.('settings'),
      publicLink: '/schools',
      publicLinkText: 'Browse public listings'
    } :
    role === 'supplier' ? {
      badge: 'Commercial Active',
      planName: 'Verified Supplier',
      subtext: 'Educational vendor tenders active.',
      buttonText: 'Vendor profile',
      onButtonClick: () => onTabChange?.('profile'),
      publicLink: '/suppliers',
      publicLinkText: 'Explore suppliers directory'
    } :
    role === 'parent' ? {
      badge: 'Family Active',
      planName: 'Parent Shortlist Hub',
      subtext: 'Active admission inquiries enabled.',
      buttonText: 'Compare schools',
      onButtonClick: () => onTabChange?.('comparisons'),
      publicLink: '/schools',
      publicLinkText: 'Find more schools'
    } : {
      badge: 'Free active',
      planName: 'Career + Services',
      subtext: 'Approved activities, within your plan.',
      buttonText: 'View plan & usage',
      onButtonClick: () => onTabChange?.('billing'),
      publicLink: '/professionals',
      publicLinkText: 'Explore public page'
    }
  );

  // Format subtitle to render bullet cleanly
  const formattedSubtitle = portalSubtitle.replace(/&bull;/g, '•');

  // Determine current active item for breadcrumbs
  const currentNav = navItems.find(item => 
    activeTab ? item.id === activeTab : item.path === pathname
  ) || navItems[0];

  const handleItemClick = (item: DashboardNavItem) => {
    if (onTabChange) {
      onTabChange(item.id);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface-bg flex">
      {/* Desktop Left Sidebar (The sole, clickable navigation) */}
      <aside className={cn(
        "hidden md:flex md:w-64 flex-col shrink-0 sticky top-0 h-screen transition-colors select-none",
        isBlue ? "bg-[#0B1E36] border-r border-slate-800 text-slate-100" : "bg-white border-r border-surface-border"
      )}>
        {/* Brand & Portal Header */}
        <div className={cn("p-5 border-b", isBlue ? "border-slate-800" : "border-surface-border")}>
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold mb-3 py-1 px-1.5 rounded-lg transition-colors",
              isBlue ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-ink-secondary hover:text-brand-navy hover:bg-slate-50"
            )}
            title="Return to Public Directory"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Directory</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
              isBlue ? "bg-amber-400 text-slate-950 font-black" : "bg-brand-navy text-amber-400"
            )}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className={cn("text-sm font-bold leading-tight truncate", isBlue ? "text-white font-serif" : "text-ink-primary")}>
                {portalName}
              </h2>
              {effectiveTag && (
                <p className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase leading-none mt-0.5">
                  {effectiveTag}
                </p>
              )}
              <p className={cn("text-[11px] truncate mt-0.5", isBlue ? "text-slate-400" : "text-ink-secondary")}>
                {formattedSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Group Heading */}
        {groupTitle && (
          <div className={cn("px-4 pt-4 pb-1 text-[10px] font-black uppercase tracking-widest", isBlue ? "text-slate-400" : "text-ink-muted")}>
            {groupTitle}
          </div>
        )}

        {/* Navigation Items (Interactive Tab Switchers) */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab ? activeTab === item.id : pathname === item.path;

            const activeClass = isBlue
              ? 'bg-[#0078D4] text-white shadow-md border-l-4 border-amber-400 rounded-r-xl rounded-l-none pl-3 pr-3.5 py-2.5 font-bold'
              : 'bg-brand-navy text-white shadow-sm rounded-xl px-3.5 py-2.5';

            const inactiveClass = isBlue
              ? 'text-slate-300 hover:text-white hover:bg-white/5 rounded-xl px-3.5 py-2.5 font-medium'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100 rounded-xl px-3.5 py-2.5';

            if (onTabChange) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between text-xs transition-all ${
                    isActive ? activeClass : inactiveClass
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={isActive ? (isBlue ? 'text-white' : 'text-amber-400') : (isBlue ? 'text-slate-400' : 'text-ink-muted shrink-0')}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? (isBlue ? 'bg-white/20 text-white' : 'bg-amber-400 text-slate-950')
                          : (isBlue ? 'bg-slate-800 text-slate-300 border border-slate-700/60' : 'bg-slate-200 text-slate-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.path || '#'}
                className={`flex items-center justify-between text-xs transition-all ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={isActive ? (isBlue ? 'text-white' : 'text-amber-400') : (isBlue ? 'text-slate-400' : 'text-ink-muted shrink-0')}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? (isBlue ? 'bg-white/20 text-white' : 'bg-amber-400 text-slate-950')
                        : (isBlue ? 'bg-slate-800 text-slate-300 border border-slate-700/60' : 'bg-slate-200 text-slate-700')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Optional Plan & Usage Widget */}
        {effectivePlanWidget && (
          <div className={cn(
            "mx-3 mb-3 p-3.5 rounded-2xl border space-y-2 backdrop-blur-md",
            isBlue ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
          )}>
            <div className="flex items-center justify-between gap-2">
              <span className="bg-white text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] shadow-2xs">
                {effectivePlanWidget.badge}
              </span>
              <span className={cn("text-[10px] font-semibold truncate", isBlue ? "text-slate-300" : "text-slate-600")}>
                {effectivePlanWidget.planName}
              </span>
            </div>
            <p className={cn("text-[10px] leading-tight", isBlue ? "text-slate-400" : "text-slate-500")}>
              {effectivePlanWidget.subtext}
            </p>
            <button
              type="button"
              onClick={effectivePlanWidget.onButtonClick}
              className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm block text-center"
            >
              {effectivePlanWidget.buttonText}
            </button>
            {effectivePlanWidget.publicLink && (
              <Link
                href={effectivePlanWidget.publicLink}
                className={cn(
                  "block text-center text-[10px] underline underline-offset-2 pt-0.5 transition-colors",
                  isBlue ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-brand-navy"
                )}
              >
                {effectivePlanWidget.publicLinkText || 'Explore public page'}
              </Link>
            )}
          </div>
        )}

        {/* Sidebar Footer with Persona & Sign Out */}
        <div className={cn("p-4 border-t space-y-3", isBlue ? "border-slate-800 bg-slate-950/60" : "border-surface-border bg-slate-50/50")}>
          <div className={cn("text-[11px] flex items-center justify-between", isBlue ? "text-slate-400" : "text-ink-secondary")}>
            <span>Role Context:</span>
            <span className={cn("font-bold uppercase", isBlue ? "text-amber-400" : "text-brand-navy")}>{role}</span>
          </div>
          <SignOutButton
            className={cn("w-full justify-center", isBlue && "border-slate-700 text-slate-200 hover:bg-white/5")}
            size="sm"
            variant="outline"
          />
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className={cn(
            "relative w-72 flex flex-col z-10 shadow-floating h-full",
            isBlue ? "bg-[#0B1E36] text-slate-100" : "bg-white text-ink-primary"
          )}>
            <div className={cn("p-4 border-b flex items-center justify-between", isBlue ? "border-slate-800" : "border-surface-border")}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                  isBlue ? "bg-amber-400 text-slate-950" : "bg-brand-navy text-amber-400"
                )}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className={cn("font-bold text-sm truncate block", isBlue ? "text-white" : "text-brand-navy")}>
                    {portalName}
                  </span>
                  {effectiveTag && <span className="text-[10px] font-bold text-amber-400 uppercase block">{effectiveTag}</span>}
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className={cn("p-1 rounded-lg", isBlue ? "text-slate-400 hover:bg-white/10" : "text-ink-secondary hover:bg-slate-100")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {groupTitle && (
              <div className={cn("px-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest", isBlue ? "text-slate-400" : "text-ink-muted")}>
                {groupTitle}
              </div>
            )}

            <nav className="p-3 space-y-1 overflow-y-auto flex-1">
              {navItems.map((item) => {
                const isActive = activeTab ? activeTab === item.id : pathname === item.path;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-between text-xs transition-all ${
                      isActive
                        ? (isBlue ? 'bg-[#0078D4] text-white shadow-md border-l-4 border-amber-400 rounded-r-xl rounded-l-none pl-3 pr-3.5 py-2.5 font-bold' : 'bg-brand-navy text-white shadow-sm rounded-xl px-3.5 py-2.5')
                        : (isBlue ? 'text-slate-300 hover:text-white hover:bg-white/5 rounded-xl px-3.5 py-2.5 font-medium' : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100 rounded-xl px-3.5 py-2.5')
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={isActive ? (isBlue ? 'text-white' : 'text-amber-400') : (isBlue ? 'text-slate-400' : 'text-ink-muted shrink-0')}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? (isBlue ? 'bg-white/20 text-white' : 'bg-amber-400 text-slate-950')
                            : (isBlue ? 'bg-slate-800 text-slate-300 border border-slate-700/60' : 'bg-slate-200 text-slate-700')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {effectivePlanWidget && (
              <div className={cn(
                "mx-3 mb-3 p-3 rounded-xl border space-y-2",
                isBlue ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
              )}>
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-white text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    {effectivePlanWidget.badge}
                  </span>
                  <span className={cn("text-[10px] font-semibold truncate", isBlue ? "text-slate-300" : "text-slate-600")}>
                    {effectivePlanWidget.planName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false);
                    effectivePlanWidget.onButtonClick?.();
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold"
                >
                  {effectivePlanWidget.buttonText}
                </button>
              </div>
            )}

            <div className={cn("p-4 border-t", isBlue ? "border-slate-800 bg-slate-950/60" : "border-surface-border bg-slate-50")}>
              <SignOutButton
                className={cn("w-full justify-center", isBlue && "border-slate-700 text-slate-200 hover:bg-white/5")}
                size="sm"
                variant="outline"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-surface-border px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-ink-secondary hover:bg-slate-100"
              aria-label="Open portal navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-ink-secondary min-w-0">
              <span className="hidden sm:inline font-medium text-ink-secondary truncate">
                {portalName}
              </span>
              <ChevronRight className="w-3.5 h-3.5 hidden sm:inline text-ink-muted shrink-0" />
              <span className="font-bold text-ink-primary truncate">
                {currentNav?.label || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {actionButton}
            <Link
              href="/schools"
              className="hidden sm:flex items-center gap-1 text-xs text-brand-navy font-semibold hover:underline px-2 py-1"
            >
              <span>Explore Schools</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <SignOutButton size="sm" variant="outline" />
          </div>
        </header>

        {/* Content Body without redundant horizontal bar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
