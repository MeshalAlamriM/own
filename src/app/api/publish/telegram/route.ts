import { NextRequest, NextResponse } from 'next/server';
import { getJobById } from '@/data/store';
import { sendTelegramBroadcast } from '@/lib/broadcast';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, botToken, channelId, siteUrl } = body;

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

    // Determine botToken and channelId from body or server environment variables
    const activeToken = botToken || process.env.TELEGRAM_BOT_TOKEN;
    const activeChannel = channelId || process.env.TELEGRAM_CHANNEL_ID;

    if (!activeToken || !activeChannel) {
      return NextResponse.json(
        {
          success: false,
          error: 'يرجى إدخال توكن البوت (Bot Token) ومعرف القناة (Channel ID) في إعدادات النشر أو كمتغيرات بيئة.',
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
