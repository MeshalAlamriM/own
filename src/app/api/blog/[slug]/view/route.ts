import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  if (!/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug) || slug.length > 120) {
    return NextResponse.json({ success: false, error: 'رابط المقال غير صالح' }, { status: 400 });
  }
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });
  }

  const { data: viewsCount, error } = await supabase.rpc('increment_blog_views', { post_slug: slug });
  if (error) {
    console.error('Blog view count error:', error.message);
    return NextResponse.json({ success: false, error: 'تعذر تسجيل مشاهدة المقال' }, { status: 500 });
  }
  if (typeof viewsCount !== 'number') {
    return NextResponse.json({ success: false, error: 'المقال غير موجود' }, { status: 404 });
  }

  return NextResponse.json({ success: true, viewsCount });
}
