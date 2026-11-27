'use client';

import React, { useState } from 'react';
import { CreditCard, Smartphone, Check, Loader2, ShieldCheck, X } from 'lucide-react';

interface BachsCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  amountGhs: number;
  purpose: 'featured_listing' | 'admission_application' | 'claim_verification' | 'tender_bid';
  targetId?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  onSuccess?: () => void;
}

export const BachsCheckoutModal: React.FC<BachsCheckoutModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  amountGhs,
  purpose,
  targetId,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<'momo' | 'card'>('momo');

  if (!isOpen) return null;

  const handleProceedToPayment = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountGhs,
          purpose,
          title,
          description,
          targetId,
          origin: currentOrigin,
          metadata: {
            customerEmail,
            customerName,
            customerPhone,
            selectedChannel,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      if (data.checkoutUrl) {
        let targetUrl = data.checkoutUrl;
        // Client safety guard: Never redirect to localhost when browsing on live domain
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && targetUrl.includes('localhost')) {
          targetUrl = targetUrl.replace(/https?:\/\/localhost(:\d+)?/, window.location.origin);
        }
        window.location.href = targetUrl;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment initiation failed.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="bg-[#0B1E36] p-6 text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-[#0B1E36] font-bold text-[10px] uppercase tracking-wider mb-1.5">
              Powered by Bachs.io
            </div>
            <h3 className="text-lg font-serif font-bold text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Secure Ghana Mobile Money & Card Checkout
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Amount Badge */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Total payable:</span>
              <div className="text-2xl font-black text-[#0B1E36] tracking-tight">
                GH₵{amountGhs.toFixed(2)}
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              Instant Activation
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {description}
          </p>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0B1E36] mb-2 uppercase tracking-wider">
              Select Preferred Payment Channel
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedChannel('momo')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  selectedChannel === 'momo'
                    ? 'border-[#0B1E36] bg-slate-50 ring-2 ring-[#0B1E36]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#0B1E36]" />
                  <span className="text-xs font-bold text-[#0B1E36]">Mobile Money</span>
                </div>
                <span className="text-[10px] text-slate-500">MTN, Telecel, AT Money</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannel('card')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  selectedChannel === 'card'
                    ? 'border-[#0B1E36] bg-slate-50 ring-2 ring-[#0B1E36]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0B1E36]" />
                  <span className="text-xs font-bold text-[#0B1E36]">Debit / Credit</span>
                </div>
                <span className="text-[10px] text-slate-500">Visa, Mastercard</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleProceedToPayment}
              className="w-full py-3.5 bg-[#0B1E36] hover:bg-[#132c4d] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Bachs...</span>
                </>
              ) : (
                <>
                  <span>Pay GH₵{amountGhs.toFixed(2)} with Bachs &rarr;</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit bank encryption · Regulated Ghanaian payment rails</span>
          </div>
        </div>
      </div>
    </div>
  );
};
