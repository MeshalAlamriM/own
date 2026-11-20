import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const BUCKET = 'company-logos';
const PUBLIC_PREFIX = `/storage/v1/object/public/${BUCKET}/`;

function getStoragePath(url: string | null | undefined) {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname;
    if (pathname.startsWith('/images/')) {
      return decodeURIComponent(pathname.slice('/images/'.length));
    }
    if (!url.includes(PUBLIC_PREFIX)) return null;
    const marker = `${PUBLIC_PREFIX}`;
    const index = pathname.indexOf(marker);
    return index >= 0 ? decodeURIComponent(pathname.slice(index + marker.length)) : null;
  } catch {
    return null;
  }
}

export async function deleteLogoIfUnused(url: string | null | undefined) {
  if (!isSupabaseConfigured || !supabase) return;
  const path = getStoragePath(url);
  if (!path) return;

  try {
    const { count, error: lookupError } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('company_logo', url as string);
    if (lookupError) {
      console.warn('Could not check logo references:', lookupError.message);
      return;
    }
    if ((count || 0) > 0) return;

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) console.warn('Could not delete unused logo:', error.message);
  } catch (error) {
    console.warn('Logo cleanup failed:', error);
  }
}
