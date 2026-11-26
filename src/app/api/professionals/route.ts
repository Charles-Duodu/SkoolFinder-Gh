import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { mapProfessionalRow } from '@/lib/supabase/mappers';
import { sendEntityVerificationEmail } from '@/lib/email/resend';
import { mockProfessionals } from '@/data/mock/professionals';

export async function GET() {
  const supabase = getSupabaseAdminClient() ?? (await createClient());
  if (!supabase) {
    return NextResponse.json({ professionals: mockProfessionals, source: 'demo_seed' });
  }

  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    professionals: (data || []).map(mapProfessionalRow),
    source: 'supabase',
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || `pro-${Date.now().toString().slice(-4)}`;
    const verificationStatus = body.verificationStatus || 'under_review';

    const userClient = await createClient();
    const authRes = userClient ? await userClient.auth.getUser() : null;
    const userId = authRes?.data?.user?.id ?? null;

    const supabase = getSupabaseAdminClient() ?? userClient;
    let persisted = false;

    if (supabase) {
      const highestQual =
        Array.isArray(body.qualifications) && body.qualifications[0]?.degree
          ? body.qualifications[0].degree
          : 'Accredited Education Qualification';
      const serviceTitles = Array.isArray(body.servicesOffered)
        ? body.servicesOffered.map((s: { title?: string }) => s.title).filter(Boolean)
        : [];
      const firstRate =
        Array.isArray(body.servicesOffered) && body.servicesOffered[0]?.rateGHS
          ? body.servicesOffered[0].rateGHS
          : null;

      const { error } = await supabase.from('professionals').insert({
        id,
        user_id: userId,
        full_name: body.fullName,
        avatar_url: body.avatarUrl || null,
        title: body.title,
        mode: body.mode || 'both',
        locality: body.locality,
        phone: body.phone || null,
        email: body.email,
        ntc_license_number: body.ntcLicenseNumber || null,
        years_experience: Number(body.yearsOfExperience || 0),
        highest_qualification: highestQual,
        subjects: body.subjects || [],
        education_levels: body.targetLevels || [],
        curricula_expertise: ['GES / NaCCA'],
        service_offerings: serviceTitles,
        qualifications: body.qualifications || [],
        services_offered: body.servicesOffered || [],
        rate_range: firstRate,
        bio: body.summary || '',
        availability: body.employmentPreference || 'Full-time',
        cv_file_path: body.cvUrl || null,
        verification_status: verificationStatus,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      persisted = true;
    }

    if (body.email && body.fullName) {
      await sendEntityVerificationEmail({
        recipientEmail: body.email,
        entityName: body.fullName,
        entityType: 'Professional',
        status: verificationStatus,
      });
    }

    return NextResponse.json({ ok: true, id, verificationStatus, persisted });
  } catch {
    return NextResponse.json({ error: 'Invalid professional payload' }, { status: 400 });
  }
}
