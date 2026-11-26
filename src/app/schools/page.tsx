import { Suspense } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { SchoolSearchPage } from '@/features/discovery/SchoolSearchPage';

export default function SchoolsDirectoryRoute() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-ink-secondary">Loading Greater Accra directory...</div>}>
        <SchoolSearchPage />
      </Suspense>
    </PublicShell>
  );
}
