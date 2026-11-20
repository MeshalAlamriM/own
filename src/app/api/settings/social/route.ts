import { NextResponse, connection } from 'next/server';
import { getSocialSettings } from '@/lib/social-settings';

export async function GET() {
  await connection();
  const settings = await getSocialSettings();
  return NextResponse.json({ success: true, data: settings });
}
