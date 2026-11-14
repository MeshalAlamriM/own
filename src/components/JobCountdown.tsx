'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface JobCountdownProps {
  endDate: string;
  startDate?: string;
  compact?: boolean;
}

export default function JobCountdown({ endDate, startDate, compact = false }: JobCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    isUpcoming: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    isUpcoming: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(`${endDate}T23:59:59`).getTime();
      const start = startDate ? new Date(`${startDate}T00:00:00`).getTime() : 0;

      if (start > now) {
        // Upcoming
        const diff = start - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false, isUpcoming: true });
        return;
      }

      if (now > end) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isUpcoming: false });
        return;
      }

      const diff = end - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false, isUpcoming: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endDate, startDate]);

  if (timeLeft.isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${compact ? 'text-[11px] py-0.5' : ''}`}>
        <AlertCircle className="w-3.5 h-3.5" />
        <span>انتهى التقديم</span>
      </div>
    );
  }

  if (timeLeft.isUpcoming) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${compact ? 'text-[11px] py-0.5' : ''}`}>
        <Clock className="w-3.5 h-3.5" />
        <span>يبدأ التقديم بعد {timeLeft.days} يوم</span>
      </div>
    );
  }

  if (compact) {
    const isUrgent = timeLeft.days <= 3;
    return (
      <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isUrgent ? 'bg-amber-100 text-amber-800 font-semibold' : 'bg-emerald-50 text-emerald-800'
      }`}>
        <Clock className="w-3 h-3" />
        <span>
          {timeLeft.days > 0 ? `متبقي ${timeLeft.days} يوم` : `متبقي ${timeLeft.hours} ساعة`}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">الوقت المتبقي لانتهاء التقديم:</h4>
          <p className="text-xs text-gray-500">ينتهي التقديم رسمياً بنهاية يوم {endDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-center" dir="ltr">
        <div className="bg-white rounded-lg border border-emerald-200 shadow-sm px-2.5 py-1.5 min-w-[50px]">
          <span className="block font-black text-lg text-emerald-700 leading-tight">{timeLeft.days}</span>
          <span className="text-[10px] text-gray-500 font-medium">يوم</span>
        </div>
        <span className="text-emerald-600 font-bold">:</span>
        <div className="bg-white rounded-lg border border-emerald-200 shadow-sm px-2.5 py-1.5 min-w-[50px]">
          <span className="block font-black text-lg text-emerald-700 leading-tight">{timeLeft.hours}</span>
          <span className="text-[10px] text-gray-500 font-medium">ساعة</span>
        </div>
        <span className="text-emerald-600 font-bold">:</span>
        <div className="bg-white rounded-lg border border-emerald-200 shadow-sm px-2.5 py-1.5 min-w-[50px]">
          <span className="block font-black text-lg text-emerald-700 leading-tight">{timeLeft.minutes}</span>
          <span className="text-[10px] text-gray-500 font-medium">دقيقة</span>
        </div>
        <span className="text-emerald-600 font-bold">:</span>
        <div className="bg-white rounded-lg border border-emerald-200 shadow-sm px-2.5 py-1.5 min-w-[50px]">
          <span className="block font-black text-lg text-emerald-700 leading-tight">{timeLeft.seconds}</span>
          <span className="text-[10px] text-gray-500 font-medium">ثانية</span>
        </div>
      </div>
    </div>
  );
}
