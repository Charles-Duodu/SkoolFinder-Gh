import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { verifyBachsPayment } from '@/lib/payments/bachs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'Reference parameter (ref) is required' }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();
    let paymentRecord: any = null;

    if (admin) {
      const { data } = await admin
        .from('payments')
        .select('*')
        .eq('reference', ref)
        .maybeSingle();
      paymentRecord = data;
    }

    // Verify status with Bachs API
    const verification = await verifyBachsPayment(ref);

    // If verified and pending in DB, fulfill automated actions
    if (verification.success && paymentRecord && paymentRecord.status !== 'completed' && admin) {
      await admin
        .from('payments')
        .update({
          status: 'completed',
          channel: verification.channel || 'mobile_money',
          updated_at: new Date().toISOString(),
        })
        .eq('reference', ref);

      // Automated feature fulfillment
      if (paymentRecord.purpose === 'featured_listing' && paymentRecord.target_id) {
        await admin
          .from('schools')
          .update({ featured: true, updated_at: new Date().toISOString() })
          .eq('id', paymentRecord.target_id);
      } else if (paymentRecord.purpose === 'admission_application' && paymentRecord.target_id) {
        await admin
          .from('admission_applications')
          .update({ notes: 'Application fee paid via Bachs MoMo', updated_at: new Date().toISOString() })
          .eq('id', paymentRecord.target_id);
      }
    }

    return NextResponse.json({
      ok: true,
      reference: ref,
      status: verification.status,
      payment: paymentRecord,
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: err?.message || 'Verification failed' }, { status: 500 });
  }
}
