import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { isValidAdEvent } from '@/lib/ad-analytics';

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: true });
  }
  try {
    const body = await request.json();
    if (!isValidAdEvent(body)) {
      return NextResponse.json({ success: false, error: 'بيانات حدث الإعلان غير صالحة' }, { status: 400 });
    }
    const { eventType, placement, slotId, pagePath } = body;
    const { error } = await supabase.from('ad_events').insert({
      event_type: eventType,
      placement,
      slot_id: slotId,
      page_path: typeof pagePath === 'string' ? pagePath.slice(0, 240) : null,
    });
    if (error) console.warn('Ad event insert failed:', error.message);
    return NextResponse.json({ success: !error });
  } catch {
    return NextResponse.json({ success: false, error: 'تعذر تسجيل حدث الإعلان' }, { status: 400 });
  }
}
