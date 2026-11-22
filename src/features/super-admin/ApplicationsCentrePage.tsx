import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';
import { VerificationStatus } from '../../types';
import { 
  CheckSquare, 
  School, 
  Briefcase, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  FileText 
} from 'lucide-react';

export const ApplicationsCentrePage: React.FC = () => {
  const { state, updateSchoolStatus, updateProfessionalStatus, updateSupplierStatus } = useDemo();
  
  const [filterType, setFilterType] = useState<'all' | 'school' | 'professional' | 'supplier'>('all');
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    type: 'school' | 'professional' | 'supplier';
    name: string;
    locality: string;
    status: VerificationStatus;
    details: string;
  } | null>(null);

  // Consolidate review items
  const items = [
    ...state.schools.map(s => ({
      id: s.id,
      type: 'school' as const,
      name: s.name,
      locality: s.locality,
      status: s.verificationStatus,
      details: `${s.curricula.join(', ')} &bull; Established: ${s.yearEstablished} &bull; Dig Address: ${s.digitalAddress}`
    })),
    ...state.professionals.map(p => ({
      id: p.id,
      type: 'professional' as const,
      name: p.fullName,
      locality: p.locality,
      status: p.verificationStatus,
      details: `${p.title} &bull; License: ${p.ntcLicenseNumber || 'Pending'} &bull; Exp: ${p.yearsOfExperience} yrs`
    })),
    ...state.suppliers.map(sup => ({
      id: sup.id,
      type: 'supplier' as const,
      name: sup.businessName,
      locality: sup.locality,
      status: sup.verificationStatus,
      details: `${sup.category} &bull; RGD: ${sup.registrationNumber} &bull; Phone: ${sup.phone}`
    }))
  ].filter(i => {
    if (filterType === 'all') return true;
    return i.type === filterType;
  });

  const handleDecision = (newStatus: VerificationStatus) => {
    if (!selectedItem) return;

    if (selectedItem.type === 'school') {
      updateSchoolStatus(selectedItem.id, newStatus);
    } else if (selectedItem.type === 'professional') {
      updateProfessionalStatus(selectedItem.id, newStatus);
    } else if (selectedItem.type === 'supplier') {
      updateSupplierStatus(selectedItem.id, newStatus);
    }

    setSelectedItem(prev => prev ? { ...prev, status: newStatus } : null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
              <CheckSquare className="w-4 h-4" />
              <span>Applications & Approvals Centre</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary mt-1">
              Institutional & Professional Vetting Queue
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Simulate approval decisions with immediate reactive state propagation throughout the platform.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['all', 'school', 'professional', 'supplier'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterType === f ? 'bg-white text-ink-primary shadow-sm' : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Verification Table */}
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-surface-border font-bold text-ink-muted uppercase tracking-wider">
                <th className="p-4">Entity Name & Sector</th>
                <th className="p-4">Accra Zone</th>
                <th className="p-4">Key Credentials</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {items.map(item => (
                <tr key={`${item.type}-${item.id}`} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        item.type === 'school' ? 'bg-amber-100 text-amber-800' :
                        item.type === 'professional' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.type === 'school' ? <School className="w-4 h-4" /> :
                         item.type === 'professional' ? <Briefcase className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-ink-primary block">{item.name}</strong>
                        <span className="text-[10px] uppercase font-bold text-ink-muted">{item.type}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-ink-secondary">{item.locality}</td>
                  
                  <td className="p-4 text-ink-secondary" dangerouslySetInnerHTML={{ __html: item.details }} />

                  <td className="p-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                      icon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Inspect / Decide
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* INSPECTION & DECISION MODAL */}
      <Modal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        title={`Review Application: ${selectedItem?.name}`}
        maxWidth="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-muted uppercase">{selectedItem.type} Record</span>
                <StatusBadge status={selectedItem.status} />
              </div>
              <p><strong>Entity Name:</strong> {selectedItem.name}</p>
              <p><strong>Locality:</strong> {selectedItem.locality}, Greater Accra</p>
              <p><strong>Credentials:</strong> <span dangerouslySetInnerHTML={{ __html: selectedItem.details }} /></p>
            </div>

            {/* Simulated Compliance Attachments */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-ink-primary uppercase tracking-wider block">
                Submitted Verification Evidence (Simulated)
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border rounded-xl flex items-center gap-2.5 bg-slate-50">
                  <FileText className="w-5 h-5 text-brand-navy shrink-0" />
                  <div className="min-w-0">
                    <strong className="block truncate">Gov_Registration_Cert.pdf</strong>
                    <span className="text-[10px] text-emerald-600 font-bold">&bull; Valid Hash</span>
                  </div>
                </div>
                <div className="p-3 border rounded-xl flex items-center gap-2.5 bg-slate-50">
                  <FileText className="w-5 h-5 text-brand-navy shrink-0" />
                  <div className="min-w-0">
                    <strong className="block truncate">Official_Premises_Clearance.pdf</strong>
                    <span className="text-[10px] text-emerald-600 font-bold">&bull; Inspected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Simulation Controls */}
            <div className="p-4 bg-slate-100 rounded-xl space-y-3">
              <span className="text-xs font-bold text-ink-primary uppercase tracking-wider block">
                Simulate Administrative Decision:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDecision('approved')}
                  className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Verify</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision('corrections_requested')}
                  className="py-2.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Request Fixes</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision('rejected')}
                  className="py-2.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Record</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setSelectedItem(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </AdminLayout>
  );
};
