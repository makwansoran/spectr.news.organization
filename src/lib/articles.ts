import { supabase } from './supabase';
import type { Article, Category, HomepageSection } from '@/types';

export async function getArticles(options?: {
  category?: Category;
  limit?: number;
  breaking?: boolean;
  showOnHomepage?: boolean;
  homepageSection?: HomepageSection;
}): Promise<Article[]> {
  if (!supabase) return [];
  let query = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(options?.limit ?? 20);

  if (options?.category) query = query.eq('category', options.category);
  if (options?.breaking) query = query.eq('is_breaking', true);
  if (options?.showOnHomepage === true) query = query.eq('show_on_homepage', true);
  if (options?.homepageSection) query = query.eq('homepage_section', options.homepageSection);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Article[];
}

/** All articles for admin overview (no limit by default). */
export async function getAllArticles(limit = 100): Promise<Article[]> {
  return getArticles({ limit });
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as Article;
}

export async function getRelatedArticles(
  category: Category,
  excludeSlug: string,
  limit = 4
): Promise<Article[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .neq('slug', excludeSlug)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as Article[];
}
