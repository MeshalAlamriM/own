'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  jobId: string;
  className?: string;
  showText?: boolean;
}

export default function BookmarkButton({ jobId, className = '', showText = false }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      setIsSaved(saved.includes(jobId));
    } catch {
      // ignore
    }
  }, [jobId]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved: string[] = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      let updated: string[];
      if (saved.includes(jobId)) {
        updated = saved.filter(id => id !== jobId);
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
      onClick={toggleBookmark}
      title={isSaved ? 'إزالة من المحفوظات' : 'حفظ الوظيفة'}
      aria-label={isSaved ? 'إزالة من المحفوظات' : 'حفظ الوظيفة'}
      className={`inline-flex items-center justify-center gap-1.5 transition-all duration-200 rounded-lg p-2 ${
        isSaved 
          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100 border border-amber-200' 
          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-transparent'
      } ${className}`}
    >
      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500 stroke-amber-500' : ''}`} />
      {showText && (
        <span className="text-xs font-medium">
          {isSaved ? 'تم الحفظ' : 'حفظ'}
        </span>
      )}
    </button>
  );
}
