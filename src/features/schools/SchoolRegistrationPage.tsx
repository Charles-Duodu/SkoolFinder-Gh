'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { uploadToSupabaseStorage } from '@/lib/supabase/storage';
import { GreaterAccraLocality, EducationLevel, CurriculumType, VerificationStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  School,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Clock,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface SchoolRegistrationPageProps {
  onComplete?: () => void;
}

export const SchoolRegistrationPage: React.FC<SchoolRegistrationPageProps> = ({ onComplete }) => {
  const router = useRouter();
  const { addSchool, setRole, addToast } = useDemo();

  const [step, setStep] = useState(1);
  const [submittedStatus, setSubmittedStatus] = useState<VerificationStatus | null>(null);
  const [crestUrl, setCrestUrl] = useState('/logo-icon.svg');
  const [gesDocPath, setGesDocPath] = useState('GES_Cert_2026.pdf');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Form State
  const [schoolName, setSchoolName] = useState('');
  const [tagline, setTagline] = useState('');
  const [locality, setLocality] = useState<GreaterAccraLocality>('East Legon');
  const [digitalAddress, setDigitalAddress] = useState('GA-230-1092');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('+233 30 200 0000');
  const [email, setEmail] = useState('');
  const [yearEstablished, setYearEstablished] = useState(2018);
  const [ownershipType, setOwnershipType] = useState<'Private' | 'Mission / Faith-Based' | 'International Private'>('Private');
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>(['Creche & Nursery', 'Kindergarten', 'Primary']);
  const [curricula, setCurricula] = useState<CurriculumType[]>(['GES / NaCCA']);
  const [boardingStatus, setBoardingStatus] = useState<'Day Only' | 'Boarding Only' | 'Day & Boarding'>('Day Only');
  const [minFee, setMinFee] = useState(15000);
  const [maxFee, setMaxFee] = useState(28000);
  const [facilities, setFacilities] = useState<string[]>(['Modern Science Lab', 'ICT Innovation Suite', 'School Bus Fleet']);
  const [aboutText, setAboutText] = useState('');
  const [admissionsOverview, setAdmissionsOverview] = useState('');
  const [contactName, setContactName] = useState('Dr. Kwame Mensah');
  const [contactRole, setContactRole] = useState('Managing Director');
  const [contactPhone, setContactPhone] = useState('+233 24 000 1122');
  const [contactEmail, setContactEmail] = useState('');

  const localities: GreaterAccraLocality[] = [
    'East Legon', 'Cantonments', 'Airport Residential', 'Osu', 'Tema',
    'Spintex', 'Achimota', 'Dansoman', 'Madina', 'Adenta', 'Ridge'
  ];

  const handleNext = () => setStep(prev => Math.min(prev + 1, 8));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = addSchool({
      name: schoolName || 'New Greater Accra International Academy',
      slug: (schoolName || 'new-accra-academy').toLowerCase().replace(/\s+/g, '-'),
      tagline: tagline || 'Committed to child development and academic distinction',
      crestUrl,
      coverImageUrl: '/images/schools/school-east-legon.jpg',
      galleryImages: ['/images/schools/school-east-legon.jpg'],
      locality,
      digitalAddress,
      address: address || 'Airport West, Accra',
      phone,
      email: email || 'info@newaccraacademy.edu.gh',
      yearEstablished,
      ownershipType,
      educationLevels,
      curricula,
      boardingStatus,
      gender: 'Co-educational',
      facilities,
      annualFeeRange: { min: Number(minFee), max: Number(maxFee), currency: 'GHS' },
      studentTeacherRatio: '12:1',
      averageClassSize: 18,
      aboutText: aboutText || 'Founded to provide high-quality basic education standards in Greater Accra.',
      admissionsOverview: admissionsOverview || 'Admissions open for early childhood through upper primary.',
      contactPerson: {
        name: contactName,
        role: contactRole,
        phone: contactPhone,
        email: contactEmail || email
      }
    });

    setSubmittedStatus('under_review');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary">
          Register Your Private School
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary">
          Join the SkoolFinder Ghana registry for institutions across Greater Accra
        </p>
      </div>

      {/* If Application Submitted -> Interactive Status View */}
      {submittedStatus ? (
        <div className="bg-white rounded-2xl p-8 border border-surface-border shadow-elevated space-y-6 text-center max-w-xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <StatusBadge status={submittedStatus} className="text-sm px-3 py-1" />
            <h2 className="text-xl font-bold text-ink-primary">Application Successfully Submitted</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Your institutional record has been queued for simulated verification in the <strong>Super Admin Applications Centre</strong>.
            </p>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="p-4 bg-slate-50 rounded-xl border border-surface-border text-left space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Prototype Test Controls:
            </span>
            <p className="text-xs text-ink-secondary">
              You can test the next journey steps right now:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  setRole('school_owner');
                  if (onComplete) {
                    onComplete();
                  } else {
                    router.push('/school-owners/dashboard');
                  }
                }}
                className="w-full justify-center"
              >
                Enter Approved Dashboard
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
        /* 8-Step Wizard */
        <div className="bg-white rounded-2xl border border-surface-border shadow-subtle overflow-hidden">

          {/* Stepper Header */}
          <div className="bg-slate-50 border-b border-surface-border p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-brand-navy uppercase tracking-wider">
                Step {step} of 8: {
                  [
                    'Account Information', 'School Identity', 'Location & Campus',
                    'Education Levels', 'Curriculum & Academics', 'Facilities',
                    'Supporting Documents', 'Review & Submission'
                  ][step - 1]
                }
              </span>
              <span className="text-ink-secondary font-medium">{Math.round((step / 8) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-navy h-full transition-all duration-300"
                style={{ width: `${(step / 8) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Contents */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Designated Administrator / Proprietor Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" required value={contactName} onChange={e => setContactName(e.target.value)} />
                  <Input label="Administrative Role" required value={contactRole} onChange={e => setContactRole(e.target.value)} />
                  <Input label="Contact Phone Number" required value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                  <Input label="Direct Email" type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="proprietor@school.edu.gh" />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Institutional Identity</h3>
                <Input label="Official School Name" required value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. Roman Ridge Preparatory School" />
                <Input label="School Motto / Tagline" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="e.g. Truth, Diligence and Character" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Year Established" type="number" value={yearEstablished} onChange={e => setYearEstablished(Number(e.target.value))} />
                  <Select label="Ownership Type" value={ownershipType} onChange={e => setOwnershipType(e.target.value as any)}>
                    <option value="Private">Private</option>
                    <option value="Mission / Faith-Based">Mission / Faith-Based</option>
                    <option value="International Private">International Private</option>
                  </Select>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Location & Campus Coordinates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="Greater Accra Locality" value={locality} onChange={e => setLocality(e.target.value as any)}>
                    {localities.map(l => <option key={l} value={l}>{l}</option>)}
                  </Select>
                  <Input label="GhanaPost Digital Address" required value={digitalAddress} onChange={e => setDigitalAddress(e.target.value)} placeholder="e.g. GA-109-2041" />
                </div>
                <Input label="Physical Street Address / Landmarks" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Near Mensah Wood Avenue, East Legon" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="School General Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                  <Input label="General Admissions Email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Educational Stages Offered</h3>
                <div className="space-y-2">
                  {(['Creche & Nursery', 'Kindergarten', 'Primary', 'Junior High School', 'Senior High School'] as EducationLevel[]).map(lvl => (
                    <label key={lvl} className="flex items-center gap-3 p-3 rounded-xl border border-surface-border hover:bg-slate-50 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={educationLevels.includes(lvl)}
                        onChange={(e) => {
                          if (e.target.checked) setEducationLevels([...educationLevels, lvl]);
                          else setEducationLevels(educationLevels.filter(l => l !== lvl));
                        }}
                        className="rounded text-brand-navy"
                      />
                      <span>{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Academic Curriculum & Fee Guidance</h3>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-ink-primary">Curricula Taught</label>
                  {(['GES / NaCCA', 'Cambridge International', 'International Baccalaureate (IB)', 'Montessori', 'British-Ghanaian Dual'] as CurriculumType[]).map(c => (
                    <label key={c} className="flex items-center gap-3 p-2.5 rounded-lg border text-xs">
                      <input
                        type="checkbox"
                        checked={curricula.includes(c)}
                        onChange={(e) => {
                          if (e.target.checked) setCurricula([...curricula, c]);
                          else setCurricula(curricula.filter(item => item !== c));
                        }}
                        className="rounded text-brand-navy"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Input label="Min Annual Fees (GHS)" type="number" value={minFee} onChange={e => setMinFee(Number(e.target.value))} />
                  <Input label="Max Annual Fees (GHS)" type="number" value={maxFee} onChange={e => setMaxFee(Number(e.target.value))} />
                </div>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Campus Infrastructure & Facilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {['Modern Science Lab', 'ICT Innovation Suite', 'Robotics & Coding Lab', 'Swimming Pool', 'School Bus Fleet', 'Library & Media Resource Room', 'Sick Bay with Registered Nurse', 'Auditorium & Arts Studio'].map(f => (
                    <label key={f} className="flex items-center gap-2.5 p-3 rounded-lg border hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={facilities.includes(f)}
                        onChange={(e) => {
                          if (e.target.checked) setFacilities([...facilities, f]);
                          else setFacilities(facilities.filter(item => item !== f));
                        }}
                        className="rounded text-brand-navy"
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7 */}
            {step === 7 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">School Crest & Compliance Documents</h3>
                <p className="text-xs text-ink-secondary">
                  Upload your school crest (`public-media`) and GES registration certificate (`private-vault`) directly to Supabase Storage.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="p-4 border-2 border-dashed border-surface-border rounded-xl text-center space-y-2 cursor-pointer hover:bg-slate-50">
                    <Upload className="w-8 h-8 text-brand-navy mx-auto" />
                    <span className="text-xs font-bold block">Upload School Crest / Logo</span>
                    <span className="text-[11px] text-emerald-600 font-semibold block truncate">
                      {uploadingFile ? 'Uploading...' : crestUrl.includes('supabase') ? 'Uploaded to public-media' : 'Default crest ready (click to replace)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingFile(true);
                        const res = await uploadToSupabaseStorage('public-media', 'school-crests', file);
                        setUploadingFile(false);
                        if (res.ok && res.publicUrl) {
                          setCrestUrl(res.publicUrl);
                          addToast({ title: 'Crest Uploaded', message: `${file.name} uploaded to public-media.`, type: 'success' });
                        } else if (!res.ok) {
                          addToast({ title: 'Upload Notice', message: res.error || 'Sign in first to upload files.', type: 'warning' });
                        }
                      }}
                    />
                  </label>
                  <label className="p-4 border-2 border-dashed border-surface-border rounded-xl text-center space-y-2 cursor-pointer hover:bg-slate-50">
                    <FileText className="w-8 h-8 text-brand-navy mx-auto" />
                    <span className="text-xs font-bold block">GES Registration / Approval Certificate</span>
                    <span className="text-[11px] text-emerald-600 font-semibold block truncate">&bull; {gesDocPath}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingFile(true);
                        const res = await uploadToSupabaseStorage('private-vault', 'school-compliance', file);
                        setUploadingFile(false);
                        if (res.ok) {
                          setGesDocPath(res.path);
                          addToast({ title: 'Certificate Uploaded', message: `${file.name} stored securely in private-vault.`, type: 'success' });
                        } else {
                          addToast({ title: 'Upload Notice', message: res.error || 'Sign in first to upload files.', type: 'warning' });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 8 */}
            {step === 8 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Review & Confirm Submission</h3>
                <div className="bg-slate-50 p-4 rounded-xl border text-xs space-y-2 text-ink-secondary">
                  <div><strong>School:</strong> {schoolName || 'Greater Accra International School'}</div>
                  <div><strong>Locality:</strong> {locality} &bull; Digital: {digitalAddress}</div>
                  <div><strong>Levels:</strong> {educationLevels.join(', ')}</div>
                  <div><strong>Curricula:</strong> {curricula.join(', ')}</div>
                  <div><strong>Annual Fees:</strong> GHS {minFee} – GHS {maxFee}</div>
                  <div><strong>Proprietor Contact:</strong> {contactName} ({contactPhone})</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                  By clicking Submit, your application will be routed to the Super Admin review desk in demonstration state.
                </div>
              </div>
            )}

            {/* Stepper Action Buttons */}
            <div className="pt-6 border-t border-surface-border flex items-center justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" size="sm" onClick={handlePrev} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
              ) : <div />}

              {step < 8 ? (
                <Button type="button" variant="primary" size="sm" onClick={handleNext}>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button type="submit" variant="gold" size="md">
                  Submit School Application
                </Button>
              )}
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
