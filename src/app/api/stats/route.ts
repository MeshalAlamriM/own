import { NextResponse } from 'next/server';
import { getJobStats } from '@/data/store';

export async function GET() {
  try {
    const stats = await getJobStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('API Error fetching stats:', error);
    return NextResponse.json({ success: false, error: 'خطأ في جلب الإحصاءات' }, { status: 500 });
  }
}
