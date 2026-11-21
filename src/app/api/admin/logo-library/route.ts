import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getPublicImageUrl } from '@/lib/image-url';

export const runtime = 'nodejs';
const BUCKET = 'company-logos';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: true, data: [] });
  }
  const client = supabase;

  const { data: setting } = await client
    .from('site_settings')
    .select('value')
    .eq('key', 'company_logo_library')
    .maybeSingle();
  const named = Array.isArray(setting?.value)
    ? setting.value as Array<{ name: string; url: string; path?: string }>
    : [];

  const { data: storedFiles } = await client.storage.from(BUCKET).list('logos', {
    limit: 1000,
    sortBy: { column: 'name', order: 'asc' },
  });

  const discovered = (storedFiles || [])
    .filter((file) => file.name && !file.name.endsWith('/'))
    .map((file) => {
      const path = `logos/${file.name}`;
      const publicUrl = getPublicImageUrl(path);
      const existing = named.find((item) => item.url === publicUrl || item.url.includes(path) || item.path === path);
      return {
        name: existing?.name || file.name.replace(/\.[^.]+$/, ''),
        url: publicUrl,
        path,
      };
    });

  const merged = [...named, ...discovered].filter((item, index, list) =>
    list.findIndex((other) => other.url === item.url) === index
  );

  return NextResponse.json({ success: true, data: merged });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: false, error: 'Supabase غير مهيأ' }, { status: 503 });
  }

  const body = await request.json();
  const path = typeof body.path === 'string' ? body.path.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
  if (!path || !name) {
    return NextResponse.json({ success: false, error: 'اسم الشعار والمسار مطلوبان' }, { status: 400 });
  }

  const publicUrl = getPublicImageUrl(path);
  const { data: setting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'company_logo_library')
    .maybeSingle();
  const oldLibrary = Array.isArray(setting?.value)
    ? setting.value as Array<{ name: string; url: string; path?: string }>
    : [];
  const updated = [
    { name, url: publicUrl, path },
    ...oldLibrary.filter((item) => item.path !== path && item.url !== publicUrl),
  ].slice(0, 500);

  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'company_logo_library', value: updated, updated_at: new Date().toISOString() });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: false, error: 'Supabase غير مهيأ' }, { status: 503 });
  }

  const body = await request.json();
  const path = typeof body.path === 'string' ? body.path.trim() : '';
  if (!path || !/^logos\/[^/]+$/.test(path)) {
    return NextResponse.json({ success: false, error: 'مسار شعار غير صالح' }, { status: 400 });
  }

  const { error: storageError } = await supabase.storage.from(BUCKET).remove([path]);
  if (storageError) {
    return NextResponse.json({ success: false, error: storageError.message }, { status: 500 });
  }

  const { data: setting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'company_logo_library')
    .maybeSingle();
  const oldLibrary = Array.isArray(setting?.value)
    ? setting.value as Array<{ name: string; url: string; path?: string }>
    : [];
  const updated = oldLibrary.filter((item) => item.path !== path);
  await supabase
    .from('site_settings')
    .upsert({ key: 'company_logo_library', value: updated, updated_at: new Date().toISOString() });

  return NextResponse.json({ success: true });
}
