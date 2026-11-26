import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/server';

export async function GET() {
  const supabaseConfigured = isSupabaseConfigured();
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  return NextResponse.json({
    status: 'ok',
    service: 'SkoolFinder Ghana Fullstack Next.js API',
    integrations: {
      supabaseAuth: supabaseConfigured ? 'connected' : 'demo_fallback',
      supabaseDb: supabaseConfigured ? 'connected' : 'demo_fallback',
      resend: resendConfigured ? 'connected' : 'mock_logged',
    },
    timestamp: new Date().toISOString(),
  });
}
