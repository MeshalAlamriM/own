import { NextRequest, NextResponse } from 'next/server';
import { adminCookie, createAdminToken, isAdminConfigured, verifyAdminPassword } from '@/lib/admin-auth';

// Best-effort per-instance protection. For multi-instance production deployments,
// also enable an edge/WAF or shared-store rate limit (e.g. Vercel Firewall/Upstash).
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: NextRequest) {
  return request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function isRateLimited(key: string) {
  const now = Date.now();
  for (const [entryKey, value] of attempts) if (value.resetAt <= now) attempts.delete(entryKey);
  if (attempts.size > 5000) attempts.clear();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ success: false, error: 'لم يتم إعداد بيانات دخول الإدارة في متغيرات البيئة' }, { status: 503 });
  }
  const key = clientKey(request);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { success: false, error: 'محاولات كثيرة. يرجى الانتظار 15 دقيقة قبل المحاولة مجدداً.' },
      { status: 429, headers: { 'Retry-After': '900' } },
    );
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 4096) return NextResponse.json({ success: false, error: 'حجم الطلب غير صالح' }, { status: 413 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== 'string' || body.password.length > 1024 || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ success: false, error: 'رمز الدخول غير صحيح' }, { status: 401 });
  }

  attempts.delete(key);
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie.name, createAdminToken(), adminCookie.options);
  return response;
}
