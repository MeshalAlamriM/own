import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { rowToAdminBlogPost } from '@/lib/blog';
import { validateBlogPostInput } from '@/lib/blog-shared';
import { recordAuditLog } from '@/lib/audit';
import { supabase } from '@/lib/supabase';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'قاعدة البيانات السحابية غير مهيأة' }, { status: 503 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const validation = validateBlogPostInput(body);
  if (!validation.success) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
  }

  const { data: current, error: currentError } = await supabase
    .from('blog_posts')
    .select('published_at')
    .eq('id', id)
    .maybeSingle();

  if (currentError) {
    console.error('Admin blog lookup error:', currentError);
    return NextResponse.json({ success: false, error: 'تعذر العثور على المقال' }, { status: 500 });
  }
  if (!current) {
    return NextResponse.json({ success: false, error: 'المقال غير موجود' }, { status: 404 });
  }

  const now = new Date().toISOString();
  const post = validation.data;
  const publishedAt = post.status === 'published' ? current.published_at || now : current.published_at;
  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      slug: post.slug,
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.coverImage || null,
      status: post.status,
      featured: post.featured,
      published_at: publishedAt,
      updated_at: now,
    })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: 'هذا الرابط المختصر مستخدم لمقال آخر' }, { status: 409 });
    }
    console.error('Admin blog update error:', error);
    return NextResponse.json({ success: false, error: 'تعذر تحديث المقال في قاعدة البيانات' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ success: false, error: 'المقال غير موجود' }, { status: 404 });
  }

  const savedPost = rowToAdminBlogPost(data);
  await recordAuditLog('update_blog_post', savedPost.id, { slug: savedPost.slug, status: savedPost.status });
  return NextResponse.json({ success: true, data: savedPost });
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'قاعدة البيانات السحابية غير مهيأة' }, { status: 503 });
  }

  const { id } = await params;
  const { data, error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
    .select('id, slug')
    .maybeSingle();

  if (error) {
    console.error('Admin blog delete error:', error);
    return NextResponse.json({ success: false, error: 'تعذر حذف المقال من قاعدة البيانات' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ success: false, error: 'المقال غير موجود' }, { status: 404 });
  }

  await recordAuditLog('delete_blog_post', id, { slug: data.slug });
  return NextResponse.json({ success: true });
}
