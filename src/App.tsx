import React from 'react';
import { Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';
import { DemoRoleBar } from './components/layout/DemoRoleBar';
import { PublicNavbar } from './components/layout/PublicNavbar';
import { PublicFooter } from './components/layout/PublicFooter';

// Public Feature Pages
import { HomePage } from './features/discovery/HomePage';
import { SchoolSearchPage } from './features/discovery/SchoolSearchPage';
import { SchoolDetailPage } from './features/discovery/SchoolDetailPage';
import { SchoolComparisonPage } from './features/discovery/SchoolComparisonPage';

// Parents Portal
import { ParentsPortalPage } from './features/parents/ParentsPortalPage';

// Schools Portal
import { SchoolEntryPage } from './features/schools/SchoolEntryPage';
import { SchoolRegistrationPage } from './features/schools/SchoolRegistrationPage';
import { SchoolDashboardPage } from './features/schools/SchoolDashboardPage';

// Professionals Portal
import { ProfessionalEntryPage } from './features/professionals/ProfessionalEntryPage';
import { ProfessionalOnboardingPage } from './features/professionals/ProfessionalOnboardingPage';
import { ProfessionalDashboardPage } from './features/professionals/ProfessionalDashboardPage';

// Suppliers Portal
import { SupplierEntryPage } from './features/suppliers/SupplierEntryPage';
import { SupplierOnboardingPage } from './features/suppliers/SupplierOnboardingPage';
import { SupplierDashboardPage } from './features/suppliers/SupplierDashboardPage';

// Super Admin Portal
import { SuperAdminDashboardPage } from './features/super-admin/SuperAdminDashboardPage';
import { ApplicationsCentrePage } from './features/super-admin/ApplicationsCentrePage';
import { DirectoriesManagementPage } from './features/super-admin/DirectoriesManagementPage';
import { SafeguardingCasesPage } from './features/super-admin/SafeguardingCasesPage';
import { AdminRolesAnalyticsCMSPage } from './features/super-admin/AdminRolesAnalyticsCMSPage';

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

// 404 Not Found Page
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h1 className="text-4xl font-extrabold text-brand-navy">404</h1>
      <h2 className="text-xl font-bold text-ink-primary">Page Not Found</h2>
      <p className="text-xs text-ink-secondary max-w-sm">
        The requested path does not exist in the SkoolFinder Ghana prototype.
      </p>
      <Link to="/" className="px-4 py-2 bg-brand-navy text-white text-xs font-bold rounded-lg">
        Return to Homepage
      </Link>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Universal Demo Switcher Toolbar */}
      <DemoRoleBar />

      <Routes>
        {/* Public Marketing & Discovery Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/schools" element={<SchoolSearchPage />} />
          <Route path="/schools/:slug" element={<SchoolDetailPage />} />
          <Route path="/compare" element={<SchoolComparisonPage />} />
          
          {/* Public Portal Entry Pages */}
          <Route path="/school-owners" element={<SchoolEntryPage />} />
          <Route path="/school-owners/register" element={<SchoolRegistrationPage />} />
          
          <Route path="/professionals" element={<ProfessionalEntryPage />} />
          <Route path="/professionals/register" element={<ProfessionalOnboardingPage />} />
          
          <Route path="/suppliers" element={<SupplierEntryPage />} />
          <Route path="/suppliers/register" element={<SupplierOnboardingPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Parents Portal Dashboard Routes */}
        <Route path="/parents" element={<Navigate to="/parents/dashboard" replace />} />
        <Route path="/parents/dashboard" element={<ParentsPortalPage />} />
        <Route path="/parents/saved" element={<ParentsPortalPage />} />
        <Route path="/parents/shortlist" element={<ParentsPortalPage />} />
        <Route path="/parents/comparisons" element={<ParentsPortalPage />} />
        <Route path="/parents/enquiries" element={<ParentsPortalPage />} />
        <Route path="/parents/alerts" element={<ParentsPortalPage />} />
        <Route path="/parents/settings" element={<ParentsPortalPage />} />

        {/* School Proprietor Portal Routes */}
        <Route path="/school-owners/dashboard" element={<SchoolDashboardPage />} />

        {/* Teachers & Professionals Portal Routes */}
        <Route path="/professionals/dashboard" element={<ProfessionalDashboardPage />} />

        {/* Suppliers & Vendors Portal Routes */}
        <Route path="/suppliers/dashboard" element={<SupplierDashboardPage />} />

        {/* Super Admin Governance Routes */}
        <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboardPage />} />
        <Route path="/super-admin/approvals" element={<ApplicationsCentrePage />} />
        <Route path="/super-admin/schools" element={<DirectoriesManagementPage initialTab="schools" />} />
        <Route path="/super-admin/parents" element={<DirectoriesManagementPage initialTab="parents" />} />
        <Route path="/super-admin/professionals" element={<DirectoriesManagementPage initialTab="professionals" />} />
        <Route path="/super-admin/suppliers" element={<DirectoriesManagementPage initialTab="suppliers" />} />
        <Route path="/super-admin/recruitment" element={<DirectoriesManagementPage initialTab="recruitment" />} />
        <Route path="/super-admin/procurement" element={<DirectoriesManagementPage initialTab="procurement" />} />
        <Route path="/super-admin/safeguarding" element={<SafeguardingCasesPage />} />
        <Route path="/super-admin/cases" element={<SafeguardingCasesPage />} />
        <Route path="/super-admin/roles" element={<AdminRolesAnalyticsCMSPage initialView="roles" />} />
        <Route path="/super-admin/analytics" element={<AdminRolesAnalyticsCMSPage initialView="analytics" />} />
        <Route path="/super-admin/cms" element={<AdminRolesAnalyticsCMSPage initialView="cms" />} />
        <Route path="/super-admin/settings" element={<AdminRolesAnalyticsCMSPage initialView="settings" />} />
      </Routes>
    </div>
  );
};
