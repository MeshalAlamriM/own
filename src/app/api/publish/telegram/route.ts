import { NextRequest, NextResponse } from 'next/server';
import { getJobById } from '@/data/store';
import { sendTelegramBroadcast } from '@/lib/broadcast';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بهذه العملية' }, { status: 401 });
    }
    const body = await request.json();
    const { jobId, siteUrl } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'معرف الوظيفة مطلوب' },
        { status: 400 }
      );
    }

    const job = await getJobById(jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على الوظيفة المطلوبة' },
        { status: 404 }
      );
    }

    // Keep Telegram credentials on the server; never accept them from the browser.
    const activeToken = process.env.TELEGRAM_BOT_TOKEN;
    const activeChannel = process.env.TELEGRAM_CHANNEL_ID;

    if (!activeToken || !activeChannel) {
      return NextResponse.json(
        {
          success: false,
          error: 'إعدادات Telegram غير مكتملة في Vercel. أضف TELEGRAM_BOT_TOKEN و TELEGRAM_CHANNEL_ID ثم نفّذ Redeploy.',
        },
        { status: 400 }
      );
    }

    const effectiveSiteUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://wadhaef-alyoum.sa';

    const result = await sendTelegramBroadcast(job, activeToken, activeChannel, effectiveSiteUrl);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    await recordAuditLog('publish_telegram', job.id, { title: job.title, company: job.company });

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error('Error publishing to Telegram:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'حدث خطأ غير متوقع أثناء النشر' },
      { status: 500 }
    );
  }
}
