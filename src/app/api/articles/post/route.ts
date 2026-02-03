import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyEditorSession, EDITOR_COOKIE_NAME } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Category, Database } from '@/types';

export const runtime = 'nodejs';

type ArticleInsert = Database['public']['Tables']['articles']['Insert'];

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'article';
}

export async function POST(request: Request) {
  const authErr = await requireEditor();
  if (authErr) return authErr;

  try {
    const payload = await request.json().catch(() => ({}));
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const {
      title: titleIn,
      slug,
      subheadline,
      category: categoryIn,
      excerpt,
      body: bodyIn,
      featured_image_url,
      author_name,
      author_avatar_url,
      author_email,
      author_position,
      is_breaking,
      is_premium,
      show_on_homepage,
      homepage_section,
    } = payload;

    const title = titleIn != null ? String(titleIn).trim() : '';
    const category = categoryIn != null ? String(categoryIn).trim() : '';
    const body = bodyIn != null ? String(bodyIn) : '';

    if (!title || !category || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, body' },
        { status: 400 }
      );
    }

    const validCategories: Category[] = ['politics', 'finance', 'economy', 'companies', 'breaking', 'trade'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    let admin;
    try {
      admin = getSupabaseAdmin();
    } catch (envErr) {
      console.error('Article POST: Supabase not configured', envErr);
      return NextResponse.json(
        { error: 'Database not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.' },
        { status: 500 }
      );
    }
    const baseSlug = slug && slug.trim() ? slugify(slug) : slugify(title);
    let slugToUse = baseSlug;
    let attempt = 1;
    while (true) {
      const { data: existing } = await admin.from('articles').select('id').eq('slug', slugToUse).maybeSingle();
      if (!existing) break;
      slugToUse = `${baseSlug}-${++attempt}`;
    }

    const row: ArticleInsert = {
      title,
      slug: slugToUse,
      subheadline: subheadline || null,
      category: category as Category,
      excerpt: excerpt || null,
      body,
      featured_image_url: featured_image_url || null,
      author_name: author_name || null,
      author_avatar_url: author_avatar_url || null,
      author_email: author_email || null,
      author_position: author_position || null,
      is_breaking: Boolean(is_breaking),
      is_premium: Boolean(is_premium),
      show_on_homepage: Boolean(show_on_homepage ?? !!homepage_section),
      homepage_section: homepage_section || null,
    };
    // Table types from our Database generic; insert row matches articles.Insert
    // @ts-expect-error Supabase inferred insert type can be strict with custom Database
    const { data, error } = await admin.from('articles').insert(row).select('id, slug, title, created_at').single();

    if (error) {
      const msg = error.message || 'Database insert failed';
      const hint =
        msg.includes('does not exist') || msg.includes('column') || msg.includes('constraint')
          ? ' Run all migrations in supabase/migrations (or RUN_THIS_IN_SUPABASE.sql + 007, 010) in Supabase SQL Editor.'
          : '';
      console.error('Article POST insert error', error);
      return NextResponse.json({ error: msg + hint }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error('Article POST error', e);
    const msg = e instanceof Error ? e.message : 'Invalid request body';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
