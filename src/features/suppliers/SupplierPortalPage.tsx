import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { PortalHubBar, PortalHubMode } from '../../components/layout/PortalHubBar';
import { SupplierEntryPage } from './SupplierEntryPage';
import { SupplierOnboardingPage } from './SupplierOnboardingPage';
import { SupplierDashboardPage } from './SupplierDashboardPage';
import { Truck } from 'lucide-react';

interface SupplierPortalPageProps {
  initialTab?: PortalHubMode;
}

export const SupplierPortalPage: React.FC<SupplierPortalPageProps> = ({ initialTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { role, setRole } = useDemo();

  const queryTab = searchParams.get('tab') as PortalHubMode | null;
  const defaultMode: PortalHubMode = initialTab || queryTab || (role === 'supplier' ? 'dashboard' : 'overview');

  const [activeMode, setActiveMode] = useState<PortalHubMode>(defaultMode);
  const [welcomeNotice, setWelcomeNotice] = useState(false);

  useEffect(() => {
    if (queryTab && ['overview', 'register', 'dashboard'].includes(queryTab)) {
      setActiveMode(queryTab);
    } else if (initialTab) {
      setActiveMode(initialTab);
    }
  }, [queryTab, initialTab]);

  const handleModeChange = (mode: PortalHubMode) => {
    setActiveMode(mode);
    setSearchParams({ tab: mode });
    if (mode === 'dashboard' && role !== 'supplier') {
      setRole('supplier');
    }
  };

  const handleRegistrationComplete = () => {
    setRole('supplier');
    setWelcomeNotice(true);
    setActiveMode('dashboard');
    setSearchParams({ tab: 'dashboard' });
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <PortalHubBar
        portalTitle="Suppliers & Educational Vendors Portal"
        portalSubtitle="School Tenders, RFQs & B2B Procurement across 14 Supply Categories"
        portalBadge="14 Sectors"
        portalIcon={<Truck className="w-4 h-4" />}
        activeMode={activeMode}
        onModeChange={handleModeChange}
        registerLabel="Vendor Registration"
        dashboardLabel="Supplier Dashboard"
      />

      <div className="flex-1">
        {activeMode === 'overview' && (
          <SupplierEntryPage
            onStartRegister={() => handleModeChange('register')}
            onOpenDashboard={() => handleModeChange('dashboard')}
          />
        )}

        {activeMode === 'register' && (
          <div className="py-8">
            <SupplierOnboardingPage onComplete={handleRegistrationComplete} />
          </div>
        )}

        {activeMode === 'dashboard' && (
          <SupplierDashboardPage welcomeNotice={welcomeNotice} />
        )}
      </div>
    </div>
  );
};
