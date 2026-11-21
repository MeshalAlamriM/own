export const BLOG_CATEGORIES = [
  'سوق العمل',
  'السيرة الذاتية',
  'المقابلات الشخصية',
  'التطوير المهني',
  'التدريب والتعليم',
  'نصائح وظيفية',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  coverImage: string;
  status: BlogPostStatus;
  featured: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  coverImage: string;
  status: BlogPostStatus;
  featured: boolean;
}
