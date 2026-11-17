import { NextResponse, connection } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_JOBS } from '@/data/initial-jobs';
import { Job } from '@/types/job';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { recordAuditLog } from '@/lib/audit';

function jobToRow(job: Job) {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    company: job.company,
    company_logo: job.companyLogo,
    sector: job.sector,
    sector_label: job.sectorLabel,
    gender: job.gender,
    gender_label: job.genderLabel,
    qualifications: job.qualifications,
    location: job.location,
    city: job.city,
    status: job.status,
    start_date: job.startDate,
    end_date: job.endDate,
    publish_date: job.publishDate,
    experience: job.experience,
    salary: job.salary,
    summary: job.summary,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    application_url: job.applicationUrl,
    source_url: job.sourceUrl,
    featured: job.featured,
    urgent: job.urgent,
    views_count: job.viewsCount,
    tags: job.tags
  };
}

export async function GET() {
  await connection();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
  }

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({
      success: false,
      error: 'Supabase is not configured'
    }, { status: 400 });
  }

  try {
    const rows = INITIAL_JOBS.map(jobToRow);
    const { data, error } = await supabase
      .from('jobs')
      .upsert(rows, { onConflict: 'id', ignoreDuplicates: true });

    if (error) {
      console.error('Seed error:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    // Fetch total count now
    const { count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });
    await recordAuditLog('seed_jobs', undefined, { seededCount: rows.length, totalJobsInCloud: count });

    return NextResponse.json({
      success: true,
      message: 'تمت مزامنة وحفظ كافة الوظائف الافتراضية في قاعدة البيانات السحابية بنجاح!',
      seededCount: rows.length,
      totalJobsInCloud: count
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || String(err)
    }, { status: 500 });
  }
}
