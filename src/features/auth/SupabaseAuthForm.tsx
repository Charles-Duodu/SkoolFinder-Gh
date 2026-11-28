'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDemo } from '@/context/DemoContext';
import { UserRole } from '@/types';
import {
  Mail,
  Lock,
  Phone,
  User,
  School,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

interface SupabaseAuthFormProps {
  initialMode: 'sign-in' | 'sign-up';
}

export const SupabaseAuthForm: React.FC<SupabaseAuthFormProps> = ({ initialMode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole, addToast } = useDemo();
  const supabase = createClient();

  const nextUrl = searchParams?.get('next') || '';
  const callbackError = searchParams?.get('error');

  const [mode, setMode] = useState<'sign-in' | 'sign-up'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic_link'>('password');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [accountRole, setAccountRole] = useState<Exclude<UserRole, 'guest' | 'super_admin'>>('parent');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    callbackError ? 'Authentication link expired or invalid. Please sign in again.' : null
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getRedirectDestination = (roleName: string): string => {
    if (nextUrl && nextUrl.startsWith('/')) return nextUrl;
    switch (roleName) {
      case 'school_owner':
        return '/school-owners?tab=dashboard';
      case 'professional':
        return '/professionals?tab=dashboard';
      case 'supplier':
        return '/suppliers?tab=dashboard';
      case 'super_admin':
        return '/super-admin/dashboard';
      default:
        return '/parents';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!supabase) {
      setErrorMsg('Supabase environment variables are missing. Check .env.local.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'sign-in' && authMethod === 'magic_link') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl || '/parents')}`,
          },
        });
        if (error) throw error;
        setSuccessMsg(`Magic login link sent to ${email}. Check your inbox to complete sign-in.`);
        return;
      }

      if (mode === 'sign-in') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const userRole =
          (data.user?.app_metadata?.role as UserRole) ||
          (data.user?.user_metadata?.requested_role as UserRole) ||
          'parent';
        setRole(userRole);
        addToast({
          title: 'Signed In Successfully',
          message: `Welcome back to SkoolFinder Ghana (${data.user?.email}).`,
          type: 'success',
        });

        const destination = getRedirectDestination(userRole);
        window.location.assign(destination);
        return;
      }

      // Sign-Up Flow (Email-first + optional Phone + Persona Role)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getRedirectDestination(accountRole))}`,
          data: {
            full_name: fullName.trim() || email.split('@')[0],
            phone: phone.trim() || null,
            requested_role: accountRole,
          },
        },
      });

      if (error) throw error;

      // Fire branded welcome email via Resend (non-blocking)
      fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName: fullName.trim() || email.split('@')[0],
          role: accountRole,
        }),
      }).catch(() => {/* silent – welcome email is best-effort */});

      if (data.session) {
        setRole(accountRole);
        addToast({
          title: 'Account Created 🎉',
          message: `Welcome to SkoolFinder Ghana, ${fullName || email}! A welcome email is on its way.`,
          type: 'success',
        });
        window.location.assign(getRedirectDestination(accountRole));
      } else {
        setSuccessMsg(
          `✅ Account created! A confirmation + welcome email has been sent to ${email}. Verify your address to access your portal.`
        );
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-surface-border shadow-floating overflow-hidden">
      {/* Top Brand Header */}
      <div className="bg-gradient-to-r from-brand-navy-dark via-brand-navy to-brand-navy-light p-6 text-white space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-navy-dark border border-white/20 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-black tracking-tight text-base text-white">
              SkoolFinder
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            Supabase Auth
          </span>
        </div>

        <h1 className="text-xl font-extrabold pt-1">
          {mode === 'sign-in' ? 'Sign In to Your Portal' : 'Create Your Free Account'}
        </h1>
        <p className="text-xs text-slate-300">
          {nextUrl
            ? 'Authentication is required to access protected workspaces and private documents.'
            : 'Email-first access for Ghanaian parents, schools, teachers, and suppliers.'}
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 border-b border-surface-border bg-slate-50 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setMode('sign-in');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-3 transition-colors border-b-2 ${
            mode === 'sign-in'
              ? 'border-brand-navy text-brand-navy bg-white'
              : 'border-transparent text-ink-secondary hover:text-ink-primary'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('sign-up');
            setAuthMethod('password');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-3 transition-colors border-b-2 ${
            mode === 'sign-up'
              ? 'border-brand-navy text-brand-navy bg-white'
              : 'border-transparent text-ink-secondary hover:text-ink-primary'
          }`}
        >
          Create Account
        </button>
      </div>

      <div className="p-6 space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'sign-up' && (
            <>
              <div>
                <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider">
                  Account Type / Portal
                </label>
                <select
                  value={accountRole}
                  onChange={(e) => setAccountRole(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-surface-border rounded-xl bg-white font-semibold text-brand-navy outline-none focus:ring-2 focus:ring-brand-navy"
                >
                  <option value="parent">Parent / Guardian (Discovery & Admissions)</option>
                  <option value="school_owner">School Proprietor / Administrator</option>
                  <option value="professional">Licensed Teacher / Educator (NTC)</option>
                  <option value="supplier">Educational Supplier / Vendor</option>
                </select>
              </div>

              <Input
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ama Mensah"
                required
              />
            </>
          )}

          <Input
            label="Email Address (Required)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ama.mensah.accra@gmail.com"
            required
          />

          {mode === 'sign-up' && (
            <Input
              label="Ghana Phone Number (Optional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 24 000 0000"
            />
          )}

          {(mode === 'sign-up' || authMethod === 'password') && (
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          )}

          {mode === 'sign-in' && (
            <div className="flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() =>
                  setAuthMethod(authMethod === 'password' ? 'magic_link' : 'password')
                }
                className="text-brand-navy font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-brand-gold" />
                {authMethod === 'password'
                  ? 'Use passwordless Magic Email Link instead'
                  : 'Sign in with password instead'}
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="gold"
            size="md"
            disabled={loading}
            className="w-full justify-center"
            icon={<ArrowRight className="w-4 h-4 text-brand-navy-dark" />}
          >
            {loading
              ? 'Authenticating...'
              : mode === 'sign-in'
              ? authMethod === 'magic_link'
                ? 'Send Magic Login Link'
                : 'Sign In'
              : 'Create Free Account'}
          </Button>
        </form>

        <div className="pt-2 text-center">
          <Link href="/schools" className="text-[11px] text-ink-secondary hover:text-brand-navy underline">
            Return to Public Greater Accra Directory
          </Link>
        </div>
      </div>
    </div>
  );
};
