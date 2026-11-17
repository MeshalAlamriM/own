import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { recordAuditLog } from '@/lib/audit';

const BUCKET = 'company-logos';
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: false, error: 'Supabase غير مهيأ' }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: 'ملف الشعار مطلوب' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ success: false, error: 'يسمح فقط بصور JPG أو PNG أو WEBP أو SVG' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ success: false, error: 'حجم الشعار يجب ألا يتجاوز 2MB' }, { status: 400 });
  }

  try {
    await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX_BYTES, allowedMimeTypes: [...ALLOWED_TYPES] });
  } catch {
    // The bucket may already exist; upload will provide the meaningful error if not.
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `logos/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (uploadError) {
    return NextResponse.json({ success: false, error: `فشل رفع الشعار: ${uploadError.message}` }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  await recordAuditLog('upload_logo', undefined, { path, fileType: file.type, size: file.size });
  return NextResponse.json({ success: true, url: data.publicUrl });
}
