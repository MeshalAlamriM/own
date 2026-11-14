import fs from 'fs';
import path from 'path';
import { Job, JobFilterParams } from '../types/job';
import { INITIAL_JOBS } from './initial-jobs';

const DATA_FILE = path.join(process.cwd(), 'data', 'jobs.json');

// In-memory cache for fast reads
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

export async function getAllJobs(filters?: JobFilterParams): Promise<Job[]> {
  const jobs = getJobsFromStorage();

  if (!filters) {
    return jobs.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  return jobs.filter((job) => {
    // Query search (title, company, summary, tags)
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

    // Sector filter
    if (filters.sector && filters.sector !== 'all') {
      if (job.sector !== filters.sector) {
        return false;
      }
    }

    // Qualification filter
    if (filters.qualification && filters.qualification !== 'all') {
      const hasQual = job.qualifications.some(q => q.includes(filters.qualification!) || filters.qualification!.includes(q));
      if (!hasQual) {
        return false;
      }
    }

    // Gender filter
    if (filters.gender && filters.gender !== 'all') {
      if (job.gender !== 'both' && job.gender !== filters.gender) {
        return false;
      }
    }

    // City / Region filter
    if (filters.city && filters.city !== 'all') {
      if (!job.city.includes(filters.city) && !job.location.includes(filters.city)) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (job.status !== filters.status) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Featured first, then newest
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const jobs = getJobsFromStorage();
  // Support both slug matching and id matching
  const decodedSlug = decodeURIComponent(slug);
  return jobs.find(j => j.slug === decodedSlug || j.id === decodedSlug || j.slug === slug);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const jobs = getJobsFromStorage();
  return jobs.find(j => j.id === id);
}

export async function createJob(newJobData: Partial<Job>): Promise<Job> {
  const jobs = getJobsFromStorage();
  const id = newJobData.id || `job-${Date.now()}`;
  
  // Create clean SEO slug from title or id
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

  const updatedList = [job, ...jobs];
  saveJobsToStorage(updatedList);
  return job;
}

export async function updateJob(id: string, patch: Partial<Job>): Promise<Job | null> {
  const jobs = getJobsFromStorage();
  const index = jobs.findIndex(j => j.id === id);
  if (index === -1) return null;

  const updated: Job = {
    ...jobs[index],
    ...patch,
  };

  jobs[index] = updated;
  saveJobsToStorage(jobs);
  return updated;
}

export async function deleteJob(id: string): Promise<boolean> {
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
}

export async function getJobStats() {
  const jobs = getJobsFromStorage();
  const total = jobs.length;
  const active = jobs.filter(j => j.status === 'active' || j.status === 'expiring_soon').length;
  const military = jobs.filter(j => j.sector === 'military').length;
  const government = jobs.filter(j => j.sector === 'government').length;
  const results = jobs.filter(j => j.sector === 'results').length;
  const training = jobs.filter(j => j.sector === 'training').length;
  const remote = jobs.filter(j => j.sector === 'remote').length;

  return {
    total,
    active,
    military,
    government,
    results,
    training,
    remote
  };
}
