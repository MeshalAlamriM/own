import { NextResponse } from 'next/server';
import { getHomeStatsSettings } from '@/lib/home-stats-settings';

export async function GET() {
  const settings = await getHomeStatsSettings();
  return NextResponse.json(
    { success: true, data: settings },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
