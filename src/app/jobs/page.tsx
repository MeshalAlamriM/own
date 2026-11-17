import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllJobs } from '@/data/store';
import { JobSector, GenderType, JobStatus } from '@/types/job';
import HomeJobFeed from '@/components/HomeJobFeed';
import PageHeader from '@/components/PageHeader';
import { Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'دليل الوظائف الشاغرة في السعودية | وظيفتك اليوم',
  description: 'تصفح كافة الوظائف الشاغرة في القطاعات الحكومية والعسكرية والشركات والعمل عن بعد لحملة كافة المؤهلات.',
};

interface JobsPageProps {
  searchParams: Promise<{
    sector?: JobSector;
    qualification?: string;
    gender?: GenderType;
    city?: string;
    status?: JobStatus;
    q?: string;
  }>;
}

const titles: Record<string, string> = {
  government: 'أحدث الوظائف الحكومية والمدنية',
  military: 'أحدث الوظائف العسكرية في الدفاع والداخلية والحرس',
  corporate: 'أحدث وظائف الشركات الكبرى والبنوك',
  training: 'برامج التدريب المنتهي بالتوظيف',
  results: 'نتائج القبول والترشيح المبدئي والنهائي',
  remote: 'وظائف العمل عن بُعد',
};

async function JobsFeedContainer({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const jobs = await getAllJobs();

  const title = params.q
    ? `نتائج البحث عن «${params.q}»`
    : (params.sector && titles[params.sector]) || 'دليل كل الوظائف الشاغرة بالمملكة';

  return (
    <>
      <PageHeader
        eyebrow="دليل الوظائف"
        title={title}
        description="تحديث مستمر على مدار الساعة، وفي كل إعلان رابط التقديم الرسمي المباشر ومواعيد البدء والانتهاء."
        icon={Briefcase}
        compact
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <HomeJobFeed
          initialJobs={jobs}
          defaultSector={params.sector || 'all'}
          defaultQualification={params.qualification || 'all'}
          defaultGender={params.gender || 'all'}
          defaultCity={params.city || 'all'}
          defaultStatus={params.status || 'all'}
          defaultQuery={params.q || ''}
        />
      </div>
    </>
  );
}

export default function JobsListingPage(props: JobsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="py-32 text-center text-[14px] text-ink-500">جاري تحميل إعلانات الوظائف…</div>
      }
    >
      <JobsFeedContainer {...props} />
    </Suspense>
  );
}
