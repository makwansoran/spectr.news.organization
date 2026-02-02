import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const VALID_SECTIONS = ['featured', 'breaking', 'trending', 'popular', 'editor_choice', 'worth_reading'] as const;

  try {
    const { id } = await params;
    const body = await request.json();
    const { show_on_homepage, homepage_section } = body;

    const updates: { show_on_homepage?: boolean; homepage_section?: string | null; updated_at: string } = {
      updated_at: new Date().toISOString(),
    };

    if (homepage_section !== undefined) {
      if (homepage_section !== null && homepage_section !== '' && !VALID_SECTIONS.includes(homepage_section)) {
        return NextResponse.json({ error: 'Invalid homepage_section' }, { status: 400 });
      }
      updates.homepage_section = homepage_section === '' ? null : homepage_section;
      updates.show_on_homepage = !!(homepage_section && homepage_section !== '');
    } else if (typeof show_on_homepage === 'boolean') {
      updates.show_on_homepage = show_on_homepage;
      if (!show_on_homepage) updates.homepage_section = null;
    } else {
      return NextResponse.json(
        { error: 'Provide show_on_homepage (boolean) or homepage_section (string or null)' },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select('id, show_on_homepage, homepage_section')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
