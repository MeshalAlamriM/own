'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';

const quick = [
  { label: 'وظائف عسكرية', href: '/jobs?sector=military' },
  { label: 'ثانوية فما دون', href: '/jobs?qualification=ثانوية' },
  { label: 'وظائف نسائية', href: '/jobs?gender=female' },
  { label: 'عن بُعد', href: '/jobs?sector=remote' },
  { label: 'أرامكو', href: '/jobs?q=أرامكو' },
];

export default function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : '/jobs');
  };

  return (
    <div>
      <form
        onSubmit={submit}
        role="search"
        className="flex items-center gap-2 p-2 rounded-2xl bg-white border border-line shadow-lift focus-within:ring-4 focus-within:ring-saffron-200 focus-within:border-saffron-500 transition"
      >
        <Search className="w-5 h-5 text-ink-400 ms-3 shrink-0" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ابحث بمسمى وظيفي أو جهة…"
          aria-label="ابحث عن وظيفة"
          className="flex-1 min-w-0 h-12 bg-transparent outline-none text-[15px] text-ink-900 placeholder:text-ink-400"
        />
        <button
          type="submit"
          className="h-12 px-5 sm:px-7 inline-flex items-center gap-2 rounded-xl bg-ink-950 text-white text-[14px] font-semibold hover:bg-ink-800 transition-colors shrink-0"
        >
          <span>ابحث</span>
          <ArrowLeft className="w-4 h-4 text-saffron-400" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] text-ink-500 font-medium">الأكثر طلباً:</span>
        {quick.map((q) => (
          <a
            key={q.label}
            href={q.href}
            className="h-8 px-3 inline-flex items-center rounded-full border border-line bg-white/70 text-[13px] font-medium text-ink-700 hover:border-saffron-400 hover:bg-saffron-50 transition-colors"
          >
            {q.label}
          </a>
        ))}
      </div>
    </div>
  );
}
