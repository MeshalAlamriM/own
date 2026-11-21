import { GenderType, JobSector, JobStatus } from '@/types/job';

const sectors: JobSector[] = ['government', 'military', 'corporate', 'training', 'results', 'remote'];
const genders: GenderType[] = ['both', 'male', 'female'];
const statuses: JobStatus[] = ['active', 'expiring_soon', 'upcoming', 'results', 'expired'];

export function validateJobInput(value: unknown, partial = false): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'بيانات الإعلان غير صالحة';
  const body = value as Record<string, unknown>;

  if (!partial || 'title' in body) {
    if (typeof body.title !== 'string' || !body.title.trim()) return 'عنوان الإعلان مطلوب';
    if (body.title.trim().length < 4) return 'عنوان الإعلان قصير جدًا';
    if (body.title.trim().length > 200) return 'عنوان الإعلان طويل جدًا';
  }
  if (!partial || 'company' in body) {
    if (typeof body.company !== 'string' || !body.company.trim()) return 'اسم الجهة مطلوب';
    if (body.company.trim().length < 3) return 'اسم الجهة قصير جدًا';
    if (body.company.trim().length > 200) return 'اسم الجهة طويل جدًا';
  }
  if ('sector' in body && !sectors.includes(body.sector as JobSector)) return 'القطاع المحدد غير صالح';
  if ('gender' in body && !genders.includes(body.gender as GenderType)) return 'قيمة الجنس غير صالحة';
  if ('status' in body && !statuses.includes(body.status as JobStatus)) return 'حالة الإعلان غير صالحة';

  for (const field of ['applicationUrl', 'sourceUrl', 'companyLogo']) {
    if (typeof body[field] === 'string' && body[field].trim() && body[field].trim() !== 'https://') {
      try {
        const url = new URL(body[field] as string);
        if (!['http:', 'https:'].includes(url.protocol)) return `رابط ${field} غير صالح`;
        if (field !== 'companyLogo' && !url.hostname.includes('.')) return `رابط ${field} غير صالح`;
      } catch {
        return `رابط ${field} غير صالح`;
      }
    }
  }

  if (typeof body.startDate === 'string' && typeof body.endDate === 'string' && body.startDate && body.endDate) {
    if (body.endDate < body.startDate) return 'تاريخ نهاية التقديم لا يمكن أن يسبق تاريخ البداية';
  }

  for (const field of ['qualifications', 'requirements', 'benefits', 'tags']) {
    if (field in body && body[field] !== undefined && !Array.isArray(body[field])) {
      return `حقل ${field} يجب أن يكون قائمة`;
    }
  }

  return null;
}
