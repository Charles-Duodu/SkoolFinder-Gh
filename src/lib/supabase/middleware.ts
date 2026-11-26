import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/parents',
  '/super-admin',
  '/school-owners/dashboard',
  '/professionals/dashboard',
  '/suppliers/dashboard',
];

function isProtectedPath(pathname: string, searchParams: URLSearchParams): boolean {
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  if (
    (pathname === '/school-owners' ||
      pathname === '/professionals' ||
      pathname === '/suppliers') &&
    searchParams.get('tab') === 'dashboard'
  ) {
    return true;
  }
  return false;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        if (headers) {
          Object.entries(headers).forEach(([headerKey, headerValue]) =>
            supabaseResponse.headers.set(headerKey, headerValue)
          );
        }
      },
    },
  });

  // Validate JWT signature locally/via JWKS with getClaims() (never use getSession() on server)
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/auth');

  if (!claims && !isAuthPage && isProtectedPath(pathname, request.nextUrl.searchParams)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/sign-in';
    const nextPath = pathname + (request.nextUrl.search || '');
    loginUrl.search = `?next=${encodeURIComponent(nextPath)}`;
    return NextResponse.redirect(loginUrl);
  }

  // Enforce super_admin role for `/super-admin/*` routes
  if (claims && pathname.startsWith('/super-admin')) {
    const roleClaim = (claims as Record<string, unknown> & { app_metadata?: { role?: string } })
      ?.app_metadata?.role;
    let isSuperAdmin = roleClaim === 'super_admin';

    if (!isSuperAdmin && claims.sub) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', claims.sub)
        .maybeSingle();
      isSuperAdmin = profile?.role === 'super_admin';
    }

    if (!isSuperAdmin) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      homeUrl.search = '';
      return NextResponse.redirect(homeUrl);
    }
  }

  if (claims && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    const nextParam = request.nextUrl.searchParams.get('next');
    const roleClaim = (claims as Record<string, unknown> & { app_metadata?: { role?: string } })
      ?.app_metadata?.role;
    const roleHome =
      roleClaim === 'super_admin'
        ? '/super-admin/dashboard'
        : roleClaim === 'school_owner'
        ? '/school-owners?tab=dashboard'
        : roleClaim === 'professional'
        ? '/professionals?tab=dashboard'
        : roleClaim === 'supplier'
        ? '/suppliers?tab=dashboard'
        : '/parents';
    const targetUrl = request.nextUrl.clone();
    const safeNext = nextParam && nextParam.startsWith('/') ? nextParam : roleHome;
    const [targetPath, targetQuery] = safeNext.split('?');
    targetUrl.pathname = targetPath;
    targetUrl.search = targetQuery ? `?${targetQuery}` : '';
    return NextResponse.redirect(targetUrl);
  }

  return supabaseResponse;
}
