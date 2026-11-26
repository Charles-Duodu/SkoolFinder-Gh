import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { canManageSchool, requireRole } from '@/lib/supabase/authz';
import { mapJobVacancyRow } from '@/lib/supabase/mappers';
import { mockVacancies } from '@/data/mock/recruitment';

export async function GET() {
  const supabase = getSupabaseAdminClient() ?? (await createClient());
  if (!supabase) {
    return NextResponse.json({ vacancies: mockVacancies, source: 'demo_seed' });
  }

  const { data, error } = await supabase
    .from('job_vacancies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    vacancies: (data || []).map(mapJobVacancyRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const auth = await requireRole(['school_owner', 'super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const id = body.id || `job-${Date.now().toString().slice(-4)}`;

    if (!auth.demo) {
      if (body.schoolId && !(await canManageSchool(auth.db, auth.user.id, auth.role, body.schoolId))) {
        return NextResponse.json({ error: 'Forbidden: school ownership required' }, { status: 403 });
      }

      const { error } = await auth.db.from('job_vacancies').insert({
        id,
        school_id: body.schoolId,
        school_name: body.schoolName,
        school_locality: body.schoolLocality,
        title: body.title,
        department: body.department,
        employment_type: body.contractType || 'Full-time',
        education_level: body.educationLevel,
        salary_range_ghs: body.salaryRangeGHS,
        description: body.description,
        requirements: body.requirements || [],
        deadline: body.deadline,
        status: 'Open',
        applicants_count: 0,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, id, persisted: !auth.demo });
  } catch {
    return NextResponse.json({ error: 'Invalid job vacancy payload' }, { status: 400 });
  }
}
