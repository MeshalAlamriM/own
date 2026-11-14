'use client';

import Link from 'next/link';
import { Job } from '@/types/job';
import { MapPin, Users, GraduationCap, Clock, CheckCircle2, AlertTriangle, ArrowLeft, Building2, Flame } from 'lucide-react';
import BookmarkButton from './BookmarkButton';
import ShareButtons from './ShareButtons';
import JobCountdown from './JobCountdown';

interface JobCardProps {
  job: Job;
  featuredHighlight?: boolean;
}

export default function JobCard({ job, featuredHighlight = false }: JobCardProps) {
  // Sector color classes
  const getSectorBadge = (sector: Job['sector']) => {
    switch (sector) {
      case 'military':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'government':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'corporate':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'training':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'results':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      case 'remote':
        return 'bg-teal-100 text-teal-900 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            متاح للتقديم
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            ينتهي قريباً
          </span>
        );
      case 'results':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
            أعلنت النتائج
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            يبدأ قريباً
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            انتهى التقديم
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <article
      className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${
        featuredHighlight || job.featured
          ? 'border-emerald-300/80 ring-1 ring-emerald-400/30 shadow-sm'
          : 'border-gray-200/90 hover:border-emerald-300'
      }`}
    >
      {/* Top Banner if Featured / Urgent */}
      {job.urgent && (
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[11px] font-bold py-1 px-4 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            إعلان عاجل ومهم
          </span>
          <span>سارع بالتقديم قبل إغلاق البوابة</span>
        </div>
      )}

      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Header Tags & Status */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${getSectorBadge(job.sector)}`}>
              {job.sectorLabel}
            </span>
            {getStatusBadge(job.status)}
          </div>

          <div className="flex items-center gap-1">
            <BookmarkButton jobId={job.id} />
            <ShareButtons title={job.title} compact={true} />
          </div>
        </div>

        {/* Company and Title */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 p-1 overflow-hidden shadow-xs">
            {job.companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            ) : (
              <Building2 className="w-6 h-6 text-gray-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs text-emerald-700 font-bold mb-0.5 flex items-center gap-1.5">
              <span>{job.company}</span>
            </div>
            <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 text-base sm:text-lg leading-snug line-clamp-2 transition-colors">
              <Link href={`/jobs/${job.slug}`}>
                {job.title}
              </Link>
            </h3>
          </div>
        </div>

        {/* Brief summary */}
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
          {job.summary}
        </p>

        {/* Key Attributes Pills */}
        <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1.5 bg-gray-50/80 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate" title={job.location}>{job.city}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50/80 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate" title={job.qualifications.join('، ')}>
              {job.qualifications[0]} {job.qualifications.length > 1 ? `+${job.qualifications.length - 1}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50/80 px-2.5 py-1.5 rounded-lg border border-gray-100 col-span-2 sm:col-span-1">
            <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{job.genderLabel}</span>
          </div>
        </div>

        {/* Remaining Time Countdown & Action Button */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <JobCountdown endDate={job.endDate} compact={true} />

          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs hover:shadow active:scale-[0.98]"
          >
            <span>التفاصيل والتقديم</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
