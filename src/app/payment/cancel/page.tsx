'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-glass space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <XCircle className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0B1E36]">
            Payment Cancelled
          </h1>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your checkout transaction was cancelled and no funds were debited from your Mobile Money or bank account.
          </p>
          {ref && (
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Ref: {ref}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            href="/parents"
            className="w-full py-3 bg-[#0B1E36] hover:bg-[#132c4d] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/schools"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#0B1E36] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <span>Browse Schools</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="p-12 text-center text-sm font-semibold">Loading...</div>}>
          <PaymentCancelContent />
        </Suspense>
      </main>
    </div>
  );
}
