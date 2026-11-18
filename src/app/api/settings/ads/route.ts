import { NextResponse } from 'next/server';
import { getAdSettings } from '@/lib/ad-settings';

export async function GET() {
  const settings = await getAdSettings();
  return NextResponse.json({ success: true, data: settings }, { headers: { 'Cache-Control': 'no-store' } });
}
