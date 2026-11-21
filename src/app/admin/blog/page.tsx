'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpenText, Eye, FilePlus2, FileText, LoaderCircle, Pencil, Plus, Search, Send, Star, Trash2 } from 'lucide-react';
import { BLOG_CATEGORIES } from '@/types/blog';
import type { BlogPost, BlogPostInput, BlogPostStatus } from '@/types/blog';
import { slugifyBlogTitle, isSafeBlogImageUrl } from '@/lib/blog-shared';

type FormState = Omit<BlogPostInput, 'status' | 'featured'> & {
  status: BlogPostStatus;
  featured: boolean;
};

const EMPTY_FORM: FormState = {
  slug: '',
  title: '',
  category: BLOG_CATEGORIES[0],
  excerpt: '',
  content: '',
  coverImage: '',
  status: 'draft',
  featured: false,
};

export default function AdminBlogPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | BlogPostStatus>('all');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/blog');
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'تعذر تحميل المقالات');
      setPosts(data.data as BlogPost[]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذر تحميل المقالات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/admin/session')
      .then((response) => response.json())
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) void loadPosts();
        else setLoading(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      });
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ar');
    return posts.filter((post) => {
      const matchesStatus = filter === 'all' || post.status === filter;
      const matchesQuery = !needle || `${post.title} ${post.category} ${post.slug}`.toLocaleLowerCase('ar').includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [filter, posts, query]);

  const publishedCount = posts.filter((post) => post.status === 'published').length;
  const draftCount = posts.length - publishedCount;

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'تعذر تسجيل الدخول');
      setAuthenticated(true);
      setPassword('');
      await loadPosts();
    } catch (cause) {
      setLoginError(cause instanceof Error ? cause.message : 'تعذر تسجيل الدخول');
    }
  }

  function startNewPost() {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setError('');
  }

  function startEditing(post: BlogPost) {
    setEditingPost(post);
    setForm({
      slug: post.slug,
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      status: post.status,
      featured: post.featured,
    });
    setError('');
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, slug: form.slug || slugifyBlogTitle(form.title) };
      const response = await fetch(editingPost ? `/api/admin/blog/${editingPost.id}` : '/api/admin/blog', {
        method: editingPost ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'تعذر حفظ المقال');
      await loadPosts();
      setEditingPost(data.data as BlogPost);
      setForm({
        ...payload,
        slug: (data.data as BlogPost).slug,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذر حفظ المقال');
    } finally {
      setSaving(false);
    }
  }

  async function uploadCoverImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    try {
      const uploadData = new FormData();
      uploadData.set('file', file);
      const response = await fetch('/api/admin/blog/upload-image', {
        method: 'POST',
        body: uploadData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'تعذر رفع الصورة');
      setForm((current) => ({ ...current, coverImage: data.url }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذر رفع الصورة');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  }

  async function deletePost(post: BlogPost) {
    if (!window.confirm(`هل تريد حذف مقال «${post.title}» نهائياً؟`)) return;
    setError('');
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'تعذر حذف المقال');
      if (editingPost?.id === post.id) startNewPost();
      await loadPosts();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذر حذف المقال');
    }
  }

  if (authenticated === null || (authenticated && loading && !posts.length)) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center text-ink-500">
        <LoaderCircle className="h-6 w-6 animate-spin" />
        <span className="mr-3">جارٍ تحميل لوحة المدونة...</span>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-paper px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-lift">
          <BookOpenText className="mx-auto h-12 w-12 text-saffron-600" />
          <h1 className="mt-4 text-2xl font-black text-ink-950">إدارة المدونة</h1>
          <p className="mt-2 text-sm text-ink-500">سجّل الدخول ببيانات لوحة الإدارة للمتابعة.</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              placeholder="كلمة مرور الإدارة"
              className="h-12 w-full rounded-xl border border-line bg-paper px-4 text-center outline-none focus:border-saffron-500"
            />
            {loginError && <p role="alert" className="text-sm font-semibold text-rose-700">{loginError}</p>}
            <button className="h-12 w-full rounded-xl bg-ink-950 font-bold text-white transition hover:bg-ink-800">دخول لوحة المدونة</button>
          </form>
          <Link href="/admin" className="mt-5 inline-block text-sm font-bold text-ink-500 hover:text-ink-950">العودة إلى لوحة الإدارة</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-16">
      <div className="bg-ink-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <Link href="/admin" className="mb-2 inline-flex items-center gap-1 text-xs text-ink-300 hover:text-white"><ArrowRight className="h-3.5 w-3.5" /> لوحة الإدارة</Link>
            <h1 className="text-2xl font-black sm:text-3xl">إدارة المدونة</h1>
            <p className="mt-1 text-sm text-ink-300">أنشئ مقالاتك، احفظها كمسودات، وانشرها للزوار.</p>
          </div>
          <Link href="/blog" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-ink-700 px-4 py-2.5 text-sm font-bold text-white hover:border-saffron-400">
            <Eye className="h-4 w-4 text-saffron-400" /> معاينة المدونة
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6 lg:px-8">
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">{error}</p>}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="كل المقالات" value={posts.length} icon={<FileText className="h-5 w-5" />} />
          <StatCard label="منشورة" value={publishedCount} icon={<Send className="h-5 w-5" />} />
          <StatCard label="مسودات" value={draftCount} icon={<Pencil className="h-5 w-5" />} />
          <StatCard label="إجمالي مشاهدات المقالات" value={posts.reduce((total, post) => total + post.viewsCount, 0)} icon={<Eye className="h-5 w-5" />} />
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(350px,0.9fr)]">
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
              <div>
                <h2 className="text-lg font-black text-ink-950">مقالات المدونة</h2>
                <p className="mt-1 text-xs text-ink-500">إدارة المقالات المنشورة والمسودات</p>
              </div>
              <button type="button" onClick={startNewPost} className="inline-flex h-10 items-center gap-2 rounded-xl bg-saffron-400 px-4 text-sm font-black text-ink-950 hover:bg-saffron-300">
                <Plus className="h-4 w-4" /> مقال جديد
              </button>
            </div>
            <div className="flex flex-col gap-3 border-b border-line bg-paper/60 p-4 sm:flex-row">
              <label className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 text-ink-400">
                <Search className="h-4 w-4" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بعنوان المقال أو رابطه" className="w-full bg-transparent text-sm text-ink-800 outline-none" />
              </label>
              <select value={filter} onChange={(event) => setFilter(event.target.value as 'all' | BlogPostStatus)} className="h-10 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink-700">
                <option value="all">كل الحالات</option>
                <option value="published">منشورة</option>
                <option value="draft">مسودات</option>
              </select>
            </div>
            <div className="divide-y divide-line">
              {loading ? (
                <div className="p-8 text-center text-sm text-ink-500">جارٍ تحديث المقالات...</div>
              ) : filteredPosts.length ? filteredPosts.map((post) => (
                <div key={post.id} className="flex items-start gap-3 p-4 sm:gap-4 sm:p-5">
                  <div className="relative hidden h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-paper-2 sm:block">
                    {isSafeBlogImageUrl(post.coverImage) && <Image src={post.coverImage} alt="" fill unoptimized sizes="80px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{post.status === 'published' ? 'منشور' : 'مسودة'}</span>
                      <span className="text-xs text-ink-400">{post.category}</span>
                      {post.featured && <Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-500" aria-label="مقال مميز" />}
                    </div>
                    <h3 className="mt-2 truncate font-black text-ink-900">{post.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="truncate text-xs text-ink-400" dir="ltr">/blog/{post.slug}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500">
                        <Eye className="h-3.5 w-3.5" />
                        {post.viewsCount.toLocaleString('ar-SA')} مشاهدة
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {post.status === 'published' && <Link href={`/blog/${post.slug}`} target="_blank" aria-label="معاينة المقال" className="rounded-lg p-2 text-ink-400 hover:bg-paper hover:text-ink-900"><Eye className="h-4 w-4" /></Link>}
                    <button type="button" onClick={() => startEditing(post)} aria-label="تعديل المقال" className="rounded-lg p-2 text-ink-400 hover:bg-paper hover:text-ink-900"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => void deletePost(post)} aria-label="حذف المقال" className="rounded-lg p-2 text-ink-400 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-sm text-ink-500">
                  <FilePlus2 className="mx-auto mb-3 h-8 w-8 text-ink-300" />
                  {posts.length ? 'لا توجد مقالات مطابقة للبحث.' : 'ابدأ بكتابة أول مقال في المدونة.'}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={savePost} className="space-y-4 rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-ink-950">{editingPost ? 'تعديل المقال' : 'كتابة مقال جديد'}</h2>
                <p className="mt-1 text-xs text-ink-500">المحتوى نصي آمن؛ استخدم سطراً فارغاً للفصل بين الفقرات.</p>
              </div>
              {editingPost && <button type="button" onClick={startNewPost} className="text-xs font-bold text-ink-500 hover:text-ink-900">إلغاء التعديل</button>}
            </div>

            <Field label="عنوان المقال" required>
              <input required minLength={4} maxLength={180} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={inputClass} placeholder="مثال: كيف تكتب سيرة ذاتية احترافية؟" />
            </Field>
            <Field label="الرابط المختصر" hint="يُنشأ تلقائياً من العنوان عند تركه فارغاً">
              <input dir="ltr" maxLength={120} value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className={`${inputClass} text-left`} placeholder={slugifyBlogTitle(form.title) || 'resume-writing-guide'} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="التصنيف" required>
                <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as BlogPostInput['category'] })} className={inputClass}>
                  {BLOG_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </Field>
              <Field label="حالة المقال">
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as BlogPostStatus })} className={inputClass}>
                  <option value="draft">مسودة</option>
                  <option value="published">نشر المقال</option>
                </select>
              </Field>
            </div>
            <Field label="ملخص المقال" required hint={`${form.excerpt.length}/320`}>
              <textarea required minLength={10} maxLength={320} rows={3} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className={inputClass} placeholder="اكتب وصفاً موجزاً يظهر في نتائج البحث وبطاقة المقال." />
            </Field>
            <Field label="صورة الغلاف" hint="ارفع صورة أو أدخل رابط HTTPS">
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={uploadCoverImage}
                  disabled={uploadingImage}
                  className={`${inputClass} file:ml-3 file:rounded-lg file:border-0 file:bg-saffron-100 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-ink-900`}
                />
                <p className="text-xs leading-5 text-ink-400">JPG أو PNG أو WEBP، بحد أقصى 5MB. يتم الرفع الآمن إلى خادم الصور.</p>
                <input dir="ltr" type="text" value={form.coverImage} onChange={(event) => setForm({ ...form, coverImage: event.target.value })} className={`${inputClass} text-left`} placeholder="https://example.com/image.jpg" />
              </div>
            </Field>
            {uploadingImage && (
              <p role="status" className="flex items-center gap-2 text-sm font-semibold text-ink-600">
                <LoaderCircle className="h-4 w-4 animate-spin" /> جارٍ رفع الصورة إلى الخادم...
              </p>
            )}
            {isSafeBlogImageUrl(form.coverImage) && (
              <div className="relative h-36 overflow-hidden rounded-xl bg-paper-2">
                <Image src={form.coverImage} alt="معاينة صورة الغلاف" fill unoptimized sizes="500px" className="object-cover" />
              </div>
            )}
            <Field label="محتوى المقال" required hint={`${form.content.length}/50000`}>
              <textarea required minLength={40} maxLength={50000} rows={12} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className={`${inputClass} resize-y leading-8`} placeholder="اكتب المقال هنا. افصل بين الفقرات بسطر فارغ." />
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-700">
              <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} className="h-4 w-4 accent-amber-500" />
              <Star className="h-4 w-4 text-saffron-600" /> إبراز المقال في أعلى المدونة
            </label>
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={saving} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-black text-white hover:bg-ink-800 disabled:opacity-60">
                {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {saving ? 'جارٍ الحفظ...' : form.status === 'published' ? 'حفظ ونشر المقال' : 'حفظ كمسودة'}
              </button>
              <button type="button" onClick={startNewPost} className="h-11 rounded-xl border border-line px-4 text-sm font-bold text-ink-600 hover:bg-paper">تفريغ النموذج</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

const inputClass = 'w-full rounded-xl border border-line bg-paper/60 px-3.5 py-3 text-sm text-ink-900 outline-none transition focus:border-saffron-500 focus:bg-white';

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between gap-2 text-xs font-bold text-ink-700">
        <span>{label}{required && <span className="text-rose-600"> *</span>}</span>
        {hint && <span className="font-normal text-ink-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 shadow-soft">
      <div>
        <p className="text-sm font-semibold text-ink-500">{label}</p>
        <p className="mt-1 text-3xl font-black text-ink-950">{value}</p>
      </div>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-saffron-100 text-saffron-700">{icon}</span>
    </div>
  );
}
