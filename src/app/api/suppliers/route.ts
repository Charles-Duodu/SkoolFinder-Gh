import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { mapSupplierRow } from '@/lib/supabase/mappers';
import { sendEntityVerificationEmail } from '@/lib/email/resend';
import { mockSuppliers } from '@/data/mock/suppliers';

export async function GET() {
  const supabase = getSupabaseAdminClient() ?? (await createClient());
  if (!supabase) {
    return NextResponse.json({ suppliers: mockSuppliers, source: 'demo_seed' });
  }

  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    suppliers: (data || []).map(mapSupplierRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || `sup-${Date.now().toString().slice(-4)}`;
    const verificationStatus = body.verificationStatus || 'under_review';

    const userClient = await createClient();
    const authRes = userClient ? await userClient.auth.getUser() : null;
    const ownerUserId = authRes?.data?.user?.id ?? null;

    const supabase = getSupabaseAdminClient() ?? userClient;
    let persisted = false;

    if (supabase) {
      const { error } = await supabase.from('suppliers').insert({
        id,
        owner_user_id: ownerUserId,
        business_name: body.businessName,
        registration_number: body.registrationNumber,
        category: body.category,
        additional_categories: body.additionalCategories || [],
        logo_url: body.logoUrl || null,
        locality: body.locality,
        address: body.address,
        phone: body.phone || null,
        email: body.email,
        website: body.website || null,
        description: body.description || '',
        years_in_operation: Number(body.yearsInOperation || 3),
        service_areas: body.coverageAreas || [],
        products: body.products || [],
        verification_status: verificationStatus,
        plan_tier: 'free_launch',
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      persisted = true;
    }

    if (body.email && body.businessName) {
      await sendEntityVerificationEmail({
        recipientEmail: body.email,
        entityName: body.businessName,
        entityType: 'Supplier',
        status: verificationStatus,
      });
    }

    return NextResponse.json({ ok: true, id, verificationStatus, persisted });
  } catch {
    return NextResponse.json({ error: 'Invalid supplier payload' }, { status: 400 });
  }
}
