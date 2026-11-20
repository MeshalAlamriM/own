'use client';

import { useEffect, useRef, useState } from 'react';
import { AdPlacement, AdSettings, DEFAULT_AD_SETTINGS } from '@/lib/ad-settings';

interface AdBannerProps {
  placement: AdPlacement;
  className?: string;
  label?: string;
  slotId?: string;
}

function isPlacementEnabled(placement: AdPlacement, settings: AdSettings): boolean {
  if (!settings.enabled) return false;
  switch (placement) {
    case 'home-top':
      return settings.homeTop;
    case 'home-infeed':
      return settings.homeInFeed;
    case 'home-bottom':
      return settings.homeBottom;
    case 'job-detail-top':
      return settings.jobDetailTop;
    case 'job-detail-content':
      return settings.jobDetailInArticle;
    case 'job-detail-before-apply':
      return settings.jobDetailBeforeApply;
    case 'job-detail-bottom':
      return settings.jobDetailBottom;
    case 'sector-top':
      return settings.sectorPagesTop;
    case 'sector-infeed':
      return settings.sectorPagesInFeed;
    case 'sidebar-sticky':
      return settings.sidebarSticky;
    case 'home':
      return settings.homeTop || (settings.showOnHome !== false);
    case 'job-detail':
      return settings.jobDetailTop || (settings.showOnJobDetail !== false);
    default:
      return true;
  }
}

export default function AdBanner({ placement, className = '', label, slotId }: AdBannerProps) {
  const [settings, setSettings] = useState<AdSettings | null>(null);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    fetch('/api/settings/ads')
      .then((res) => res.json())
      .then((data) => setSettings(data.success ? data.data : DEFAULT_AD_SETTINGS))
      .catch(() => setSettings(DEFAULT_AD_SETTINGS));
  }, []);

  useEffect(() => {
    if (!publisherId || !settings || !settings.enabled) return;
    if (!isPlacementEnabled(placement, settings)) return;

    const activeSlotId = slotId || settings.slotId;
    const sendEvent = (eventType: 'impression' | 'click') => {
      fetch('/api/ads/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, placement, slotId: activeSlotId, pagePath: window.location.pathname }),
        keepalive: true,
      }).catch(() => undefined);
    };

    const impressionKey = `ad-impression:${placement}:${activeSlotId}:${window.location.pathname}`;
    const element = adRef.current;
    if (!element) return;

    const markImpression = () => {
      if (sessionStorage.getItem(impressionKey)) return;
      sessionStorage.setItem(impressionKey, '1');
      sendEvent('impression');
    };

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
                markImpression();
                observer?.disconnect();
              }
            },
            { threshold: [0.5] }
          )
        : null;

    observer?.observe(element);
    if (!observer) markImpression();

    const onClick = () => sendEvent('click');
    element.addEventListener('click', onClick);
    return () => {
      observer?.disconnect();
      element.removeEventListener('click', onClick);
    };
  }, [publisherId, placement, settings, slotId]);

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
  if (!isPlacementEnabled(placement, settings)) return null;

  const displayLabel = label || settings.label;
  const activeSlotId = slotId || settings.slotId;

  if (publisherId) {
    return (
      <div className={`my-6 text-center overflow-hidden ${className}`}>
        <span className="text-[11px] text-ink-400 block mb-1.5 font-medium">{displayLabel}</span>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={activeSlotId}
          data-ad-format={settings.format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Visual placeholder in development/preview when AdSense ID is not yet configured
  return (
    <div className={`my-6 text-center ${className}`}>
      <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-line bg-paper-2/60 p-4 sm:p-5 text-center">
        <span className="text-[10px] font-bold text-ink-400 block mb-1 tracking-wider uppercase">
          {displayLabel} • موضع AdSense ({placement})
        </span>
        <p className="text-xs text-ink-500 font-bold">
          موضع إعلاني متوافق 100% مع معايير Google AdSense (يظهر الإعلان الفعلي فور وضع معرف AdSense)
        </p>
      </div>
    </div>
  );
}
