import { Metadata } from 'next';
import { getAllJobs } from '@/data/store';
import JobCard from '@/components/JobCard';
import TelegramBanner from '@/components/TelegramBanner';
import PageHeader from '@/components/PageHeader';
import AdBanner from '@/components/AdBanner';
import { matchesSector } from '@/lib/ui';
import { CheckCircle2, CalendarClock, FileCheck2, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'نتائج القبول والترشيح المبدئي والنهائي | وظيفتك اليوم',
  description: 'متابعة نتائج القبول العسكري والمدني، ترشيح الوظائف التعليمية، ومواعيد المقابلات الشخصية ومطابقة المستندات.',
};

const tracks = [
  { icon: CheckCircle2, label: 'القبول المبدئي' },
  { icon: CalendarClock, label: 'مواعيد المقابلات' },
  { icon: FileCheck2, label: 'مطابقة المستندات' },
  { icon: UserCheck, label: 'القبول النهائي' },
];

export default async function ResultsPage() {
  const allJobs = await getAllJobs();
  const results = allJobs.filter(
    (j) => matchesSector(j, 'results') || j.summary.includes('نتائج')
  );

  return (
    <>
      <PageHeader
        eyebrow="متابعة فورية"
        title="نتائج القبول والترشيح ومواعيد المطابقة"
        description="استعلم عن نتائج القبول المبدئي والنهائي في الوظائف العسكرية وجدارات والوظائف التعليمية والشركات الكبرى، مع مواعيد المراجعة والأوراق المطلوبة."
        icon={CheckCircle2}
      >
        <ul className="flex flex-wrap gap-2.5">
          {tracks.map((t) => {
            const Icon = t.icon;
            return (
              <li key={t.label} className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white/10 ring-1 ring-white/15 text-[13px] font-semibold text-white">
                <Icon className="w-4 h-4 text-saffron-400" />
                {t.label}
              </li>
            );
          })}
        </ul>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <AdBanner placement="sector-top" label="إعلان" />
        <section>
          <div className="mb-7">
            <p className="text-[12px] font-bold text-rose-600 mb-1.5">الأحدث أولاً</p>
            <h2 className="text-[24px] sm:text-[28px] font-bold text-ink-950">
              النتائج الصادرة مؤخراً <span className="text-ink-400 tabular-nums">({results.length})</span>
            </h2>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-14 text-center text-[14px] text-ink-500">
              لا توجد نتائج قبول معلنة حالياً. اشترك في قناتنا على تيليجرام ليصلك تنبيه فور صدور أي نتيجة.
            </div>
          )}
        </section>

        <TelegramBanner />
      </div>
    </>
  );
}
