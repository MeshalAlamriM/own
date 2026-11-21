import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteUrl } from '@/lib/site';

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

const siteUrl = getSiteUrl();
const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID?.trim();
const isGoogleTagManager = googleTagId?.startsWith('GTM-');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
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
    canonical: siteUrl,
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
        {googleTagId && (
          <>
            {isGoogleTagManager ? (
              <>
                <Script id="google-tag-manager" strategy="afterInteractive">
                  {`window.dataLayer = window.dataLayer || [];
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${googleTagId.replace(/[^A-Za-z0-9-]/g, '')}');`}
                </Script>
                <noscript>
                  <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(googleTagId)}`}
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                  />
                </noscript>
              </>
            ) : (
              <>
                <Script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagId)}`}
                  strategy="afterInteractive"
                />
                <Script id="google-tag" strategy="afterInteractive">
                  {`window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleTagId.replace(/[^A-Za-z0-9-]/g, '')}');`}
                </Script>
              </>
            )}
          </>
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
