import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, createJob } from '@/data/store';
import { JobFilterParams, JobSector, GenderType, JobStatus } from '@/types/job';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { validateJobInput } from '@/lib/job-validation';
import { recordAuditLog } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || undefined;
    const sector = (searchParams.get('sector') as JobSector | 'all') || undefined;
    const qualification = searchParams.get('qualification') || undefined;
    const gender = (searchParams.get('gender') as GenderType | 'all') || undefined;
    const city = searchParams.get('city') || undefined;
    const status = (searchParams.get('status') as JobStatus | 'all') || undefined;

    const filters: JobFilterParams = {
      query,
      sector,
      qualification,
      gender,
      city,
      status
    };

    const jobs = await getAllJobs(filters);
    return NextResponse.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error('API Error fetching jobs:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء جلب الوظائف' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
    }
    const body = await request.json();
    const validationError = validateJobInput(body);
    if (validationError) return NextResponse.json({ success: false, error: validationError }, { status: 400 });

    const created = await createJob(body);
    await recordAuditLog('create_job', created.id, { title: created.title, company: created.company });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('API Error creating job:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الوظيفة'
    }, { status: 500 });
  }
}
