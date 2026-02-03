import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyEditorSession, EDITOR_COOKIE_NAME } from '@/lib/auth';

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
 * Returns a path and publicUrl for direct browser upload.
 * No Supabase call on the server — client uploads with anon key and RLS allows INSERT.
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
    if (!supabaseUrl) {
      return NextResponse.json({ useServerUpload: true });
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

    const path = safeFilename(contentType);
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;

    return NextResponse.json({ path, publicUrl });
  } catch (e) {
    console.error('Upload URL error', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed' },
      { status: 500 }
    );
  }
}
