import { Job } from '@/types/job';

export interface BroadcastTemplate {
  id: string;
  name: string;
  description: string;
  telegramFormat: string;
  whatsappFormat: string;
}

export const BUILTIN_BROADCAST_TEMPLATES: BroadcastTemplate[] = [
  {
    id: 'detailed',
    name: 'النموذج الشامل والتفصيلي (الافتراضي)',
    description: 'يحتوي على كافة تفاصيل الإعلان والشروط والمزايا والروابط والوسوم',
    telegramFormat: `📢 <b>إعلان وظيفي جديد | {company}</b>

📋 <b>المسمى الوظيفي:</b>
{title}

🏢 <b>الجهة:</b> {company} ({sector})
🎓 <b>المؤهل المطلوب:</b> {qualifications}
👥 <b>الجنس المستهدف:</b> {gender}
📍 <b>مقر العمل:</b> {city} ({location})
💰 <b>الراتب والمزايا:</b> {salary}
⏳ <b>فترة التقديم:</b> من {startDate} حتى {endDate}

📝 <b>نبذة مختصرة:</b>
{summary}

🔗 <b>رابط التفاصيل والتقديم المباشر:</b>
{url}

{tags}
━━━━━━━━━━━━━━━
📲 <i>تابع جديد وظائف المملكة أولاً بأول عبر قناتنا الرسمية:</i>
{siteUrl}`,
    whatsappFormat: `*📢 إعلان وظيفي جديد | {company}*

*📋 المسمى الوظيفي:*
{title}

*🏢 الجهة:* {company} ({sector})
*🎓 المؤهل المطلوب:* {qualifications}
*👥 الجنس المستهدف:* {gender}
*📍 مقر العمل:* {city}
*💰 الراتب والمزايا:* {salary}
*⏳ فترة التقديم:* حتى {endDate}

*📝 نبذة:*
{summary}

*🔗 رابط التفاصيل والتقديم المباشر:*
{url}

{tags}
*📲 انضم لمجتمعنا الرسمي لتصلك الوظائف فور نشرها:*
{siteUrl}`,
  },
  {
    id: 'urgent',
    name: 'النموذج السريع والعاجل (Flash Alert)',
    description: 'تنبيه سريع وموجز يركز على اسم الوظيفة والمؤهل ورابط التقديم الفوري',
    telegramFormat: `🚨 <b>تنبيه توظيف عاجل | {company}</b>

📌 <b>الوظيفة:</b> {title}
🏢 <b>الجهة:</b> {company}
🎓 <b>المؤهل:</b> {qualifications}
📍 <b>المقر:</b> {city}
⏳ <b>ينتهي التقديم:</b> {endDate}

⚡ <b>رابط التقديم الفوري والمباشر:</b>
{url}

{tags}`,
    whatsappFormat: `*🚨 تنبيه توظيف عاجل | {company}*

*📌 الوظيفة:* {title}
*🏢 الجهة:* {company}
*🎓 المؤهل:* {qualifications}
*📍 المقر:* {city}
*⏳ ينتهي:* {endDate}

*⚡ رابط التقديم الفوري:*
{url}

{tags}`,
  },
  {
    id: 'highlights',
    name: 'نموذج نقاط التميز والمزايا',
    description: 'تنسيق جذاب يستعرض المزايا والرواتب والمؤهل في نقاط واضحة ومباشرة',
    telegramFormat: `💼 <b>فرصة وظيفية مميزة لدى {company}</b>

🔹 <b>المسمى:</b> {title}
🔹 <b>القطاع:</b> {sector}
🔹 <b>المؤهل:</b> {qualifications} ({gender})
🔹 <b>الراتب والحوافز:</b> {salary}
🔹 <b>الخبرة:</b> {experience}
🔹 <b>المقر:</b> {city}

✨ <b>سارع بالتقديم عبر الرابط الرسمي:</b>
{url}

{tags}`,
    whatsappFormat: `*💼 فرصة وظيفية مميزة لدى {company}*

▪️ *المسمى:* {title}
▪️ *القطاع:* {sector}
▪️ *المؤهل:* {qualifications} ({gender})
▪️ *الراتب والمزايا:* {salary}
▪️ *الخبرة:* {experience}
▪️ *المقر:* {city}

*✨ رابط التقديم المعتمد:*
{url}

{tags}`,
  },
  {
    id: 'results',
    name: 'نموذج نتائج القبول والاستعلام',
    description: 'مخصص لإعلانات ظهور نتائج القبول والمطابقة ومواعيد الفحص',
    telegramFormat: `📣 <b>إعلان نتائج القبول والترشيح | {company}</b>

🟢 <b>الموضوع:</b> {title}
🏢 <b>الجهة:</b> {company}
📅 <b>تاريخ الإعلان:</b> {startDate}

🔍 <b>رابط الاستعلام المباشر بالسجل المدني:</b>
{url}

⚠️ <i>يرجى تحضير المستندات الرسمية وأصل الهوية قبل موعد المطابقة.</i>
{tags}`,
    whatsappFormat: `*📣 إعلان نتائج القبول والترشيح | {company}*

*🟢 الموضوع:* {title}
*🏢 الجهة:* {company}

*🔍 رابط الاستعلام المباشر بالهوية الوطنية:*
{url}

*⚠️ تنبيه: يرجى إحضار المستندات الرسمية في الموعد المحدد.*
{tags}`,
  },
  {
    id: 'minimal',
    name: 'النموذج الحديث والموجز (Professional Modern)',
    description: 'صيغة أنيقة ومرتبة للمهنيين والمختصين ورواد الأعمال',
    telegramFormat: `💼 <b>{company} تطرح فرصة وظيفية جديدة</b>

🏷️ <b>المسمى:</b> {title}
📍 <b>المقر:</b> {city}
🎓 <b>المؤهل:</b> {qualifications}
⏱️ <b>آخر موعد:</b> {endDate}

🔗 <b>للتقديم المباشر ومعاينة الشروط:</b>
{url}

{tags}`,
    whatsappFormat: `*💼 {company} تطرح فرصة وظيفية جديدة*

*🏷️ المسمى:* {title}
*📍 المقر:* {city}
*🎓 المؤهل:* {qualifications}
*⏱️ آخر موعد:* {endDate}

*🔗 رابط التقديم المباشر ومعاينة الشروط:*
{url}

{tags}`,
  },
  {
    id: 'training',
    name: 'نموذج برامج التدريب والتأهيل (Coop & Trainees)',
    description: 'مخصص لبرامج التدريب المنتهي بالتوظيف، التدريب التعاوني، وبرامج حديثي التخرج',
    telegramFormat: `🎓 <b>إعلان برنامج تدريبي وتأهيلي | {company}</b>

🎯 <b>اسم البرنامج:</b> {title}
🏢 <b>الجهة التدريبية:</b> {company}
👥 <b>الفئة المستهدفة:</b> {gender} ({qualifications})
📍 <b>مدينة التدريب:</b> {city}
💰 <b>المكافأة والمزايا:</b> {salary}

📝 <b>رابط التسجيل والتقديم الرسمي:</b>
{url}

{tags}`,
    whatsappFormat: `*🎓 إعلان برنامج تدريبي وتأهيلي | {company}*

*🎯 اسم البرنامج:* {title}
*🏢 الجهة التدريبية:* {company}
*👥 الفئة المستهدفة:* {gender} ({qualifications})
*📍 مدينة التدريب:* {city}
*💰 المكافأة والمزايا:* {salary}

*📝 رابط التسجيل والتقديم الرسمي:*
{url}

{tags}`,
  },
];

export function renderTemplate(templateStr: string, job: Job, siteUrl: string = 'https://wadhaef-alyoum.sa'): string {
  const jobUrl = `${siteUrl}/jobs/${job.slug}`;
  const quals = job.qualifications.join('، ');
  const tagsStr = (job.tags || []).map((t) => `#${t.replace(/\s+/g, '_')}`).join(' ');

  return templateStr
    .replace(/{title}/g, job.title || '')
    .replace(/{company}/g, job.company || '')
    .replace(/{sector}/g, job.sectorLabel || '')
    .replace(/{qualifications}/g, quals || 'كافة المؤهلات')
    .replace(/{gender}/g, job.genderLabel || 'للجنسين')
    .replace(/{city}/g, job.city || 'الرياض')
    .replace(/{location}/g, job.location || 'كافة المناطق')
    .replace(/{salary}/g, job.salary || 'رواتب وبدلات مجزية')
    .replace(/{experience}/g, job.experience || 'لا يشترط خبرة سابقة')
    .replace(/{startDate}/g, job.startDate || '')
    .replace(/{endDate}/g, job.endDate || 'حتى الاكتفاء')
    .replace(/{summary}/g, job.summary || 'التفاصيل الكاملة وشروط التقديم متوفرة عبر الرابط.')
    .replace(/{url}/g, jobUrl)
    .replace(/{sourceUrl}/g, job.sourceUrl || jobUrl)
    .replace(/{tags}/g, tagsStr)
    .replace(/{siteUrl}/g, siteUrl);
}

/**
 * Format a job post specifically for Telegram channels with HTML tags and emojis
 */
export function formatTelegramMessage(
  job: Job,
  siteUrl: string = 'https://wadhaef-alyoum.sa',
  templateStr?: string
): string {
  if (templateStr) {
    return renderTemplate(templateStr, job, siteUrl);
  }
  return renderTemplate(BUILTIN_BROADCAST_TEMPLATES[0].telegramFormat, job, siteUrl);
}

/**
 * Format a job post specifically for WhatsApp channels / groups with WhatsApp Markdown (*bold*)
 */
export function formatWhatsAppMessage(
  job: Job,
  siteUrl: string = 'https://wadhaef-alyoum.sa',
  templateStr?: string
): string {
  if (templateStr) {
    return renderTemplate(templateStr, job, siteUrl);
  }
  return renderTemplate(BUILTIN_BROADCAST_TEMPLATES[0].whatsappFormat, job, siteUrl);
}

/**
 * Send directly to Telegram Channel using Telegram Bot API
 */
export async function sendTelegramBroadcast(
  job: Job,
  botToken: string,
  channelId: string,
  siteUrl: string = 'https://wadhaef-alyoum.sa',
  customText?: string
): Promise<{ success: boolean; message: string; data?: any }> {
  if (!botToken || !channelId) {
    return {
      success: false,
      message: 'يرجى تزويد توكن البوت (Bot Token) ومعرف القناة (Channel Username/ID).',
    };
  }

  const messageText = customText || formatTelegramMessage(job, siteUrl);

  let targetChatId = channelId.trim();
  if (!targetChatId.startsWith('@') && !targetChatId.startsWith('-100') && isNaN(Number(targetChatId))) {
    targetChatId = `@${targetChatId}`;
  }

  const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return {
        success: true,
        message: 'تم النشر بنجاح في القناة!',
        data: data.result,
      };
    } else {
      return {
        success: false,
        message: data.description || 'فشل إرسال الرسالة إلى القناة، يرجى مراجعة الصلاحيات والتوكن.',
        data,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'خطأ في الاتصال بسيرفر تيليجرام.',
    };
  }
}
