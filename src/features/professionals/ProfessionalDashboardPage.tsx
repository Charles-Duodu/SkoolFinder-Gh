'use client';

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { DashboardLayout, DashboardNavItem } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';
import { JobVacancy } from '../../types';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileCheck2, 
  GraduationCap, 
  BookOpen, 
  Settings, 
  Search, 
  Send, 
  Award, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Calendar,
  Sparkles,
  Home,
  CreditCard,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Zap,
  Check
} from 'lucide-react';

interface ProfessionalDashboardPageProps {
  welcomeNotice?: boolean;
}

export const ProfessionalDashboardPage: React.FC<ProfessionalDashboardPageProps> = ({ welcomeNotice = false }) => {
  const { state, applyForJob } = useDemo();
  const [showWelcome, setShowWelcome] = useState(welcomeNotice);
  const pro = state.professionals.find(p => p.id === 'pro-01') || state.professionals[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'portfolio' | 'services' | 'billing' | 'analytics' | 'settings'>('overview');

  // Applications submitted by this professional
  const myApplications = state.applications.filter(a => a.professionalId === pro.id || a.applicantName === pro.fullName);

  // Job applying modal
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Job Search Filter
  const [jobQuery, setJobQuery] = useState('');

  const filteredJobs = state.vacancies.filter(v => {
    if (!jobQuery.trim()) return true;
    const q = jobQuery.toLowerCase();
    return v.title.toLowerCase().includes(q) || v.schoolName.toLowerCase().includes(q) || v.department.toLowerCase().includes(q);
  });

  const navItems: DashboardNavItem[] = [
    { id: 'overview', label: 'Overview', path: '#', icon: <Home className="w-4 h-4" /> },
    { id: 'jobs', label: 'Career opportunities', path: '#', icon: <Briefcase className="w-4 h-4" />, badge: state.vacancies.length },
    { id: 'applications', label: 'Career management', path: '#', icon: <BookOpen className="w-4 h-4" />, badge: myApplications.length },
    { id: 'services', label: 'Services', path: '#', icon: <Sparkles className="w-4 h-4" />, badge: pro.servicesOffered.length },
    { id: 'portfolio', label: 'Activities & profile', path: '#', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'billing', label: 'Membership & Billing', path: '#', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Insights & analytics', path: '#', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Security & privacy', path: '#', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    applyForJob({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      schoolId: selectedJob.schoolId,
      schoolName: selectedJob.schoolName,
      professionalId: pro.id,
      applicantName: pro.fullName,
      applicantEmail: pro.email,
      applicantPhone: pro.phone,
      qualificationsSummary: `${pro.qualifications[0]?.degree || 'B.Ed.'}, Licensed NTC Teacher (${pro.ntcLicenseNumber}), ${pro.yearsOfExperience} yrs exp`,
      coverNote: coverNote || 'I am excited to submit my credentials for this teaching vacancy.'
    });

    setAppliedSuccess(true);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setAppliedSuccess(false);
    setCoverNote('');
  };

  return (
    <DashboardLayout
      portalName="SkoolFinder"
      portalTag="PROFESSIONALS"
      portalSubtitle={`${pro.fullName} • Senior Physics Facilitator`}
      sidebarVariant="blue"
      groupTitle="YOUR WORKSPACE"
      planWidget={{
        badge: 'Free active',
        planName: 'Career + Services',
        subtext: 'Approved activities, within your plan.',
        buttonText: 'View plan & usage',
        onButtonClick: () => setActiveTab('billing'),
        publicLink: '/professionals',
        publicLinkText: 'Explore public page',
      }}
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
      actionButton={
        <Button variant="gold" size="sm" onClick={() => setActiveTab('jobs')} icon={<Search className="w-3.5 h-3.5 text-brand-navy-dark" />}>
          Find Teaching Jobs
        </Button>
      }
    >
      {/* Newly Registered Celebration Notice */}
      {showWelcome && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-start justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink-primary">
                🎉 Professional Profile Submitted & Workspace Activated!
              </h4>
              <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                Your NTC license and teaching portfolio have been queued for simulated verification. Your educator workspace is active below—you can now browse school vacancies, submit 1-click applications, and configure your tutoring profile.
              </p>
            </div>
          </div>
          <button onClick={() => setShowWelcome(false)} className="text-ink-muted hover:text-ink-primary text-xs font-semibold p-1">
            ✕
          </button>
        </div>
      )}

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Identity Header */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={pro.avatarUrl} alt={pro.fullName} className="w-14 h-14 rounded-2xl object-cover border" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-ink-primary">{pro.fullName}</h1>
                  <StatusBadge status={pro.verificationStatus} />
                </div>
                <p className="text-xs text-ink-secondary mt-0.5">{pro.title}</p>
                <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-1">
                  <span>{pro.locality}, Accra</span>
                  <span>&bull;</span>
                  <span>License: <strong className="text-brand-navy">{pro.ntcLicenseNumber}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('portfolio')}>
                View CV Portfolio
              </Button>
              <Button variant="gold" size="sm" onClick={() => setActiveTab('jobs')}>
                Search Jobs
              </Button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-surface-border">
              <span className="text-xs text-ink-muted font-medium">Submitted Applications</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{myApplications.length}</p>
              <span className="text-[11px] text-brand-navy font-semibold mt-1 block">Active across Accra</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-surface-border">
              <span className="text-xs text-ink-muted font-medium">Open School Vacancies</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{state.vacancies.length}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Matching your profile</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-surface-border">
              <span className="text-xs text-ink-muted font-medium">Active Tutoring Listings</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{pro.servicesOffered.length}</p>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Publicly bookable</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-surface-border">
              <span className="text-xs text-ink-muted font-medium">Teaching Experience</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{pro.yearsOfExperience} Yrs</p>
              <span className="text-[11px] text-ink-secondary mt-1 block">STEM & Physics</span>
            </div>
          </div>

          {/* Recent Applications Tracker */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-primary">My Recent Job Applications</h3>
              <button onClick={() => setActiveTab('applications')} className="text-xs text-brand-navy font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {myApplications.map(app => (
                <div key={app.id} className="p-4 rounded-xl border border-surface-border bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-ink-primary">{app.jobTitle}</h4>
                    <p className="text-[11px] text-ink-secondary">{app.schoolName} &bull; Applied: {formatDate(app.submittedAt)}</p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                    Status: {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: FIND JOBS */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Greater Accra Teaching Vacancies</h2>
              <p className="text-xs text-ink-secondary">Explore open roles in verified private institutions</p>
            </div>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search by title, subject..."
                value={jobQuery}
                onChange={e => setJobQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-surface-border shadow-subtle flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-ink-primary">{job.title}</h3>
                      <p className="text-xs font-semibold text-brand-navy">{job.schoolName}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100">
                      {job.contractType}
                    </span>
                  </div>

                  <p className="text-xs text-ink-secondary line-clamp-3 leading-relaxed">{job.description}</p>
                  
                  <div className="pt-2 text-xs text-ink-muted space-y-1">
                    <p>Level: <strong className="text-ink-primary">{job.educationLevel}</strong></p>
                    <p>Compensation: <strong className="text-brand-navy">{job.salaryRangeGHS}</strong></p>
                    <p>Deadline: <strong className="text-amber-800">{job.deadline}</strong></p>
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <span className="text-[11px] text-ink-muted">Applicants: {job.applicantsCount}</span>
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => setSelectedJob(job)}
                    icon={<Send className="w-3.5 h-3.5 text-brand-navy-dark" />}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-ink-primary">My Application History</h2>
          <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
            <div className="divide-y divide-surface-border">
              {myApplications.map(app => (
                <div key={app.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-ink-primary">{app.jobTitle}</h4>
                    <p className="text-xs text-brand-navy font-semibold">{app.schoolName}</p>
                    <p className="text-xs text-ink-secondary">Submitted: {formatDate(app.submittedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-6 max-w-2xl">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">CV & Licensure Portfolio</h2>
              <p className="text-xs text-ink-secondary">NTC verified teacher profile</p>
            </div>
            <StatusBadge status={pro.verificationStatus} />
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-ink-muted uppercase font-bold block mb-1">National Teaching Council License</span>
              <p className="text-sm font-bold text-brand-navy">{pro.ntcLicenseNumber}</p>
            </div>
            <div>
              <span className="text-ink-muted uppercase font-bold block mb-1">Academic Degrees</span>
              {pro.qualifications.map((q, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border mb-1">
                  <strong>{q.degree}</strong> &bull; {q.institution} ({q.year})
                </div>
              ))}
            </div>
            <div>
              <span className="text-ink-muted uppercase font-bold block mb-1">Subjects & Specialisations</span>
              <div className="flex flex-wrap gap-1.5">
                {pro.subjects.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-ink-muted uppercase font-bold block mb-1">Professional Bio</span>
              <p className="leading-relaxed text-ink-secondary bg-slate-50 p-3 rounded-lg border">{pro.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Private Tutoring & Advisory Services</h2>
              <p className="text-xs text-ink-secondary">Services bookable by parents and partner schools</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pro.servicesOffered.map(srv => (
              <div key={srv.id} className="bg-white p-6 rounded-2xl border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 uppercase">
                    {srv.category}
                  </span>
                  <span className="text-xs font-bold text-brand-navy">{srv.rateGHS}</span>
                </div>
                <h3 className="text-sm font-bold text-ink-primary">{srv.title}</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">{srv.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 border max-w-xl space-y-4">
          <h2 className="text-xl font-bold text-ink-primary">Account Preferences</h2>
          <Input label="Contact Telephone" defaultValue={pro.phone} />
          <Input label="Primary Email" defaultValue={pro.email} />
          <div className="pt-2">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      )}

      {/* VIEW: MEMBERSHIP & BILLING */}
      {activeTab === 'billing' && (
        <div className="space-y-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Membership & Subscription Plan</h2>
              <p className="text-xs text-ink-secondary">Manage your educator account tier, activity allowances, and billing preferences</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
              <Check className="w-3.5 h-3.5" />
              Active Free Tier
            </span>
          </div>

          {/* Current Plan Overview Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0078D4] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/50">
                  CURRENT MEMBERSHIP
                </span>
                <h3 className="text-2xl font-black text-brand-navy mt-2">Career + Services (Free Launch Plan)</h3>
                <p className="text-xs text-ink-secondary mt-1">
                  Enjoy verified educator discovery, school vacancy applications, and public tutoring listings with zero monthly fees.
                </p>
              </div>
              <div className="text-right sm:shrink-0">
                <span className="text-3xl font-black text-brand-navy">GHS 0</span>
                <span className="text-xs text-ink-secondary block">per month</span>
              </div>
            </div>

            {/* Plan Allowances & Usage Meters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink-primary">Direct Applications</span>
                  <span className="font-bold text-[#0078D4]">{myApplications.length} / 10</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0078D4] h-full rounded-full" style={{ width: `${Math.min(100, (myApplications.length / 10) * 100)}%` }} />
                </div>
                <p className="text-[10px] text-ink-muted">Monthly allowance resets in 12 days</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink-primary">Tutoring Listings</span>
                  <span className="font-bold text-amber-600">{pro.servicesOffered.length} / 5</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, (pro.servicesOffered.length / 5) * 100)}%` }} />
                </div>
                <p className="text-[10px] text-ink-muted">Publicly visible across Greater Accra</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink-primary">Verification Status</span>
                  <span className="font-bold text-emerald-600">NTC Verified</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-full" />
                </div>
                <p className="text-[10px] text-ink-muted">License: {pro.ntcLicenseNumber}</p>
              </div>
            </div>

            {/* Pro Upgrade Teaser */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0B1E36] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold">Upgrade to Educator Pro</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">RECOMMENDED</span>
                </div>
                <p className="text-xs text-slate-300">
                  Get featured placement in school headhunter searches, unlimited applications, and SMS job alerts.
                </p>
              </div>
              <Button variant="gold" size="sm" className="shrink-0 shadow-md">
                Upgrade for GHS 45/mo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: INSIGHTS & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 max-w-5xl">
          <div>
            <h2 className="text-xl font-bold text-ink-primary">Insights & Professional Analytics</h2>
            <p className="text-xs text-ink-secondary">Real-time statistics on your profile visibility, recruiter searches, and tutoring leads</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-glass">
              <span className="text-xs text-ink-muted font-medium flex items-center justify-between">
                <span>Profile Views</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <p className="text-2xl font-black text-ink-primary mt-1">384</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+24% this week</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-glass">
              <span className="text-xs text-ink-muted font-medium">Search Appearances</span>
              <p className="text-2xl font-black text-ink-primary mt-1">92</p>
              <span className="text-[11px] text-brand-navy font-semibold mt-1 block">Accra Private Schools</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-glass">
              <span className="text-xs text-ink-muted font-medium">Application Acceptance</span>
              <p className="text-2xl font-black text-ink-primary mt-1">100%</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Review underway</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-glass">
              <span className="text-xs text-ink-muted font-medium">Parent Inquiries</span>
              <p className="text-2xl font-black text-ink-primary mt-1">6</p>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">East Legon & Achimota</span>
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="glass-panel rounded-3xl p-6 border border-white/80 shadow-glass space-y-4">
            <h3 className="text-sm font-bold text-ink-primary">Recruiter Engagement Trends</h3>
            <p className="text-xs text-ink-secondary">
              Headmasters and department heads from East Legon Cambridge Academy and Achimota Preparatory reviewed your Physics and STEM qualifications over the past 7 days.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/70 border text-xs space-y-1">
                <span className="text-[10px] text-ink-muted uppercase font-bold">Top Matched Category</span>
                <p className="font-bold text-ink-primary">Senior High STEM / Physics</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/70 border text-xs space-y-1">
                <span className="text-[10px] text-ink-muted uppercase font-bold">Popular Location</span>
                <p className="font-bold text-ink-primary">East Legon & Spintex</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/70 border text-xs space-y-1">
                <span className="text-[10px] text-ink-muted uppercase font-bold">Curriculum Demand</span>
                <p className="font-bold text-ink-primary">Cambridge IGCSE + GES</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: APPLY TO JOB */}
      <Modal isOpen={Boolean(selectedJob)} onClose={handleCloseModal} title={appliedSuccess ? 'Application Sent' : `Apply: ${selectedJob?.title}`} maxWidth="md">
        {appliedSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink-primary">Application Submitted Successfully!</h3>
              <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                Your application has been stored. Switch to the <strong>School Proprietor</strong> persona anytime to review your candidate profile in their recruitment dashboard!
              </p>
            </div>
            <div className="pt-2">
              <Button variant="primary" onClick={handleCloseModal} className="w-full justify-center">Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1">
              <p><strong>School:</strong> {selectedJob?.schoolName}</p>
              <p><strong>Compensation:</strong> {selectedJob?.salaryRangeGHS}</p>
              <p><strong>Applying As:</strong> {pro.fullName} ({pro.ntcLicenseNumber})</p>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase">Cover Note to Principal</label>
              <textarea
                rows={4}
                required
                value={coverNote}
                onChange={e => setCoverNote(e.target.value)}
                placeholder="Explain why you are the ideal candidate for this role..."
                className="w-full border rounded-lg p-3 text-sm focus:border-brand-navy outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="gold">Submit Application</Button>
            </div>
          </form>
        )}
      </Modal>

    </DashboardLayout>
  );
};
