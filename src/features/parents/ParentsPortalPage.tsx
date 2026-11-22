import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { DashboardLayout, DashboardNavItem } from '../../components/layout/DashboardLayout';
import { SchoolCard } from '../discovery/SchoolCard';
import { formatGHS, formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  LayoutDashboard, 
  Bookmark, 
  Star, 
  Scale, 
  MessageSquare, 
  Bell, 
  Settings, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2,
  ExternalLink
} from 'lucide-react';

export const ParentsPortalPage: React.FC = () => {
  const { state, toggleSaveSchool, toggleShortlistSchool, toggleCompareSchool } = useDemo();
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'shortlist' | 'comparisons' | 'enquiries' | 'alerts' | 'settings'>('overview');

  const parent = state.parent;
  const savedSchools = state.schools.filter(s => parent.savedSchoolIds.includes(s.id));
  const shortlistedSchools = state.schools.filter(s => parent.shortlistedSchoolIds.includes(s.id));
  const comparedSchools = state.schools.filter(s => parent.comparisonSchoolIds.includes(s.id));
  const parentEnquiries = state.enquiries.filter(e => e.parentEmail === parent.email || e.parentName === parent.fullName);

  const navItems: DashboardNavItem[] = [
    { id: 'overview', label: 'Overview', path: '/parents/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved Schools', path: '/parents/saved', icon: <Bookmark className="w-4 h-4" />, badge: savedSchools.length },
    { id: 'shortlist', label: 'My Shortlist', path: '/parents/shortlist', icon: <Star className="w-4 h-4" />, badge: shortlistedSchools.length },
    { id: 'comparisons', label: 'My Comparisons', path: '/parents/comparisons', icon: <Scale className="w-4 h-4" />, badge: comparedSchools.length },
    { id: 'enquiries', label: 'My Enquiries', path: '/parents/enquiries', icon: <MessageSquare className="w-4 h-4" />, badge: parentEnquiries.length },
    { id: 'alerts', label: 'School Alerts', path: '/parents/alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'settings', label: 'Account Settings', path: '/parents/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout
      portalName="Parents & Guardians Workspace"
      portalSubtitle="Discovering education for Nana Yaw & Akosua"
      navItems={navItems.map(item => ({
        ...item,
        path: '#', // using tab switching for seamless prototype experience
      }))}
      actionButton={
        <Link to="/schools">
          <Button variant="gold" size="sm" icon={<Search className="w-3.5 h-3.5 text-brand-navy-dark" />}>
            Search Accra Schools
          </Button>
        </Link>
      }
    >
      {/* Dynamic Subview Navigation for In-Page Experience */}
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

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-gold">
                Welcome back, {parent.fullName}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold">
                Managing School Options in Greater Accra
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                You have {savedSchools.length} saved institutions, {shortlistedSchools.length} shortlisted for 2026/2027 entry, and {parentEnquiries.length} active admission inquiries.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/schools">
                <Button variant="gold" size="sm">Find More Schools</Button>
              </Link>
              <button
                onClick={() => setActiveTab('enquiries')}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                View Enquiries
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => setActiveTab('saved')} 
              className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle cursor-pointer hover:border-brand-navy transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted font-medium">Saved Schools</span>
                <Bookmark className="w-4 h-4 text-brand-navy" />
              </div>
              <p className="text-2xl font-bold text-ink-primary mt-2">{savedSchools.length}</p>
              <span className="text-[11px] text-ink-secondary mt-1 block">In East Legon & Cantonments</span>
            </div>

            <div 
              onClick={() => setActiveTab('shortlist')} 
              className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle cursor-pointer hover:border-brand-navy transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted font-medium">Shortlisted</span>
                <Star className="w-4 h-4 text-brand-gold" />
              </div>
              <p className="text-2xl font-bold text-ink-primary mt-2">{shortlistedSchools.length}</p>
              <span className="text-[11px] text-ink-secondary mt-1 block">Priority application list</span>
            </div>

            <div 
              onClick={() => setActiveTab('comparisons')} 
              className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle cursor-pointer hover:border-brand-navy transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted font-medium">Side-by-Side</span>
                <Scale className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-ink-primary mt-2">{comparedSchools.length}</p>
              <span className="text-[11px] text-ink-secondary mt-1 block">Active comparison matrix</span>
            </div>

            <div 
              onClick={() => setActiveTab('enquiries')} 
              className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle cursor-pointer hover:border-brand-navy transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted font-medium">Admission Enquiries</span>
                <MessageSquare className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-ink-primary mt-2">{parentEnquiries.length}</p>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">1 school responded</span>
            </div>
          </div>

          {/* Children Profiles Bar */}
          <div className="bg-white p-5 rounded-2xl border border-surface-border space-y-3">
            <h3 className="text-sm font-bold text-ink-primary">Registered Children Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {parent.children.map((child, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-surface-border flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-bold text-ink-primary">{child.name}</strong>
                    <p className="text-[11px] text-ink-secondary">Age {child.currentAge} &bull; Target: {child.targetLevel}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Target 2026/27
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enquiries Preview */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-primary">Recent Communication with Schools</h3>
              <button onClick={() => setActiveTab('enquiries')} className="text-xs text-brand-navy font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {parentEnquiries.slice(0, 2).map((enq) => (
                <div key={enq.id} className="p-4 rounded-xl border border-surface-border bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-brand-navy">{enq.schoolName}</strong>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      enq.status === 'Responded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-primary font-medium">{enq.subject}</p>
                  <p className="text-xs text-ink-secondary line-clamp-2">{enq.message}</p>
                  {enq.responseNotes && (
                    <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                      <strong>School Response:</strong> {enq.responseNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Saved Schools Quick Carousel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-ink-primary">Saved Private Schools</h3>
              <button onClick={() => setActiveTab('saved')} className="text-xs text-brand-navy font-semibold hover:underline">
                Manage ({savedSchools.length})
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSchools.map(school => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SAVED SCHOOLS */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Saved Schools Directory</h2>
              <p className="text-xs text-ink-secondary">Review, compare, or organize your saved private school options</p>
            </div>
            <Link to="/schools">
              <Button variant="outline" size="sm">Browse More</Button>
            </Link>
          </div>

          {savedSchools.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border text-center space-y-3">
              <Bookmark className="w-8 h-8 text-ink-muted mx-auto" />
              <p className="text-sm font-semibold">No saved schools yet.</p>
              <Link to="/schools"><Button variant="gold" size="sm">Explore Directory</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSchools.map(school => (
                <div key={school.id} className="relative">
                  <SchoolCard school={school} />
                  <div className="mt-2 flex items-center justify-between px-1">
                    <button
                      onClick={() => toggleShortlistSchool(school.id)}
                      className={`text-xs font-semibold flex items-center gap-1 ${
                        parent.shortlistedSchoolIds.includes(school.id) ? 'text-amber-600' : 'text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{parent.shortlistedSchoolIds.includes(school.id) ? 'Shortlisted' : 'Add to Shortlist'}</span>
                    </button>
                    <button
                      onClick={() => toggleSaveSchool(school.id)}
                      className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: MY SHORTLIST */}
      {activeTab === 'shortlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Priority Application Shortlist</h2>
              <p className="text-xs text-ink-secondary">Top selected institutions for Nana Yaw & Akosua</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
            <div className="divide-y divide-surface-border">
              {shortlistedSchools.map(school => (
                <div key={school.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={school.crestUrl} alt={school.name} className="w-12 h-12 rounded-xl object-cover bg-white border" />
                    <div>
                      <h4 className="text-sm font-bold text-ink-primary">{school.name}</h4>
                      <p className="text-xs text-ink-secondary">{school.locality} &bull; Fees: {formatGHS(school.annualFeeRange.min)} - {formatGHS(school.annualFeeRange.max)}</p>
                      <div className="flex gap-1.5 mt-1">
                        {school.curricula.map(c => (
                          <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/schools/${school.slug}`}>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </Link>
                    <button
                      onClick={() => toggleShortlistSchool(school.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MY COMPARISONS */}
      {activeTab === 'comparisons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">School Comparison Matrix</h2>
              <p className="text-xs text-ink-secondary">Comparing {comparedSchools.length} selected institutions</p>
            </div>
            <Link to="/compare">
              <Button variant="gold" size="sm">Open Full Matrix View</Button>
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border text-center space-y-3">
            <p className="text-sm text-ink-secondary">
              You currently have {comparedSchools.length} schools in active comparison:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {comparedSchools.map(s => (
                <span key={s.id} className="px-3 py-1 rounded-full bg-brand-navy/10 text-brand-navy text-xs font-semibold">
                  {s.name}
                </span>
              ))}
            </div>
            <div className="pt-2">
              <Link to="/compare">
                <Button variant="primary" size="sm">Launch Comparison Page</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">My Admission Inquiries</h2>
              <p className="text-xs text-ink-secondary">Track responses and status from admissions offices</p>
            </div>
          </div>

          <div className="space-y-4">
            {parentEnquiries.map(enq => (
              <div key={enq.id} className="bg-white rounded-2xl p-5 border border-surface-border space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-ink-primary">{enq.schoolName}</h3>
                    <p className="text-[11px] text-ink-secondary">Target Level: {enq.childTargetLevel} &bull; Sent: {formatDate(enq.submittedAt)}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold w-fit ${
                    enq.status === 'Responded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {enq.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-ink-primary">{enq.subject}</h4>
                  <p className="text-xs text-ink-secondary leading-relaxed bg-slate-50 p-3 rounded-lg border">{enq.message}</p>
                </div>
                {enq.responseNotes && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Official Reply from Admissions:
                    </span>
                    <p>{enq.responseNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-6 max-w-2xl">
          <div>
            <h2 className="text-xl font-bold text-ink-primary">School Notifications & Deadlines</h2>
            <p className="text-xs text-ink-secondary">Control alerts for diagnostic exams and application cut-offs</p>
          </div>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border">
              <div>
                <strong className="text-ink-primary block">Admission Application Deadlines</strong>
                <span className="text-ink-secondary">Alert 14 days before entry deadlines close</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-navy rounded" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border">
              <div>
                <strong className="text-ink-primary block">New Matching Schools in East Legon</strong>
                <span className="text-ink-secondary">Notify when newly registered schools launch nearby</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-navy rounded" />
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-6 max-w-xl">
          <div>
            <h2 className="text-xl font-bold text-ink-primary">Parent Profile Settings</h2>
            <p className="text-xs text-ink-secondary">Update contact credentials for admission communication</p>
          </div>
          <div className="space-y-4">
            <Input label="Full Name" defaultValue={parent.fullName} />
            <Input label="Email Address" defaultValue={parent.email} />
            <Input label="Phone Number" defaultValue={parent.phone} />
            <Input label="Primary Accra Locality" defaultValue={parent.locality} />
            <div className="pt-2">
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
