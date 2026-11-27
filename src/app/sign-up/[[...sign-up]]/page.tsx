import { SignUp } from '@clerk/nextjs';
import { PublicShell } from '@/components/layout/PublicShell';

export default function SignUpPage() {
  return (
    <PublicShell>
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 py-12">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#0B1E36] hover:bg-[#132c4d] text-white text-sm font-semibold rounded-xl',
              card: 'glass-card border border-white/60 shadow-xl rounded-2xl',
              headerTitle: 'text-[#0B1E36] font-bold text-xl',
              headerSubtitle: 'text-slate-600 text-sm',
            },
          }}
        />
      </div>
    </PublicShell>
  );
}
