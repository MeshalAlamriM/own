import { NextResponse } from 'next/server';
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
