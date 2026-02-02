import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyEditorSession, EDITOR_COOKIE_NAME } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get(EDITOR_COOKIE_NAME)?.value;
    if (!(await verifyEditorSession(cookieValue))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getSupabaseAdmin();

    const [viewsRes, articlesRes, homepageRes] = await Promise.all([
      admin.from('page_views').select('id', { count: 'exact', head: true }),
      admin.from('articles').select('id', { count: 'exact', head: true }),
      admin.from('articles').select('id', { count: 'exact', head: true }).eq('show_on_homepage', true),
    ]);

    const totalVisitors = viewsRes.count ?? 0;
    const totalArticles = articlesRes.count ?? 0;
    const articlesOnHomepage = homepageRes.count ?? 0;

    return NextResponse.json({
      totalVisitors,
      totalArticles,
      articlesOnHomepage,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load stats' },
      { status: 500 }
    );
  }
}
