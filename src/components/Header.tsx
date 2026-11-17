'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bookmark,
  Send,
  Menu,
  X,
  Search,
  ArrowUpLeft,
  ShieldCheck,
  Flame,
  Building2,
  GraduationCap,
  CheckCircle2,
  Laptop,
  Home,
  CornerDownLeft,
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/jobs?sector=government', label: 'حكومية', icon: ShieldCheck },
  { href: '/jobs?sector=military', label: 'عسكرية', icon: Flame },
  { href: '/jobs?sector=corporate', label: 'شركات', icon: Building2 },
  { href: '/training', label: 'تدريب', icon: GraduationCap },
  { href: '/results', label: 'نتائج القبول', icon: CheckCircle2 },
  { href: '/jobs?sector=remote', label: 'عن بُعد', icon: Laptop },
];

const quickSearches = ['أرامكو', 'الحرس الوطني', 'ثانوية', 'نسائية', 'الرياض', 'جدارات'];

function LogoMark({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-[14px] bg-ink-950 text-saffron-400 font-bold shrink-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-saffron-400/20 blur-md" />
      <span className="relative text-[22px] leading-none -mt-0.5">و</span>
      <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-saffron-400" />
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [savedCount, setSavedCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Saved jobs counter
  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch {
        setSavedCount(0);
      }
    };
    updateCount();
    window.addEventListener('bookmarks_updated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('bookmarks_updated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close overlays on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Lock body scroll while an overlay is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, searchOpen]);

  // Keyboard: Ctrl/Cmd+K opens search, Esc closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  const submitSearch = useCallback(
    (value: string) => {
      const q = value.trim();
      setSearchOpen(false);
      setSearchValue('');
      router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : '/jobs');
    },
    [router]
  );

  const isActive = (href: string) => {
    const linkPath = href.split('?')[0];
    if (linkPath === '/') return pathname === '/';
    if (linkPath === '/jobs') return false; // sector links share /jobs; avoid highlighting all of them
    return pathname === linkPath || pathname.startsWith(`${linkPath}/`);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_10px_30px_-12px_rgba(20,24,36,0.25)]' : ''
        }`}
      >
        {/* Live ticker strip */}
        <div className="hidden sm:block bg-ink-950 text-ink-300 text-[12px] grain">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-6">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-400" />
              </span>
              <span className="font-semibold text-saffron-300 shrink-0">مباشر</span>
              <span className="text-ink-600">/</span>
              <span className="truncate">نرصد إعلانات الوظائف الرسمية ونحدّثها على مدار الساعة</span>
            </div>

            <div className="flex items-center gap-5 shrink-0">
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>تيليجرام</span>
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2a9.9 9.9 0 0 0-8.43 15.12L2 22l5-1.58A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.34-2 1.4-.52.06-1.17.09-1.9-.12a17 17 0 0 1-1.72-.63c-3.03-1.31-5-4.37-5.15-4.57-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.6-.38.8-.38h.58c.19 0 .43-.07.67.5.25.6.84 2.08.91 2.23.08.15.12.33.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.18.3.78 1.28 1.67 2.07 1.14 1.02 2.1 1.34 2.4 1.49.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.08.12.08.72-.17 1.42Z" />
                </svg>
                <span>واتساب</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="bg-paper/85 backdrop-blur-xl border-b border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 h-[68px]">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="وظيفتك اليوم - الرئيسية">
                <LogoMark className="w-11 h-11 group-hover:rotate-[-6deg] transition-transform duration-300" />
                <span className="leading-none">
                  <span className="block text-[19px] font-bold text-ink-950 tracking-tight">
                    وظيفتك <span className="text-saffron-600">اليوم</span>
                  </span>
                  <span className="block text-[11px] text-ink-500 mt-1.5 font-medium">
                    وظائف · تدريب · نتائج قبول
                  </span>
                </span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-0.5" aria-label="التنقل الرئيسي">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative px-3.5 py-2 text-[14px] font-semibold rounded-lg transition-colors ${
                        active ? 'text-ink-950' : 'text-ink-500 hover:text-ink-950 hover:bg-ink-950/[0.04]'
                      }`}
                    >
                      {link.label}
                      {active && (
                        <span className="absolute inset-x-3.5 -bottom-[13px] h-[3px] rounded-t-full bg-saffron-500" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="hidden md:inline-flex items-center gap-2.5 h-10 ps-3 pe-2 rounded-xl border border-line bg-white text-ink-500 hover:border-ink-300 hover:text-ink-800 transition-colors min-w-[190px]"
                  aria-label="بحث"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-[13px] flex-1 text-start">ابحث عن وظيفة…</span>
                  <kbd className="hidden xl:inline-flex items-center h-6 px-1.5 rounded-md bg-paper-2 border border-line text-[11px] font-medium text-ink-500" dir="ltr">
                    Ctrl K
                  </kbd>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-line bg-white text-ink-700"
                  aria-label="بحث"
                >
                  <Search className="w-[18px] h-[18px]" />
                </button>

                <Link
                  href="/saved"
                  className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-line bg-white text-ink-700 hover:border-ink-300 hover:text-ink-950 transition-colors"
                  aria-label={`الوظائف المحفوظة${savedCount ? ` (${savedCount})` : ''}`}
                  title="الوظائف المحفوظة"
                >
                  <Bookmark className="w-[18px] h-[18px]" />
                  {savedCount > 0 && (
                    <span className="absolute -top-1.5 -start-1.5 min-w-[20px] h-5 px-1 rounded-full bg-saffron-500 text-ink-950 text-[11px] font-bold flex items-center justify-center ring-2 ring-paper">
                      {savedCount}
                    </span>
                  )}
                </Link>

                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-ink-950 text-white text-[13px] font-semibold hover:bg-ink-800 transition-colors"
                >
                  <span>اشترك بالتنبيهات</span>
                  <ArrowUpLeft className="w-4 h-4 text-saffron-400" />
                </a>

                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ink-950 text-white"
                  aria-label="فتح القائمة"
                  aria-expanded={mobileOpen}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="القائمة">
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 bottom-0 right-0 w-[86%] max-w-sm bg-paper shadow-2xl flex flex-col animate-slide-down">
            <div className="flex items-center justify-between h-[68px] px-5 border-b border-line">
              <div className="flex items-center gap-3">
                <LogoMark className="w-10 h-10" />
                <span className="text-[17px] font-bold text-ink-950">
                  وظيفتك <span className="text-saffron-600">اليوم</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 rounded-xl border border-line bg-white flex items-center justify-center text-ink-700"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-colors ${
                      active ? 'bg-ink-950 text-white' : 'text-ink-800 hover:bg-paper-2'
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        active ? 'bg-white/10 text-saffron-400' : 'bg-white border border-line text-ink-600'
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-line space-y-2.5">
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-saffron-400 text-ink-950 text-[14px] font-bold hover:bg-saffron-300 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>اشترك بتنبيهات الوظائف</span>
              </a>
              <Link
                href="/saved"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-line bg-white text-ink-800 text-[14px] font-semibold"
              >
                <Bookmark className="w-4 h-4" />
                <span>وظائفي المحفوظة{savedCount > 0 ? ` (${savedCount})` : ''}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="بحث">
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-line overflow-hidden animate-slide-down">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(searchValue);
              }}
              className="flex items-center gap-3 px-4 h-14 border-b border-line"
            >
              <Search className="w-5 h-5 text-ink-400 shrink-0" />
              <input
                ref={searchInputRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="ابحث بمسمى وظيفي أو جهة أو مدينة…"
                className="flex-1 h-full bg-transparent outline-none text-[15px] text-ink-900 placeholder:text-ink-400"
                aria-label="كلمة البحث"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-ink-950 text-white text-[12px] font-semibold"
              >
                <span>بحث</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-saffron-400" />
              </button>
            </form>

            <div className="p-4">
              <p className="text-[12px] font-semibold text-ink-500 mb-3">الأكثر بحثاً</p>
              <div className="flex flex-wrap gap-2">
                {quickSearches.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => submitSearch(kw)}
                    className="h-8 px-3 rounded-full border border-line bg-paper text-[13px] font-medium text-ink-700 hover:border-saffron-400 hover:bg-saffron-50 transition-colors"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
