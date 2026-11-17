'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle, Hourglass } from 'lucide-react';

interface JobCountdownProps {
  endDate: string;
  startDate?: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isUpcoming: boolean;
}

function split(diff: number) {
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function JobCountdown({ endDate, startDate, compact = false }: JobCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const end = new Date(`${endDate}T23:59:59`).getTime();
      const start = startDate ? new Date(`${startDate}T00:00:00`).getTime() : 0;

      if (start > now) {
        setTimeLeft({ ...split(start - now), isExpired: false, isUpcoming: true });
        return;
      }
      if (now > end) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isUpcoming: false });
        return;
      }
      setTimeLeft({ ...split(end - now), isExpired: false, isUpcoming: false });
    };

    calculate();
    // في البطاقات يكفي التحديث كل دقيقة، وفي صفحة الإعلان كل ثانية
    const interval = setInterval(calculate, compact ? 60000 : 1000);
    return () => clearInterval(interval);
  }, [endDate, startDate, compact]);

  // هيكل مؤقت قبل التحميل لتفادي اختلاف العرض بين الخادم والمتصفح
  if (!timeLeft) {
    return compact ? (
      <span className="inline-block h-6 w-24 rounded-full bg-ink-100 animate-pulse" />
    ) : (
      <div className="h-24 rounded-2xl bg-ink-100 animate-pulse" />
    );
  }

  if (timeLeft.isExpired) {
    return compact ? (
      <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-ink-100 text-ink-500 text-[12px] font-semibold">
        <AlertCircle className="w-3.5 h-3.5" />
        انتهى التقديم
      </span>
    ) : (
      <div className="flex items-center gap-3 rounded-2xl bg-ink-100 text-ink-600 p-4">
        <AlertCircle className="w-5 h-5" />
        <div>
          <p className="font-bold text-[14px]">انتهى التقديم على هذا الإعلان</p>
          <p className="text-[12px] text-ink-500 mt-0.5">انتهت المدة في {endDate}، تابع إعلانات مشابهة أدناه.</p>
        </div>
      </div>
    );
  }

  if (timeLeft.isUpcoming) {
    return compact ? (
      <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-saffron-50 text-saffron-700 ring-1 ring-saffron-200 text-[12px] font-semibold">
        <Hourglass className="w-3.5 h-3.5" />
        يبدأ بعد {timeLeft.days} يوم
      </span>
    ) : (
      <div className="flex items-center gap-3 rounded-2xl bg-saffron-50 ring-1 ring-saffron-200 text-saffron-700 p-4">
        <Hourglass className="w-5 h-5" />
        <div>
          <p className="font-bold text-[14px]">يفتح باب التقديم بعد {timeLeft.days} يوم و{timeLeft.hours} ساعة</p>
          <p className="text-[12px] mt-0.5 opacity-80">فعّل التنبيهات ليصلك الإشعار لحظة الفتح.</p>
        </div>
      </div>
    );
  }

  if (compact) {
    const urgent = timeLeft.days <= 3;
    return (
      <span
        className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[12px] font-semibold ${
          urgent ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-ink-50 text-ink-700 ring-1 ring-ink-100'
        }`}
      >
        <Clock className="w-3.5 h-3.5" />
        {timeLeft.days > 0 ? `متبقي ${timeLeft.days} يوم` : `متبقي ${timeLeft.hours} ساعة`}
      </span>
    );
  }

  const urgent = timeLeft.days <= 3;
  const cells = [
    { v: timeLeft.days, l: 'يوم' },
    { v: timeLeft.hours, l: 'ساعة' },
    { v: timeLeft.minutes, l: 'دقيقة' },
    { v: timeLeft.seconds, l: 'ثانية' },
  ];

  return (
    <div className="rounded-2xl bg-ink-950 text-white p-5 relative overflow-hidden grain">
      <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-saffron-400/15 blur-2xl" />
      <div className="relative flex items-center gap-2 text-[13px] font-semibold mb-4">
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${urgent ? 'bg-rose-400' : 'bg-saffron-400'}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${urgent ? 'bg-rose-400' : 'bg-saffron-400'}`} />
        </span>
        <span className="text-ink-200">{urgent ? 'ينتهي التقديم قريباً جداً' : 'الوقت المتبقي للتقديم'}</span>
      </div>

      <div className="relative grid grid-cols-4 gap-2 text-center" dir="ltr">
        {cells.map((c) => (
          <div key={c.l} className="rounded-xl bg-white/[0.07] ring-1 ring-white/10 py-3">
            <span className="block text-[26px] font-bold leading-none tabular-nums text-saffron-300">
              {String(c.v).padStart(2, '0')}
            </span>
            <span className="block mt-1.5 text-[11px] text-ink-300">{c.l}</span>
          </div>
        ))}
      </div>

      <p className="relative mt-4 text-[12px] text-ink-300">ينتهي رسمياً بنهاية يوم {endDate}</p>
    </div>
  );
}
