import { NextRequest, NextResponse } from 'next/server';
import { adminCookie, createAdminToken, isAdminConfigured, verifyAdminPassword } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ success: false, error: 'لم يتم إعداد ADMIN_PASSWORD في متغيرات البيئة' }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== 'string' || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ success: false, error: 'رمز الدخول غير صحيح' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie.name, createAdminToken(), adminCookie.options);
  return response;
}
