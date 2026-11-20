import { Metadata } from 'next';
import { getAllJobs } from '@/data/store';
import JobCard from '@/components/JobCard';
import TelegramBanner from '@/components/TelegramBanner';
import PageHeader from '@/components/PageHeader';
import AdBanner from '@/components/AdBanner';
import { matchesSector } from '@/lib/ui';
import { GraduationCap, Wallet, Home, HeartPulse } from 'lucide-react';

export const metadata: Metadata = {
  title: 'برامج التدريب المنتهي بالتوظيف والابتعاث | وظيفتك اليوم',
  description: 'أحدث برامج التدريب المنتهي بالتوظيف في أرامكو، سابك، صندوق الاستثمارات، والجهات الكبرى مع مكافآت وسكن وتأمين شامل.',
};

const perks = [
  { icon: Wallet, label: 'مكافأة شهرية' },
  { icon: Home, label: 'سكن وتنقل' },
  { icon: HeartPulse, label: 'تأمين صحي' },
  { icon: GraduationCap, label: 'تعيين مباشر' },
];

export default async function TrainingPage() {
  const allJobs = await getAllJobs();
  const trainingJobs = allJobs.filter((j) => matchesSector(j, 'training'));

  return (
    <>
      <PageHeader
        eyebrow="تأهيل احترافي وتوظيف مباشر"
        title="برامج التدريب المنتهي بالتوظيف والتدرج المهني"
        description="فرص تدريبية مدفوعة مع مكافآت شهرية وسكن وتأمين صحي، تنتهي بالتعيين المباشر في كبرى الشركات والمؤسسات الوطنية."
        icon={GraduationCap}
      >
        <ul className="flex flex-wrap gap-2.5">
          {perks.map((p) => {
            const Icon = p.icon;
            return (
              <li key={p.label} className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white/10 ring-1 ring-white/15 text-[13px] font-semibold text-white">
                <Icon className="w-4 h-4 text-saffron-400" />
                {p.label}
              </li>
            );
          })}
        </ul>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <AdBanner placement="sector-top" label="إعلان" />
        <section>
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-[12px] font-bold text-violet-600 mb-1.5">التسجيل مفتوح</p>
              <h2 className="text-[24px] sm:text-[28px] font-bold text-ink-950">
                البرامج المتاحة حالياً <span className="text-ink-400 tabular-nums">({trainingJobs.length})</span>
              </h2>
            </div>
          </div>

          {trainingJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trainingJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-14 text-center text-[14px] text-ink-500">
              لا توجد برامج تدريب معلنة حالياً. اشترك في قنواتنا ليصلك التنبيه فور فتح التسجيل.
            </div>
          )}
        </section>

        <TelegramBanner />
      </div>
    </>
  );
}
