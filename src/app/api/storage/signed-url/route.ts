import { NextResponse } from 'next/server';
import { createClient, getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase/server';

/**
 * Generates short-lived (60s) signed upload or download URLs for Supabase Storage.
 * Handles both 'public-media' (crests, campus photos) and 'private-vault'
 * (birth certificates, terminal reports, NTC licenses, GRA tax docs).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bucket, filePath, action = 'upload' } = body as {
      bucket: 'public-media' | 'private-vault';
      filePath: string;
      action?: 'upload' | 'download';
    };

    if (!bucket || !filePath) {
      return NextResponse.json(
        { error: 'bucket and filePath are required' },
        { status: 400 }
      );
    }

    if (bucket !== 'public-media' && bucket !== 'private-vault') {
      return NextResponse.json({ error: 'Unsupported storage bucket' }, { status: 400 });
    }

    if (filePath.includes('..') || filePath.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid storage path' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        ok: true,
        mode: 'demo_fallback',
        signedUrl: null,
        path: filePath,
      });
    }

    const userClient = await createClient();
    const {
      data: { user },
    } = userClient ? await userClient.auth.getUser() : { data: { user: null } };

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use the caller's session client first so Storage RLS policies enforce folder ownership
    const supabase = userClient ?? getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    if (action === 'download') {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, signedUrl: data.signedUrl, expiresInSeconds: 60 });
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid storage signed-url request' }, { status: 400 });
  }
}
