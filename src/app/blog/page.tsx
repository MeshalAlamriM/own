import type { Metadata } from 'next';
import { BookOpenCheck, BriefcaseBusiness, Sparkles } from 'lucide-react';
import BlogBrowser from '@/components/BlogBrowser';
import { getPublishedBlogPosts } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'المدونة المهنية',
  description: 'مقالات ونصائح عملية عن الوظائف، كتابة السيرة الذاتية، المقابلات، والتطوير المهني في السعودية.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  let loadError = false;
  try {
    posts = await getPublishedBlogPosts();
  } catch (error) {
    console.error('Blog page load error:', error);
    loadError = true;
  }

  return (
    <div className="min-h-screen pb-20">
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 dots [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div className="absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-saffron-200/50 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink-600">
            <BookOpenCheck className="h-4 w-4 text-saffron-600" />
            مدونة وظيفتك اليوم
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-ink-950 sm:text-5xl">
            معرفة مهنية تقرّبك من <span className="marker">فرصتك القادمة</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-600 sm:text-lg">
            أدلة ونصائح تساعدك على الاستعداد للوظائف، تحسين سيرتك الذاتية، واجتياز المقابلات بثقة.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-ink-700">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-soft"><BriefcaseBusiness className="h-4 w-4 text-saffron-600" /> إرشادات لسوق العمل</span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-soft"><Sparkles className="h-4 w-4 text-saffron-600" /> محتوى عملي ومتجدد</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
        {loadError && (
          <p role="status" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-800">
            تعذر تحميل المقالات حالياً. يرجى المحاولة لاحقاً.
          </p>
        )}
        <BlogBrowser posts={posts} />
      </div>
    </div>
  );
}
