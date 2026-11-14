export type JobSector =
  | 'government'   // وظائف حكومية
  | 'military'     // وظائف عسكرية
  | 'corporate'    // وظائف شركات
  | 'training'     // تدريب وتأهيل
  | 'results'      // نتائج القبول
  | 'remote';      // وظائف عن بعد

export type GenderType = 'both' | 'male' | 'female';

export type JobStatus = 
  | 'active'         // متاح للتقديم
  | 'expiring_soon'  // ينتهي قريباً
  | 'upcoming'       // يبدأ قريباً
  | 'results'        // إعلان نتائج القبول
  | 'expired';       // منتهي التقديم

export interface Job {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyLogo?: string;
  sector: JobSector;
  sectorLabel: string;
  gender: GenderType;
  genderLabel: string;
  qualifications: string[]; // ['ثانوية', 'دبلوم', 'بكالوريوس', ...]
  location: string;
  city: string;
  status: JobStatus;
  startDate: string;
  endDate: string;
  publishDate: string;
  experience: string;
  salary?: string;
  summary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicationUrl: string;
  sourceUrl?: string;
  featured?: boolean;
  urgent?: boolean;
  viewsCount: number;
  tags?: string[];
}

export interface JobFilterParams {
  query?: string;
  sector?: JobSector | 'all';
  qualification?: string;
  gender?: GenderType | 'all';
  city?: string;
  status?: JobStatus | 'all';
  page?: number;
  limit?: number;
}
