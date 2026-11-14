import { Job } from '@/types/job';

/**
 * Format a job post specifically for Telegram channels with HTML tags and emojis
 */
export function formatTelegramMessage(job: Job, siteUrl: string = 'https://wadhaef-alyoum.sa'): string {
  const jobUrl = `${siteUrl}/jobs/${job.slug}`;
  const quals = job.qualifications.join('، ');
  
  return `📢 <b>إعلان وظيفي جديد | ${escapeHtml(job.company)}</b>

📋 <b>المسمى:</b>
${escapeHtml(job.title)}

🏢 <b>الجهة:</b> ${escapeHtml(job.company)} (${escapeHtml(job.sectorLabel)})
🎓 <b>المؤهل المطلوب:</b> ${escapeHtml(quals)}
👥 <b>الجنس المستهدف:</b> ${escapeHtml(job.genderLabel)}
📍 <b>مقر العمل:</b> ${escapeHtml(job.city)} (${escapeHtml(job.location)})
💰 <b>المزايا:</b> ${escapeHtml(job.salary || 'رواتب وبدلات مجزية')}
⏳ <b>فترة التقديم:</b> من ${job.startDate} حتى ${job.endDate}

📝 <b>نبذة مختصرة:</b>
${escapeHtml(job.summary || 'التفاصيل الكاملة وشروط التقديم متوفرة عبر الرابط.')}

🔗 <b>رابط التفاصيل والتقديم المباشر:</b>
${jobUrl}

━━━━━━━━━━━━━━━
📲 <i>تابع جديد الوظائف الحكومية والعسكرية والشركات عبر قناتنا الرسمية:</i>
${siteUrl}`;
}

/**
 * Format a job post specifically for WhatsApp channels / groups with WhatsApp Markdown (*bold*)
 */
export function formatWhatsAppMessage(job: Job, siteUrl: string = 'https://wadhaef-alyoum.sa'): string {
  const jobUrl = `${siteUrl}/jobs/${job.slug}`;
  const quals = job.qualifications.join('، ');

  return `*📢 إعلان وظيفي جديد | ${job.company}*

*📋 المسمى:*
${job.title}

*🏢 الجهة:* ${job.company} (${job.sectorLabel})
*🎓 المؤهل المطلوب:* ${quals}
*👥 الجنس:* ${job.genderLabel}
*📍 مقر العمل:* ${job.city}
*💰 الراتب والمزايا:* ${job.salary || 'رواتب وبدلات مجزية'}
*⏳ ينتهي التقديم:* ${job.endDate}

*📝 نبذة:*
${job.summary || 'التفاصيل والشروط متاحة بالكامل عبر الرابط.'}

*🔗 رابط التفاصيل والتقديم المباشر:*
${jobUrl}

*📲 شارك الإعلان مع المهتمين والباحثين عن عمل.*`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Send directly to Telegram Channel using Telegram Bot API
 */
export async function sendTelegramBroadcast(
  job: Job,
  botToken: string,
  channelId: string,
  siteUrl: string = 'https://wadhaef-alyoum.sa'
): Promise<{ success: boolean; message: string; data?: any }> {
  if (!botToken || !channelId) {
    return {
      success: false,
      message: 'يرجى تزويد توكن البوت (Bot Token) ومعرف القناة (Channel Username/ID).'
    };
  }

  const messageText = formatTelegramMessage(job, siteUrl);

  // Clean channelId (ensure it starts with @ if it's a username)
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

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return {
        success: false,
        message: result.description || 'فشل إرسال المنشور إلى التيليجرام. تأكد من صحة التوكن وإضافة البوت مشرفاً (Admin) في القناة.',
      };
    }

    return {
      success: true,
      message: 'تم نشر الإعلان بنجاح في قناة التيليجرام! 🎉',
      data: result.result,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `خطأ في الاتصال بخوادم تيليجرام: ${err?.message || err}`,
    };
  }
}
