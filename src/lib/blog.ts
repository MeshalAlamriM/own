import { supabase } from '@/lib/supabase';
import { BLOG_CATEGORIES } from '@/types/blog';
import type { BlogPost, BlogPostStatus } from '@/types/blog';

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  cover_image: string | null;
  status: BlogPostStatus;
  featured: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

function rowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: BLOG_CATEGORIES.find((category) => category === row.category) || BLOG_CATEGORIES[0],
    excerpt: row.excerpt,
    content: row.content || '',
    coverImage: row.cover_image || '',
    status: row.status,
    featured: Boolean(row.featured),
    viewsCount: Number(row.views_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, category, excerpt, cover_image, status, featured, views_count, created_at, updated_at, published_at')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(200);

  if (error) throw new Error(`تعذر تحميل مقالات المدونة: ${error.message}`);
  return (data || []).map((row) => rowToBlogPost(row as BlogPostRow));
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw new Error(`تعذر تحميل المقال: ${error.message}`);
  return data ? rowToBlogPost(data as BlogPostRow) : null;
}

export function rowToAdminBlogPost(row: BlogPostRow): BlogPost {
  return rowToBlogPost(row);
}
