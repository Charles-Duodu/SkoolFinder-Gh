import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { canManageSchool, requireRole } from '@/lib/supabase/authz';
import { mapRfqRow } from '@/lib/supabase/mappers';
import { mockRFQs } from '@/data/mock/procurement';

export async function GET() {
  const supabase = getSupabaseAdminClient() ?? (await createClient());
  if (!supabase) {
    return NextResponse.json({ rfqs: mockRFQs, source: 'demo_seed' });
  }

  const { data, error } = await supabase
    .from('rfq_tenders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    rfqs: (data || []).map(mapRfqRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const auth = await requireRole(['school_owner', 'super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const id = body.id || `rfq-${Date.now().toString().slice(-4)}`;

    if (!auth.demo) {
      if (body.schoolId && !(await canManageSchool(auth.db, auth.user.id, auth.role, body.schoolId))) {
        return NextResponse.json({ error: 'Forbidden: school ownership required' }, { status: 403 });
      }

      const { error } = await auth.db.from('rfq_tenders').insert({
        id,
        school_id: body.schoolId,
        school_name: body.schoolName,
        school_locality: body.schoolLocality,
        title: body.title,
        category: body.category,
        description: body.description,
        items: body.items || [],
        deadline: body.deadline,
        delivery_locality: body.deliveryLocality,
        status: 'Open',
        bids_count: 0,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, id, persisted: !auth.demo });
  } catch {
    return NextResponse.json({ error: 'Invalid RFQ payload' }, { status: 400 });
  }
}
