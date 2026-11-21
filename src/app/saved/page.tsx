'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Job } from '@/types/job';
import JobCard from '@/components/JobCard';
import PageHeader from '@/components/PageHeader';
import { Bookmark, ArrowLeft, Trash2 } from 'lucide-react';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = useCallback(async () => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      if (ids.length === 0) {
        setSavedJobs([]);
        return;
      }

      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSavedJobs(data.data.filter((job: Job) => ids.includes(job.id)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadSaved, 0);
    window.addEventListener('bookmarks_updated', loadSaved);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('bookmarks_updated', loadSaved);
    };
  }, [loadSaved]);

  const clearAll = () => {
    if (confirm('هل أنت متأكد من رغبتك في حذف كافة الوظائف المحفوظة؟')) {
      localStorage.setItem('saved_jobs', '[]');
      setSavedJobs([]);
      window.dispatchEvent(new Event('bookmarks_updated'));
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="مكتبتك الخاصة"
        title="الوظائف المحفوظة"
        description="الإعلانات التي حفظتها للرجوع إليها والتقديم عليها لاحقاً. تُحفظ على جهازك فقط."
        icon={Bookmark}
        compact
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        {savedJobs.length > 0 && (
          <div className="flex items-center justify-between gap-4">
            <p className="text-[14px] text-ink-600">
              لديك <strong className="text-ink-950 tabular-nums">{savedJobs.length}</strong> إعلان محفوظ
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-[13px] font-semibold hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              إفراغ المحفوظات
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-ink-100 animate-pulse" />
            ))}
          </div>
        ) : savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-saffron-50 text-saffron-600 flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8" />
            </div>
            <h2 className="mt-5 text-[20px] font-bold text-ink-950">لا توجد وظائف محفوظة بعد</h2>
            <p className="mt-2 text-[14px] text-ink-500 leading-[1.95]">
              اضغط على أيقونة الحفظ في أي إعلان لتجده هنا لاحقاً.
            </p>
            <Link
              href="/jobs"
              className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-ink-950 text-white text-[14px] font-semibold hover:bg-ink-800 transition-colors"
            >
              تصفّح أحدث الوظائف
              <ArrowLeft className="w-4 h-4 text-saffron-400" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
