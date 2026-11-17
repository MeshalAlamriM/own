import type { Job } from '@/types/job';
import { sanitizeHtml } from '@/lib/sanitize';

export default function SchemaJobPosting({ job }: { job: Job }) {
  // Results, expired posts, and jobs without a real application destination
  // should not be advertised to search engines as open job vacancies.
  if (job.sector === 'results' || job.status === 'expired' || !job.applicationUrl || job.applicationUrl === '#') {
    return null;
  }

  const plainDescription = sanitizeHtml(job.description || job.summary || '');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: plainDescription,
    datePosted: job.publishDate,
    validThrough: `${job.endDate}T23:59:59Z`,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      ...(job.sourceUrl ? { sameAs: job.sourceUrl } : {}),
      ...(job.companyLogo ? { logo: job.companyLogo } : {}),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city || undefined,
        addressRegion: job.location || undefined,
        addressCountry: 'SA',
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'Saudi Arabia',
    },
    industry: job.sectorLabel,
  };

  // Prevent a user-supplied string containing </script> from closing the JSON-LD element.
  const jsonLd = JSON.stringify(schema).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />;
}
