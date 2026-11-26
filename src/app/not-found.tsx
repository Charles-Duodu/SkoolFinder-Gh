import Link from 'next/link';
import { PublicShell } from '@/components/layout/PublicShell';

export default function NotFound() {
  return (
    <PublicShell>
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-brand-navy">404</h1>
        <h2 className="text-xl font-bold text-ink-primary">Page Not Found</h2>
        <p className="text-xs text-ink-secondary max-w-sm">
          The requested path does not exist in SkoolFinder Ghana.
        </p>
        <Link href="/" className="px-4 py-2 bg-brand-navy text-white text-xs font-bold rounded-lg">
          Return to Homepage
        </Link>
      </div>
    </PublicShell>
  );
}
