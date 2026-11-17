import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJobBySlug, getAllJobs } from '@/data/store';
import SchemaJobPosting from '@/components/SchemaJobPosting';
import ShareButtons from '@/components/ShareButtons';
import BookmarkButton from '@/components/BookmarkButton';
import JobCountdown from '@/components/JobCountdown';
import JobCard from '@/components/JobCard';
import TelegramBanner from '@/components/TelegramBanner';
import AdBanner from '@/components/AdBanner';
import ViewCounter from '@/components/ViewCounter';
import { 
  Building2, 
  MapPin, 
  GraduationCap, 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft,
  Clock,
  Sparkles
} from 'lucide-react';

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const jobs = await getAllJobs();
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wadhaef-alyoum.sa';
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: 'الوظيفة غير موجودة',
      description: 'عذراً، الإعلان الوظيفي المطلوب غير موجود أو تم حذفه.',
    };
  }

  const cleanDescription = job.summary || job.description.replace(/<[^>]+>/g, '').slice(0, 160);

  return {
    title: `${job.title} | ${job.company}`,
    description: cleanDescription,
    keywords: [
      job.company,
      job.sectorLabel,
      job.city,
      ...job.qualifications,
      ...(job.tags || [])
    ],
    openGraph: {
      title: `${job.title} - ${job.company}`,
      description: cleanDescription,
      type: 'article',
      url: `${baseUrl}/jobs/${job.slug}`,
      images: [
        {
          url: job.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
          width: 1200,
          height: 630,
          alt: job.title,
        },
      ],
      publishedTime: job.publishDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} | ${job.company}`,
      description: cleanDescription,
    },
    alternates: {
      canonical: `${baseUrl}/jobs/${job.slug}`,
    },
    robots: job.status === 'expired' ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  // Fetch related jobs (same sector, different id)
  const allJobs = await getAllJobs();
  const relatedJobs = allJobs
    .filter((j) => j.id !== job.id && (j.sector === job.sector || j.city === job.city))
    .slice(0, 3);

  return (
    <>
      {/* Schema.org for Google Jobs SEO */}
      <SchemaJobPosting job={job} />

      <div className="py-8 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto pb-1">
            <Link href="/" className="hover:text-emerald-700 transition shrink-0">الرئيسية</Link>
            <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/jobs?sector=${job.sector}`} className="hover:text-emerald-700 transition shrink-0">
              {job.sectorLabel}
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="text-gray-800 font-medium truncate">{job.company}</span>
          </nav>

          {/* Main Job Article Card */}
          <article className="bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden">
            {/* Header banner */}
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-b from-emerald-50/40 to-transparent">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {job.sectorLabel}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {job.genderLabel}
                  </span>
                  {job.urgent && (
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                      إعلان عاجل
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    نُشر في: {job.publishDate.split('T')[0]}
                  </span>
                  <span>•</span>
                  <ViewCounter jobId={job.id} initialViews={job.viewsCount} />
                  <BookmarkButton jobId={job.id} showText={true} />
                </div>
              </div>

              {/* Title & Company */}
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-white via-white to-slate-100 border border-gray-200 shadow-md flex items-center justify-center p-3 shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-contain rounded-2xl"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-sm sm:text-base font-bold text-emerald-700 mb-1">
                    {job.company}
                  </h2>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-950 leading-snug">
                    {job.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Countdown Timer */}
              <JobCountdown endDate={job.endDate} startDate={job.startDate} />

              {/* Quick Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-[11px] font-semibold text-gray-400 block mb-1">المؤهل المطلوب</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-gray-800">
                    <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{job.qualifications.join('، ')}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-[11px] font-semibold text-gray-400 block mb-1">مقر الوظيفة</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-gray-800">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{job.city} ({job.location})</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-[11px] font-semibold text-gray-400 block mb-1">الجنس المستهدف</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-gray-800">
                    <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{job.genderLabel}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-[11px] font-semibold text-gray-400 block mb-1">الخبرة المطلوبة</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-gray-800">
                    <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{job.experience}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs col-span-2">
                  <span className="text-[11px] font-semibold text-gray-400 block mb-1">الراتب / الحوافز</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-emerald-700">
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{job.salary || 'رواتب وبدلات مجزية بحسب اللوائح'}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs col-span-2">
                  <span className="text-[11px] font-semibold text-gray-400 block mb-1">فترة التقديم</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-gray-800">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>من {job.startDate} حتى {job.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Share Bar */}
              <ShareButtons title={job.title} />

              {/* In-content Responsive AdSense Slot */}
              <AdBanner label="إعلان تجاري مدعوم" />

              {/* Job Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 border-r-4 border-emerald-600 pr-3">
                  تفاصيل الإعلان والشواغر الوظيفية
                </h3>
                <div 
                  className="prose prose-slate max-w-none text-sm text-gray-700 leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {/* Requirements & Conditions */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-gray-900 border-r-4 border-emerald-600 pr-3">
                    الشروط العامة للتقديم
                  </h3>
                  <ul className="space-y-2 pt-1">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 bg-gray-50/60 p-3 rounded-xl border border-gray-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits & Perks */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-gray-900 border-r-4 border-emerald-600 pr-3">
                    المزايا والحوافز الوظيفية
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {job.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-800 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Application & Source CTA Buttons */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full sm:flex-1 py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <span>رابط التقديم المباشر على المنصة الرسمية</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>

                  {job.sourceUrl && (
                    <a
                      href={job.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-2xl transition"
                    >
                      <span>المصدر الرسمي للإعلان</span>
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </a>
                  )}
                </div>

                {/* Security Advice Notice */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs leading-relaxed">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>تنبيه أمان وموثوقية:</strong> التقديم على كافة الوظائف يتم حصرياً عبر الروابط الرسمية المعتمدة لجهات التوظيف. لا تقم بتحويل أي مبالغ مالية لأي شخص يدعي توفير وظائف، فكافة منصات التوظيف بالمملكة مجانية تماماً.
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Telegram Banner */}
          <TelegramBanner />

          {/* Related Jobs */}
          {relatedJobs.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">وظائف مشابهة قد تهمك</h3>
                <Link href={`/jobs?sector=${job.sector}`} className="text-xs font-bold text-emerald-700 hover:underline">
                  المزيد من وظائف {job.sectorLabel} ←
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedJobs.map((rJob) => (
                  <JobCard key={rJob.id} job={rJob} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
