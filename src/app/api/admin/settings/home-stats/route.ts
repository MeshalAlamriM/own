import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  DEFAULT_HOME_STATS_SETTINGS,
  normalizeHomeStatsSettings,
} from '@/lib/home-stats-settings';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: true, data: DEFAULT_HOME_STATS_SETTINGS });
  }
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'home_stats')
    .maybeSingle();
  if (error) {
    return NextResponse.json({ success: false, error: 'تعذر جلب إعدادات إحصاءات الصفحة الرئيسية' }, { status: 500 });
  }
  return NextResponse.json({
    success: true,
    data: normalizeHomeStatsSettings(data?.value),
  });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: false, error: 'قاعدة البيانات السحابية غير مهيأة' }, { status: 503 });
  }
  try {
    const settings = normalizeHomeStatsSettings(await request.json());
    const { error } = await supabase.from('site_settings').upsert({
      key: 'home_stats',
      value: settings,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    await recordAuditLog('update_settings', 'home_stats', {
      total: settings.total,
      active: settings.active,
      expiringSoon: settings.expiringSoon,
      totalViews: settings.totalViews,
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('API Error saving home stats settings:', error);
    return NextResponse.json({ success: false, error: 'تعذر حفظ إعدادات إحصاءات الصفحة الرئيسية' }, { status: 500 });
  }
}
