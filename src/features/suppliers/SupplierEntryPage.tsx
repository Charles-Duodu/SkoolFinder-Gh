import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { SupplierCategory } from '../../types';
import { 
  Truck, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag,
  Building,
  Briefcase
} from 'lucide-react';

export const SupplierEntryPage: React.FC = () => {
  const categories: SupplierCategory[] = [
    'Stationery & Books', 'ICT & Software', 'School Furniture', 'School Uniforms',
    'Catering & Food Services', 'Cleaning & Sanitation', 'Facility Maintenance',
    'Security Services', 'Student Transport', 'Science Lab Equipment', 
    'Sports Equipment', 'Construction & Repairs'
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-navy-dark via-brand-navy to-brand-navy-light text-white pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>For Educational Vendors & Commercial Suppliers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Supply Accra's Growing Network of <span className="text-brand-gold">Private Schools</span>.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Gain commercial visibility with school proprietors, discover open tenders and procurement RFQs, and submit competitive bids across 14 educational supply categories.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/suppliers/register">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                Register as a Verified Supplier
              </Button>
            </Link>
            <Link to="/suppliers/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-600 text-white hover:bg-white/10">
                View Sample Supplier Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 12+ Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
            14 Dedicated Educational Supply Sectors
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Schools in Greater Accra source products and contract services across all these categories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat} className="p-4 rounded-xl border border-surface-border bg-white hover:border-brand-navy hover:shadow-subtle transition-all flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-brand-navy shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-ink-primary">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How Tendering Works */}
      <section className="bg-slate-50 py-16 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-bold text-ink-primary">Streamlined B2B Procurement</h2>
            <p className="text-xs text-ink-secondary mt-1">
              From tender discovery to contract award in three steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            <div className="bg-white p-6 rounded-2xl border space-y-2">
              <span className="text-sm font-bold text-brand-gold">Step 1</span>
              <h3 className="text-sm font-bold text-ink-primary">Browse Open RFQs</h3>
              <p className="text-xs text-ink-secondary">Review published school specifications, required quantities, and delivery locations.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border space-y-2">
              <span className="text-sm font-bold text-brand-gold">Step 2</span>
              <h3 className="text-sm font-bold text-ink-primary">Submit Digital Quotations</h3>
              <p className="text-xs text-ink-secondary">Quote unit pricing, delivery timelines, warranty terms, and upload product catalog proofs.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border space-y-2">
              <span className="text-sm font-bold text-brand-gold">Step 3</span>
              <h3 className="text-sm font-bold text-ink-primary">Award & Delivery</h3>
              <p className="text-xs text-ink-secondary">Communicate directly with school procurement officers once your bid is shortlisted or accepted.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
