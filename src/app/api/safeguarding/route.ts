import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/authz';
import { mapSafeguardingRow } from '@/lib/supabase/mappers';
import { sendSafeguardingAlertEmail } from '@/lib/email/resend';
import { mockSafeguardingCases } from '@/data/mock/cases';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ cases: mockSafeguardingCases, source: 'demo_seed' });
  }

  const userClient = await createClient();
  if (!userClient) {
    return NextResponse.json({ cases: [], source: 'supabase' });
  }

  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ cases: [], source: 'supabase' });
  }

  const { data, error } = await userClient
    .from('safeguarding_cases')
    .select('*')
    .order('reported_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    cases: (data || []).map(mapSafeguardingRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || `case-${Date.now().toString().slice(-4)}`;
    const isAnonymous = !body.reporterName;

    const userClient = await createClient();
    const authRes = userClient ? await userClient.auth.getUser() : null;
    const reporterUserId = isAnonymous ? null : authRes?.data?.user?.id ?? null;

    const supabase = getSupabaseAdminClient() ?? userClient;

    if (supabase) {
      const { error } = await supabase.from('safeguarding_cases').insert({
        id,
        title: body.title,
        category: body.category,
        entity_type: body.entityType,
        entity_name: body.entityName,
        severity: body.severity,
        status: 'New',
        is_anonymous: isAnonymous,
        reporter_user_id: reporterUserId,
        summary: body.summary,
        notes: [
          'Confidential report lodged via Public Safeguarding Desk.',
          isAnonymous
            ? 'Report lodged anonymously by community whistleblower.'
            : `Submitted by: ${body.reporterName} (${body.reporterContact || 'Contact on file'})`,
        ],
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    await sendSafeguardingAlertEmail({
      caseId: id,
      title: body.title,
      entityName: body.entityName,
      severity: body.severity,
      category: body.category,
    });

    return NextResponse.json({ ok: true, id, persisted: Boolean(supabase) });
  } catch {
    return NextResponse.json({ error: 'Invalid safeguarding payload' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireRole(['super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    if (!auth.demo && body.id) {
      const { error } = await auth.db
        .from('safeguarding_cases')
        .update({ status: body.status })
        .eq('id', body.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, persisted: !auth.demo });
  } catch {
    return NextResponse.json({ error: 'Invalid safeguarding update payload' }, { status: 400 });
  }
}
