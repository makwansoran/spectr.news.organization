import { NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { verifyEditorSession, getEditorSessionCookie } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

type EditorCredsRow = { id: string; password_hash: string };

/** Change editor password. Requires valid editor session. */
export async function POST(request: Request) {
  try {
    const cookieValue = getEditorSessionCookie(request);
    if (!(await verifyEditorSession(cookieValue))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return NextResponse.json({ error: 'Current password and new password required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data, error: fetchError } = await admin
      .from('editor_credentials')
      .select('id, password_hash')
      .limit(1)
      .single();

    const row = data as EditorCredsRow | null;
    if (fetchError || !row) {
      return NextResponse.json({ error: 'No editor credentials in database' }, { status: 503 });
    }

    const match = await compare(currentPassword, row.password_hash);
    if (!match) {
      return NextResponse.json({ error: 'Current password is wrong' }, { status: 401 });
    }

    const password_hash = await hash(newPassword, 10);
    const updates = { password_hash, updated_at: new Date().toISOString() };
    const { error: updateError } = await admin
      .from('editor_credentials')
      .update(updates as never)
      .eq('id', row.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
