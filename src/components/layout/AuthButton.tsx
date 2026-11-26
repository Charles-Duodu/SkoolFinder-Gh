'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '../ui/Button';
import { LogIn, UserCheck } from 'lucide-react';

export const AuthButton: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // When signed in: Display user status linking to their portal/dashboard.
  // Sign Out is intentionally placed exclusively inside the dashboard layouts, not on the public header.
  if (userEmail) {
    return (
      <Link href="/parents" title="Go to your portal workspace">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-colors">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="max-w-[140px] truncate">{userEmail}</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/sign-in">
      <Button variant="ghost" size="sm" icon={<LogIn className="w-3.5 h-3.5" />}>
        Sign In
      </Button>
    </Link>
  );
};
