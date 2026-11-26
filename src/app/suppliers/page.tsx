import { Suspense } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { SupplierPortalPage } from '@/features/suppliers/SupplierPortalPage';

export default function SuppliersRoute() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-ink-secondary">Loading Suppliers Portal...</div>}>
        <SupplierPortalPage />
      </Suspense>
    </PublicShell>
  );
}
