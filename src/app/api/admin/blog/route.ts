import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { rowToAdminBlogPost } from '@/lib/blog';
import { validateBlogPostInput } from '@/lib/blog-shared';
import { recordAuditLog } from '@/lib/audit';
import { supabase } from '@/lib/supabase';
import type { BlogPostInput } from '@/types/blog';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'قاعدة البيانات السحابية غير مهيأة' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('Admin blog load error:', error);
    return NextResponse.json({ success: false, error: 'تعذر تحميل المقالات. تحقق من إعداد جدول المدونة في Supabase.' }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: (data || []).map((row) => rowToAdminBlogPost(row)) });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'قاعدة البيانات السحابية غير مهيأة' }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const validation = validateBlogPostInput(body);
  if (!validation.success) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
  }

  const now = new Date().toISOString();
  const post = validation.data;
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      id: randomUUID(),
      ...toDatabasePost(post),
      published_at: post.status === 'published' ? now : null,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: 'هذا الرابط المختصر مستخدم لمقال آخر' }, { status: 409 });
    }
    console.error('Admin blog create error:', error);
    return NextResponse.json({ success: false, error: 'تعذر حفظ المقال في قاعدة البيانات' }, { status: 500 });
  }

  const savedPost = rowToAdminBlogPost(data);
  await recordAuditLog('create_blog_post', savedPost.id, { slug: savedPost.slug, status: savedPost.status });
  return NextResponse.json({ success: true, data: savedPost }, { status: 201 });
}

function toDatabasePost(post: BlogPostInput) {
  return {
    slug: post.slug,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    content: post.content,
    cover_image: post.coverImage || null,
    status: post.status,
    featured: post.featured,
  };
}
