'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '../ui/Button';
import { LogOut } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

interface SignOutButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({
  variant = 'outline',
  size = 'sm',
  className = '',
  label = 'Sign Out',
  showIcon = true,
}) => {
  const [loading, setLoading] = useState(false);
  const { setRole, addToast } = useDemo();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      setRole('guest');
      addToast({
        title: 'Signed Out',
        message: 'You have been securely signed out of your portal.',
        type: 'info',
      });
      // Using window.location.assign ensures a complete refresh and resets all server cookies cleanly
      window.location.assign('/');
    } catch (err) {
      console.error('Sign out error:', err);
      window.location.assign('/');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={loading}
      onClick={handleSignOut}
      icon={showIcon ? <LogOut className="w-3.5 h-3.5" /> : undefined}
    >
      {loading ? 'Signing out...' : label}
    </Button>
  );
};
