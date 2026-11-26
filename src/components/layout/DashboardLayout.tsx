'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import {
  ChevronRight,
  Menu,
  X,
  Bell,
  ArrowLeft,
  School,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';
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
  navItems: DashboardNavItem[];
  children: React.ReactNode;
  actionButton?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  portalName,
  portalSubtitle,
  navItems,
  children,
  actionButton
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { role } = useDemo();

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <div className="flex-1 flex overflow-hidden">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-surface-border">
          {/* Portal Brand Block */}
          <div className="p-5 border-b border-surface-border">
            <Link href="/" className="flex items-center gap-2 text-ink-secondary hover:text-brand-navy text-xs font-semibold mb-3">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Directory</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center text-brand-gold">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-ink-primary leading-tight">{portalName}</h2>
                <p className="text-[11px] text-ink-secondary">{portalSubtitle}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-brand-gold' : 'text-ink-muted'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-brand-gold text-brand-navy-dark' : 'bg-slate-200 text-slate-700'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer with Sign Out */}
          <div className="p-4 border-t border-surface-border bg-slate-50/50 space-y-3">
            <div className="text-[11px] text-ink-secondary flex items-center justify-between">
              <span>Persona Mode:</span>
              <span className="font-bold uppercase text-brand-navy">{role}</span>
            </div>
            <SignOutButton className="w-full justify-center" size="sm" variant="outline" />
          </div>
        </aside>

        {/* Mobile Sidebar Sheet */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 bg-white flex flex-col z-10 shadow-floating">
              <div className="p-4 border-b border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-brand-navy flex items-center justify-center text-brand-gold">
                    <School className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-brand-navy">{portalName}</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded text-ink-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-3 space-y-1 overflow-y-auto flex-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${isActive ? 'bg-brand-navy text-white' : 'text-ink-secondary hover:bg-slate-100'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-brand-gold' : 'text-ink-muted'}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-surface-border bg-slate-50">
                <SignOutButton className="w-full justify-center" size="sm" variant="outline" />
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar with Sign Out Button */}
          <header className="bg-white border-b border-surface-border px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-ink-secondary hover:bg-slate-100"
                aria-label="Open portal navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs text-ink-secondary">
                <span>{portalName}</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-semibold text-ink-primary">
                  {navItems.find(i => i.path === pathname)?.label || 'Overview'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {actionButton}
              <Link href="/schools" className="hidden sm:flex items-center gap-1 text-xs text-brand-navy font-semibold hover:underline">
                <span>Explore Schools</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <SignOutButton size="sm" variant="outline" />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
};
