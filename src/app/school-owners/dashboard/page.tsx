import { Suspense } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { SchoolPortalPage } from '@/features/schools/SchoolPortalPage';

export default function SchoolOwnersDashboardRoute() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-ink-secondary">Loading School Dashboard...</div>}>
        <SchoolPortalPage initialTab="dashboard" />
      </Suspense>
    </PublicShell>
  );
}
