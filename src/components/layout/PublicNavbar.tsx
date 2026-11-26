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
  Sparkles
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
            <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-brand-gold shadow-sm group-hover:scale-105 transition-transform">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-brand-navy">
                  Skool<span className="text-brand-gold">Finder</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Ghana
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary -mt-0.5 tracking-tight hidden sm:block">
                Greater Accra Private Education Ecosystem
              </p>
            </div>
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
            <Link href="/school-owners?tab=register">
              <Button variant="gold" size="sm" icon={<Sparkles className="w-4 h-4 text-brand-navy-dark" />}>
                Register School
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
            <Link href="/school-owners/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gold" className="w-full justify-center">
                Register Your School
              </Button>
            </Link>
            <Link href="/super-admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-center text-xs text-ink-muted">
                Super Admin Governance
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
