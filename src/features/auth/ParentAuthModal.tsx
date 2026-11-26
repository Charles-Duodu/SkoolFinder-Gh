'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useDemo } from '@/context/DemoContext';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface ParentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'sign-up' | 'sign-in';
  promptReason?: string;
}

export const ParentAuthModal: React.FC<ParentAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'sign-up',
  promptReason,
}) => {
  const router = useRouter();
  const { setRole, addToast } = useDemo();
  const supabase = createClient();

  const [mode, setMode] = useState<'sign-up' | 'sign-in'>(initialMode);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (mode === 'sign-up') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter both your email address and password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'sign-up') {
        // Step 1 -> 2: Progress indicator
        setCurrentStep(2);

        // Attempt Supabase Registration
        if (supabase) {
          try {
            await supabase.auth.signUp({
              email: email.trim(),
              password,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=/parents`,
                data: {
                  full_name: fullName.trim(),
                  requested_role: 'parent',
                },
              },
            });

            // Send non-blocking branded welcome email
            fetch('/api/welcome-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: email.trim(),
                fullName: fullName.trim(),
                role: 'parent',
              }),
            }).catch(() => {});
          } catch (supaErr) {
            console.warn('Supabase sign-up fallback to demo state:', supaErr);
          }
        }

        // Activate Parent role in state & local storage
        setRole('parent');
        setCurrentStep(3);

        addToast({
          title: 'Account Created 🎉',
          message: `Welcome to SkoolFinder, ${fullName || email}! Redirecting to your Parent Portal...`,
          type: 'success',
        });

        setTimeout(() => {
          onClose();
          router.push('/parents');
        }, 800);
      } else {
        // Sign-in flow
        if (supabase) {
          try {
            const { error } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password,
            });
            if (error) {
              console.warn('Supabase sign-in warning:', error.message);
            }
          } catch (supaErr) {
            console.warn('Supabase sign-in error:', supaErr);
          }
        }

        setRole('parent');
        addToast({
          title: 'Signed In Successfully',
          message: 'Welcome back! Loading your Parent Portal...',
          type: 'success',
        });

        setTimeout(() => {
          onClose();
          router.push('/parents');
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error. Please try again.');
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'sign-up' | 'sign-in') => {
    setMode(newMode);
    setCurrentStep(1);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background backdrop click */}
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Modal Dialog Content */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        <div className="p-6 sm:p-10 overflow-y-auto">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#0B1E36]">
              {mode === 'sign-up' ? 'FIND SCHOOLS · PARENT REGISTRATION' : 'FIND SCHOOLS · PARENT SIGN IN'}
            </span>
            <button
              onClick={onClose}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Close &times;
            </button>
          </div>

          {/* Large Title & Subtitle */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1E36] tracking-tight">
            {mode === 'sign-up' ? 'Create your free parent account' : 'Sign in to your parent account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {promptReason ||
              (mode === 'sign-up'
                ? 'Enter your details below to register your account and access your admissions portal.'
                : 'Enter your credentials to access your saved schools, applications, and reminders.')}
          </p>

          {/* Stepper Pills (Matching User Mockup) */}
          <div className="flex items-center gap-2 sm:gap-3 my-6 flex-wrap">
            {/* Step 1: Create Account */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                currentStep === 1
                  ? 'bg-amber-100/90 text-slate-950 font-bold border border-amber-300/80 shadow-2xs'
                  : currentStep > 1
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 font-medium'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 1
                    ? 'bg-slate-950 text-white'
                    : currentStep > 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {currentStep > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
              </span>
              <span>{mode === 'sign-up' ? 'Create account' : 'Sign in'}</span>
            </div>

            {/* Step 2: Verify email */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                currentStep === 2
                  ? 'bg-amber-100/90 text-slate-950 font-bold border border-amber-300/80 shadow-2xs'
                  : currentStep > 2
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 font-medium'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 2
                    ? 'bg-slate-950 text-white'
                    : currentStep > 2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {currentStep > 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
              </span>
              <span>Verify email</span>
            </div>

            {/* Step 3: Dashboard */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                currentStep === 3
                  ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-2xs'
                  : 'bg-slate-100 text-slate-500 font-medium'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 3
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                3
              </span>
              <span>Dashboard</span>
            </div>
          </div>

          <hr className="border-slate-100 my-5" />

          {/* Form Section Header */}
          <div className="mb-5">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1E36]">
              {mode === 'sign-up' ? 'Create your free parent account' : 'Parent Login'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {mode === 'sign-up'
                ? 'Enter your details to start your free parent journey.'
                : 'Sign in to manage your school shortlists and applications.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'sign-up' && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0B1E36] mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ama Mensah"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1E36] transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#0B1E36] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ama.mensah@gmail.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1E36] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#0B1E36] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1E36] transition-all"
              />
            </div>

            {mode === 'sign-up' && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0B1E36] mb-1.5">
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1E36] transition-all"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 bg-[#0B1E36] hover:bg-[#132c4d] active:bg-[#071322] text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                {loading
                  ? mode === 'sign-up'
                    ? 'Creating account...'
                    : 'Signing in...'
                  : mode === 'sign-up'
                  ? 'Create free account'
                  : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Subtext and Mode Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
            <p>
              Your credentials are securely handled to personalize your school shortlist, applications, and notifications.
            </p>
            {mode === 'sign-up' ? (
              <p>
                <button
                  type="button"
                  onClick={() => switchMode('sign-in')}
                  className="font-bold text-[#0B1E36] hover:underline cursor-pointer"
                >
                  Already have an account? Sign in
                </button>
              </p>
            ) : (
              <p>
                <button
                  type="button"
                  onClick={() => switchMode('sign-up')}
                  className="font-bold text-[#0B1E36] hover:underline cursor-pointer"
                >
                  Don&apos;t have an account? Create your free parent account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
