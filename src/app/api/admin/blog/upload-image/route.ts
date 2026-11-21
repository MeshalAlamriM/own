import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { recordAuditLog } from '@/lib/audit';
import { getPublicImageUrl } from '@/lib/image-url';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

const BUCKET = 'blog-images';
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function detectImageType(bytes: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) return 'image/png';
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) return 'image/webp';
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
    return NextResponse.json({ success: false, error: 'حجم الصورة يجب ألا يتجاوز 5MB' }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: 'تعذر قراءة الصورة المرفوعة' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: 'اختر صورة لرفعها' }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ success: false, error: 'حجم الصورة يجب أن يكون بين 1 بايت و5MB' }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detectedType = detectImageType(bytes);
  if (!detectedType || !ALLOWED_TYPES.has(file.type) || detectedType !== file.type) {
    return NextResponse.json({ success: false, error: 'يسمح فقط بملفات صور JPG أو PNG أو WEBP سليمة' }, { status: 400 });
  }

  try {
    const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: [...ALLOWED_TYPES],
    });
    if (bucketError && !/already exists|duplicate/i.test(bucketError.message)) {
      console.error('Blog image bucket setup failed:', bucketError.message);
      return NextResponse.json({ success: false, error: 'تعذر تهيئة مساحة صور المدونة في Supabase Storage' }, { status: 503 });
    }
  } catch (error) {
    console.error('Blog image bucket setup request failed:', error);
    return NextResponse.json({ success: false, error: 'تعذر تهيئة مساحة صور المدونة في Supabase Storage' }, { status: 503 });
  }

  const extension = detectedType === 'image/jpeg' ? 'jpg' : detectedType === 'image/png' ? 'png' : 'webp';
  const hash = createHash('sha256').update(bytes).digest('hex');
  const path = `covers/${hash}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: detectedType,
    cacheControl: '31536000',
    upsert: false,
  });

  if (uploadError && !/already exists|duplicate/i.test(uploadError.message)) {
    console.error('Blog image upload failed:', uploadError.message);
    return NextResponse.json({ success: false, error: 'فشل رفع الصورة إلى التخزين؛ تحقق من إعدادات Supabase Storage' }, { status: 500 });
  }

  const publicUrl = getPublicImageUrl(`blog/${path}`);
  await recordAuditLog('upload_blog_image', undefined, { path, fileType: detectedType, size: file.size });
  return NextResponse.json({ success: true, url: publicUrl });
}
