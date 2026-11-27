'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { SchoolCard } from './SchoolCard';
import { ParentEnquiryModal } from './ParentEnquiryModal';
import { ParentAuthModal } from '../auth/ParentAuthModal';
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
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Check,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HomePage: React.FC = () => {
  const router = useRouter();
  const { state } = useDemo();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('');
  const [enquirySchool, setEnquirySchool] = useState<School | null>(null);
  const [parentAuthModalOpen, setParentAuthModalOpen] = useState(false);
  const [parentAuthMode, setParentAuthMode] = useState<'sign-up' | 'sign-in'>('sign-up');

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
    router.push(`/schools?${params.toString()}`);
  };

  return (
    <div className="space-y-12 lg:space-y-16 pb-12 lg:pb-16">
      
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
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              Find the <span className="text-amber-400 drop-shadow">Right School</span> for Your Child
            </h1>

            <p className="text-sm sm:text-lg text-slate-100 font-medium max-w-2xl mx-auto drop-shadow-sm leading-relaxed">
              Compare private schools across Accra and Tema—all in one place.
            </p>
          </div>

          {/* Floating Glassmorphic Search Bar Card */}
          <div className="mt-8 max-w-5xl mx-auto glass-panel-dark rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/25 shadow-2xl text-left relative overflow-hidden">
            {/* Top specular highlight edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end relative z-10">
              
              {/* Suburb / Locality */}
              <div className="lg:col-span-4">
                <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
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
                    className="w-full px-3.5 py-3 text-sm text-slate-900 bg-white/95 backdrop-blur-md border border-white/90 rounded-xl outline-none placeholder:text-slate-400 font-medium transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 shadow-xs"
                  />
                  <datalist id="hero-localities-list">
                    {localities.map(loc => <option key={loc} value={loc} />)}
                  </datalist>
                </div>
              </div>

              {/* School Level */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                  <span>SCHOOL LEVEL</span>
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm text-slate-900 bg-white/95 backdrop-blur-md border border-white/90 rounded-xl outline-none font-medium transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 cursor-pointer shadow-xs"
                >
                  <option value="" className="bg-white text-slate-900">All Levels (Crèche to SHS)</option>
                  {levels.map(lvl => (
                    <option key={lvl} value={lvl} className="bg-white text-slate-900">{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Curriculum */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                  <span>CURRICULUM</span>
                </label>
                <select
                  value={selectedCurriculum}
                  onChange={(e) => setSelectedCurriculum(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm text-slate-900 bg-white/95 backdrop-blur-md border border-white/90 rounded-xl outline-none font-medium transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 cursor-pointer shadow-xs"
                >
                  <option value="" className="bg-white text-slate-900">All Curricula</option>
                  {curricula.map(curr => (
                    <option key={curr} value={curr} className="bg-white text-slate-900">{curr}</option>
                  ))}
                </select>
              </div>

              {/* Search Schools Button */}
              <div className="lg:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap group hover:shadow-amber-400/30 hover:scale-[1.02]"
                >
                  <span className="text-base leading-none">🔍</span>
                  <span className="whitespace-nowrap font-bold">Search Schools</span>
                </button>
              </div>

            </form>
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
        </div>
      </section>

      {/* SECTION 3: FEATURED SCHOOLS DISCOVERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge text-xs font-bold text-amber-700 uppercase tracking-wider shadow-2xs mb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Accra Exemplary Institutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary mt-1">
              Featured Private Schools
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Explore leading institutions known for academic rigour, modern facilities, and sound values.
            </p>
          </div>
          <Link href="/schools" className="flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-navy-light group">
            <span>Browse All {state.schools.length} Schools</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {featuredSchools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              variant="list"
              onOpenEnquiry={(s) => setEnquirySchool(s)}
            />
          ))}
        </div>
      </section>

      {/* SECTION: EXPLORE SCHOOLS FOR FREE — TWO WAYS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge text-xs font-bold uppercase tracking-[0.2em] text-[#0B1E36] mb-2 shadow-2xs">
            YOUR SEARCH. YOUR PACE.
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0B1E36] tracking-tight mt-1.5">
            Explore Schools for Free — Two Ways
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal max-w-3xl">
            Start exploring freely. Create a free account when you’re ready for a more personal journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: Explore as a guest */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-7 sm:p-9 shadow-glass hover:shadow-glass-hover flex flex-col justify-between relative overflow-hidden group">
            {/* Specular top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            <div>
              <h3 className="font-serif text-2xl sm:text-[28px] font-bold text-[#0B1E36] leading-tight">
                Explore as a guest
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1 mb-6 sm:mb-8">
                No registration required
              </p>

              <div className="space-y-3.5 sm:space-y-4 mb-8 sm:mb-10">
                <div className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-700 font-medium">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 stroke-[2.5]" />
                  <span>Discover school profiles</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-700 font-medium">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 stroke-[2.5]" />
                  <span>Compare your options</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-700 font-medium">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 stroke-[2.5]" />
                  <span>Start a conversation</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Link
                href="/schools"
                className="px-6 py-3 bg-[#0B1E36] hover:bg-[#132c4d] text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow"
              >
                Search Schools
              </Link>
              <Link
                href="/compare"
                className="text-sm font-semibold text-[#0B1E36] hover:underline underline-offset-4"
              >
                Try a comparison
              </Link>
            </div>
          </div>

          {/* Card 2: Register as Parent */}
          <div className="glass-panel-dark rounded-3xl p-7 sm:p-9 text-white shadow-glass-dark hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient sapphire/gold glow in corner */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative z-10">
              <h3 className="font-serif text-2xl sm:text-[28px] font-bold text-white leading-tight">
                Register as Parent
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1 mb-6 sm:mb-8">
                Join for free.
              </p>

              <div className="space-y-3.5 sm:space-y-4 mb-8 sm:mb-10">
                <div className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-200 font-medium">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 stroke-[2.5]" />
                  <span>Save schools to your personal shortlist</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-200 font-medium">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 stroke-[2.5]" />
                  <span>Track applications and open-day milestones</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-200 font-medium">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 stroke-[2.5]" />
                  <span>Receive admissions-window and deadline reminders</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap pt-2 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setParentAuthMode('sign-up');
                  setParentAuthModalOpen(true);
                }}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Create free account
              </button>
              <button
                type="button"
                onClick={() => {
                  setParentAuthMode('sign-in');
                  setParentAuthModalOpen(true);
                }}
                className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50 cursor-pointer"
              >
                Already registered? Sign in
              </button>
              <Link
                href="/parents"
                className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50"
              >
                Try the parent demo
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: OUR EDUCATION ECOSYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge text-xs font-bold uppercase tracking-[0.2em] text-[#0B1E36] mb-2 shadow-2xs">
            OUR ECOSYSTEM
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight mt-1.5">
            More Than School Search
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal max-w-3xl">
            A connected platform for schools, education professionals and trusted partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 xl:gap-8">
          
          {/* Card 1: School Owners */}
          <div className="glass-panel glass-panel-hover rounded-3xl overflow-hidden shadow-glass hover:shadow-glass-hover flex flex-col group relative">
            <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 w-full overflow-hidden bg-slate-900/10">
              <img
                src="/images/ecosystem-schools.jpg"
                alt="School Owners"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-400" />
            </div>

            <div className="p-5 sm:p-6 lg:p-6 xl:p-7 flex flex-col justify-between flex-1 space-y-4 sm:space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-[19px] xl:text-xl font-bold text-[#0B1E36] tracking-tight leading-snug whitespace-nowrap">
                  School Owners
                </h3>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B1E36] mt-0.5 mb-1.5">
                  Grow Your School
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Reach more families, promote admissions and find school partners.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-[11px] sm:text-xs font-semibold text-[#0B1E36]">
                  <div className="flex items-center gap-1.5 glass-pill px-2.5 py-1.5 sm:py-2 rounded-lg shadow-2xs">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">Admissions Support</span>
                  </div>
                  <div className="flex items-center gap-1.5 glass-pill px-2.5 py-1.5 sm:py-2 rounded-lg shadow-2xs">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">Vacancies & Tenders</span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/school-owners/register"
                  className="w-full py-2.5 sm:py-3 px-5 bg-[#0B1E36] hover:bg-[#132c4d] text-white font-bold text-xs sm:text-sm rounded-xl text-center block transition-all shadow-sm hover:shadow"
                >
                  List Your School
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Teachers & Professionals */}
          <div className="glass-panel glass-panel-hover rounded-3xl overflow-hidden shadow-glass hover:shadow-glass-hover flex flex-col group relative">
            <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 w-full overflow-hidden bg-slate-900/10">
              <img
                src="/images/ecosystem-teachers.jpg"
                alt="Teachers & Professionals"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-400" />
            </div>

            <div className="p-5 sm:p-6 lg:p-6 xl:p-7 flex flex-col justify-between flex-1 space-y-4 sm:space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-[19px] xl:text-xl font-bold text-[#0B1E36] tracking-tight leading-snug whitespace-nowrap">
                  Teachers & Professionals
                </h3>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B1E36] mt-0.5 mb-1.5">
                  Find Your Next Opportunity
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Explore education jobs, showcase your expertise and offer services.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-[11px] sm:text-xs font-semibold text-[#0B1E36]">
                  <div className="flex items-center gap-1.5 glass-pill px-2.5 py-1.5 sm:py-2 rounded-lg shadow-2xs">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">Education Jobs</span>
                  </div>
                  <div className="flex items-center gap-1.5 glass-pill px-2.5 py-1.5 sm:py-2 rounded-lg shadow-2xs">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">Tutoring Services</span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/professionals"
                  className="w-full py-2.5 sm:py-3 px-5 bg-[#0B1E36] hover:bg-[#132c4d] text-white font-bold text-xs sm:text-sm rounded-xl text-center block transition-all shadow-sm hover:shadow"
                >
                  Explore Opportunities
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Suppliers & Services */}
          <div className="glass-panel glass-panel-hover rounded-3xl overflow-hidden shadow-glass hover:shadow-glass-hover flex flex-col group relative">
            <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 w-full overflow-hidden bg-slate-900/10">
              <img
                src="/images/ecosystem-suppliers.jpg"
                alt="Suppliers & Services"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-400" />
            </div>

            <div className="p-5 sm:p-6 lg:p-6 xl:p-7 flex flex-col justify-between flex-1 space-y-4 sm:space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-[19px] xl:text-xl font-bold text-[#0B1E36] tracking-tight leading-snug whitespace-nowrap">
                  Suppliers & Services
                </h3>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B1E36] mt-0.5 mb-1.5">
                  Connect With Schools
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Showcase your products and services, and discover school tenders.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-[11px] sm:text-xs font-semibold text-[#0B1E36]">
                  <div className="flex items-center gap-1.5 glass-pill px-2.5 py-1.5 sm:py-2 rounded-lg shadow-2xs">
                    <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">Products & Services</span>
                  </div>
                  <div className="flex items-center gap-1.5 glass-pill px-2.5 py-1.5 sm:py-2 rounded-lg shadow-2xs">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">School Tenders</span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/suppliers"
                  className="w-full py-2.5 sm:py-3 px-5 bg-[#0B1E36] hover:bg-[#132c4d] text-white font-bold text-xs sm:text-sm rounded-xl text-center block transition-all shadow-sm hover:shadow"
                >
                  Discover Tenders
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 & 6: HOW IT WORKS */}
      <section className="pt-6 pb-2 sm:pt-8 sm:pb-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge text-xs font-bold uppercase tracking-[0.2em] text-[#0B1E36] mb-2 shadow-2xs">
              STEP-BY-STEP GUIDANCE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
              How SkoolFinder Works for Parents
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Find, evaluate, and connect in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="glass-panel glass-panel-hover rounded-3xl p-7 text-center space-y-4 shadow-glass hover:shadow-glass-hover relative group border border-white/80">
              <div className="w-12 h-12 rounded-2xl bg-brand-navy text-amber-400 font-black flex items-center justify-center mx-auto text-lg shadow-md group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Search & Filter</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Filter by your neighborhood (East Legon, Tema, Dansoman, etc.), preferred curriculum (GES, Cambridge, IB), and education level.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover rounded-3xl p-7 text-center space-y-4 shadow-glass hover:shadow-glass-hover relative group border border-white/80">
              <div className="w-12 h-12 rounded-2xl bg-brand-navy text-amber-400 font-black flex items-center justify-center mx-auto text-lg shadow-md group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Compare Side-by-Side</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Review fee structures, student-teacher ratios, transport services, boarding facilities, and past examination performance.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover rounded-3xl p-7 text-center space-y-4 shadow-glass hover:shadow-glass-hover relative group border border-white/80">
              <div className="w-12 h-12 rounded-2xl bg-brand-navy text-amber-400 font-black flex items-center justify-center mx-auto text-lg shadow-md group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Contact Admissions</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Send an immediate digital inquiry to the school registrar or book a campus walk-through directly through the platform.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 sm:pb-8">
        <div className="glass-panel-dark rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-glass-dark border border-white/20">
          {/* Ambient corner glows */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 max-w-xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Are you a School Proprietor or Administrator?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Give your institution the visibility it deserves across Greater Accra.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Join dozens of private schools in Accra showcasing their academic standards, publishing vacancies, and connecting with prospective families.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10">
            <Link href="/school-owners/register">
              <Button variant="gold" size="lg" className="w-full justify-center shadow-lg hover:shadow-amber-400/25">
                Register Your School
              </Button>
            </Link>
            <Link href="/schools">
              <Button variant="outline" size="lg" className="w-full justify-center bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
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

      {/* Parent Registration & Sign In Popup */}
      <ParentAuthModal
        isOpen={parentAuthModalOpen}
        onClose={() => setParentAuthModalOpen(false)}
        initialMode={parentAuthMode}
      />

    </div>
  );
};
