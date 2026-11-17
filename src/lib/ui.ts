import type { Job, JobSector } from '@/types/job';

/** ألوان وتسميات القطاعات — مصدر واحد لكل الواجهة */
export const sectorStyle: Record<
  JobSector,
  { label: string; chip: string; dot: string; soft: string; text: string }
> = {
  government: {
    label: 'حكومية',
    chip: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-500',
    soft: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  military: {
    label: 'عسكرية',
    chip: 'bg-saffron-50 text-saffron-700 ring-saffron-200',
    dot: 'bg-saffron-500',
    soft: 'bg-saffron-50',
    text: 'text-saffron-700',
  },
  corporate: {
    label: 'شركات',
    chip: 'bg-sky-50 text-sky-800 ring-sky-200',
    dot: 'bg-sky-500',
    soft: 'bg-sky-50',
    text: 'text-sky-700',
  },
  training: {
    label: 'تدريب',
    chip: 'bg-violet-50 text-violet-800 ring-violet-200',
    dot: 'bg-violet-500',
    soft: 'bg-violet-50',
    text: 'text-violet-700',
  },
  results: {
    label: 'نتائج',
    chip: 'bg-rose-50 text-rose-800 ring-rose-200',
    dot: 'bg-rose-500',
    soft: 'bg-rose-50',
    text: 'text-rose-700',
  },
  remote: {
    label: 'عن بُعد',
    chip: 'bg-cyan-50 text-cyan-800 ring-cyan-200',
    dot: 'bg-cyan-500',
    soft: 'bg-cyan-50',
    text: 'text-cyan-700',
  },
};

/** أيام متبقية حتى نهاية التقديم (سالب = منتهي) */
export function daysLeft(endDate: string): number {
  const end = new Date(`${endDate}T23:59:59`).getTime();
  return Math.ceil((end - Date.now()) / 86400000);
}

/** منذ متى نُشر الإعلان */
export function timeAgoAr(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diffDays <= 0) return 'اليوم';
  if (diffDays === 1) return 'أمس';
  if (diffDays === 2) return 'قبل يومين';
  if (diffDays <= 10) return `قبل ${diffDays} أيام`;
  if (diffDays < 30) return `قبل ${diffDays} يوماً`;
  const months = Math.floor(diffDays / 30);
  return months === 1 ? 'قبل شهر' : `قبل ${months} أشهر`;
}

/** هل الإعلان يطابق القطاع المختار (نفس منطق الفلاتر القديم) */
export function matchesSector(job: Job, sector: JobSector | 'all'): boolean {
  if (sector === 'all') return true;
  if (sector === 'remote') {
    return (
      job.sector === 'remote' ||
      job.city.includes('عن بعد') ||
      job.location.includes('عن بعد') ||
      !!job.tags?.some((t) => t.includes('عن بعد'))
    );
  }
  if (sector === 'results') {
    return (
      job.sector === 'results' ||
      job.status === 'results' ||
      !!job.tags?.some((t) => t.includes('نتائج')) ||
      job.title.includes('نتائج')
    );
  }
  if (sector === 'training') {
    return (
      job.sector === 'training' ||
      !!job.tags?.some((t) => t.includes('تدريب')) ||
      job.title.includes('تدريب') ||
      job.summary.includes('تدريب')
    );
  }
  return job.sector === sector;
}

export function initialsOf(name: string): string {
  const clean = name.replace(/^(شركة|وزارة|هيئة|الهيئة|الشركة)\s+/, '').trim();
  return clean.charAt(0) || '؟';
}
