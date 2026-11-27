'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { School } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { formatGHS } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ParentAuthModal } from '../auth/ParentAuthModal';
import { 
  MapPin, 
  Scale, 
  Bookmark, 
  Check, 
  Building
} from 'lucide-react';

interface SchoolCardProps {
  school: School;
  onOpenEnquiry?: (school: School) => void;
  variant?: 'grid' | 'list';
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, variant = 'list' }) => {
  const { role, isAuthenticated, state, toggleSaveSchool, toggleCompareSchool } = useDemo();
  const [coverError, setCoverError] = useState(false);
  const [crestError, setCrestError] = useState(false);

  // Parent Auth Modal state for gated interactions
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<'save' | 'compare' | null>(null);

  const isSaved = state.parent.savedSchoolIds.includes(school.id);
  const isCompared = state.parent.comparisonSchoolIds.includes(school.id);

  // Fallback monogram for school crest
  const initials = school.name
    .split(' ')
    .filter(w => !['and', '&', 'of', 'the'].includes(w.toLowerCase()))
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  // Handlers enforcing account requirement for Compare and Save
  const handleCompareClick = () => {
    if (!isAuthenticated || role === 'guest') {
      setAuthModalReason('Please create a free parent account to compare schools side-by-side.');
      setPendingAction('compare');
      setAuthModalOpen(true);
      return;
    }
    toggleCompareSchool(school.id);
  };

  const handleSaveClick = () => {
    if (!isAuthenticated || role === 'guest') {
      setAuthModalReason('Please create a free parent account to save schools to your personal shortlist.');
      setPendingAction('save');
      setAuthModalOpen(true);
      return;
    }
    toggleSaveSchool(school.id);
  };

  const handleAuthSuccess = () => {
    if (pendingAction === 'compare') {
      toggleCompareSchool(school.id);
    } else if (pendingAction === 'save') {
      toggleSaveSchool(school.id);
    }
    setPendingAction(null);
  };

  return (
    <>
      <div className={`glass-panel glass-panel-hover rounded-3xl overflow-hidden shadow-glass hover:shadow-glass-hover flex ${variant === 'list' ? 'flex-col md:flex-row' : 'flex-col'} group relative bg-white border border-slate-200/80`}>
        
        {/* Cover Image & Badges */}
        <div className={`relative ${variant === 'list' ? 'h-48 md:h-auto md:w-72 lg:w-80 shrink-0 min-h-[220px]' : 'h-44 sm:h-48 w-full'} bg-gradient-to-br from-brand-navy-dark via-brand-navy to-slate-900 overflow-hidden`}>
          {!coverError ? (
            <img
              src={school.coverImageUrl}
              alt={school.name}
              onError={() => setCoverError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-brand-navy-dark via-brand-navy to-slate-800 flex items-center justify-center p-6 text-center">
              <Building className="w-12 h-12 text-brand-gold/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top Verification Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <StatusBadge status={school.verificationStatus} />
          </div>

          {/* School Crest Corner */}
          <div className="absolute bottom-3 left-3">
            {!crestError ? (
              <img
                src={school.crestUrl}
                alt={`${school.name} crest`}
                onError={() => setCrestError(true)}
                className="w-11 h-11 rounded-xl object-cover bg-white/95 backdrop-blur-md p-0.5 border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-brand-navy-dark/90 backdrop-blur-md border-2 border-brand-gold flex items-center justify-center text-brand-gold font-black text-xs shadow-md">
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Card Body - Matching Requested Layout */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            {/* Row 1: School Name & Locality */}
            <div className="flex items-start justify-between gap-2.5">
              <Link href={`/schools/${school.slug}`} className="hover:text-blue-700 transition-colors">
                <h3 className="text-base sm:text-lg font-bold text-[#0B1E36] tracking-tight leading-snug">
                  {school.name}
                </h3>
              </Link>
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1 shrink-0 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{school.locality}, Greater Accra</span>
              </div>
            </div>

            {/* Row 2: Tagline / About text */}
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {school.tagline || school.aboutText}
            </p>

            {/* Row 3: Filter Badges / Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {school.educationLevels.map((lvl) => (
                <span
                  key={lvl}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50/80 text-blue-700 border border-blue-200/50"
                >
                  {lvl}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50/80 text-blue-700 border border-blue-200/50">
                {school.boardingStatus || 'Day school'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50/80 text-blue-700 border border-blue-200/50">
                {school.gender === 'Co-educational' ? 'Mixed intake' : school.gender || 'Mixed intake'}
              </span>
              {school.curricula.map((curr) => (
                <span
                  key={curr}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50/80 text-blue-700 border border-blue-200/50"
                >
                  {curr}
                </span>
              ))}
              {school.annualFeeRange?.min ? (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/70">
                  Term fee: {formatGHS(Math.round(school.annualFeeRange.min / 3))} – {formatGHS(Math.round(school.annualFeeRange.max / 3))}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/70">
                  Term fee not provided
                </span>
              )}
            </div>
          </div>

          <div>
            <hr className="border-slate-100 my-3" />

            {/* Row 4: The 3 Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Button 1: View school details (Available for guests and parents alike) */}
              <Link
                href={`/schools/${school.slug}`}
                className="px-3.5 py-2.5 bg-[#0B1E36] hover:bg-[#132c4d] text-white font-bold text-xs rounded-lg transition-all shadow-2xs text-center inline-block cursor-pointer"
              >
                View school details
              </Link>

              {/* Button 2: Add to compare (Requires free parent account) */}
              <button
                type="button"
                onClick={handleCompareClick}
                className={`px-3.5 py-2.5 font-bold text-xs rounded-lg transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                  isCompared
                    ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
                    : 'bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white'
                }`}
              >
                {isCompared ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>✓ Added to compare</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-3.5 h-3.5" />
                    <span>+ Add to compare</span>
                  </>
                )}
              </button>

              {/* Button 3: Save school (Requires free parent account) */}
              <button
                type="button"
                onClick={handleSaveClick}
                className={`px-3.5 py-2.5 font-bold text-xs rounded-lg transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                  isSaved
                    ? 'bg-[#0B1E36] text-amber-400 border border-amber-400/40'
                    : 'bg-[#0B1E36] hover:bg-[#132c4d] text-white'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>✓ Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save school</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Parent Auth Modal Triggered when Guest Clicks Compare or Save */}
      <ParentAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="sign-up"
        promptReason={authModalReason}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};
