import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, createJob } from '@/data/store';
import { JobFilterParams, JobSector, GenderType, JobStatus } from '@/types/job';

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
    const body = await request.json();
    if (!body.title || !body.company) {
      return NextResponse.json({ success: false, error: 'العنوان وجهة العمل مطلوبان' }, { status: 400 });
    }

    const created = await createJob(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('API Error creating job:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء إنشاء الوظيفة' }, { status: 500 });
  }
}
