import { NextRequest, NextResponse } from 'next/server';
import { connection } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  await connection();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ status: 'error', message: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = 
    process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

  if (!url || !key) {
    return NextResponse.json({
      status: 'error',
      message: 'المتغيرات غير مكتملة في Vercel',
      hasUrl: Boolean(url),
      hasKey: Boolean(key),
    });
  }

  if (!supabase) {
    return NextResponse.json({
      status: 'error',
      message: 'فشل تهيئة عميل Supabase',
    });
  }

  try {
    // 1. Test if table 'jobs' exists
    const { data, error } = await supabase.from('jobs').select('id, title').limit(5);

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'فشل الاستعلام من جدول jobs',
        hint: error.message.includes('relation "public.jobs" does not exist')
          ? 'جدول jobs غير موجود في Supabase! يجب تشغيل كود الـ SQL في SQL Editor.'
          : error.message,
        supabaseError: error,
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'الاتصال بـ Supabase ناجح 100%! الجدول موجود وشغال.',
      jobsCountInCloud: data ? data.length : 0,
      sampleJobs: data,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'exception',
      message: 'حدث خطأ غير متوقع أثناء الاتصال بـ Supabase',
      error: err?.message || err,
    });
  }
}
