'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  jobId: string;
  className?: string;
  showText?: boolean;
}

export default function BookmarkButton({ jobId, className = '', showText = false }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      return Array.isArray(saved) && saved.includes(jobId);
    } catch {
      return false;
    }
  });

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved: string[] = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      let updated: string[];
      if (saved.includes(jobId)) {
        updated = saved.filter((id) => id !== jobId);
        setIsSaved(false);
      } else {
        updated = [...saved, jobId];
        setIsSaved(true);
      }
      localStorage.setItem('saved_jobs', JSON.stringify(updated));
      window.dispatchEvent(new Event('bookmarks_updated'));
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      title={isSaved ? 'إزالة من المحفوظات' : 'حفظ الوظيفة'}
      aria-label={isSaved ? 'إزالة من المحفوظات' : 'حفظ الوظيفة'}
      aria-pressed={isSaved}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200 active:scale-90 ${
        showText ? 'h-10 px-3.5' : 'w-9 h-9'
      } ${
        isSaved
          ? 'text-ink-950 bg-saffron-100 ring-1 ring-saffron-300 hover:bg-saffron-200'
          : 'text-ink-400 hover:text-ink-900 hover:bg-ink-950/[0.05]'
      } ${className}`}
    >
      <Bookmark className={`w-[18px] h-[18px] ${isSaved ? 'fill-saffron-500 stroke-saffron-600' : ''}`} />
      {showText && <span className="text-[13px] font-semibold">{isSaved ? 'تم الحفظ' : 'حفظ'}</span>}
    </button>
  );
}
