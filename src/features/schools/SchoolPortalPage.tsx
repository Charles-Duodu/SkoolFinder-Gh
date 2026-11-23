import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { PortalHubBar, PortalHubMode } from '../../components/layout/PortalHubBar';
import { SchoolEntryPage } from './SchoolEntryPage';
import { SchoolRegistrationPage } from './SchoolRegistrationPage';
import { SchoolDashboardPage } from './SchoolDashboardPage';
import { School } from 'lucide-react';

interface SchoolPortalPageProps {
  initialTab?: PortalHubMode;
}

export const SchoolPortalPage: React.FC<SchoolPortalPageProps> = ({ initialTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { role, setRole } = useDemo();

  // Determine initial active mode from prop, query parameter, or user's active role
  const queryTab = searchParams.get('tab') as PortalHubMode | null;
  const defaultMode: PortalHubMode = initialTab || queryTab || (role === 'school_owner' ? 'dashboard' : 'overview');

  const [activeMode, setActiveMode] = useState<PortalHubMode>(defaultMode);
  const [welcomeNotice, setWelcomeNotice] = useState(false);

  // Sync mode if query param changes or if user switches persona / route prop
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
    if (mode === 'dashboard' && role !== 'school_owner') {
      setRole('school_owner');
    }
  };

  const handleRegistrationComplete = () => {
    setRole('school_owner');
    setWelcomeNotice(true);
    setActiveMode('dashboard');
    setSearchParams({ tab: 'dashboard' });
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      {/* Top Portal Hub Navigation Bar */}
      <PortalHubBar
        portalTitle="School Owners & Administrators Portal"
        portalSubtitle="Institutional Management, Recruitment & Procurement in Greater Accra"
        portalBadge="Greater Accra"
        portalIcon={<School className="w-4 h-4" />}
        activeMode={activeMode}
        onModeChange={handleModeChange}
        registerLabel="School Registration"
        dashboardLabel="Management Dashboard"
      />

      {/* Render Active Portal Mode */}
      <div className="flex-1">
        {activeMode === 'overview' && (
          <SchoolEntryPage
            onStartRegister={() => handleModeChange('register')}
            onOpenDashboard={() => handleModeChange('dashboard')}
          />
        )}

        {activeMode === 'register' && (
          <div className="py-8">
            <SchoolRegistrationPage onComplete={handleRegistrationComplete} />
          </div>
        )}

        {activeMode === 'dashboard' && (
          <SchoolDashboardPage welcomeNotice={welcomeNotice} />
        )}
      </div>
    </div>
  );
};
