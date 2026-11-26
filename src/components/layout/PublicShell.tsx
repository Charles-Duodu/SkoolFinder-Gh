'use client';

import React from 'react';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';

export const PublicShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg relative overflow-x-hidden selection:bg-brand-gold/20 selection:text-brand-navy">
      {/* Atmospheric ambient lighting orbs for realistic frosted glass refraction */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-blue-400/12 via-indigo-400/6 to-transparent blur-[90px]" />
        <div className="absolute top-[38%] -left-48 w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-amber-400/10 via-amber-200/4 to-transparent blur-[100px]" />
        <div className="absolute top-[75%] right-[5%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-sky-400/10 via-indigo-300/5 to-transparent blur-[90px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </div>
  );
};
