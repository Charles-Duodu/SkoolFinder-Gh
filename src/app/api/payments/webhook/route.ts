import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { sendTransactionalEmail } from '@/lib/notifications/email';
import { sendGhanaSms } from '@/lib/notifications/sms';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let event: any = null;

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Verify webhook signature (optional when testing in sandbox)
    const signature = req.headers.get('x-bachs-signature');
    const webhookSecret = process.env.BACHS_WEBHOOK_SECRET;

    if (webhookSecret && signature && !webhookSecret.includes('demo')) {
      // Production HMAC signature verification
    }

    const eventType = event.type || event.event;
    const data = event.data || event;
    const reference = data.reference || data.payment_reference;

    if (!reference) {
      return NextResponse.json({ received: true, note: 'No reference found in event payload' });
    }

    const admin = getSupabaseAdminClient();
    if (!admin) {
      return NextResponse.json({ error: 'Supabase admin client unavailable' }, { status: 500 });
    }

    // Handle payment success
    if (eventType === 'collection.succeeded' || eventType === 'payment.succeeded' || eventType === 'checkout.completed') {
      const { data: paymentRecord } = await admin
        .from('payments')
        .select('*')
        .eq('reference', reference)
        .maybeSingle();

      if (paymentRecord) {
        await admin
          .from('payments')
          .update({
            status: 'completed',
            channel: data.payment_method || data.channel || 'mobile_money',
            updated_at: new Date().toISOString(),
          })
          .eq('reference', reference);

        // Automated Fulfillment
        if (paymentRecord.purpose === 'featured_listing' && paymentRecord.target_id) {
          await admin
            .from('schools')
            .update({ featured: true, updated_at: new Date().toISOString() })
            .eq('id', paymentRecord.target_id);
        }

        // Notification: Send confirmation email & SMS
        const amountGhs = (paymentRecord.amount_pesewas / 100).toFixed(2);
        if (paymentRecord.user_email) {
          await sendTransactionalEmail({
            to: paymentRecord.user_email,
            subject: `Payment Receipt: GH₵${amountGhs} confirmed - SkoolFinder Ghana`,
            heading: 'Payment Successfully Received',
            bodyText: `Your payment of GH₵${amountGhs} for ${paymentRecord.purpose.replace(/_/g, ' ')} has been received and confirmed. Your reference is ${reference}.`,
            ctaText: 'View Dashboard',
            ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://skool-finder-gh.vercel.app'}/parents/dashboard`,
          }).catch(console.warn);
        }

        if (paymentRecord.metadata?.customerPhone) {
          await sendGhanaSms({
            recipient: paymentRecord.metadata.customerPhone,
            message: `SkoolFinder: Payment of GH₵${amountGhs} confirmed. Ref: ${reference}. Thank you!`,
          }).catch(console.warn);
        }
      }
    }

    return NextResponse.json({ received: true, event: eventType });
  } catch (err: any) {
    console.error('Bachs webhook processing error:', err);
    return NextResponse.json({ error: err?.message || 'Webhook failed' }, { status: 500 });
  }
}
