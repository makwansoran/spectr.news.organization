import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyEditorSession, EDITOR_COOKIE_NAME } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getSupabaseAdmin } from '@/lib/supabase';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const BUCKET = 'uploads';

// Broad set of image MIME types (most file types for images)
const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/jpg', // some systems use jpg
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/avif',
  'image/tiff',
  'image/x-icon',
  'image/vnd.microsoft.icon',
]);

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

const ALLOWED_EXTENSIONS = new Set(
  Object.values(EXT_BY_MIME).concat(['.jpeg', '.tif'])
);

function safeFilename(original: string, mime: string): string {
  const ext =
    EXT_BY_MIME[mime] ??
    (path.extname(original).toLowerCase() || '.jpg');
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return base + (ALLOWED_EXTENSIONS.has(ext) ? ext : '.jpg');
}

function isAllowedFile(file: File): { ok: true } | { ok: false; error: string } {
  const ext = path.extname(file.name).toLowerCase();
  const mimeOk = ALLOWED_MIMES.has(file.type);
  const extOk = ALLOWED_EXTENSIONS.has(ext) || ext === '.jpeg' || ext === '.tif';
  if (!mimeOk && !extOk) {
    return {
      ok: false,
      error:
        'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG, BMP, AVIF, TIFF, ICO.',
    };
  }
  if (file.size > MAX_SIZE) {
    return {
      ok: false,
      error: `File too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB.`,
    };
  }
  return { ok: true };
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get(EDITOR_COOKIE_NAME)?.value;
    if (!(await verifyEditorSession(cookieValue))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided. Please choose an image.' },
        { status: 400 }
      );
    }

    const allowed = isAllowedFile(file);
    if (!allowed.ok) {
      return NextResponse.json({ error: allowed.error }, { status: 400 });
    }

    const filename = safeFilename(file.name, file.type);
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const supabase = getSupabaseAdmin();
      const opts = {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      };

      let result = await supabase.storage.from(BUCKET).upload(filename, buffer, opts);
      let { data, error } = result;

      if (error) {
        const isBucketMissing =
          error.message?.toLowerCase().includes('bucket') ||
          error.message?.toLowerCase().includes('not found') ||
          error.message?.toLowerCase().includes('could not find');
        if (isBucketMissing) {
          await supabase.storage.createBucket(BUCKET, { public: true });
          result = await supabase.storage.from(BUCKET).upload(filename, buffer, opts);
          data = result.data;
          error = result.error;
        }
      }

      if (error) {
        console.error('Upload: storage upload failed', error);
        return NextResponse.json(
          { error: error.message || 'Upload failed' },
          { status: 500 }
        );
      }

      if (!data?.path) {
        return NextResponse.json(
          { error: 'Upload succeeded but no path returned' },
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.path);
      return NextResponse.json({ url: urlData.publicUrl });
    }

    // Local fallback: write to public/uploads (works in dev only)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error('Upload error', e);
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : 'Upload failed. Try again or use a smaller image.',
      },
      { status: 500 }
    );
  }
}
