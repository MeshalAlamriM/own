import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_AD_SETTINGS, normalizeAdSettings } from '@/lib/ad-settings';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: true, data: DEFAULT_AD_SETTINGS });
  }
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'ads').maybeSingle();
  if (error) return NextResponse.json({ success: false, error: 'تعذر جلب إعدادات الإعلانات' }, { status: 500 });
  return NextResponse.json({ success: true, data: normalizeAdSettings(data?.value) });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: false, error: 'Supabase غير مهيأ لحفظ الإعدادات' }, { status: 503 });
  }
  try {
    const settings = normalizeAdSettings(await request.json());
    const { error } = await supabase.from('site_settings').upsert({ key: 'ads', value: settings, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    await recordAuditLog('update_settings', 'ads', { enabled: settings.enabled, showOnHome: settings.showOnHome, showOnJobDetail: settings.showOnJobDetail });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('API Error saving ad settings:', error);
    return NextResponse.json({ success: false, error: 'تعذر حفظ إعدادات الإعلانات' }, { status: 500 });
  }
}
