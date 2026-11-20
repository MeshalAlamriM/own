'use client';

import { useState, useEffect } from 'react';
import { Send, BellRing } from 'lucide-react';
import { DEFAULT_SOCIAL_SETTINGS, SocialSettings } from '@/lib/social-settings';

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.43 15.12L2 22l5-1.58A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.34-2 1.4-.52.06-1.17.09-1.9-.12a17 17 0 0 1-1.72-.63c-3.03-1.31-5-4.37-5.15-4.57-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.6-.38.8-.38h.58c.19 0 .43-.07.67.5.25.6.84 2.08.91 2.23.08.15.12.33.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.18.3.78 1.28 1.67 2.07 1.14 1.02 2.1 1.34 2.4 1.49.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.08.12.08.72-.17 1.42Z" />
    </svg>
  );
}

export default function TelegramBanner() {
  const [social, setSocial] = useState<SocialSettings>(DEFAULT_SOCIAL_SETTINGS);

  useEffect(() => {
    fetch('/api/settings/social')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setSocial(data.data);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section
      aria-label="اشترك في تنبيهات الوظائف"
      className="relative overflow-hidden rounded-3xl bg-ink-950 text-white px-6 sm:px-10 py-9 sm:py-11 grain"
    >
      <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-saffron-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/3 w-64 h-64 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-start gap-5 max-w-2xl">
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-saffron-400 text-ink-950 items-center justify-center shrink-0">
            <BellRing className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/10 ring-1 ring-white/15 text-[12px] font-semibold text-saffron-300 mb-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-70 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-saffron-400" />
              </span>
              تنبيهات مجانية وفورية
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold leading-snug">
              الإعلان يصلك قبل أن يزدحم الجميع على البوابة
            </h2>
            <p className="mt-3 text-[14.5px] text-ink-300 leading-[1.9]">
              انضم إلى مئات الآلاف من الباحثين عن عمل، واستقبل إعلانات الوظائف العسكرية والمدنية والشركات
              ونتائج القبول لحظة صدورها على هاتفك.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
          <a
            href={social.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-6 rounded-xl bg-saffron-400 text-ink-950 text-[14.5px] font-bold hover:bg-saffron-300 transition-colors"
          >
            <Send className="w-5 h-5" />
            <span>انضم لقناة تيليجرام</span>
          </a>
          <a
            href={social.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-6 rounded-xl border border-white/20 bg-white/10 text-white text-[14.5px] font-bold hover:bg-white/15 transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
            <span>مجتمع واتساب الرسمي</span>
          </a>
        </div>
      </div>
    </section>
  );
}
