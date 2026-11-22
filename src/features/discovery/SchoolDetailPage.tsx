import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { formatGHS } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { ParentEnquiryModal } from './ParentEnquiryModal';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Scale, 
  Bookmark, 
  Users, 
  Building, 
  CheckCircle2, 
  ArrowLeft,
  Share2,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export const SchoolDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { state, toggleSaveSchool, toggleCompareSchool } = useDemo();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'facilities' | 'admissions' | 'gallery'>('overview');

  const school = state.schools.find(s => s.slug === slug || s.id === slug);

  if (!school) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-ink-primary">School Profile Not Found</h2>
        <p className="text-sm text-ink-secondary">The requested private school could not be located in the Greater Accra registry.</p>
        <Link to="/schools">
          <Button variant="primary">Return to Directory</Button>
        </Link>
      </div>
    );
  }

  const isSaved = state.parent.savedSchoolIds.includes(school.id);
  const isCompared = state.parent.comparisonSchoolIds.includes(school.id);

  // Related schools in the same locality or curriculum
  const relatedSchools = state.schools
    .filter(s => s.id !== school.id && (s.locality === school.locality || s.curricula.some(c => school.curricula.includes(c))))
    .slice(0, 3);

  return (
    <div className="pb-20">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link to="/schools" className="flex items-center gap-1.5 text-xs text-ink-secondary hover:text-brand-navy font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Schools</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveSchool(school.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isSaved ? 'bg-brand-gold text-brand-navy-dark border-brand-gold' : 'border-surface-border hover:bg-slate-50 text-ink-secondary'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => toggleCompareSchool(school.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isCompared ? 'bg-brand-navy text-white border-brand-navy' : 'border-surface-border hover:bg-slate-50 text-ink-secondary'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'In Comparison' : 'Compare'}</span>
            </button>
            <Button variant="gold" size="sm" onClick={() => setEnquiryOpen(true)} icon={<Send className="w-3.5 h-3.5 text-brand-navy-dark" />}>
              Send Enquiry
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Header with Campus Cover */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-slate-900 overflow-hidden">
        <img
          src={school.coverImageUrl}
          alt={school.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <img
              src={school.crestUrl}
              alt={`${school.name} crest`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-white p-1 border-4 border-white shadow-xl shrink-0"
            />
            <div className="text-white space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={school.verificationStatus} />
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-sm">
                  Est. {school.yearEstablished}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-sm">
                  {school.ownershipType}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
                {school.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{school.address} &bull; Digital Address: {school.digitalAddress}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main 2-Col Body */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs Bar */}
            <div className="flex border-b border-surface-border space-x-6 text-sm font-semibold">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'academics', label: 'Academics & Curricula' },
                { id: 'facilities', label: 'Facilities' },
                { id: 'admissions', label: 'Admissions & Fees' },
                { id: 'gallery', label: 'Campus Gallery' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === tab.id ? 'border-brand-navy text-brand-navy font-bold' : 'border-transparent text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-3">
                  <h3 className="text-base font-bold text-ink-primary">About {school.name}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed whitespace-pre-line">
                    {school.aboutText}
                  </p>
                </div>

                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-surface-border text-center">
                    <span className="text-[11px] text-ink-muted uppercase font-semibold">Student-Teacher</span>
                    <p className="text-lg font-bold text-brand-navy mt-1">{school.studentTeacherRatio}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-surface-border text-center">
                    <span className="text-[11px] text-ink-muted uppercase font-semibold">Avg Class Size</span>
                    <p className="text-lg font-bold text-brand-navy mt-1">{school.averageClassSize} students</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-surface-border text-center">
                    <span className="text-[11px] text-ink-muted uppercase font-semibold">Boarding Mode</span>
                    <p className="text-lg font-bold text-brand-navy mt-1">{school.boardingStatus}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-surface-border text-center">
                    <span className="text-[11px] text-ink-muted uppercase font-semibold">Gender</span>
                    <p className="text-lg font-bold text-brand-navy mt-1">{school.gender}</p>
                  </div>
                </div>

                {/* Contact & Location Block */}
                <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-4">
                  <h3 className="text-base font-bold text-ink-primary">Location & Contact Leadership</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-ink-secondary">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-navy" />
                      <span>Direct: {school.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-navy" />
                      <span>{school.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-brand-navy" />
                      <span>Admissions Officer: {school.contactPerson.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-navy" />
                      <span>Digital Address: {school.digitalAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ACADEMICS */}
            {activeTab === 'academics' && (
              <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-6">
                <div>
                  <h3 className="text-base font-bold text-ink-primary mb-3">Offered Curricula</h3>
                  <div className="flex flex-wrap gap-2">
                    {school.curricula.map(c => (
                      <div key={c} className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900">
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-ink-primary mb-3">Education Stages & Levels</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {school.educationLevels.map(lvl => (
                      <div key={lvl} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-surface-border text-xs text-ink-primary font-medium">
                        <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                        <span>{lvl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FACILITIES */}
            {activeTab === 'facilities' && (
              <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Campus Infrastructure & Facilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {school.facilities.map(fac => (
                    <div key={fac} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-surface-border text-xs font-medium text-ink-primary">
                      <div className="w-2 h-2 rounded-full bg-brand-gold" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ADMISSIONS */}
            {activeTab === 'admissions' && (
              <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-6">
                <div>
                  <h3 className="text-base font-bold text-ink-primary">Admissions Overview</h3>
                  <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
                    {school.admissionsOverview}
                  </p>
                </div>

                {school.admissionsDeadline && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                    <span className="font-semibold">Next Admission Application Deadline:</span>
                    <strong className="text-sm font-bold">{new Date(school.admissionsDeadline).toLocaleDateString('en-GB')}</strong>
                  </div>
                )}

                <div>
                  <h3 className="text-base font-bold text-ink-primary mb-2">Annual Tuition Band (Published)</h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-surface-border flex items-center justify-between">
                    <span className="text-xs text-ink-secondary">Indicative annual fees (tuition & standard academic levies):</span>
                    <span className="text-lg font-extrabold text-brand-navy">
                      {formatGHS(school.annualFeeRange.min)} – {formatGHS(school.annualFeeRange.max)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Campus Photo Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {school.galleryImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${school.name} campus view ${i + 1}`}
                      className="rounded-xl h-48 w-full object-cover border border-surface-border"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar CTA & Related Schools */}
          <div className="space-y-6">
            
            {/* Quick Admissions Enquiry Box */}
            <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle space-y-4">
              <h3 className="text-base font-bold text-ink-primary">Direct Enquiry</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Connect with {school.contactPerson.name} ({school.contactPerson.role}) to schedule a campus walk-through or request entrance test details.
              </p>
              <Button
                variant="gold"
                size="md"
                onClick={() => setEnquiryOpen(true)}
                className="w-full justify-center"
                icon={<Send className="w-4 h-4 text-brand-navy-dark" />}
              >
                Send Admission Message
              </Button>
            </div>

            {/* Related Schools in Greater Accra */}
            {relatedSchools.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-surface-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                  Similar Schools in {school.locality}
                </h4>
                <div className="space-y-3">
                  {relatedSchools.map(rel => (
                    <Link
                      key={rel.id}
                      to={`/schools/${rel.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <img
                        src={rel.crestUrl}
                        alt={rel.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white border border-surface-border shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-ink-primary truncate group-hover:text-brand-navy">
                          {rel.name}
                        </h5>
                        <p className="text-[11px] text-ink-secondary truncate">{rel.locality} &bull; {rel.boardingStatus}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Parent Enquiry Modal */}
      <ParentEnquiryModal
        school={school}
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />

    </div>
  );
};
