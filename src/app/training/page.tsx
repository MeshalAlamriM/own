import { Metadata } from 'next';
import { getAllJobs } from '@/data/store';
import JobCard from '@/components/JobCard';
import TelegramBanner from '@/components/TelegramBanner';
import { GraduationCap, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'برامج التدريب المنتهي بالتوظيف والابتعاث | وظيفتك اليوم',
  description: 'أحدث برامج التدريب المنتهي بالتوظيف في أرامكو، سابك، صندوق الاستثمارات، والجهات الكبرى مع مكافآت وسكن وتأمين شامل.',
};

export default async function TrainingPage() {
  const allJobs = await getAllJobs();
  const trainingJobs = allJobs.filter(
    (j) =>
      j.sector === 'training' ||
      j.tags?.some((t) => t.includes('تدريب')) ||
      j.title.includes('تدريب') ||
      j.summary.includes('تدريب')
  );

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-purple-200" />
              <span>تأهيل احترافي وتوظيف مباشر</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">
              برامج التدريب المنتهي بالتوظيف والتدرج المهني
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
              فرص تدريبية مدفوعة الأجر مع مكافآت شهرية وسكن وتأمين صحي شامل تنتهي بالتعيين المباشر في كبرى الشركات والمؤسسات الوطنية.
            </p>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>البرامج المتاحة للتسجيل حالياً ({trainingJobs.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingJobs.map((job) => (
              <JobCard key={job.id} job={job} featuredHighlight={true} />
            ))}
          </div>
        </div>

        <TelegramBanner />
      </div>
    </div>
  );
}
