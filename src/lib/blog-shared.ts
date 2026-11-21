import { BLOG_CATEGORIES } from '@/types/blog';
import type { BlogPostInput } from '@/types/blog';

export function slugifyBlogTitle(title: string): string {
  return title
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function isSafeBlogImageUrl(value: string): boolean {
  if (!value || value.length > 2048 || /[\u0000-\u001f]/.test(value)) return false;
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateBlogPostInput(input: unknown):
  | { success: true; data: BlogPostInput }
  | { success: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { success: false, error: 'بيانات المقال غير صحيحة' };
  }

  const body = input as Record<string, unknown>;
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const slugInput = typeof body.slug === 'string' ? body.slug.trim() : '';
  const slug = slugInput || slugifyBlogTitle(title);
  const category = body.category;
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const coverImage = typeof body.coverImage === 'string' ? body.coverImage.trim() : '';
  const status = body.status;

  if (title.length < 4 || title.length > 180) {
    return { success: false, error: 'عنوان المقال مطلوب (من 4 إلى 180 حرفاً)' };
  }
  if (!/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug) || slug.length > 120) {
    return { success: false, error: 'الرابط المختصر غير صالح؛ استخدم الحروف والأرقام والشرطة فقط' };
  }
  if (!BLOG_CATEGORIES.includes(category as (typeof BLOG_CATEGORIES)[number])) {
    return { success: false, error: 'اختر تصنيفاً صالحاً للمقال' };
  }
  if (excerpt.length < 10 || excerpt.length > 320) {
    return { success: false, error: 'الملخص مطلوب (من 10 إلى 320 حرفاً)' };
  }
  if (content.length < 40 || content.length > 50000) {
    return { success: false, error: 'محتوى المقال مطلوب (من 40 إلى 50000 حرف)' };
  }
  if (status !== 'draft' && status !== 'published') {
    return { success: false, error: 'حالة النشر غير صحيحة' };
  }
  if (coverImage && !isSafeBlogImageUrl(coverImage)) {
    return { success: false, error: 'رابط صورة الغلاف يجب أن يكون HTTPS أو مساراً محلياً صالحاً' };
  }

  return {
    success: true,
    data: {
      slug,
      title,
      category: category as BlogPostInput['category'],
      excerpt,
      content,
      coverImage,
      status,
      featured: body.featured === true,
    },
  };
}
