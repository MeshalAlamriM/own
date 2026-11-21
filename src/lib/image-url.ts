export function getPublicImageUrl(storagePath: string): string {
  const cleanPath = storagePath.replace(/^\/+/, '');
  const configured = process.env.NEXT_PUBLIC_IMAGES_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      return `${url.origin}/images/${encodeURI(cleanPath)}`;
    } catch {
      // Fall through to the Supabase public URL.
    }
  }

  const primaryImagesDomain = 'https://images.job2sa.com';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  if (supabaseUrl) {
    return `${primaryImagesDomain}/images/${encodeURI(cleanPath)}`;
  }

  return `/images/${encodeURI(cleanPath)}`;
}
