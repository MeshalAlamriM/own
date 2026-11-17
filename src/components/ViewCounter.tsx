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
    <span className="flex items-center gap-1">
      <Eye className="w-3.5 h-3.5" />
      {views.toLocaleString('ar-SA')} مشاهدة
    </span>
  );
}
