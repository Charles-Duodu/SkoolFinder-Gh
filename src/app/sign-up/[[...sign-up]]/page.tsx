import { Suspense } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { SupabaseAuthForm } from '@/features/auth/SupabaseAuthForm';

export default function SignUpPage() {
  return (
    <PublicShell>
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
        <Suspense fallback={<div className="text-xs text-ink-secondary">Loading registration...</div>}>
          <SupabaseAuthForm initialMode="sign-up" />
        </Suspense>
      </div>
    </PublicShell>
  );
}
