import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { SchoolCard } from './SchoolCard';
import { ParentEnquiryModal } from './ParentEnquiryModal';
import { School, GreaterAccraLocality, EducationLevel, CurriculumType } from '../../types';
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  BookOpen,
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  School as SchoolIcon, 
  Briefcase, 
  Truck, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useDemo();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('');
  const [enquirySchool, setEnquirySchool] = useState<School | null>(null);

  // Hero Rotational Floating Slides
  const heroSlides = [
    {
      image: '/images/hero-1.jpg',
      alt: 'Ghanaian teacher and early-grade pupils learning and building with wooden blocks',
      tagline: 'Early Childhood & Foundation Learning'
    },
    {
      image: '/images/hero-2.jpg',
      alt: 'Students engaged in learning at modern library and innovation resource centre',
      tagline: 'Modern Science & Innovation Labs'
    },
    {
      image: '/images/hero-3.jpg',
      alt: 'Dedicated teacher guiding engaged classroom students',
      tagline: 'Vetted Teachers & Holistic Education'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const featuredSchools = state.schools.filter(s => s.featured || s.verificationStatus === 'approved').slice(0, 4);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedLocality) params.set('locality', selectedLocality);
    if (selectedLevel) params.set('level', selectedLevel);
    if (selectedCurriculum) params.set('curriculum', selectedCurriculum);
    navigate(`/schools?${params.toString()}`);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      
      {/* SECTION 2: HERO & PRIMARY SCHOOL SEARCH WITH ROTATIONAL FLOATING IMAGES */}
      <section 
        className="relative overflow-hidden bg-brand-navy-dark text-white pt-16 pb-20 lg:pt-24 lg:pb-28"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Rotational Floating Background Images with Ken-Burns Motion */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {heroSlides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className={`w-full h-full object-cover transform transition-transform duration-[8000ms] ease-out ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            );
          })}

          {/* Calibrated Blue Overlay for high visual appeal and accessibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#091B2E]/80 via-[#0D243F]/70 to-[#071526]/85" />
          
          {/* Subtle radiant ambient highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Carousel Slide Chevron Controls */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white items-center justify-center backdrop-blur-sm border border-white/10 transition-all hover:scale-105"
          title="Previous Image"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white items-center justify-center backdrop-blur-sm border border-white/10 transition-all hover:scale-105"
          title="Next Image"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Hero Headlines */}
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/15 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Greater Accra's Dedicated Private Education Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              Find the <span className="text-amber-400 drop-shadow">Right School</span> for Your Child
            </h1>

            <p className="text-sm sm:text-lg text-slate-100 font-medium max-w-2xl mx-auto drop-shadow-sm leading-relaxed">
              Compare private schools across Accra and Tema—all in one place.
            </p>
          </div>

          {/* Floating Glassmorphic Search Bar Card */}
          <div className="mt-8 max-w-5xl mx-auto bg-[#0B1E36]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white/20 shadow-floating text-left">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
              
              {/* Suburb / Locality */}
              <div className="lg:col-span-4">
                <label className="block text-[11px] font-black text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>SUBURB / LOCALITY</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    placeholder="e.g. Cantonments, East Legon, Spintex..."
                    list="hero-localities-list"
                    className="w-full px-3.5 py-3 text-sm text-white bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-xl outline-none placeholder:text-slate-300 transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                  />
                  <datalist id="hero-localities-list">
                    {localities.map(loc => <option key={loc} value={loc} />)}
                  </datalist>
                </div>
              </div>

              {/* School Level */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-black text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                  <span>SCHOOL LEVEL</span>
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm text-white bg-[#0f2846] border border-white/20 rounded-xl outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 cursor-pointer"
                >
                  <option value="" className="bg-[#0B1E36] text-white">All Levels (Crèche to SHS)</option>
                  {levels.map(lvl => (
                    <option key={lvl} value={lvl} className="bg-[#0B1E36] text-white">{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Curriculum */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-black text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                  <span>CURRICULUM</span>
                </label>
                <select
                  value={selectedCurriculum}
                  onChange={(e) => setSelectedCurriculum(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm text-white bg-[#0f2846] border border-white/20 rounded-xl outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 cursor-pointer"
                >
                  <option value="" className="bg-[#0B1E36] text-white">All Curricula</option>
                  {curricula.map(curr => (
                    <option key={curr} value={curr} className="bg-[#0B1E36] text-white">{curr}</option>
                  ))}
                </select>
              </div>

              {/* Search Schools Button */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group hover:shadow-amber-400/30 hover:scale-[1.02]"
                >
                  <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Search Schools</span>
                </button>
              </div>

            </form>

            {/* Quick-tap popular Accra suburbs */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-bold text-amber-400">Popular Suburbs:</span>
              {['East Legon', 'Cantonments', 'Tema', 'Spintex', 'Achimota', 'Airport Residential'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => navigate(`/schools?locality=${encodeURIComponent(loc)}`)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-medium"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {heroSlides.map((slide, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-9 h-2.5 bg-amber-400 rounded-full shadow-md'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70 rounded-full'
                }`}
                title={`Slide ${idx + 1}: ${slide.tagline}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Trust Highlights */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center text-xs text-slate-200">
            <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Verified Institution Records</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Transparent Published Fees</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Direct Admissions Enquiries</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Multi-School Comparison</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED SCHOOLS DISCOVERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-gold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Accra Exemplary Institutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary mt-1">
              Featured Private Schools
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Explore leading institutions known for academic rigour, modern facilities, and sound values.
            </p>
          </div>
          <Link to="/schools" className="flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-navy-light group">
            <span>Browse All {state.schools.length} Schools</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSchools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              onOpenEnquiry={(s) => setEnquirySchool(s)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4: OUR EDUCATION ECOSYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-brand-gold uppercase tracking-wider">
            Interconnected Education SaaS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary mt-1">
            One Connected Education Ecosystem
          </h2>
          <p className="text-sm text-ink-secondary mt-2">
            Beyond school search, SkoolFinder bridges the four key pillars of Ghanaian private education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Parents */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Parents & Guardians</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Shortlist schools, compare curricula, monitor admissions deadlines, and communicate directly with admission teams.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/parents/dashboard">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Open Parent Portal
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: Schools */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <SchoolIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Schools & Proprietors</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Gain verified visibility, manage parent enquiries, recruit licensed teachers, and procure equipment via RFQs.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/school-owners">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  School Owners Hub
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 3: Teachers */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Teachers & Specialists</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Showcase NTC credentials, discover verified teaching vacancies in Accra, and offer specialized tutoring services.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/professionals">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Explore Careers
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 4: Suppliers */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Suppliers & Vendors</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                List education products across 14 categories, discover school tenders and RFQs, and submit competitive bids.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/suppliers">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Supplier Portal
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 & 6: HOW IT WORKS */}
      <section className="bg-slate-50 py-16 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
              How SkoolFinder Works for Parents
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Find, evaluate, and connect in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="bg-white rounded-2xl p-6 border border-surface-border relative text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-navy text-brand-gold font-bold flex items-center justify-center mx-auto text-base">
                1
              </div>
              <h3 className="text-base font-bold text-ink-primary">Search & Filter</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Filter by your neighborhood (East Legon, Tema, Dansoman, etc.), preferred curriculum (GES, Cambridge, IB), and education level.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-surface-border relative text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-navy text-brand-gold font-bold flex items-center justify-center mx-auto text-base">
                2
              </div>
              <h3 className="text-base font-bold text-ink-primary">Compare Side-by-Side</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Review fee structures, student-teacher ratios, transport services, boarding facilities, and past examination performance.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-surface-border relative text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-navy text-brand-gold font-bold flex items-center justify-center mx-auto text-base">
                3
              </div>
              <h3 className="text-base font-bold text-ink-primary">Contact Admissions</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Send an immediate digital inquiry to the school registrar or book a campus walk-through directly through the platform.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-navy rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
              Are you a School Proprietor or Administrator?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Give your institution the visibility it deserves across Greater Accra.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Join dozens of private schools in Accra showcasing their academic standards, publishing vacancies, and connecting with prospective families.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/school-owners/register">
              <Button variant="gold" size="lg" className="w-full justify-center">
                Register Your School
              </Button>
            </Link>
            <Link to="/schools">
              <Button variant="outline" size="lg" className="w-full justify-center border-slate-600 text-white hover:bg-white/10">
                Explore Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Parent Enquiry Modal */}
      <ParentEnquiryModal
        school={enquirySchool}
        isOpen={Boolean(enquirySchool)}
        onClose={() => setEnquirySchool(null)}
      />

    </div>
  );
};
