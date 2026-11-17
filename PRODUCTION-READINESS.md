# Production readiness notes

## Required Vercel environment variables

Set these in Vercel for Production (and Preview only if needed):

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only; never use the `NEXT_PUBLIC_` prefix)
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (use a different, random value from the admin password)
- `NEXT_PUBLIC_SITE_URL` (canonical public site origin)

Optional Telegram variables: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID`.

## Data and security

- Supabase must be configured and reachable in production; local JSON files are not durable storage on serverless hosting.
- Keep Supabase Row Level Security enabled and ensure public users have read-only access to published job data.
- Admin writes require the server-side service role key and the signed admin session.
- Job summary and description are reduced to safe text before they are written through the admin API.
- Logo uploads accept raster image formats only; SVG uploads are disabled to avoid serving active markup as an image.

## AdSense (deliberately deferred)

Ads are not enabled. Do not add a placeholder publisher ID. After Google approves the site, set a real `NEXT_PUBLIC_ADSENSE_ID`, pass a real ad unit ID as `slotId` to each `AdBanner`, and replace `public/ads.txt` with Google's exact seller record.

## Before production

1. Run `npm ci`, `npm run lint`, and `npm run build`.
2. Verify the Supabase schema and RLS policies are applied.
3. Test admin create, edit, and delete operations against Supabase.
4. Confirm the production canonical origin matches `NEXT_PUBLIC_SITE_URL`.
5. Test a real job page's JSON-LD and verify expired or results posts are not marked as open jobs.
