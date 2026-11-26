import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase/server';
import {
  mapSchoolRow,
  mapProfessionalRow,
  mapSupplierRow,
  mapJobVacancyRow,
  mapJobApplicationRow,
  mapRfqRow,
  mapBidRow,
  mapAdmissionRow,
  mapEnquiryRow,
  mapSafeguardingRow,
} from '@/lib/supabase/mappers';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, source: 'demo_seed' });
  }

  const userClient = await createClient();
  const adminClient = getSupabaseAdminClient();
  const publicReader = adminClient ?? userClient;

  if (!publicReader) {
    return NextResponse.json({ configured: false, source: 'demo_seed' });
  }

  const {
    data: { user },
  } = userClient ? await userClient.auth.getUser() : { data: { user: null } };

  let profile: Record<string, unknown> | null = null;
  if (user && userClient) {
    const { data: profileRow } = await userClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    profile = profileRow;
  }

  // Public/directory reads in parallel
  const [schoolsRes, prosRes, supsRes, jobsRes, rfqsRes] = await Promise.all([
    publicReader.from('schools').select('*').order('featured', { ascending: false }),
    publicReader.from('professionals').select('*').order('created_at', { ascending: false }),
    publicReader.from('suppliers').select('*').order('created_at', { ascending: false }),
    publicReader.from('job_vacancies').select('*').order('created_at', { ascending: false }),
    publicReader.from('rfq_tenders').select('*').order('created_at', { ascending: false }),
  ]);

  // Scoped private reads only when authenticated (strictly gated by caller's userClient + RLS)
  let workspace: Record<string, unknown> | null = null;
  let admissions: ReturnType<typeof mapAdmissionRow>[] = [];
  let enquiries: ReturnType<typeof mapEnquiryRow>[] = [];
  let jobApps: ReturnType<typeof mapJobApplicationRow>[] = [];
  let bids: ReturnType<typeof mapBidRow>[] = [];
  let cases: ReturnType<typeof mapSafeguardingRow>[] = [];

  if (user && userClient) {
    const [wsRes, admRes, enqRes, appRes, bidRes, caseRes] = await Promise.all([
      userClient.from('parent_workspaces').select('*').eq('user_id', user.id).maybeSingle(),
      userClient.from('admission_applications').select('*').order('submitted_at', { ascending: false }),
      userClient.from('parent_enquiries').select('*').order('submitted_at', { ascending: false }),
      userClient.from('job_applications').select('*').order('submitted_at', { ascending: false }),
      userClient.from('quotation_bids').select('*').order('submitted_at', { ascending: false }),
      profile?.role === 'super_admin'
        ? userClient.from('safeguarding_cases').select('*').order('reported_at', { ascending: false })
        : Promise.resolve({ data: [] }),
    ]);

    workspace = wsRes.data ?? null;
    admissions = (admRes.data || []).map(mapAdmissionRow);
    enquiries = (enqRes.data || []).map(mapEnquiryRow);
    jobApps = (appRes.data || []).map(mapJobApplicationRow);
    bids = (bidRes.data || []).map(mapBidRow);
    cases = (caseRes.data || []).map(mapSafeguardingRow);
  }

  return NextResponse.json({
    configured: true,
    source: 'supabase',
    user: user
      ? {
          id: user.id,
          email: user.email,
          role: (profile?.role as string) || 'parent',
          fullName: (profile?.full_name as string) || user.email,
          phone: (profile?.phone as string) || '',
          locality: (profile?.locality as string) || 'East Legon',
        }
      : null,
    workspace,
    schools: (schoolsRes.data || []).map(mapSchoolRow),
    professionals: (prosRes.data || []).map(mapProfessionalRow),
    suppliers: (supsRes.data || []).map(mapSupplierRow),
    vacancies: (jobsRes.data || []).map(mapJobVacancyRow),
    rfqs: (rfqsRes.data || []).map(mapRfqRow),
    admissionApplications: admissions,
    enquiries,
    applications: jobApps,
    bids,
    cases,
  });
}
