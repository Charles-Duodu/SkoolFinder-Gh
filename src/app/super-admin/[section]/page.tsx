import { notFound } from 'next/navigation';
import { SuperAdminDashboardPage } from '@/features/super-admin/SuperAdminDashboardPage';
import { ApplicationsCentrePage } from '@/features/super-admin/ApplicationsCentrePage';
import { DirectoriesManagementPage } from '@/features/super-admin/DirectoriesManagementPage';
import { SafeguardingCasesPage } from '@/features/super-admin/SafeguardingCasesPage';
import { AdminRolesAnalyticsCMSPage } from '@/features/super-admin/AdminRolesAnalyticsCMSPage';

const DIRECTORY_TABS = new Set([
  'schools',
  'parents',
  'professionals',
  'suppliers',
  'recruitment',
  'procurement',
] as const);

const CMS_VIEWS = new Set(['roles', 'analytics', 'cms', 'settings'] as const);

export default async function SuperAdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (section === 'dashboard') {
    return <SuperAdminDashboardPage />;
  }
  if (section === 'approvals') {
    return <ApplicationsCentrePage />;
  }
  if (section === 'safeguarding' || section === 'cases') {
    return <SafeguardingCasesPage />;
  }
  if (DIRECTORY_TABS.has(section as any)) {
    return (
      <DirectoriesManagementPage
        initialTab={
          section as 'schools' | 'parents' | 'professionals' | 'suppliers' | 'recruitment' | 'procurement'
        }
      />
    );
  }
  if (CMS_VIEWS.has(section as any)) {
    return (
      <AdminRolesAnalyticsCMSPage
        initialView={section as 'roles' | 'analytics' | 'cms' | 'settings'}
      />
    );
  }

  notFound();
}
