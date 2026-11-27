import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/parents(.*)',
  '/super-admin(.*)',
  '/school-owners/dashboard(.*)',
  '/professionals/dashboard(.*)',
  '/suppliers/dashboard(.*)',
]);

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default function middleware(req: NextRequest, event: any) {
  const hasClerkKeys = 
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && 
    Boolean(process.env.CLERK_SECRET_KEY);

  if (!hasClerkKeys) {
    return NextResponse.next();
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
