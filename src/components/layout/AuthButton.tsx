'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '../ui/Button';
import { LogIn, LogOut, UserCheck } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export const AuthButton: React.FC = () => {
  const router = useRouter();
  const { setRole, addToast } = useDemo();
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

  const handleSignOut = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUserEmail(null);
    setRole('guest');
    addToast({
      title: 'Signed Out',
      message: 'You have been securely signed out of SkoolFinder Ghana.',
      type: 'info',
    });
    router.refresh();
    router.push('/');
  };

  if (userEmail) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-900">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="max-w-[130px] truncate">{userEmail}</span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          icon={<LogOut className="w-3.5 h-3.5" />}
        >
          Sign Out
        </Button>
      </div>
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
