import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { School, MapPin, Shield, BookOpen, Users, Phone, Mail, ShieldAlert } from 'lucide-react';
import { SafeguardingReportModal } from '../../features/discovery/SafeguardingReportModal';

export const PublicFooter: React.FC = () => {
  const [safeguardingOpen, setSafeguardingOpen] = useState(false);
  const localities = [
    'East Legon', 'Cantonments', 'Airport Residential', 'Osu', 'Tema',
    'Spintex', 'Achimota', 'Dansoman', 'Madina', 'Adenta', 'Ridge', 'Labone'
  ];

  const levels = [
    'Crèche & Nursery', 'Kindergarten', 'Primary Schools', 
    'Junior High Schools (JHS)', 'Senior High Schools (SHS)'
  ];

  return (
    <footer className="bg-brand-navy-dark text-slate-300 border-t border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-brand-gold border border-brand-gold/30">
                <School className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Skool<span className="text-brand-gold">Finder</span> Ghana
                </span>
                <p className="text-xs text-slate-400">Greater Accra Private Education Directory & SaaS Ecosystem</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering parents and guardians to discover the right private educational foundation for their children, while equipping schools, teachers, and suppliers with an interconnected commercial platform.
            </p>
            <div className="flex flex-col space-y-1.5 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>Greater Accra Region, Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>+233 (0) 30 290 8820</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold" />
                <span>support@skoolfinder.com.gh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Educational Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/schools" className="hover:text-brand-gold transition-colors">School Search Directory</Link></li>
              <li><Link to="/compare" className="hover:text-brand-gold transition-colors">Compare Schools</Link></li>
              <li><Link to="/parents/dashboard" className="hover:text-brand-gold transition-colors">Parents Workspace</Link></li>
              <li><Link to="/school-owners" className="hover:text-brand-gold transition-colors">School Owners Portal</Link></li>
              <li><Link to="/professionals" className="hover:text-brand-gold transition-colors">Teachers & Professionals</Link></li>
              <li><Link to="/suppliers" className="hover:text-brand-gold transition-colors">Suppliers & Tenders</Link></li>
              <li><Link to="/super-admin/dashboard" className="hover:text-brand-gold transition-colors">Super Admin Console</Link></li>
              <li>
                <button
                  onClick={() => setSafeguardingOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 mt-1 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Report Safeguarding Incident</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Levels Directory */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              School Levels
            </h4>
            <ul className="space-y-2 text-sm">
              {levels.map((lvl) => (
                <li key={lvl}>
                  <Link to={`/schools?level=${encodeURIComponent(lvl)}`} className="hover:text-brand-gold transition-colors">
                    {lvl}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Greater Accra Localities */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Accra Localities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {localities.map((loc) => (
                <Link
                  key={loc}
                  to={`/schools?locality=${encodeURIComponent(loc)}`}
                  className="px-2 py-0.5 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  {loc}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Legal & Educational Disclaimer Notice */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} SkoolFinder Ghana. Designed for the Ghanaian Private Education Community.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-brand-gold" />
              <span>Frontend Interactive Demonstration Prototype</span>
            </span>
            <Link to="/super-admin/dashboard" className="text-slate-400 hover:text-white underline">
              Admin Governance
            </Link>
          </div>
        </div>
      </div>

      <SafeguardingReportModal
        isOpen={safeguardingOpen}
        onClose={() => setSafeguardingOpen(false)}
      />
    </footer>
  );
};
