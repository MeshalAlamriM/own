'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Search, Sparkles } from 'lucide-react';
import { BLOG_CATEGORIES } from '@/types/blog';
import type { BlogPost } from '@/types/blog';
import { isSafeBlogImageUrl } from '@/lib/blog-shared';

function formatDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('ar-SA', { dateStyle: 'long' }).format(date);
}

function CoverImage({ post, className }: { post: BlogPost; className: string }) {
  if (!isSafeBlogImageUrl(post.coverImage)) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-ink-900 via-ink-800 to-saffron-700`}>
        <span className="text-5xl font-black text-white/80">{post.category.slice(0, 1)}</span>
      </div>
    );
  }

  return (
    <Image
      src={post.coverImage}
      alt={post.title}
      fill
      unoptimized
      sizes="(max-width: 768px) 100vw, 50vw"
      className={`${className} object-cover`}
    />
  );
}

export default function BlogBrowser({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<string>('الكل');
  const [search, setSearch] = useState('');
  const filteredPosts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('ar');
    return posts.filter((post) => {
      const matchesCategory = category === 'الكل' || post.category === category;
      const matchesSearch = !query || `${post.title} ${post.excerpt} ${post.category}`.toLocaleLowerCase('ar').includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, posts, search]);
  const featuredPost = filteredPosts.find((post) => post.featured);

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['الكل', ...BLOG_CATEGORIES].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                category === item ? 'bg-ink-950 text-white' : 'border border-line bg-paper text-ink-600 hover:border-saffron-400'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="flex h-11 min-w-56 items-center gap-2 rounded-xl border border-line bg-paper px-3 text-ink-500 sm:max-w-xs">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث في المقالات"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
          />
        </label>
      </div>

      {featuredPost && (
        <Link href={`/blog/${featuredPost.slug}`} className="group grid overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition hover:shadow-lift md:grid-cols-2">
          <div className="relative min-h-56 md:min-h-80">
            <CoverImage post={featuredPost} className="absolute inset-0 transition duration-500 group-hover:scale-[1.03]" />
            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-saffron-400 px-3 py-1.5 text-xs font-black text-ink-950">
              <Sparkles className="h-3.5 w-3.5" />
              مقال مميز
            </span>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <span className="text-sm font-bold text-saffron-700">{featuredPost.category}</span>
            <h2 className="mt-3 text-2xl font-black leading-relaxed text-ink-950 sm:text-3xl">{featuredPost.title}</h2>
            <p className="mt-3 line-clamp-3 leading-8 text-ink-600">{featuredPost.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs text-ink-400">
              <CalendarDays className="h-4 w-4" />
              {formatDate(featuredPost.publishedAt)}
            </span>
          </div>
        </Link>
      )}

      {filteredPosts.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.filter((post) => post.id !== featuredPost?.id).map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <div className="relative h-48 overflow-hidden">
                <CoverImage post={post} className="absolute inset-0 transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-saffron-700">{post.category}</span>
                  <span className="text-ink-400">{formatDate(post.publishedAt)}</span>
                </div>
                <h2 className="mt-3 line-clamp-2 text-lg font-black leading-relaxed text-ink-950">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-7 text-ink-500">{post.excerpt}</p>
                <span className="mt-4 inline-block text-sm font-bold text-ink-800 group-hover:text-saffron-700">اقرأ المقال ←</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-black text-ink-900">{posts.length ? 'لا توجد مقالات تطابق بحثك' : 'قريباً: مقالات ونصائح مهنية'}</h2>
          <p className="mt-2 text-sm leading-7 text-ink-500">
            {posts.length ? 'جرّب كلمة بحث أو تصنيفاً مختلفاً.' : 'نعمل على إعداد محتوى يساعدك في رحلتك المهنية.'}
          </p>
        </div>
      )}
    </section>
  );
}
