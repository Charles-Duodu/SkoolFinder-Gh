'use client';

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { DashboardLayout, DashboardNavItem } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatGHS, formatDate } from '../../lib/utils';
import { RFQTender } from '../../types';
import { 
  LayoutDashboard, 
  Truck, 
  Layers, 
  FileCheck2, 
  ShoppingBag, 
  Settings, 
  Search, 
  Send, 
  CheckCircle2, 
  Building,
  Plus,
  Package
} from 'lucide-react';

interface SupplierDashboardPageProps {
  welcomeNotice?: boolean;
}

export const SupplierDashboardPage: React.FC<SupplierDashboardPageProps> = ({ welcomeNotice = false }) => {
  const { state, submitBid } = useDemo();
  const [showWelcome, setShowWelcome] = useState(welcomeNotice);
  const sup = state.suppliers.find(s => s.id === 'sup-01') || state.suppliers[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'bids' | 'catalog' | 'settings'>('overview');

  // Bids submitted by this vendor
  const myBids = state.bids.filter(b => b.supplierId === sup.id || b.supplierName === sup.businessName);

  // RFQ bidding modal state
  const [biddingRFQ, setBiddingRFQ] = useState<RFQTender | null>(null);
  const [bidAmount, setBidAmount] = useState(140000);
  const [deliveryDays, setDeliveryDays] = useState(21);
  const [proposalNotes, setProposalNotes] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);

  const navItems: DashboardNavItem[] = [
    { id: 'overview', label: 'Vendor Overview', path: '#', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'opportunities', label: 'School Tenders & RFQs', path: '#', icon: <Layers className="w-4 h-4" />, badge: state.rfqs.length },
    { id: 'bids', label: 'Submitted Quotations', path: '#', icon: <FileCheck2 className="w-4 h-4" />, badge: myBids.length },
    { id: 'catalog', label: 'Product Catalog', path: '#', icon: <ShoppingBag className="w-4 h-4" />, badge: sup.products.length },
    { id: 'settings', label: 'Company Profile', path: '#', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingRFQ) return;

    submitBid({
      rfqId: biddingRFQ.id,
      rfqTitle: biddingRFQ.title,
      schoolId: biddingRFQ.schoolId,
      schoolName: biddingRFQ.schoolName,
      supplierId: sup.id,
      supplierName: sup.businessName,
      supplierCategory: sup.category,
      totalAmountGHS: Number(bidAmount),
      deliveryTimelineDays: Number(deliveryDays),
      warrantyPeriodMonths: 12,
      validUntil: '2026-09-30',
      proposalNotes: proposalNotes || 'Full delivery directly to school compound with compliance guarantee.'
    });

    setBidSuccess(true);
  };

  const handleCloseModal = () => {
    setBiddingRFQ(null);
    setBidSuccess(false);
    setProposalNotes('');
  };

  return (
    <DashboardLayout
      portalName="Educational Suppliers Hub"
      portalSubtitle={`${sup.businessName} &bull; ${sup.category}`}
      navItems={navItems}
      actionButton={
        <Button variant="gold" size="sm" onClick={() => setActiveTab('opportunities')} icon={<Search className="w-3.5 h-3.5 text-brand-navy-dark" />}>
          Browse Open Tenders
        </Button>
      }
    >
      {/* Subnav */}
      <div className="flex border-b border-surface-border mb-6 overflow-x-auto no-scrollbar gap-1 bg-white p-1 rounded-xl shadow-subtle">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === item.id ? 'bg-brand-gold text-brand-navy-dark' : 'bg-slate-200 text-slate-700'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Newly Registered Celebration Notice */}
      {showWelcome && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-start justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink-primary">
                🎉 Commercial Vendor Profile Submitted & Dashboard Unlocked!
              </h4>
              <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                Your business registration and tax clearance details are queued for verification. Your supplier portal is active below—you can now browse school tenders, prepare quotations, and present your catalog to Accra institutions.
              </p>
            </div>
          </div>
          <button onClick={() => setShowWelcome(false)} className="text-ink-muted hover:text-ink-primary text-xs font-semibold p-1">
            ✕
          </button>
        </div>
      )}

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={sup.logoUrl} alt={sup.businessName} className="w-14 h-14 rounded-2xl object-cover border" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-ink-primary">{sup.businessName}</h1>
                  <StatusBadge status={sup.verificationStatus} />
                </div>
                <p className="text-xs text-ink-secondary mt-0.5">Primary Category: <strong className="text-brand-navy">{sup.category}</strong></p>
                <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-1">
                  <span>Reg: {sup.registrationNumber}</span>
                  <span>&bull;</span>
                  <span>Hub: {sup.locality}, Accra</span>
                </div>
              </div>
            </div>

            <Button variant="gold" size="sm" onClick={() => setActiveTab('opportunities')}>
              Explore Open RFQs
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-surface-border">
              <span className="text-xs text-ink-muted font-medium">Open School RFQs</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{state.rfqs.length}</p>
              <span className="text-[11px] text-brand-navy font-semibold mt-1 block">In Greater Accra</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-surface-border">
              <span className="text-xs text-ink-muted font-medium">Submitted Bids</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{myBids.length}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Active quotations</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-surface-border">
              <span className="text-xs text-ink-muted font-medium">Listed Products</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{sup.products.length}</p>
              <span className="text-[11px] text-ink-secondary mt-1 block">In school catalog</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-surface-border">
              <span className="text-xs text-ink-muted font-medium">Coverage Zones</span>
              <p className="text-2xl font-bold text-ink-primary mt-1">{sup.coverageAreas.length}</p>
              <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Districts served</span>
            </div>
          </div>

          {/* Recent Bids Tracker */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-primary">Recent Quotation Submissions</h3>
              <button onClick={() => setActiveTab('bids')} className="text-xs text-brand-navy font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {myBids.map(bid => (
                <div key={bid.id} className="p-4 rounded-xl border border-surface-border bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-ink-primary">{bid.rfqTitle}</h4>
                    <p className="text-[11px] text-ink-secondary">{bid.schoolName} &bull; Total: <strong>{formatGHS(bid.totalAmountGHS)}</strong></p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                    {bid.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">School Procurement Opportunities (RFQs)</h2>
              <p className="text-xs text-ink-secondary">Published by verified private schools in Greater Accra</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.rfqs.map(rfq => (
              <div key={rfq.id} className="bg-white p-6 rounded-2xl border border-surface-border shadow-subtle flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-ink-primary">{rfq.title}</h3>
                      <p className="text-xs font-semibold text-brand-navy">{rfq.schoolName} ({rfq.schoolLocality})</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100">
                      {rfq.category}
                    </span>
                  </div>

                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">{rfq.description}</p>
                  
                  <div className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1">
                    <span className="font-bold text-ink-primary block">Tender Specifications:</span>
                    {rfq.items.map((it, idx) => (
                      <p key={idx} className="text-ink-secondary">&bull; {it.quantity} {it.unit} of {it.name}</p>
                    ))}
                  </div>

                  <div className="text-xs text-ink-muted pt-1">
                    Deadline: <strong className="text-amber-800">{rfq.deadline}</strong> &bull; Total Bids: <strong>{rfq.bidsCount}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => setBiddingRFQ(rfq)}
                    icon={<Send className="w-3.5 h-3.5 text-brand-navy-dark" />}
                  >
                    Submit Quotation
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: BIDS */}
      {activeTab === 'bids' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-ink-primary">Submitted Quotations Tracker</h2>
          <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
            <div className="divide-y divide-surface-border">
              {myBids.map(bid => (
                <div key={bid.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-ink-primary">{bid.rfqTitle}</h4>
                    <p className="text-xs text-brand-navy font-semibold">{bid.schoolName}</p>
                    <p className="text-xs text-ink-secondary">Quoted Amount: <strong className="text-ink-primary">{formatGHS(bid.totalAmountGHS)}</strong> &bull; Delivery: {bid.deliveryTimelineDays} days</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    {bid.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Products & Services Catalog</h2>
              <p className="text-xs text-ink-secondary">Listings visible to school proprietors and bursars</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sup.products.map(prd => (
              <div key={prd.id} className="bg-white p-6 rounded-2xl border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                    {prd.category}
                  </span>
                  {prd.indicativePriceGHS && (
                    <span className="text-xs font-bold text-brand-navy">
                      {formatGHS(prd.indicativePriceGHS)} {prd.unit && `(${prd.unit})`}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-ink-primary">{prd.title}</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">{prd.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 border max-w-xl space-y-4">
          <h2 className="text-xl font-bold text-ink-primary">Company Profile & Contact</h2>
          <Input label="Business Legal Name" defaultValue={sup.businessName} />
          <Input label="Direct Phone" defaultValue={sup.phone} />
          <Input label="Official Email" defaultValue={sup.email} />
          <div className="pt-2">
            <Button variant="primary">Update Profile</Button>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT BID */}
      <Modal isOpen={Boolean(biddingRFQ)} onClose={handleCloseModal} title={bidSuccess ? 'Quotation Sent' : `Submit Quotation: ${biddingRFQ?.title}`} maxWidth="md">
        {bidSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink-primary">Quotation Submitted!</h3>
              <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                Your bid of <strong>{formatGHS(bidAmount)}</strong> has been delivered. Switch to the <strong>School Proprietor</strong> persona to evaluate your tender proposal in their Procurement module!
              </p>
            </div>
            <div className="pt-2">
              <Button variant="primary" onClick={handleCloseModal} className="w-full justify-center">Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBidSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1">
              <p><strong>School:</strong> {biddingRFQ?.schoolName}</p>
              <p><strong>Category:</strong> {biddingRFQ?.category}</p>
              <p><strong>Vendor:</strong> {sup.businessName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Total Quoted Amount (GHS)" type="number" required value={bidAmount} onChange={e => setBidAmount(Number(e.target.value))} />
              <Input label="Delivery Days" type="number" required value={deliveryDays} onChange={e => setDeliveryDays(Number(e.target.value))} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 uppercase">Proposal Terms & Notes</label>
              <textarea
                rows={3}
                required
                value={proposalNotes}
                onChange={e => setProposalNotes(e.target.value)}
                placeholder="Include payment terms, warranty specifications, and sample proofing..."
                className="w-full border rounded-lg p-3 text-sm focus:border-brand-navy outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="gold">Submit Bid</Button>
            </div>
          </form>
        )}
      </Modal>

    </DashboardLayout>
  );
};
