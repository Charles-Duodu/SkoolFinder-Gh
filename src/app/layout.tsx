import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import '@/styles/index.css';
import { AppProviders } from '@/components/providers/AppProviders';

export const metadata: Metadata = {
  title: 'SkoolFinder Ghana | Private School Discovery & Education Ecosystem',
  description:
    'Discover top private crèches, nursery, kindergarten, primary, JHS, and senior high schools in Greater Accra, Ghana. Connect with schools, educators, and vetted suppliers.',
  icons: {
    icon: '/logo-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showDemoBar = process.env.NEXT_PUBLIC_ENABLE_DEMO_BAR !== 'false';
  const clerkPubKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    'pk_test_Y2FyaW5nLXBvbGxpd29nLTgzODEuY2xlcmsuYWNjb3VudHMuZGV2JA';

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-surface-bg text-ink-primary font-sans antialiased min-h-screen selection:bg-brand-gold/20 selection:text-brand-navy">
          <AppProviders showDemoBar={showDemoBar}>
            {children}
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
