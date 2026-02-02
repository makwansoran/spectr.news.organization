import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Category, Database } from '@/types';

type ArticleInsert = Database['public']['Tables']['articles']['Insert'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'article';
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const {
      title,
      slug,
      subheadline,
      category,
      excerpt,
      body,
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

    if (!title || !category || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, body' },
        { status: 400 }
      );
    }

    const validCategories: Category[] = ['politics', 'finance', 'economy', 'companies', 'breaking'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
