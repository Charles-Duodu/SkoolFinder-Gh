import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/authz';
import { sendEntityVerificationEmail } from '@/lib/email/resend';

export async function PATCH(req: Request) {
  try {
    const auth = await requireRole(['super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const { entityType, entityId, status, recipientEmail, entityName } = body as {
      entityType: 'School' | 'Professional' | 'Supplier';
      entityId: string;
      status: string;
      recipientEmail?: string;
      entityName?: string;
    };

    const tableMap = {
      School: 'schools',
      Professional: 'professionals',
      Supplier: 'suppliers',
    };

    let persisted = false;

    if (!auth.demo && entityId && tableMap[entityType]) {
      const { error } = await auth.db
        .from(tableMap[entityType])
        .update({ verification_status: status })
        .eq('id', entityId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      await auth.db.from('audit_logs').insert({
        actor_clerk_id: auth.user.id,
        action: `update_verification_${status}`,
        entity_type: entityType.toLowerCase(),
        entity_id: entityId,
        details: { status },
      });

      persisted = true;
    }

    if (recipientEmail && entityName) {
      await sendEntityVerificationEmail({
        recipientEmail,
        entityName,
        entityType,
        status,
      });
    }

    return NextResponse.json({ ok: true, persisted });
  } catch {
    return NextResponse.json({ error: 'Invalid approval update payload' }, { status: 400 });
  }
}
