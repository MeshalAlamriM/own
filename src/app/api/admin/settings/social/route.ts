import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_SOCIAL_SETTINGS, normalizeSocialSettings } from '@/lib/social-settings';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: true, data: DEFAULT_SOCIAL_SETTINGS });
  }
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'social').maybeSingle();
  if (error) return NextResponse.json({ success: false, error: 'تعذر جلب إعدادات التواصل الاجتماعي' }, { status: 500 });
  return NextResponse.json({ success: true, data: normalizeSocialSettings(data?.value) });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: false, error: 'قاعدة البيانات السحابية غير مهيأة' }, { status: 503 });
  }
  try {
    const rawBody = await request.json();
    const settings = normalizeSocialSettings(rawBody);
    const { error } = await supabase.from('site_settings').upsert({
      key: 'social',
      value: settings,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    await recordAuditLog('update_settings', 'social', { telegram: settings.telegramUrl, whatsapp: settings.whatsappUrl, x: settings.xUrl });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('API Error saving social settings:', error);
    return NextResponse.json({ success: false, error: 'تعذر حفظ إعدادات التواصل' }, { status: 500 });
  }
}
