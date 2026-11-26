import { createClient } from '@/lib/supabase/client';

export interface StorageUploadResult {
  ok: boolean;
  path: string;
  publicUrl?: string;
  mode: 'supabase' | 'demo_fallback';
  error?: string;
}

/**
 * Requests a short-lived signed upload URL from `/api/storage/signed-url`
 * and uploads the File directly to Supabase Storage (`public-media` or `private-vault`).
 * Falls back cleanly with a descriptive error if the user is not signed in.
 */
export async function uploadToSupabaseStorage(
  bucket: 'public-media' | 'private-vault',
  folderPrefix: string,
  file: File
): Promise<StorageUploadResult> {
  const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const supabase = createClient();

  let ownerPrefix = folderPrefix.replace(/^\/+|\/+$/g, '');
  if (supabase && bucket === 'private-vault') {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        ok: false,
        path: safeFileName,
        mode: 'demo_fallback',
        error: 'Please sign in first to upload files directly to your encrypted Supabase vault.',
      };
    }
    // Storage RLS on `private-vault` requires the first folder segment to equal auth.uid()
    ownerPrefix = `${user.id}/${ownerPrefix}`;
  }

  const filePath = ownerPrefix ? `${ownerPrefix}/${safeFileName}` : safeFileName;

  const signRes = await fetch('/api/storage/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, filePath, action: 'upload' }),
  });

  if (signRes.status === 401) {
    return {
      ok: false,
      path: filePath,
      mode: 'demo_fallback',
      error: 'Please sign in first to upload documents to Supabase Storage.',
    };
  }

  const signData = await signRes.json();
  if (!signRes.ok) {
    return {
      ok: false,
      path: filePath,
      mode: 'demo_fallback',
      error: signData.error || 'Could not generate signed upload URL.',
    };
  }

  if (signData.mode === 'demo_fallback' || !supabase || !signData.token) {
    return {
      ok: true,
      path: filePath,
      mode: 'demo_fallback',
    };
  }

  const { error: uploadErr } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(signData.path, signData.token, file);

  if (uploadErr) {
    return {
      ok: false,
      path: filePath,
      mode: 'supabase',
      error: uploadErr.message,
    };
  }

  const publicUrl =
    bucket === 'public-media'
      ? supabase.storage.from('public-media').getPublicUrl(signData.path).data.publicUrl
      : undefined;

  return {
    ok: true,
    path: signData.path,
    publicUrl,
    mode: 'supabase',
  };
}
