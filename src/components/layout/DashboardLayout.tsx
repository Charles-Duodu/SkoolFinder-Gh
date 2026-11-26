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

export interface DashboardNavItem {
  id: string;
  label: string;
  path?: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface DashboardLayoutProps {
  portalName: string;
  portalSubtitle: string;
  navItems?: DashboardNavItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  portalName,
  portalSubtitle,
  navItems = [],
  activeTab,
  onTabChange,
  children,
  actionButton,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { role } = useDemo();

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
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-surface-border shrink-0 sticky top-0 h-screen">
        {/* Brand & Portal Header */}
        <div className="p-5 border-b border-surface-border">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-ink-secondary hover:text-brand-navy text-xs font-semibold mb-3 py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            title="Return to Public Directory"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Directory</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-navy flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
              <GraduationCap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-ink-primary leading-tight truncate">
                {portalName}
              </h2>
              <p className="text-[11px] text-ink-secondary truncate">
                {formattedSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items (Interactive Tab Switchers) */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab ? activeTab === item.id : pathname === item.path;

            if (onTabChange) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={isActive ? 'text-amber-400' : 'text-ink-muted shrink-0'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-200 text-slate-700'
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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={isActive ? 'text-amber-400' : 'text-ink-muted shrink-0'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer with Persona & Sign Out */}
        <div className="p-4 border-t border-surface-border bg-slate-50/50 space-y-3">
          <div className="text-[11px] text-ink-secondary flex items-center justify-between">
            <span>Role Context:</span>
            <span className="font-bold uppercase text-brand-navy">{role}</span>
          </div>
          <SignOutButton className="w-full justify-center" size="sm" variant="outline" />
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 bg-white flex flex-col z-10 shadow-floating h-full">
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-brand-navy flex items-center justify-center text-amber-400 shrink-0">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                </div>
                <span className="font-bold text-sm text-brand-navy truncate">
                  {portalName}
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-ink-secondary hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-3 space-y-1 overflow-y-auto flex-1">
              {navItems.map((item) => {
                const isActive = activeTab ? activeTab === item.id : pathname === item.path;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-navy text-white shadow-sm'
                        : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={isActive ? 'text-amber-400' : 'text-ink-muted shrink-0'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-surface-border bg-slate-50">
              <SignOutButton className="w-full justify-center" size="sm" variant="outline" />
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
