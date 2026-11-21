import { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الشروط والأحكام وإخلاء المسؤولية | وظيفتك اليوم',
  description: 'شروط وأحكام استخدام منصة وظيفتك اليوم وإخلاء المسؤولية القانوني المتعلق بالإعلانات الوظيفية.',
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="الاتفاقية القانونية وحقوق الاستخدام"
        title="الشروط والأحكام وإخلاء المسؤولية"
        description="تاريخ السريان: نوفمبر 2026. يرجى قراءة هذه الشروط بعناية قبل تصفح المنصة."
        icon={Scale}
        compact
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Content sections */}
        <div className="bg-white rounded-3xl border border-line p-6 sm:p-10 space-y-9 text-[15px] text-ink-700 leading-[2]">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              1. طبيعة المنصة وعملها
            </h2>
            <p>
              منصة <strong>«وظيفتك اليوم»</strong> هي بوابة إخبارية رقمية مستقلة متخصصة في نشر ومتابعة أحدث إعلانات الوظائف الحكومية والمدنية والعسكرية ووظائف الشركات الكبرى وبرامج التدريب ونتائج القبول بالمملكة العربية السعودية، بهدف التيسير على الباحثين عن عمل وتمكينهم من الوصول للمصادر الرسمية بسرعة.
            </p>
          </section>

          {/* Legal Disclaimer Box */}
          <section className="space-y-3 bg-saffron-50 p-5 rounded-2xl border border-saffron-200 text-ink-900">
            <h2 className="text-lg font-black flex items-center gap-2 text-ink-900 border-r-4 border-saffron-500 pr-3">
              2. إخلاء المسؤولية القانوني (Disclaimer)
            </h2>
            <p>
              نود التأكيد على النقاط القانونية الجوهرية التالية:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-ink-900 pt-1 list-disc list-inside">
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
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              3. حقوق الملكية الفكرية
            </h2>
            <p>
              كافة المواد التحريرية والتصميمات البرمجية والأيقونات الخاصة بمنصة «وظيفتك اليوم» محمية بموجب أنظمة حقوق الملكية الفكرية. يُسمح بمشاركة الروابط ونقل مقتطفات من الإعلانات مع الإشارة الصريحة للمصدر. أما الشعارات والعلامات التجارية الخاصة بالشركات والجهات المعلنة فهي ملك لأصحابها الشرعيين وتُستخدم في الموقع لأغراض التعريف والتوثيق الإخباري فقط.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              4. استخدام الروابط الخارجية
            </h2>
            <p>
              قد يتضمن الموقع روابط لمواقع إلكترونية تديرها أطراف ثالثة. نحن لسنا مسؤولين عن محتوى هذه المواقع أو أي أضرار قد تنشأ عن استخدامها. الضغط على أي رابط خارجي يخضع لتقدير المستخدم ومسؤوليته الشخصية.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              5. تعديل الشروط
            </h2>
            <p>
              تحتفظ إدارة المنصة بالحق في تعديل أو تغيير هذه الشروط في أي وقت دون إشعار مسبق. استمرارك في استخدام الموقع بعد إجراء أي تعديلات يعتبر قبولاً صريحاً منك بالشروط المعدلة.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
