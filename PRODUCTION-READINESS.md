# Deployment notes

## Required production environment variables

Set these in Vercel for Production (and Preview only if needed):

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only; never use the `NEXT_PUBLIC_` prefix)
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (use a different, random value from the admin password)
- `NEXT_PUBLIC_SITE_URL` (the canonical public site origin)

Optional Telegram variables: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID`.

## AdSense

Do not set `NEXT_PUBLIC_ADSENSE_ID` until the site is approved and you have a real publisher ID. Replace the placeholder `pub-0000000000000000` in `public/ads.txt` with the exact seller line Google provides. Use real numeric ad-unit IDs via the `slotId` prop; the component intentionally does not invent a default slot.

## Before production

1. Run `npm ci`, `npm run lint`, and `npm run build`.
2. Verify the Supabase schema and RLS policies are applied.
3. Test admin create, edit, and delete operations against Supabase.
4. Confirm the production canonical origin matches `NEXT_PUBLIC_SITE_URL`.
5. Test a real job page's JSON-LD and verify that results/expired listings are not marked as open jobs.

The local JSON file is not a persistent production database on serverless hosting. Ensure Supabase is configured and reachable before using the admin panel in production.
