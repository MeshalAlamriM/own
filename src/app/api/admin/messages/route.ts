import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: data || [] });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });
  }

  const body = await request.json();
  const id = Number(body.id);
  const status = body.status;
  if (!Number.isInteger(id) || !['new', 'in_progress', 'resolved'].includes(status)) {
    return NextResponse.json({ success: false, error: 'بيانات غير صحيحة' }, { status: 400 });
  }

  const { error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await recordAuditLog('update_contact_message', String(id), { status });
  return NextResponse.json({ success: true });
}
