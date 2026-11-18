'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
}

export default function AdBanner({
  slotId = '1234567890',
  format = 'auto',
  className = '',
  label = 'إعلان تجاري مدعوم'
}: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      // Ignore if AdSense script is blocked or not yet active
    }
  }, []);

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  // If live publisher ID exists, render actual Google AdSense Ins Tag
  if (publisherId) {
    return (
      <div className={`my-6 text-center overflow-hidden ${className}`}>
        <span className="text-[11px] text-ink-400 block mb-1.5 font-medium">{label}</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder preview shown during review/before AdSense approval
  return (
    <div className={`my-6 mx-auto max-w-4xl overflow-hidden rounded-2xl border border-dashed border-ink-200 bg-paper-2/60 p-4 text-center ${className}`}>
      <span className="text-[11px] text-ink-400 block mb-1 font-medium">{label}</span>
      <div className="py-5 flex flex-col items-center justify-center text-ink-400 text-xs">
        <span className="font-semibold text-ink-600 mb-0.5">مساحة إعلانية (Google AdSense)</span>
        <span className="text-[11px] text-ink-400">ستظهر الإعلانات هنا تلقائياً فور ربط معرف الناشر</span>
      </div>
    </div>
  );
}
