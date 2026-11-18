import fs from 'fs';
import path from 'path';
import { Job, JobFilterParams } from '../types/job';
import { INITIAL_JOBS } from './initial-jobs';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const DATA_FILE = path.join(process.cwd(), 'data', 'jobs.json');

// In-memory cache for fast local reads
let memoryJobs: Job[] | null = null;

function ensureDataDirectory() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // Ignored if permissions don't allow
    }
  }
}

export function getJobsFromStorage(): Job[] {
  if (memoryJobs && memoryJobs.length > 0) {
    return memoryJobs;
  }

  ensureDataDirectory();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryJobs = parsed;
        return memoryJobs;
      }
    }
  } catch (err) {
    console.error('Error reading jobs file, using initial data:', err);
  }

  // Fallback to initial seed
  memoryJobs = [...INITIAL_JOBS];
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryJobs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Could not write initial jobs to disk:', e);
  }

  return memoryJobs;
}

export function saveJobsToStorage(jobs: Job[]) {
  memoryJobs = jobs;
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving jobs to disk:', err);
  }
}

type DbJobRow = {
  [key: string]: unknown;
  id: string;
  slug: string;
  title: string;
  company: string;
  company_logo?: string | null;
  companyLogo?: string;
  sector: Job['sector'];
  sector_label?: string;
  sectorLabel?: string;
  gender: Job['gender'];
  gender_label?: string;
  genderLabel?: string;
  qualifications?: unknown;
  location: string;
  city: string;
  status: Job['status'];
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  publish_date?: string;
  publishDate?: string;
  experience: string;
  salary?: string;
  summary?: string;
  description?: string;
  requirements?: unknown;
  benefits?: unknown;
  application_url?: string;
  applicationUrl?: string;
  source_url?: string;
  sourceUrl?: string;
  featured?: boolean;
  urgent?: boolean;
  views_count?: number;
  viewsCount?: number;
  tags?: unknown;
};

// Convert Supabase DB row to TypeScript Job model
function rowToJob(row: DbJobRow): Job {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    company: row.company,
    companyLogo: row.company_logo || row.companyLogo,
    sector: row.sector,
    sectorLabel: row.sector_label || row.sectorLabel || '',
    gender: row.gender,
    genderLabel: row.gender_label || row.genderLabel || '',
    qualifications: Array.isArray(row.qualifications) ? row.qualifications : [],
    location: row.location,
    city: row.city,
    status: row.status,
    startDate: row.start_date || row.startDate || '',
    endDate: row.end_date || row.endDate || '',
    publishDate: row.publish_date || row.publishDate || '',
    experience: row.experience,
    salary: row.salary,
    summary: typeof row.summary === 'string' ? row.summary : '',
    description: typeof row.description === 'string' ? row.description : '',
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    applicationUrl: row.application_url || row.applicationUrl || '#',
    sourceUrl: row.source_url || row.sourceUrl,
    featured: Boolean(row.featured),
    urgent: Boolean(row.urgent),
    viewsCount: Number(row.views_count ?? row.viewsCount ?? 1),
    tags: Array.isArray(row.tags) ? row.tags : []
  };
}

// Convert TypeScript Job model to Supabase DB row
function jobToRow(job: Job) {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    company: job.company,
    company_logo: job.companyLogo,
    sector: job.sector,
    sector_label: job.sectorLabel,
    gender: job.gender,
    gender_label: job.genderLabel,
    qualifications: job.qualifications,
    location: job.location,
    city: job.city,
    status: job.status,
    start_date: job.startDate,
    end_date: job.endDate,
    publish_date: job.publishDate,
    experience: job.experience,
    salary: job.salary,
    summary: job.summary,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    application_url: job.applicationUrl,
    source_url: job.sourceUrl,
    featured: job.featured,
    urgent: job.urgent,
    views_count: job.viewsCount,
    tags: job.tags
  };
}

export async function getAllJobs(filters?: JobFilterParams): Promise<Job[]> {
  // If Supabase is configured, fetch from cloud
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('jobs').select('*');

      if (filters?.sector && filters.sector !== 'all') {
        query = query.eq('sector', filters.sector);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.city && filters.city !== 'all') {
        query = query.ilike('city', `%${filters.city}%`);
      }

      const { data, error } = await query.order('publish_date', { ascending: false });

      if (!error && data) {
        let results = data.map(rowToJob);

        if (filters?.query) {
          const q = filters.query.toLowerCase().trim();
          results = results.filter(j =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.summary.toLowerCase().includes(q)
          );
        }

        if (filters?.qualification && filters.qualification !== 'all') {
          results = results.filter(j =>
            j.qualifications.some(qual => qual.includes(filters.qualification!))
          );
        }

        if (filters?.gender && filters.gender !== 'all') {
          results = results.filter(j => j.gender === 'both' || j.gender === filters.gender);
        }

        return results;
      }
    } catch (e) {
      console.error('Supabase query error, falling back to local storage:', e);
    }
  }

  // Fallback to local storage
  const jobs = getJobsFromStorage();

  if (!filters) {
    return jobs.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  return jobs.filter((job) => {
    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchSummary = job.summary.toLowerCase().includes(q);
      const matchTags = job.tags?.some(tag => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSummary && !matchTags) {
        return false;
      }
    }

    if (filters.sector && filters.sector !== 'all') {
      if (job.sector !== filters.sector) return false;
    }

    if (filters.qualification && filters.qualification !== 'all') {
      const hasQual = job.qualifications.some(q => q.includes(filters.qualification!) || filters.qualification!.includes(q));
      if (!hasQual) return false;
    }

    if (filters.gender && filters.gender !== 'all') {
      if (job.gender !== 'both' && job.gender !== filters.gender) return false;
    }

    if (filters.city && filters.city !== 'all') {
      if (!job.city.includes(filters.city) && !job.location.includes(filters.city)) return false;
    }

    if (filters.status && filters.status !== 'all') {
      if (job.status !== filters.status) return false;
    }

    return true;
  }).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const decodedSlug = decodeURIComponent(slug);

  if (isSupabaseConfigured && supabase) {
    try {
      // Use separate equality filters instead of interpolating user-controlled
      // route segments into PostgREST's .or() filter expression.
      const bySlug = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', decodedSlug)
        .maybeSingle();

      if (!bySlug.error && bySlug.data) return rowToJob(bySlug.data);
      if (bySlug.error) throw bySlug.error;

      const byId = await supabase
        .from('jobs')
        .select('*')
        .eq('id', decodedSlug)
        .maybeSingle();

      if (!byId.error) return byId.data ? rowToJob(byId.data) : undefined;
      throw byId.error;
    } catch (e) {
      console.error('Supabase getJobBySlug error:', e);
    }
  }

  const jobs = getJobsFromStorage();
  return jobs.find(j => j.slug === decodedSlug || j.id === decodedSlug || j.slug === slug);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error) {
        return data ? rowToJob(data) : undefined;
      }
    } catch (e) {
      console.error('Supabase getJobById error:', e);
    }
  }

  const jobs = getJobsFromStorage();
  return jobs.find(j => j.id === id);
}

export async function createJob(newJobData: Partial<Job>): Promise<Job> {
  const id = newJobData.id || `job-${Date.now()}`;
  const slug = newJobData.slug || newJobData.title
    ?.toLowerCase()
    .replace(/[^\w\u0621-\u064A0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || id;

  const job: Job = {
    id,
    slug,
    title: newJobData.title || 'إعلان وظيفي جديد',
    company: newJobData.company || 'جهة التوظيف',
    companyLogo: newJobData.companyLogo || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=128&auto=format&fit=crop&q=80',
    sector: newJobData.sector || 'corporate',
    sectorLabel: newJobData.sectorLabel || 'وظائف شركات',
    gender: newJobData.gender || 'both',
    genderLabel: newJobData.genderLabel || 'للجنسين (رجال ونساء)',
    qualifications: newJobData.qualifications || ['بكالوريوس'],
    location: newJobData.location || 'كافة المناطق',
    city: newJobData.city || 'الرياض',
    status: newJobData.status || 'active',
    startDate: newJobData.startDate || new Date().toISOString().split('T')[0],
    endDate: newJobData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    publishDate: new Date().toISOString(),
    experience: newJobData.experience || 'لا يشترط خبرة',
    salary: newJobData.salary || 'رواتب وبدلات مجزية',
    summary: newJobData.summary || '',
    description: newJobData.description || '',
    requirements: newJobData.requirements || [],
    benefits: newJobData.benefits || [],
    applicationUrl: newJobData.applicationUrl || '#',
    sourceUrl: newJobData.sourceUrl || '',
    featured: Boolean(newJobData.featured),
    urgent: Boolean(newJobData.urgent),
    viewsCount: 1,
    tags: newJobData.tags || []
  };

  // Insert into Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('jobs').insert(jobToRow(job));
      if (error) {
        console.error('Supabase createJob error:', error);
        throw new Error(`فشل حفظ الإعلان في قاعدة البيانات: ${error.message}`);
      }
    } catch (e) {
      console.error('Supabase createJob error:', e);
      throw e instanceof Error
        ? e
        : new Error('فشل حفظ الإعلان في قاعدة البيانات');
    }
  }

  // Also update local storage cache
  const localJobs = getJobsFromStorage();
  saveJobsToStorage([job, ...localJobs]);

  return job;
}

export async function updateJob(id: string, patch: Partial<Job>): Promise<Job | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const updates: Record<string, unknown> = {};
      if (patch.title) updates.title = patch.title;
      if (patch.company) updates.company = patch.company;
      if (patch.companyLogo) updates.company_logo = patch.companyLogo;
      if (patch.sector) updates.sector = patch.sector;
      if (patch.sectorLabel) updates.sector_label = patch.sectorLabel;
      if (patch.gender) updates.gender = patch.gender;
      if (patch.genderLabel) updates.gender_label = patch.genderLabel;
      if (patch.qualifications) updates.qualifications = patch.qualifications;
      if (patch.location) updates.location = patch.location;
      if (patch.city) updates.city = patch.city;
      if (patch.status) updates.status = patch.status;
      if (patch.startDate) updates.start_date = patch.startDate;
      if (patch.endDate) updates.end_date = patch.endDate;
      if (patch.experience) updates.experience = patch.experience;
      if (patch.salary) updates.salary = patch.salary;
      if (patch.summary) updates.summary = patch.summary;
      if (patch.description) updates.description = patch.description;
      if (patch.requirements) updates.requirements = patch.requirements;
      if (patch.benefits) updates.benefits = patch.benefits;
      if (patch.applicationUrl) updates.application_url = patch.applicationUrl;
      if (patch.sourceUrl) updates.source_url = patch.sourceUrl;
      if (patch.featured !== undefined) updates.featured = patch.featured;
      if (patch.urgent !== undefined) updates.urgent = patch.urgent;

      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) {
        throw new Error(`فشل تحديث الإعلان في قاعدة البيانات: ${error.message}`);
      }
      if (!data) return null;

      const updatedFromDatabase = rowToJob(data);
      const localJobs = getJobsFromStorage();
      const localIndex = localJobs.findIndex(j => j.id === id);
      if (localIndex !== -1) {
        localJobs[localIndex] = updatedFromDatabase;
        saveJobsToStorage(localJobs);
      }
      return updatedFromDatabase;
    } catch (e) {
      console.error('Supabase updateJob error:', e);
      throw e instanceof Error
        ? e
        : new Error('فشل تحديث الإعلان في قاعدة البيانات');
    }
  }

  const jobs = getJobsFromStorage();
  const index = jobs.findIndex(j => j.id === id);
  if (index === -1) return null;

  const updated: Job = { ...jobs[index], ...patch };
  jobs[index] = updated;
  saveJobsToStorage(jobs);
  return updated;
}

export async function deleteJob(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
        .select('id');
      if (error) {
        throw new Error(`فشل حذف الإعلان من قاعدة البيانات: ${error.message}`);
      }
      if (!data || data.length === 0) return false;

      const localJobs = getJobsFromStorage();
      const filteredLocalJobs = localJobs.filter(j => j.id !== id);
      if (filteredLocalJobs.length !== localJobs.length) {
        saveJobsToStorage(filteredLocalJobs);
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteJob error:', e);
      throw e instanceof Error
        ? e
        : new Error('فشل حذف الإعلان من قاعدة البيانات');
    }
  }

  const jobs = getJobsFromStorage();
  const filtered = jobs.filter(j => j.id !== id);
  if (filtered.length === jobs.length) return false;

  saveJobsToStorage(filtered);
  return true;
}

export async function incrementViews(id: string): Promise<void> {
  const jobs = getJobsFromStorage();
  const job = jobs.find(j => j.id === id);
  if (job) {
    job.viewsCount = (job.viewsCount || 0) + 1;
    saveJobsToStorage(jobs);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.rpc('increment_views', { job_id: id });
      if (error) console.warn('Supabase increment_views error:', error.message);
    } catch (error) {
      console.warn('Supabase increment_views request failed:', error);
    }
  }
}

export async function getJobStats() {
  const jobs = await getAllJobs();
  const total = jobs.length;
  const active = jobs.filter(j => j.status === 'active' || j.status === 'expiring_soon').length;
  const military = jobs.filter(j => j.sector === 'military').length;
  const government = jobs.filter(j => j.sector === 'government').length;
  const results = jobs.filter(j => j.sector === 'results').length;
  const training = jobs.filter(j => j.sector === 'training').length;
  const remote = jobs.filter(j => j.sector === 'remote').length;
  const totalViews = jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0);
  const expiringSoon = jobs.filter(j => j.status === 'expiring_soon' || (j.endDate && new Date(j.endDate).getTime() - Date.now() < 7 * 86400000 && new Date(j.endDate).getTime() >= Date.now())).length;
  const bySector = jobs.reduce<Record<string, number>>((result, job) => {
    result[job.sectorLabel] = (result[job.sectorLabel] || 0) + 1;
    return result;
  }, {});
  const topViewed = [...jobs].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5).map(job => ({
    id: job.id, title: job.title, slug: job.slug, viewsCount: job.viewsCount || 0,
  }));
  
  return {
    total,
    active,
    military,
    government,
    results,
    training,
    remote,
    totalViews,
    expiringSoon,
    bySector,
    topViewed
  };
}
