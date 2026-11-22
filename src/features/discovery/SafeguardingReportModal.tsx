import React, { useState } from 'react';
import { School, SafeguardingCase } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldAlert, CheckCircle2, Lock, FileWarning, EyeOff, AlertTriangle } from 'lucide-react';

interface SafeguardingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedSchool?: School;
}

export const SafeguardingReportModal: React.FC<SafeguardingReportModalProps> = ({
  isOpen,
  onClose,
  preselectedSchool
}) => {
  const { state, submitSafeguardingReport } = useDemo();
  const [submitted, setSubmitted] = useState(false);
  const [caseReference, setCaseReference] = useState('');

  // Form states
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  const [entityType, setEntityType] = useState<'School' | 'Professional' | 'Parent'>('School');
  const [entityName, setEntityName] = useState(preselectedSchool ? preselectedSchool.name : state.schools[0]?.name || 'Achimota Preparatory');
  const [category, setCategory] = useState<SafeguardingCase['category']>('Safety Concern');
  const [severity, setSeverity] = useState<SafeguardingCase['severity']>('Medium');
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentSummary, setIncidentSummary] = useState('');
  const [incidentDate, setIncidentDate] = useState('2026-05-18');
  const [evidenceAttached, setEvidenceAttached] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim() || !incidentSummary.trim()) return;

    submitSafeguardingReport({
      title: incidentTitle,
      category,
      entityType,
      entityName,
      severity,
      summary: incidentSummary,
      reporterName: isAnonymous ? undefined : reporterName,
      reporterContact: isAnonymous ? undefined : reporterContact
    });

    const ref = `SAFE-${Math.floor(100000 + Math.random() * 900000)}`;
    setCaseReference(ref);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setIncidentTitle('');
    setIncidentSummary('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={submitted ? "Safeguarding Report Lodged" : "Confidential Child Safeguarding & Incident Desk"}
      maxWidth="2xl"
    >
      {submitted ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-ink-primary">Confidential Incident Lodged</h3>
            <p className="text-xs text-ink-secondary">
              Reference Code: <strong className="font-mono text-brand-navy">#{caseReference}</strong>
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl max-w-md mx-auto text-xs text-amber-950 space-y-2 text-left">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Whistleblower & Child Protection Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              This case has been logged securely into the SkoolFinder Ghana National Governance Desk. All records are restricted to verified compliance ombudsmen and the Ghana Education Service safeguarding liaison team.
            </p>
          </div>

          <Button variant="primary" onClick={handleResetAndClose}>
            Close Report
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Security & Whistleblower Notice */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-950">
            <ShieldAlert className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Confidential & Protected Reporting</span>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                SkoolFinder maintains a strict zero-retaliation safeguarding desk. You may choose to report entirely anonymously or leave verified contact details for our child welfare officers.
              </p>
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="p-3 bg-slate-50 border border-surface-border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <EyeOff className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-ink-primary">Report Anonymously?</span>
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-brand-navy accent-brand-navy"
              />
              <span className="text-slate-600 font-medium">
                {isAnonymous ? 'Yes (Identity Concealed)' : 'No (Provide Info)'}
              </span>
            </label>
          </div>

          {/* Attributed Details (if not anonymous) */}
          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-surface-border rounded-xl bg-slate-50/50">
              <Input
                label="Your Full Name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Ama Mensah"
                required
              />
              <Input
                label="Contact Phone or Email"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="+233 24 ... or email"
                required
              />
            </div>
          )}

          {/* Target Institution / Entity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                Target Category / Entity
              </label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white outline-none"
              >
                <option value="School">School / Educational Institution</option>
                <option value="Professional">Teacher / School Staff</option>
                <option value="Parent">Parent / Transport Provider</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                Target School / Institution
              </label>
              <select
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white outline-none font-semibold text-brand-navy"
              >
                {state.schools.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.locality})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Classification & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                Incident Classification
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white outline-none"
              >
                <option value="Safety Concern">Safety & Facility Concern</option>
                <option value="Disciplinary Escalation">Disciplinary Escalation</option>
                <option value="Health & Sanitation">Health & Sanitation</option>
                <option value="Bullying">Bullying & Student Welfare</option>
                <option value="Staff Conduct">Teacher / Staff Conduct</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white outline-none font-bold"
              >
                <option value="Low">Low (Informational / Minor)</option>
                <option value="Medium">Medium (Administrative Review)</option>
                <option value="High">High (Immediate Risk / Harm)</option>
                <option value="Critical">Critical (Emergency / Police / GES)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                Date of Occurrence
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white outline-none"
              />
            </div>
          </div>

          {/* Title & Description */}
          <Input
            label="Brief Subject / Headline"
            value={incidentTitle}
            onChange={(e) => setIncidentTitle(e.target.value)}
            placeholder="e.g. Unsafe bus transit drop-off along Legon bypass"
            required
          />

          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
              Detailed Narrative & Factual Overview
            </label>
            <textarea
              rows={4}
              value={incidentSummary}
              onChange={(e) => setIncidentSummary(e.target.value)}
              placeholder="State chronological facts, witnesses, specific locations on campus, and any actions taken so far..."
              className="w-full text-xs p-3 border border-surface-border rounded-xl outline-none focus:ring-2 focus:ring-brand-navy resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-surface-border bg-slate-50 text-xs">
            <span className="text-slate-600 font-medium">Attach Photos / Written Statements (Simulated)</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={evidenceAttached}
                onChange={(e) => setEvidenceAttached(e.target.checked)}
                className="rounded text-brand-navy accent-brand-navy"
              />
              <span className="font-semibold text-brand-navy">IncidentEvidence.pdf</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <Button variant="outline" type="button" onClick={handleResetAndClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              type="submit"
              icon={<AlertTriangle className="w-4 h-4 text-white" />}
            >
              Submit Confidential Report
            </Button>
          </div>

        </form>
      )}
    </Modal>
  );
};
