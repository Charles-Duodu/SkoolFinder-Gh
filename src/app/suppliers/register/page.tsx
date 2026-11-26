import { Suspense } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { SupplierPortalPage } from '@/features/suppliers/SupplierPortalPage';

export default function SuppliersRegisterRoute() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-ink-secondary">Loading Vendor Onboarding...</div>}>
        <SupplierPortalPage initialTab="register" />
      </Suspense>
    </PublicShell>
  );
}
