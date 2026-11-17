import { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Briefcase, Target, Award, Users, ShieldCheck, BadgeCheck, RefreshCw, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'من نحن والسياسة التحريرية | وظيفتك اليوم',
  description: 'تعرف على رسالة ورؤية منصة وظيفتك اليوم البوابة السعودية الرائدة في تغطية أخبار الوظائف ونتائج القبول.',
};

const standards = [
  {
    icon: BadgeCheck,
    title: 'مصادر رسمية فقط',
    text: 'لا ننشر إعلاناً إلا بعد التحقق من صدوره عبر القنوات الرسمية: الوزارات والمنصات الوطنية المعتمدة وبوابات الشركات.',
  },
  {
    icon: ShieldCheck,
    title: 'روابط مباشرة ومجانية',
    text: 'نضع زر التقديم المباشر على بوابة الجهة الرسمية، دون روابط وسيطة أو رسوم أو إعلانات مضللة.',
  },
  {
    icon: Users,
    title: 'فرص لكل المؤهلات',
    text: 'نغطي الثانوية والدبلوم والبكالوريوس والماجستير، لكل فئات المجتمع وفي جميع مناطق المملكة.',
  },
  {
    icon: RefreshCw,
    title: 'تحديث وتدقيق مستمر',
    text: 'نحدّث حالات التقديم (متاح، ينتهي قريباً، أُعلنت النتائج) باستمرار ليبقى الباحث على اطلاع دائم.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="من نحن"
        title="منصة سعودية تضع الإعلان الرسمي أمامك مباشرة"
        description="«وظيفتك اليوم» منصة متخصصة في رصد الوظائف الحكومية والمدنية والعسكرية وشواغر كبرى الشركات وبرامج التدريب ونتائج القبول، لحظة بلحظة."
        icon={Briefcase}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-white border border-line p-7 sm:p-9">
            <span className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </span>
            <h2 className="mt-5 text-[20px] font-bold text-ink-950">رؤيتنا</h2>
            <p className="mt-3 text-[14.5px] text-ink-600 leading-[2]">
              أن نكون المرجع الرقمي الأول والأكثر ثقة وسرعة لكل باحث وباحثة عن عمل في المملكة، وأن نسهم في دعم أهداف التوطين ورؤية السعودية 2030 بربط الكفاءات الوطنية بالفرص الواعدة.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-line p-7 sm:p-9">
            <span className="w-12 h-12 rounded-xl bg-ink-950 text-saffron-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </span>
            <h2 className="mt-5 text-[20px] font-bold text-ink-950">رسالتنا</h2>
            <p className="mt-3 text-[14.5px] text-ink-600 leading-[2]">
              تقديم محتوى وظيفي دقيق وموثوق ومحدّث على مدار الساعة، مع روابط التقديم الرسمية المباشرة بشفافية ومجانية، وتسهيل تتبع مواعيد بدء التقديم وانتهائه والنتائج.
            </p>
          </div>
        </div>

        <section aria-labelledby="standards-title">
          <p className="text-[12px] font-bold text-saffron-700 mb-1.5">السياسة التحريرية</p>
          <h2 id="standards-title" className="text-[24px] sm:text-[30px] font-bold text-ink-950">
            معاييرنا في النشر
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {standards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-line">
                  <span className="w-11 h-11 rounded-xl bg-paper-2 text-ink-800 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold text-ink-950">{s.title}</h3>
                    <p className="mt-1.5 text-[14px] text-ink-500 leading-[1.95]">{s.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="rounded-3xl bg-saffron-400 text-ink-950 p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-[20px] sm:text-[24px] font-bold">هل لديك استفسار أو اقتراح؟</h2>
            <p className="mt-2 text-[14.5px] text-ink-800">يسعدنا تواصلك مع فريق التحرير في أي وقت.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-ink-950 text-white text-[14px] font-semibold hover:bg-ink-800 transition-colors shrink-0"
          >
            تواصل معنا
            <ArrowLeft className="w-4 h-4 text-saffron-400" />
          </Link>
        </div>
      </div>
    </>
  );
}
