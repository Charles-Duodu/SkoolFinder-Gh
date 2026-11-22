import React, { useState } from 'react';
import { School, EducationLevel } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { 
  CheckCircle2, 
  FileText, 
  Upload, 
  User, 
  Calendar, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface StudentAdmissionModalProps {
  school: School;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentAdmissionModal: React.FC<StudentAdmissionModalProps> = ({ school, isOpen, onClose }) => {
  const { state, submitAdmissionApplication, setRole } = useDemo();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Student
  const [studentName, setStudentName] = useState('Nana Yaw Mensah');
  const [dob, setDob] = useState('2015-04-12');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [targetLevel, setTargetLevel] = useState<EducationLevel>(school.educationLevels[0] || 'Junior High School');
  const [targetTerm, setTargetTerm] = useState<'Term 1 (September)' | 'Term 2 (January)' | 'Term 3 (May)'>('Term 1 (September)');
  const [targetYear] = useState(2026);
  const [previousSchool, setPreviousSchool] = useState('North Ridge Preparatory School');
  const [specialNeeds, setSpecialNeeds] = useState('None');

  // Step 2: Parent / Guardian
  const [parentName, setParentName] = useState(state.parent.fullName || 'Ama Mensah');
  const [parentEmail, setParentEmail] = useState(state.parent.email || 'ama.mensah.accra@gmail.com');
  const [parentPhone, setParentPhone] = useState(state.parent.phone || '+233 24 551 2290');
  const [digitalAddress, setDigitalAddress] = useState('GA-183-9021');
  const [relationship, setRelationship] = useState('Mother');

  // Step 3: Documents
  const [attachedDocs, setAttachedDocs] = useState<string[]>([
    'Primary Terminal Assessment Report.pdf',
    'Official Birth Certificate.pdf',
    'Ghana Card Guardian Copy.pdf',
    'Passport Photograph.jpg'
  ]);
  const [declarationAgreed, setDeclarationAgreed] = useState(true);
  const [submittedAppId, setSubmittedAppId] = useState('');

  const toggleDoc = (docName: string) => {
    setAttachedDocs(prev => 
      prev.includes(docName) 
        ? prev.filter(d => d !== docName) 
        : [...prev, docName]
    );
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep((step + 1) as any);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    submitAdmissionApplication({
      schoolId: school.id,
      schoolName: school.name,
      schoolLocality: school.locality,
      parentName,
      parentEmail,
      parentPhone,
      studentName,
      dateOfBirth: dob,
      gender,
      targetLevel,
      targetTerm,
      targetYear,
      digitalAddress,
      previousSchool,
      specialNeeds: specialNeeds === 'None' ? undefined : specialNeeds,
      documentsAttached: attachedDocs,
    });
    setSubmittedAppId(`ADM-${Math.floor(100000 + Math.random() * 900000)}`);
    setStep(4);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 4 ? "Application Submitted" : `Admission Application — ${school.name}`}
      maxWidth="2xl"
    >
      {/* Wizard Progress Stepper */}
      {step !== 4 && (
        <div className="mb-6 border-b border-surface-border pb-4">
          <div className="flex items-center justify-between max-w-md mx-auto text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-brand-navy font-bold' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step > 1 ? 'bg-emerald-500 text-white' : step === 1 ? 'bg-brand-navy text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span>Student Bio</span>
            </div>

            <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-brand-navy' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-brand-navy font-bold' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step > 2 ? 'bg-emerald-500 text-white' : step === 2 ? 'bg-brand-navy text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span>Guardian</span>
            </div>

            <div className={`h-0.5 w-12 ${step >= 3 ? 'bg-brand-navy' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-brand-navy font-bold' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 3 ? 'bg-brand-navy text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </div>
              <span>Records</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Student Information */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-900">
            <GraduationCap className="w-5 h-5 text-brand-navy shrink-0" />
            <div>
              <span className="font-bold">Applying to {school.name}</span>
              <p className="text-slate-600 text-[11px]">{school.locality} &bull; {school.curricula.join(', ')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student's Full Legal Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Nana Yaw Mensah"
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-navy"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">Target Education Stage</label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-navy"
              >
                {school.educationLevels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">Entry Academic Term</label>
              <select
                value={targetTerm}
                onChange={(e) => setTargetTerm(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-navy"
              >
                <option value="Term 1 (September)">Term 1 (September 2026)</option>
                <option value="Term 2 (January)">Term 2 (January 2027)</option>
                <option value="Term 3 (May)">Term 3 (May 2027)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current / Previous School Attended"
              value={previousSchool}
              onChange={(e) => setPreviousSchool(e.target.value)}
              placeholder="e.g. North Ridge Preparatory School"
            />
            <Input
              label="Special Learning or Medical Considerations"
              value={specialNeeds}
              onChange={(e) => setSpecialNeeds(e.target.value)}
              placeholder="e.g. Mild asthmatic, allergies, none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-surface-border">
            <Button variant="primary" onClick={handleNextStep} icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Guardian Info
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Parent / Guardian Information */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Parent / Guardian Full Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">Relationship to Child</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-navy"
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Legal Guardian">Legal Guardian</option>
                <option value="Sponsor">Sponsor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Phone Number (Ghana +233)"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="+233 24 000 0000"
              required
            />
            <Input
              label="Email Address (For Assessment Notice & Status)"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GhanaPost GPS Digital Address"
              value={digitalAddress}
              onChange={(e) => setDigitalAddress(e.target.value)}
              placeholder="e.g. GA-183-9021"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">Residential Suburb</label>
              <input
                type="text"
                readOnly
                value="East Legon, Greater Accra"
                className="w-full text-xs p-2.5 border border-surface-border rounded-lg bg-slate-50 text-slate-700 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-surface-border">
            <Button variant="outline" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNextStep} icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Academic Records
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Documents & Declaration */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider mb-2">
              Required Admission Enclosures (Simulated Uploads)
            </h4>
            <p className="text-xs text-ink-secondary mb-3">
              Standard Ghana private school admissions require the following verifications:
            </p>

            <div className="space-y-2">
              {[
                'Primary Terminal Assessment Report.pdf',
                'Official Birth Certificate.pdf',
                'Ghana Card Guardian Copy.pdf',
                'Child Immunisation & Clinic Record.pdf',
                'Passport Photograph.jpg'
              ].map(doc => {
                const isChecked = attachedDocs.includes(doc);
                return (
                  <label
                    key={doc}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDoc(doc)}
                        className="rounded text-brand-navy accent-brand-navy"
                      />
                      <FileText className={`w-4 h-4 ${isChecked ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span className={`font-semibold ${isChecked ? 'text-emerald-950' : 'text-slate-700'}`}>
                        {doc}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {isChecked ? 'Ready to send' : 'Click to attach'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationAgreed}
                onChange={(e) => setDeclarationAgreed(e.target.checked)}
                className="mt-0.5 rounded text-brand-navy accent-brand-navy"
              />
              <span className="text-xs text-amber-950 leading-relaxed">
                <strong>Parent Declaration:</strong> I hereby certify that the information entered is accurate and that records submitted reflect the legitimate academic history of the applicant under Ghana Education Service guidelines.
              </span>
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-surface-border">
            <Button variant="outline" onClick={() => setStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="gold"
              onClick={handleSubmit}
              disabled={!declarationAgreed || attachedDocs.length === 0}
              icon={<CheckCircle2 className="w-4 h-4 text-brand-navy-dark" />}
            >
              Submit Application
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Confirmation State */}
      {step === 4 && (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-ink-primary">Admission Application Lodged!</h3>
            <p className="text-xs text-ink-secondary">
              Your application for <strong className="text-ink-primary">{studentName}</strong> has been received by <strong className="text-brand-navy">{school.name}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-surface-border rounded-2xl max-w-sm mx-auto text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tracking Reference:</span>
              <strong className="font-mono text-brand-navy">{submittedAppId}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Stage:</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                Under Review
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Target Entry:</span>
              <span className="font-semibold text-slate-800">{targetLevel} ({targetTerm})</span>
            </div>
          </div>

          <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
            The school's admissions coordinator will evaluate the attached academic records and dispatch an invitation for diagnostic entrance assessment or interview.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleClose();
                setRole('parent');
              }}
            >
              View in Parents Portal
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
