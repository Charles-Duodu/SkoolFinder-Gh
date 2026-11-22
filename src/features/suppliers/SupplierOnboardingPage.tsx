import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { SupplierCategory, GreaterAccraLocality, VerificationStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Clock 
} from 'lucide-react';

export const SupplierOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addSupplier, setRole } = useDemo();

  const [step, setStep] = useState(1);
  const [submittedStatus, setSubmittedStatus] = useState<VerificationStatus | null>(null);

  // Form State
  const [businessName, setBusinessName] = useState('Accra Educational Supplies & Stationery Ltd');
  const [regNumber, setRegNumber] = useState('CS-44129-2016');
  const [category, setCategory] = useState<SupplierCategory>('Stationery & Books');
  const [locality, setLocality] = useState<GreaterAccraLocality>('Osu');
  const [address, setAddress] = useState('Oxford Street Commercial Complex, Osu, Accra');
  const [phone, setPhone] = useState('+233 30 279 8812');
  const [email, setEmail] = useState('tenders@accraedusupplies.com.gh');
  const [description, setDescription] = useState('Premier supplier of GES & Cambridge certified exercise books, textbooks, teacher supplies, and STEM lab consumables across Greater Accra private schools.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier({
      businessName,
      registrationNumber: regNumber,
      category,
      additionalCategories: ['ICT & Software', 'Science Lab Equipment'],
      logoUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=160&auto=format&fit=crop&q=80',
      locality,
      address,
      phone,
      email,
      description,
      coverageAreas: ['Accra Central', 'East Legon', 'Tema', 'Dansoman', 'Spintex', 'Achimota'],
      products: [
        {
          id: `prd-${Date.now()}`,
          title: 'Customized School Exercise Books (Bulk)',
          category: 'Stationery & Books',
          description: 'Hardback and softback branded exercise books with school crest.',
          indicativePriceGHS: 6.50,
          unit: 'per copy'
        }
      ]
    });

    setSubmittedStatus('under_review');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary">
          Supplier & Vendor Registration
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary">
          Join the Greater Accra educational vendor registry to bid on school RFQs
        </p>
      </div>

      {submittedStatus ? (
        <div className="bg-white rounded-2xl p-8 border border-surface-border shadow-elevated space-y-6 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <StatusBadge status={submittedStatus} className="text-sm px-3 py-1" />
            <h2 className="text-xl font-bold text-ink-primary">Vendor Profile Submitted</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Your business registry details are queued for verification in the Super Admin Applications Centre.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border space-y-3 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Prototype Actions:</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  setRole('supplier');
                  navigate('/suppliers/dashboard');
                }}
                className="w-full justify-center"
              >
                Open Supplier Workspace
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRole('super_admin');
                  navigate('/super-admin/approvals');
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
                <h3 className="text-base font-bold text-ink-primary">Business Entity Details</h3>
                <Input label="Registered Business Name" required value={businessName} onChange={e => setBusinessName(e.target.value)} />
                <Input label="Registrar General Department (RGD) Number" required value={regNumber} onChange={e => setRegNumber(e.target.value)} />
                <Select label="Primary Supply Category" value={category} onChange={e => setCategory(e.target.value as any)}>
                  <option value="Stationery & Books">Stationery & Books</option>
                  <option value="ICT & Software">ICT & Software</option>
                  <option value="School Furniture">School Furniture</option>
                  <option value="Student Transport">Student Transport</option>
                  <option value="Science Lab Equipment">Science Lab Equipment</option>
                  <option value="Catering & Food Services">Catering & Food Services</option>
                </Select>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Location & Contact Coordinates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Locality" value={locality} onChange={e => setLocality(e.target.value as any)} />
                  <Input label="Direct Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <Input label="Physical Commercial Address" value={address} onChange={e => setAddress(e.target.value)} />
                <Input label="Tender & Business Email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-ink-primary">Company Profile & Verification Documents</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase">Business Description</label>
                  <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg p-3 text-sm focus:border-brand-navy outline-none" />
                </div>
                <div className="p-4 border-2 border-dashed rounded-xl text-center space-y-1">
                  <FileText className="w-6 h-6 text-brand-navy mx-auto" />
                  <span className="text-xs font-bold block">Simulated RGD Business Registration Certificate</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">&bull; RGD_Certificate_Incorporation.pdf attached</span>
                </div>
              </div>
            )}

            <div className="pt-6 border-t flex items-center justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setStep(step - 1)}>Back</Button>
              ) : <div />}

              {step < 3 ? (
                <Button type="button" variant="primary" size="sm" onClick={() => setStep(step + 1)}>Continue</Button>
              ) : (
                <Button type="submit" variant="gold" size="md">Submit Supplier Registration</Button>
              )}
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
