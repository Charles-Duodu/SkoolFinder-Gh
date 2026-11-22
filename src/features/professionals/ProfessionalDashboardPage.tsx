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
  Sparkles
} from 'lucide-react';

interface ProfessionalDashboardPageProps {
  welcomeNotice?: boolean;
}

export const ProfessionalDashboardPage: React.FC<ProfessionalDashboardPageProps> = ({ welcomeNotice = false }) => {
  const { state, applyForJob } = useDemo();
  const [showWelcome, setShowWelcome] = useState(welcomeNotice);
  const pro = state.professionals.find(p => p.id === 'pro-01') || state.professionals[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'portfolio' | 'services' | 'settings'>('overview');

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
    { id: 'overview', label: 'Career Overview', path: '#', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'jobs', label: 'Explore Vacancies', path: '#', icon: <Search className="w-4 h-4" />, badge: state.vacancies.length },
    { id: 'applications', label: 'My Applications', path: '#', icon: <FileCheck2 className="w-4 h-4" />, badge: myApplications.length },
    { id: 'portfolio', label: 'CV & NTC Credentials', path: '#', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'services', label: 'Tutoring Services', path: '#', icon: <BookOpen className="w-4 h-4" />, badge: pro.servicesOffered.length },
    { id: 'settings', label: 'Account Settings', path: '#', icon: <Settings className="w-4 h-4" /> },
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
      portalName="Educators & Specialists Portal"
      portalSubtitle={`${pro.fullName} &bull; ${pro.title}`}
      navItems={navItems}
      actionButton={
        <Button variant="gold" size="sm" onClick={() => setActiveTab('jobs')} icon={<Search className="w-3.5 h-3.5 text-brand-navy-dark" />}>
          Find Teaching Jobs
        </Button>
      }
    >
      {/* Subnav */}
      <div className="flex border-b border-surface-border mb-6 overflow-x-auto no-scrollbar gap-1 bg-white p-1 rounded-xl shadow-subtle">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === item.id ? 'bg-brand-gold text-brand-navy-dark' : 'bg-slate-200 text-slate-700'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

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
