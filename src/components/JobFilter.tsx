'use client';

import { JobSector, GenderType, JobStatus } from '@/types/job';
import { Search, Filter, RotateCcw } from 'lucide-react';

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
  totalCount
}: JobFilterProps) {
  const sectors: { id: JobSector | 'all'; label: string; icon?: string }[] = [
    { id: 'all', label: 'جميع الإعلانات' },
    { id: 'government', label: 'وظائف حكومية' },
    { id: 'military', label: 'وظائف عسكرية' },
    { id: 'corporate', label: 'شركات كبرى' },
    { id: 'training', label: 'تدريب وتأهيل' },
    { id: 'results', label: 'نتائج القبول' },
    { id: 'remote', label: 'عمل عن بُعد' },
  ];

  const qualifications = [
    { id: 'all', label: 'كافة المؤهلات' },
    { id: 'ثانوية', label: 'ثانوية عامة فما دون' },
    { id: 'دبلوم', label: 'دبلوم' },
    { id: 'بكالوريوس', label: 'بكالوريوس' },
    { id: 'ماجستير', label: 'ماجستير فأعلى' },
  ];

  const cities = [
    { id: 'all', label: 'كافة المدن والمناطق' },
    { id: 'الرياض', label: 'الرياض' },
    { id: 'جدة', label: 'جدة ومكة' },
    { id: 'الشرقية', label: 'المنطقة الشرقية' },
    { id: 'تبوك', label: 'نيوم وتبوك' },
    { id: 'عن بُعد', label: 'عن بُعد (من المنزل)' },
  ];

  const isFiltered =
    selectedSector !== 'all' ||
    selectedQualification !== 'all' ||
    selectedGender !== 'all' ||
    selectedCity !== 'all' ||
    selectedStatus !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 mb-8">
      {/* Search Input Bar */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم الوظيفة، اسم الشركة، الوزارة، أو التخصص (مثال: أرامكو، وزارة الدفاع، محاسبة)..."
          className="w-full pr-11 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
          >
            مسح
          </button>
        )}
      </div>

      {/* Main Sector Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {sectors.map((sec) => (
          <button
            key={sec.id}
            onClick={() => onSectorChange(sec.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              selectedSector === sec.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Dropdown Filters Row */}
      <div className="pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Qualification */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">المؤهل الدراسي</label>
          <select
            value={selectedQualification}
            onChange={(e) => onQualificationChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {qualifications.map((q) => (
              <option key={q.id} value={q.id}>{q.label}</option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">المنطقة / المدينة</label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">الجنس</label>
          <select
            value={selectedGender}
            onChange={(e) => onGenderChange(e.target.value as GenderType | 'all')}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">الكل (رجال ونساء)</option>
            <option value="male">رجال فقط</option>
            <option value="female">نساء فقط</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">حالة التقديم</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as JobStatus | 'all')}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">كافة الحالات</option>
            <option value="active">متاح الآن للتقديم</option>
            <option value="expiring_soon">ينتهي قريباً (عاجل)</option>
            <option value="upcoming">يبدأ قريباً</option>
            <option value="results">أعلنت نتائج القبول</option>
          </select>
        </div>
      </div>

      {/* Filter summary and reset */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>تم العثور على <strong className="text-gray-900 font-bold">{totalCount}</strong> إعلان مطابق</span>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة تعيين الفلاتر</span>
          </button>
        )}
      </div>
    </div>
  );
}
