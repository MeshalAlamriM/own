export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === 'https:' || url.hostname === 'localhost') {
        return url.origin;
      }
    } catch {
      console.warn('NEXT_PUBLIC_SITE_URL is invalid; using the Vercel deployment URL when available.');
    }
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://own-two-phi.vercel.app';
}
