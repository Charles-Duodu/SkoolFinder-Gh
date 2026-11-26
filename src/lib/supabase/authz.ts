import { NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createClient, getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase/server';
import type { UserRole } from '@/types';

export interface AuthContext {
  user: User | null;
  role: UserRole;
  userClient: SupabaseClient | null;
  adminClient: SupabaseClient | null;
}

/**
 * Resolves the signed-in Supabase user and their authoritative role from
 * `public.profiles` (or `app_metadata`), never trusting client-editable `user_metadata`.
 */
export async function getAuthenticatedUserContext(): Promise<AuthContext> {
  const userClient = await createClient();
  const adminClient = getSupabaseAdminClient();

  if (!isSupabaseConfigured() || !userClient) {
    return { user: null, role: 'guest', userClient, adminClient };
  }

  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    return { user: null, role: 'guest', userClient, adminClient };
  }

  const appRole = user.app_metadata?.role as UserRole | undefined;
  const reader = adminClient ?? userClient;
  const { data: profile } = await reader
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const resolvedRole = (appRole || (profile?.role as UserRole) || 'parent') as UserRole;
  return { user, role: resolvedRole, userClient, adminClient };
}

/**
 * Guards an API route by requiring an authenticated user whose authoritative role
 * matches `allowedRoles`. Returns `demo: true` only when Supabase isn't configured.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<
  | { ok: true; demo: true; user: null; role: UserRole; db: null }
  | {
      ok: true;
      demo: false;
      user: User;
      role: UserRole;
      userClient: SupabaseClient;
      db: SupabaseClient;
    }
  | { ok: false; response: NextResponse }
> {
  if (!isSupabaseConfigured()) {
    return { ok: true, demo: true, user: null, role: 'super_admin', db: null };
  }

  const { user, role, userClient, adminClient } = await getAuthenticatedUserContext();
  if (!user || !userClient) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (!allowedRoles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: `Forbidden: requires role ${allowedRoles.join(' or ')}` },
        { status: 403 }
      ),
    };
  }

  const db = adminClient ?? userClient;
  return { ok: true, demo: false, user, role, userClient, db };
}

/**
 * Verifies whether a user is allowed to manage a specific school record
 * (`super_admin` or the assigned `owner_user_id` of the school).
 */
export async function canManageSchool(
  db: SupabaseClient,
  userId: string,
  role: UserRole,
  schoolId: string
): Promise<boolean> {
  if (role === 'super_admin') return true;
  const { data: school } = await db
    .from('schools')
    .select('owner_user_id')
    .eq('id', schoolId)
    .maybeSingle();
  return Boolean(school && school.owner_user_id === userId);
}
