'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, ArrowUpLeft, ShieldCheck } from 'lucide-react';
import { DEFAULT_SOCIAL_SETTINGS, SocialSettings } from '@/lib/social-settings';

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

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.35 0 .68.07.99.19V9.45a6.34 6.34 0 0 0-.99-.08A6.34 6.34 0 0 0 3 15.71 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V8.47c1.37.98 3.03 1.56 4.83 1.61V6.69h-.92z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const popularKeywords = [
  'وظائف أرامكو',
  'وظائف الحرس الوطني',
  'أبشر توظيف',
  'منصة جدارات',
  'وظائف بشهادة الثانوية',
  'وظائف نسائية عن بعد',
  'وظائف وزارة الدفاع',
  'وظائف بنوك الرياض',
  'وظائف نيوم 2026',
  'تدريب منتهي بالتوظيف',
  'نتائج القبول المبدئي',
  'وظائف شركات الاتصالات',
  'وظائف صحية تشغيل ذاتي',
  'وظائف سائقين وحراس أمن',
];

const sectionLinks = [
  { href: '/jobs?sector=government', label: 'الوظائف الحكومية والمدنية' },
  { href: '/jobs?sector=military', label: 'الدفاع والحرس والداخلية' },
  { href: '/jobs?sector=corporate', label: 'الشركات الكبرى والبنوك' },
  { href: '/training', label: 'التدريب المنتهي بالتوظيف' },
  { href: '/results', label: 'نتائج القبول والترشيح' },
  { href: '/jobs?sector=remote', label: 'العمل عن بُعد' },
  { href: '/blog', label: 'المدونة المهنية' },
];

const qualificationLinks = [
  { href: '/jobs?qualification=ثانوية', label: 'الثانوية العامة فما دون' },
  { href: '/jobs?qualification=دبلوم', label: 'الدبلومات والكليات التقنية' },
  { href: '/jobs?qualification=بكالوريوس', label: 'البكالوريوس لكافة التخصصات' },
  { href: '/jobs?gender=female', label: 'وظائف نسائية' },
  { href: '/jobs?city=الرياض', label: 'منطقة الرياض' },
  { href: '/jobs?city=الشرقية', label: 'المنطقة الشرقية' },
];

const policyLinks = [
  { href: '/privacy-policy', label: 'سياسة الخصوصية' },
  { href: '/terms', label: 'الشروط والأحكام وإخلاء المسؤولية' },
  { href: '/about', label: 'من نحن والسياسة التحريرية' },
  { href: '/contact', label: 'اتصل بنا' },
];

const linkClass = 'text-[13px] text-ink-300 hover:text-saffron-300 transition-colors';

export default function Footer() {
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
    <footer className="relative bg-ink-950 text-ink-300 mt-8 grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA band */}
        <div className="-translate-y-1/2">
          <div className="relative overflow-hidden rounded-3xl bg-saffron-400 text-ink-950 px-6 sm:px-10 py-8 sm:py-9 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lift">
            <div className="absolute -left-10 -top-16 w-56 h-56 rounded-full bg-saffron-300/70" />
            <div className="absolute left-24 -bottom-20 w-40 h-40 rounded-full bg-saffron-500/40" />
            <div className="relative max-w-xl">
              <h2 className="text-[22px] sm:text-[26px] font-bold leading-snug">
                لا تفوّت فرصة بعد اليوم
              </h2>
              <p className="mt-2 text-[14px] text-ink-800 leading-relaxed">
                نرسل لك الإعلان لحظة نشره، قبل إغلاق بوابة التقديم، مباشرة إلى قناتك المفضلة.
              </p>
            </div>
            <div className="relative flex flex-wrap items-center gap-3">
              <a
                href={social.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-ink-950 text-white text-[14px] font-semibold hover:bg-ink-800 transition-colors"
              >
                <Send className="w-4 h-4 text-saffron-400" />
                <span>قناة تيليجرام</span>
                <ArrowUpLeft className="w-4 h-4 text-ink-400" />
              </a>
              <a
                href={social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-white/70 text-ink-950 text-[14px] font-semibold hover:bg-white transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>قناة واتساب</span>
              </a>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 pb-12 -mt-8">
          <div className="col-span-2 lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-mark.png"
                alt="شعار وظيفتك اليوم"
                width={44}
                height={44}
                className="w-11 h-11 object-contain"
              />
              <span className="text-[19px] font-bold text-white">
                وظيفتك <span className="text-saffron-400">اليوم</span>
              </span>
            </div>
            <p className="text-[13px] text-ink-400 leading-[1.9] max-w-sm">
              منصة سعودية مستقلة ترصد إعلانات التوظيف الرسمية في القطاعات الحكومية والعسكرية والشركات، وبرامج التدريب ونتائج القبول، وتضع رابط التقديم الرسمي أمامك مباشرة.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={social.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تيليجرام"
                className="w-10 h-10 rounded-xl border border-ink-700 text-ink-300 hover:text-ink-950 hover:bg-saffron-400 hover:border-saffron-400 flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساب"
                className="w-10 h-10 rounded-xl border border-ink-700 text-ink-300 hover:text-ink-950 hover:bg-saffron-400 hover:border-saffron-400 flex items-center justify-center transition-colors"
              >
                <WhatsAppIcon />
              </a>
              <a
                href={social.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="منصة X"
                className="w-10 h-10 rounded-xl border border-ink-700 text-ink-300 hover:text-ink-950 hover:bg-saffron-400 hover:border-saffron-400 flex items-center justify-center transition-colors"
              >
                <XIcon />
              </a>
              {social.tiktokUrl && (
                <a
                  href={social.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تيك توك"
                  className="w-10 h-10 rounded-xl border border-ink-700 text-ink-300 hover:text-ink-950 hover:bg-saffron-400 hover:border-saffron-400 flex items-center justify-center transition-colors"
                >
                  <TikTokIcon />
                </a>
              )}
              {social.instagramUrl && (
                <a
                  href={social.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="إنستغرام"
                  className="w-10 h-10 rounded-xl border border-ink-700 text-ink-300 hover:text-ink-950 hover:bg-saffron-400 hover:border-saffron-400 flex items-center justify-center transition-colors"
                >
                  <InstagramIcon />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-white text-[14px] font-bold mb-4">الأقسام</h3>
            <ul className="space-y-3">
              {sectionLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white text-[14px] font-bold mb-4">تصفّح حسب</h3>
            <ul className="space-y-3">
              {qualificationLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2">
            <h3 className="text-white text-[14px] font-bold mb-4 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-saffron-400" />
              <span>الموقع</span>
            </h3>
            <ul className="space-y-3">
              {policyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Popular searches */}
        <div className="py-7 border-t border-ink-800">
          <p className="text-[12px] font-semibold text-ink-400 mb-3">الأكثر بحثاً في المملكة</p>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/jobs?q=${encodeURIComponent(kw)}`}
                className="text-[12px] h-8 px-3 inline-flex items-center rounded-full border border-ink-800 bg-ink-900 text-ink-300 hover:text-saffron-300 hover:border-saffron-400/50 transition-colors"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-ink-500">
          <p>© 2026 وظيفتك اليوم. جميع الحقوق محفوظة.</p>
          <p className="text-center sm:text-start max-w-md leading-relaxed">
            منصة إخبارية مستقلة. نقل إعلانات التوظيف الرسمية بدون أي رسوم أو وساطة.
          </p>
        </div>
      </div>
    </footer>
  );
}
