'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  CheckSquare, 
  School, 
  Users, 
  Briefcase, 
  Truck, 
  FileCheck2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  BarChart3, 
  Sliders, 
  Bell, 
  Search, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';

interface AdminNavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeColor?: string;
  count?: number;
}

interface AdminNavSection {
  group: string;
  items: AdminNavItem[];
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { state } = useDemo();

  // Pending counts
  const pendingSchools = state.schools.filter(s => s.verificationStatus === 'under_review' || s.verificationStatus === 'submitted').length;
  const pendingPros = state.professionals.filter(p => p.verificationStatus === 'under_review').length;
  const pendingSups = state.suppliers.filter(s => s.verificationStatus === 'under_review').length;
  const totalPending = pendingSchools + pendingPros + pendingSups;

  const openCases = state.cases.filter(c => c.status !== 'Resolved').length;

  const navSections: AdminNavSection[] = [
    {
      group: 'Governance & Operations',
      items: [
        { label: 'Executive Dashboard', path: '/super-admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { 
          label: 'Applications Centre', 
          path: '/super-admin/approvals', 
          icon: <CheckSquare className="w-4 h-4" />, 
          badge: totalPending > 0 ? totalPending : undefined,
          badgeColor: 'bg-amber-500 text-white'
        },
        { label: 'Safeguarding & Trust', path: '/super-admin/safeguarding', icon: <ShieldCheck className="w-4 h-4" />, badge: openCases > 0 ? openCases : undefined, badgeColor: 'bg-rose-500 text-white' },
        { label: 'Complaints & Cases', path: '/super-admin/cases', icon: <HelpCircle className="w-4 h-4" /> },
      ]
    },
    {
      group: 'Ecosystem Directories',
      items: [
        { label: 'Schools Management', path: '/super-admin/schools', icon: <School className="w-4 h-4" />, count: state.schools.length },
        { label: 'Parents & Users', path: '/super-admin/parents', icon: <Users className="w-4 h-4" /> },
        { label: 'Professionals Directory', path: '/super-admin/professionals', icon: <Briefcase className="w-4 h-4" />, count: state.professionals.length },
        { label: 'Suppliers & Vendors', path: '/super-admin/suppliers', icon: <Truck className="w-4 h-4" />, count: state.suppliers.length },
        { label: 'Recruitment Oversight', path: '/super-admin/recruitment', icon: <FileCheck2 className="w-4 h-4" /> },
        { label: 'Procurement & Tenders', path: '/super-admin/procurement', icon: <Layers className="w-4 h-4" /> },
      ]
    },
    {
      group: 'Intelligence & Platform',
      items: [
        { label: 'Analytics & Insights', path: '/super-admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { label: 'Platform CMS & Content', path: '/super-admin/cms', icon: <Sliders className="w-4 h-4" /> },
        { label: 'Identity & Admin Roles', path: '/super-admin/roles', icon: <Users className="w-4 h-4" /> },
        { label: 'System Settings', path: '/super-admin/settings', icon: <Sliders className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 flex-col bg-slate-950 border-r border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xs font-black tracking-wider text-white uppercase">Super Admin</h1>
                <p className="text-[10px] text-slate-400">SkoolFinder Ghana Governance</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-3 space-y-5 overflow-y-auto">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {sec.group}
                </div>
                {sec.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-rose-600/90 text-white font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && !item.badge && (
                        <span className="text-[10px] text-slate-500">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Gov Console Active
            </span>
            <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]">
              <span>Public View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-surface-bg text-ink-primary">
          <header className="bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 lg:hidden">
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileOpen(true)} className="p-1 rounded text-slate-300">
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-bold text-xs uppercase tracking-wider text-rose-400">Super Admin Portal</span>
            </div>
            <Link href="/" className="text-xs text-slate-400 hover:text-white">
              Exit
            </Link>
          </header>

          {/* Mobile Sheet */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
              <div className="relative w-72 bg-slate-950 text-white flex flex-col z-10 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-xs uppercase tracking-wider">Navigation</span>
                  <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4 overflow-y-auto">
                  {navSections.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-[10px] font-bold uppercase text-slate-500">{sec.group}</div>
                      {sec.items.map(i => (
                        <Link
                          key={i.path}
                          href={i.path}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between py-2 px-2 text-xs text-slate-300 hover:bg-slate-900 rounded"
                        >
                          <div className="flex items-center gap-2">
                            {i.icon}
                            <span>{i.label}</span>
                          </div>
                          {i.badge && <span className="text-[10px] px-1.5 rounded bg-rose-500 text-white">{i.badge}</span>}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Admin Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
};
