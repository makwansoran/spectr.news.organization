export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Category = 'politics' | 'finance' | 'economy' | 'companies' | 'breaking';

export type HomepageSection =
  | 'featured'
  | 'breaking'
  | 'trending'
  | 'popular'
  | 'editor_choice'
  | 'worth_reading'
  | null;

export interface Database {
  public: {
    Tables: {
      page_views: {
        Row: { id: string; viewed_at: string };
        Insert: { id?: string; viewed_at?: string };
        Update: Partial<{ id: string; viewed_at: string }>;
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subheadline: string | null;
          category: Category;
          excerpt: string | null;
          body: string;
          featured_image_url: string | null;
          author_name: string | null;
          author_avatar_url: string | null;
          author_email: string | null;
          author_position: string | null;
          is_breaking: boolean;
          is_premium: boolean;
          show_on_homepage: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subheadline?: string | null;
          category: Category;
          excerpt?: string | null;
          body: string;
          featured_image_url?: string | null;
          author_name?: string | null;
          author_avatar_url?: string | null;
          author_email?: string | null;
          author_position?: string | null;
          is_breaking?: boolean;
          is_premium?: boolean;
          show_on_homepage?: boolean;
          homepage_section?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['articles']['Insert']>;
      };
    };
  };
}

export type Article = Database['public']['Tables']['articles']['Row'];
