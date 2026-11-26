'use client';

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { DashboardLayout, DashboardNavItem } from '../../components/layout/DashboardLayout';
import { formatGHS, formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { JobVacancy, RFQTender, SupplierCategory, EducationLevel } from '../../types';
import { 
  LayoutDashboard, 
  School, 
  BookOpen, 
  Users, 
  Briefcase, 
  Truck, 
  BarChart3, 
  Settings, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  Eye, 
  Clock, 
  Send,
  FileText,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SchoolDashboardPageProps {
  welcomeNotice?: boolean;
}

export const SchoolDashboardPage: React.FC<SchoolDashboardPageProps> = ({ welcomeNotice = false }) => {
  const { state, postVacancy, createRFQ, respondToEnquiry, updateApplicationStatus, updateBidStatus, updateAdmissionStatus } = useDemo();
  const [showWelcome, setShowWelcome] = useState(welcomeNotice);
  
  // Use Achimota Preparatory (sch-01) as the active demonstration school
  const currentSchool = state.schools.find(s => s.id === 'sch-01') || state.schools[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'academics' | 'admissions' | 'recruitment' | 'procurement' | 'reports' | 'settings'>('overview');
  const [admissionsSubTab, setAdmissionsSubTab] = useState<'applications' | 'enquiries'>('applications');

  // Filter school-specific data
  const schoolEnquiries = state.enquiries.filter(e => e.schoolId === currentSchool.id);
  const schoolAdmissions = (state.admissionApplications || []).filter(a => a.schoolId === currentSchool.id);
  const schoolVacancies = state.vacancies.filter(v => v.schoolId === currentSchool.id);
  const schoolApplications = state.applications.filter(a => a.schoolId === currentSchool.id);
  const schoolRFQs = state.rfqs.filter(r => r.schoolId === currentSchool.id);
  const schoolBids = state.bids.filter(b => b.schoolId === currentSchool.id);

  // Modals state
  const [newVacancyModal, setNewVacancyModal] = useState(false);
  const [newRFQModal, setNewRFQModal] = useState(false);
  const [replyEnquiryModal, setReplyEnquiryModal] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [selectedBid, setSelectedBid] = useState<string | null>(null);

  // New Vacancy Form
  const [vacTitle, setVacTitle] = useState('');
  const [vacDept, setVacDept] = useState('STEM Department');
  const [vacLevel, setVacLevel] = useState<EducationLevel>('Junior High School');
  const [vacSalary, setVacSalary] = useState('GHS 5,000 - GHS 7,500 / month');
  const [vacDesc, setVacDesc] = useState('');
  const [vacReq, setVacReq] = useState('Bachelor of Education, Valid NTC License, 3+ years experience');
  const [vacDeadline, setVacDeadline] = useState('2026-08-15');

  // New RFQ Form
  const [rfqTitle, setRfqTitle] = useState('');
  const [rfqCategory, setRfqCategory] = useState<SupplierCategory>('Stationery & Books');
  const [rfqDesc, setRfqDesc] = useState('');
  const [rfqItemName, setRfqItemName] = useState('Science Laboratory Consumables');
  const [rfqItemQty, setRfqItemQty] = useState(500);
  const [rfqDeadline, setRfqDeadline] = useState('2026-08-30');

  const navItems: DashboardNavItem[] = [
    { id: 'overview', label: 'Executive Overview', path: '#', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'profile', label: 'School Profile', path: '#', icon: <School className="w-4 h-4" /> },
    { id: 'admissions', label: 'Admissions & Inquiries', path: '#', icon: <GraduationCap className="w-4 h-4" />, badge: schoolEnquiries.length + schoolAdmissions.length },
    { id: 'recruitment', label: 'Staff Recruitment', path: '#', icon: <Briefcase className="w-4 h-4" />, badge: schoolVacancies.length },
    { id: 'procurement', label: 'Suppliers & RFQs', path: '#', icon: <Truck className="w-4 h-4" />, badge: schoolRFQs.length },
    { id: 'reports', label: 'Analytics & Trends', path: '#', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Campus Settings', path: '#', icon: <Settings className="w-4 h-4" /> },
  ];

  // Chart data
  const analyticsData = [
    { month: 'Jan', impressions: 1200, enquiries: 14 },
    { month: 'Feb', impressions: 1900, enquiries: 22 },
    { month: 'Mar', impressions: 2400, enquiries: 35 },
    { month: 'Apr', impressions: 3100, enquiries: 48 },
    { month: 'May', impressions: 4200, enquiries: 62 },
  ];

  const handleCreateVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    postVacancy({
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      schoolLocality: currentSchool.locality,
      title: vacTitle || 'Primary & JHS Creative Arts Teacher',
      department: vacDept,
      educationLevel: vacLevel,
      contractType: 'Full-time',
      salaryRangeGHS: vacSalary,
      description: vacDesc || 'Seeking a passionate educator to lead visual arts and Ghanaian cultural performance curriculum.',
      requirements: vacReq.split(',').map(s => s.trim()),
      deadline: vacDeadline
    });
    setNewVacancyModal(false);
    setVacTitle('');
  };

  const handleCreateRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    createRFQ({
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      schoolLocality: currentSchool.locality,
      title: rfqTitle || 'Procurement of Student Class Desks',
      category: rfqCategory,
      description: rfqDesc || 'Achimota Preparatory invites quotations for the supply of durable student classroom furniture.',
      items: [{ name: rfqItemName, quantity: Number(rfqItemQty), unit: 'units' }],
      deadline: rfqDeadline,
      deliveryLocality: `${currentSchool.locality} Campus`
    });
    setNewRFQModal(false);
    setRfqTitle('');
  };

  const handleSendReply = (enquiryId: string) => {
    if (!replyText.trim()) return;
    respondToEnquiry(enquiryId, replyText);
    setReplyEnquiryModal(null);
    setReplyText('');
  };

  return (
    <DashboardLayout
      portalName={currentSchool.name}
      portalSubtitle={`Verified Institution &bull; ${currentSchool.locality}, Accra`}
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
      actionButton={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setNewVacancyModal(true)} icon={<Plus className="w-3.5 h-3.5" />}>
            Post Vacancy
          </Button>
          <Button variant="gold" size="sm" onClick={() => setNewRFQModal(true)} icon={<Plus className="w-3.5 h-3.5 text-brand-navy-dark" />}>
            New RFQ Tender
          </Button>
        </div>
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
                🎉 Institutional Application Submitted & Account Activated!
              </h4>
              <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                Your school application has been queued for Super Admin compliance verification. As a School Administrator in demonstration mode, your dashboard is fully unlocked below to post vacancies, issue RFQs, and respond to admissions queries.
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
          
          {/* Status & Completeness Card */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={currentSchool.crestUrl} alt="crest" className="w-14 h-14 rounded-xl object-cover bg-white border p-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-ink-primary">{currentSchool.name}</h1>
                  <StatusBadge status={currentSchool.verificationStatus} />
                </div>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Digital Address: {currentSchool.digitalAddress} &bull; Campus Zone: {currentSchool.locality}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs text-ink-muted">Profile Completeness</span>
                <p className="text-base font-bold text-emerald-600">95% Complete</p>
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
              <span className="text-xs text-ink-muted font-medium">Monthly Page Views</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">4,280</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                &uarr; 32% from last month
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
              <span className="text-xs text-ink-muted font-medium">Parent Enquiries</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{schoolEnquiries.length}</p>
              <span className="text-[11px] text-ink-secondary mt-1 block">Active admission leads</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
              <span className="text-xs text-ink-muted font-medium">Active Vacancies</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{schoolVacancies.length}</p>
              <span className="text-[11px] text-brand-navy font-semibold mt-1 block">
                {schoolApplications.length} candidates applied
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
              <span className="text-xs text-ink-muted font-medium">Tenders & RFQs</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{schoolRFQs.length}</p>
              <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
                {schoolBids.length} quotations received
              </span>
            </div>
          </div>

          {/* Chart preview */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink-primary">Profile Discovery & Parent Traffic (2026)</h3>
                <p className="text-xs text-ink-secondary">Greater Accra parent search impressions on SkoolFinder</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#102A43" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#102A43" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="impressions" stroke="#102A43" fillOpacity={1} fill="url(#colorImpressions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Inquiries Preview */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-primary">Incoming Parent Enquiries</h3>
              <button onClick={() => setActiveTab('admissions')} className="text-xs text-brand-navy font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {schoolEnquiries.map(enq => (
                <div key={enq.id} className="p-4 rounded-xl border border-surface-border bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-ink-primary">{enq.parentName}</strong>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        enq.status === 'Responded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary mt-1">{enq.subject}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { setReplyEnquiryModal(enq.id); setReplyText(enq.responseNotes || ''); }}>
                    {enq.status === 'Responded' ? 'Edit Response' : 'Reply to Parent'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW: RECRUITMENT */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Staff Recruitment Management</h2>
              <p className="text-xs text-ink-secondary">Publish vacancies to verified Ghanaian educators and review applicants</p>
            </div>
            <Button variant="gold" size="sm" onClick={() => setNewVacancyModal(true)} icon={<Plus className="w-3.5 h-3.5 text-brand-navy-dark" />}>
              Post New Vacancy
            </Button>
          </div>

          {/* Active Vacancies */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-ink-primary">Active Published Vacancies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schoolVacancies.map(v => (
                <div key={v.id} className="bg-white p-5 rounded-2xl border border-surface-border space-y-3 shadow-subtle">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-ink-primary">{v.title}</h4>
                      <p className="text-xs text-ink-secondary">{v.department} &bull; {v.educationLevel}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {v.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary line-clamp-2">{v.description}</p>
                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-brand-navy font-bold">{v.salaryRangeGHS}</span>
                    <span className="text-ink-secondary font-semibold">Applicants: <strong>{v.applicantsCount}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applicants Pool */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
            <h3 className="text-sm font-bold text-ink-primary">Received Job Applications</h3>
            {schoolApplications.length === 0 ? (
              <p className="text-xs text-ink-secondary">No candidates have applied to your active vacancies yet.</p>
            ) : (
              <div className="divide-y divide-surface-border">
                {schoolApplications.map(app => (
                  <div key={app.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-ink-primary">{app.applicantName}</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Stage: {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-ink-secondary">Applied for: <span className="font-semibold text-ink-primary">{app.jobTitle}</span> &bull; {formatDate(app.submittedAt)}</p>
                      <p className="text-xs text-ink-secondary italic bg-slate-50 p-2.5 rounded-lg border max-w-xl">
                        "{app.coverNote}"
                      </p>
                    </div>

                    {/* Stage status mutators */}
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                        className="text-xs py-1.5 px-2.5 border rounded-lg bg-white font-semibold"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview</option>
                        <option value="Offered">Offer Job</option>
                        <option value="Declined">Decline</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: PROCUREMENT */}
      {activeTab === 'procurement' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Procurement & Supplier Tenders</h2>
              <p className="text-xs text-ink-secondary">Create requests for quotations (RFQs) and review supplier bids</p>
            </div>
            <Button variant="gold" size="sm" onClick={() => setNewRFQModal(true)} icon={<Plus className="w-3.5 h-3.5 text-brand-navy-dark" />}>
              Create New RFQ
            </Button>
          </div>

          {/* Active RFQs */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-ink-primary">School RFQs & Tenders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schoolRFQs.map(rfq => (
                <div key={rfq.id} className="bg-white p-5 rounded-2xl border border-surface-border space-y-3 shadow-subtle">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-ink-primary">{rfq.title}</h4>
                      <p className="text-xs text-brand-gold font-semibold">{rfq.category}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {rfq.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary line-clamp-2">{rfq.description}</p>
                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-ink-secondary">Deadline: <strong>{rfq.deadline}</strong></span>
                    <span className="text-brand-navy font-bold">Bids Received: {rfq.bidsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Received Quotations */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
            <h3 className="text-sm font-bold text-ink-primary">Supplier Bids Received</h3>
            {schoolBids.length === 0 ? (
              <p className="text-xs text-ink-secondary">No suppliers have submitted quotations yet. Switch to the <strong>Supplier</strong> persona to test bidding!</p>
            ) : (
              <div className="divide-y divide-surface-border">
                {schoolBids.map(bid => (
                  <div key={bid.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-ink-primary">{bid.supplierName}</strong>
                        <span className="text-xs font-bold text-brand-navy bg-slate-100 px-2 py-0.5 rounded">
                          {formatGHS(bid.totalAmountGHS)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {bid.status}
                        </span>
                      </div>
                      <p className="text-xs text-ink-secondary">For: {bid.rfqTitle} &bull; Delivery: {bid.deliveryTimelineDays} days</p>
                      <p className="text-xs text-ink-secondary italic bg-slate-50 p-2 rounded-lg border">{bid.proposalNotes}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={bid.status}
                        onChange={(e) => updateBidStatus(bid.id, e.target.value as any)}
                        className="text-xs py-1.5 px-2.5 border rounded-lg bg-white font-semibold"
                      >
                        <option value="Pending Review">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Accepted">Accept Bid</option>
                        <option value="Declined">Decline</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: ADMISSIONS & ENQUIRIES */}
      {activeTab === 'admissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Admissions & Enrollment Hub</h2>
              <p className="text-xs text-ink-secondary">
                Manage online student admission applications, schedule diagnostic assessments, and respond to parent inquiries
              </p>
            </div>

            {/* Segmented Subtab Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-surface-border">
              <button
                onClick={() => setAdmissionsSubTab('applications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  admissionsSubTab === 'applications'
                    ? 'bg-white text-brand-navy shadow-sm'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-brand-navy" />
                <span>Student Applications</span>
                <span className="px-1.5 py-0.2 rounded-full bg-brand-navy text-white text-[10px]">
                  {schoolAdmissions.length}
                </span>
              </button>

              <button
                onClick={() => setAdmissionsSubTab('enquiries')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  admissionsSubTab === 'enquiries'
                    ? 'bg-white text-brand-navy shadow-sm'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
                <span>General Enquiries</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px]">
                  {schoolEnquiries.length}
                </span>
              </button>
            </div>
          </div>

          {/* SUBTAB 1: FORMAL STUDENT APPLICATIONS */}
          {admissionsSubTab === 'applications' && (
            <div className="space-y-4">
              {schoolAdmissions.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border text-center space-y-3">
                  <GraduationCap className="w-8 h-8 text-ink-muted mx-auto" />
                  <p className="text-sm font-semibold">No formal admission applications received yet.</p>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    When parents apply through your school profile or the parent workspace, applications will appear here for review and assessment scheduling.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {schoolAdmissions.map((app) => {
                    let badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
                    if (app.status === 'Assessment Scheduled') badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
                    if (app.status === 'Admitted / Offered') badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                    if (app.status === 'Declined') badgeClass = 'bg-rose-100 text-rose-800 border-rose-200';

                    return (
                      <div key={app.id} className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-surface-border">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-ink-primary">{app.studentName}</h4>
                              <span className="text-xs font-mono text-slate-400 font-semibold">#{app.id.toUpperCase()}</span>
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-xs text-ink-secondary mt-1">
                              Guardian: <strong className="text-ink-primary">{app.parentName}</strong> &bull; Phone: {app.parentPhone} &bull; Email: {app.parentEmail}
                            </p>
                          </div>

                          {/* Quick Decision Mutator */}
                          <div className="flex items-center gap-2">
                            <select
                              value={app.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as any;
                                let note = app.schoolNotes;
                                let date = app.assessmentDate;
                                if (newStatus === 'Assessment Scheduled') {
                                  note = 'Entrance diagnostic assessment scheduled at school examination hall.';
                                  date = '2026-06-25T09:00:00Z';
                                } else if (newStatus === 'Admitted / Offered') {
                                  note = 'Candidate offered provisional admission for Academic Year 2026/2027.';
                                }
                                updateAdmissionStatus(app.id, newStatus, note, date);
                              }}
                              className="text-xs py-1.5 px-3 border border-surface-border rounded-xl bg-white font-bold text-brand-navy outline-none"
                            >
                              <option value="Submitted">Submitted</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Assessment Scheduled">Schedule Assessment</option>
                              <option value="Admitted / Offered">Offer Admission</option>
                              <option value="Enrolled">Enroll Student</option>
                              <option value="Declined">Decline Application</option>
                            </select>
                          </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-50 border border-surface-border">
                            <span className="text-slate-500 block text-[11px]">Applied Stage</span>
                            <strong className="text-slate-800">{app.targetLevel}</strong>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 border border-surface-border">
                            <span className="text-slate-500 block text-[11px]">Target Term</span>
                            <strong className="text-slate-800">{app.targetTerm}</strong>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 border border-surface-border">
                            <span className="text-slate-500 block text-[11px]">Prior School</span>
                            <strong className="text-slate-800 truncate block">{app.previousSchool || 'None'}</strong>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 border border-surface-border">
                            <span className="text-slate-500 block text-[11px]">GPS Digital Address</span>
                            <strong className="text-slate-800 font-mono">{app.digitalAddress}</strong>
                          </div>
                        </div>

                        {/* Assessment / School Notes */}
                        {app.schoolNotes && (
                          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-amber-900">Current Status Note / Assessment Schedule:</strong>
                              <p className="mt-0.5">{app.schoolNotes}</p>
                            </div>
                          </div>
                        )}

                        {/* Enclosed Documents */}
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                            Submitted Verification Records ({app.documentsAttached.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {app.documentsAttached.map((doc, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 border text-[11px] text-slate-700 font-medium">
                                <FileText className="w-3 h-3 text-slate-400" />
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUBTAB 2: GENERAL INQUIRIES INBOX */}
          {admissionsSubTab === 'enquiries' && (
            <div className="space-y-4">
              {schoolEnquiries.map(enq => (
                <div key={enq.id} className="bg-white rounded-2xl p-6 border border-surface-border space-y-3 shadow-subtle">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-ink-primary">{enq.parentName}</h4>
                      <p className="text-xs text-ink-secondary">
                        Email: {enq.parentEmail} &bull; Phone: {enq.parentPhone} &bull; Target: <strong className="text-brand-navy">{enq.childTargetLevel}</strong>
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      enq.status === 'Responded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border text-xs text-ink-primary">
                    <strong className="block mb-1">{enq.subject}</strong>
                    <p>{enq.message}</p>
                  </div>
                  {enq.responseNotes && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                      <strong>School Reply Sent:</strong> {enq.responseNotes}
                    </div>
                  )}
                  <div>
                    <Button variant="outline" size="sm" onClick={() => { setReplyEnquiryModal(enq.id); setReplyText(enq.responseNotes || ''); }}>
                      {enq.status === 'Responded' ? 'Update Reply' : 'Send Reply'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-bold text-ink-primary">Public Profile Information</h2>
            <p className="text-xs text-ink-secondary">Manage details visible on the public SkoolFinder directory</p>
          </div>
          <div className="space-y-4">
            <Input label="School Name" defaultValue={currentSchool.name} />
            <Input label="Motto / Slogan" defaultValue={currentSchool.tagline} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Accra Locality" defaultValue={currentSchool.locality} />
              <Input label="GhanaPost Digital Address" defaultValue={currentSchool.digitalAddress} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1 uppercase">About the School</label>
              <textarea
                rows={4}
                defaultValue={currentSchool.aboutText}
                className="w-full border rounded-lg p-3 text-sm focus:border-brand-navy outline-none"
              />
            </div>
            <div className="pt-2">
              <Button variant="primary">Save Profile Updates</Button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-ink-primary">Demonstration Analytics & Growth</h2>
            <p className="text-xs text-ink-secondary">Simulated engagement metrics across Greater Accra</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border space-y-4">
            <h3 className="text-sm font-bold">Monthly Search Impressions</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="impressions" stroke="#C5A55A" fill="#C5A55A" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-4 max-w-xl">
          <h2 className="text-xl font-bold text-ink-primary">Campus Account Settings</h2>
          <Input label="Admissions Notification Email" defaultValue={currentSchool.email} />
          <Input label="Admissions Direct Telephone" defaultValue={currentSchool.phone} />
          <div className="pt-2">
            <Button variant="primary">Update Settings</Button>
          </div>
        </div>
      )}

      {/* MODAL: POST VACANCY */}
      <Modal isOpen={newVacancyModal} onClose={() => setNewVacancyModal(false)} title="Advertise Job Vacancy" maxWidth="md">
        <form onSubmit={handleCreateVacancy} className="space-y-4">
          <Input label="Job Title" required value={vacTitle} onChange={e => setVacTitle(e.target.value)} placeholder="e.g. Cambridge IGCSE Biology Lead" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Department" value={vacDept} onChange={e => setVacDept(e.target.value)} />
            <Select label="Education Level" value={vacLevel} onChange={e => setVacLevel(e.target.value as any)}>
              <option value="Creche & Nursery">Creche & Nursery</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="Primary">Primary</option>
              <option value="Junior High School">Junior High School</option>
              <option value="Senior High School">Senior High School</option>
            </Select>
          </div>
          <Input label="Salary Indication (Monthly)" value={vacSalary} onChange={e => setVacSalary(e.target.value)} placeholder="e.g. GHS 4,500 - GHS 6,500" />
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase">Job Description</label>
            <textarea rows={3} value={vacDesc} onChange={e => setVacDesc(e.target.value)} className="w-full border rounded-lg p-2 text-sm" placeholder="Key responsibilities..." />
          </div>
          <Input label="Application Deadline" type="date" value={vacDeadline} onChange={e => setVacDeadline(e.target.value)} />
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setNewVacancyModal(false)}>Cancel</Button>
            <Button type="submit" variant="gold">Publish Vacancy</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CREATE RFQ */}
      <Modal isOpen={newRFQModal} onClose={() => setNewRFQModal(false)} title="Create Procurement Tender / RFQ" maxWidth="md">
        <form onSubmit={handleCreateRFQ} className="space-y-4">
          <Input label="Tender Title" required value={rfqTitle} onChange={e => setRfqTitle(e.target.value)} placeholder="e.g. Supply of Dual Classroom Desks" />
          <Select label="Supplier Category" value={rfqCategory} onChange={e => setRfqCategory(e.target.value as any)}>
            <option value="Stationery & Books">Stationery & Books</option>
            <option value="ICT & Software">ICT & Software</option>
            <option value="School Furniture">School Furniture</option>
            <option value="Student Transport">Student Transport</option>
            <option value="Science Lab Equipment">Science Lab Equipment</option>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Item Description" value={rfqItemName} onChange={e => setRfqItemName(e.target.value)} />
            <Input label="Required Quantity" type="number" value={rfqItemQty} onChange={e => setRfqItemQty(Number(e.target.value))} />
          </div>
          <Input label="Submission Deadline" type="date" value={rfqDeadline} onChange={e => setRfqDeadline(e.target.value)} />
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setNewRFQModal(false)}>Cancel</Button>
            <Button type="submit" variant="gold">Publish RFQ</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: REPLY TO ENQUIRY */}
      <Modal isOpen={Boolean(replyEnquiryModal)} onClose={() => setReplyEnquiryModal(null)} title="Reply to Parent Enquiry" maxWidth="md">
        <div className="space-y-4">
          <p className="text-xs text-ink-secondary">Write your message to the parent. This will immediately show up in their Parent Portal.</p>
          <textarea
            rows={4}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Dear parent, we are pleased to inform you that entrance tests..."
            className="w-full border rounded-lg p-3 text-sm focus:border-brand-navy outline-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setReplyEnquiryModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => replyEnquiryModal && handleSendReply(replyEnquiryModal)}>Send Official Reply</Button>
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
};
