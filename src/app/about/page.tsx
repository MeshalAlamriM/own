import { Metadata } from 'next';
import { Briefcase, Target, Award, Users, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'من نحن والسياسة التحريرية | وظيفتك اليوم',
  description: 'تعرف على رسالة ورؤية منصة وظيفتك اليوم البوابة السعودية الرائدة في تغطية أخبار الوظائف ونتائج القبول.',
};

export default function AboutPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Card */}
        <div className="bg-gradient-to-tr from-emerald-800 via-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-emerald-300" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            عن منصة «وظيفتك اليوم»
          </h1>
          <p className="text-xs sm:text-base text-emerald-100 max-w-2xl leading-relaxed">
            المنصة السعودية الرائدة المتخصصة في رصد وتغطية أخبار الوظائف الحكومية والمدنية والعسكرية، شواغر كبرى الشركات، برامج التدريب المنتهي بالتوظيف، ومتابعة نتائج القبول لحظة بلحظة.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-gray-900">رؤيتنا</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              أن نكون المرجع الرقمي الأول والأكثر ثقة وسرعة لكل باحث وباحثة عن عمل في المملكة العربية السعودية، والمساهمة الفاعلة في دعم أهداف التوطين ورؤية السعودية 2030 عبر ربط الكفاءات الوطنية بالفرص الواعدة.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-gray-900">رسالتنا</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              تقديم محتوى وظيفي دقيق، موثوق، ومحدث على مدار الساعة مع توفير روابط التقديم الرسمية المباشرة بكل شفافية ومجانية، وتسهيل تتبع مواعيد وبدايات ونهايات فترات التقديم والنتائج.
            </p>
          </div>
        </div>

        {/* Editorial Standards */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-black text-gray-900 border-r-4 border-emerald-600 pr-3">
            معاييرنا التحريرية وسياسة النشر
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">المصادر الرسمية المعتمدة</h3>
                <p className="text-xs text-gray-600 leading-relaxed">لا ننشر أي إعلان وظيفي إلا بعد التحقق من صدوره عبر القنوات الرسمية (الوزارات، المنصات الوطنية المعتمدة، وبوابات الشركات).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">الروابط المباشرة المجانية</h3>
                <p className="text-xs text-gray-600 leading-relaxed">نوفر للمستخدم زر التقديم المباشر على بوابة الجهة الرسمية دون أي روابط وسيطة أو رسوم أو إعلانات مضللة.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">تنوع المؤهلات والفرص</h3>
                <p className="text-xs text-gray-600 leading-relaxed">تغطية كافة المؤهلات العلمية لحملة الثانوية، الدبلومات، البكالوريوس، والماجستير لكافة فئات المجتمع في جميع مناطق المملكة.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <Briefcase className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">التحديث والتدقيق المستمر</h3>
                <p className="text-xs text-gray-600 leading-relaxed">فريق التحرير يعمل على مدار 24 ساعة لتحديث حالات التقديم (متاح، ينتهي قريباً، أعلنت النتائج) لإبقاء الباحثين على اطلاع دائم.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-emerald-950 text-sm">هل لديك استفسار أو ترغب في التواصل مع فريق التحرير؟</h3>
            <p className="text-xs text-emerald-800 mt-0.5">يسعدنا دائماً تلقي اقتراحاتكم واستفساراتكم على مدار الساعة.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shrink-0 transition"
          >
            تواصل معنا الآن ←
          </Link>
        </div>
      </div>
    </div>
  );
}
