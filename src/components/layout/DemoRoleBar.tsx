import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { UserRole } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, School, Briefcase, Truck, RotateCcw, Compass, ArrowRight } from 'lucide-react';

export const DemoRoleBar: React.FC = () => {
  const { role, setRole, resetDemoData } = useDemo();
  const navigate = useNavigate();

  const roleOptions: { role: UserRole; label: string; name: string; path: string; icon: React.ReactNode }[] = [
    {
      role: 'guest',
      label: 'Public / Guest',
      name: 'Visitor Mode',
      path: '/',
      icon: <Compass className="w-3.5 h-3.5 text-slate-300" />
    },
    {
      role: 'parent',
      label: 'Parent',
      name: 'Ama Mensah',
      path: '/parents/dashboard',
      icon: <UserCheck className="w-3.5 h-3.5 text-blue-300" />
    },
    {
      role: 'school_owner',
      label: 'School Proprietor',
      name: 'Achimota Prep',
      path: '/school-owners/dashboard',
      icon: <School className="w-3.5 h-3.5 text-amber-300" />
    },
    {
      role: 'professional',
      label: 'Professional',
      name: 'Kofi Addo (STEM)',
      path: '/professionals/dashboard',
      icon: <Briefcase className="w-3.5 h-3.5 text-emerald-300" />
    },
    {
      role: 'supplier',
      label: 'Supplier / Vendor',
      name: 'Accra Edu Supplies',
      path: '/suppliers/dashboard',
      icon: <Truck className="w-3.5 h-3.5 text-purple-300" />
    },
    {
      role: 'super_admin',
      label: 'Super Admin',
      name: 'Chief Administrator',
      path: '/super-admin/dashboard',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
    }
  ];

  const handleRoleSelect = (targetRole: UserRole, targetPath: string) => {
    setRole(targetRole);
    navigate(targetPath);
  };

  const handleReset = () => {
    if (window.confirm('Reset all interactive demo state (applications, RFQs, enquiries, jobs) back to initial seed data?')) {
      resetDemoData();
      navigate('/');
    }
  };

  return (
    <aside aria-label="Demo Prototype Toolbar" className="bg-brand-navy-dark text-white border-b border-brand-navy-light/60 px-3 py-1.5 text-xs select-none sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-bold tracking-wider uppercase text-[10px] border border-brand-gold/30">
            Prototype Demo Switcher
          </span>
          <span className="hidden md:inline text-slate-300 text-[11px]">
            Switch persona to test cross-portal workflows:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {roleOptions.map((opt) => {
            const isActive = role === opt.role;
            return (
              <button
                key={opt.role}
                onClick={() => handleRoleSelect(opt.role, opt.path)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-brand-gold text-brand-navy-dark font-bold shadow-sm ring-1 ring-white/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-200'
                }`}
                title={`Switch to ${opt.label} (${opt.name})`}
              >
                {opt.icon}
                <span>{opt.label}</span>
                {isActive && <span className="opacity-75 hidden lg:inline">({opt.name})</span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const current = roleOptions.find(o => o.role === role);
              if (current) navigate(current.path);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition-colors"
          >
            <span>Active Portal</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-[11px] font-medium transition-colors"
            title="Reset all demo state to original Ghanaian fixtures"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
