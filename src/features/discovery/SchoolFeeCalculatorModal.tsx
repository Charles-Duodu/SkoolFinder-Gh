import React, { useState } from 'react';
import { School, EducationLevel } from '../../types';
import { formatGHS } from '../../lib/utils';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Calculator, CheckCircle2, DollarSign, Bus, Utensils, Shirt, Cpu, Download, ArrowRight } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

interface SchoolFeeCalculatorModalProps {
  school: School;
  isOpen: boolean;
  onClose: () => void;
  onApplyClick?: () => void;
}

export const SchoolFeeCalculatorModal: React.FC<SchoolFeeCalculatorModalProps> = ({
  school,
  isOpen,
  onClose,
  onApplyClick
}) => {
  const { addToast } = useDemo();
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(school.educationLevels[0] || 'Primary');
  
  // Base termly tuition based on school annual range and level weight
  const getLevelWeight = (lvl: EducationLevel) => {
    switch (lvl) {
      case 'Creche & Nursery': return 0.85;
      case 'Kindergarten': return 0.90;
      case 'Primary': return 1.0;
      case 'Junior High School': return 1.20;
      case 'Senior High School': return 1.45;
      default: return 1.0;
    }
  };

  const baseAnnual = (school.annualFeeRange.min + school.annualFeeRange.max) / 2;
  const baseTermTuition = Math.round((baseAnnual / 3) * getLevelWeight(selectedLevel));

  // Add-ons
  const [lunchPlan, setLunchPlan] = useState<'none' | 'standard' | 'premium'>('standard');
  const [busRoute, setBusRoute] = useState<'none' | 'zoneA' | 'zoneB' | 'zoneC'>('zoneA');
  const [includeUniform, setIncludeUniform] = useState(true);
  const [includeStem, setIncludeStem] = useState(true);
  const [siblingDiscount, setSiblingDiscount] = useState<'0' | '10' | '15'>('0');

  // Pricing values (GHS)
  const lunchCost = lunchPlan === 'none' ? 0 : lunchPlan === 'standard' ? 1500 : 2200;
  const busCost = busRoute === 'none' ? 0 : busRoute === 'zoneA' ? 1400 : busRoute === 'zoneB' ? 2100 : 2900;
  const uniformAnnualCost = includeUniform ? 950 : 0;
  const stemCost = includeStem ? 650 : 0;

  // Sibling discount applies to tuition
  const discountPercent = parseInt(siblingDiscount, 10);
  const discountAmount = Math.round((baseTermTuition * discountPercent) / 100);
  const netTuition = baseTermTuition - discountAmount;

  const termlyTotal = netTuition + lunchCost + busCost + stemCost;
  const annualTotal = (termlyTotal * 3) + uniformAnnualCost;

  // Foreign currency rates (Indicative)
  const ghsPerUsd = 15.5;
  const ghsPerGbp = 19.8;
  const annualUsd = Math.round(annualTotal / ghsPerUsd);
  const annualGbp = Math.round(annualTotal / ghsPerGbp);

  const handleExportEstimate = () => {
    addToast({
      title: 'Fee Estimate Downloaded',
      message: `Provisional fee breakdown schedule for ${school.name} saved as PDF.`,
      type: 'success'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`School Fee & Affordability Calculator — ${school.name}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        
        {/* Intro Banner */}
        <div className="p-3.5 bg-brand-navy/5 border border-brand-navy/15 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand-gold shrink-0" />
            <span className="font-semibold text-brand-navy">
              Calibrated for Greater Accra Academic Year 2026 / 2027
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink-muted">Locality: {school.locality}</span>
        </div>

        {/* Inputs Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column: Grade & Sibling */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                Education Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white outline-none focus:ring-2 focus:ring-brand-navy font-semibold text-brand-navy"
              >
                {school.educationLevels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                Sibling Concession / Discount
              </label>
              <select
                value={siblingDiscount}
                onChange={(e) => setSiblingDiscount(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white outline-none"
              >
                <option value="0">Single Child (Standard Rate)</option>
                <option value="10">2nd Child Enrolled (10% Tuition Discount)</option>
                <option value="15">3rd Child Enrolled (15% Tuition Discount)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                School Bus Transit Route
              </label>
              <select
                value={busRoute}
                onChange={(e) => setBusRoute(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white outline-none"
              >
                <option value="none">Self Drop-off / Parent Transit (GHS 0)</option>
                <option value="zoneA">Zone A: Suburb Local &bull; 0-5 km (GHS 1,400 / term)</option>
                <option value="zoneB">Zone B: Mid-distance e.g. Spintex/Madina &bull; 5-15 km (GHS 2,100 / term)</option>
                <option value="zoneC">Zone C: Cross-city e.g. Tema/Dansoman &bull; 15+ km (GHS 2,900 / term)</option>
              </select>
            </div>
          </div>

          {/* Right Column: Auxiliary Add-ons */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                Meal & Nutrition Catering Plan
              </label>
              <select
                value={lunchPlan}
                onChange={(e) => setLunchPlan(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white outline-none"
              >
                <option value="none">Packed Lunch from Home (GHS 0)</option>
                <option value="standard">Standard Hot Lunch & Fruit (GHS 1,500 / term)</option>
                <option value="premium">Full Breakfast, Snack & Chef's Lunch (GHS 2,200 / term)</option>
              </select>
            </div>

            <div className="pt-1 space-y-2">
              <label className="text-xs font-bold text-ink-primary block uppercase tracking-wider">
                Mandatory & Supplemental Levies
              </label>
              
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-surface-border bg-slate-50 text-xs cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeStem}
                    onChange={(e) => setIncludeStem(e.target.checked)}
                    className="rounded text-brand-navy accent-brand-navy"
                  />
                  <span>Robotics, Coding & STEM Lab Levy</span>
                </div>
                <span className="font-semibold text-brand-navy">GHS 650 / term</span>
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-surface-border bg-slate-50 text-xs cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeUniform}
                    onChange={(e) => setIncludeUniform(e.target.checked)}
                    className="rounded text-brand-navy accent-brand-navy"
                  />
                  <span>Full Uniform Set & Sports Kits (Annual)</span>
                </div>
                <span className="font-semibold text-brand-navy">GHS 950 once</span>
              </label>
            </div>
          </div>

        </div>

        {/* Live Calculation Output Card */}
        <div className="bg-gradient-to-br from-brand-navy to-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs text-white/70 uppercase tracking-wider font-semibold">
                Estimated Termly Outlay ({selectedLevel})
              </span>
              <p className="text-3xl font-extrabold text-brand-gold mt-0.5">
                {formatGHS(termlyTotal)}
                <span className="text-xs text-white/70 font-normal ml-1.5">/ academic term</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-white/70 uppercase tracking-wider font-semibold">
                Full 3-Term Academic Year
              </span>
              <p className="text-2xl font-bold text-white mt-0.5">
                {formatGHS(annualTotal)}
              </p>
              <p className="text-[11px] text-white/60 font-mono">
                &asymp; ${annualUsd.toLocaleString()} USD &bull; &pound;{annualGbp.toLocaleString()} GBP
              </p>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-white/60 block text-[11px]">Tuition (Net)</span>
              <strong className="text-white text-sm">{formatGHS(netTuition)}</strong>
              {discountPercent > 0 && (
                <span className="text-[10px] text-emerald-400 block">-{discountPercent}% sibling</span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-white/60 block text-[11px]">Lunch Catering</span>
              <strong className="text-white text-sm">{formatGHS(lunchCost)}</strong>
            </div>

            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-white/60 block text-[11px]">Bus Service</span>
              <strong className="text-white text-sm">{formatGHS(busCost)}</strong>
            </div>

            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-white/60 block text-[11px]">STEM & Uniforms</span>
              <strong className="text-white text-sm">{formatGHS(stemCost + Math.round(uniformAnnualCost / 3))}</strong>
            </div>
          </div>

          <div className="text-[11px] text-white/60 italic pt-1">
            Note: Actual fees may vary slightly based on candidate diagnostic placement, elective foreign languages, and international exam council registration fees (Cambridge/IB).
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportEstimate}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download Schedule PDF
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {onApplyClick && (
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  onClose();
                  onApplyClick();
                }}
                icon={<ArrowRight className="w-3.5 h-3.5 text-brand-navy-dark" />}
              >
                Proceed to Online Admission
              </Button>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};
