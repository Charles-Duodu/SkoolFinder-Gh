import React, { useState } from 'react';
import { School, GreaterAccraLocality } from '../../types';
import { MapPin, Navigation, School as SchoolIcon, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatGHS } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

interface AccraLocalityMapProps {
  schools: School[];
  selectedLocality: string;
  onSelectLocality: (locality: string) => void;
}

interface LocalityNode {
  name: GreaterAccraLocality;
  x: number; // percentage
  y: number; // percentage
  description: string;
}

const LOCALITY_NODES: LocalityNode[] = [
  { name: 'Achimota', x: 28, y: 32, description: 'Historic educational belt with lush greenery & serene campus environments' },
  { name: 'Madina', x: 50, y: 18, description: 'Bustling residential hub connecting University of Ghana to Adenta' },
  { name: 'Adenta', x: 62, y: 15, description: 'Rapidly growing family suburb with modern private academies' },
  { name: 'Legon', x: 45, y: 30, description: 'Tertiary & research corridor surrounded by leading preparatory schools' },
  { name: 'East Legon', x: 55, y: 38, description: 'Premier residential enclave featuring world-class Cambridge & IB schools' },
  { name: 'Dzorwulu', x: 38, y: 44, description: 'Quiet central community renowned for specialized international curricula' },
  { name: 'Airport Residential', x: 46, y: 48, description: 'Prestigious diplomatic and corporate residential zone' },
  { name: 'Ridge', x: 42, y: 62, description: 'Government and financial district bordering prestigious legacy day schools' },
  { name: 'Cantonments', x: 52, y: 58, description: 'Embassy belt with top-tier British, American & Montessori schools' },
  { name: 'Labone', x: 56, y: 64, description: 'Established, leafy coastal residential neighborhood' },
  { name: 'Osu', x: 48, y: 72, description: 'Vibrant cultural and coastal district in central Accra' },
  { name: 'Spintex', x: 72, y: 52, description: 'Dynamic commercial artery connecting Accra to Tema metropolis' },
  { name: 'Tema', x: 88, y: 56, description: 'Harbor city with planned residential communities & reputable private colleges' },
  { name: 'Dansoman', x: 20, y: 68, description: 'Vast, established residential community with renowned Ghanaian private schools' }
];

export const AccraLocalityMap: React.FC<AccraLocalityMapProps> = ({
  schools,
  selectedLocality,
  onSelectLocality
}) => {
  const [hoveredLocality, setHoveredLocality] = useState<GreaterAccraLocality | null>(null);

  // Get count of schools per locality
  const getSchoolCount = (loc: string) => schools.filter(s => s.locality === loc).length;

  // Active locality to showcase
  const activeLocality = (selectedLocality as GreaterAccraLocality) || hoveredLocality || 'East Legon';
  const activeSchools = schools.filter(s => s.locality === activeLocality);
  const activeNode = LOCALITY_NODES.find(n => n.name === activeLocality);

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-5 lg:p-6 shadow-subtle space-y-6">
      
      {/* Header and Filter Chips Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-navy/10 text-brand-navy">
              <Navigation className="w-4 h-4 text-brand-gold" />
            </span>
            <h3 className="text-base font-bold text-ink-primary">Greater Accra Campus Locality Explorer</h3>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Explore private school density and spatial distribution across Greater Accra's educational corridors
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedLocality && (
            <button
              onClick={() => onSelectLocality('')}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Reset Location Filter
            </button>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
            {schools.length} Schools in Greater Accra
          </span>
        </div>
      </div>

      {/* Locality Quick Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => onSelectLocality('')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            !selectedLocality 
              ? 'bg-brand-navy text-white shadow-sm' 
              : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'
          }`}
        >
          All Greater Accra ({schools.length})
        </button>
        {LOCALITY_NODES.map(node => {
          const count = getSchoolCount(node.name);
          const isSelected = selectedLocality === node.name;
          return (
            <button
              key={node.name}
              onClick={() => onSelectLocality(isSelected ? '' : node.name)}
              onMouseEnter={() => setHoveredLocality(node.name)}
              onMouseLeave={() => setHoveredLocality(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-brand-gold text-brand-navy-dark shadow-sm'
                  : 'bg-slate-50 border border-surface-border text-ink-secondary hover:bg-slate-100 hover:text-ink-primary'
              }`}
            >
              <MapPin className="w-3 h-3 text-brand-navy" />
              <span>{node.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-brand-navy text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Map Canvas + Locality Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Geographical Visual Canvas (7 Cols) */}
        <div className="lg:col-span-7 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner h-[380px] sm:h-[440px]">
          {/* Subtle Grid Backdrop */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:20px_20px]" />
          
          {/* Coastline / Gulf of Guinea ocean representation at the bottom */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-sky-950/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 text-[10px] font-mono text-sky-400/60 flex items-center gap-1">
            <span>&bull; Gulf of Guinea Coastline (Accra Harbor &bull; Osu &bull; Tema Port)</span>
          </div>

          {/* Motorway / Main Express Arteries */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* N1 George Walker Bush Motorway */}
            <path
              d="M 50 320 Q 200 240, 450 220 T 700 240"
              fill="none"
              stroke="#334155"
              strokeWidth="3"
              strokeDasharray="4 4"
            />
            {/* Tema Motorway */}
            <path
              d="M 350 180 Q 550 200, 750 240"
              fill="none"
              stroke="#475569"
              strokeWidth="2.5"
            />
          </svg>

          {/* Locality Pin Hotspots */}
          {LOCALITY_NODES.map((node) => {
            const count = getSchoolCount(node.name);
            const isSelected = selectedLocality === node.name;
            const isHovered = hoveredLocality === node.name;
            const hasSchools = count > 0;

            return (
              <div
                key={node.name}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                onClick={() => onSelectLocality(isSelected ? '' : node.name)}
                onMouseEnter={() => setHoveredLocality(node.name)}
                onMouseLeave={() => setHoveredLocality(null)}
              >
                {/* Ping Pulse for Selected or Hotspots */}
                {(isSelected || (hasSchools && isHovered)) && (
                  <span className="absolute -inset-2 rounded-full bg-brand-gold opacity-75 animate-ping" />
                )}

                {/* Marker Pill / Icon */}
                <div className={`relative px-2.5 py-1 rounded-full text-xs font-bold transition-transform duration-200 flex items-center gap-1.5 shadow-md ${
                  isSelected
                    ? 'bg-brand-gold text-brand-navy-dark scale-110 ring-2 ring-white'
                    : isHovered
                    ? 'bg-white text-brand-navy scale-105 ring-1 ring-brand-gold'
                    : hasSchools
                    ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    isSelected ? 'bg-brand-navy' : hasSchools ? 'bg-brand-gold' : 'bg-slate-600'
                  }`} />
                  <span className="text-[11px] truncate max-w-[85px] sm:max-w-none">{node.name}</span>
                  {hasSchools && (
                    <span className={`text-[9px] px-1 rounded font-extrabold ${
                      isSelected ? 'bg-brand-navy text-white' : 'bg-brand-navy/60 text-brand-gold'
                    }`}>
                      {count}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Map Compass Indicator */}
          <div className="absolute top-3 right-3 p-2 bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700 text-slate-400 flex flex-col items-center">
            <span className="text-[9px] font-bold text-brand-gold font-mono">N</span>
            <span className="text-[9px] font-mono mt-0.5">&uarr;</span>
          </div>

          <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded-lg border border-slate-700 text-[11px] text-slate-300 font-medium">
            Click any pin to inspect schools
          </div>
        </div>

        {/* Locality Profile & Schools Showcase (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-slate-50 border border-surface-border rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-ink-muted font-bold">
                Locality Profile
              </span>
              <span className="text-xs font-bold text-brand-navy px-2 py-0.5 rounded-full bg-blue-100">
                {activeSchools.length} registered school{activeSchools.length === 1 ? '' : 's'}
              </span>
            </div>
            <h4 className="text-lg font-extrabold text-brand-navy">{activeLocality}</h4>
            <p className="text-xs text-ink-secondary leading-relaxed">
              {activeNode?.description || 'Prominent educational destination in Greater Accra.'}
            </p>
          </div>

          {/* Schools in this locality */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {activeSchools.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-surface-border rounded-xl text-center text-xs text-ink-muted">
                No schools currently listed under this locality in the prototype demonstration.
              </div>
            ) : (
              activeSchools.map((school) => (
                <div
                  key={school.id}
                  className="p-3.5 bg-white border border-surface-border rounded-xl shadow-subtle hover:border-brand-navy/40 transition-colors space-y-2 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={school.crestUrl}
                        alt={school.name}
                        className="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-surface-border shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-ink-primary truncate group-hover:text-brand-navy">
                          {school.name}
                        </h5>
                        <p className="text-[11px] text-ink-muted truncate">
                          {school.curricula.join(' &bull; ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-brand-navy font-bold">
                      {formatGHS(school.annualFeeRange.min)} – {formatGHS(school.annualFeeRange.max)}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">/yr</span>
                    </span>
                    <Link
                      to={`/schools/${school.slug}`}
                      className="text-xs font-semibold text-brand-navy hover:text-brand-gold flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
