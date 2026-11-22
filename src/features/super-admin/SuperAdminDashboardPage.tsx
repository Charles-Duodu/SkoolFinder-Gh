import React from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { 
  ShieldCheck, 
  School, 
  Users, 
  Briefcase, 
  Truck, 
  CheckSquare, 
  AlertTriangle, 
  BarChart3, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

export const SuperAdminDashboardPage: React.FC = () => {
  const { state } = useDemo();

  // Metrics
  const totalSchools = state.schools.length;
  const pendingSchools = state.schools.filter(s => s.verificationStatus === 'under_review' || s.verificationStatus === 'submitted').length;
  const approvedSchools = state.schools.filter(s => s.verificationStatus === 'approved').length;

  const totalPros = state.professionals.length;
  const pendingPros = state.professionals.filter(p => p.verificationStatus === 'under_review').length;

  const totalSuppliers = state.suppliers.length;
  const pendingSuppliers = state.suppliers.filter(s => s.verificationStatus === 'under_review').length;

  const totalPendingApprovals = pendingSchools + pendingPros + pendingSuppliers;

  const openCases = state.cases.filter(c => c.status !== 'Resolved').length;

  // Geographic distribution chart data
  const geoData = [
    { locality: 'East Legon', count: 3 },
    { locality: 'Cantonments', count: 2 },
    { locality: 'Tema', count: 2 },
    { locality: 'Achimota', count: 1 },
    { locality: 'Dansoman', count: 1 },
    { locality: 'Spintex', count: 1 },
    { locality: 'Ridge', count: 1 },
  ];

  const growthData = [
    { month: 'Jan', schools: 4, parents: 120, enquiries: 18 },
    { month: 'Feb', schools: 6, parents: 280, enquiries: 34 },
    { month: 'Mar', schools: 7, parents: 410, enquiries: 52 },
    { month: 'Apr', schools: 8, parents: 630, enquiries: 85 },
    { month: 'May', schools: 10, parents: 890, enquiries: 124 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Command Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Central Governance Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary mt-1">
              SkoolFinder Ghana Ecosystem Overview
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Operational oversight of private schools, educators, commercial vendors, and parent inquiries across Greater Accra.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/super-admin/approvals">
              <Button variant="danger" size="sm" icon={<CheckSquare className="w-3.5 h-3.5" />}>
                Review Queue ({totalPendingApprovals})
              </Button>
            </Link>
          </div>
        </div>

        {/* Priority Pending Action Alert */}
        {totalPendingApprovals > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  {totalPendingApprovals} Verification Applications Pending Decision
                </h3>
                <p className="text-xs text-amber-700">
                  Includes {pendingSchools} schools, {pendingPros} teachers, and {pendingSuppliers} suppliers awaiting review.
                </p>
              </div>
            </div>
            <Link to="/super-admin/approvals">
              <Button variant="gold" size="sm">
                Open Applications Centre
              </Button>
            </Link>
          </div>
        )}

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/super-admin/schools" className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle hover:border-brand-navy transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted">Registered Schools</span>
              <School className="w-4 h-4 text-brand-navy" />
            </div>
            <p className="text-3xl font-black text-ink-primary mt-2">{totalSchools}</p>
            <div className="flex items-center gap-2 text-[11px] mt-1">
              <span className="text-emerald-600 font-bold">{approvedSchools} Verified</span>
              <span>&bull;</span>
              <span className="text-amber-600 font-bold">{pendingSchools} Pending</span>
            </div>
          </Link>

          <Link to="/super-admin/parents" className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle hover:border-brand-navy transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted">Parent Demonstration Users</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-ink-primary mt-2">890</p>
            <span className="text-[11px] text-ink-secondary mt-1 block">Active across Greater Accra</span>
          </Link>

          <Link to="/super-admin/professionals" className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle hover:border-brand-navy transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted">Teachers & Pros</span>
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-ink-primary mt-2">{totalPros}</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">NTC Vetting Active</span>
          </Link>

          <Link to="/super-admin/suppliers" className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle hover:border-brand-navy transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted">Suppliers & Vendors</span>
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-ink-primary mt-2">{totalSuppliers}</p>
            <span className="text-[11px] text-purple-600 font-bold mt-1 block">14 categories covered</span>
          </Link>
        </div>

        {/* Operational Analytics & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Growth Chart */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-subtle space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ink-primary">Platform Participation Trends (2026)</h3>
              <p className="text-xs text-ink-secondary">Growth in schools and parent admission inquiries</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="enquiries" stroke="#102A43" fill="#102A43" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="schools" stroke="#C5A55A" fill="#C5A55A" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-subtle space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ink-primary">School Density by Accra Locality</h3>
              <p className="text-xs text-ink-secondary">Distribution of registered private campuses</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geoData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="locality" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#102A43" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Platform Activities Log */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-primary">Recent Ecosystem Activity</h3>
            <span className="text-xs text-ink-muted">Live audit stream</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Parent <strong>Ama Mensah</strong> submitted an admission inquiry to <strong>Achimota Preparatory</strong></span>
              </div>
              <span className="text-ink-muted">2 hrs ago</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Supplier <strong>Accra Educational Supplies</strong> submitted bid of GHS 142,500 on RFQ #01</span>
              </div>
              <span className="text-ink-muted">4 hrs ago</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Professional <strong>Kofi Addo Mensah</strong> applied to vacancy at <strong>Achimota Preparatory</strong></span>
              </div>
              <span className="text-ink-muted">1 day ago</span>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
