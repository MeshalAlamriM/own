import { MetadataRoute } from 'next';
import { getAllJobs } from '@/data/store';
import { getSiteUrl } from '@/lib/site';
import { getPublishedBlogPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const jobs = await getAllJobs();
  const blogPosts = await getPublishedBlogPosts();
  const buildDate = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: buildDate,
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: buildDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: buildDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/training`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/jobs?sector=government`,
      lastModified: buildDate,
      changeFrequency: 'hourly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/jobs?sector=military`,
      lastModified: buildDate,
      changeFrequency: 'hourly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/jobs?sector=corporate`,
      lastModified: buildDate,
      changeFrequency: 'hourly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/jobs?sector=remote`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic job detail routes
  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.slug}`,
    lastModified: job.publishDate ? new Date(job.publishDate) : buildDate,
    changeFrequency: 'daily',
    priority: job.featured ? 0.95 : 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : buildDate,
    changeFrequency: 'monthly',
    priority: post.featured ? 0.8 : 0.65,
  }));

  return [...staticRoutes, ...jobRoutes, ...blogRoutes];
}
