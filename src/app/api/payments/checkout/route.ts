import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { createBachsCheckout, CreateCheckoutOptions } from '@/lib/payments/bachs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amountGhs,
      purpose,
      title,
      description,
      targetId,
      metadata = {},
    } = body as {
      amountGhs: number;
      purpose: CreateCheckoutOptions['purpose'];
      title: string;
      description?: string;
      targetId?: string;
      metadata?: Record<string, any>;
    };

    if (!amountGhs || amountGhs <= 0 || !purpose || !title) {
      return NextResponse.json(
        { error: 'amountGhs, purpose, and title are required' },
        { status: 400 }
      );
    }

    // Determine current user if authenticated
    let userClient: any = null;
    let user: any = null;
    try {
      userClient = await createClient();
      if (userClient) {
        const { data } = await userClient.auth.getUser();
        user = data.user;
      }
    } catch {}

    const customerEmail = user?.email || metadata.customerEmail || 'parent@skoolfinder.gh';
    const customerName = user?.user_metadata?.full_name || metadata.customerName || 'SkoolFinder Member';
    const customerPhone = user?.user_metadata?.phone || metadata.customerPhone;

    // Determine dynamic base URL from request origin/headers so redirection always returns to the current live domain
    const originHeader = req.headers.get('origin');
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const protoHeader = req.headers.get('x-forwarded-proto') || 'https';
    const dynamicBaseUrl = (body as any).origin || originHeader || (hostHeader ? `${protoHeader}://${hostHeader}` : process.env.NEXT_PUBLIC_APP_URL || 'https://skool-finder-gh-zydn.vercel.app');

    // Generate Bachs checkout session
    const session = await createBachsCheckout({
      customer: {
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
      },
      amountGhs,
      purpose,
      title,
      description,
      targetId,
      baseUrl: dynamicBaseUrl,
      metadata: {
        ...metadata,
        userId: user?.id,
      },
    });

    // Save record to Supabase payments ledger
    const admin = getSupabaseAdminClient() ?? userClient;
    if (admin) {
      try {
        await admin.from('payments').insert({
          id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          user_id: user?.id || null,
          user_email: customerEmail,
          user_name: customerName,
          amount_pesewas: session.amountPesewas,
          currency: 'GHS',
          purpose,
          target_id: targetId || null,
          bachs_checkout_id: session.sessionId,
          reference: session.reference,
          status: 'pending',
          metadata: {
            ...metadata,
            mode: session.mode,
          },
        });
      } catch (dbErr) {
        console.warn('Could not persist payment record to database:', dbErr);
      }
    }

    return NextResponse.json({
      ok: true,
      checkoutUrl: session.checkoutUrl,
      reference: session.reference,
      sessionId: session.sessionId,
      mode: session.mode,
      amountGhs,
    });
  } catch (err: any) {
    console.error('Bachs checkout initialization error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to initialize payment checkout' },
      { status: 500 }
    );
  }
}
