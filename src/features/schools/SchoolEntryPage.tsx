'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { 
  School, 
  Users, 
  Briefcase, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  BarChart, 
  Sparkles,
  Award
} from 'lucide-react';

interface SchoolEntryPageProps {
  onStartRegister?: () => void;
  onOpenDashboard?: () => void;
}

export const SchoolEntryPage: React.FC<SchoolEntryPageProps> = ({ onStartRegister, onOpenDashboard }) => {
  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-navy-dark via-brand-navy to-brand-navy-light text-white pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold border border-brand-gold/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>School Owners, Boards & Administrators</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Elevate Your School's Standing in <span className="text-brand-gold">Greater Accra</span>.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Gain verified visibility with prospective parents, receive structured admissions enquiries, recruit licensed Ghanaian educators, and source quality educational supplies via competitive tenders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {onStartRegister ? (
              <Button variant="gold" size="lg" onClick={onStartRegister} className="w-full sm:w-auto">
                Register Your School (Free Demo)
              </Button>
            ) : (
              <Link href="/school-owners/register">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  Register Your School (Free Demo)
                </Button>
              </Link>
            )}

            {onOpenDashboard ? (
              <Button variant="outline" size="lg" onClick={onOpenDashboard} className="w-full sm:w-auto border-slate-600 text-white hover:bg-white/10">
                View Sample School Dashboard
              </Button>
            ) : (
              <Link href="/school-owners/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-600 text-white hover:bg-white/10">
                  View Sample School Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Key Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
            Built for Accra's Private Educational Institutions
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-2">
            Whether an emerging creche in Madina or an established Cambridge academy in East Legon, SkoolFinder equips you with operational superpowers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-ink-primary">Direct Parent Enrollment</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Receive direct inquiries from parents exploring schools in your locality. Manage open days, fee clarity, and diagnostics effortlessly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-ink-primary">Teacher Recruitment Hub</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Publish vacancies directly to verified Ghanaian educators. Screen NTC license holders and track applicant stages.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-ink-primary">Procurement & Tenders</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Create instant RFQs for exercise books, lab equipment, desks, or bus transit, and receive competitive bids from verified Accra suppliers.
            </p>
          </div>

        </div>
      </section>

      {/* Onboarding Overview */}
      <section className="bg-slate-50 py-16 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-bold text-ink-primary">Simple 8-Step Registration Journey</h2>
            <p className="text-xs text-ink-secondary mt-1">
              Complete your institutional profile and supporting documents in under 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center text-xs">
            <div className="bg-white p-4 rounded-xl border">
              <span className="font-bold text-brand-navy block">1. Account Details</span>
              <span className="text-ink-secondary text-[11px]">Contact person info</span>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <span className="font-bold text-brand-navy block">2. School Identity</span>
              <span className="text-ink-secondary text-[11px]">Crest, name, motto</span>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <span className="font-bold text-brand-navy block">3. Location</span>
              <span className="text-ink-secondary text-[11px]">Digital address & zone</span>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <span className="font-bold text-brand-navy block">4. Levels Offered</span>
              <span className="text-ink-secondary text-[11px]">Creche to SHS</span>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <span className="font-bold text-brand-navy block">5. Curricula</span>
              <span className="text-ink-secondary text-[11px]">GES, Cambridge, IB</span>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <span className="font-bold text-brand-navy block">6. Facilities</span>
              <span className="text-ink-secondary text-[11px]">Labs, sports, buses</span>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <span className="font-bold text-brand-navy block">7. Documents</span>
              <span className="text-ink-secondary text-[11px]">GES registration cert</span>
            </div>
            <div className="bg-white p-4 rounded-xl border bg-brand-gold/10 border-brand-gold/40">
              <span className="font-bold text-brand-navy-dark block">8. Review & Submit</span>
              <span className="text-brand-navy text-[11px]">Instant review triage</span>
            </div>
          </div>

          <div className="text-center pt-8">
            <Link href="/school-owners/register">
              <Button variant="gold" size="lg">Start School Application</Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
