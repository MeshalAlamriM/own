'use client';

import { useState } from 'react';
import { JobSector, GenderType, JobStatus } from '@/types/job';
import { Search, RotateCcw, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

interface JobFilterProps {
  selectedSector: JobSector | 'all';
  onSectorChange: (sector: JobSector | 'all') => void;
  selectedQualification: string;
  onQualificationChange: (qual: string) => void;
  selectedGender: GenderType | 'all';
  onGenderChange: (gender: GenderType | 'all') => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedStatus: JobStatus | 'all';
  onStatusChange: (status: JobStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
  totalCount: number;
  /** عدد الإعلانات لكل قطاع (اختياري) */
  sectorCounts?: Partial<Record<JobSector | 'all', number>>;
}

const sectors: { id: JobSector | 'all'; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'government', label: 'حكومية' },
  { id: 'military', label: 'عسكرية' },
  { id: 'corporate', label: 'شركات' },
  { id: 'training', label: 'تدريب' },
  { id: 'results', label: 'نتائج القبول' },
  { id: 'remote', label: 'عن بُعد' },
];

const qualifications = [
  { id: 'all', label: 'كافة المؤهلات' },
  { id: 'ثانوية', label: 'ثانوية عامة فما دون' },
  { id: 'دبلوم', label: 'دبلوم' },
  { id: 'بكالوريوس', label: 'بكالوريوس' },
  { id: 'ماجستير', label: 'ماجستير فأعلى' },
];

const cities = [
  { id: 'all', label: 'كافة المناطق' },
  { id: 'الرياض', label: 'الرياض' },
  { id: 'جدة', label: 'جدة ومكة' },
  { id: 'الشرقية', label: 'المنطقة الشرقية' },
  { id: 'تبوك', label: 'نيوم وتبوك' },
  { id: 'عن بُعد', label: 'عن بُعد' },
];

const genders = [
  { id: 'all', label: 'رجال ونساء' },
  { id: 'male', label: 'رجال' },
  { id: 'female', label: 'نساء' },
];

const statuses = [
  { id: 'all', label: 'كافة الحالات' },
  { id: 'active', label: 'متاح الآن' },
  { id: 'expiring_soon', label: 'ينتهي قريباً' },
  { id: 'upcoming', label: 'يبدأ قريباً' },
  { id: 'results', label: 'أُعلنت النتائج' },
];

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  const active = value !== 'all';
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-11 appearance-none ps-3.5 pe-9 rounded-xl border text-[13.5px] font-medium bg-white outline-none transition-colors focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 ${
            active ? 'border-ink-900 text-ink-950' : 'border-line text-ink-700'
          }`}
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 -translate-y-1/2 end-3 w-4 h-4 text-ink-400" />
      </span>
    </label>
  );
}

export default function JobFilter({
  selectedSector,
  onSectorChange,
  selectedQualification,
  onQualificationChange,
  selectedGender,
  onGenderChange,
  selectedCity,
  onCityChange,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onReset,
  totalCount,
  sectorCounts,
}: JobFilterProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const advancedCount = [selectedQualification, selectedCity, selectedGender, selectedStatus].filter(
    (v) => v !== 'all'
  ).length;

  const isFiltered = selectedSector !== 'all' || advancedCount > 0 || searchQuery.trim().length > 0;

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (selectedQualification !== 'all')
    chips.push({
      key: 'q',
      label: qualifications.find((x) => x.id === selectedQualification)?.label ?? selectedQualification,
      clear: () => onQualificationChange('all'),
    });
  if (selectedCity !== 'all')
    chips.push({
      key: 'c',
      label: cities.find((x) => x.id === selectedCity)?.label ?? selectedCity,
      clear: () => onCityChange('all'),
    });
  if (selectedGender !== 'all')
    chips.push({
      key: 'g',
      label: genders.find((x) => x.id === selectedGender)?.label ?? selectedGender,
      clear: () => onGenderChange('all'),
    });
  if (selectedStatus !== 'all')
    chips.push({
      key: 's',
      label: statuses.find((x) => x.id === selectedStatus)?.label ?? selectedStatus,
      clear: () => onStatusChange('all'),
    });

  return (
    <div className="rounded-3xl border border-line bg-white shadow-soft mb-8 overflow-hidden">
      {/* البحث + زر التصفية */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-ink-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بمسمى الوظيفة أو الجهة أو التخصص…"
            aria-label="بحث في الوظائف"
            className="w-full h-12 ps-12 pe-12 rounded-2xl bg-paper border border-transparent text-[14.5px] text-ink-900 placeholder:text-ink-400 outline-none transition focus:bg-white focus:border-saffron-500 focus:ring-4 focus:ring-saffron-100"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="مسح البحث"
              className="absolute top-1/2 -translate-y-1/2 end-3 w-7 h-7 rounded-full bg-ink-100 hover:bg-ink-200 text-ink-600 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
          aria-expanded={advancedOpen}
          className={`h-12 px-5 inline-flex items-center justify-center gap-2 rounded-2xl text-[14px] font-semibold transition-colors ${
            advancedOpen || advancedCount > 0
              ? 'bg-ink-950 text-white'
              : 'bg-paper text-ink-800 hover:bg-paper-2'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>تصفية متقدمة</span>
          {advancedCount > 0 && (
            <span className="min-w-5 h-5 px-1 rounded-full bg-saffron-400 text-ink-950 text-[11px] font-bold flex items-center justify-center">
              {advancedCount}
            </span>
          )}
        </button>
      </div>

      {/* تبويبات القطاعات */}
      <div className="px-4 sm:px-5 border-t border-line">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none -mb-px" role="tablist" aria-label="القطاعات">
          {sectors.map((sec) => {
            const active = selectedSector === sec.id;
            const count = sectorCounts?.[sec.id];
            return (
              <button
                key={sec.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSectorChange(sec.id)}
                className={`shrink-0 relative inline-flex items-center gap-2 h-12 px-3.5 text-[14px] font-semibold transition-colors ${
                  active ? 'text-ink-950' : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                {sec.label}
                {typeof count === 'number' && (
                  <span
                    className={`text-[11px] font-bold h-5 min-w-5 px-1.5 rounded-full inline-flex items-center justify-center ${
                      active ? 'bg-saffron-400 text-ink-950' : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
                {active && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-ink-950" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* الفلاتر المتقدمة */}
      {advancedOpen && (
        <div className="px-4 sm:px-5 py-5 border-t border-line bg-paper/60 grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
          <Select label="المؤهل الدراسي" value={selectedQualification} onChange={onQualificationChange} options={qualifications} />
          <Select label="المنطقة" value={selectedCity} onChange={onCityChange} options={cities} />
          <Select
            label="الفئة"
            value={selectedGender}
            onChange={(v) => onGenderChange(v as GenderType | 'all')}
            options={genders}
          />
          <Select
            label="حالة التقديم"
            value={selectedStatus}
            onChange={(v) => onStatusChange(v as JobStatus | 'all')}
            options={statuses}
          />
        </div>
      )}

      {/* ملخص النتائج */}
      <div className="px-4 sm:px-5 py-3 border-t border-line flex flex-wrap items-center justify-between gap-3 text-[13px] text-ink-500">
        <div className="flex flex-wrap items-center gap-2">
          <span>
            <strong className="text-ink-950 font-bold tabular-nums">{totalCount}</strong> إعلان
          </span>
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.clear}
              className="inline-flex items-center gap-1.5 h-7 ps-3 pe-2 rounded-full bg-saffron-50 ring-1 ring-saffron-200 text-saffron-700 text-[12px] font-semibold hover:bg-saffron-100 transition-colors"
            >
              {c.label}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-ink-700 hover:text-ink-950 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة التعيين</span>
          </button>
        )}
      </div>
    </div>
  );
}
