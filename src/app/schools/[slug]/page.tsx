import { PublicShell } from '@/components/layout/PublicShell';
import { SchoolDetailPage } from '@/features/discovery/SchoolDetailPage';

export default function SchoolDetailRoute() {
  return (
    <PublicShell>
      <SchoolDetailPage />
    </PublicShell>
  );
}
