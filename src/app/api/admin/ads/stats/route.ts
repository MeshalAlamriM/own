import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { AdStatsRow } from '@/lib/ad-analytics';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  const daysValue = Number(new URL(request.url).searchParams.get('days') || 30);
  const days = [7, 30, 90].includes(daysValue) ? daysValue : 30;
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: true, data: { days, totals: { impressions: 0, clicks: 0, ctr: 0 }, rows: [] } });
  }

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('ad_events')
    .select('event_type, placement, slot_id, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(50000);
  if (error) return NextResponse.json({ success: false, error: 'تعذر جلب إحصائيات الإعلانات' }, { status: 500 });

  const grouped = new Map<string, AdStatsRow>();
  for (const event of data || []) {
    const key = `${event.placement}:${event.slot_id}`;
    const row = grouped.get(key) || { unit: key, slotId: event.slot_id, placement: event.placement, impressions: 0, clicks: 0, ctr: 0 };
    if (event.event_type === 'click') row.clicks += 1;
    else row.impressions += 1;
    grouped.set(key, row);
  }
  const rows = [...grouped.values()].map(row => ({ ...row, ctr: row.impressions ? Number(((row.clicks / row.impressions) * 100).toFixed(2)) : 0 })).sort((a, b) => b.impressions - a.impressions);
  const totals = rows.reduce((acc, row) => ({ impressions: acc.impressions + row.impressions, clicks: acc.clicks + row.clicks }), { impressions: 0, clicks: 0 });
  return NextResponse.json({ success: true, data: { days, totals: { ...totals, ctr: totals.impressions ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2)) : 0 }, rows } });
}
