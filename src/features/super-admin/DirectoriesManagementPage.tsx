'use client';

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { GreaterAccraLocality, CurriculumType, EducationLevel } from '../../types';
import { formatGHS, formatDate } from '../../lib/utils';
import { 
  School, 
  Users, 
  Briefcase, 
  Truck, 
  FileCheck2, 
  Layers, 
  Search, 
  ExternalLink,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';

interface DirectoriesPageProps {
  initialTab?: 'schools' | 'parents' | 'professionals' | 'suppliers' | 'recruitment' | 'procurement';
}

export const DirectoriesManagementPage: React.FC<DirectoriesPageProps> = ({ initialTab = 'schools' }) => {
  const { state, preloadSchool } = useDemo();
  const [activeTab, setActiveTab] = useState<'schools' | 'parents' | 'professionals' | 'suppliers' | 'recruitment' | 'procurement'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Pre-load Day-1 School Modal state
  const [preloadModalOpen, setPreloadModalOpen] = useState(false);
  const [preName, setPreName] = useState('');
  const [preLocality, setPreLocality] = useState<GreaterAccraLocality>('East Legon');
  const [preAddress, setPreAddress] = useState('');
  const [preDigital, setPreDigital] = useState('GA-240-1102');
  const [preCurriculum, setPreCurriculum] = useState<CurriculumType>('GES / NaCCA');
  const [preEmail, setPreEmail] = useState('');
  const [prePhone, setPrePhone] = useState('+233 30 200 0000');
  const [preMinFee, setPreMinFee] = useState(12000);
  const [preMaxFee, setPreMaxFee] = useState(25000);

  const handlePreloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preName.trim()) return;
    const slug = preName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    preloadSchool({
      name: preName,
      slug: `${slug}-${Date.now().toString().slice(-3)}`,
      tagline: `Verified private educational institution in ${preLocality}, Greater Accra`,
      crestUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80'],
      locality: preLocality,
      digitalAddress: preDigital,
      address: preAddress || `${preLocality}, Greater Accra`,
      phone: prePhone,
      email: preEmail || `admissions@${slug || 'school'}.edu.gh`,
      yearEstablished: 2015,
      ownershipType: 'Private',
      educationLevels: ['Creche & Nursery', 'Kindergarten', 'Primary'] as EducationLevel[],
      curricula: [preCurriculum],
      boardingStatus: 'Day Only',
      gender: 'Co-educational',
      facilities: ['Modern Science Lab', 'ICT Innovation Suite', 'School Bus Fleet'],
      annualFeeRange: { min: preMinFee, max: preMaxFee, currency: 'GHS' },
      studentTeacherRatio: '15:1',
      averageClassSize: 20,
      aboutText: `${preName} is a pre-loaded verified private school in ${preLocality}, Greater Accra. School administrators can claim ownership of this profile anytime.`,
      admissionsOverview: 'Contact the school admissions office directly or submit an online enquiry via SkoolFinder Ghana.',
      contactPerson: {
        name: 'Admissions Desk',
        role: 'Admissions Office',
        phone: prePhone,
        email: preEmail || `admissions@${slug || 'school'}.edu.gh`,
      },
    });

    setPreName('');
    setPreAddress('');
    setPreEmail('');
    setPreloadModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-surface-border overflow-x-auto no-scrollbar gap-1 bg-white p-1 rounded-xl shadow-subtle">
          {[
            { id: 'schools', label: 'Schools Management', icon: <School className="w-4 h-4" />, count: state.schools.length },
            { id: 'parents', label: 'Parents & Users', icon: <Users className="w-4 h-4" />, count: 1 },
            { id: 'professionals', label: 'Professionals Directory', icon: <Briefcase className="w-4 h-4" />, count: state.professionals.length },
            { id: 'suppliers', label: 'Suppliers Directory', icon: <Truck className="w-4 h-4" />, count: state.suppliers.length },
            { id: 'recruitment', label: 'Recruitment Oversight', icon: <FileCheck2 className="w-4 h-4" />, count: state.vacancies.length },
            { id: 'procurement', label: 'Procurement Oversight', icon: <Layers className="w-4 h-4" />, count: state.rfqs.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB: SCHOOLS */}
        {activeTab === 'schools' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-ink-primary">Schools Registry</h2>
                <p className="text-xs text-ink-secondary">
                  Pre-load real Greater Accra schools on Day 1 or monitor verified institutional listings
                </p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() => setPreloadModalOpen(true)}
                icon={<Plus className="w-4 h-4 text-brand-navy-dark" />}
              >
                Pre-Load Verified School
              </Button>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border overflow-x-auto shadow-subtle">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-ink-muted uppercase">
                    <th className="p-4">School Details</th>
                    <th className="p-4">Locality</th>
                    <th className="p-4">Curricula</th>
                    <th className="p-4">Annual Tuition</th>
                    <th className="p-4">Ownership / Claim</th>
                    <th className="p-4">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {state.schools.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={s.crestUrl} alt="crest" className="w-8 h-8 rounded-lg object-cover bg-white border" />
                          <div>
                            <strong className="text-sm font-bold text-ink-primary block">{s.name}</strong>
                            <span className="text-[10px] text-ink-secondary">Digital: {s.digitalAddress}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-ink-secondary">{s.locality}</td>
                      <td className="p-4 text-ink-secondary">{s.curricula.join(', ')}</td>
                      <td className="p-4 font-bold text-brand-navy">{formatGHS(s.annualFeeRange.min)} – {formatGHS(s.annualFeeRange.max)}</td>
                      <td className="p-4">
                        {s.isClaimed === false ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            Unclaimed (Pre-Loaded)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Claimed by School
                          </span>
                        )}
                      </td>
                      <td className="p-4"><StatusBadge status={s.verificationStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: PARENTS */}
        {activeTab === 'parents' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ink-primary">Registered Parent Accounts</h2>
            <div className="bg-white rounded-2xl border border-surface-border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm font-bold text-ink-primary">{state.parent.fullName}</strong>
                  <p className="text-xs text-ink-secondary">{state.parent.email} &bull; {state.parent.phone}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Parent Persona Active
                </span>
              </div>
              <div className="text-xs text-ink-secondary space-y-1 pt-2 border-t">
                <p>Children: <strong>{state.parent.children.map(c => `${c.name} (${c.targetLevel})`).join(', ')}</strong></p>
                <p>Saved Schools: <strong>{state.parent.savedSchoolIds.length}</strong> &bull; Shortlisted: <strong>{state.parent.shortlistedSchoolIds.length}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROFESSIONALS */}
        {activeTab === 'professionals' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ink-primary">Teachers & Education Professionals</h2>
            <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-ink-muted uppercase">
                    <th className="p-4">Professional</th>
                    <th className="p-4">NTC License</th>
                    <th className="p-4">Subjects</th>
                    <th className="p-4">Experience</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {state.professionals.map(p => (
                    <tr key={p.id}>
                      <td className="p-4">
                        <strong className="text-sm font-bold block">{p.fullName}</strong>
                        <span className="text-ink-secondary">{p.title}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-brand-navy">{p.ntcLicenseNumber || 'Unassigned'}</td>
                      <td className="p-4">{p.subjects.join(', ')}</td>
                      <td className="p-4 font-semibold">{p.yearsOfExperience} years</td>
                      <td className="p-4"><StatusBadge status={p.verificationStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SUPPLIERS */}
        {activeTab === 'suppliers' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ink-primary">Commercial Suppliers & Vendors</h2>
            <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-ink-muted uppercase">
                    <th className="p-4">Business Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">RGD Reg Number</th>
                    <th className="p-4">Locality</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {state.suppliers.map(sup => (
                    <tr key={sup.id}>
                      <td className="p-4 font-bold text-sm text-ink-primary">{sup.businessName}</td>
                      <td className="p-4 font-semibold text-brand-navy">{sup.category}</td>
                      <td className="p-4 font-mono">{sup.registrationNumber}</td>
                      <td className="p-4">{sup.locality}</td>
                      <td className="p-4"><StatusBadge status={sup.verificationStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: RECRUITMENT */}
        {activeTab === 'recruitment' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ink-primary">Platform Vacancies & Hiring Oversight</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.vacancies.map(v => (
                <div key={v.id} className="bg-white p-5 rounded-2xl border space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-ink-primary">{v.title}</h4>
                      <p className="text-xs text-brand-navy font-semibold">{v.schoolName}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{v.status}</span>
                  </div>
                  <p className="text-xs text-ink-secondary">{v.department} &bull; Applicants: <strong>{v.applicantsCount}</strong></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROCUREMENT */}
        {activeTab === 'procurement' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ink-primary">School RFQs & Tender Oversight</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.rfqs.map(r => (
                <div key={r.id} className="bg-white p-5 rounded-2xl border space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-ink-primary">{r.title}</h4>
                      <p className="text-xs text-brand-navy font-semibold">{r.schoolName}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{r.status}</span>
                  </div>
                  <p className="text-xs text-ink-secondary">{r.category} &bull; Bids Received: <strong>{r.bidsCount}</strong></p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Super Admin Pre-Load Day-1 Accra School Modal */}
      <Modal
        isOpen={preloadModalOpen}
        onClose={() => setPreloadModalOpen(false)}
        title="Pre-Load Verified Greater Accra School"
        maxWidth="lg"
      >
        <form onSubmit={handlePreloadSubmit} className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
            Pre-loaded schools publish immediately to the public directory as <strong>Approved</strong> and <strong>Unclaimed</strong> so parents find real options on Day 1. School owners can claim them later.
          </div>

          <Input
            label="Official School Name"
            value={preName}
            onChange={(e) => setPreName(e.target.value)}
            placeholder="e.g. Roman Ridge International Academy"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">Accra Locality</label>
              <select
                value={preLocality}
                onChange={(e) => setPreLocality(e.target.value as GreaterAccraLocality)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-lg bg-white outline-none"
              >
                {(['East Legon', 'Cantonments', 'Airport Residential', 'Osu', 'Tema', 'Spintex', 'Achimota', 'Dansoman', 'Madina', 'Adenta', 'Ridge', 'Labone', 'Dzorwulu', 'Legon'] as GreaterAccraLocality[]).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <Input
              label="GhanaPost Digital Address"
              value={preDigital}
              onChange={(e) => setPreDigital(e.target.value)}
              placeholder="GA-240-1102"
              required
            />
          </div>

          <Input
            label="Street Address / Landmark"
            value={preAddress}
            onChange={(e) => setPreAddress(e.target.value)}
            placeholder="e.g. 12 Agostinho Neto Road, Airport Residential"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">Primary Curriculum</label>
              <select
                value={preCurriculum}
                onChange={(e) => setPreCurriculum(e.target.value as CurriculumType)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-lg bg-white outline-none"
              >
                {(['GES / NaCCA', 'Cambridge International', 'International Baccalaureate (IB)', 'Montessori', 'British-Ghanaian Dual'] as CurriculumType[]).map((cur) => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>
            </div>

            <Input
              label="Public Admissions Email"
              type="email"
              value={preEmail}
              onChange={(e) => setPreEmail(e.target.value)}
              placeholder="admissions@school.edu.gh"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Contact Phone"
              value={prePhone}
              onChange={(e) => setPrePhone(e.target.value)}
            />
            <Input
              label="Min Annual Fee (GHS)"
              type="number"
              value={preMinFee}
              onChange={(e) => setPreMinFee(Number(e.target.value))}
            />
            <Input
              label="Max Annual Fee (GHS)"
              type="number"
              value={preMaxFee}
              onChange={(e) => setPreMaxFee(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
            <Button type="button" variant="outline" onClick={() => setPreloadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold">
              Publish Unclaimed Listing
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};
