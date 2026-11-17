import { NextRequest, NextResponse } from 'next/server';
import { getJobById, updateJob, deleteJob, incrementViews } from '@/data/store';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { validateJobInput } from '@/lib/job-validation';
import { recordAuditLog } from '@/lib/audit';
import { deleteLogoIfUnused } from '@/lib/logo-storage';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ success: false, error: 'الوظيفة غير موجودة' }, { status: 404 });
    }

    // Increment view count
    await incrementViews(id);

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('API Error fetching job:', error);
    return NextResponse.json({ success: false, error: 'خطأ في جلب تفاصيل الوظيفة' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
    }
    const { id } = await context.params;
    const existing = await getJobById(id);
    const body = await request.json();
    const validationError = validateJobInput(body, true);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }
    const updated = await updateJob(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'الوظيفة غير موجودة' }, { status: 404 });
    }
    if (existing?.companyLogo && existing.companyLogo !== updated.companyLogo) {
      await deleteLogoIfUnused(existing.companyLogo);
    }
    await recordAuditLog('update_job', id, { title: updated.title, company: updated.company });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API Error updating job:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'خطأ في تحديث الوظيفة'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
    }
    const { id } = await context.params;
    const existing = await getJobById(id);
    const deleted = await deleteJob(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'الوظيفة غير موجودة أو تم حذفها مسبقاً' }, { status: 404 });
    }
    await deleteLogoIfUnused(existing?.companyLogo);
    await recordAuditLog('delete_job', id, { title: existing?.title, company: existing?.company });
    return NextResponse.json({ success: true, message: 'تم حذف الإعلان بنجاح' });
  } catch (error) {
    console.error('API Error deleting job:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'خطأ في حذف الوظيفة'
    }, { status: 500 });
  }
}
