'use client';

import { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Send } from 'lucide-react';

function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
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
      // Fallback
    }
  };

  const shareText = encodeURIComponent(`${title}\nالتفاصيل ورابط التقديم المباشر:\n`);
  const encodedUrl = encodeURIComponent(getFullUrl());

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="مشاركة عبر واتساب"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="مشاركة عبر تيليجرام"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 transition"
        >
          <Send className="w-4 h-4" />
        </a>
        <button
          onClick={handleCopy}
          title={copied ? 'تم النسخ' : 'نسخ الرابط'}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3 text-gray-700 font-bold text-sm">
        <Share2 className="w-4 h-4 text-emerald-600" />
        <span>شارك الإعلان مع أصدقائك والباحثين عن عمل:</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition shadow-sm hover:shadow"
        >
          <MessageCircle className="w-4 h-4" />
          <span>واتساب</span>
        </a>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold transition shadow-sm hover:shadow"
        >
          <Send className="w-4 h-4" />
          <span>تيليجرام</span>
        </a>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-900 hover:bg-black text-white rounded-lg text-sm font-semibold transition shadow-sm hover:shadow"
        >
          <XIcon className="w-4 h-4" />
          <span>منصة X</span>
        </a>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>نسخ الرابط</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
