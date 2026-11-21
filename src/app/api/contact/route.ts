import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const category = body.category === 'report' ? 'report' : 'inquiry';
    const jobUrl = typeof body.jobUrl === 'string' ? body.jobUrl.trim() : '';
    const website = typeof body.website === 'string' ? body.website.trim() : '';

    if (website) {
      return NextResponse.json({ success: true });
    }
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال اسم صحيح.' }, { status: 400 });
    }
    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال بريد إلكتروني صحيح.' }, { status: 400 });
    }
    if (subject.length < 3 || subject.length > 160) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال موضوع واضح.' }, { status: 400 });
    }
    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json({ success: false, error: 'اكتب تفاصيل الرسالة بين 10 و5000 حرف.' }, { status: 400 });
    }
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'خدمة الرسائل غير مهيأة حاليًا.' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message,
        category,
        job_url: jobUrl || null,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Contact insert error:', error);
      return NextResponse.json({ success: false, error: 'تعذر حفظ الرسالة حاليًا.' }, { status: 500 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'الموقع <onboarding@resend.dev>';
    const toEmail = process.env.CONTACT_TO_EMAIL || 'info@job2sa.com';

    if (resendKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `[${category === 'report' ? 'بلاغ إعلان' : 'رسالة موقع'}] ${subject}`,
          html: `<p><strong>الاسم:</strong> ${name}</p><p><strong>البريد:</strong> ${email}</p><p><strong>النوع:</strong> ${category === 'report' ? 'بلاغ عن إعلان' : 'استفسار'}</p>${jobUrl ? `<p><strong>رابط الإعلان:</strong> ${jobUrl}</p>` : ''}<p><strong>الرسالة:</strong><br>${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>`,
        }),
      });
      if (!emailResponse.ok) {
        console.error('Resend contact email error:', await emailResponse.text());
      }
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ غير متوقع.' }, { status: 500 });
  }
}
