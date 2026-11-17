import { NextResponse } from 'next/server';
import { getJobById, incrementViews } from '@/data/store';

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ success: false, error: 'الوظيفة غير موجودة' }, { status: 404 });
    }

    await incrementViews(id);
    const updated = await getJobById(id);
    return NextResponse.json({ success: true, viewsCount: updated?.viewsCount ?? job.viewsCount + 1 });
  } catch (error) {
    console.error('API Error incrementing job view:', error);
    return NextResponse.json({ success: false, error: 'تعذر تسجيل المشاهدة' }, { status: 500 });
  }
}
