import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllJobs } from '@/data/store';
import { JobSector, GenderType, JobStatus } from '@/types/job';
import HomeJobFeed from '@/components/HomeJobFeed';

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

async function JobsFeedContainer({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const jobs = await getAllJobs();

  const getPageTitle = () => {
    switch (params.sector) {
      case 'government':
        return 'أحدث الوظائف الحكومية والمدنية';
      case 'military':
        return 'أحدث الوظائف العسكرية وقطاعات وزارة الدفاع والداخلية';
      case 'corporate':
        return 'أحدث وظائف الشركات الكبرى والبنوك';
      case 'training':
        return 'برامج التدريب المنتهي بالتوظيف';
      case 'results':
        return 'نتائج القبول والترشيح المبدئي والنهائي';
      case 'remote':
        return 'وظائف العمل عن بُعد (من المنزل)';
      default:
        return 'دليل كافة الوظائف الشاغرة بالمملكة';
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          {getPageTitle()}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          تحديث دوري ومستمر على مدار الساعة مع روابط التقديم الرسمية المباشرة.
        </p>
      </div>

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
  );
}

export default function JobsListingPage(props: JobsPageProps) {
  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="py-20 text-center text-sm text-gray-500">
            جاري تحميل إعلانات الوظائف...
          </div>
        }>
          <JobsFeedContainer {...props} />
        </Suspense>
      </div>
    </div>
  );
}
