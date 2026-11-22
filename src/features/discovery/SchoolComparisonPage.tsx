import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { formatGHS } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Scale, X, Plus, Check, ArrowLeft, ExternalLink, Bookmark, Calculator } from 'lucide-react';
import { SchoolFeeCalculatorModal } from './SchoolFeeCalculatorModal';
import { School } from '../../types';

export const SchoolComparisonPage: React.FC = () => {
  const { state, toggleCompareSchool } = useDemo();
  const [calculatorSchool, setCalculatorSchool] = useState<School | null>(null);
  const comparedIds = state.parent.comparisonSchoolIds;
  const comparedSchools = state.schools.filter(s => comparedIds.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
            <Scale className="w-4 h-4" />
            <span>Interactive Decision Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary mt-1">
            Compare Greater Accra Private Schools
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Evaluate curricula, annual fees, teacher ratios, and infrastructure side-by-side (up to 4 institutions).
          </p>
        </div>

        <Link to="/schools">
          <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />}>
            Add More Schools
          </Button>
        </Link>
      </div>

      {comparedSchools.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-surface-border space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-ink-muted mx-auto">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-ink-primary">No Schools in Comparison Yet</h2>
          <p className="text-xs text-ink-secondary">
            Click the "Compare" scale icon on any school card in the directory to add institutions to this side-by-side matrix.
          </p>
          <Link to="/schools">
            <Button variant="gold" size="sm">
              Browse Schools Directory
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-border shadow-subtle overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/70">
                <th className="p-4 w-1/4 text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Attribute
                </th>
                {comparedSchools.map((s) => (
                  <th key={s.id} className="p-4 w-1/4 text-xs font-semibold text-ink-primary align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={s.crestUrl}
                          alt={s.name}
                          className="w-8 h-8 rounded-lg object-cover bg-white border border-surface-border shrink-0"
                        />
                        <div className="min-w-0">
                          <Link to={`/schools/${s.slug}`} className="font-bold text-xs hover:text-brand-navy truncate block">
                            {s.name}
                          </Link>
                          <span className="text-[10px] text-ink-secondary">{s.locality}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCompareSchool(s.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-xs">
              
              {/* Locality */}
              <tr>
                <td className="p-4 font-bold text-ink-primary bg-slate-50/30">Locality</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4 text-ink-secondary">{s.locality}, Greater Accra</td>
                ))}
              </tr>

              {/* Curricula */}
              <tr>
                <td className="p-4 font-bold text-ink-primary bg-slate-50/30">Curriculum</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {s.curricula.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Education Levels */}
              <tr>
                <td className="p-4 font-bold text-ink-primary bg-slate-50/30">Levels Offered</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4 text-ink-secondary">
                    {s.educationLevels.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Published Annual Fee Band */}
              <tr>
                <td className="p-4 font-bold text-ink-primary bg-slate-50/30">Annual Fee Band</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4 font-bold text-brand-navy">
                    {formatGHS(s.annualFeeRange.min)} – {formatGHS(s.annualFeeRange.max)}
                  </td>
                ))}
              </tr>

              {/* Student-Teacher Ratio */}
              <tr>
                <td className="p-4 font-bold text-ink-primary bg-slate-50/30">Student-Teacher Ratio</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4 font-semibold text-ink-primary">{s.studentTeacherRatio}</td>
                ))}
              </tr>

              {/* Class Size */}
              <tr>
                <td className="p-4 font-bold text-ink-primary bg-slate-50/30">Average Class Size</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4 text-ink-secondary">{s.averageClassSize} students</td>
                ))}
              </tr>

              {/* Boarding Status */}
              <tr>
                <td className="p-4 font-bold text-ink-primary bg-slate-50/30">Boarding Options</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4 text-ink-secondary">{s.boardingStatus}</td>
                ))}
              </tr>

              {/* Facilities */}
              <tr>
                <td className="p-4 font-bold text-ink-primary bg-slate-50/30">Key Facilities</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4 text-ink-secondary space-y-1">
                    {s.facilities.slice(0, 4).map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* Verification Status */}
              <tr>
                <td className="p-4 font-bold text-ink-primary bg-slate-50/30">Platform Verification</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4">
                    <StatusBadge status={s.verificationStatus} />
                  </td>
                ))}
              </tr>

              {/* Actions row */}
              <tr className="bg-slate-50/50">
                <td className="p-4 font-bold text-ink-primary">Decision Actions</td>
                {comparedSchools.map(s => (
                  <td key={s.id} className="p-4 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCalculatorSchool(s)}
                      className="w-full justify-center text-xs"
                      icon={<Calculator className="w-3.5 h-3.5 text-brand-navy" />}
                    >
                      Calculate Fees
                    </Button>
                    <Link to={`/schools/${s.slug}`} className="block">
                      <Button variant="primary" size="sm" className="w-full justify-center text-xs">
                        View Full Profile
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>

          {calculatorSchool && (
            <SchoolFeeCalculatorModal
              school={calculatorSchool}
              isOpen={Boolean(calculatorSchool)}
              onClose={() => setCalculatorSchool(null)}
            />
          )}
        </div>
      )}

    </div>
  );
};
