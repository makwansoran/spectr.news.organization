import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);
  const breaking = searchParams.get('breaking') === 'true';
  const showOnHomepage = searchParams.get('show_on_homepage') === 'true';
  const homepageSection = searchParams.get('homepage_section') || undefined;

  let data: unknown[] | null = null;
  let error: { message: string } | null = null;

  if (supabase) {
    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category) query = query.eq('category', category);
    if (breaking) query = query.eq('is_breaking', true);
    if (showOnHomepage) query = query.eq('show_on_homepage', true);
    if (homepageSection) query = query.eq('homepage_section', homepageSection);

    const result = await query;
    data = result.data;
    error = result.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
