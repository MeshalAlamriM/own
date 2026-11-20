export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === 'https:' || url.hostname === 'localhost') {
        return url.origin.replace(/\/+$/, '');
      }
    } catch {
      console.warn('NEXT_PUBLIC_SITE_URL is invalid; using the Vercel deployment URL when available.');
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl && !vercelUrl.toLowerCase().includes('own-two-phi.vercel.app')) {
    return `https://${vercelUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`;
  }
  return 'https://www.job2sa.com';
}
