'use client';

import React from 'react';
import Link from 'next/link';
import { School } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { formatGHS } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { 
  MapPin, 
  BookOpen, 
  Users, 
  Scale, 
  Bookmark, 
  Check, 
  ExternalLink,
  Building
} from 'lucide-react';

interface SchoolCardProps {
  school: School;
  onOpenEnquiry?: (school: School) => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onOpenEnquiry }) => {
  const { state, toggleSaveSchool, toggleCompareSchool } = useDemo();
  const [coverError, setCoverError] = React.useState(false);
  const [crestError, setCrestError] = React.useState(false);

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

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl overflow-hidden shadow-glass hover:shadow-glass-hover flex flex-col group relative">
      
      {/* Cover Image & Badges */}
      <div className="relative h-44 sm:h-48 w-full bg-gradient-to-br from-brand-navy-dark via-brand-navy to-slate-900 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <StatusBadge status={school.verificationStatus} />
          
          <button
            onClick={() => toggleSaveSchool(school.id)}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-brand-gold text-brand-navy-dark shadow-sm'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save School'}
            aria-label="Save School"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* School Crest & Name in Image Banner */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
          {!crestError ? (
            <img
              src={school.crestUrl}
              alt={`${school.name} crest`}
              onError={() => setCrestError(true)}
              className="w-12 h-12 rounded-xl object-cover bg-white/95 backdrop-blur-md p-0.5 border-2 border-white shadow-md shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-brand-navy-dark/90 backdrop-blur-md border-2 border-brand-gold flex items-center justify-center text-brand-gold font-black text-sm shadow-md shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1 text-white">
            <h3 className="text-base font-bold truncate leading-tight drop-shadow-sm">
              {school.name}
            </h3>
            <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
              <span className="truncate">{school.locality}, Greater Accra</span>
            </p>
          </div>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Curricula & Levels */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap gap-1.5">
            {school.curricula.map((curr) => (
              <span
                key={curr}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg text-blue-900 border border-blue-200/60 bg-blue-50/70 backdrop-blur-xs shadow-2xs"
              >
                {curr}
              </span>
            ))}
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg text-slate-700 border border-slate-200/60 bg-white/60 backdrop-blur-xs shadow-2xs">
              {school.boardingStatus}
            </span>
          </div>

          <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
            {school.tagline || school.aboutText}
          </p>
        </div>

        {/* Highlight Specs */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/60 text-xs text-ink-secondary">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-brand-navy" />
            <span>Ratio: <strong className="text-ink-primary font-semibold">{school.studentTeacherRatio}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-brand-navy" />
            <span>Levels: <strong className="text-ink-primary font-semibold">{school.educationLevels.length}</strong></span>
          </div>
          <div className="col-span-2 flex items-center justify-between text-xs pt-1">
            <span className="text-ink-muted">Annual Fees:</span>
            <span className="font-bold text-brand-navy">
              {formatGHS(school.annualFeeRange.min)} – {formatGHS(school.annualFeeRange.max)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <Link href={`/schools/${school.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full justify-center bg-white/70 backdrop-blur-sm border-white/80 hover:bg-white/95 shadow-xs">
              View Profile
            </Button>
          </Link>
          
          <button
            onClick={() => toggleCompareSchool(school.id)}
            className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center justify-center shrink-0 backdrop-blur-sm shadow-xs ${
              isCompared
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'border-slate-200/70 bg-white/70 hover:bg-white text-ink-secondary'
            }`}
            title={isCompared ? 'Remove from Comparison' : 'Add to Compare'}
          >
            <Scale className="w-4 h-4" />
          </button>

          {onOpenEnquiry && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => onOpenEnquiry(school)}
              className="shrink-0 shadow-xs"
            >
              Enquire
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};
