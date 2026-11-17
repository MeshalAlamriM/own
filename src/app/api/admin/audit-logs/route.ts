import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: true, data: [] });
  }
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select('id, action, resource_id, details, created_at')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) {
    return NextResponse.json({ success: false, error: 'تعذر جلب سجل العمليات' }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: data || [] });
}
