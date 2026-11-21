'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Mail, MessageSquare, Send, CheckCircle2, MapPin, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [category, setCategory] = useState<'inquiry' | 'report'>('inquiry');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    jobUrl: '',
    website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, category }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'تعذر إرسال الرسالة.');
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', jobUrl: '', website: '' });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'تعذر إرسال الرسالة.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="خدمة الباحثين وفريق الدعم"
        title="تواصل معنا"
        description="يسعدنا استقبال مقترحاتكم واستفساراتكم، أو الإبلاغ عن أي إعلان أو رابط منتهٍ. فريقنا يرد خلال 24 ساعة."
        icon={Mail}
        compact
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl border border-line p-6 sm:p-8 space-y-6">
            <h3 className="font-bold text-ink-900 text-base border-s-4 border-saffron-500 ps-3">
              قنوات التواصل
            </h3>

            <div className="space-y-4 text-[13.5px] text-ink-600">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-ink-800">البريد الإلكتروني للتحرير:</span>
                  <a
                    href="mailto:info@job2sa.com"
                    className="text-ink-500 dir-ltr text-right block hover:text-saffron-700 hover:underline"
                  >
                    info@job2sa.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-ink-800">قناة التيليجرام:</span>
                  <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                    @wadhaef_sa
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-ink-800">قناة الواتساب:</span>
                  <span className="text-ink-700 font-medium">متاحة عبر الرابط المباشر بالموقع</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-ink-100 text-ink-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-ink-800">المقر:</span>
                  <span className="text-ink-500">الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-ink-100 text-[11px] text-ink-400">
              ساعات العمل: الأحد - الخميس من 8:00 صباحاً حتى 5:00 مساءً. الاستفسارات العاجلة يتم الرد عليها خلال 24 ساعة.
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-line p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-saffron-50 text-saffron-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-ink-900">شكراً لتواصلك معنا!</h3>
                <p className="text-xs text-ink-500 max-w-sm mx-auto leading-relaxed">
                  تم استلام رسالتك بنجاح، وسيقوم فريق التحرير والدعم الفني بمراجعتها والرد عليك في أقرب وقت.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-ink-950 text-white rounded-xl text-xs font-bold hover:bg-ink-800 transition"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-[13.5px]">
                <h3 className="font-bold text-ink-900 text-base mb-2">أرسل لنا استفسارك مباشرة</h3>

                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="hidden"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('inquiry')}
                    className={`p-3 rounded-xl border text-xs font-bold transition ${category === 'inquiry' ? 'border-saffron-500 bg-saffron-50 text-saffron-800' : 'border-line text-ink-600'}`}
                  >
                    <Mail className="w-4 h-4 inline-block ms-1" />
                    استفسار أو اقتراح
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('report')}
                    className={`p-3 rounded-xl border text-xs font-bold transition ${category === 'report' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-line text-ink-600'}`}
                  >
                    <AlertCircle className="w-4 h-4 inline-block ms-1" />
                    إبلاغ عن إعلان
                  </button>
                </div>

                {category === 'report' && (
                  <div>
                    <label className="block font-bold text-ink-700 mb-1">رابط الإعلان محل البلاغ</label>
                    <input
                      type="url"
                      value={formData.jobUrl}
                      onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                      placeholder="https://job2sa.com/jobs/..."
                      className="w-full p-3 bg-paper border border-line rounded-xl outline-none focus:ring-4 focus:ring-saffron-100 focus:border-saffron-500 focus:bg-white dir-ltr text-right"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-ink-700 mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="محمد عبدالله"
                      className="w-full p-3 bg-paper border border-line rounded-xl outline-none focus:ring-4 focus:ring-saffron-100 focus:border-saffron-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink-700 mb-1">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full p-3 bg-paper border border-line rounded-xl outline-none focus:ring-4 focus:ring-saffron-100 focus:border-saffron-500 focus:bg-white dir-ltr text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">موضوع الرسالة *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="استفسار عن إعلان، اقتراح تحسين، إبلاغ عن رابط..."
                    className="w-full p-3 bg-paper border border-line rounded-xl outline-none focus:ring-4 focus:ring-saffron-100 focus:border-saffron-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">تفاصيل الرسالة *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب رسالتك بالتفصيل هنا..."
                    className="w-full p-3 bg-paper border border-line rounded-xl outline-none focus:ring-4 focus:ring-saffron-100 focus:border-saffron-500 focus:bg-white"
                  />
                </div>

                {submitError && (
                  <p role="alert" className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 text-xs">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-ink-950 hover:bg-ink-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl transition"
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال الرسالة الآن'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
