import { Metadata } from 'next';
import { getAllJobs } from '@/data/store';
import JobCard from '@/components/JobCard';
import TelegramBanner from '@/components/TelegramBanner';
import { CheckCircle2, BellRing, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'نتائج القبول والترشيح المبدئي والنهائي | وظيفتك اليوم',
  description: 'متابعة نتائج القبول العسكري والمدني، ترشيح الوظائف التعليمية، ومواعيد المقابلات الشخصية ومطابقة المستندات.',
};

export default async function ResultsPage() {
  const allJobs = await getAllJobs();
  const results = allJobs.filter(
    (j) =>
      j.sector === 'results' ||
      j.status === 'results' ||
      j.tags?.some((t) => t.includes('نتائج')) ||
      j.title.includes('نتائج') ||
      j.summary.includes('نتائج')
  );

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-rose-200" />
              <span>متابعة حصرية فورية</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">
              نتائج القبول والترشيح ومواعيد المطابقة
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              استعلم عن نتائج القبول المبدئي والنهائي في الوظائف العسكرية، منصة جدارات، الوظائف التعليمية، والشركات الكبرى، مع تفاصيل مواعيد المراجعة والأوراق المطلوبة.
            </p>
          </div>
        </div>

        {/* Results Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-rose-600" />
              <span>إعلانات النتائج الصادرة مؤخراً ({results.length})</span>
            </h2>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((job) => (
                <JobCard key={job.id} job={job} featuredHighlight={true} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-sm">لا توجد نتائج قبول معلنة حالياً. اشترك بقناة التيليجرام ليصلك تنبيه فور صدور أي نتيجة.</p>
            </div>
          )}
        </div>

        <TelegramBanner />
      </div>
    </div>
  );
}
