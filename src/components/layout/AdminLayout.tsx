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
  Menu, 
  X,
  ExternalLink,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { SignOutButton } from './SignOutButton';

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
        <aside className="hidden lg:flex lg:w-64 flex-col bg-[#0B1E36] border-r border-slate-800 text-slate-100 shrink-0 sticky top-0 h-screen select-none">
          {/* Brand & Portal Header */}
          <div className="p-5 border-b border-slate-800">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold mb-3 py-1 px-1.5 rounded-lg hover:bg-white/5 transition-colors"
              title="Return to Public Directory"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Directory</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-slate-950" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white font-serif leading-tight truncate">
                  SkoolFinder
                </h2>
                <p className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase leading-none mt-0.5">
                  SUPER ADMIN
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  Ghana Education Governance
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-3 space-y-5 overflow-y-auto">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {sec.group}
                </div>
                {sec.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center justify-between text-xs transition-all ${
                        isActive
                          ? 'bg-[#0078D4] text-white shadow-md border-l-4 border-amber-400 rounded-r-xl rounded-l-none pl-3 pr-3.5 py-2.5 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5 rounded-xl px-3.5 py-2.5 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={isActive ? 'text-white' : 'text-slate-400 shrink-0'}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && !item.badge && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Super Admin Console Plan & Usage Widget */}
          <div className="mx-3 mb-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2">
              <span className="bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px] shadow-2xs">
                Console Active
              </span>
              <span className="text-slate-300 text-[10px] font-semibold truncate">
                Super Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Institutional compliance, directories & ecosystem oversight.
            </p>
            <Link
              href="/super-admin/approvals"
              className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm block text-center"
            >
              Applications Centre
            </Link>
            <Link
              href="/"
              className="block text-center text-[10px] text-slate-400 hover:text-white underline underline-offset-2 pt-0.5"
            >
              Public Directory
            </Link>
          </div>

          {/* Desktop Sidebar Footer with Sign Out */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/70 space-y-2">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Console Context:</span>
              <span className="font-bold uppercase text-amber-400">Gov Active</span>
            </div>
            <SignOutButton
              className="w-full justify-center border-slate-700 text-slate-200 hover:bg-white/5"
              size="sm"
              variant="outline"
            />
          </div>
        </aside>

        {/* Workspace Layout Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-surface-bg text-ink-primary">
          
          {/* Desktop Top Header Bar with Sign Out */}
          <header className="bg-white border-b border-surface-border px-6 py-3.5 hidden lg:flex items-center justify-between sticky top-0 z-20 shadow-subtle">
            <div className="flex items-center gap-2 text-xs text-ink-secondary">
              <span className="font-semibold text-[#0078D4] uppercase tracking-wider">Super Admin Console</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">Governance & Ecosystem Management</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-1 text-xs text-ink-secondary hover:text-ink-primary mr-1">
                <span>Public Directory</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <SignOutButton
                size="sm"
                variant="outline"
                className="border-sky-200 text-[#0078D4] hover:bg-sky-50 hover:border-sky-300"
              />
            </div>
          </header>

          {/* Mobile Header Bar */}
          <header className="bg-[#0B1E36] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 lg:hidden">
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileOpen(true)} className="p-1 rounded text-slate-300">
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-bold text-xs uppercase tracking-wider text-amber-400">Super Admin Portal</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs text-slate-400 hover:text-white mr-1">
                Exit
              </Link>
              <SignOutButton size="sm" variant="ghost" className="text-slate-300 hover:text-white" />
            </div>
          </header>

          {/* Mobile Sheet */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
              <div className="relative w-72 bg-[#0B1E36] text-white flex flex-col z-10 p-4 space-y-4 shadow-floating h-full">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider text-white">Super Admin</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="space-y-4 overflow-y-auto flex-1">
                  {navSections.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-[10px] font-bold uppercase text-slate-400">{sec.group}</div>
                      {sec.items.map(i => (
                        <Link
                          key={i.path}
                          href={i.path}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between py-2 px-2 text-xs text-slate-300 hover:bg-white/5 rounded-xl"
                        >
                          <div className="flex items-center gap-2">
                            {i.icon}
                            <span>{i.label}</span>
                          </div>
                          {i.badge && <span className="text-[10px] px-1.5 rounded bg-[#0078D4] text-white">{i.badge}</span>}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <SignOutButton className="w-full justify-center bg-[#0078D4] hover:bg-blue-600 text-white" size="sm" />
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
