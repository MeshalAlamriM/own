import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const plex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0b0e17',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://wadhaef-alyoum.sa'),
  title: {
    default: 'وظيفتك اليوم | أخبار الوظائف الحكومية والعسكرية والشركات بالمملكة',
    template: '%s | وظيفتك اليوم',
  },
  description: 'البوابة السعودية الأولى لأحدث أخبار الوظائف الحكومية والمدنية، وظائف وزارة الدفاع والداخلية والحرس الوطني، وظائف الشركات الكبرى (أرامكو، نيوم، سابك)، برامج التدريب ونتائج القبول.',
  keywords: [
    'وظائف السعودية',
    'وظائف عسكرية',
    'وظائف حكومية',
    'أبشر توظيف',
    'جدارات',
    'وظائف أرامكو',
    'وظائف اليوم',
    'نتائج القبول',
    'وظائف عن بعد',
    'وظائف بشهادة الثانوية',
    'وظائف دبلوم وبكالوريوس',
    'وظائف الرياض',
    'وظائف جدة'
  ],
  authors: [{ name: 'وظيفتك اليوم' }],
  creator: 'وظيفتك اليوم',
  publisher: 'وظيفتك اليوم',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://wadhaef-alyoum.sa',
    siteName: 'وظيفتك اليوم',
    title: 'وظيفتك اليوم | أخبار الوظائف الحكومية والعسكرية ونتائج القبول',
    description: 'تابع جديد الوظائف المدنية والعسكرية والشركات وبرامج التدريب المنتهي بالتوظيف لحظة بلحظة.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'منصة وظيفتك اليوم',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'وظيفتك اليوم | أحدث أخبار التوظيف بالمملكة',
    description: 'تغطية فورية وشاملة للوظائف العسكرية، الحكومية، والشركات مع روابط التقديم المباشر.',
    creator: '@wadhaef_sa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://wadhaef-alyoum.sa',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={plex.variable}>
      <body className="min-h-screen flex flex-col font-sans bg-paper text-ink-900">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
