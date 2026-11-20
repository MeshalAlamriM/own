import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { recordAuditLog } from '@/lib/audit';
import crypto from 'node:crypto';
import { getPublicImageUrl } from '@/lib/image-url';

export const runtime = 'nodejs';

const BUCKET = 'company-logos';
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function detectImageType(bytes: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return 'image/png';
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') return 'image/webp';
  return null;
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: false, error: 'Supabase غير مهيأ' }, { status: 503 });
  }
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BYTES + 64 * 1024) {
    return NextResponse.json({ success: false, error: 'حجم الشعار يجب ألا يتجاوز 2MB' }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: 'تعذر قراءة الملف المرفوع' }, { status: 400 });
  }
  const file = formData.get('file');
  const requestedName = String(formData.get('name') || '').trim().slice(0, 100);
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: 'ملف الشعار مطلوب' }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ success: false, error: 'حجم الشعار يجب أن يكون بين 1 بايت و2MB' }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detectedType = detectImageType(bytes);
  if (!detectedType || !ALLOWED_TYPES.has(file.type) || detectedType !== file.type) {
    return NextResponse.json({ success: false, error: 'يسمح فقط بملفات صور JPG أو PNG أو WEBP سليمة' }, { status: 400 });
  }

  try {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: [...ALLOWED_TYPES],
    });
  } catch {
    // Existing buckets are expected; storage upload below returns a safe error if unavailable.
  }

  const extension = detectedType === 'image/jpeg' ? 'jpg' : detectedType === 'image/png' ? 'png' : 'webp';
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  const path = `logos/${hash}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: detectedType,
    cacheControl: '31536000',
    upsert: false,
  });
  if (uploadError && !/already exists|duplicate/i.test(uploadError.message)) {
    console.error('Logo upload failed:', uploadError.message);
    return NextResponse.json({ success: false, error: 'فشل رفع الشعار، حاول مرة أخرى' }, { status: 500 });
  }

  const publicUrl = getPublicImageUrl(path);
  const displayName = requestedName || file.name.replace(/\.[^.]+$/, '').trim() || 'شعار جهة';
  const libraryKey = 'company_logo_library';
  const { data: existingSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', libraryKey)
    .maybeSingle();
  const oldLibrary = Array.isArray(existingSetting?.value)
    ? existingSetting.value as Array<{ name: string; url: string; path: string }>
    : [];
  const nextLibrary = [
    { name: displayName, url: publicUrl, path },
    ...oldLibrary.filter((item) => item.url !== publicUrl),
  ].slice(0, 500);
  await supabase.from('site_settings').upsert({
    key: libraryKey,
    value: nextLibrary,
    updated_at: new Date().toISOString(),
  });
  await recordAuditLog('upload_logo', undefined, { path, fileType: detectedType, size: file.size });
  return NextResponse.json({ success: true, url: publicUrl });
}
