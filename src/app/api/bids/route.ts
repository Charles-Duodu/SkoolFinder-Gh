import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { canManageSchool, requireRole } from '@/lib/supabase/authz';
import { mapBidRow } from '@/lib/supabase/mappers';
import { mockBids } from '@/data/mock/procurement';

export async function GET() {
  const userClient = await createClient();
  const adminClient = getSupabaseAdminClient();
  if (!userClient && !adminClient) {
    return NextResponse.json({ bids: mockBids, source: 'demo_seed' });
  }

  const {
    data: { user },
  } = userClient ? await userClient.auth.getUser() : { data: { user: null } };

  if (!user || !userClient) {
    return NextResponse.json({ bids: [], source: 'supabase' });
  }

  const { data, error } = await userClient
    .from('quotation_bids')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    bids: (data || []).map(mapBidRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const auth = await requireRole(['supplier', 'super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const id = body.id || `bid-${Date.now().toString().slice(-4)}`;

    if (!auth.demo) {
      const { error } = await auth.db.from('quotation_bids').insert({
        id,
        rfq_id: body.rfqId,
        rfq_title: body.rfqTitle,
        school_id: body.schoolId,
        school_name: body.schoolName,
        supplier_id: body.supplierId || 'sup-01',
        supplier_name: body.supplierName,
        supplier_category: body.supplierCategory,
        total_amount_ghs: Number(body.totalAmountGHS || 0),
        delivery_timeline_days: Number(body.deliveryTimelineDays || 14),
        warranty_period_months: Number(body.warrantyPeriodMonths || 6),
        valid_until: body.validUntil,
        proposal_notes: body.proposalNotes,
        status: 'Pending Review',
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { data: rfqRow } = await auth.db
        .from('rfq_tenders')
        .select('bids_count')
        .eq('id', body.rfqId)
        .maybeSingle();

      if (rfqRow) {
        await auth.db
          .from('rfq_tenders')
          .update({ bids_count: Number(rfqRow.bids_count || 0) + 1 })
          .eq('id', body.rfqId);
      }
    }

    return NextResponse.json({ ok: true, id, persisted: !auth.demo });
  } catch {
    return NextResponse.json({ error: 'Invalid bid payload' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireRole(['school_owner', 'super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    if (!auth.demo && body.id) {
      const { data: bidRow } = await auth.db
        .from('quotation_bids')
        .select('school_id')
        .eq('id', body.id)
        .maybeSingle();

      if (bidRow && !(await canManageSchool(auth.db, auth.user.id, auth.role, bidRow.school_id))) {
        return NextResponse.json({ error: 'Forbidden: school ownership required' }, { status: 403 });
      }

      const { error } = await auth.db
        .from('quotation_bids')
        .update({ status: body.status })
        .eq('id', body.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, persisted: !auth.demo });
  } catch {
    return NextResponse.json({ error: 'Invalid bid update payload' }, { status: 400 });
  }
}
