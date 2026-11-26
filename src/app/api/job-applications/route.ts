import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { canManageSchool, requireRole } from '@/lib/supabase/authz';
import { mapJobApplicationRow } from '@/lib/supabase/mappers';
import { mockApplications } from '@/data/mock/recruitment';

export async function GET() {
  const userClient = await createClient();
  const adminClient = getSupabaseAdminClient();
  if (!userClient && !adminClient) {
    return NextResponse.json({ applications: mockApplications, source: 'demo_seed' });
  }

  // Only return job applications when the caller is authenticated (RLS scopes via userClient)
  const {
    data: { user },
  } = userClient ? await userClient.auth.getUser() : { data: { user: null } };

  if (!user || !userClient) {
    return NextResponse.json({ applications: [], source: 'supabase' });
  }

  const { data, error } = await userClient
    .from('job_applications')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    applications: (data || []).map(mapJobApplicationRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || `app-${Date.now().toString().slice(-4)}`;

    const userClient = await createClient();
    const authRes = userClient ? await userClient.auth.getUser() : null;
    const applicantUserId = authRes?.data?.user?.id ?? null;

    if (userClient && !applicantUserId) {
      return NextResponse.json({ error: 'Sign in required to apply for jobs' }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient() ?? userClient;
    let persisted = false;

    if (supabase) {
      const { error } = await supabase.from('job_applications').insert({
        id,
        job_id: body.jobId,
        job_title: body.jobTitle,
        school_id: body.schoolId,
        school_name: body.schoolName,
        applicant_id: body.professionalId || applicantUserId || 'pro-01',
        applicant_user_id: applicantUserId,
        applicant_name: body.applicantName,
        cover_note: body.coverNote,
        status: 'Submitted',
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { data: vacancyRow } = await supabase
        .from('job_vacancies')
        .select('applicants_count')
        .eq('id', body.jobId)
        .maybeSingle();

      if (vacancyRow) {
        await supabase
          .from('job_vacancies')
          .update({ applicants_count: Number(vacancyRow.applicants_count || 0) + 1 })
          .eq('id', body.jobId);
      }
      persisted = true;
    }

    return NextResponse.json({ ok: true, id, persisted });
  } catch {
    return NextResponse.json({ error: 'Invalid job application payload' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireRole(['school_owner', 'super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    if (!auth.demo && body.id) {
      const { data: appRow } = await auth.db
        .from('job_applications')
        .select('school_id')
        .eq('id', body.id)
        .maybeSingle();

      if (appRow && !(await canManageSchool(auth.db, auth.user.id, auth.role, appRow.school_id))) {
        return NextResponse.json({ error: 'Forbidden: school ownership required' }, { status: 403 });
      }

      const { error } = await auth.db
        .from('job_applications')
        .update({ status: body.status })
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
