'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';

export default function BlogViewCounter({ slug, initialViews }: { slug: string; initialViews: number }) {
  const countedSlug = useRef<string | null>(null);
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (countedSlug.current === slug) return;
    countedSlug.current = slug;
    setViews(initialViews);

    fetch(`/api/blog/${encodeURIComponent(slug)}/view`, { method: 'POST' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (typeof data.viewsCount === 'number') setViews(data.viewsCount);
      })
      .catch(() => undefined);
  }, [initialViews, slug]);

  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-400" aria-live="polite">
      <Eye className="h-4 w-4" />
      {views.toLocaleString('ar-SA')} مشاهدة
    </span>
  );
}
