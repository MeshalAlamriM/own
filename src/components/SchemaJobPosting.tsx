import { Job } from '@/types/job';
import { sanitizeHtml } from '@/lib/sanitize';

export default function SchemaJobPosting({ job }: { job: Job }) {
  // Construct Schema.org JobPosting object
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.description ? sanitizeHtml(job.description) : job.summary,
    'datePosted': job.publishDate,
    'validThrough': `${job.endDate}T23:59:59Z`,
    'employmentType': job.sector === 'training' ? 'INTERN' : 'FULL_TIME',
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.company,
      'sameAs': job.sourceUrl || job.applicationUrl,
      'logo': job.companyLogo || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=128&auto=format&fit=crop&q=80'
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': job.city || 'الرياض',
        'addressRegion': job.location,
        'addressCountry': 'SA'
      }
    },
    'baseSalary': {
      '@type': 'MonetaryAmount',
      'currency': 'SAR',
      'value': {
        '@type': 'QuantitativeValue',
        'unitText': 'MONTH'
      }
    },
    'applicantLocationRequirements': {
      '@type': 'Country',
      'name': 'Saudi Arabia'
    },
    'industry': job.sectorLabel
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
    />
  );
}
