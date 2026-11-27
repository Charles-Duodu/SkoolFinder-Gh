import { SignIn } from '@clerk/nextjs';
import { PublicShell } from '@/components/layout/PublicShell';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  const hasKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <PublicShell>
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 py-12">
        {hasKey ? (
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 'bg-[#0B1E36] hover:bg-[#132c4d] text-white text-sm font-semibold rounded-xl',
                card: 'glass-card border border-white/60 shadow-xl rounded-2xl',
                headerTitle: 'text-[#0B1E36] font-bold text-xl',
                headerSubtitle: 'text-slate-600 text-sm',
              },
            }}
          />
        ) : (
          <div className="glass-card p-8 rounded-2xl text-center max-w-md">
            <h2 className="text-xl font-bold text-brand-navy mb-2">Clerk Sign In</h2>
            <p className="text-sm text-ink-secondary">
              Authentication is initializing. Please verify Clerk environment variables in Vercel settings.
            </p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
