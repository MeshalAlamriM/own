import { Metadata } from 'next';
import { FileText, ShieldAlert, CheckCircle, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الشروط والأحكام وإخلاء المسؤولية | وظيفتك اليوم',
  description: 'شروط وأحكام استخدام منصة وظيفتك اليوم وإخلاء المسؤولية القانوني المتعلق بالإعلانات الوظيفية.',
};

export default function TermsPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-xs text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-3">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>الاتفاقية القانونية وحقوق الاستخدام</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            الشروط والأحكام وإخلاء المسؤولية
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            تاريخ السريان: نوفمبر 2026 | يرجى قراءة هذه الشروط بعناية قبل تصفح المنصة.
          </p>
        </div>

        {/* Content sections */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-xs space-y-8 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-950 flex items-center gap-2 border-r-4 border-emerald-600 pr-3">
              1. طبيعة المنصة وعملها
            </h2>
            <p>
              منصة <strong>«وظيفتك اليوم»</strong> هي بوابة إخبارية رقمية مستقلة متخصصة في نشر ومتابعة أحدث إعلانات الوظائف الحكومية والمدنية والعسكرية ووظائف الشركات الكبرى وبرامج التدريب ونتائج القبول بالمملكة العربية السعودية، بهدف التيسير على الباحثين عن عمل وتمكينهم من الوصول للمصادر الرسمية بسرعة.
            </p>
          </section>

          {/* Legal Disclaimer Box */}
          <section className="space-y-3 bg-amber-50/60 p-5 rounded-2xl border border-amber-200 text-amber-950">
            <h2 className="text-lg font-black flex items-center gap-2 text-amber-900 border-r-4 border-amber-600 pr-3">
              2. إخلاء المسؤولية القانوني (Disclaimer)
            </h2>
            <p>
              نود التأكيد على النقاط القانونية الجوهرية التالية:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-amber-900 pt-1 list-disc list-inside">
              <li>
                الموقع <strong>ليس جهة توظيف رسمية</strong> ولا يمثل أي وزارة، قطاع عسكري، أو شركة بشكل مباشر.
              </li>
              <li>
                الموقع <strong>لا يتقاضى أي مبالغ أو رسوم مالية</strong> من المتقدمين إطلاقاً؛ فخدمات المنصة ومتابعة الإعلانات مجانية 100%.
              </li>
              <li>
                التقديم على كافة الوظائف يتم حصرياً ومباشرة عبر البوابات والمنصات الرسمية للمنشآت المعلنة (مثل منصة جدارات، منصة أبشر توظيف، وبوابات الشركات).
              </li>
              <li>
                نبذل أقصى جهد لضمان دقة وصحة المعلومات ومطابقتها للمصادر الرسمية، إلا أننا لا نتحمل أي مسؤولية قانونية عن أي تغيير مفاجئ في مواعيد التقديم أو شروطه من قبل الجهات المعلنة.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-950 flex items-center gap-2 border-r-4 border-emerald-600 pr-3">
              3. حقوق الملكية الفكرية
            </h2>
            <p>
              كافة المواد التحريرية والتصميمات البرمجية والأيقونات الخاصة بمنصة «وظيفتك اليوم» محمية بموجب أنظمة حقوق الملكية الفكرية. يُسمح بمشاركة الروابط ونقل مقتطفات من الإعلانات مع الإشارة الصريحة للمصدر. أما الشعارات والعلامات التجارية الخاصة بالشركات والجهات المعلنة فهي ملك لأصحابها الشرعيين وتُستخدم في الموقع لأغراض التعريف والتوثيق الإخباري فقط.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-950 flex items-center gap-2 border-r-4 border-emerald-600 pr-3">
              4. استخدام الروابط الخارجية
            </h2>
            <p>
              قد يتضمن الموقع روابط لمواقع إلكترونية تديرها أطراف ثالثة. نحن لسنا مسؤولين عن محتوى هذه المواقع أو أي أضرار قد تنشأ عن استخدامها. الضغط على أي رابط خارجي يخضع لتقدير المستخدم ومسؤوليته الشخصية.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-gray-950 flex items-center gap-2 border-r-4 border-emerald-600 pr-3">
              5. تعديل الشروط
            </h2>
            <p>
              تحتفظ إدارة المنصة بالحق في تعديل أو تغيير هذه الشروط في أي وقت دون إشعار مسبق. استمرارك في استخدام الموقع بعد إجراء أي تعديلات يعتبر قبولاً صريحاً منك بالشروط المعدلة.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
