'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { ProfessionalMode } from '../../types';
import {
  Briefcase,
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  UserCheck
} from 'lucide-react';

interface ProfessionalEntryPageProps {
  onStartRegister?: () => void;
  onOpenDashboard?: () => void;
}

export const ProfessionalEntryPage: React.FC<ProfessionalEntryPageProps> = ({ onStartRegister, onOpenDashboard }) => {
  const [selectedMode, setSelectedMode] = useState<ProfessionalMode>('both');

  const modes: { mode: ProfessionalMode; title: string; desc: string; badge: string }[] = [
    {
      mode: 'career',
      title: 'Career Mode (Full-time / Employment)',
      desc: 'Looking for full-time or permanent teaching, leadership, and administrative roles in reputable private schools.',
      badge: 'Job Seeker'
    },
    {
      mode: 'services',
      title: 'Services Mode (Tutoring & Consulting)',
      desc: 'Offer private 1-on-1 tutoring, STEM workshops, reading intervention, or educational advisory services directly to families and schools.',
      badge: 'Independent Specialist'
    },
    {
      mode: 'both',
      title: 'Both Mode (Career & Services)',
      desc: 'Access both school employment vacancies and private tutoring / consultancy client requests simultaneously.',
      badge: 'Most Popular'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-navy-dark via-brand-navy to-brand-navy-light text-white pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>For Ghanaian Teachers & Education Specialists</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Advance Your Career in <span className="text-brand-gold">Private Education</span>.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect with top private basic and high schools across Greater Accra, showcase your NTC qualifications, and offer specialized academic tutoring.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {onStartRegister ? (
              <Button variant="gold" size="lg" onClick={onStartRegister} className="w-full sm:w-auto">
                Create Professional Profile
              </Button>
            ) : (
              <Link href="/professionals/register">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  Create Professional Profile
                </Button>
              </Link>
            )}

            {onOpenDashboard ? (
              <Button variant="outline" size="lg" onClick={onOpenDashboard} className="w-full sm:w-auto border-slate-600 text-white hover:bg-white/10">
                View Sample Dashboard
              </Button>
            ) : (
              <Link href="/professionals/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-600 text-white hover:bg-white/10">
                  View Sample Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Mode Selection Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
            Choose Your Professional Activity Mode
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Tailor your portal experience according to your current career objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modes.map((m) => {
            const isSelected = selectedMode === m.mode;
            return (
              <div
                key={m.mode}
                onClick={() => setSelectedMode(m.mode)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                    ? 'border-brand-navy bg-white ring-2 ring-brand-navy shadow-elevated'
                    : 'border-surface-border bg-white hover:border-slate-300 shadow-subtle'
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {m.badge}
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-navy" />}
                  </div>
                  <h3 className="text-base font-bold text-ink-primary">{m.title}</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">{m.desc}</p>
                </div>

                <div className="pt-6">
                  <Link href={`/professionals/register?mode=${m.mode}`}>
                    <Button variant={isSelected ? 'primary' : 'outline'} size="sm" className="w-full justify-center">
                      Select & Continue
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & NTC Verification Callout */}
      <section className="bg-slate-50 py-16 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border space-y-2 text-center">
              <Award className="w-8 h-8 text-brand-gold mx-auto" />
              <h3 className="text-sm font-bold text-ink-primary">NTC License Verification</h3>
              <p className="text-xs text-ink-secondary">
                Stand out with certified credentials from the National Teaching Council.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border space-y-2 text-center">
              <Briefcase className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="text-sm font-bold text-ink-primary">Verified Accra Vacancies</h3>
              <p className="text-xs text-ink-secondary">
                Apply directly to Cambridge, IB, and GES private schools without middlemen.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border space-y-2 text-center">
              <UserCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-ink-primary">Direct Tutoring Bookings</h3>
              <p className="text-xs text-ink-secondary">
                Receive inquiries from parents seeking specialized home & online tutors.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
