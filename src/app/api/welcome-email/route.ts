import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email/resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, fullName, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: 'email and role are required' }, { status: 400 });
    }

    const validRoles = ['parent', 'school_owner', 'professional', 'supplier'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const result = await sendWelcomeEmail({
      recipientEmail: email,
      fullName: fullName || email.split('@')[0],
      role,
    });

    return NextResponse.json({ sent: result.sent, mode: result.mode, id: result.id });
  } catch (err: any) {
    console.error('[welcome-email] error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send welcome email' }, { status: 500 });
  }
}
