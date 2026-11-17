import Script from 'next/script';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
}

export default function AdBanner({
  slotId,
  format = 'auto',
  className = '',
  label = 'إعلان',
}: AdBannerProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isPublisherIdValid = Boolean(publisherId && /^ca-pub-\d+$/.test(publisherId));
  const isSlotIdValid = Boolean(slotId && /^\d+$/.test(slotId));

  // No fake publisher or ad-unit IDs: show a non-ad placeholder until configured.
  if (!isPublisherIdValid || !isSlotIdValid) {
    return (
      <div className={`my-6 mx-auto max-w-4xl rounded-2xl border border-dashed border-ink-200 bg-paper-2/60 p-4 text-center ${className}`}>
        <span className="text-[11px] text-ink-400">{label}</span>
      </div>
    );
  }

  return (
    <div className={`my-6 text-center overflow-hidden ${className}`}>
      <Script
        id="google-adsense"
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      />
      <span className="text-[11px] text-ink-400 block mb-1.5 font-medium">{label}</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <Script id={`adsense-init-${slotId}`} strategy="afterInteractive">
        {`(window.adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
