import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    const admin = getSupabaseAdmin();
    await admin.from('page_views').insert({});
    return NextResponse.json({ ok: true });
  } catch {
    // Supabase not configured or table missing — don't break the site
    return NextResponse.json({ ok: true });
  }
}
