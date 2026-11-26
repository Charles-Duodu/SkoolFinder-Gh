import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { canManageSchool, requireRole } from '@/lib/supabase/authz';
import { mapEnquiryRow } from '@/lib/supabase/mappers';
import { sendEnquiryNotificationEmail } from '@/lib/email/resend';
import { mockInitialEnquiries } from '@/data/mock/initialState';

export async function GET() {
  const userClient = await createClient();
  const adminClient = getSupabaseAdminClient();
  if (!userClient && !adminClient) {
    return NextResponse.json({ enquiries: mockInitialEnquiries, source: 'demo_seed' });
  }

  const {
    data: { user },
  } = userClient ? await userClient.auth.getUser() : { data: { user: null } };

  if (!user || !userClient) {
    return NextResponse.json({ enquiries: [], source: 'supabase' });
  }

  const { data, error } = await userClient
    .from('parent_enquiries')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    enquiries: (data || []).map(mapEnquiryRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || `enq-${Date.now().toString().slice(-4)}`;

    const userClient = await createClient();
    const authRes = userClient ? await userClient.auth.getUser() : null;
    const parentUserId = authRes?.data?.user?.id ?? null;

    const adminClient = getSupabaseAdminClient();
    const supabase = adminClient ?? (parentUserId ? userClient : null);
    let persisted = false;

    if (supabase) {
      const { error } = await supabase.from('parent_enquiries').insert({
        id,
        school_id: body.schoolId,
        school_name: body.schoolName,
        parent_user_id: parentUserId,
        parent_name: body.parentName,
        parent_email: body.parentEmail,
        parent_phone: body.parentPhone || null,
        child_target_level: body.childTargetLevel,
        subject: body.subject,
        message: body.message,
        status: 'Pending',
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      persisted = true;
    }

    await sendEnquiryNotificationEmail({
      schoolName: body.schoolName,
      schoolEmail: body.schoolEmail,
      parentName: body.parentName,
      parentEmail: body.parentEmail,
      subject: body.subject,
      message: body.message,
    });

    return NextResponse.json({ ok: true, id, persisted });
  } catch {
    return NextResponse.json({ error: 'Invalid enquiry payload' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireRole(['school_owner', 'super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();

    if (!auth.demo && body.id) {
      const { data: enq } = await auth.db
        .from('parent_enquiries')
        .select('school_id')
        .eq('id', body.id)
        .maybeSingle();

      if (enq && !(await canManageSchool(auth.db, auth.user.id, auth.role, enq.school_id))) {
        return NextResponse.json({ error: 'Forbidden: school ownership required' }, { status: 403 });
      }

      const { error } = await auth.db
        .from('parent_enquiries')
        .update({
          status: 'Responded',
          response_notes: body.responseNotes,
        })
        .eq('id', body.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, persisted: !auth.demo });
  } catch {
    return NextResponse.json({ error: 'Invalid reply payload' }, { status: 400 });
  }
}
