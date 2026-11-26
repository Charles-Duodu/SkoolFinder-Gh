import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ workspace: null, source: 'demo_seed' });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ workspace: null, source: 'demo_seed' });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ workspace: null, authenticated: false });
  }

  const { data, error } = await supabase
    .from('parent_workspaces')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ workspace: data, authenticated: true });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: true, persisted: false });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ ok: true, persisted: false });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: true, persisted: false });
    }

    const payload = {
      user_id: user.id,
      profile_clerk_id: user.id,
      ...(body.children !== undefined ? { children: body.children } : {}),
      ...(body.savedSchoolIds !== undefined ? { saved_school_ids: body.savedSchoolIds } : {}),
      ...(body.shortlistedSchoolIds !== undefined
        ? { shortlisted_school_ids: body.shortlistedSchoolIds }
        : {}),
      ...(body.comparisonSchoolIds !== undefined
        ? { comparison_school_ids: body.comparisonSchoolIds }
        : {}),
      ...(body.alertPreferences !== undefined
        ? { alert_preferences: body.alertPreferences }
        : {}),
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from('parent_workspaces')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from('parent_workspaces')
        .update(payload)
        .eq('id', existing.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const { error } = await supabase.from('parent_workspaces').insert(payload);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch {
    return NextResponse.json({ error: 'Invalid workspace payload' }, { status: 400 });
  }
}
