import { Send, Bell, ArrowLeft, MessageSquare } from 'lucide-react';

export default function TelegramBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 text-white p-6 sm:p-8 shadow-lg my-6">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4 text-right">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Bell className="w-7 h-7 text-sky-200 animate-bounce" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              تنبيهات فورية مجانية
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-1">
              لا تفوّت أي إعلان وظيفي أو نتائج قبول!
            </h3>
            <p className="text-sky-100 text-sm max-w-xl">
              انضم لأكثر من 500,000 باحث وباحثة عن عمل، واحصل على إشعارات الوظائف العسكرية والمدنية والشركات لحظة صدورها مباشرة على هاتفك.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3.5 bg-white text-sky-700 hover:bg-sky-50 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-5 h-5 text-sky-600" />
            <span>قناة التيليجرام الرسمية</span>
            <ArrowLeft className="w-4 h-4" />
          </a>

          <a
            href="https://whatsapp.com/channel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="w-5 h-5" />
            <span>قناة واتساب</span>
          </a>
        </div>
      </div>

      {/* Decorative background circles */}
      <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
      <div className="absolute right-1/4 -top-12 w-64 h-64 rounded-full bg-sky-400/10 pointer-events-none blur-3xl"></div>
    </div>
  );
}
