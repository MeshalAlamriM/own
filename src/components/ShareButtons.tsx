'use client';

import { useState } from 'react';
import { Share2, Check, Link2, Send } from 'lucide-react';

function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.43 15.12L2 22l5-1.58A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.34-2 1.4-.52.06-1.17.09-1.9-.12a17 17 0 0 1-1.72-.63c-3.03-1.31-5-4.37-5.15-4.57-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.6-.38.8-.38h.58c.19 0 .43-.07.67.5.25.6.84 2.08.91 2.23.08.15.12.33.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.18.3.78 1.28 1.67 2.07 1.14 1.02 2.1 1.34 2.4 1.49.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.08.12.08.72-.17 1.42Z" />
    </svg>
  );
}

interface ShareButtonsProps {
  title: string;
  url?: string;
  compact?: boolean;
}

export default function ShareButtons({ title, url, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(getFullUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const shareText = encodeURIComponent(`${title}\nالتفاصيل ورابط التقديم المباشر:\n`);
  const encodedUrl = encodeURIComponent(getFullUrl());

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;

  if (compact) {
    return (
      <div className="flex items-center gap-0.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="مشاركة عبر واتساب"
          aria-label="مشاركة عبر واتساب"
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4" />
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="مشاركة عبر تيليجرام"
          aria-label="مشاركة عبر تيليجرام"
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          title={copied ? 'تم النسخ' : 'نسخ الرابط'}
          aria-label="نسخ الرابط"
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-900 hover:bg-ink-950/[0.05] transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  const btn =
    'inline-flex items-center justify-center gap-2 h-11 px-3 rounded-xl text-[13px] font-semibold transition-colors';

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center gap-2 mb-3 text-ink-800 font-bold text-[14px]">
        <Share2 className="w-4 h-4 text-saffron-600" />
        <span>شارك الإعلان مع من يحتاجه</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-emerald-50 text-emerald-800 hover:bg-emerald-100`}>
          <WhatsAppIcon />
          <span>واتساب</span>
        </a>
        <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-sky-50 text-sky-800 hover:bg-sky-100`}>
          <Send className="w-4 h-4" />
          <span>تيليجرام</span>
        </a>
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-ink-950 text-white hover:bg-ink-800`}>
          <XIcon />
          <span>منصة X</span>
        </a>
        <button type="button" onClick={handleCopy} className={`${btn} bg-ink-50 text-ink-800 hover:bg-ink-100`}>
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">تم النسخ</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span>نسخ الرابط</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
