import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyEditorSession, EDITOR_COOKIE_NAME } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Category } from '@/types';

const VALID_SECTIONS = ['featured', 'breaking', 'trending', 'popular', 'editor_choice', 'worth_reading'] as const;
const VALID_CATEGORIES: Category[] = ['politics', 'finance', 'economy', 'companies', 'breaking', 'trade'];

async function requireEditor() {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(EDITOR_COOKIE_NAME)?.value;
  if (!(await verifyEditorSession(cookieValue))) {
    return NextResponse.json(
      { error: 'Unauthorized. Log in at Editor’s Desk first.' },
      { status: 401 }
    );
  }
  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireEditor();
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.code === 'PGRST116' ? 404 : 500 });
    }
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireEditor();
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const body = await request.json();

    const {
      show_on_homepage,
      homepage_section,
      title,
      subheadline,
      category,
      excerpt,
      body: bodyHtml,
      featured_image_url,
      author_name,
      author_avatar_url,
      author_email,
      author_position,
      is_breaking,
      is_premium,
    } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined || subheadline !== undefined || category !== undefined || excerpt !== undefined
      || bodyHtml !== undefined || featured_image_url !== undefined || author_name !== undefined
      || author_avatar_url !== undefined || author_email !== undefined || author_position !== undefined
      || is_breaking !== undefined || is_premium !== undefined) {
      if (title !== undefined && typeof title === 'string') updates.title = title;
      if (subheadline !== undefined) updates.subheadline = subheadline ?? null;
      if (category !== undefined) {
        if (!VALID_CATEGORIES.includes(category)) {
          return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        }
        updates.category = category;
      }
      if (excerpt !== undefined) updates.excerpt = excerpt ?? null;
      if (bodyHtml !== undefined) updates.body = bodyHtml;
      if (featured_image_url !== undefined) updates.featured_image_url = featured_image_url ?? null;
      if (author_name !== undefined) updates.author_name = author_name ?? null;
      if (author_avatar_url !== undefined) updates.author_avatar_url = author_avatar_url ?? null;
      if (author_email !== undefined) updates.author_email = author_email ?? null;
      if (author_position !== undefined) updates.author_position = author_position ?? null;
      if (typeof is_breaking === 'boolean') updates.is_breaking = is_breaking;
      if (typeof is_premium === 'boolean') updates.is_premium = is_premium;
    }

    if (homepage_section !== undefined) {
      if (homepage_section !== null && homepage_section !== '' && !VALID_SECTIONS.includes(homepage_section)) {
        return NextResponse.json({ error: 'Invalid homepage_section' }, { status: 400 });
      }
      updates.homepage_section = homepage_section === '' ? null : homepage_section;
      updates.show_on_homepage = !!(homepage_section && homepage_section !== '');
    } else if (typeof show_on_homepage === 'boolean') {
      updates.show_on_homepage = show_on_homepage;
      if (!show_on_homepage) updates.homepage_section = null;
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('articles')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireEditor();
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const admin = getSupabaseAdmin();
    const { error } = await admin.from('articles').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
