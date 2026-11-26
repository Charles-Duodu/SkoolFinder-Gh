'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { SchoolCard } from './SchoolCard';
import { ParentEnquiryModal } from './ParentEnquiryModal';
import { AccraLocalityMap } from './AccraLocalityMap';
import { School, GreaterAccraLocality, EducationLevel, CurriculumType } from '../../types';
import { 
  Search, 
  MapPin, 
  Filter, 
  Scale, 
  RotateCcw, 
  Grid, 
  List, 
  Map as MapIcon,
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SchoolSearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state } = useDemo();

  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [selectedLocality, setSelectedLocality] = useState(searchParams?.get('locality') || '');
  const [selectedLevel, setSelectedLevel] = useState(searchParams?.get('level') || '');
  const [selectedCurriculum, setSelectedCurriculum] = useState(searchParams?.get('curriculum') || '');
  const [selectedBoarding, setSelectedBoarding] = useState('');
  
  // Multi-select Facility Highlights
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(() => {
    const fac = searchParams?.get('facility');
    return fac ? [fac] : [];
  });

  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'feeAsc' | 'feeDesc'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [enquirySchool, setEnquirySchool] = useState<School | null>(null);

  const localities: GreaterAccraLocality[] = [
    'East Legon', 'Cantonments', 'Airport Residential', 'Osu', 'Tema',
    'Spintex', 'Achimota', 'Dansoman', 'Madina', 'Adenta', 'Ridge'
  ];

  const levels: EducationLevel[] = [
    'Creche & Nursery', 'Kindergarten', 'Primary', 'Junior High School', 'Senior High School'
  ];

  const curricula: CurriculumType[] = [
    'GES / NaCCA', 'Cambridge International', 'International Baccalaureate (IB)', 'Montessori', 'British-Ghanaian Dual'
  ];

  const facilityOptions = [
    'Modern Science Lab',
    'ICT Innovation Suite',
    'Robotics & Coding Lab',
    'Swimming Pool',
    'School Bus Fleet',
    'Library & Media Resource Room',
    'Sports Complex',
    'Sick Bay',
    'Air-conditioned',
    'Boarding Hostels',
    'French Language',
    'Montessori Prepared'
  ];

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  // Filtering Logic
  const filteredSchools = useMemo(() => {
    return state.schools.filter((s) => {
      // Search term
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesTag = s.tagline.toLowerCase().includes(q);
        const matchesLoc = s.locality.toLowerCase().includes(q);
        const matchesCurr = s.curricula.some(c => c.toLowerCase().includes(q));
        if (!matchesName && !matchesTag && !matchesLoc && !matchesCurr) return false;
      }
      // Locality
      if (selectedLocality && s.locality !== selectedLocality) return false;
      // Level
      if (selectedLevel && !s.educationLevels.includes(selectedLevel as EducationLevel)) return false;
      // Curriculum
      if (selectedCurriculum && !s.curricula.includes(selectedCurriculum as CurriculumType)) return false;
      // Boarding
      if (selectedBoarding && s.boardingStatus !== selectedBoarding) return false;
      // Multi-selected Facilities (matches if school contains all selected facilities)
      if (selectedFacilities.length > 0) {
        const matchesAllFacilities = selectedFacilities.every(sel =>
          s.facilities.some(f => f.toLowerCase().includes(sel.toLowerCase()))
        );
        if (!matchesAllFacilities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'feeAsc') return a.annualFeeRange.min - b.annualFeeRange.min;
      if (sortBy === 'feeDesc') return b.annualFeeRange.max - a.annualFeeRange.max;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [state.schools, query, selectedLocality, selectedLevel, selectedCurriculum, selectedBoarding, selectedFacilities, sortBy]);

  const handleClearFilters = () => {
    setQuery('');
    setSelectedLocality('');
    setSelectedLevel('');
    setSelectedCurriculum('');
    setSelectedBoarding('');
    setSelectedFacilities([]);
    router.push('/schools');
  };

  const hasActiveFilters = Boolean(
    query || selectedLocality || selectedLevel || selectedCurriculum || selectedBoarding || selectedFacilities.length > 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary">
            Greater Accra Private Schools Directory
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Showing <strong className="text-ink-primary font-bold">{filteredSchools.length}</strong> verified private institutions
          </p>
        </div>

        {/* View mode & Compare shortcut */}
        <div className="flex items-center gap-3">
          {state.parent.comparisonSchoolIds.length > 0 && (
            <Link href="/compare">
              <Button variant="gold" size="sm" icon={<Scale className="w-4 h-4 text-brand-navy-dark" />}>
                Compare ({state.parent.comparisonSchoolIds.length})
              </Button>
            </Link>
          )}

          <div className="hidden sm:flex items-center border border-surface-border rounded-lg p-0.5 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100 text-brand-navy' : 'text-ink-muted'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-100 text-brand-navy' : 'text-ink-muted'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-surface-border rounded-lg text-xs font-semibold bg-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && `(${selectedFacilities.length ? `${selectedFacilities.length} facilities` : 'Active'})`}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Search Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block space-y-5 bg-[#0B1E36] p-5 sm:p-6 rounded-3xl border border-slate-700/80 h-fit sticky top-24 shadow-2xl relative overflow-hidden text-slate-100">
          {/* Top specular highlight edge */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span>Filter Results</span>
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-amber-400/90 hover:text-amber-300 hover:underline flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, facility..."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#0e223b] text-white placeholder-slate-400 border border-slate-700 rounded-xl outline-none focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/30 transition-smooth"
              />
            </div>
          </div>

          {/* Locality */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Accra Locality</label>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-[#0e223b] text-white border border-slate-700 rounded-xl outline-none focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/30 transition-smooth"
            >
              <option value="" className="bg-[#0B1E36] text-white">All Localities</option>
              {localities.map(l => (
                <option key={l} value={l} className="bg-[#0B1E36] text-white">{l}</option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Education Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-[#0e223b] text-white border border-slate-700 rounded-xl outline-none focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/30 transition-smooth"
            >
              <option value="" className="bg-[#0B1E36] text-white">All Levels</option>
              {levels.map(l => (
                <option key={l} value={l} className="bg-[#0B1E36] text-white">{l}</option>
              ))}
            </select>
          </div>

          {/* Curriculum */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Curriculum</label>
            <select
              value={selectedCurriculum}
              onChange={(e) => setSelectedCurriculum(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-[#0e223b] text-white border border-slate-700 rounded-xl outline-none focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/30 transition-smooth"
            >
              <option value="" className="bg-[#0B1E36] text-white">All Curricula</option>
              {curricula.map(c => (
                <option key={c} value={c} className="bg-[#0B1E36] text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Boarding Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Boarding Option</label>
            <select
              value={selectedBoarding}
              onChange={(e) => setSelectedBoarding(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-[#0e223b] text-white border border-slate-700 rounded-xl outline-none focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/30 transition-smooth"
            >
              <option value="" className="bg-[#0B1E36] text-white">Any Option</option>
              <option value="Day Only" className="bg-[#0B1E36] text-white">Day Only</option>
              <option value="Boarding Only" className="bg-[#0B1E36] text-white">Boarding Only</option>
              <option value="Day & Boarding" className="bg-[#0B1E36] text-white">Day & Boarding</option>
            </select>
          </div>

          {/* MULTI-SELECT FACILITY HIGHLIGHTS CHECKLIST */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Facility Highlights</span>
                {selectedFacilities.length > 0 && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    {selectedFacilities.length}
                  </span>
                )}
              </label>
              {selectedFacilities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFacilities([])}
                  className="text-xs text-slate-400 hover:text-amber-400 hover:underline font-semibold transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Select multiple facilities to narrow down schools:
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {facilityOptions.map((fac) => {
                const isChecked = selectedFacilities.includes(fac);
                return (
                  <label
                    key={fac}
                    className={`flex items-center gap-2.5 transition-all select-none cursor-pointer ${
                      isChecked
                        ? 'bg-[#0078D4] text-white font-bold border-l-4 border-amber-400 rounded-r-xl rounded-l-none pl-3 pr-2.5 py-2.5 shadow-md'
                        : 'hover:bg-white/5 text-slate-300 font-medium border-l-4 border-transparent rounded-xl p-2.5'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFacility(fac)}
                      className="w-4 h-4 rounded text-[#0078D4] border-slate-600 bg-[#0e223b] accent-amber-400 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="flex-1 text-[13px] leading-tight">{fac}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Sorting and result metrics bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-surface-border shadow-subtle">
            <span className="text-xs text-ink-secondary">
              Showing <strong className="text-ink-primary">{filteredSchools.length}</strong> results in Greater Accra
            </span>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-ink-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-1 px-2.5 border border-surface-border rounded-lg bg-white text-ink-primary font-medium outline-none text-xs"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="feeAsc">Fees (Lowest)</option>
                  <option value="feeDesc">Fees (Highest)</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 border border-surface-border rounded-lg p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-md text-xs transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-brand-navy shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  title="List View"
                  className={`p-1.5 rounded-md text-xs transition-colors ${
                    viewMode === 'list' ? 'bg-white text-brand-navy shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  title="Accra Locality Map"
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
                    viewMode === 'map' ? 'bg-brand-navy text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-brand-gold" />
                  <span>Accra Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-muted">Active:</span>
              {query && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-brand-navy/10 text-brand-navy">
                  Query: {query}
                  <button onClick={() => setQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedLocality && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-brand-navy/10 text-brand-navy">
                  {selectedLocality}
                  <button onClick={() => setSelectedLocality('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedLevel && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-brand-navy/10 text-brand-navy">
                  {selectedLevel}
                  <button onClick={() => setSelectedLevel('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCurriculum && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-brand-navy/10 text-brand-navy">
                  {selectedCurriculum}
                  <button onClick={() => setSelectedCurriculum('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedFacilities.map(fac => (
                <span key={fac} className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-navy font-semibold border border-brand-gold/40">
                  <Sparkles className="w-3 h-3 text-brand-gold shrink-0" />
                  {fac}
                  <button onClick={() => toggleFacility(fac)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredSchools.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-surface-border space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-ink-muted mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">No Matching Schools Found</h3>
              <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                We couldn't find any schools matching your current filter selections. Try unchecking some facility highlights or broadening your location.
              </p>
              <div>
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Reset All Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Locality Map Display when in Map View Mode */}
              {viewMode === 'map' && (
                <AccraLocalityMap
                  schools={filteredSchools}
                  selectedLocality={selectedLocality}
                  onSelectLocality={(loc) => setSelectedLocality(loc)}
                />
              )}

              {/* Cards Grid / List */}
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredSchools.map((school) => (
                  <SchoolCard
                    key={school.id}
                    school={school}
                    onOpenEnquiry={(s) => setEnquirySchool(s)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-80 bg-[#0B1E36] text-slate-100 border-r border-slate-800 flex flex-col z-10 p-5 space-y-5 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-extrabold text-sm text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span>Filter Schools</span>
              </span>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1 uppercase tracking-wider text-[11px]">Locality</label>
                <select 
                  value={selectedLocality} 
                  onChange={e => setSelectedLocality(e.target.value)} 
                  className="w-full bg-[#0e223b] text-white border border-slate-700 p-2.5 rounded-xl outline-none focus:border-[#0078D4]"
                >
                  <option value="" className="bg-[#0B1E36]">All Localities</option>
                  {localities.map(l => <option key={l} value={l} className="bg-[#0B1E36]">{l}</option>)}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1 uppercase tracking-wider text-[11px]">Education Level</label>
                <select 
                  value={selectedLevel} 
                  onChange={e => setSelectedLevel(e.target.value)} 
                  className="w-full bg-[#0e223b] text-white border border-slate-700 p-2.5 rounded-xl outline-none focus:border-[#0078D4]"
                >
                  <option value="" className="bg-[#0B1E36]">All Levels</option>
                  {levels.map(l => <option key={l} value={l} className="bg-[#0B1E36]">{l}</option>)}
                </select>
              </div>

              <div>
                <label className="font-bold text-amber-400 block mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Facilities Checklist</span>
                </label>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {facilityOptions.map(f => {
                    const isChecked = selectedFacilities.includes(f);
                    return (
                      <label 
                        key={f} 
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked 
                            ? 'bg-[#0078D4] text-white font-bold border-l-4 border-amber-400 pl-2.5' 
                            : 'hover:bg-white/5 text-slate-300 font-medium'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFacility(f)}
                          className="rounded text-[#0078D4] accent-amber-400 bg-[#0e223b] border-slate-600"
                        />
                        <span className="text-xs">{f}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button variant="gold" className="w-full justify-center text-slate-950 font-bold" onClick={() => setMobileFilterOpen(false)}>
                  Apply ({filteredSchools.length} Results)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parent Enquiry Modal */}
      <ParentEnquiryModal
        school={enquirySchool}
        isOpen={Boolean(enquirySchool)}
        onClose={() => setEnquirySchool(null)}
      />

    </div>
  );
};
