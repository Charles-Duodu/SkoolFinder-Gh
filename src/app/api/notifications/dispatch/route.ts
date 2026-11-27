import { NextResponse } from 'next/server';
import { sendTransactionalEmail } from '@/lib/notifications/email';
import { sendGhanaSms } from '@/lib/notifications/sms';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type, // 'enquiry_received' | 'admission_status' | 'bid_submitted' | 'general'
      email,
      phone,
      title,
      message,
      details,
      ctaUrl,
      ctaText,
    } = body;

    const results: { emailSent?: boolean; smsSent?: boolean } = {};

    // 1. Dispatch Email if provided
    if (email) {
      const emailRes = await sendTransactionalEmail({
        to: email,
        subject: title || 'Notification - SkoolFinder Ghana',
        heading: title || 'SkoolFinder Ghana Alert',
        bodyText: message,
        details,
        ctaUrl,
        ctaText,
      });
      results.emailSent = emailRes.success;
    }

    // 2. Dispatch Ghana SMS if provided
    if (phone) {
      const smsRes = await sendGhanaSms({
        recipient: phone,
        message: `${title ? title + ': ' : 'SkoolFinder: '}${message}`,
      });
      results.smsSent = smsRes.success;
    }

    return NextResponse.json({ ok: true, ...results });
  } catch (err: any) {
    console.error('Notification dispatch error:', err);
    return NextResponse.json({ error: err.message || 'Notification failed' }, { status: 500 });
  }
}
