'use client';

import { useState, useMemo } from 'react';
import { Job, JobSector, GenderType, JobStatus } from '@/types/job';
import JobCard from './JobCard';
import JobFilter from './JobFilter';
import { Flame, Sparkles, Inbox } from 'lucide-react';

interface HomeJobFeedProps {
  initialJobs: Job[];
  defaultSector?: JobSector | 'all';
  defaultQualification?: string;
  defaultGender?: GenderType | 'all';
  defaultCity?: string;
  defaultStatus?: JobStatus | 'all';
  defaultQuery?: string;
}

export default function HomeJobFeed({
  initialJobs,
  defaultSector = 'all',
  defaultQualification = 'all',
  defaultGender = 'all',
  defaultCity = 'all',
  defaultStatus = 'all',
  defaultQuery = '',
}: HomeJobFeedProps) {
  const [selectedSector, setSelectedSector] = useState<JobSector | 'all'>(defaultSector);
  const [selectedQualification, setSelectedQualification] = useState<string>(defaultQualification);
  const [selectedGender, setSelectedGender] = useState<GenderType | 'all'>(defaultGender);
  const [selectedCity, setSelectedCity] = useState<string>(defaultCity);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>(defaultStatus);
  const [searchQuery, setSearchQuery] = useState<string>(defaultQuery);

  const handleReset = () => {
    setSelectedSector('all');
    setSelectedQualification('all');
    setSelectedGender('all');
    setSelectedCity('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = job.title.toLowerCase().includes(q);
        const inCompany = job.company.toLowerCase().includes(q);
        const inSummary = job.summary.toLowerCase().includes(q);
        const inTags = job.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inCompany && !inSummary && !inTags) return false;
      }

      // Sector
      if (selectedSector !== 'all') {
        if (selectedSector === 'remote') {
          const isRemote =
            job.sector === 'remote' ||
            job.city.includes('عن بعد') ||
            job.location.includes('عن بعد') ||
            job.tags?.some((t) => t.includes('عن بعد'));
          if (!isRemote) return false;
        } else if (selectedSector === 'results') {
          const isResult =
            job.sector === 'results' ||
            job.status === 'results' ||
            job.tags?.some((t) => t.includes('نتائج')) ||
            job.title.includes('نتائج');
          if (!isResult) return false;
        } else if (selectedSector === 'training') {
          const isTraining =
            job.sector === 'training' ||
            job.tags?.some((t) => t.includes('تدريب')) ||
            job.title.includes('تدريب') ||
            job.summary.includes('تدريب');
          if (!isTraining) return false;
        } else if (job.sector !== selectedSector) {
          return false;
        }
      }

      // Qualification
      if (selectedQualification !== 'all') {
        const hasQual = job.qualifications.some(
          (q) => q.includes(selectedQualification) || selectedQualification.includes(q)
        );
        if (!hasQual) return false;
      }

      // Gender
      if (selectedGender !== 'all') {
        if (job.gender !== 'both' && job.gender !== selectedGender) {
          return false;
        }
      }

      // City
      if (selectedCity !== 'all') {
        if (!job.city.includes(selectedCity) && !job.location.includes(selectedCity)) {
          return false;
        }
      }

      // Status
      if (selectedStatus !== 'all') {
        if (job.status !== selectedStatus) {
          return false;
        }
      }

      return true;
    });
  }, [
    initialJobs,
    selectedSector,
    selectedQualification,
    selectedGender,
    selectedCity,
    selectedStatus,
    searchQuery,
  ]);

  // Separate featured jobs if no active filter
  const isDefaultView =
    selectedSector === 'all' &&
    selectedQualification === 'all' &&
    selectedGender === 'all' &&
    selectedCity === 'all' &&
    selectedStatus === 'all' &&
    !searchQuery.trim();

  const featuredJobs = useMemo(() => {
    return initialJobs.filter((j) => j.featured).slice(0, 3);
  }, [initialJobs]);

  return (
    <section id="jobs-section" className="scroll-mt-24">
      {/* Featured Jobs Section (Only in default view) */}
      {isDefaultView && featuredJobs.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 fill-amber-500" />
              </span>
              <div>
                <h3 className="text-xl font-black text-gray-900">إعلانات وظائف مختارة ومميزة</h3>
                <p className="text-xs text-gray-500">أهم الفرص الوظيفية المتاحة حالياً في كبرى الجهات والشركات</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              الأعلى تفاعلاً
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={`feat-${job.id}`} job={job} featuredHighlight={true} />
            ))}
          </div>
        </div>
      )}

      {/* Filter Component */}
      <JobFilter
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        selectedQualification={selectedQualification}
        onQualificationChange={setSelectedQualification}
        selectedGender={selectedGender}
        onGenderChange={setSelectedGender}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onReset={handleReset}
        totalCount={filteredJobs.length}
      />

      {/* Results Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Inbox className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-gray-800 mb-1">لم يتم العثور على وظائف مطابقة</h4>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5">
            جرب تعديل خيارات البحث أو الفلترة أو إعادة تعيين الفلاتر للاطلاع على كافة الإعلانات المتوفرة.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            عرض كافة الوظائف ({initialJobs.length})
          </button>
        </div>
      )}
    </section>
  );
}
