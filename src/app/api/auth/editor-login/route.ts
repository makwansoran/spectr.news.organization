import { NextResponse } from 'next/server';
import { createEditorSession, EDITOR_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    const expectedUsername = process.env.EDITOR_USERNAME;
    const expectedPassword = process.env.EDITOR_PASSWORD;

    if (!expectedUsername || !expectedPassword) {
      return NextResponse.json(
        { error: 'Editor login is not configured. Set EDITOR_USERNAME and EDITOR_PASSWORD in .env.local.' },
        { status: 503 }
      );
    }

    if (!username || !password || username !== expectedUsername || password !== expectedPassword) {
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
