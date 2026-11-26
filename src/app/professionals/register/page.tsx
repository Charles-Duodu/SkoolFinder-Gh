import { Suspense } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { ProfessionalPortalPage } from '@/features/professionals/ProfessionalPortalPage';

export default function ProfessionalsRegisterRoute() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-ink-secondary">Loading Educator Registration...</div>}>
        <ProfessionalPortalPage initialTab="register" />
      </Suspense>
    </PublicShell>
  );
}
