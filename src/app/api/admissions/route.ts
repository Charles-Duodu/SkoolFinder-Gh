import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { canManageSchool, requireRole } from '@/lib/supabase/authz';
import { mapAdmissionRow } from '@/lib/supabase/mappers';
import { sendAdmissionSubmittedEmails } from '@/lib/email/resend';
import { mockAdmissionApplications } from '@/data/mock/admissions';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get('schoolId');
  const userClient = await createClient();
  const adminClient = getSupabaseAdminClient();

  if (!userClient && !adminClient) {
    const items = schoolId
      ? mockAdmissionApplications.filter((a) => a.schoolId === schoolId)
      : mockAdmissionApplications;
    return NextResponse.json({ applications: items, source: 'demo_seed' });
  }

  const {
    data: { user },
  } = userClient ? await userClient.auth.getUser() : { data: { user: null } };

  if (!user || !userClient) {
    return NextResponse.json({ applications: [], source: 'supabase' });
  }

  let query = userClient
    .from('admission_applications')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    applications: (data || []).map(mapAdmissionRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || `adm-${Date.now().toString().slice(-4)}`;

    const userClient = await createClient();
    const authRes = userClient ? await userClient.auth.getUser() : null;
    const parentUserId = authRes?.data?.user?.id ?? null;

    const adminClient = getSupabaseAdminClient();
    const supabase = adminClient ?? (parentUserId ? userClient : null);
    let persisted = false;

    if (supabase) {
      const { error } = await supabase.from('admission_applications').insert({
        id,
        school_id: body.schoolId,
        school_name: body.schoolName,
        school_locality: body.schoolLocality,
        parent_user_id: parentUserId,
        parent_name: body.parentName,
        parent_email: body.parentEmail,
        parent_phone: body.parentPhone || null,
        student_name: body.studentName,
        date_of_birth: body.dateOfBirth,
        gender: body.gender,
        target_level: body.targetLevel,
        target_term: body.targetTerm,
        target_year: body.targetYear || 2026,
        digital_address: body.digitalAddress,
        previous_school: body.previousSchool || null,
        special_needs: body.specialNeeds || null,
        documents_attached: body.documentsAttached || [],
        status: 'Submitted',
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      persisted = true;
    }

    await sendAdmissionSubmittedEmails({
      trackingId: id,
      studentName: body.studentName,
      parentName: body.parentName,
      parentEmail: body.parentEmail,
      schoolName: body.schoolName,
      schoolEmail: body.schoolEmail,
      targetLevel: body.targetLevel,
      targetTerm: body.targetTerm,
    });

    return NextResponse.json({ ok: true, id, persisted });
  } catch {
    return NextResponse.json({ error: 'Invalid admission payload' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireRole(['school_owner', 'super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();

    if (!auth.demo && body.id) {
      const { data: adm } = await auth.db
        .from('admission_applications')
        .select('school_id')
        .eq('id', body.id)
        .maybeSingle();

      if (adm && !(await canManageSchool(auth.db, auth.user.id, auth.role, adm.school_id))) {
        return NextResponse.json({ error: 'Forbidden: school ownership required' }, { status: 403 });
      }

      const { error } = await auth.db
        .from('admission_applications')
        .update({
          status: body.status,
          school_notes: body.schoolNotes,
          assessment_date: body.assessmentDate || null,
        })
        .eq('id', body.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, persisted: !auth.demo });
  } catch {
    return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
  }
}
