'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/types/job';
import JobCard from '@/components/JobCard';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      if (ids.length === 0) {
        setSavedJobs([]);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const filtered = data.data.filter((job: Job) => ids.includes(job.id));
        setSavedJobs(filtered);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
    window.addEventListener('bookmarks_updated', loadSaved);
    return () => window.removeEventListener('bookmarks_updated', loadSaved);
  }, []);

  const clearAll = () => {
    if (confirm('هل أنت متأكد من رغبتك في حذف كافة الوظائف المحفوظة؟')) {
      localStorage.setItem('saved_jobs', '[]');
      setSavedJobs([]);
      window.dispatchEvent(new Event('bookmarks_updated'));
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">الوظائف المحفوظة</h1>
              <p className="text-xs text-gray-500">قائمة الإعلانات التي قمت بحفظها للرجوع إليها والتقديم عليها لاحقاً</p>
            </div>
          </div>

          {savedJobs.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>إفراغ المحفوظات</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500">جاري تحميل الوظائف المحفوظة...</div>
        ) : savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">لا توجد وظائف محفوظة بعد</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              يمكنك النقر على أيقونة الإشارة المرجعية (الحفظ) الموجودة في أي إعلان وظيفي لحفظه هنا والرجوع إليه في أي وقت.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
            >
              <span>تصفح أحدث الوظائف الآن</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
