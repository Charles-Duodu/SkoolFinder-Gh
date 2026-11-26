import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { canManageSchool, requireRole } from '@/lib/supabase/authz';
import { mapSchoolRow } from '@/lib/supabase/mappers';
import { sendEntityVerificationEmail } from '@/lib/email/resend';
import { mockSchools } from '@/data/mock/schools';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locality = searchParams.get('locality');
  const supabase = getSupabaseAdminClient() ?? (await createClient());

  if (!supabase) {
    const filtered = locality
      ? mockSchools.filter((s) => s.locality === locality)
      : mockSchools;
    return NextResponse.json({ schools: filtered, source: 'demo_seed' });
  }

  let query = supabase.from('schools').select('*').order('featured', { ascending: false });
  if (locality) {
    query = query.eq('locality', locality);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    schools: (data || []).map(mapSchoolRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const auth = await requireRole(['school_owner', 'super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const schoolId = body.id || `sch-${Date.now().toString().slice(-4)}`;
    // Only super_admin may pre-approve a school directly; owners submit under_review
    const verificationStatus =
      auth.role === 'super_admin' && body.verificationStatus === 'approved'
        ? 'approved'
        : 'under_review';
    const isClaimed = body.isClaimed !== undefined ? Boolean(body.isClaimed) : true;

    if (!auth.demo) {
      const { error } = await auth.db.from('schools').insert({
        id: schoolId,
        owner_user_id: isClaimed ? auth.user.id : null,
        name: body.name,
        slug: body.slug,
        tagline: body.tagline,
        crest_url: body.crestUrl,
        cover_image_url: body.coverImageUrl,
        gallery_images: body.galleryImages || [],
        locality: body.locality,
        digital_address: body.digitalAddress,
        address: body.address,
        phone: body.phone,
        email: body.email,
        website: body.website || null,
        year_established: body.yearEstablished || 2020,
        ownership_type: body.ownershipType || 'Private',
        education_levels: body.educationLevels || [],
        curricula: body.curricula || [],
        boarding_status: body.boardingStatus || 'Day Only',
        gender: body.gender || 'Co-educational',
        facilities: body.facilities || [],
        annual_fee_min: body.annualFeeRange?.min || 15000,
        annual_fee_max: body.annualFeeRange?.max || 30000,
        about_text: body.aboutText || '',
        admissions_overview: body.admissionsOverview || '',
        contact_person_name: body.contactPerson?.name || 'Admissions Office',
        contact_person_role: body.contactPerson?.role || 'Head of Admissions',
        contact_person_phone: body.contactPerson?.phone || body.phone,
        verification_status: verificationStatus,
        is_claimed: isClaimed,
        plan_tier: body.planTier || 'free_launch',
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    if (verificationStatus === 'under_review') {
      await sendEntityVerificationEmail({
        recipientEmail: body.email || 'support@skoolfinder.com.gh',
        entityName: body.name,
        entityType: 'School',
        status: verificationStatus,
      });
    }

    return NextResponse.json({
      ok: true,
      id: schoolId,
      isClaimed,
      verificationStatus,
      persisted: !auth.demo,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid school payload' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireRole(['school_owner', 'super_admin']);
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const { id, isClaimed, claimantName, claimantEmail } = body;

    if (!auth.demo && id) {
      const { data: existing } = await auth.db
        .from('schools')
        .select('is_claimed, owner_user_id')
        .eq('id', id)
        .maybeSingle();

      const isValidClaim = Boolean(isClaimed) && existing && !existing.is_claimed;
      const isOwnerOrAdmin = await canManageSchool(auth.db, auth.user.id, auth.role, id);

      if (!isOwnerOrAdmin && !isValidClaim) {
        return NextResponse.json(
          { error: 'Forbidden: you do not own this school listing' },
          { status: 403 }
        );
      }

      const updateFields: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (isClaimed !== undefined) updateFields.is_claimed = Boolean(isClaimed);
      if (claimantName) updateFields.contact_person_name = claimantName;
      if (claimantEmail) updateFields.email = claimantEmail;
      if (isValidClaim) updateFields.owner_user_id = auth.user.id;

      if (body.name !== undefined) updateFields.name = body.name;
      if (body.tagline !== undefined) updateFields.tagline = body.tagline;
      if (body.crestUrl !== undefined) updateFields.crest_url = body.crestUrl;
      if (body.coverImageUrl !== undefined) updateFields.cover_image_url = body.coverImageUrl;
      if (body.aboutText !== undefined) updateFields.about_text = body.aboutText;
      if (body.admissionsOverview !== undefined) updateFields.admissions_overview = body.admissionsOverview;
      if (body.facilities !== undefined) updateFields.facilities = body.facilities;
      if (body.annualFeeRange?.min !== undefined) updateFields.annual_fee_min = body.annualFeeRange.min;
      if (body.annualFeeRange?.max !== undefined) updateFields.annual_fee_max = body.annualFeeRange.max;
      if (body.phone !== undefined) updateFields.phone = body.phone;
      if (body.email !== undefined) updateFields.email = body.email;

      const { error } = await auth.db.from('schools').update(updateFields).eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, id, isClaimed, persisted: !auth.demo });
  } catch {
    return NextResponse.json({ error: 'Invalid school update payload' }, { status: 400 });
  }
}
