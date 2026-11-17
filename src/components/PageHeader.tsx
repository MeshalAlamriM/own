import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** محتوى إضافي أسفل الوصف (أزرار، أرقام…) */
  children?: ReactNode;
  /** عرض مضغوط للصفحات النصية */
  compact?: boolean;
}

/** ترويسة موحدة للصفحات الداخلية */
export default function PageHeader({ eyebrow, title, description, icon: Icon, children, compact = false }: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-white grain">
      <div className="absolute inset-0 -z-10 opacity-[0.55] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_75%)]" />
      <div className="absolute -z-10 -top-28 -left-20 w-[26rem] h-[26rem] rounded-full bg-saffron-400/20 blur-3xl" />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${compact ? 'py-10 sm:py-12' : 'py-12 sm:py-16'}`}>
        <div className="flex items-start gap-5">
          {Icon && (
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-saffron-400 text-ink-950 items-center justify-center shrink-0">
              <Icon className="w-7 h-7" />
            </div>
          )}
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-saffron-300 mb-3">
              <span className="w-6 h-px bg-saffron-400" />
              {eyebrow}
            </p>
            <h1 className="text-[28px] sm:text-[40px] font-bold leading-[1.35] tracking-tight">{title}</h1>
            {description && (
              <p className="mt-4 text-[14.5px] sm:text-[16px] text-ink-300 leading-[1.95] max-w-2xl">{description}</p>
            )}
            {children && <div className="mt-7">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
