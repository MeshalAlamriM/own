import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays } from 'lucide-react';
import BlogArticleContent from '@/components/BlogArticleContent';
import BlogViewCounter from '@/components/BlogViewCounter';
import { getPublishedBlogPost } from '@/lib/blog';
import { isSafeBlogImageUrl } from '@/lib/blog-shared';

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return { title: 'المقال غير موجود' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

function formatDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('ar-SA', { dateStyle: 'long' }).format(date);
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-ink-500 transition hover:text-ink-950">
        <ArrowRight className="h-4 w-4" />
        العودة إلى المدونة
      </Link>

      <header className="mt-8">
        <span className="inline-flex rounded-full bg-saffron-100 px-3 py-1.5 text-xs font-bold text-ink-800">{post.category}</span>
        <h1 className="mt-5 text-3xl font-black leading-relaxed text-ink-950 sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg leading-9 text-ink-600">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm text-ink-400">
          <CalendarDays className="h-4 w-4" />
          {formatDate(post.publishedAt)}
        </span>
        <div className="mt-3">
          <BlogViewCounter slug={post.slug} initialViews={post.viewsCount} />
        </div>
      </header>

      {isSafeBlogImageUrl(post.coverImage) && (
        <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-3xl bg-paper-2">
          <Image src={post.coverImage} alt={post.title} fill unoptimized priority sizes="(max-width: 768px) 100vw, 896px" className="object-cover" />
        </div>
      )}

      <div className="mt-10 border-t border-line pt-8">
        <BlogArticleContent content={post.content} />
      </div>
    </article>
  );
}
