import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyEditorSession, EDITOR_COOKIE_NAME } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

const BUCKET = 'uploads';

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'image/avif': '.avif',
  'image/tiff': '.tiff',
  'image/x-icon': '.ico',
  'image/vnd.microsoft.icon': '.ico',
};

function safeFilename(contentType: string): string {
  const ext = EXT_BY_MIME[contentType] ?? '.jpg';
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return base + ext;
}

/**
 * Returns a signed upload URL so the browser can upload directly to Supabase.
 * This avoids "Method Not Allowed" from server-side upload and bypasses body size limits.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get(EDITOR_COOKIE_NAME)?.value;
    if (!(await verifyEditorSession(cookieValue))) {
      return NextResponse.json(
        { error: 'Unauthorized. Log in at Editor’s Desk first.' },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Storage not configured.' },
        { status: 500 }
      );
    }

    let contentType = 'image/jpeg';
    try {
      const body = await request.json().catch(() => ({}));
      if (body?.contentType && typeof body.contentType === 'string') {
        contentType = body.contentType;
      }
    } catch {
      // use default
    }

    const filename = safeFilename(contentType);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(filename);

    if (error) {
      console.error('Upload URL: createSignedUploadUrl failed', error);
      return NextResponse.json(
        { error: error.message || 'Could not create upload URL' },
        { status: 500 }
      );
    }

    if (!data?.signedUrl || !data?.path) {
      return NextResponse.json(
        { error: 'No signed URL returned' },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
      publicUrl: urlData.publicUrl,
    });
  } catch (e) {
    console.error('Upload URL error', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed' },
      { status: 500 }
    );
  }
}
