import Link from 'next/link';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 dots [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center">
        <div className="w-20 h-20 rounded-3xl bg-ink-950 text-saffron-400 flex items-center justify-center mx-auto">
          <SearchX className="w-9 h-9" />
        </div>
        <p className="mt-8 text-[64px] sm:text-[88px] font-bold leading-none text-ink-950 tabular-nums">404</p>
        <h1 className="mt-4 text-[24px] sm:text-[28px] font-bold text-ink-950">لم نجد هذه الصفحة</h1>
        <p className="mt-3 text-[15px] text-ink-500 leading-[2] max-w-md mx-auto">
          ربما انتهى الإعلان أو نُقل إلى رابط آخر. تصفّح أحدث الوظائف أو ارجع إلى الرئيسية.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-ink-950 text-white text-[14px] font-semibold hover:bg-ink-800 transition-colors"
          >
            تصفّح الوظائف
            <ArrowLeft className="w-4 h-4 text-saffron-400" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center h-12 px-6 rounded-xl border border-line bg-white text-ink-800 text-[14px] font-semibold hover:border-ink-300 transition-colors"
          >
            الرئيسية
          </Link>
        </div>
      </div>
    </section>
  );
}
