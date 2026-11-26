'use client';

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';
import { SafeguardingCase } from '../../types';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus 
} from 'lucide-react';

export const SafeguardingCasesPage: React.FC = () => {
  const { state, updateCaseStatus } = useDemo();
  const [selectedCase, setSelectedCase] = useState<SafeguardingCase | null>(null);
  const [newNote, setNewNote] = useState('');

  const handleUpdate = (status: SafeguardingCase['status']) => {
    if (!selectedCase) return;
    updateCaseStatus(selectedCase.id, status);
    setSelectedCase(prev => prev ? { ...prev, status } : null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
              <ShieldAlert className="w-4 h-4" />
              <span>Safeguarding, Trust & Complaints Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary mt-1">
              Case Triage & Child Safety Governance
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Confidential incident logging, verification flags, and parent dispute resolution protocols.
            </p>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b font-bold text-ink-muted uppercase">
                <th className="p-4">Case Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Involved Entity</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {state.cases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="p-4">
                    <strong className="text-sm font-bold text-ink-primary block">{c.title}</strong>
                    <span className="text-[10px] text-ink-secondary">Logged: {formatDate(c.reportedAt)}</span>
                  </td>
                  <td className="p-4 font-semibold text-ink-secondary">{c.category}</td>
                  <td className="p-4">
                    <span className="font-bold text-brand-navy">{c.entityName}</span>
                    <span className="text-[10px] text-ink-muted block uppercase">({c.entityType})</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                      c.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedCase(c)}>
                      Investigate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Case Investigation Modal */}
      <Modal isOpen={Boolean(selectedCase)} onClose={() => setSelectedCase(null)} title={`Safeguarding Case: ${selectedCase?.id}`} maxWidth="lg">
        {selectedCase && (
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-brand-navy uppercase">{selectedCase.category}</span>
                <span className="font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">{selectedCase.severity} Severity</span>
              </div>
              <h3 className="text-sm font-bold text-ink-primary">{selectedCase.title}</h3>
              <p className="text-ink-secondary">{selectedCase.summary}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider block">Case Investigation Audit Log:</span>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border">
                {selectedCase.notes.map((note, i) => (
                  <p key={i} className="text-ink-secondary">&bull; {note}</p>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-100 rounded-xl space-y-2">
              <span className="font-bold uppercase tracking-wider block">Simulate Resolution Action:</span>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={() => handleUpdate('Investigating')}>
                  Set to Investigating
                </Button>
                <Button variant="gold" size="sm" onClick={() => handleUpdate('Action Required')}>
                  Escalate Action
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleUpdate('Resolved')}>
                  Mark Resolved
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={() => setSelectedCase(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>

    </AdminLayout>
  );
};
