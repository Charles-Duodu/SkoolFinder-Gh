'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { uploadToSupabaseStorage } from '@/lib/supabase/storage';
import { ProfessionalMode, GreaterAccraLocality, EducationLevel, VerificationStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  GraduationCap
} from 'lucide-react';

interface ProfessionalOnboardingPageProps {
  onComplete?: () => void;
}

export const ProfessionalOnboardingPage: React.FC<ProfessionalOnboardingPageProps> = ({ onComplete }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addProfessional, setRole, addToast } = useDemo();

  const [step, setStep] = useState(1);
  const [submittedStatus, setSubmittedStatus] = useState<VerificationStatus | null>(null);
  const [cvUrl, setCvUrl] = useState('');
  const [uploadingCv, setUploadingCv] = useState(false);

  // Form
  const [fullName, setFullName] = useState('Kofi Addo Mensah');
  const [title, setTitle] = useState('Senior Mathematics & Physics Facilitator');
  const [mode, setMode] = useState<ProfessionalMode>((searchParams?.get('mode') as ProfessionalMode) || 'both');
  const [locality, setLocality] = useState<GreaterAccraLocality>('East Legon');
  const [phone, setPhone] = useState('+233 24 388 9102');
  const [email, setEmail] = useState('kofi.addo.edu@gmail.com');
  const [ntcNumber, setNtcNumber] = useState('NTC/2018/ACC-4912');
  const [experienceYears, setExperienceYears] = useState(9);
  const [degree, setDegree] = useState('B.Sc. Mathematics & Physics (UG)');
  const [subjects, setSubjects] = useState('Core Mathematics, Elective Mathematics, Physics');
  const [summary, setSummary] = useState('Experienced STEM facilitator with proven track record in Cambridge Checkpoint, IGCSE and BECE candidate preparation.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProfessional({
      fullName,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      title,
      mode,
      locality,
      phone,
      email,
      summary,
      qualifications: [{ degree, institution: 'University of Ghana, Legon', year: 2015 }],
      ntcLicenseNumber: ntcNumber,
      yearsOfExperience: Number(experienceYears),
      subjects: subjects.split(',').map(s => s.trim()),
      targetLevels: ['Junior High School', 'Senior High School'],
      employmentPreference: 'Full-time',
      ...(cvUrl ? { cvUrl } : {}),
      servicesOffered: [
        {
          id: `srv-${Date.now()}`,
          title: 'Specialized 1-on-1 IGCSE Mathematics Clinic',
          description: 'Exam technique and problem solving mastery.',
          category: 'STEM Tutoring',
          rateGHS: 'GHS 250 / session',
          active: true
        }
      ]
    });
    setSubmittedStatus('under_review');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary">
          Teacher & Professional Onboarding
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary">
          Register credentials to apply for teaching vacancies and offer tutoring services
        </p>
      </div>

      {submittedStatus ? (
        <div className="bg-white rounded-2xl p-8 border border-surface-border shadow-elevated space-y-6 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <StatusBadge status={submittedStatus} className="text-sm px-3 py-1" />
            <h2 className="text-xl font-bold text-ink-primary">Profile Submitted for Vetting</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Your NTC licensing credentials and teaching portfolio are queued for simulated verification in the Super Admin centre.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border space-y-3 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Prototype Actions:</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  setRole('professional');
                  if (onComplete) {
                    onComplete();
                  } else {
                    router.push('/professionals/dashboard');
                  }
                }}
                className="w-full justify-center"
              >
                Open Professional Workspace
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRole('super_admin');
                  router.push('/super-admin/approvals');
                }}
                className="w-full justify-center"
              >
                Review in Super Admin
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-border shadow-subtle overflow-hidden">
          <div className="bg-slate-50 border-b border-surface-border p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-brand-navy uppercase">Step {step} of 3</span>
              <span className="text-ink-secondary">{Math.round((step / 3) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-navy h-full transition-all" style={{ width: `${(step / 3) * 100}%` }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Personal & Contact Details</h3>
                <Input label="Full Name" required value={fullName} onChange={e => setFullName(e.target.value)} />
                <Input label="Professional Headline" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior JHS English Lead" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                  <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <Select label="Activity Mode" value={mode} onChange={e => setMode(e.target.value as any)}>
                  <option value="both">Both (Career & Tutoring Services)</option>
                  <option value="career">Career Only (School Employment)</option>
                  <option value="services">Services Only (Tutoring / Advisory)</option>
                </Select>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Qualifications & NTC Licensing</h3>
                <Input label="National Teaching Council (NTC) License Number" required value={ntcNumber} onChange={e => setNtcNumber(e.target.value)} />
                <Input label="Highest Academic Degree" required value={degree} onChange={e => setDegree(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Years of Experience" type="number" value={experienceYears} onChange={e => setExperienceYears(Number(e.target.value))} />
                  <Input label="Teaching Subjects" value={subjects} onChange={e => setSubjects(e.target.value)} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Teaching Summary & Documents</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase">Professional Summary</label>
                  <textarea rows={4} value={summary} onChange={e => setSummary(e.target.value)} className="w-full border rounded-lg p-3 text-sm focus:border-brand-navy outline-none" />
                </div>
                <label className="block p-4 border-2 border-dashed rounded-xl text-center space-y-1 cursor-pointer hover:bg-slate-50">
                  <FileText className="w-6 h-6 text-brand-navy mx-auto" />
                  <span className="text-xs font-bold block">
                    {uploadingCv ? 'Uploading CV...' : 'Upload CV & NTC License (Supabase private-vault)'}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold block truncate">
                    {cvUrl ? `Uploaded: ${cvUrl}` : 'Click to attach PDF or continue with profile summary'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingCv(true);
                      const res = await uploadToSupabaseStorage('private-vault', 'professionals-cv', file);
                      setUploadingCv(false);
                      if (res.ok) {
                        setCvUrl(res.path);
                        addToast({ title: 'CV Uploaded', message: `${file.name} stored in private-vault.`, type: 'success' });
                      } else {
                        addToast({ title: 'Upload Notice', message: res.error || 'Sign in first to upload CV.', type: 'warning' });
                      }
                    }}
                  />
                </label>
              </div>
            )}

            <div className="pt-6 border-t flex items-center justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setStep(step - 1)}>Back</Button>
              ) : <div />}

              {step < 3 ? (
                <Button type="button" variant="primary" size="sm" onClick={() => setStep(step + 1)}>Continue</Button>
              ) : (
                <Button type="submit" variant="gold" size="md">Submit Profile</Button>
              )}
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
