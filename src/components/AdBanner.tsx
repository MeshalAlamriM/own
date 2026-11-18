'use client';

import { useEffect, useState } from 'react';
import { AdPlacement, AdSettings, DEFAULT_AD_SETTINGS } from '@/lib/ad-settings';

interface AdBannerProps {
  placement: AdPlacement;
  className?: string;
  label?: string;
}

export default function AdBanner({ placement, className = '', label }: AdBannerProps) {
  const [settings, setSettings] = useState<AdSettings | null>(null);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    fetch('/api/settings/ads')
      .then(res => res.json())
      .then(data => setSettings(data.success ? data.data : DEFAULT_AD_SETTINGS))
      .catch(() => setSettings(DEFAULT_AD_SETTINGS));
  }, []);

  useEffect(() => {
    try {
      if (publisherId && settings && typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch {
      // Ignore if AdSense script is blocked or not yet active.
    }
  }, [publisherId, settings]);

  if (!settings || !settings.enabled) return null;
  if (placement === 'home' && !settings.showOnHome) return null;
  if (placement === 'job-detail' && !settings.showOnJobDetail) return null;

  const displayLabel = label || settings.label;

  if (publisherId) {
    return (
      <div className={`my-6 text-center overflow-hidden ${className}`}>
        <span className="text-[11px] text-ink-400 block mb-1.5 font-medium">{displayLabel}</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={settings.slotId}
          data-ad-format={settings.format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div className={`my-6 mx-auto max-w-4xl overflow-hidden rounded-2xl border border-dashed border-ink-200 bg-paper-2/60 p-4 text-center ${className}`}>
      <span className="text-[11px] text-ink-400 block mb-1 font-medium">{displayLabel}</span>
      <div className="py-5 flex flex-col items-center justify-center text-ink-400 text-xs">
        <span className="font-semibold text-ink-600 mb-0.5">مساحة إعلانية (Google AdSense)</span>
        <span className="text-[11px] text-ink-400">ستظهر الإعلانات هنا تلقائياً فور ربط معرف الناشر</span>
      </div>
    </div>
  );
}
