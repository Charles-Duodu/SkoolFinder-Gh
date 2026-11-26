'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { PortalHubBar, PortalHubMode } from '../../components/layout/PortalHubBar';
import { ProfessionalEntryPage } from './ProfessionalEntryPage';
import { ProfessionalOnboardingPage } from './ProfessionalOnboardingPage';
import { ProfessionalDashboardPage } from './ProfessionalDashboardPage';
import { Briefcase } from 'lucide-react';

interface ProfessionalPortalPageProps {
  initialTab?: PortalHubMode;
}

export const ProfessionalPortalPage: React.FC<ProfessionalPortalPageProps> = ({ initialTab }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role, setRole } = useDemo();

  const queryTab = searchParams?.get('tab') as PortalHubMode | null;
  const defaultMode: PortalHubMode = initialTab || queryTab || (role === 'professional' ? 'dashboard' : 'overview');

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
    router.replace(`/professionals?tab=${mode}`);
    if (mode === 'dashboard' && role !== 'professional') {
      setRole('professional');
    }
  };

  const handleRegistrationComplete = () => {
    setRole('professional');
    setWelcomeNotice(true);
    setActiveMode('dashboard');
    router.replace('/professionals?tab=dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <PortalHubBar
        portalTitle="Teachers & Education Professionals Portal"
        portalSubtitle="Teaching Careers, NTC Vetting & Tutoring Services in Greater Accra"
        portalBadge="NTC Accredited"
        portalIcon={<Briefcase className="w-4 h-4" />}
        activeMode={activeMode}
        onModeChange={handleModeChange}
        registerLabel="Profile Registration"
        dashboardLabel="Professional Workspace"
      />

      <div className="flex-1">
        {activeMode === 'overview' && (
          <ProfessionalEntryPage
            onStartRegister={() => handleModeChange('register')}
            onOpenDashboard={() => handleModeChange('dashboard')}
          />
        )}

        {activeMode === 'register' && (
          <div className="py-8">
            <ProfessionalOnboardingPage onComplete={handleRegistrationComplete} />
          </div>
        )}

        {activeMode === 'dashboard' && (
          <ProfessionalDashboardPage welcomeNotice={welcomeNotice} />
        )}
      </div>
    </div>
  );
};
