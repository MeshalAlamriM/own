import { MetadataRoute } from 'next';
import { getAllJobs } from '@/data/store';
import { getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const jobs = await getAllJobs();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/results`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/training`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const jobRoutes: MetadataRoute.Sitemap = jobs
    .filter((job) => job.status !== 'expired')
    .map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.publishDate ? new Date(job.publishDate) : now,
      changeFrequency: 'daily',
      priority: job.featured ? 0.95 : 0.8,
    }));

  return [...staticRoutes, ...jobRoutes];
}
