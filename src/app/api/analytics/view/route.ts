import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Database } from '@/types/database';

type PageViewInsert = Database['public']['Tables']['page_views']['Insert'];

export async function POST() {
  try {
    const admin = getSupabaseAdmin();
    const row: PageViewInsert = { viewed_at: new Date().toISOString() };
    await admin.from('page_views').insert(row as never);
    return NextResponse.json({ ok: true });
  } catch {
    // Supabase not configured or table missing — don't break the site
    return NextResponse.json({ ok: true });
  }
}
