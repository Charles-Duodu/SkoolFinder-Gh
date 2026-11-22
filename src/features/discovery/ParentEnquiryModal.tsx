import React, { useState } from 'react';
import { School, EducationLevel } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { CheckCircle2, Send, ShieldAlert } from 'lucide-react';

interface ParentEnquiryModalProps {
  school: School | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ParentEnquiryModal: React.FC<ParentEnquiryModalProps> = ({
  school,
  isOpen,
  onClose
}) => {
  const { submitEnquiry, state } = useDemo();
  const parent = state.parent;

  const [parentName, setParentName] = useState(parent.fullName || '');
  const [parentEmail, setParentEmail] = useState(parent.email || '');
  const [parentPhone, setParentPhone] = useState(parent.phone || '');
  const [targetLevel, setTargetLevel] = useState<EducationLevel>(school?.educationLevels[0] || 'Junior High School');
  const [subject, setSubject] = useState('Admission & Enrollment Inquiry for 2026/2027');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!school) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;

    submitEnquiry({
      schoolId: school.id,
      schoolName: school.name,
      parentName,
      parentEmail,
      parentPhone,
      childTargetLevel: targetLevel,
      subject,
      message
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={submitted ? 'Enquiry Submitted' : `Send Admission Enquiry`}
      description={submitted ? undefined : `Direct communication to ${school.name}`}
      maxWidth="md"
    >
      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-ink-primary">Simulated Enquiry Delivered!</h3>
            <p className="text-xs text-ink-secondary max-w-sm mx-auto">
              Your inquiry has been stored in your Parent Dashboard. Switch to the <strong>School Proprietor</strong> persona anytime to test reviewing and responding to this message.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" onClick={handleReset} className="w-full justify-center">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
            <span className="font-bold text-blue-700 uppercase tracking-wider text-[10px] mt-0.5">Note:</span>
            <span>This is an interactive prototype. No real personal data is transmitted outside your browser.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Parent / Guardian Name"
              required
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="e.g. Ama Mensah"
            />
            <Input
              label="Contact Phone Number"
              required
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="e.g. +233 24 551 2290"
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            required
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            placeholder="e.g. ama.mensah@gmail.com"
          />

          <Select
            label="Child's Target Level"
            value={targetLevel}
            onChange={(e) => setTargetLevel(e.target.value as EducationLevel)}
          >
            {school.educationLevels.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </Select>

          <Input
            label="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-ink-primary mb-1.5 uppercase tracking-wider">
              Your Message or Questions
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the admissions officer about your child, questions on bus routes, entry diagnostic dates, or special requirements..."
              className="w-full rounded-lg border border-surface-border p-3 text-sm focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 rounded text-brand-navy focus:ring-brand-navy"
            />
            <label htmlFor="consent" className="text-xs text-ink-secondary">
              I agree to share this contact inquiry with the admissions office of {school.name}.
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleReset}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              disabled={!consent || !parentName || !message}
              icon={<Send className="w-4 h-4 text-brand-navy-dark" />}
            >
              Submit Enquiry
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
