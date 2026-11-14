'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-xs text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>خدمة الباحثين وفريق الدعم</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            اتصل بنا (Contact Us)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            يسعدنا استقبال مقترحاتكم، استفساراتكم، أو الإبلاغ عن أي إعلان أو رابط منتهي. فريقنا متاح للإجابة عليكم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-bold text-gray-900 text-base border-r-4 border-emerald-600 pr-3">
              قنوات التواصل
            </h3>

            <div className="space-y-4 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-gray-800">البريد الإلكتروني للتحرير:</span>
                  <span className="text-gray-500 dir-ltr text-right block">contact@wadhaef-alyoum.sa</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-gray-800">قناة التيليجرام:</span>
                  <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                    @wadhaef_sa
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-gray-800">قناة الواتساب:</span>
                  <span className="text-emerald-700 font-medium">متاحة عبر الرابط المباشر بالموقع</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-gray-800">المقر:</span>
                  <span className="text-gray-500">الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
              ساعات العمل: الأحد - الخميس من 8:00 صباحاً حتى 5:00 مساءً. الاستفسارات العاجلة يتم الرد عليها خلال 24 ساعة.
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">شكراً لتواصلك معنا!</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  تم استلام رسالتك بنجاح، وسيقوم فريق التحرير والدعم الفني بمراجعتها والرد عليك في أقرب وقت.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-bold text-gray-900 text-base mb-2">أرسل لنا استفسارك مباشرة</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="محمد عبدالله"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dir-ltr text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">موضوع الرسالة *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="استفسار عن إعلان، اقتراح تحسين، إبلاغ عن رابط..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">تفاصيل الرسالة *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب رسالتك بالتفصيل هنا..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  إرسال الرسالة الآن
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
