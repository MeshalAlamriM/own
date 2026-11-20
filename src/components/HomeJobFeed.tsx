'use client';

import { useState, useMemo } from 'react';
import { Job, JobSector, GenderType, JobStatus } from '@/types/job';
import JobCard from './JobCard';
import JobFilter from './JobFilter';
import AdBanner from './AdBanner';
import { Sparkles, Inbox, ArrowDownUp, ChevronDown } from 'lucide-react';
import { matchesSector } from '@/lib/ui';

interface HomeJobFeedProps {
  initialJobs: Job[];
  defaultSector?: JobSector | 'all';
  defaultQualification?: string;
  defaultGender?: GenderType | 'all';
  defaultCity?: string;
  defaultStatus?: JobStatus | 'all';
  defaultQuery?: string;
  defaultExpiringWeek?: boolean;
  defaultSort?: SortKey;
}

type SortKey = 'latest' | 'popular' | 'closing';

const PAGE_SIZE = 12;

const sectorKeys: JobSector[] = ['government', 'military', 'corporate', 'training', 'results', 'remote'];

export default function HomeJobFeed({
  initialJobs,
  defaultSector = 'all',
  defaultQualification = 'all',
  defaultGender = 'all',
  defaultCity = 'all',
  defaultStatus = 'all',
  defaultQuery = '',
  defaultExpiringWeek = false,
  defaultSort = 'latest',
}: HomeJobFeedProps) {
  const [selectedSector, setSelectedSector] = useState<JobSector | 'all'>(defaultSector);
  const [selectedQualification, setSelectedQualification] = useState<string>(defaultQualification);
  const [selectedGender, setSelectedGender] = useState<GenderType | 'all'>(defaultGender);
  const [selectedCity, setSelectedCity] = useState<string>(defaultCity);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>(defaultStatus);
  const [searchQuery, setSearchQuery] = useState<string>(defaultQuery);
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [expiringWeek, setExpiringWeek] = useState(defaultExpiringWeek);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const handleReset = () => {
    setSelectedSector('all');
    setSelectedQualification('all');
    setSelectedGender('all');
    setSelectedCity('all');
    setSelectedStatus('all');
    setSearchQuery('');
    setExpiringWeek(false);
    setSort('latest');
    setVisible(PAGE_SIZE);
  };

  // أي تغيير في الفلاتر يعيد العدّاد إلى الصفحة الأولى
  const withReset =
    <T,>(fn: (v: T) => void) =>
    (v: T) => {
      fn(v);
      setVisible(PAGE_SIZE);
    };

  const sectorCounts = useMemo(() => {
    const counts: Partial<Record<JobSector | 'all', number>> = { all: initialJobs.length };
    sectorKeys.forEach((k) => {
      counts[k] = initialJobs.filter((j) => matchesSector(j, k)).length;
    });
    return counts;
  }, [initialJobs]);

  const filteredJobs = useMemo(() => {
    const list = initialJobs.filter((job) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hit =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.summary.toLowerCase().includes(q) ||
          job.tags?.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }

      if (!matchesSector(job, selectedSector)) return false;

      if (selectedQualification !== 'all') {
        const hasQual = job.qualifications.some(
          (q) => q.includes(selectedQualification) || selectedQualification.includes(q)
        );
        if (!hasQual) return false;
      }

      if (selectedGender !== 'all') {
        if (job.gender !== 'both' && job.gender !== selectedGender) return false;
      }

      if (selectedCity !== 'all') {
        if (!job.city.includes(selectedCity) && !job.location.includes(selectedCity)) return false;
      }

      if (selectedStatus !== 'all' && job.status !== selectedStatus) return false;

      if (expiringWeek) {
        const end = new Date(`${job.endDate}T23:59:59`).getTime();
        const now = Date.now();
        const days = Math.ceil((end - now) / (24 * 60 * 60 * 1000));
        if (days < 0 || days > 7) return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sort === 'popular') {
      sorted.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    } else if (sort === 'closing') {
      const now = Date.now();
      const key = (j: Job) => {
        const t = new Date(`${j.endDate}T23:59:59`).getTime();
        return t < now ? Number.MAX_SAFE_INTEGER : t; // المنتهية في النهاية
      };
      sorted.sort((a, b) => key(a) - key(b));
    } else {
      sorted.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    }
    return sorted;
  }, [
    initialJobs,
    selectedSector,
    selectedQualification,
    selectedGender,
    selectedCity,
    selectedStatus,
    searchQuery,
    sort,
    expiringWeek,
  ]);

  const isDefaultView =
    selectedSector === 'all' &&
    selectedQualification === 'all' &&
    selectedGender === 'all' &&
    selectedCity === 'all' &&
    selectedStatus === 'all' &&
    !expiringWeek &&
    !searchQuery.trim();

  const featuredJobs = useMemo(() => initialJobs.filter((j) => j.featured).slice(0, 3), [initialJobs]);

  const shown = filteredJobs.slice(0, visible);
  const remaining = filteredJobs.length - shown.length;

  return (
    <section id="jobs-section" className="scroll-mt-28">
      {/* الإعلانات المميزة (العرض الافتراضي فقط) */}
      {isDefaultView && featuredJobs.length > 0 && (
        <div className="mb-12">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-saffron-700 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                اختيار التحرير
              </p>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-ink-950">فرص مختارة هذا الأسبوع</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={`feat-${job.id}`} job={job} featuredHighlight />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[12px] font-bold text-ink-400 mb-1.5">كل الإعلانات</p>
          <h2 className="text-[22px] sm:text-[26px] font-bold text-ink-950">تصفّح الوظائف</h2>
        </div>

        <label className="inline-flex items-center gap-2 text-[13px] text-ink-500">
          <ArrowDownUp className="w-4 h-4" />
          <span className="hidden sm:inline">الترتيب:</span>
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 appearance-none ps-3 pe-8 rounded-xl border border-line bg-white text-ink-800 font-semibold outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200"
            >
              <option value="latest">الأحدث</option>
              <option value="popular">الأكثر مشاهدة</option>
              <option value="closing">ينتهي قريباً</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 -translate-y-1/2 end-2.5 w-4 h-4 text-ink-400" />
          </span>
        </label>
      </div>

      <JobFilter
        selectedSector={selectedSector}
        onSectorChange={withReset(setSelectedSector)}
        selectedQualification={selectedQualification}
        onQualificationChange={withReset(setSelectedQualification)}
        selectedGender={selectedGender}
        onGenderChange={withReset(setSelectedGender)}
        selectedCity={selectedCity}
        onCityChange={withReset(setSelectedCity)}
        selectedStatus={selectedStatus}
        onStatusChange={withReset(setSelectedStatus)}
        searchQuery={searchQuery}
        onSearchChange={withReset(setSearchQuery)}
        onReset={handleReset}
        totalCount={filteredJobs.length}
        sectorCounts={sectorCounts}
      />

      {shown.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((job, idx) => (
              <div key={job.id} className="contents">
                <JobCard job={job} />
                {idx === 2 && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <AdBanner placement={selectedSector === 'all' ? 'home-infeed' : 'sector-infeed'} label="إعلان" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {remaining > 0 && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-ink-950 text-white text-[14px] font-semibold hover:bg-ink-800 transition-colors"
              >
                <span>عرض المزيد</span>
                <span className="text-saffron-400 tabular-nums">({remaining})</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-ink-200 bg-white">
          <div className="w-16 h-16 rounded-2xl bg-paper-2 flex items-center justify-center mx-auto mb-4 text-ink-400">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-[18px] font-bold text-ink-900 mb-1.5">لا توجد إعلانات مطابقة</h3>
          <p className="text-[14px] text-ink-500 max-w-md mx-auto mb-6 leading-relaxed">
            جرّب كلمات أخرى أو خفّف الفلاتر، أو أعد التعيين لعرض كل الإعلانات المتاحة.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="h-11 px-6 rounded-xl bg-saffron-400 hover:bg-saffron-300 text-ink-950 text-[14px] font-bold transition-colors"
          >
            عرض كل الوظائف ({initialJobs.length})
          </button>
        </div>
      )}
    </section>
  );
}
