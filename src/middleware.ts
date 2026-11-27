import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

let clerkHandler: any = null;

export default function middleware(req: NextRequest, event: any) {
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  // If Clerk keys are not yet configured in the environment, pass through safely without 500 error
  if (!pubKey || !secretKey) {
    return NextResponse.next();
  }

  if (!clerkHandler) {
    const isProtectedRoute = createRouteMatcher([
      '/parents(.*)',
      '/super-admin(.*)',
      '/school-owners/dashboard(.*)',
      '/professionals/dashboard(.*)',
      '/suppliers/dashboard(.*)',
    ]);

    clerkHandler = clerkMiddleware(async (auth, request) => {
      if (isProtectedRoute(request)) {
        await auth.protect();
      }
    });
  }

  return clerkHandler(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
