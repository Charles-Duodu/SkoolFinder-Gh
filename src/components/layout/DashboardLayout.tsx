'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, GraduationCap } from 'lucide-react';
import { SignOutButton } from './SignOutButton';

export interface DashboardNavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface DashboardLayoutProps {
  portalName: string;
  portalSubtitle: string;
  navItems?: DashboardNavItem[];
  children: React.ReactNode;
  actionButton?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  portalName,
  portalSubtitle,
  children,
  actionButton,
}) => {
  // Format subtitle to render bullet cleanly
  const formattedSubtitle = portalSubtitle.replace(/&bull;/g, '•');

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-surface-border px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-ink-secondary hover:text-brand-navy text-xs font-semibold shrink-0 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Return to Public Directory"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Directory</span>
          </Link>

          <div className="h-5 w-px bg-surface-border hidden sm:block" />

          {/* Portal Brand Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
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

        {/* Action Controls & Sign Out */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {actionButton}
          <Link
            href="/schools"
            className="hidden md:flex items-center gap-1 text-xs text-brand-navy font-semibold hover:underline px-2 py-1"
          >
            <span>Explore Schools</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <SignOutButton size="sm" variant="outline" />
        </div>
      </header>

      {/* Main Full-Width Workspace with Clickable Horizontal Subnav */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
