'use client';

import React from 'react';
import { DemoProvider } from '@/context/DemoContext';
import { DemoRoleBar } from '@/components/layout/DemoRoleBar';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface AppProvidersProps {
  children: React.ReactNode;
  showDemoBar: boolean;
}

export const AppProviders: React.FC<AppProvidersProps> = ({
  children,
  showDemoBar,
}) => {
  return (
    <DemoProvider>
      <div className="min-h-screen flex flex-col">
        {showDemoBar && <DemoRoleBar />}
        <ToastContainer />
        {children}
      </div>
    </DemoProvider>
  );
};
