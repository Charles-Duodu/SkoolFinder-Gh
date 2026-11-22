import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { SchoolCard } from './SchoolCard';
import { ParentEnquiryModal } from './ParentEnquiryModal';
import { School, GreaterAccraLocality, EducationLevel, CurriculumType } from '../../types';
import { 
  Search, 
  MapPin, 
  Filter, 
  Scale, 
  RotateCcw, 
  Grid, 
  List, 
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SchoolSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useDemo();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedLocality, setSelectedLocality] = useState(searchParams.get('locality') || '');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || '');
  const [selectedCurriculum, setSelectedCurriculum] = useState(searchParams.get('curriculum') || '');
  const [selectedBoarding, setSelectedBoarding] = useState('');
  
  // Multi-select Facility Highlights
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(() => {
    const fac = searchParams.get('facility');
    return fac ? [fac] : [];
  });

  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'feeAsc' | 'feeDesc'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
    setSearchParams({});
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
            <Link to="/compare">
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
        <div className="hidden lg:block space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-surface-border h-fit sticky top-24 shadow-subtle">
          <div className="flex items-center justify-between pb-3.5 border-b border-surface-border">
            <span className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-brand-gold" />
              <span>Filter Results</span>
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider">Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, facility..."
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-surface-border rounded-xl outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-smooth"
              />
            </div>
          </div>

          {/* Locality */}
          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider">Accra Locality</label>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full py-2.5 px-3 text-xs border border-surface-border rounded-xl outline-none bg-white focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-smooth"
            >
              <option value="">All Localities</option>
              {localities.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider">Education Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full py-2.5 px-3 text-xs border border-surface-border rounded-xl outline-none bg-white focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-smooth"
            >
              <option value="">All Levels</option>
              {levels.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Curriculum */}
          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider">Curriculum</label>
            <select
              value={selectedCurriculum}
              onChange={(e) => setSelectedCurriculum(e.target.value)}
              className="w-full py-2.5 px-3 text-xs border border-surface-border rounded-xl outline-none bg-white focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-smooth"
            >
              <option value="">All Curricula</option>
              {curricula.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Boarding Type */}
          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider">Boarding Option</label>
            <select
              value={selectedBoarding}
              onChange={(e) => setSelectedBoarding(e.target.value)}
              className="w-full py-2.5 px-3 text-xs border border-surface-border rounded-xl outline-none bg-white focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-smooth"
            >
              <option value="">Any Option</option>
              <option value="Day Only">Day Only</option>
              <option value="Boarding Only">Boarding Only</option>
              <option value="Day & Boarding">Day & Boarding</option>
            </select>
          </div>

          {/* MULTI-SELECT FACILITY HIGHLIGHTS CHECKLIST */}
          <div className="pt-4 border-t border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>Facility Highlights</span>
                {selectedFacilities.length > 0 && (
                  <span className="bg-brand-gold text-brand-navy-dark text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {selectedFacilities.length}
                  </span>
                )}
              </label>
              {selectedFacilities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFacilities([])}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Clear all
                </button>
              )}
            </div>

            <p className="text-[11px] text-ink-muted">
              Select multiple facilities to narrow down schools:
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {facilityOptions.map((fac) => {
                const isChecked = selectedFacilities.includes(fac);
                return (
                  <label
                    key={fac}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all select-none ${
                      isChecked
                        ? 'bg-brand-navy/10 text-brand-navy font-bold border border-brand-navy/20 shadow-xs'
                        : 'hover:bg-slate-50 text-slate-700 font-medium border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFacility(fac)}
                      className="w-4 h-4 rounded text-brand-navy border-slate-300 accent-brand-navy focus:ring-brand-navy"
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

            <div className="flex items-center gap-2 text-xs">
              <span className="text-ink-muted">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1 px-2.5 border border-surface-border rounded-lg bg-white text-ink-primary font-medium outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="name">School Name (A-Z)</option>
                <option value="feeAsc">Fees (Lowest first)</option>
                <option value="feeDesc">Fees (Highest first)</option>
              </select>
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
            /* Cards Grid / List */
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredSchools.map((school) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  onOpenEnquiry={(s) => setEnquirySchool(s)}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-80 bg-white flex flex-col z-10 p-5 space-y-5 overflow-y-auto shadow-floating">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-bold text-sm text-brand-navy uppercase">Filter Schools</span>
              <button onClick={() => setMobileFilterOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Locality</label>
                <select value={selectedLocality} onChange={e => setSelectedLocality(e.target.value)} className="w-full border p-2 rounded-lg bg-white">
                  <option value="">All Localities</option>
                  {localities.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Education Level</label>
                <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} className="w-full border p-2 rounded-lg bg-white">
                  <option value="">All Levels</option>
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-2 uppercase">Facilities Checklist</label>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {facilityOptions.map(f => (
                    <label key={f} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.includes(f)}
                        onChange={() => toggleFacility(f)}
                        className="rounded text-brand-navy"
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button variant="primary" className="w-full justify-center" onClick={() => setMobileFilterOpen(false)}>
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
