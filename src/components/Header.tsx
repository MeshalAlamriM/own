'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Briefcase, 
  Bookmark, 
  Send, 
  MessageSquare, 
  Menu, 
  X, 
  Flame, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Laptop, 
  CheckCircle,
  Bell
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
        setSavedCount(saved.length);
      } catch {
        // ignore
      }
    };

    updateCount();
    window.addEventListener('bookmarks_updated', updateCount);
    return () => window.removeEventListener('bookmarks_updated', updateCount);
  }, []);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/jobs?sector=government', label: 'وظائف حكومية', icon: ShieldCheck },
    { href: '/jobs?sector=military', label: 'وظائف عسكرية', icon: Flame },
    { href: '/jobs?sector=corporate', label: 'وظائف الشركات', icon: Building2 },
    { href: '/training', label: 'تدريب وتأهيل', icon: GraduationCap },
    { href: '/results', label: 'نتائج القبول', icon: CheckCircle },
    { href: '/jobs?sector=remote', label: 'وظائف عن بُعد', icon: Laptop },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      {/* Top micro bar for channels & breaking news */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              تحديث مستمر 24/7
            </span>
            <span className="text-slate-600">|</span>
            <span>البوابة الشاملة للوظائف والتدريب ونتائج القبول في السعودية</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>قناة التيليجرام (500k+)</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>قناة الواتساب</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-gray-900 tracking-tight">وظيفتك</span>
                <span className="text-2xl font-black text-emerald-600">اليوم</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">السعودية</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">أكبر منصة لأخبار الوظائف ونتائج القبول</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-black'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action buttons (Saved jobs & Telegram channel) */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/saved"
              className="relative p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition"
              title="الوظائف المحفوظة"
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </Link>

            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>قناة التيليجرام</span>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/saved"
              className="relative p-2 rounded-lg border border-gray-200 text-gray-700"
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {Icon && <Icon className="w-4 h-4 text-emerald-600" />}
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-xs transition"
            >
              <Send className="w-4 h-4" />
              <span>انضم لقناة الوظائف على التيليجرام</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
