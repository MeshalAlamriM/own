'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  jobId: string;
  initialViews: number;
}

export default function ViewCounter({ jobId, initialViews }: ViewCounterProps) {
  const counted = useRef(false);
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;

    fetch(`/api/jobs/${encodeURIComponent(jobId)}/view`, { method: 'POST' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (typeof data.viewsCount === 'number') setViews(data.viewsCount);
      })
      .catch(() => {
        // A failed counter must never affect the job page experience.
      });
  }, [jobId]);

  return (
    <span className="inline-flex items-center gap-1.5">
      <Eye className="w-4 h-4" />
      {views.toLocaleString('ar-SA')} مشاهدة
    </span>
  );
}
