'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { 
  Search, 
  Menu, 
  X, 
  Layers, 
  School, 
  Briefcase, 
  Truck, 
  Scale, 
  ChevronRight,
  Sparkles,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AuthButton } from './AuthButton';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { state } = useDemo();

  const comparisonCount = state.parent.comparisonSchoolIds.length;

  const navLinks = [
    { label: 'Find Schools', path: '/schools', icon: <Search className="w-4 h-4" /> },
    { label: 'Compare Schools', path: '/compare', badge: comparisonCount > 0 ? comparisonCount : undefined, icon: <Scale className="w-4 h-4" /> },
    { label: 'For School Owners', path: '/school-owners', icon: <School className="w-4 h-4" /> },
    { label: 'Teachers & Pros', path: '/professionals', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Suppliers & Vendors', path: '/suppliers', icon: <Truck className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white border-b border-surface-border sticky top-0 z-40 shadow-subtle w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-brand-navy flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform border border-brand-navy-light/40">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-2xl font-black tracking-tight text-brand-navy">
              SkoolFinder
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-navy font-semibold bg-brand-navy/5'
                      : 'text-ink-secondary hover:text-brand-navy hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-brand-gold text-brand-navy-dark">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <AuthButton />
            <Link href="/parents">
              <Button variant="outline" size="sm">
                Parent Portal
              </Button>
            </Link>
            <Link href="/super-admin/dashboard">
              <Button variant="gold" size="sm" icon={<ShieldCheck className="w-4 h-4 text-brand-navy-dark" />}>
                Super Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link href="/compare" className="relative p-2 text-ink-secondary hover:text-brand-navy">
              <Scale className="w-5 h-5" />
              {comparisonCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-gold text-brand-navy text-[10px] font-bold flex items-center justify-center">
                  {comparisonCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink-secondary hover:text-brand-navy hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-border bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-ink-primary hover:bg-slate-50"
            >
              <div className="flex items-center gap-2.5">
                {link.icon}
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-gold text-brand-navy">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-surface-border flex flex-col gap-2">
            <Link href="/parents/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Parent Workspace
              </Button>
            </Link>
            <Link href="/super-admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gold" className="w-full justify-center" icon={<ShieldCheck className="w-4 h-4 text-brand-navy-dark" />}>
                Super Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
