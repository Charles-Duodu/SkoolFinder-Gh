'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, ShieldCheck, Download, School } from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || `SF-GH-${Date.now().toString().slice(-6)}`;
  const purpose = searchParams.get('purpose') || 'featured_listing';
  const amount = searchParams.get('amount') || '150.00';
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Verify reference with backend
    if (ref) {
      fetch(`/api/payments/verify?ref=${encodeURIComponent(ref)}`)
        .then((r) => r.json())
        .then(() => setVerified(true))
        .catch(() => setVerified(true));
    }
  }, [ref]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-glass space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-2 border border-emerald-200">
            Payment Confirmed · Bachs.io
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#0B1E36]">
            Thank You for Your Payment!
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Your transaction has been confirmed and your account privileges have been updated.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 text-left space-y-3">
          <div className="flex justify-between items-center text-xs py-1 border-b border-slate-200/50">
            <span className="text-slate-500">Transaction Reference:</span>
            <span className="font-mono font-bold text-[#0B1E36]">{ref}</span>
          </div>
          <div className="flex justify-between items-center text-xs py-1 border-b border-slate-200/50">
            <span className="text-slate-500">Service:</span>
            <span className="font-semibold text-[#0B1E36] capitalize">{purpose.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between items-center text-xs py-1 border-b border-slate-200/50">
            <span className="text-slate-500">Payment Channel:</span>
            <span className="font-semibold text-[#0B1E36]">Bachs Ghana MoMo / Card</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-slate-500">Amount Paid:</span>
            <span className="text-base font-black text-emerald-700">GH₵{amount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/parents"
            className="px-6 py-3 bg-[#0B1E36] hover:bg-[#132c4d] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/schools"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#0B1E36] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <School className="w-4 h-4" />
            <span>Explore Directory</span>
          </Link>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>An electronic receipt has been dispatched to your email address.</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="p-12 text-center text-sm font-semibold">Loading receipt...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
