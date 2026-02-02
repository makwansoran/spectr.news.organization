import { NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { createEditorSession, EDITOR_COOKIE_NAME } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

type EditorCredsRow = { username: string; password_hash: string };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    let admin;
    try {
      admin = getSupabaseAdmin();
    } catch {
      return NextResponse.json(
        { error: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.' },
        { status: 503 }
      );
    }

    const { data, error: fetchError } = await admin
      .from('editor_credentials')
      .select('username, password_hash')
      .eq('username', username)
      .maybeSingle();

    const row = data as EditorCredsRow | null;

    if (fetchError) {
      // Fallback: when DB table is missing/unreachable, use env vars so login still works
      const envUser = process.env.EDITOR_USERNAME;
      const envPass = process.env.EDITOR_PASSWORD;
      if (envUser && envPass && username === envUser && password === envPass) {
        const { value, maxAge } = await createEditorSession();
        const res = NextResponse.json({ ok: true, redirect: '/admin' });
        res.cookies.set(EDITOR_COOKIE_NAME, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge,
          path: '/',
        });
        return res;
      }
      return NextResponse.json(
        {
          error:
            'Database error: editor_credentials table missing or unreachable. Set EDITOR_USERNAME and EDITOR_PASSWORD in Vercel env vars to log in without the table, or run SEED_EDITOR_RUN_IN_SUPABASE.sql in Supabase SQL Editor.',
        },
        { status: 500 }
      );
    }

    // No row: one-time migrate from env if set
    if (!row) {
      const envUser = process.env.EDITOR_USERNAME;
      const envPass = process.env.EDITOR_PASSWORD;
      if (envUser && envPass && username === envUser && password === envPass) {
        const password_hash = await hash(password, 10);
        const insertPayload = { username: envUser, password_hash };
        const { error: insertError } = await admin.from('editor_credentials').insert(insertPayload as never);
        if (insertError) {
          return NextResponse.json({ error: 'Failed to save credentials' }, { status: 500 });
        }
        const { value, maxAge } = await createEditorSession();
        const res = NextResponse.json({ ok: true, redirect: '/admin' });
        res.cookies.set(EDITOR_COOKIE_NAME, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge,
          path: '/',
        });
        return res;
      }
      return NextResponse.json(
        { error: 'Editor login is not configured. Run supabase/migrations/SEED_EDITOR_RUN_IN_SUPABASE.sql in Supabase SQL Editor (creates editor / globalist2024), or set EDITOR_USERNAME and EDITOR_PASSWORD in env once to create the row.' },
        { status: 503 }
      );
    }

    const match = await compare(password, row.password_hash);
    if (!match) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const { value, maxAge } = await createEditorSession();
    const res = NextResponse.json({ ok: true, redirect: '/admin' });
    res.cookies.set(EDITOR_COOKIE_NAME, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
