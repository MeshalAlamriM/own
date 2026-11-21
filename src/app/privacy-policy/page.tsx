import { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية وملفات تعريف الارتباط | وظيفتك اليوم',
  description: 'سياسة الخصوصية واستخدام ملفات تعريف الارتباط (Cookies) وإعلانات Google AdSense في منصة وظيفتك اليوم.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="الخصوصية والأمان"
        title="سياسة الخصوصية"
        description="تاريخ آخر تحديث: نوفمبر 2026. متوافقة مع سياسات Google AdSense ولوائح حماية البيانات."
        icon={ShieldCheck}
        compact
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Content sections */}
        <div className="bg-white rounded-3xl border border-line p-6 sm:p-10 space-y-9 text-[15px] text-ink-700 leading-[2]">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              1. مقدمة ونطاق التطبيق
            </h2>
            <p>
              نحن في منصة <strong>«وظيفتك اليوم»</strong> نولي حماية خصوصية زوارنا ومستخدمينا أهمية بالغة وأولوية قصوى. توضح هذه الوثيقة طبيعة المعلومات الشخصية وغير الشخصية التي نتلقاها ونجمعها أثناء زيارتكم للموقع وكيفية استخدامها وحمايتها.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              2. ملفات الدخول وسجلات السيرفر (Log Files)
            </h2>
            <p>
              مثل معظم المواقع الإلكترونية وخوادم الويب، نستخدم ملفات السجل القياسية. تتضمن المعلومات الموجودة داخل ملفات السجل: عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت (ISP)، طابع التاريخ والوقت، صفحات الإحالة/الخروج، وعدد النقرات لتحليل الاتجاهات وإدارة الموقع وتحسين تجربة المستخدم. هذه البيانات ليست مرتبطة بأي معلومات تحدد الهوية الشخصية للمستخدم.
            </p>
          </section>

          {/* Critical section for AdSense approval */}
          <section className="space-y-3 bg-paper-2 p-5 rounded-2xl border border-line">
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              3. ملفات تعريف الارتباط وإعلانات Google AdSense (هام)
            </h2>
            <p>
              نستخدم ملفات تعريف الارتباط (Cookies) لتخزين المعلومات المتعلقة بتفضيلات الزوار وتخصيص محتوى الموقع بناءً على نوع المتصفح أو المعلومات الأخرى التي يرسلها الزائر.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-ink-800 pt-2 list-disc list-inside">
              <li>
                <strong>Google كبائع لطرف ثالث:</strong> تستخدم شركة Google ملفات تعريف الارتباط (مثل ملف تعريف الارتباط <strong>DART</strong>) لخدمة الإعلانات على موقعنا بناءً على زياراتك السابقة لهذا الموقع أو لمواقع أخرى على الويب.
              </li>
              <li>
                يمكن للمستخدمين إلغاء الاشتراك في استخدام ملف تعريف الارتباط DART لخدمة الإعلانات القائمة على الاهتمامات من خلال زيارة <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-saffron-700 font-bold underline">سياسة الخصوصية الخاصة بإعلانات Google وشبكة المحتوى</a>.
              </li>
              <li>
                قد يستخدم شركاؤنا الإعلانيون من الأطراف الثالثة تقنيات مثل ملفات تعريف الارتباط، جافا سكريبت، أو إشارات الويب لقياس فاعلية إعلاناتهم وتخصيص المحتوى الإعلاني الذي تراه.
              </li>
              <li>
                لا تملك منصة «وظيفتك اليوم» إمكانية الوصول أو السيطرة على ملفات تعريف الارتباط هذه التي يستخدمها المعلنون من الأطراف الثالثة.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              4. الروابط الخارجية ومواقع التوظيف الرسمية
            </h2>
            <p>
              يحتوي موقعنا على روابط تقود إلى مواقع خارجية (مثل منصة جدارات، منصة أبشر توظيف، بوابات التوظيف الرسمية للشركات والوزارات). يرجى العلم بأننا لا نتحكم في سياسات الخصوصية الخاصة بهذه المواقع الخارجية، ونشجعكم على مراجعة سياسة الخصوصية لكل موقع تزورونه عند الخروج من منصتنا.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              5. خصوصية الأطفال
            </h2>
            <p>
              حماية خصوصية الأطفال هي جزء أساسي من سياستنا. نحن لا نجمع عن عمد أي معلومات تعريف شخصية من الأطفال دون سن 13 عاماً. إذا كان أحد الوالدين أو الأوصياء يعتقد أن لدينا في قاعدة بياناتنا معلومات تعريف شخصية لطفل، يرجى الاتصال بنا فوراً وسنبذل قصارى جهدنا لإزالة هذه المعلومات على الفور.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-ink-950 flex items-center gap-2 border-s-4 border-saffron-500 ps-3">
              6. الموافقة والتحديثات
            </h2>
            <p>
              باستخدامك لموقعنا، فإنك توافق بموجب هذا على سياسة الخصوصية الخاصة بنا وشروطها وأحكامها. قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لمواكبة التغييرات التنظيمية، وسيتم نشر أي تحديث في هذه الصفحة.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
