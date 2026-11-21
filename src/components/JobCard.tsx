'use client';

import Link from 'next/link';
import { Job } from '@/types/job';
import CompanyLogo from './CompanyLogo';
import { MapPin, GraduationCap, Users, ArrowUpLeft, Flame, Sparkles } from 'lucide-react';
import BookmarkButton from './BookmarkButton';
import ShareButtons from './ShareButtons';
import JobCountdown from './JobCountdown';
import { sectorStyle, timeAgoAr } from '@/lib/ui';

interface JobCardProps {
  job: Job;
  featuredHighlight?: boolean;
}

const statusLabel: Record<Job['status'], { text: string; cls: string } | null> = {
  active: null,
  expiring_soon: { text: 'ينتهي قريباً', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
  upcoming: { text: 'يبدأ قريباً', cls: 'bg-saffron-50 text-saffron-700 ring-saffron-200' },
  results: { text: 'أُعلنت النتائج', cls: 'bg-violet-50 text-violet-700 ring-violet-200' },
  expired: { text: 'انتهى التقديم', cls: 'bg-ink-100 text-ink-600 ring-ink-200' },
};

export default function JobCard({ job, featuredHighlight = false }: JobCardProps) {
  const sector = sectorStyle[job.sector] ?? sectorStyle.government;
  const status = statusLabel[job.status];
  const highlighted = featuredHighlight || job.featured;
  const expired = job.status === 'expired';

  return (
    <article
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift ${
        highlighted ? 'border-saffron-300' : 'border-line hover:border-ink-200'
      } ${expired ? 'opacity-75' : ''}`}
    >
      {/* شريط جانبي للعاجل */}
      {job.urgent && (
        <span className="absolute top-5 -start-px h-10 w-1 rounded-e-full bg-rose-500" aria-hidden="true" />
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* الصف العلوي */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <CompanyLogo
              src={job.companyLogo}
              name={job.company}
              size={48}
              className="rounded-xl bg-paper border border-line shrink-0 p-1.5"
            />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink-700 truncate">{job.company}</p>
              <p className="text-[12px] text-ink-400 mt-0.5" suppressHydrationWarning>
                {timeAgoAr(job.publishDate)}
              </p>
            </div>
          </div>
          <BookmarkButton jobId={job.id} className="relative z-10 -mt-1 -me-1" />
        </div>

        {/* الوسوم */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          <span className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-semibold ring-1 ${sector.chip}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sector.dot}`} />
            {job.sectorLabel}
          </span>
          {job.urgent && (
            <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[12px] font-semibold bg-rose-500 text-white">
              <Flame className="w-3 h-3" />
              عاجل
            </span>
          )}
          {job.featured && !job.urgent && (
            <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[12px] font-semibold bg-saffron-400 text-ink-950">
              <Sparkles className="w-3 h-3" />
              مميز
            </span>
          )}
          {status && (
            <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-semibold ring-1 ${status.cls}`}>
              {status.text}
            </span>
          )}
        </div>

        {/* العنوان */}
        <h3 className="mt-3 text-[17px] font-bold leading-[1.6] text-ink-950 line-clamp-2 group-hover:text-saffron-700 transition-colors">
          <Link href={`/jobs/${job.slug}`} className="after:absolute after:inset-0 after:content-[''] after:z-0">
            {job.title}
          </Link>
        </h3>

        <p className="mt-2 text-[13px] leading-[1.9] text-ink-500 line-clamp-2">{job.summary}</p>

        {/* المعلومات */}
        <ul className="mt-4 pt-4 border-t border-dashed border-line flex flex-wrap gap-x-4 gap-y-2 text-[12.5px] text-ink-600">
          <li className="inline-flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-ink-400 shrink-0" />
            <span className="truncate" title={job.location}>{job.city}</span>
          </li>
          <li className="inline-flex items-center gap-1.5 min-w-0">
            <GraduationCap className="w-3.5 h-3.5 text-ink-400 shrink-0" />
            <span className="truncate" title={job.qualifications.join('، ')}>
              {job.qualifications[0]}
              {job.qualifications.length > 1 ? ` +${job.qualifications.length - 1}` : ''}
            </span>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-ink-400 shrink-0" />
            <span>{job.genderLabel}</span>
          </li>
        </ul>
      </div>

      {/* التذييل */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 py-3.5 border-t border-line bg-paper/60 rounded-b-2xl">
        <JobCountdown endDate={job.endDate} startDate={job.startDate} compact />
        <div className="flex items-center gap-1">
          <ShareButtons title={job.title} compact />
          <Link
            href={`/jobs/${job.slug}`}
            aria-label={`تفاصيل: ${job.title}`}
            className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-ink-950 text-saffron-400 group-hover:bg-saffron-400 group-hover:text-ink-950 transition-colors"
          >
            <ArrowUpLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
